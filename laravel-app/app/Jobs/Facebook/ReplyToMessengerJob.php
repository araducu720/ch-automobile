<?php

namespace App\Jobs\Facebook;

use App\Models\Car;
use App\Models\FacebookMessage;
use App\Models\Lead;
use App\Services\Facebook\MessengerService;
use App\Services\Ollama\OllamaClient;
use App\Services\Ollama\PromptBuilder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * ReplyToMessengerJob — responds to an incoming Messenger message.
 *
 * Flow:
 *  1. Detect the message language via OllamaClient::detectLanguage().
 *  2. Run a simple semantic search (embed the message, cosine-compare with
 *     car embeddings stored in the DB) to find relevant vehicles.
 *  3. Generate a multilingual reply + optional car carousel.
 *  4. Create a Lead if the detected intent is a purchase intent.
 *  5. Persist the outgoing message.
 */
class ReplyToMessengerJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /** @var int */
    public int $tries = 2;

    /** @var int */
    public int $timeout = 180;

    public function __construct(
        public readonly string $senderPsid,
        public readonly string $messageText,
        public readonly array  $rawPayload = []
    ) {}

    /**
     * Execute the job.
     */
    public function handle(
        OllamaClient $ollama,
        PromptBuilder $prompts,
        MessengerService $messenger
    ): void {
        // 1. Detect language
        $locale = $ollama->detectLanguage($this->messageText);
        if (strlen($locale) > 5 || $locale === '') {
            $locale = config('facebook.default_locale', 'ro');
        }

        // 2. Semantic search for relevant cars
        $carContext = $this->findRelevantCars($ollama);

        // 3. Build conversation history for context
        $history = $this->buildHistory();

        // 4. Render prompt and call Ollama
        $model  = config('facebook.ai_model');
        $prompt = $prompts->fbMessengerReply($this->messageText, $locale, $carContext, $history);
        $aiData = $ollama->generate($model, $prompt, 'json');

        $replyText = $aiData['reply'] ?? ($aiData['text'] ?? '');
        $intent    = $aiData['intent'] ?? null;
        $suggestedCarIds = $aiData['car_ids'] ?? [];

        // 5. Store incoming message
        FacebookMessage::create([
            'sender_psid' => $this->senderPsid,
            'direction'   => 'in',
            'text'        => $this->messageText,
            'locale'      => $locale,
            'intent'      => $intent,
            'raw'         => $this->rawPayload,
        ]);

        // 6. Create Lead if purchase intent detected
        if (in_array($intent, ['test_drive', 'price_offer', 'financing', 'reservation'], true)) {
            $carId = !empty($suggestedCarIds) ? (int) $suggestedCarIds[0] : null;

            Lead::create([
                'source'       => 'facebook_messenger',
                'fb_object_id' => $this->senderPsid,
                'locale'       => $locale,
                'intent'       => $intent,
                'car_id'       => $carId,
                'status'       => 'new',
            ]);
        }

        // 7. Send text reply
        $messenger->sendText($this->senderPsid, $replyText);

        // 8. Send car carousel if relevant cars found
        if (!empty($suggestedCarIds)) {
            $this->sendCarCarousel($suggestedCarIds, $messenger);
        }

        // 9. Persist outgoing message
        FacebookMessage::create([
            'sender_psid' => $this->senderPsid,
            'direction'   => 'out',
            'text'        => $replyText,
            'locale'      => $locale,
        ]);

        Log::info("[ReplyToMessengerJob] Replied to PSID {$this->senderPsid}, intent={$intent}, locale={$locale}");
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    /**
     * Find relevant cars via cosine similarity of embeddings.
     *
     * @return array<int, array<string, mixed>>
     */
    private function findRelevantCars(OllamaClient $ollama): array
    {
        try {
            $embedding = $ollama->embed($this->messageText);
        } catch (\Throwable) {
            return [];
        }

        if (empty($embedding)) {
            return [];
        }

        // Fetch published cars that have embeddings
        $cars = Car::where('status', 'published')
            ->whereNotNull('embedding')
            ->limit(50)
            ->get(['id', 'brand', 'model', 'year', 'km', 'price', 'currency', 'fuel', 'embedding']);

        $scored = [];

        foreach ($cars as $car) {
            $carEmb = $car->embedding;
            if (empty($carEmb)) {
                continue;
            }
            $similarity = $this->cosineSimilarity($embedding, $carEmb);
            $scored[]   = ['car' => $car, 'score' => $similarity];
        }

        usort($scored, fn ($a, $b) => $b['score'] <=> $a['score']);

        return array_slice(
            array_map(fn ($item) => [
                'id'    => $item['car']->id,
                'label' => "{$item['car']->brand} {$item['car']->model} {$item['car']->year}",
                'price' => $item['car']->formattedPrice(),
            ], $scored),
            0,
            5
        );
    }

    /** Cosine similarity between two float vectors. */
    private function cosineSimilarity(array $a, array $b): float
    {
        $dot = 0.0;
        $na  = 0.0;
        $nb  = 0.0;

        $len = min(count($a), count($b));

        for ($i = 0; $i < $len; $i++) {
            $dot += $a[$i] * $b[$i];
            $na  += $a[$i] ** 2;
            $nb  += $b[$i] ** 2;
        }

        $denom = sqrt($na) * sqrt($nb);

        return $denom > 0 ? $dot / $denom : 0.0;
    }

    /**
     * Build conversation history from the last 5 stored messages.
     *
     * @return array<int, array<string, string>>
     */
    private function buildHistory(): array
    {
        return FacebookMessage::where('sender_psid', $this->senderPsid)
            ->latest()
            ->limit(10)
            ->get(['direction', 'text'])
            ->reverse()
            ->map(fn ($m) => [
                'role'    => $m->direction === 'in' ? 'user' : 'assistant',
                'content' => $m->text,
            ])
            ->values()
            ->toArray();
    }

    /**
     * Send a Messenger carousel with the suggested car cards.
     *
     * @param  array<int>  $carIds
     */
    private function sendCarCarousel(array $carIds, MessengerService $messenger): void
    {
        $cars = Car::whereIn('id', $carIds)->with('photos')->get();

        if ($cars->isEmpty()) {
            return;
        }

        $cards = $cars->map(function (Car $car): array {
            $photo = $car->photos->first();

            return [
                'title'     => "{$car->brand} {$car->model} {$car->year}",
                'subtitle'  => "{$car->km} km · {$car->formattedPrice()}",
                'image_url' => $photo?->url ?? '',
                'buttons'   => [
                    [
                        'type'  => 'web_url',
                        'url'   => url('/cars/' . $car->id),
                        'title' => 'View Details',
                    ],
                ],
            ];
        })->toArray();

        try {
            $messenger->sendCarousel($this->senderPsid, $cards);
        } catch (\Throwable $e) {
            Log::warning("[ReplyToMessengerJob] Could not send carousel: {$e->getMessage()}");
        }
    }
}
