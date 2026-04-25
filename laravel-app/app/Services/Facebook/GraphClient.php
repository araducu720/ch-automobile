<?php

namespace App\Services\Facebook;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;

/**
 * Low-level Guzzle wrapper for the Facebook Graph API.
 *
 * Handles:
 *  - Automatic access_token injection
 *  - Rate limiting via Laravel's RateLimiter facade (keyed by page_id)
 *  - Centralised Meta error-code handling (190, 4, 100, …)
 *  - Consistent response decoding
 */
class GraphClient
{
    protected Client $http;

    /** @var string Graph API base URL including version */
    protected string $baseUrl;

    /** @var string Long-lived Page Access Token */
    protected string $token;

    /** @var string Facebook Page ID (used as rate-limiter key) */
    protected string $pageId;

    public function __construct()
    {
        $version        = config('facebook.api_version', 'v21.0');
        $this->baseUrl  = "https://graph.facebook.com/{$version}";
        $this->token    = config('facebook.page_token', '');
        $this->pageId   = (string) config('facebook.page_id', '');

        $this->http = new Client([
            'base_uri' => $this->baseUrl . '/',
            'timeout'  => 30,
            'headers'  => ['Accept' => 'application/json'],
        ]);
    }

    /**
     * Perform a GET request against the Graph API.
     *
     * @param  string  $path    Relative path, e.g. "me/feed".
     * @param  array   $params  Query-string parameters.
     * @return array   Decoded response.
     *
     * @throws GuzzleException
     */
    public function get(string $path, array $params = []): array
    {
        $this->checkRateLimit();

        $params['access_token'] = $this->token;

        $response = $this->http->get($path, ['query' => $params]);
        $this->consumeRateLimit();

        return $this->decode($response);
    }

    /**
     * Perform a POST request against the Graph API.
     *
     * @param  string  $path    Relative path.
     * @param  array   $data    Form data (multipart is handled automatically when files present).
     * @return array
     *
     * @throws GuzzleException
     */
    public function post(string $path, array $data = []): array
    {
        $this->checkRateLimit();

        $data['access_token'] = $this->token;

        try {
            $response = $this->http->post($path, ['form_params' => $data]);
        } catch (ClientException $e) {
            $this->handleClientError($e);
        }

        $this->consumeRateLimit();

        return $this->decode($response);
    }

    /**
     * Perform a DELETE request against the Graph API.
     *
     * @param  string  $path
     * @param  array   $params
     * @return array
     *
     * @throws GuzzleException
     */
    public function delete(string $path, array $params = []): array
    {
        $this->checkRateLimit();

        $params['access_token'] = $this->token;

        $response = $this->http->delete($path, ['query' => $params]);
        $this->consumeRateLimit();

        return $this->decode($response);
    }

    /**
     * Upload a photo as multipart/form-data.
     *
     * @param  string  $path        e.g. "{page_id}/photos"
     * @param  string  $imageUrl    Public URL of the image.
     * @param  array   $extraData   Additional form fields (caption, etc.)
     * @return array
     *
     * @throws GuzzleException
     */
    public function postPhoto(string $path, string $imageUrl, array $extraData = []): array
    {
        $this->checkRateLimit();

        $extraData['url']          = $imageUrl;
        $extraData['access_token'] = $this->token;
        $extraData['published']    = $extraData['published'] ?? 'false';

        try {
            $response = $this->http->post($path, ['form_params' => $extraData]);
        } catch (ClientException $e) {
            $this->handleClientError($e);
        }

        $this->consumeRateLimit();

        return $this->decode($response);
    }

    // -------------------------------------------------------------------------
    // Rate limiting helpers
    // -------------------------------------------------------------------------

    /** Throw if the rate limit is exhausted. */
    protected function checkRateLimit(): void
    {
        $key         = "fb:page:{$this->pageId}";
        $maxPerHour  = (int) config('facebook.rate_limit_per_hour', 200);

        if (RateLimiter::tooManyAttempts($key, $maxPerHour)) {
            $seconds = RateLimiter::availableIn($key);
            Log::channel('daily')->warning("Facebook rate limit hit, retry in {$seconds}s.");
            throw new \RuntimeException("Facebook API rate limit exceeded. Retry in {$seconds} seconds.");
        }
    }

    /** Record one API call against the rate-limit bucket. */
    protected function consumeRateLimit(): void
    {
        RateLimiter::hit("fb:page:{$this->pageId}", 3600);
    }

    // -------------------------------------------------------------------------
    // Error handling
    // -------------------------------------------------------------------------

    /**
     * Map Meta error codes to meaningful log messages and re-throw.
     *
     * @throws ClientException  Always re-throws after logging.
     */
    protected function handleClientError(ClientException $e): never
    {
        $body = json_decode((string) $e->getResponse()->getBody(), true);
        $code = $body['error']['code'] ?? 0;

        $messages = [
            190 => 'Facebook access token expired or invalid.',
            4   => 'Facebook application-level rate limit reached.',
            100 => 'Facebook invalid parameter in request.',
        ];

        $msg = $messages[$code] ?? 'Facebook API error.';

        Log::error("[GraphClient] {$msg}", [
            'code'    => $code,
            'message' => $body['error']['message'] ?? '',
            'request' => (string) $e->getRequest()->getUri(),
        ]);

        throw $e;
    }

    // -------------------------------------------------------------------------
    // Response decoding
    // -------------------------------------------------------------------------

    /**
     * Decode a Guzzle PSR-7 response to an associative array.
     *
     * @param  \Psr\Http\Message\ResponseInterface  $response
     * @return array
     */
    protected function decode($response): array
    {
        return json_decode((string) $response->getBody(), true) ?? [];
    }
}
