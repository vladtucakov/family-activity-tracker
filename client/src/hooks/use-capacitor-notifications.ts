import { useEffect, useState } from 'react';

// Import Capacitor notifications for native mode
let LocalNotifications: any = null;
let capacitorNotificationService: any = null;

// Initialize Capacitor notifications in native context
const initializeCapacitor = async () => {
  try {
    // @ts-ignore - Capacitor global available in native context
    if (typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.()) {
      const { LocalNotifications: LN } = await import('@capacitor/local-notifications');
      LocalNotifications = LN;
      capacitorNotificationService = {
        requestPermissions: async () => await LN.requestPermissions(),
        scheduleDaily: async (options: any) => await LN.schedule({ notifications: [options] }),
        showNotification: async (options: any) => await LN.schedule({ notifications: [options] })
      };
    }
  } catch (error) {
    console.log('Capacitor not available, using web mode');
  }
};

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
    const setupNotifications = async () => {
      // Initialize Capacitor if available
      await initializeCapacitor();
      
      // Check if running in Capacitor (native app)
      // @ts-ignore - Capacitor global available in native context
      const isNativeMode = typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.();
      setIsNative(isNativeMode);
      
      if (isNativeMode && capacitorNotificationService) {
        // Request notification permissions for native app
        try {
          const result = await capacitorNotificationService.requestPermissions();
          setPermissionGranted(result.display === 'granted');
        } catch (error) {
          console.error('Failed to request permissions:', error);
          setPermissionGranted(false);
        }
      } else {
        // Web mode - set permission to null
        setPermissionGranted(null);
      }
    };
    
    setupNotifications();
  }, []);

  const scheduleReminder = async (options: {
    id: number;
    title: string;
    body: string;
    hour: number;
    minute: number;
  }) => {
    if (!isNative || !capacitorNotificationService) return false;
    
    try {
      const scheduleTime = new Date();
      scheduleTime.setHours(options.hour, options.minute, 0, 0);
      
      await capacitorNotificationService.scheduleDaily({
        id: options.id,
        title: options.title,
        body: options.body,
        schedule: { at: scheduleTime, repeats: true },
        sound: 'default'
      });
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
    if (!isNative || !capacitorNotificationService) return false;
    
    try {
      await capacitorNotificationService.showNotification({
        id: options.id || Date.now(),
        title: options.title,
        body: options.body,
        schedule: { at: new Date() },
        sound: 'default'
      });
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