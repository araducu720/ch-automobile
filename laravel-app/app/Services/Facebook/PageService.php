<?php

namespace App\Services\Facebook;

use GuzzleHttp\Exception\GuzzleException;

/**
 * Service for posting to a Facebook Page.
 *
 * Covers:
 *  - Plain text posts
 *  - Single-photo posts
 *  - Photo carousels (multiple unpublished photos + one published post)
 *  - Pinning comments
 *  - Replying to comments
 */
class PageService
{
    public function __construct(protected GraphClient $graph) {}

    /**
     * Create a plain-text post on the Page feed.
     *
     * @param  string  $message  Post body text.
     * @param  string|null  $link  Optional external URL attached to the post.
     * @return array  ['id' => '<page_id>_<post_id>']
     *
     * @throws GuzzleException
     */
    public function createTextPost(string $message, ?string $link = null): array
    {
        $pageId = config('facebook.page_id');

        $data = ['message' => $message];

        if ($link !== null) {
            $data['link'] = $link;
        }

        return $this->graph->post("{$pageId}/feed", $data);
    }

    /**
     * Publish a single-photo post on the Page feed.
     *
     * @param  string  $imageUrl  Publicly accessible image URL.
     * @param  string  $caption   Caption / alt text.
     * @return array  ['id' => '<photo_id>']
     *
     * @throws GuzzleException
     */
    public function createPhotoPost(string $imageUrl, string $caption): array
    {
        $pageId = config('facebook.page_id');

        return $this->graph->postPhoto("{$pageId}/photos", $imageUrl, [
            'caption'   => $caption,
            'published' => 'true',
        ]);
    }

    /**
     * Publish a photo carousel post.
     *
     * The Facebook API does not support native multi-photo carousels for
     * Page posts via Graph API directly.  The workaround is:
     *  1. Upload each photo as unpublished (attached_media).
     *  2. Create a published post referencing all photo IDs.
     *
     * @param  string[]  $imageUrls  Array of publicly accessible image URLs (max 10).
     * @param  string    $message    Post text.
     * @param  string|null  $link    Optional link to attach.
     * @return array  ['id' => '<post_id>']
     *
     * @throws GuzzleException
     */
    public function createPhotoCarousel(array $imageUrls, string $message, ?string $link = null): array
    {
        $pageId     = config('facebook.page_id');
        $mediaItems = [];

        foreach (array_slice($imageUrls, 0, 10) as $url) {
            $photo        = $this->graph->postPhoto("{$pageId}/photos", $url, ['published' => 'false']);
            $mediaItems[] = ['media_fbid' => $photo['id']];
        }

        $data = [
            'message'        => $message,
            'attached_media' => json_encode($mediaItems),
        ];

        if ($link !== null) {
            $data['link'] = $link;
        }

        return $this->graph->post("{$pageId}/feed", $data);
    }

    /**
     * Pin a comment to a post.
     *
     * @param  string  $postId   Graph object ID of the post.
     * @param  string  $message  Comment body text.
     * @return array  ['id' => '<comment_id>']
     *
     * @throws GuzzleException
     */
    public function pinComment(string $postId, string $message): array
    {
        return $this->graph->post("{$postId}/comments", [
            'message'  => $message,
            'can_hide' => false,
        ]);
    }

    /**
     * Reply to an existing comment.
     *
     * @param  string  $commentId  Graph object ID of the comment to reply to.
     * @param  string  $message    Reply body.
     * @return array
     *
     * @throws GuzzleException
     */
    public function replyToComment(string $commentId, string $message): array
    {
        return $this->graph->post("{$commentId}/comments", ['message' => $message]);
    }
}
