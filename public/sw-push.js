// Push notification service worker
self.addEventListener('push', function(event) {
  console.log('Push event received:', event);
  
  if (!event.data) {
    return;
  }

  let data;
  try {
    data = event.data.json();
  } catch (e) {
    data = {
      title: 'GreenBank Notification',
      body: event.data.text() || 'You have a new notification',
      icon: '/logo.png',
      badge: '/logo.png'
    };
  }

  const options = {
    body: data.body,
    icon: data.icon || '/logo.png',
    badge: data.badge || '/logo.png',
    tag: data.tag || 'banking-notification',
    data: data.data || {},
    actions: data.actions || [
      {
        action: 'view',
        title: 'View',
        icon: '/logo.png'
      }
    ],
    requireInteraction: data.requireInteraction || false,
    vibrate: [200, 100, 200],
    timestamp: Date.now()
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  const action = event.action;
  const data = event.notification.data;

  if (action === 'view' || !action) {
    // Open the app
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
        // If app is already open, focus it
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // If app is not open, open it
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  } else if (action === 'pay') {
    // Handle pay action
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.postMessage({ action: 'navigate', path: '/payments/bills' });
            return client.focus();
          }
        }
        
        if (clients.openWindow) {
          return clients.openWindow('/payments/bills');
        }
      })
    );
  } else if (action === 'review') {
    // Handle security review action
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.postMessage({ action: 'navigate', path: '/profile' });
            return client.focus();
          }
        }
        
        if (clients.openWindow) {
          return clients.openWindow('/profile');
        }
      })
    );
  }
});

self.addEventListener('notificationclose', function(event) {
  console.log('Notification closed:', event);
  
  // Track notification dismissal if needed
  const data = event.notification.data;
  if (data && data.trackDismissal) {
    // Send analytics or tracking data
    console.log('Notification dismissed:', data);
  }
});

// Handle background sync for offline notifications
self.addEventListener('sync', function(event) {
  if (event.tag === 'background-notification') {
    event.waitUntil(
      // Process any queued notifications
      processQueuedNotifications()
    );
  }
});

async function processQueuedNotifications() {
  // This would typically fetch queued notifications from IndexedDB
  // and display them when the device comes back online
  console.log('Processing queued notifications...');
}