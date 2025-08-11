import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotification } from '@/hooks/useNotification';
import { Bell, DollarSign, Shield, Calendar } from 'lucide-react';

export const NotificationDemo = () => {
  const { 
    notifyTransaction, 
    notifySecurityAlert, 
    notifyBillReminder, 
    notifyAccountUpdate,
    permissionState 
  } = useNotification();

  const testTransactionNotification = () => {
    notifyTransaction(250.00, 'sent', 'John Doe');
  };

  const testSecurityAlert = () => {
    notifySecurityAlert('New login detected from Chrome on Windows');
  };

  const testBillReminder = () => {
    notifyBillReminder('Electric Bill', 89.50, 'tomorrow');
  };

  const testAccountUpdate = () => {
    notifyAccountUpdate('Your monthly statement is now available');
  };

  if (!permissionState.isSupported) {
    return (
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-gray-400" />
            Push Notifications Not Supported
          </CardTitle>
          <CardDescription>
            Your browser doesn't support push notifications
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Bell className="h-5 w-5 text-emerald-600" />
          Test Push Notifications
        </CardTitle>
        <CardDescription>
          Try out different types of banking notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={testTransactionNotification}
            className="flex items-center gap-2"
          >
            <DollarSign className="h-4 w-4" />
            Transaction
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={testSecurityAlert}
            className="flex items-center gap-2"
          >
            <Shield className="h-4 w-4" />
            Security Alert
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={testBillReminder}
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Bill Reminder
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={testAccountUpdate}
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            Account Update
          </Button>
        </div>
        
        {permissionState.permission !== 'granted' && (
          <p className="text-xs text-muted-foreground mt-2">
            Enable push notifications above to test these features
          </p>
        )}
      </CardContent>
    </Card>
  );
};