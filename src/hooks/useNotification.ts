import { usePushNotifications } from './usePushNotifications';
import { toast as showToast } from './use-toast';

interface NotificationOptions {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
  usePush?: boolean;
  requireInteraction?: boolean;
  actions?: NotificationAction[];
}

export const useNotification = () => {
  const { permissionState, showNotification, requestPermission } = usePushNotifications();

  const notify = async (options: NotificationOptions) => {
    const { title, description, variant = 'default', usePush = true, requireInteraction = false, actions } = options;

    // If push notifications are supported and permission is granted, use push notifications
    if (usePush && permissionState.isSupported && permissionState.permission === 'granted') {
      try {
        await showNotification({
          title,
          body: description,
          tag: `banking-${Date.now()}`,
          requireInteraction,
          actions,
          data: { variant, timestamp: Date.now() }
        });
        return;
      } catch (error) {
        console.warn('Push notification failed, falling back to toast:', error);
      }
    }

    // Fallback to toast notification
    showToast({
      title,
      description,
      variant
    });
  };

  const requestNotificationPermission = async () => {
    try {
      const permission = await requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  };

  // Banking-specific notification helpers
  const notifyTransaction = (amount: number, type: 'sent' | 'received' | 'deposit' | 'withdrawal', recipient?: string) => {
    const title = type === 'sent' ? 'Money Sent' : 
                  type === 'received' ? 'Money Received' : 
                  type === 'deposit' ? 'Deposit Complete' : 'Withdrawal Complete';
    
    const description = type === 'sent' && recipient ? 
      `$${amount.toFixed(2)} sent to ${recipient}` :
      `$${amount.toFixed(2)} ${type === 'received' ? 'received' : type === 'deposit' ? 'deposited' : 'withdrawn'}`;

    notify({
      title,
      description,
      usePush: true,
      requireInteraction: true,
      actions: [
        {
          action: 'view',
          title: 'View Details',
          icon: '/logo.png'
        }
      ]
    });
  };

  const notifySecurityAlert = (message: string) => {
    notify({
      title: 'Security Alert',
      description: message,
      variant: 'destructive',
      usePush: true,
      requireInteraction: true,
      actions: [
        {
          action: 'review',
          title: 'Review',
          icon: '/logo.png'
        }
      ]
    });
  };

  const notifyBillReminder = (billName: string, amount: number, dueDate: string) => {
    notify({
      title: 'Bill Reminder',
      description: `${billName} payment of $${amount.toFixed(2)} is due ${dueDate}`,
      usePush: true,
      requireInteraction: false,
      actions: [
        {
          action: 'pay',
          title: 'Pay Now',
          icon: '/logo.png'
        },
        {
          action: 'remind',
          title: 'Remind Later',
          icon: '/logo.png'
        }
      ]
    });
  };

  const notifyAccountUpdate = (message: string) => {
    notify({
      title: 'Account Update',
      description: message,
      usePush: true,
      requireInteraction: false
    });
  };

  return {
    notify,
    notifyTransaction,
    notifySecurityAlert,
    notifyBillReminder,
    notifyAccountUpdate,
    requestNotificationPermission,
    permissionState
  };
};