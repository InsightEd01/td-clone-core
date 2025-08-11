import { useState, useEffect } from 'react';

interface PushNotificationOptions {
  title: string;
  body?: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  actions?: NotificationAction[];
  requireInteraction?: boolean;
}

interface NotificationPermissionState {
  permission: NotificationPermission;
  isSupported: boolean;
  isSubscribed: boolean;
}

export const usePushNotifications = () => {
  const [permissionState, setPermissionState] = useState<NotificationPermissionState>({
    permission: 'default',
    isSupported: false,
    isSubscribed: false
  });

  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    checkSupport();
    checkPermission();
    checkSubscription();
  }, []);

  const checkSupport = () => {
    const isSupported = 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
    setPermissionState(prev => ({ ...prev, isSupported }));
  };

  const checkPermission = () => {
    if ('Notification' in window) {
      setPermissionState(prev => ({ ...prev, permission: Notification.permission }));
    }
  };

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const existingSubscription = await registration.pushManager.getSubscription();
      setSubscription(existingSubscription);
      setPermissionState(prev => ({ ...prev, isSubscribed: !!existingSubscription }));
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!permissionState.isSupported) {
      throw new Error('Push notifications are not supported');
    }

    const permission = await Notification.requestPermission();
    setPermissionState(prev => ({ ...prev, permission }));
    return permission;
  };

  const subscribe = async (): Promise<PushSubscription | null> => {
    try {
      if (permissionState.permission !== 'granted') {
        const permission = await requestPermission();
        if (permission !== 'granted') {
          throw new Error('Permission denied');
        }
      }

      const registration = await navigator.serviceWorker.ready;
      
      // Generate VAPID keys for production use
      // For demo purposes, using a placeholder key
      const vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa40HI80NM9f8HtLlVLVWjSrWrTlYhk3BytsNfN6v4c8ftXrjVx_1LyKOtX5Dg';
      
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      setSubscription(pushSubscription);
      setPermissionState(prev => ({ ...prev, isSubscribed: true }));
      
      // In a real app, you'd send this subscription to your server
      console.log('Push subscription:', JSON.stringify(pushSubscription));
      
      return pushSubscription;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      return null;
    }
  };

  const unsubscribe = async (): Promise<boolean> => {
    try {
      if (subscription) {
        const success = await subscription.unsubscribe();
        if (success) {
          setSubscription(null);
          setPermissionState(prev => ({ ...prev, isSubscribed: false }));
        }
        return success;
      }
      return false;
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      return false;
    }
  };

  const showNotification = async (options: PushNotificationOptions): Promise<void> => {
    try {
      if (permissionState.permission !== 'granted') {
        // Fallback to regular notification if push is not available
        if (Notification.permission === 'granted') {
          new Notification(options.title, {
            body: options.body,
            icon: options.icon || '/logo.png',
            badge: options.badge || '/logo.png',
            tag: options.tag,
            data: options.data,
            requireInteraction: options.requireInteraction
          });
          return;
        }
        throw new Error('Notification permission not granted');
      }

      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(options.title, {
        body: options.body,
        icon: options.icon || '/logo.png',
        badge: options.badge || '/logo.png',
        tag: options.tag,
        data: options.data,
        actions: options.actions,
        requireInteraction: options.requireInteraction,
        vibrate: [200, 100, 200]
      });
    } catch (error) {
      console.error('Error showing notification:', error);
      throw error;
    }
  };

  return {
    permissionState,
    subscription,
    requestPermission,
    subscribe,
    unsubscribe,
    showNotification
  };
};

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}