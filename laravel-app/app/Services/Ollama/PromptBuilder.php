<?php

namespace App\Services\Ollama;

use Illuminate\View\Factory as ViewFactory;

/**
 * Builds prompt strings from Blade template files stored in
 * resources/views/prompts/.
 *
 * Using Blade templates means prompts are version-controlled, easy to
 * read in plain text, and can be tuned without touching PHP code.
 */
class PromptBuilder
{
    public function __construct(protected ViewFactory $view) {}

    /**
     * Render a prompt template and return the resulting string.
     *
     * @param  string  $template  Dot-notation view name, e.g. "prompts.fb-post-listing".
     * @param  array   $data      Variables injected into the template.
     * @return string
     */
    public function render(string $template, array $data = []): string
    {
        return $this->view->make($template, $data)->render();
    }

    /**
     * Render the "fb-post-listing" prompt for a single car + locale.
     *
     * @param  \App\Models\Car  $car
     * @param  string  $locale  BCP-47 code, e.g. "ro".
     * @param  string  $tone    e.g. "professional-friendly".
     * @return string
     */
    public function fbPostListing(\App\Models\Car $car, string $locale, string $tone = 'professional-friendly'): string
    {
        return $this->render('prompts.fb-post-listing', compact('car', 'locale', 'tone'));
    }

    /**
     * Render the "fb-marketplace-vehicle" prompt.
     *
     * @param  \App\Models\Car  $car
     * @param  string  $locale
     * @return string
     */
    public function fbMarketplaceVehicle(\App\Models\Car $car, string $locale): string
    {
        return $this->render('prompts.fb-marketplace-vehicle', compact('car', 'locale'));
    }

    /**
     * Render the "fb-messenger-reply" prompt.
     *
     * @param  string  $message     Incoming customer message.
     * @param  string  $locale      Detected language of the message.
     * @param  array   $carContext  List of matching cars (RAG results).
     * @param  array   $history     Previous turns [['role'=>'user','content'=>'…'], …]
     * @return string
     */
    public function fbMessengerReply(
        string $message,
        string $locale,
        array $carContext = [],
        array $history = []
    ): string {
        return $this->render('prompts.fb-messenger-reply', compact('message', 'locale', 'carContext', 'history'));
    }

    /**
     * Render the "fb-comment-reply" prompt.
     *
     * @param  string  $comment
     * @param  string  $locale
     * @param  \App\Models\Car|null  $car
     * @return string
     */
    public function fbCommentReply(string $comment, string $locale, ?\App\Models\Car $car = null): string
    {
        return $this->render('prompts.fb-comment-reply', compact('comment', 'locale', 'car'));
    }

    /**
     * Render the "fb-content-calendar" prompt.
     *
     * @param  string  $locale
     * @param  array   $insights  Optional page insights to inform the topic.
     * @return string
     */
    public function fbContentCalendar(string $locale, array $insights = []): string
    {
        return $this->render('prompts.fb-content-calendar', compact('locale', 'insights'));
    }

    /**
     * Render the "fb-group-post" prompt.
     *
     * @param  \App\Models\Car  $car
     * @param  string  $locale
     * @param  string  $tone
     * @return string
     */
    public function fbGroupPost(\App\Models\Car $car, string $locale, string $tone = 'casual-friendly'): string
    {
        return $this->render('prompts.fb-group-post', compact('car', 'locale', 'tone'));
    }
}
