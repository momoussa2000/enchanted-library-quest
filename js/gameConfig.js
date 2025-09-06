/**
 * THE ENCHANTED LIBRARY QUEST - GAME CONFIGURATION
 * FableBox Educational Adventure Game
 * 
 * Centralized configuration management for all game systems.
 * This file controls feature flags, API endpoints, and game behavior
 * without requiring code changes for different environments.
 * 
 * Configuration Philosophy:
 * Flexible, environment-aware settings that allow the game
 * to adapt to different deployment scenarios while maintaining
 * a consistent educational experience for children.
 */

const CONFIG = {
    // Game Information
    VERSION: '1.0.0',
    NAME: 'The Enchanted Library Quest',
    DEVELOPER: 'FableBox',
    BUILD_DATE: new Date().toISOString(),
    
    // Environment Settings
    ENVIRONMENT: 'development', // development, staging, production
    DEBUG_MODE: true,
    VERBOSE_LOGGING: true,
    
    // API Configuration
    API_ENDPOINT: 'https://api.fablebox.net/game',
    ANALYTICS_ID: 'UA-FABLEBOX-GAME',
    FABLEBOX_API: 'https://api.fablebox.net/v1',
    CDN_URL: 'https://cdn.fablebox.net/games/enchanted-library',
    
    // Educational Settings
    TARGET_AGE_RANGE: { min: 4, max: 12 },
    DIFFICULTY_LEVELS: ['apprentice', 'scholar', 'master'],
    COMMON_CORE_ALIGNED: true,
    LEARNING_OBJECTIVES: {
        math: ['counting', 'addition', 'subtraction', 'patterns', 'problem_solving'],
        language: ['phonics', 'vocabulary', 'reading_comprehension', 'sentence_structure'],
        science: ['observation', 'classification', 'weather', 'animals', 'geography']
    },
    
    // Monetization Configuration
    PREMIUM_FEATURES: false, // Toggle premium features
    DAILY_PLAY_LIMIT: 1, // Free tier daily limit
    TRIAL_DURATION_DAYS: 7,
    SUBSCRIPTION_PRICE: 9.99,
    FABLEBOX_DISCOUNT_PERCENT: 20,
    
    // Feature Flags
    FEATURES: {
        // Core Features
        AUTO_SAVE: true,
        OFFLINE_MODE: true,
        ACCESSIBILITY: true,
        INTERNATIONALIZATION: true,
        
        // Audio/Visual Features
        SOUNDS_ENABLED: false, // Enable when audio assets ready
        BACKGROUND_MUSIC: false, // Enable with sound assets
        VOICE_NARRATION: false, // Enable with voice assets
        PARTICLE_EFFECTS: true,
        ADVANCED_ANIMATIONS: true,
        
        // Social Features
        SOCIAL_SHARING: true,
        FRIEND_INVITES: true,
        LEADERBOARDS: true,
        ACHIEVEMENTS: true,
        
        // Analytics & Optimization
        ANALYTICS_TRACKING: true,
        AB_TESTING: true,
        HEATMAP_TRACKING: true,
        ERROR_REPORTING: true,
        
        // Progressive Web App
        PWA_INSTALL: true,
        PUSH_NOTIFICATIONS: false, // Enable when ready
        BACKGROUND_SYNC: true,
        
        // Parental Features
        PARENT_DASHBOARD: true,
        PROGRESS_REPORTS: true,
        TIME_TRACKING: true,
        LEARNING_INSIGHTS: true
    },
    
    // Game Mechanics
    GAMEPLAY: {
        SAVE_INTERVAL: 30000, // 30 seconds auto-save
        MAX_HINTS_PER_PUZZLE: 3,
        STAR_RATING_SYSTEM: true,
        ACHIEVEMENT_NOTIFICATIONS: true,
        PUZZLE_TIMEOUT: 300000, // 5 minutes (if enabled)
        CELEBRATION_DURATION: 3000, // 3 seconds
        
        // Difficulty Adaptation
        ADAPTIVE_DIFFICULTY: true,
        SUCCESS_THRESHOLD: 0.7, // 70% success rate
        DIFFICULTY_ADJUSTMENT_RATE: 0.1,
        
        // Progress Requirements
        MIN_SCORE_TO_PROGRESS: 0.6, // 60% to move forward
        MASTERY_SCORE: 0.9, // 90% for mastery
        RETRY_LIMIT: -1 // Unlimited retries (-1)
    },
    
    // User Interface
    UI: {
        THEME: 'magical', // magical, colorblind-friendly, high-contrast
        DEFAULT_LANGUAGE: 'en-US',
        SUPPORTED_LANGUAGES: [
            'en-US', 'es-ES', 'es-MX', 'fr-FR', 'pt-BR', 
            'de-DE', 'zh-CN', 'ja-JP', 'ar-SA'
        ],
        
        // Accessibility
        DEFAULT_FONT: 'system',
        DYSLEXIA_FONTS: ['OpenDyslexic', 'Comic Neue', 'Lexend'],
        HIGH_CONTRAST_MODE: false,
        REDUCED_MOTION: false,
        LARGE_TEXT: false,
        
        // Mobile Optimization
        TOUCH_TARGETS_MIN_SIZE: 48, // pixels
        SWIPE_GESTURES: true,
        HAPTIC_FEEDBACK: true
    },
    
    // Performance Settings
    PERFORMANCE: {
        MAX_PARTICLES: 100,
        ANIMATION_FRAME_RATE: 60,
        ASSET_PRELOADING: true,
        LAZY_LOADING: true,
        IMAGE_OPTIMIZATION: true,
        
        // Caching
        CACHE_DURATION: 86400000, // 24 hours
        SERVICE_WORKER_ENABLED: true,
        OFFLINE_CACHE_SIZE: 50, // MB
        
        // Network
        API_TIMEOUT: 10000, // 10 seconds
        RETRY_ATTEMPTS: 3,
        OFFLINE_FALLBACK: true
    },
    
    // Content Configuration
    CONTENT: {
        STORY_PATHS: ['dragon', 'wizard', 'mouse'],
        TOTAL_SCENES: 50,
        PUZZLES_PER_PATH: 15,
        CHARACTERS: ['ruby', 'sage', 'scout', 'owl_guardian'],
        
        // Educational Content
        MATH_TOPICS: ['counting', 'addition', 'subtraction', 'patterns', 'shapes'],
        LANGUAGE_TOPICS: ['letters', 'sounds', 'words', 'sentences', 'stories'],
        SCIENCE_TOPICS: ['animals', 'plants', 'weather', 'space', 'earth'],
        
        // Difficulty Distribution
        DIFFICULTY_DISTRIBUTION: {
            apprentice: 0.4, // 40% easy
            scholar: 0.4,    // 40% medium
            master: 0.2      // 20% hard
        }
    },
    
    // Analytics Configuration
    ANALYTICS: {
        TRACK_USER_EVENTS: true,
        TRACK_EDUCATIONAL_PROGRESS: true,
        TRACK_ENGAGEMENT_TIME: true,
        TRACK_ERROR_RATES: true,
        
        // Privacy
        ANONYMIZE_DATA: true,
        COPPA_COMPLIANT: true,
        GDPR_COMPLIANT: true,
        
        // Reporting
        BATCH_SIZE: 50,
        FLUSH_INTERVAL: 30000, // 30 seconds
        OFFLINE_STORAGE: true
    },
    
    // Security & Privacy
    SECURITY: {
        CONTENT_SECURITY_POLICY: true,
        CHILD_SAFE_BROWSING: true,
        NO_EXTERNAL_LINKS: true,
        SECURE_API_CALLS: true,
        
        // Data Protection
        LOCAL_STORAGE_ENCRYPTION: false,
        SESSION_TIMEOUT: 3600000, // 1 hour
        AUTO_LOGOUT: false
    },
    
    // Development Tools
    DEV: {
        SHOW_FPS: false,
        SHOW_DEBUG_INFO: false,
        QUICK_NAVIGATION: false,
        SKIP_INTRO: false,
        UNLOCK_ALL_CONTENT: false,
        
        // Testing
        MOCK_API_RESPONSES: false,
        SIMULATE_SLOW_NETWORK: false,
        FORCE_OFFLINE_MODE: false
    },
    
    // External Integrations
    INTEGRATIONS: {
        GOOGLE_ANALYTICS: false,
        MIXPANEL: false,
        SENTRY_ERROR_REPORTING: false,
        STRIPE_PAYMENTS: false,
        
        // FableBox Services
        FABLEBOX_BOOKS_API: true,
        FABLEBOX_USER_ACCOUNTS: false,
        FABLEBOX_RECOMMENDATIONS: true
    },
    
    // Asset URLs (for production deployment)
    ASSETS: {
        IMAGES_BASE_URL: './assets/images/',
        SOUNDS_BASE_URL: './assets/sounds/',
        FONTS_BASE_URL: './assets/fonts/',
        DATA_BASE_URL: './assets/data/',
        
        // CDN URLs (for production)
        CDN_IMAGES: 'https://cdn.fablebox.net/games/enchanted-library/images/',
        CDN_SOUNDS: 'https://cdn.fablebox.net/games/enchanted-library/sounds/',
        CDN_FONTS: 'https://cdn.fablebox.net/games/enchanted-library/fonts/'
    },
    
    // Localization
    LOCALIZATION: {
        DEFAULT_LOCALE: 'en-US',
        FALLBACK_LOCALE: 'en-US',
        AUTO_DETECT_LANGUAGE: true,
        RTL_LANGUAGES: ['ar-SA', 'he-IL', 'fa-IR'],
        
        // Content Adaptation
        CULTURAL_ADAPTATION: true,
        LOCAL_NUMBER_FORMATS: true,
        LOCAL_DATE_FORMATS: true,
        LOCAL_CURRENCY_FORMATS: true
    }
};

// Environment-specific overrides
if (typeof window !== 'undefined') {
    // Browser environment - check for environment indicators
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        // Development environment
        CONFIG.ENVIRONMENT = 'development';
        CONFIG.DEBUG_MODE = true;
        CONFIG.VERBOSE_LOGGING = true;
        CONFIG.DEV.SHOW_DEBUG_INFO = true;
        CONFIG.INTEGRATIONS.MOCK_API_RESPONSES = true;
    } else if (hostname.includes('staging') || hostname.includes('dev.')) {
        // Staging environment
        CONFIG.ENVIRONMENT = 'staging';
        CONFIG.DEBUG_MODE = true;
        CONFIG.VERBOSE_LOGGING = false;
        CONFIG.PREMIUM_FEATURES = true;
        CONFIG.FEATURES.SOUNDS_ENABLED = true;
    } else if (hostname.includes('fablebox.net')) {
        // Production environment
        CONFIG.ENVIRONMENT = 'production';
        CONFIG.DEBUG_MODE = false;
        CONFIG.VERBOSE_LOGGING = false;
        CONFIG.PREMIUM_FEATURES = true;
        CONFIG.FEATURES.SOUNDS_ENABLED = true;
        CONFIG.FEATURES.BACKGROUND_MUSIC = true;
        CONFIG.FEATURES.VOICE_NARRATION = true;
        CONFIG.FEATURES.PUSH_NOTIFICATIONS = true;
        CONFIG.INTEGRATIONS.GOOGLE_ANALYTICS = true;
        CONFIG.INTEGRATIONS.STRIPE_PAYMENTS = true;
    }
}

// Utility functions for configuration management
CONFIG.isFeatureEnabled = function(featureName) {
    const keys = featureName.split('.');
    let current = this.FEATURES;
    
    for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
            current = current[key];
        } else {
            return false;
        }
    }
    
    return Boolean(current);
};

CONFIG.getAssetUrl = function(assetType, assetName) {
    const baseUrl = this.ENVIRONMENT === 'production' 
        ? this.ASSETS[`CDN_${assetType.toUpperCase()}`] 
        : this.ASSETS[`${assetType.toUpperCase()}_BASE_URL`];
        
    return baseUrl + assetName;
};

CONFIG.isDevelopment = function() {
    return this.ENVIRONMENT === 'development';
};

CONFIG.isProduction = function() {
    return this.ENVIRONMENT === 'production';
};

CONFIG.getPremiumFeatures = function() {
    return this.PREMIUM_FEATURES;
};

CONFIG.getMaxDailyPlays = function() {
    return this.PREMIUM_FEATURES ? -1 : this.DAILY_PLAY_LIMIT;
};

// Validation function
CONFIG.validate = function() {
    const errors = [];
    
    // Required fields
    if (!this.VERSION) errors.push('VERSION is required');
    if (!this.API_ENDPOINT) errors.push('API_ENDPOINT is required');
    
    // Age range validation
    if (this.TARGET_AGE_RANGE.min >= this.TARGET_AGE_RANGE.max) {
        errors.push('Invalid age range: min must be less than max');
    }
    
    // Price validation
    if (this.SUBSCRIPTION_PRICE <= 0) {
        errors.push('SUBSCRIPTION_PRICE must be positive');
    }
    
    // Feature consistency
    if (this.FEATURES.SOUNDS_ENABLED && !this.FEATURES.BACKGROUND_MUSIC) {
        console.warn('⚠️ Sounds enabled but background music disabled');
    }
    
    if (errors.length > 0) {
        console.error('❌ Configuration validation errors:', errors);
        return false;
    }
    
    console.log('✅ Configuration validation passed');
    return true;
};

// Initialize configuration
CONFIG.validate();

// Log configuration in development
if (CONFIG.isDevelopment()) {
    console.log('🔧 Game Configuration Loaded:', {
        version: CONFIG.VERSION,
        environment: CONFIG.ENVIRONMENT,
        features: Object.keys(CONFIG.FEATURES).filter(key => CONFIG.FEATURES[key]),
        debug: CONFIG.DEBUG_MODE
    });
}

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}

// Make it globally accessible
window.GameConfig = CONFIG;
