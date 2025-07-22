const CACHE_NAME = 'family-tracker-v3-' + Date.now();
const STATIC_CACHE = 'static-v1';

// Install event - cache resources and skip waiting
self.addEventListener('install', event => {
  console.log('Service worker installing...');
  // Skip waiting to activate immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching app shell');
        return cache.addAll([
          '/',
          '/manifest.json'
        ]);
      })
      .catch(error => {
        console.log('Cache install failed:', error);
      })
  );
});

// Fetch event - network first, then cache
self.addEventListener('fetch', event => {
  // Skip caching for API requests
  if (event.request.url.includes('/api/')) {
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone the response before caching
        const responseClone = response.clone();
        
        // Cache successful responses
        if (response.ok) {
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseClone);
            });
        }
        
        return response;
      })
      .catch(() => {
        // Fallback to cache when network fails
        return caches.match(event.request)
          .then(response => {
            return response || caches.match('/');
          });
      })
  );
});

// Activate event - clean up old caches and claim clients
self.addEventListener('activate', event => {
  console.log('Service worker activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      console.log('Cleaning up old caches');
      return Promise.all(
        cacheNames.map(cacheName => {
          console.log('Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      // Claim all clients immediately and force reload
      return self.clients.claim().then(() => {
        return self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({ type: 'CACHE_UPDATED' });
          });
        });
      });
    })
  );
});

// Listen for messages from the main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    // Show notification
    const { title, body, icon, tag, data } = event.data.notification;
    self.registration.showNotification(title, {
      body,
      icon: icon || '/icon-192x192.png',
      badge: '/icon-192x192.png',
      tag: tag || 'family-activity-reminder',
      data: data || { url: '/' },
      requireInteraction: false,
      silent: false
    });
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('Notification clicked:', event.notification);
  
  // Close the notification
  event.notification.close();
  
  // Focus or open the app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // If app is already open, focus it
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // If app is not open, open it
        if (clients.openWindow) {
          const url = event.notification.data?.url || self.location.origin;
          return clients.openWindow(url);
        }
      })
  );
});