import { useState, useEffect } from 'react';
import { Bell, BellOff, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useNotification } from '@/hooks/useNotification';

export const NotificationSettings = () => {
  const { permissionState, subscribe, unsubscribe } = usePushNotifications();
  const { requestNotificationPermission } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const handleTogglePushNotifications = async () => {
    setIsLoading(true);
    try {
      if (permissionState.isSubscribed) {
        await unsubscribe();
      } else {
        if (permissionState.permission !== 'granted') {
          const granted = await requestNotificationPermission();
          if (!granted) {
            setIsLoading(false);
            return;
          }
        }
        await subscribe();
      }
    } catch (error) {
      console.error('Error toggling push notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPermissionBadge = () => {
    if (!permissionState.isSupported) {
      return <Badge variant="secondary">Not Supported</Badge>;
    }
    
    switch (permissionState.permission) {
      case 'granted':
        return <Badge variant="default" className="bg-green-500">Enabled</Badge>;
      case 'denied':
        return <Badge variant="destructive">Blocked</Badge>;
      default:
        return <Badge variant="outline">Not Set</Badge>;
    }
  };

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bell className="h-5 w-5 text-emerald-600" />
          Push Notifications
        </CardTitle>
        <CardDescription>
          Get real-time notifications for transactions, security alerts, and account updates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">Browser Notifications</span>
              {getPermissionBadge()}
            </div>
            <p className="text-sm text-muted-foreground">
              {permissionState.isSupported 
                ? 'Receive notifications even when the app is closed'
                : 'Your browser does not support push notifications'
              }
            </p>
          </div>
          <Switch
            checked={permissionState.isSubscribed}
            onCheckedChange={handleTogglePushNotifications}
            disabled={!permissionState.isSupported || isLoading}
          />
        </div>

        {permissionState.permission === 'denied' && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <BellOff className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800">Notifications Blocked</p>
                <p className="text-yellow-700 mt-1">
                  To enable notifications, click the lock icon in your browser's address bar and allow notifications.
                </p>
              </div>
            </div>
          </div>
        )}

        {permissionState.isSubscribed && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Bell className="h-4 w-4 text-green-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-green-800">Notifications Active</p>
                <p className="text-green-700 mt-1">
                  You'll receive push notifications for important banking activities.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};