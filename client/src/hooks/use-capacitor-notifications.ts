import { useEffect, useState } from 'react';

// Mock notification service for web mode
const mockNotificationService = {
  requestPermissions: async () => ({ display: 'denied' as const }),
  scheduleDaily: async (options: any) => {},
  showNotification: async (options: any) => {}
};

export function useCapacitorNotifications() {
  const [isNative, setIsNative] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if running in Capacitor (native app)
    const checkNative = () => {
      // @ts-ignore - Capacitor global available in native context
      return typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.();
    };
    
    setIsNative(checkNative());
    
    if (checkNative()) {
      // Request notification permissions for native app
      mockNotificationService.requestPermissions().then(result => {
        setPermissionGranted(result.display === 'granted');
      });
    } else {
      // Web mode - set permission to null
      setPermissionGranted(null);
    }
  }, []);

  const scheduleReminder = async (options: {
    id: number;
    title: string;
    body: string;
    hour: number;
    minute: number;
  }) => {
    if (!isNative) return false;
    
    try {
      await mockNotificationService.scheduleDaily(options);
      return true;
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      return false;
    }
  };

  const showNotification = async (options: {
    title: string;
    body: string;
    id?: number;
  }) => {
    if (!isNative) return false;
    
    try {
      await mockNotificationService.showNotification(options);
      return true;
    } catch (error) {
      console.error('Failed to show notification:', error);
      return false;
    }
  };

  return {
    isNative,
    permissionGranted,
    scheduleReminder,
    showNotification
  };
}