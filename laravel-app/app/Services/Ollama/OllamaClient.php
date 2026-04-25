<?php

namespace App\Services\Ollama;

use App\Exceptions\OllamaResponseException;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ConnectException;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Log;

/**
 * Guzzle wrapper for the locally-running Ollama API.
 *
 * Supported endpoints:
 *  - POST /api/generate  → text generation (non-streaming)
 *  - POST /api/chat      → chat completion (non-streaming)
 *  - POST /api/embeddings → embed a string with nomic-embed-text
 *
 * All requests are logged to storage/logs/ollama.log at debug level.
 */
class OllamaClient
{
    protected Client $http;

    /** @var string Base URL of the Ollama service */
    protected string $host;

    /** @var int HTTP timeout in seconds */
    protected int $timeout;

    public function __construct()
    {
        $this->host    = rtrim(config('ollama.host', 'http://127.0.0.1:11434'), '/');
        $this->timeout = (int) config('ollama.timeout', 120);

        $this->http = new Client([
            'base_uri' => $this->host,
            'timeout'  => $this->timeout,
            'headers'  => ['Content-Type' => 'application/json', 'Accept' => 'application/json'],
        ]);
    }

    /**
     * Call /api/generate (single-turn, non-streaming).
     *
     * @param  string       $model   Ollama model name, e.g. "qwen2.5:7b".
     * @param  string       $prompt  The full prompt string.
     * @param  string|null  $format  Pass "json" to force structured output.
     * @param  array        $options Additional model parameters (temperature, top_p, …).
     * @return string|array  Raw text, or decoded array when $format === 'json'.
     *
     * @throws OllamaResponseException  When JSON format is requested but response is invalid.
     * @throws GuzzleException          On unrecoverable HTTP errors.
     */
    public function generate(
        string $model,
        string $prompt,
        ?string $format = null,
        array $options = []
    ): string|array {
        $payload = [
            'model'  => $model,
            'prompt' => $prompt,
            'stream' => false,
        ];

        if ($format !== null) {
            $payload['format'] = $format;
        }

        if (!empty($options)) {
            $payload['options'] = $options;
        }

        $this->logDebug('generate', $model, $prompt, $options);

        $raw = $this->callWithRetry('POST', '/api/generate', $payload);

        $response = json_decode($raw, true);
        $text     = $response['response'] ?? '';

        $this->logTokenUsage('generate', $response);

        if ($format === 'json') {
            return $this->parseJsonResponse($text);
        }

        return $text;
    }

    /**
     * Call /api/chat (multi-turn, non-streaming).
     *
     * @param  string       $model
     * @param  array        $messages  OpenAI-style [['role'=>'user','content'=>'…'], …]
     * @param  string|null  $format
     * @param  array        $options
     * @return string|array
     *
     * @throws OllamaResponseException
     * @throws GuzzleException
     */
    public function chat(
        string $model,
        array $messages,
        ?string $format = null,
        array $options = []
    ): string|array {
        $payload = [
            'model'    => $model,
            'messages' => $messages,
            'stream'   => false,
        ];

        if ($format !== null) {
            $payload['format'] = $format;
        }

        if (!empty($options)) {
            $payload['options'] = $options;
        }

        $promptPreview = collect($messages)->last()['content'] ?? '';
        $this->logDebug('chat', $model, $promptPreview, $options);

        $raw = $this->callWithRetry('POST', '/api/chat', $payload);

        $response = json_decode($raw, true);
        $text     = $response['message']['content'] ?? '';

        $this->logTokenUsage('chat', $response);

        if ($format === 'json') {
            return $this->parseJsonResponse($text);
        }

        return $text;
    }

    /**
     * Call /api/embeddings and return the float vector.
     *
     * @param  string  $text  The text to embed.
     * @return float[]
     *
     * @throws GuzzleException
     */
    public function embed(string $text): array
    {
        $model   = config('ollama.embed', 'nomic-embed-text');
        $payload = ['model' => $model, 'prompt' => $text];

        $this->logDebug('embed', $model, substr($text, 0, 100), []);

        $raw      = $this->callWithRetry('POST', '/api/embeddings', $payload);
        $response = json_decode($raw, true);

        return $response['embedding'] ?? [];
    }

    /**
     * Convenience method: detect the language of a short text.
     *
     * Returns a BCP-47 language code such as "ro", "de", "en", "fr", "it".
     *
     * @param  string  $text
     * @return string
     *
     * @throws OllamaResponseException
     * @throws GuzzleException
     */
    public function detectLanguage(string $text): string
    {
        $model  = config('ollama.model', 'qwen2.5:7b');
        $prompt = <<<PROMPT
Detect the language of the following text and respond with ONLY the BCP-47 language code (e.g. "ro", "de", "en", "fr", "it"). No other words.

Text: {$text}
PROMPT;

        $result = $this->generate($model, $prompt);

        return trim(strtolower((string) $result));
    }

    // -------------------------------------------------------------------------
    // Internal helpers
    // -------------------------------------------------------------------------

    /**
     * Execute an HTTP request, retrying once on connection errors.
     *
     * @throws GuzzleException
     */
    protected function callWithRetry(string $method, string $path, array $payload): string
    {
        $attempt = 0;

        retry:
        try {
            $attempt++;
            $response = $this->http->request($method, $path, ['json' => $payload]);

            return (string) $response->getBody();
        } catch (ConnectException $e) {
            if ($attempt < 2) {
                Log::channel('ollama')->warning('Ollama connection error, retrying…', [
                    'path'    => $path,
                    'attempt' => $attempt,
                    'error'   => $e->getMessage(),
                ]);
                goto retry;
            }
            throw $e;
        }
    }

    /**
     * Validate and decode a JSON response from the model.
     *
     * @throws OllamaResponseException
     */
    protected function parseJsonResponse(string $text): array
    {
        // Strip markdown code fences the model might wrap around JSON
        $clean = preg_replace('/^```(?:json)?\s*/i', '', trim($text));
        $clean = preg_replace('/\s*```$/', '', $clean);

        $decoded = json_decode($clean, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new OllamaResponseException(
                'Ollama returned invalid JSON: ' . json_last_error_msg() . '. Raw: ' . substr($text, 0, 500)
            );
        }

        return $decoded;
    }

    /** Write prompt + options to the dedicated ollama log channel. */
    protected function logDebug(string $method, string $model, string $promptPreview, array $options): void
    {
        Log::channel('ollama')->debug("[$method] model={$model}", [
            'prompt_preview' => substr($promptPreview, 0, 200),
            'options'        => $options,
        ]);
    }

    /** Log token usage from a raw Ollama response array. */
    protected function logTokenUsage(string $method, array $response): void
    {
        $eval    = $response['eval_count']     ?? null;
        $prompt  = $response['prompt_eval_count'] ?? null;

        if ($eval !== null || $prompt !== null) {
            Log::channel('ollama')->debug("[$method] tokens", [
                'prompt_tokens'     => $prompt,
                'generated_tokens'  => $eval,
            ]);
        }
    }
}
