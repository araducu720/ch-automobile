<?php

namespace Tests\Unit\Services;

use App\Exceptions\OllamaResponseException;
use App\Services\Ollama\OllamaClient;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ConnectException;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Psr7\Request;
use GuzzleHttp\Psr7\Response;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * Unit tests for OllamaClient.
 *
 * Uses a Guzzle MockHandler to intercept HTTP calls — no real Ollama instance needed.
 */
class OllamaClientTest extends TestCase
{
    // -------------------------------------------------------------------------
    // generate()
    // -------------------------------------------------------------------------

    #[Test]
    public function it_returns_plain_text_from_generate(): void
    {
        $client = $this->makeClient([
            new Response(200, [], json_encode([
                'response'           => 'Hello, world!',
                'eval_count'         => 10,
                'prompt_eval_count'  => 5,
            ])),
        ]);

        $result = $client->generate('qwen2.5:7b', 'Say hello');

        $this->assertSame('Hello, world!', $result);
    }

    #[Test]
    public function it_decodes_json_format_response(): void
    {
        $jsonPayload = ['foo' => 'bar', 'num' => 42];

        $client = $this->makeClient([
            new Response(200, [], json_encode([
                'response' => json_encode($jsonPayload),
            ])),
        ]);

        $result = $client->generate('qwen2.5:7b', 'Return JSON', 'json');

        $this->assertSame($jsonPayload, $result);
    }

    #[Test]
    public function it_throws_on_invalid_json_response(): void
    {
        $client = $this->makeClient([
            new Response(200, [], json_encode([
                'response' => 'This is not JSON {broken',
            ])),
        ]);

        $this->expectException(OllamaResponseException::class);

        $client->generate('qwen2.5:7b', 'Return JSON', 'json');
    }

    #[Test]
    public function it_strips_markdown_fences_before_json_parse(): void
    {
        $payload = ['success' => true];

        $client = $this->makeClient([
            new Response(200, [], json_encode([
                'response' => "```json\n" . json_encode($payload) . "\n```",
            ])),
        ]);

        $result = $client->generate('qwen2.5:7b', 'Return JSON', 'json');

        $this->assertSame($payload, $result);
    }

    #[Test]
    public function it_retries_once_on_connection_error(): void
    {
        $dummyRequest = new Request('POST', '/api/generate');

        $client = $this->makeClient([
            new ConnectException('Connection refused', $dummyRequest),
            new Response(200, [], json_encode(['response' => 'retry worked'])),
        ]);

        $result = $client->generate('qwen2.5:7b', 'Retry test');

        $this->assertSame('retry worked', $result);
    }

    // -------------------------------------------------------------------------
    // embed()
    // -------------------------------------------------------------------------

    #[Test]
    public function it_returns_float_array_from_embed(): void
    {
        $embedding = [0.1, 0.2, 0.3];

        $client = $this->makeClient([
            new Response(200, [], json_encode(['embedding' => $embedding])),
        ]);

        $result = $client->embed('test text');

        $this->assertSame($embedding, $result);
    }

    // -------------------------------------------------------------------------
    // Factory helper
    // -------------------------------------------------------------------------

    /** Build an OllamaClient whose HTTP client uses a mock handler. */
    private function makeClient(array $responses): OllamaClient
    {
        $mock    = new MockHandler($responses);
        $handler = HandlerStack::create($mock);
        $guzzle  = new Client(['handler' => $handler]);

        $client       = new OllamaClient();
        // Swap out the internal Guzzle client via reflection
        $ref = new \ReflectionProperty(OllamaClient::class, 'http');
        $ref->setAccessible(true);
        $ref->setValue($client, $guzzle);

        return $client;
    }
}
