<?php

namespace App\Services\Facebook\Contracts;

/**
 * Interface MarketingChannel
 *
 * All marketing channel integrations (Facebook, Instagram, mobile.de,
 * AutoScout24, OtoMoto, etc.) must implement this contract so they can
 * be swapped in or out without changing business logic.
 *
 * NOTE: Only Facebook is implemented in this iteration (v1).
 * Future channels to add:
 *  - InstagramChannel      (Reels + Stories via Graph API)
 *  - MobileDEChannel       (mobile.de REST API)
 *  - AutoScout24Channel    (AutoScout24 Classified API)
 *  - OtoMotoChannel        (OtoMoto API for Polish market)
 *  - LeBonCoinChannel      (French marketplace)
 *  - SubitoChannel         (Italian marketplace)
 *  - AutoTraderChannel     (UK market)
 */
interface MarketingChannel
{
    /**
     * Publish a new vehicle listing to the channel.
     *
     * @param  \App\Models\Car  $car
     * @param  string  $locale  BCP-47 locale code.
     * @return array  Channel-specific response data (IDs, URLs, …).
     */
    public function publishListing(\App\Models\Car $car, string $locale): array;

    /**
     * Update an existing listing (e.g. price change, new photos).
     *
     * @param  \App\Models\Car  $car
     * @param  string  $locale
     * @return array
     */
    public function updateListing(\App\Models\Car $car, string $locale): array;

    /**
     * Mark a listing as sold / out of stock on the channel.
     *
     * @param  \App\Models\Car  $car
     * @return bool
     */
    public function markSold(\App\Models\Car $car): bool;

    /**
     * Return a human-readable identifier for this channel.
     *
     * @return string  e.g. "facebook", "instagram", "mobile_de"
     */
    public function channelName(): string;
}
