// Capacitor setup for native functionality
import { LocalNotifications } from '@capacitor/local-notifications';

export interface NotificationService {
  scheduleDaily(options: { 
    id: number;
    title: string;
    body: string;
    hour: number;
    minute: number;
  }): Promise<void>;
  
  requestPermissions(): Promise<{ display: 'granted' | 'denied' }>;
  
  showNotification(options: {
    title: string;
    body: string;
    id?: number;
  }): Promise<void>;
}

class CapacitorNotificationService implements NotificationService {
  async requestPermissions() {
    const permission = await LocalNotifications.requestPermissions();
    return { display: permission.display === 'granted' ? 'granted' as const : 'denied' as const };
  }

  async scheduleDaily(options: { 
    id: number;
    title: string;
    body: string;
    hour: number;
    minute: number;
  }) {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: options.id,
          title: options.title,
          body: options.body,
          schedule: {
            on: {
              hour: options.hour,
              minute: options.minute,
            },
            repeats: true,
          },
          sound: undefined,
          attachments: undefined,
          actionTypeId: "",
          extra: null
        }
      ]
    });
  }

  async showNotification(options: {
    title: string;
    body: string;
    id?: number;
  }) {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: options.id || Date.now(),
          title: options.title,
          body: options.body,
          schedule: { at: new Date(Date.now() + 1000) }, // Show in 1 second
          sound: undefined,
          attachments: undefined,
          actionTypeId: "",
          extra: null
        }
      ]
    });
  }
}

export const notificationService = new CapacitorNotificationService();