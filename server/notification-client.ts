// Real-time notification delivery system
// This will be used to send notifications from server to browser clients

export interface BrowserNotification {
  title: string;
  body: string;
  icon: string;
  tag: string;
  timestamp: string;
  userId: number;
}

class NotificationClient {
  private static instance: NotificationClient;
  private connectedClients: Map<string, any> = new Map();

  static getInstance(): NotificationClient {
    if (!NotificationClient.instance) {
      NotificationClient.instance = new NotificationClient();
    }
    return NotificationClient.instance;
  }

  // Register a client for receiving notifications
  registerClient(clientId: string, response: any) {
    this.connectedClients.set(clientId, response);
    console.log(`[NotificationClient] Client ${clientId} registered for notifications`);
  }

  // Unregister a client
  unregisterClient(clientId: string) {
    this.connectedClients.delete(clientId);
    console.log(`[NotificationClient] Client ${clientId} unregistered`);
  }

  // Send notification to browser clients
  sendToBrowser(notification: BrowserNotification) {
    const message = JSON.stringify({
      type: 'NOTIFICATION',
      notification
    });

    // Send to all connected clients
    for (const [clientId, response] of this.connectedClients) {
      try {
        response.write(`data: ${message}\n\n`);
        console.log(`[NotificationClient] Sent notification to client ${clientId}`);
      } catch (error) {
        console.log(`[NotificationClient] Error sending to client ${clientId}, removing:`, error);
        this.connectedClients.delete(clientId);
      }
    }
  }

  // Get count of connected clients
  getConnectedCount(): number {
    return this.connectedClients.size;
  }
}

export const notificationClient = NotificationClient.getInstance();