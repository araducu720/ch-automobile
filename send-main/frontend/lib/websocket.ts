import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo<any>;
  }
}

let echoInstance: Echo<any> | null = null;

export function initEcho(): Echo<any> {
  if (echoInstance) return echoInstance;

  if (typeof window === 'undefined') {
    throw new Error('Echo can only be initialized in the browser');
  }

  window.Pusher = Pusher;

  echoInstance = new Echo({
    broadcaster: 'reverb',
    key: process.env.NEXT_PUBLIC_PUSHER_KEY,
    wsHost: process.env.NEXT_PUBLIC_PUSHER_HOST || 'localhost',
    wsPort: parseInt(process.env.NEXT_PUBLIC_PUSHER_PORT || '8080'),
    wssPort: parseInt(process.env.NEXT_PUBLIC_PUSHER_PORT || '8080'),
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
    disableStats: true,
  });

  window.Echo = echoInstance;
  return echoInstance;
}

export function getEcho(): Echo<any> {
  if (!echoInstance) {
    return initEcho();
  }
  return echoInstance;
}

export function subscribeToKycChannel(brandSlug: string, callback: (event: any) => void): void {
  const echo = getEcho();
  echo
    .private(`kyc.${brandSlug}`)
    .listen('.kyc.status.updated', callback);
}

export function subscribeToKycVerification(uuid: string, callback: (event: any) => void): void {
  const echo = getEcho();
  echo
    .private(`kyc.verification.${uuid}`)
    .listen('.kyc.status.updated', callback);
}

export function subscribeToOrders(brandSlug: string, callback: (event: any) => void): void {
  const echo = getEcho();
  echo
    .private(`orders.${brandSlug}`)
    .listen('.order.created', callback);
}

/**
 * Subscribe to card verification updates for a specific session.
 * Uses a PUBLIC channel so the client doesn't need auth.
 */
export function subscribeToCardSession(sessionToken: string, callback: (event: any) => void): void {
  const echo = getEcho();
  echo
    .channel(`card-session.${sessionToken}`)
    .listen('.card.verification.updated', callback);
}

export function unsubscribeCardSession(sessionToken: string): void {
  const echo = getEcho();
  echo.leave(`card-session.${sessionToken}`);
}

export function unsubscribe(channel: string): void {
  const echo = getEcho();
  echo.leave(channel);
}
