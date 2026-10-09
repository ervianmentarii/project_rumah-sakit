import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { useAuthStore } from '../stores/authStore';

window.Pusher = Pusher;

let echoInstance = null;

export function getEcho() {
  if (echoInstance) return echoInstance;

  const key = import.meta.env.VITE_REVERB_APP_KEY;
  if (!key) {
    console.warn('[Echo] VITE_REVERB_APP_KEY not set. Real-time features disabled.');
    return null;
  }

  try {
    echoInstance = new Echo({
      broadcaster: 'reverb',
      key: key,
      wsHost: import.meta.env.VITE_REVERB_HOST || 'localhost',
      wsPort: import.meta.env.VITE_REVERB_PORT || 8080,
      wssPort: import.meta.env.VITE_REVERB_PORT || 8080,
      forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'http') === 'https',
      enabledTransports: ['ws', 'wss'],
      disableStats: true,
      authEndpoint: 'http://localhost:8000/api/broadcasting/auth',
      auth: {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().token}`,
        },
      },
    });
  } catch (e) {
    console.warn('[Echo] Failed to initialize:', e.message);
    return null;
  }

  return echoInstance;
}

export const echo = null;
