import { useEffect, useRef } from 'react';

export function useNotifications() {
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Connect to server-sent events for notifications
    const connectToNotifications = () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const eventSource = new EventSource('/api/notifications/stream');
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log('[Notifications] Connected to notification stream');
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'NOTIFICATION') {
            // Send notification to service worker for display
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
              navigator.serviceWorker.controller.postMessage({
                type: 'SHOW_NOTIFICATION',
                notification: data.notification
              });
            } else {
              // Fallback to browser notification API
              if (Notification.permission === 'granted') {
                new Notification(data.notification.title, {
                  body: data.notification.body,
                  icon: data.notification.icon,
                  tag: data.notification.tag
                });
              }
            }
          }
        } catch (error) {
          console.error('[Notifications] Error parsing notification:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('[Notifications] EventSource error:', error);
        eventSource.close();
        
        // Reconnect after 5 seconds
        setTimeout(connectToNotifications, 5000);
      };
    };

    // Only connect if notifications are supported
    if ('Notification' in window) {
      connectToNotifications();
    }

    // Cleanup on unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return {
    connected: eventSourceRef.current?.readyState === EventSource.OPEN
  };
}