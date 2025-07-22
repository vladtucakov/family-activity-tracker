import { useEffect, useState } from 'react';
import { notificationService } from '../../../src/capacitor';

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
      notificationService.requestPermissions().then(result => {
        setPermissionGranted(result.display === 'granted');
      });
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
      await notificationService.scheduleDaily(options);
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
      await notificationService.showNotification(options);
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