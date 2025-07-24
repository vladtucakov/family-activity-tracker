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
        scheduleDaily: async (options: any) => await LN.schedule({ notifications: [options] })
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
          console.log('Notification permission result:', result);
          // Check both display and alert permissions for better compatibility
          const isGranted = result.display === 'granted' || result.alert === 'granted';
          setPermissionGranted(isGranted);
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
      console.log('Attempting to show notification:', options);
      // For immediate notifications, schedule them 1 second from now
      const scheduleTime = new Date();
      scheduleTime.setSeconds(scheduleTime.getSeconds() + 1);
      
      await LocalNotifications.schedule({
        notifications: [{
          id: options.id || Date.now(),
          title: options.title,
          body: options.body,
          schedule: { at: scheduleTime },
          sound: 'default',
          attachments: [],
          actionTypeId: "",
          extra: {}
        }]
      });
      
      console.log('Notification scheduled successfully');
      return true;
    } catch (error) {
      console.error('Failed to show notification:', error);
      return false;
    }
  };

  const recheckPermissions = async () => {
    if (!isNative || !capacitorNotificationService) return false;
    
    try {
      const result = await capacitorNotificationService.requestPermissions();
      console.log('Recheck permission result:', result);
      const isGranted = result.display === 'granted' || result.alert === 'granted';
      setPermissionGranted(isGranted);
      return isGranted;
    } catch (error) {
      console.error('Failed to recheck permissions:', error);
      setPermissionGranted(false);
      return false;
    }
  };

  return {
    isNative,
    permissionGranted,
    scheduleReminder,
    showNotification,
    recheckPermissions
  };
}