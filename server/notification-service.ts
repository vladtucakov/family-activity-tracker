import { storage } from './storage';
import { notificationClient, type BrowserNotification } from './notification-client';
// Date utility functions for Pacific Time
function getTodayDateString(): string {
  const now = new Date();
  const pacificTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Los_Angeles"}));
  const year = pacificTime.getFullYear();
  const month = String(pacificTime.getMonth() + 1).padStart(2, '0');
  const day = String(pacificTime.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getStartOfDayPacific(date: Date): Date {
  const pacificTime = new Date(date.toLocaleString("en-US", {timeZone: "America/Los_Angeles"}));
  pacificTime.setHours(0, 0, 0, 0);
  return pacificTime;
}

function formatDateForDB(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

interface NotificationPayload {
  title: string;
  body: string;
  icon: string;
  badge: string;
  tag: string;
  data: {
    userId: number;
    username: string;
    activitiesCompleted: number;
  };
}

export class NotificationService {
  private static instance: NotificationService;
  private scheduledJobs = new Map<string, NodeJS.Timeout>();
  private pendingNotifications: any[] = [];

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Schedule daily notifications for 8:00 PM Pacific Time
   */
  scheduleDailyNotifications() {
    // Clear any existing scheduled job
    const existingJob = this.scheduledJobs.get('daily-reminder');
    if (existingJob) {
      clearTimeout(existingJob);
    }

    // Calculate next 8:00 PM Pacific Time
    const now = new Date();
    const pacificNow = new Date(now.toLocaleString("en-US", {timeZone: "America/Los_Angeles"}));
    
    // Create target time: today at 8:00 PM Pacific
    const targetTime = new Date(pacificNow);
    targetTime.setHours(20, 0, 0, 0); // 8:00 PM
    
    // If it's already past 8 PM today, schedule for 8 PM tomorrow
    if (targetTime <= pacificNow) {
      targetTime.setDate(targetTime.getDate() + 1);
    }
    
    // Convert back to UTC for setTimeout
    const targetUTC = new Date(targetTime.toLocaleString("en-US", {timeZone: "UTC"}));
    const timeUntilTarget = targetUTC.getTime() - now.getTime();
    
    console.log(`[NotificationService] Current time: ${now.toISOString()}`);
    console.log(`[NotificationService] Current Pacific time: ${pacificNow.toLocaleString()}`);
    console.log(`[NotificationService] Next 8 PM Pacific notification: ${targetTime.toLocaleString()} (${Math.round(timeUntilTarget / (1000 * 60 * 60))} hours from now)`);

    const timeoutId = setTimeout(async () => {
      await this.sendDailyReminders();
      // Reschedule for the next day
      this.scheduleDailyNotifications();
    }, timeUntilTarget);

    this.scheduledJobs.set('daily-reminder', timeoutId);
  }

  /**
   * Send reminder notifications to family members with < 3 activities
   */
  async sendDailyReminders() {
    try {
      console.log('[NotificationService] Checking family members for reminders...');
      
      const users = await storage.getAllUsers();
      const today = getTodayDateString();
      
      for (const user of users) {
        try {
          // Get today's activities for this user
          const activities = await storage.getActivitiesByUserAndDate(user.id, today);
          const activitiesCompleted = activities.length;
          
          console.log(`[NotificationService] ${user.username}: ${activitiesCompleted} activities completed`);
          
          // Send reminder if user has fewer than 3 activities
          if (activitiesCompleted < 3) {
            console.log(`[NotificationService] Sending reminder to ${user.username} (${activitiesCompleted}/3 activities)`);
            await this.sendReminderNotification(user, activitiesCompleted);
          } else {
            console.log(`[NotificationService] ${user.username} has completed 3+ activities, no reminder needed`);
          }
        } catch (error) {
          console.error(`[NotificationService] Error checking activities for ${user.username}:`, error);
        }
      }
    } catch (error) {
      console.error('[NotificationService] Error in sendDailyReminders:', error);
    }
  }

  /**
   * Send a reminder notification to a specific user
   */
  private async sendReminderNotification(user: any, activitiesCompleted: number) {
    const remainingActivities = 3 - activitiesCompleted;
    const activityWord = remainingActivities === 1 ? 'activity' : 'activities';
    
    // Create more descriptive notification messages
    let title = 'Family Activity Tracker';
    let body = '';
    
    if (activitiesCompleted === 0) {
      body = `${user.username}, you haven't logged any activities today! Add your household, health, creative, learning, helping, or play activities to keep your streak going.`;
    } else if (activitiesCompleted === 1) {
      body = `${user.username}, you've completed 1 activity today. Add 2 more activities to reach your daily goal and maintain your streak!`;
    } else if (activitiesCompleted === 2) {
      body = `${user.username}, you're almost there! You've completed 2 activities. Add 1 more to reach your daily goal.`;
    }
    
    const notification: NotificationPayload = {
      title,
      body,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      tag: `family-tracker-reminder-${user.id}`,
      data: {
        userId: user.id,
        username: user.username,
        activitiesCompleted
      }
    };

    console.log(`[NotificationService] Sending reminder to ${user.username} (${activitiesCompleted}/3 activities)`);
    
    // Log the notification with improved details
    this.logNotification(notification);
    
    // Send to browser clients for real-time delivery
    const browserNotification: BrowserNotification = {
      title: notification.title,
      body: notification.body,
      icon: notification.icon,
      tag: notification.tag,
      timestamp: new Date().toISOString(),
      userId: user.id
    };
    
    notificationClient.sendToBrowser(browserNotification);
  }

  /**
   * Log notification for debugging and store for client delivery
   */
  private logNotification(notification: NotificationPayload) {
    console.log('[NotificationService] Notification:', {
      to: notification.data.username,
      title: notification.title,
      body: notification.body,
      timestamp: new Date().toISOString()
    });
    
    // Store notification to be delivered to connected clients
    if (this.pendingNotifications) {
      this.pendingNotifications.push({
        id: `${Date.now()}-${Math.random()}`,
        notification,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Start the notification service
   */
  start() {
    console.log('[NotificationService] Starting notification service...');
    this.scheduleDailyNotifications();
  }

  /**
   * Stop the notification service
   */
  stop() {
    console.log('[NotificationService] Stopping notification service...');
    this.scheduledJobs.forEach((timeout, key) => {
      clearTimeout(timeout);
      console.log(`[NotificationService] Cleared scheduled job: ${key}`);
    });
    this.scheduledJobs.clear();
  }

  /**
   * Test method to manually trigger reminders (for testing)
   */
  async testReminders() {
    console.log('[NotificationService] Manual reminder test triggered');
    await this.sendDailyReminders();
  }
}