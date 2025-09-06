/**
 * THE ENCHANTED LIBRARY QUEST - SERVICE WORKER
 * FableBox Educational Adventure Game
 * 
 * This service worker enables offline functionality:
 * - Cache game assets for offline play
 * - Manage cache versions and updates
 * - Provide fallback experiences when offline
 * - Optimize performance with smart caching
 * 
 * Offline Philosophy:
 * Learning should never stop because of connectivity.
 * We ensure educational content is always available
 * to children, regardless of internet conditions.
 */

const CACHE_NAME = 'enchanted-library-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Files to cache for offline functionality
const CACHE_URLS = [
    '/',
    '/index.html',
    '/offline.html',
    '/manifest.json',
    
    // CSS
    '/css/styles.css',
    
    // JavaScript Core
    '/js/game.js',
    '/js/scenes.js',
    '/js/puzzles.js',
    '/js/puzzle-system.js',
    '/js/animation-system.js',
    '/js/sound-system.js',
    '/js/save-system.js',
    '/js/achievement-system.js',
    '/js/parent-dashboard.js',
    '/js/monetization-system.js',
    '/js/social-system.js',
    '/js/analytics-system.js',
    '/js/accessibility-system.js',
    '/js/internationalization-system.js',
    
    // Assets
    '/assets/images/characters.svg',
    '/assets/images/backgrounds.svg',
    '/assets/images/ui-elements.svg',
    '/assets/data/gameData.json',
    
    // Demo pages (for development)
    '/demo-features.html',
    '/demo-monetization.html',
    '/test-puzzles.html',
    '/test-assets.html',
    
    // Fonts (for offline dyslexia support)
    'https://fonts.googleapis.com/css2?family=OpenDyslexic&display=swap',
    'https://fonts.googleapis.com/css2?family=Comic+Neue:wght@300;400;700&display=swap',
    'https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap'
];

// Install event - cache resources
self.addEventListener('install', event => {
    console.log('🔧 Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📦 Service Worker: Caching app resources');
                return cache.addAll(CACHE_URLS);
            })
            .then(() => {
                console.log('✅ Service Worker: Installation complete');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('❌ Service Worker: Installation failed', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('🚀 Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            console.log(`🗑️ Service Worker: Deleting old cache ${cacheName}`);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker: Activation complete');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }
    
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version if available
                if (response) {
                    console.log(`📋 Service Worker: Serving from cache: ${event.request.url}`);
                    return response;
                }
                
                // Try to fetch from network
                return fetch(event.request)
                    .then(response => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone the response
                        const responseToCache = response.clone();
                        
                        // Cache the response for future use
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                console.log(`💾 Service Worker: Caching new resource: ${event.request.url}`);
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch(() => {
                        // Network failed, try to serve offline page for navigation requests
                        if (event.request.mode === 'navigate') {
                            return caches.match(OFFLINE_URL);
                        }
                        
                        // For other requests, return a generic offline response
                        return new Response('Offline content not available', {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: new Headers({
                                'Content-Type': 'text/plain'
                            })
                        });
                    });
            })
    );
});

// Background sync for saving progress when back online
self.addEventListener('sync', event => {
    if (event.tag === 'save-progress') {
        console.log('🔄 Service Worker: Background sync - saving progress');
        event.waitUntil(saveProgressToServer());
    }
});

// Push notifications for educational reminders (if enabled)
self.addEventListener('push', event => {
    if (!event.data) return;
    
    try {
        const data = event.data.json();
        console.log('📢 Service Worker: Push notification received', data);
        
        const options = {
            body: data.body || 'Continue your magical learning adventure!',
            icon: '/assets/images/icon-192.png',
            badge: '/assets/images/badge-72.png',
            tag: 'learning-reminder',
            requireInteraction: false,
            actions: [
                {
                    action: 'continue',
                    title: 'Continue Learning',
                    icon: '/assets/images/continue-icon.png'
                },
                {
                    action: 'later',
                    title: 'Remind Later',
                    icon: '/assets/images/later-icon.png'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(
                data.title || 'The Enchanted Library Quest',
                options
            )
        );
    } catch (error) {
        console.error('❌ Service Worker: Push notification error', error);
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    console.log('🔔 Service Worker: Notification clicked', event.action);
    
    event.notification.close();
    
    if (event.action === 'continue') {
        // Open the game
        event.waitUntil(
            clients.openWindow('/')
        );
    } else if (event.action === 'later') {
        // Schedule another reminder (this would integrate with push service)
        console.log('📅 Service Worker: Reminder scheduled for later');
    }
});

// Message handling for communication with main thread
self.addEventListener('message', event => {
    const { type, data } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'CACHE_EDUCATIONAL_CONTENT':
            cacheEducationalContent(data);
            break;
            
        case 'GET_CACHE_STATUS':
            getCacheStatus().then(status => {
                event.ports[0].postMessage(status);
            });
            break;
            
        case 'CLEAR_CACHE':
            clearCache().then(() => {
                event.ports[0].postMessage({ success: true });
            });
            break;
            
        default:
            console.warn('🤷 Service Worker: Unknown message type', type);
    }
});

/**
 * Save progress to server when back online
 */
async function saveProgressToServer() {
    try {
        // Get saved progress from IndexedDB or localStorage
        const progress = await getStoredProgress();
        
        if (progress && progress.length > 0) {
            // Send to server
            const response = await fetch('/api/save-progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(progress)
            });
            
            if (response.ok) {
                console.log('✅ Service Worker: Progress saved to server');
                // Clear local pending saves
                await clearStoredProgress();
            } else {
                console.error('❌ Service Worker: Failed to save progress to server');
            }
        }
    } catch (error) {
        console.error('❌ Service Worker: Error saving progress', error);
    }
}

/**
 * Cache educational content dynamically
 */
async function cacheEducationalContent(content) {
    try {
        const cache = await caches.open(CACHE_NAME);
        
        for (const item of content) {
            if (item.url) {
                await cache.add(item.url);
                console.log(`📚 Service Worker: Cached educational content: ${item.url}`);
            }
        }
    } catch (error) {
        console.error('❌ Service Worker: Error caching educational content', error);
    }
}

/**
 * Get cache status information
 */
async function getCacheStatus() {
    try {
        const cache = await caches.open(CACHE_NAME);
        const keys = await cache.keys();
        
        return {
            name: CACHE_NAME,
            size: keys.length,
            urls: keys.map(request => request.url),
            lastUpdated: new Date().toISOString()
        };
    } catch (error) {
        console.error('❌ Service Worker: Error getting cache status', error);
        return { error: error.message };
    }
}

/**
 * Clear all caches
 */
async function clearCache() {
    try {
        const cacheNames = await caches.keys();
        await Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log('🗑️ Service Worker: All caches cleared');
    } catch (error) {
        console.error('❌ Service Worker: Error clearing cache', error);
        throw error;
    }
}

/**
 * Get stored progress (placeholder - would integrate with actual storage)
 */
async function getStoredProgress() {
    // This would integrate with IndexedDB or other storage mechanism
    return [];
}

/**
 * Clear stored progress (placeholder)
 */
async function clearStoredProgress() {
    // This would clear pending progress data
    console.log('🗑️ Service Worker: Cleared stored progress');
}

// Error handling
self.addEventListener('error', event => {
    console.error('❌ Service Worker: Error', event.error);
});

self.addEventListener('unhandledrejection', event => {
    console.error('❌ Service Worker: Unhandled promise rejection', event.reason);
});

// Periodic background sync for educational reminders
self.addEventListener('periodicsync', event => {
    if (event.tag === 'learning-reminder') {
        event.waitUntil(sendLearningReminder());
    }
});

/**
 * Send learning reminder (placeholder)
 */
async function sendLearningReminder() {
    // This would check user preferences and send appropriate reminders
    console.log('📚 Service Worker: Checking for learning reminders');
}
