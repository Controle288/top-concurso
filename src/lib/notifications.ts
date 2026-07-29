import { supabase } from './supabase';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';

export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return new Uint8Array(rawData.length).map((_, i) => rawData.charCodeAt(i));
}

export async function subscribeToPush(): Promise<boolean> {
  try {
    if (!('Notification' in window) || !('PushManager' in window)) return false;

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return false;

    const registration = await navigator.serviceWorker.ready;

    if (!VAPID_PUBLIC_KEY) {
      new Notification('Top Concurso', {
        body: 'Notificações ativadas! Você receberá lembretes de estudos.',
        icon: '/icon.svg',
      });
      return true;
    }

    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      await existingSubscription.unsubscribe();
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    await supabase.from('push_subscriptions').upsert({
      user_id: user.id,
      subscription: JSON.stringify(subscription),
      endpoint: subscription.endpoint,
    }, { onConflict: 'user_id' });

    return true;
  } catch {
    return false;
  }
}

export async function unsubscribeFromPush(): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) await subscription.unsubscribe();

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('push_subscriptions').delete().eq('user_id', user.id);
    }

    return true;
  } catch {
    return false;
  }
}

export async function isPushSubscribed(): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return !!subscription;
  } catch {
    return false;
  }
}
