import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bell, TestTube } from "lucide-react";

export default function NotificationAdmin() {
  const [testResult, setTestResult] = useState<string>('');
  const [notificationPermission, setNotificationPermission] = useState<string>('default');
  const [notificationSupport, setNotificationSupport] = useState<boolean>(false);

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationSupport(true);
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        if (permission === 'granted') {
          setTestResult('✅ Notification permission granted! You can now receive reminders.');
        } else {
          setTestResult('❌ Notification permission denied. Please enable in browser settings.');
        }
      } catch (error) {
        setTestResult('❌ Error requesting permission: ' + (error as Error).message);
      }
    }
  };

  const testBasicNotification = () => {
    if (Notification.permission === 'granted') {
      // Try service worker first for mobile compatibility
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SHOW_NOTIFICATION',
          notification: {
            title: 'Test Notification',
            body: 'This is a basic test notification from Family Activity Tracker',
            icon: '/icon-192x192.png',
            tag: 'test-notification'
          }
        });
        setTestResult('✅ Basic notification sent via service worker! Check if it appeared.');
      } else {
        // Fallback to regular notification
        new Notification('Test Notification', {
          body: 'This is a basic test notification from Family Activity Tracker',
          icon: '/icon-192x192.png',
        });
        setTestResult('✅ Basic notification sent! Check if it appeared.');
      }
    } else {
      setTestResult('❌ Need permission first. Click "Request Permission" button.');
    }
  };

  const testActivityReminder = () => {
    if (Notification.permission === 'granted') {
      // Try service worker first for mobile compatibility
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SHOW_NOTIFICATION',
          notification: {
            title: 'Family Activity Tracker',
            body: 'Vlad, you haven\'t logged any activities today! Add your household, health, creative, learning, helping, or play activities.',
            icon: '/icon-192x192.png',
            tag: 'family-activity-reminder'
          }
        });
        setTestResult('✅ Activity reminder sent via service worker! This is what the 8 PM reminders will look like.');
      } else {
        // Fallback to regular notification
        new Notification('Family Activity Tracker', {
          body: 'Vlad, you haven\'t logged any activities today! Add your household, health, creative, learning, helping, or play activities.',
          icon: '/icon-192x192.png',
          tag: 'family-activity-reminder'
        });
        setTestResult('✅ Activity reminder sent! This is what the 8 PM reminders will look like.');
      }
    } else {
      setTestResult('❌ Need permission first. Click "Request Permission" button.');
    }
  };

  const getPermissionStatus = () => {
    if (!notificationSupport) return '❌ Not Supported';
    switch (notificationPermission) {
      case 'granted': return '✅ Enabled';
      case 'denied': return '❌ Blocked';
      default: return '⚠️ Not Set';
    }
  };

  const getDeviceInfo = () => {
    const userAgent = navigator.userAgent;
    const isAndroid = /Android/i.test(userAgent);
    const isChrome = /Chrome/i.test(userAgent);
    const isMobile = /Mobi|Android/i.test(userAgent);
    const hasServiceWorker = 'serviceWorker' in navigator;
    const swController = navigator.serviceWorker?.controller;
    
    return {
      isAndroid,
      isChrome,
      isMobile,
      hasServiceWorker,
      swController: !!swController,
      browser: isChrome ? 'Chrome' : 'Other'
    };
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Testing for Vlad
        </CardTitle>
        <CardDescription>
          Test and configure notifications step by step
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Browser Support Check */}
        <div className="space-y-3">
          <h4 className="font-medium">Browser Compatibility</h4>
          <div className="text-sm space-y-1">
            <div>Notification Support: {notificationSupport ? '✅ Available' : '❌ Not Supported'}</div>
            <div>Current Permission: {getPermissionStatus()}</div>
            <div>Device: {getDeviceInfo().isAndroid ? 'Android' : 'Other'} - {getDeviceInfo().browser}</div>
            <div>Service Worker: {getDeviceInfo().hasServiceWorker ? '✅ Available' : '❌ Not Available'}</div>
            <div>SW Controller: {getDeviceInfo().swController ? '✅ Active' : '❌ Not Active'}</div>
          </div>
        </div>

        {/* Step 1: Request Permission */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Step 1</span>
            Request Permission
          </h4>
          <Button 
            onClick={requestPermission}
            disabled={!notificationSupport || notificationPermission === 'granted'}
            variant={notificationPermission === 'granted' ? 'outline' : 'default'}
          >
            {notificationPermission === 'granted' ? 'Permission Already Granted' : 'Request Notification Permission'}
          </Button>
        </div>

        {/* Step 2: Test Basic Notification */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Step 2</span>
            Basic Test
          </h4>
          <Button 
            onClick={testBasicNotification}
            disabled={notificationPermission !== 'granted'}
            variant="outline"
            className="w-full"
          >
            <TestTube className="h-4 w-4 mr-2" />
            Send Basic Test Notification
          </Button>
        </div>

        {/* Step 3: Test Activity Reminder */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Step 3</span>
            Activity Reminder Test
          </h4>
          <Button 
            onClick={testActivityReminder}
            disabled={notificationPermission !== 'granted'}
            className="w-full"
          >
            <Bell className="h-4 w-4 mr-2" />
            Send Activity Reminder (8 PM Style)
          </Button>
        </div>

        {/* Results */}
        {testResult && (
          <Alert>
            <AlertDescription>
              {testResult}
            </AlertDescription>
          </Alert>
        )}

        {/* Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <div>• Once testing works, we'll enable automatic 8 PM reminders</div>
          <div>• Reminders only sent when you have fewer than 3 activities logged</div>
          <div>• Notifications will appear as system notifications on your device</div>
        </div>
      </CardContent>
    </Card>
  );
}