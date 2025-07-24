import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Smartphone, Bell, Clock } from 'lucide-react';
import { useCapacitorNotifications } from '@/hooks/use-capacitor-notifications';

export default function NativeNotificationAdmin() {
  const { 
    isNative, 
    permissionGranted, 
    scheduleReminder, 
    showNotification,
    recheckPermissions
  } = useCapacitorNotifications();
  
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isScheduled, setIsScheduled] = useState(false);

  const handleRecheckPermissions = async () => {
    setTestResult(null);
    const granted = await recheckPermissions();
    if (granted) {
      setTestResult('Permissions granted! Notifications are now enabled.');
    } else {
      setTestResult('Permissions still denied. Please check Android settings.');
    }
  };

  const handleTestNotification = async () => {
    setTestResult(null);
    
    const success = await showNotification({
      title: 'FamilyTracker Test',
      body: 'Native notification working! 🎉',
      id: 999
    });
    
    if (success) {
      setTestResult('Test notification sent successfully!');
    } else {
      setTestResult('Failed to send test notification');
    }
  };

  const handleScheduleReminder = async () => {
    setTestResult(null);
    
    // Schedule daily reminder for 8:00 PM Pacific
    const success = await scheduleReminder({
      id: 1,
      title: 'Family Activity Reminder',
      body: "Don't forget to log your activities today!",
      hour: 20, // 8 PM
      minute: 0
    });
    
    if (success) {
      setTestResult('Daily reminder scheduled for 8:00 PM!');
      setIsScheduled(true);
    } else {
      setTestResult('Failed to schedule reminder');
    }
  };

  if (!isNative) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-yellow-600" />
            <CardTitle className="text-lg">Native App Features</CardTitle>
          </div>
          <CardDescription>
            This panel is only available when running as a native Android app
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Install the app from the APK to access native notification features
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg">Native Notifications</CardTitle>
        </div>
        <CardDescription>
          Manage native Android notifications for the Family Activity Tracker
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Permission Status */}
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Notification Permission</span>
          </div>
          <Badge variant={permissionGranted ? "default" : "destructive"} className="gap-1">
            {permissionGranted ? (
              <>
                <CheckCircle className="h-3 w-3" />
                Granted
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3" />
                {permissionGranted === null ? 'Checking...' : 'Denied'}
              </>
            )}
          </Badge>
        </div>

        {/* Permission Recheck Button */}
        {!permissionGranted && (
          <div className="space-y-2">
            <Button 
              onClick={handleRecheckPermissions}
              className="w-full"
              variant="secondary"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Recheck Permissions
            </Button>
            <p className="text-xs text-gray-600 text-center">
              If you enabled notifications in Android settings, click to refresh
            </p>
          </div>
        )}

        {/* Test Notification */}
        <div className="space-y-2">
          <Button 
            onClick={handleTestNotification}
            disabled={!permissionGranted}
            className="w-full"
            variant="outline"
          >
            <Bell className="h-4 w-4 mr-2" />
            Send Test Notification
          </Button>
        </div>

        {/* Schedule Daily Reminder */}
        <div className="space-y-2">
          <Button 
            onClick={handleScheduleReminder}
            disabled={!permissionGranted || isScheduled}
            className="w-full"
          >
            <Clock className="h-4 w-4 mr-2" />
            {isScheduled ? 'Daily Reminder Active' : 'Schedule 8 PM Reminder'}
          </Button>
          {isScheduled && (
            <p className="text-xs text-green-600 text-center">
              ✓ Daily reminders scheduled for 8:00 PM Pacific
            </p>
          )}
        </div>

        {/* Test Result */}
        {testResult && (
          <div className={`p-3 rounded-lg text-sm ${
            testResult.includes('success') || testResult.includes('scheduled') 
              ? 'bg-green-100 text-green-800 border-green-200' 
              : 'bg-red-100 text-red-800 border-red-200'
          } border`}>
            {testResult}
          </div>
        )}

        <div className="pt-2 border-t">
          <p className="text-xs text-gray-500 text-center">
            Native Android notifications are more reliable than web notifications
          </p>
        </div>
      </CardContent>
    </Card>
  );
}