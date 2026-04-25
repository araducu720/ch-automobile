<?php

namespace App\Services\Facebook;

use GuzzleHttp\Exception\GuzzleException;

/**
 * Service for sending messages via the Facebook Messenger Send API.
 *
 * Supports:
 *  - Plain text messages
 *  - Generic template (carousel of cards)
 *  - Custom messaging_type + message_tag
 */
class MessengerService
{
    /** @var string Messenger Send API endpoint (v21.0) */
    protected string $sendApiUrl = 'https://graph.facebook.com/v21.0/me/messages';

    public function __construct(protected GraphClient $graph) {}

    /**
     * Send a plain-text message to a Messenger user.
     *
     * @param  string  $psid          Page-Scoped User ID of the recipient.
     * @param  string  $text          Message body (max 2000 characters).
     * @param  string  $messagingType RESPONSE | UPDATE | MESSAGE_TAG
     * @param  string|null  $tag       Required when $messagingType === 'MESSAGE_TAG'.
     * @return array
     *
     * @throws GuzzleException
     */
    public function sendText(
        string $psid,
        string $text,
        string $messagingType = 'RESPONSE',
        ?string $tag = null
    ): array {
        $payload = [
            'recipient'      => ['id' => $psid],
            'message'        => ['text' => substr($text, 0, 2000)],
            'messaging_type' => $messagingType,
        ];

        if ($tag !== null) {
            $payload['tag'] = $tag;
        }

        return $this->graph->post('me/messages', $payload);
    }

    /**
     * Send a generic carousel template to a Messenger user.
     *
     * @param  string  $psid    Page-Scoped User ID.
     * @param  array   $cards   Array of card definitions:
     *                          [['title'=>…,'subtitle'=>…,'image_url'=>…,'buttons'=>[…]], …]
     * @param  string  $messagingType
     * @return array
     *
     * @throws GuzzleException
     */
    public function sendCarousel(
        string $psid,
        array $cards,
        string $messagingType = 'RESPONSE'
    ): array {
        $elements = array_map(function (array $card): array {
            $element = [
                'title'    => $card['title'] ?? '',
                'subtitle' => $card['subtitle'] ?? '',
            ];

            if (!empty($card['image_url'])) {
                $element['image_url'] = $card['image_url'];
            }

            if (!empty($card['buttons'])) {
                $element['buttons'] = $card['buttons'];
            }

            return $element;
        }, array_slice($cards, 0, 10));

        $payload = [
            'recipient'      => ['id' => $psid],
            'message'        => [
                'attachment' => [
                    'type'    => 'template',
                    'payload' => [
                        'template_type' => 'generic',
                        'elements'      => $elements,
                    ],
                ],
            ],
            'messaging_type' => $messagingType,
        ];

        return $this->graph->post('me/messages', $payload);
    }
}
