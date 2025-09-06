/**
 * THE ENCHANTED LIBRARY QUEST - ANALYTICS & MARKETING SYSTEM
 * FableBox Educational Adventure Game
 * 
 * This file contains comprehensive analytics and marketing tools:
 * - User engagement tracking and behavioral analytics
 * - Conversion funnel optimization for book purchases
 * - A/B testing framework for puzzles and user experience
 * - Heat map generation for choice selection patterns
 * - Marketing attribution and campaign tracking
 * - Business intelligence and revenue optimization
 * 
 * Analytics Philosophy:
 * Data-driven insights that respect user privacy while providing
 * actionable intelligence to improve educational outcomes and
 * business performance.
 */

class AnalyticsSystem {
    constructor(gameEngine) {
        this.game = gameEngine;
        
        // Analytics configuration
        this.config = {
            trackingEnabled: true,
            anonymizeData: true,
            batchSize: 50,
            flushInterval: 30000, // 30 seconds
            maxRetries: 3,
            endpoints: {
                events: 'https://analytics.fablebox.com/events',
                conversions: 'https://analytics.fablebox.com/conversions',
                heatmaps: 'https://analytics.fablebox.com/heatmaps',
                abtests: 'https://analytics.fablebox.com/abtests'
            }
        };
        
        // Session tracking
        this.session = {
            id: this.generateSessionId(),
            startTime: Date.now(),
            userId: this.getUserId(),
            deviceInfo: this.getDeviceInfo(),
            campaign: this.getCampaignData(),
            experiments: new Map(),
            events: [],
            conversionGoals: new Set()
        };
        
        // Engagement metrics
        this.engagement = {
            totalTimeSpent: 0,
            pagesViewed: new Set(),
            actionsPerformed: 0,
            bounceRate: 0,
            conversionRate: 0,
            retentionRate: 0
        };
        
        // Conversion funnel tracking
        this.conversionFunnel = {
            awareness: { // User discovers the game
                gameLoaded: 0,
                landingPageViewed: 0,
                trailerWatched: 0
            },
            interest: { // User shows interest
                gameStarted: 0,
                characterSelected: 0,
                firstPuzzleAttempted: 0
            },
            consideration: { // User explores features
                pathCompleted: 0,
                upgradePromptViewed: 0,
                premiumFeaturesExplored: 0
            },
            purchase: { // User converts
                trialStarted: 0,
                premiumPurchased: 0,
                fableboxDiscountUsed: 0
            },
            retention: { // User returns
                secondSession: 0,
                weeklyActiveUser: 0,
                monthlyActiveUser: 0
            }
        };
        
        // A/B testing framework
        this.abTesting = {
            activeExperiments: new Map(),
            userAssignments: new Map(),
            results: new Map(),
            experiments: {
                puzzle_difficulty: {
                    name: 'Puzzle Difficulty Progression',
                    variants: ['gradual', 'adaptive', 'fixed'],
                    allocation: [0.33, 0.34, 0.33],
                    goal: 'puzzle_completion_rate'
                },
                upgrade_prompt_timing: {
                    name: 'Upgrade Prompt Timing',
                    variants: ['immediate', 'after_path', 'after_achievement'],
                    allocation: [0.33, 0.34, 0.33],
                    goal: 'conversion_rate'
                },
                character_design: {
                    name: 'Character Visual Design',
                    variants: ['classic', 'modern', 'minimalist'],
                    allocation: [0.33, 0.34, 0.33],
                    goal: 'engagement_time'
                },
                fablebox_integration: {
                    name: 'FableBox Integration Prominence',
                    variants: ['subtle', 'moderate', 'prominent'],
                    allocation: [0.33, 0.34, 0.33],
                    goal: 'book_discount_usage'
                }
            }
        };
        
        // Heat map data collection
        this.heatmapData = {
            clicks: new Map(),
            hovers: new Map(),
            scrolls: [],
            choices: new Map(),
            puzzleInteractions: new Map(),
            timeSpent: new Map()
        };
        
        // Marketing attribution
        this.attribution = {
            source: this.getTrafficSource(),
            medium: this.getTrafficMedium(),
            campaign: this.getCampaignName(),
            referrer: document.referrer,
            landingPage: window.location.href,
            utmParameters: this.getUTMParameters()
        };
        
        this.initialize();
    }

    /**
     * Initialize analytics system
     */
    initialize() {
        this.setupEventTracking();
        this.initializeABTests();
        this.startEngagementTracking();
        this.setupHeatmapTracking();
        this.trackSessionStart();
        
        // Start data flush interval
        setInterval(() => this.flushEventBatch(), this.config.flushInterval);
        
        console.log('📊 Analytics system initialized');
    }

    /**
     * Track event with comprehensive data
     */
    trackEvent(eventName, properties = {}, options = {}) {
        if (!this.config.trackingEnabled) return;
        
        const event = {
            name: eventName,
            timestamp: Date.now(),
            sessionId: this.session.id,
            userId: this.session.userId,
            properties: {
                ...properties,
                userAgent: navigator.userAgent,
                viewport: `${window.innerWidth}x${window.innerHeight}`,
                device: this.session.deviceInfo.type,
                browser: this.session.deviceInfo.browser,
                subscription_tier: this.game.monetizationSystem?.subscriptionState?.tier || 'free'
            },
            context: {
                page: window.location.pathname,
                referrer: document.referrer,
                campaign: this.attribution.campaign,
                experiments: Array.from(this.session.experiments.entries())
            }
        };
        
        // Add to event queue
        this.session.events.push(event);
        
        // Update engagement metrics
        this.updateEngagementMetrics(eventName, properties);
        
        // Check for conversion goals
        this.checkConversionGoals(eventName, properties);
        
        // Update funnel
        this.updateConversionFunnel(eventName, properties);
        
        // Track for heat maps
        this.updateHeatmapData(eventName, properties);
        
        // Immediate flush for critical events
        if (options.immediate) {
            this.flushEventBatch();
        }
        
        console.log('📈 Event tracked:', eventName, properties);
    }

    /**
     * Track conversion goal achievement
     */
    trackConversion(goalName, value = 0, currency = 'USD') {
        const conversion = {
            goal: goalName,
            value: value,
            currency: currency,
            timestamp: Date.now(),
            sessionId: this.session.id,
            userId: this.session.userId,
            attribution: this.attribution,
            experiments: Array.from(this.session.experiments.entries())
        };
        
        // Track the conversion
        this.trackEvent('conversion', conversion, { immediate: true });
        
        // Update conversion funnel
        if (goalName === 'premium_purchase') {
            this.conversionFunnel.purchase.premiumPurchased++;
        } else if (goalName === 'trial_start') {
            this.conversionFunnel.purchase.trialStarted++;
        } else if (goalName === 'fablebox_discount_used') {
            this.conversionFunnel.purchase.fableboxDiscountUsed++;
        }
        
        console.log('💰 Conversion tracked:', goalName, value);
    }

    /**
     * Initialize A/B tests for user
     */
    initializeABTests() {
        Object.entries(this.abTesting.experiments).forEach(([experimentId, experiment]) => {
            const variant = this.assignUserToVariant(experimentId, experiment);
            this.session.experiments.set(experimentId, variant);
            
            // Apply variant to game
            this.applyExperimentVariant(experimentId, variant);
        });
        
        // Track experiment assignments
        this.trackEvent('experiments_assigned', {
            assignments: Object.fromEntries(this.session.experiments)
        });
    }

    /**
     * Assign user to A/B test variant
     */
    assignUserToVariant(experimentId, experiment) {
        // Check if user was previously assigned
        const stored = localStorage.getItem(`experiment_${experimentId}`);
        if (stored) {
            return stored;
        }
        
        // Assign based on user ID hash for consistency
        const hash = this.hashString(this.session.userId + experimentId);
        const random = (hash % 100) / 100;
        
        let cumulative = 0;
        for (let i = 0; i < experiment.variants.length; i++) {
            cumulative += experiment.allocation[i];
            if (random <= cumulative) {
                const variant = experiment.variants[i];
                localStorage.setItem(`experiment_${experimentId}`, variant);
                return variant;
            }
        }
        
        // Fallback to first variant
        return experiment.variants[0];
    }

    /**
     * Apply experiment variant to game
     */
    applyExperimentVariant(experimentId, variant) {
        switch (experimentId) {
            case 'puzzle_difficulty':
                if (this.game.puzzleSystem) {
                    this.game.puzzleSystem.difficultyMode = variant;
                }
                break;
                
            case 'upgrade_prompt_timing':
                if (this.game.monetizationSystem) {
                    this.game.monetizationSystem.promptTiming = variant;
                }
                break;
                
            case 'character_design':
                document.documentElement.setAttribute('data-character-style', variant);
                break;
                
            case 'fablebox_integration':
                document.documentElement.setAttribute('data-fablebox-prominence', variant);
                break;
        }
        
        console.log(`🧪 Experiment ${experimentId} applied: ${variant}`);
    }

    /**
     * Track A/B test result
     */
    trackExperimentResult(experimentId, goalValue, goalName = 'default') {
        const variant = this.session.experiments.get(experimentId);
        if (!variant) return;
        
        const result = {
            experimentId: experimentId,
            variant: variant,
            goal: goalName,
            value: goalValue,
            timestamp: Date.now(),
            userId: this.session.userId,
            sessionId: this.session.id
        };
        
        // Store result
        if (!this.abTesting.results.has(experimentId)) {
            this.abTesting.results.set(experimentId, []);
        }
        this.abTesting.results.get(experimentId).push(result);
        
        // Track as event
        this.trackEvent('experiment_result', result);
    }

    /**
     * Setup heat map tracking
     */
    setupHeatmapTracking() {
        // Track clicks
        document.addEventListener('click', (event) => {
            this.trackHeatmapInteraction('click', event);
        });
        
        // Track hovers
        document.addEventListener('mouseover', (event) => {
            this.trackHeatmapInteraction('hover', event);
        });
        
        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                this.heatmapData.scrolls.push({
                    percent: scrollPercent,
                    timestamp: Date.now()
                });
            }
        });
    }

    /**
     * Track heat map interaction
     */
    trackHeatmapInteraction(type, event) {
        const element = event.target;
        const rect = element.getBoundingClientRect();
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        
        const interaction = {
            x: event.clientX,
            y: event.clientY,
            relativeX: event.clientX / viewport.width,
            relativeY: event.clientY / viewport.height,
            element: {
                tagName: element.tagName,
                className: element.className,
                id: element.id,
                text: element.textContent?.substring(0, 50)
            },
            timestamp: Date.now(),
            page: window.location.pathname
        };
        
        // Store interaction
        const key = `${type}_${interaction.page}`;
        if (!this.heatmapData[type].has(key)) {
            this.heatmapData[type].set(key, []);
        }
        this.heatmapData[type].get(key).push(interaction);
        
        // Track choice selections specifically
        if (element.classList.contains('choice-option') || element.classList.contains('choice-button')) {
            this.trackChoiceSelection(element, interaction);
        }
    }

    /**
     * Track puzzle choice selections
     */
    trackChoiceSelection(element, interaction) {
        const puzzleContainer = element.closest('.puzzle-container');
        const sceneContainer = element.closest('.game-screen');
        
        const choiceData = {
            choice: element.textContent || element.getAttribute('data-value'),
            choiceIndex: Array.from(element.parentNode.children).indexOf(element),
            puzzleType: puzzleContainer?.getAttribute('data-puzzle-type'),
            sceneId: sceneContainer?.getAttribute('data-scene-id'),
            position: {
                x: interaction.relativeX,
                y: interaction.relativeY
            },
            timestamp: Date.now()
        };
        
        // Store choice data
        const choiceKey = `${choiceData.sceneId}_${choiceData.puzzleType}`;
        if (!this.heatmapData.choices.has(choiceKey)) {
            this.heatmapData.choices.set(choiceKey, []);
        }
        this.heatmapData.choices.get(choiceKey).push(choiceData);
        
        // Track as analytics event
        this.trackEvent('choice_selected', choiceData);
    }

    /**
     * Generate heat map visualization data
     */
    generateHeatmapVisualization(page, type = 'click') {
        const key = `${type}_${page}`;
        const interactions = this.heatmapData[type].get(key) || [];
        
        // Create density map
        const densityMap = this.createDensityMap(interactions);
        
        return {
            page: page,
            type: type,
            totalInteractions: interactions.length,
            densityMap: densityMap,
            hotspots: this.identifyHotspots(interactions),
            coldspots: this.identifyColdspots(interactions)
        };
    }

    /**
     * Create density map from interactions
     */
    createDensityMap(interactions, gridSize = 20) {
        const grid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
        
        interactions.forEach(interaction => {
            const gridX = Math.floor(interaction.relativeX * gridSize);
            const gridY = Math.floor(interaction.relativeY * gridSize);
            
            if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < gridSize) {
                grid[gridY][gridX]++;
            }
        });
        
        return grid;
    }

    /**
     * Identify interaction hotspots
     */
    identifyHotspots(interactions, threshold = 10) {
        const clusters = new Map();
        const radius = 0.05; // 5% of viewport
        
        interactions.forEach(interaction => {
            let assigned = false;
            
            // Check existing clusters
            for (let [center, count] of clusters) {
                const distance = Math.sqrt(
                    Math.pow(interaction.relativeX - center.x, 2) +
                    Math.pow(interaction.relativeY - center.y, 2)
                );
                
                if (distance <= radius) {
                    clusters.set(center, count + 1);
                    assigned = true;
                    break;
                }
            }
            
            // Create new cluster
            if (!assigned) {
                clusters.set({
                    x: interaction.relativeX,
                    y: interaction.relativeY
                }, 1);
            }
        });
        
        // Filter clusters above threshold
        return Array.from(clusters.entries())
            .filter(([center, count]) => count >= threshold)
            .map(([center, count]) => ({ ...center, count }))
            .sort((a, b) => b.count - a.count);
    }

    /**
     * Identify interaction coldspots
     */
    identifyColdspots(interactions) {
        // Areas with very low interaction despite being interactive elements
        const interactiveElements = document.querySelectorAll('button, a, input, [onclick]');
        const coldspots = [];
        
        interactiveElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const relativeX = (rect.left + rect.width / 2) / window.innerWidth;
            const relativeY = (rect.top + rect.height / 2) / window.innerHeight;
            
            // Count interactions near this element
            const nearbyInteractions = interactions.filter(interaction => {
                const distance = Math.sqrt(
                    Math.pow(interaction.relativeX - relativeX, 2) +
                    Math.pow(interaction.relativeY - relativeY, 2)
                );
                return distance <= 0.02; // 2% radius
            }).length;
            
            // If very few interactions on an interactive element
            if (nearbyInteractions < 2) {
                coldspots.push({
                    x: relativeX,
                    y: relativeY,
                    element: element.tagName + (element.className ? '.' + element.className : ''),
                    interactions: nearbyInteractions
                });
            }
        });
        
        return coldspots;
    }

    /**
     * Update engagement metrics
     */
    updateEngagementMetrics(eventName, properties) {
        this.engagement.actionsPerformed++;
        
        // Track unique pages
        this.engagement.pagesViewed.add(window.location.pathname);
        
        // Calculate time spent
        this.engagement.totalTimeSpent = Date.now() - this.session.startTime;
        
        // Update bounce rate (if user performs meaningful action)
        const meaningfulActions = ['puzzle_solved', 'path_started', 'character_selected'];
        if (meaningfulActions.includes(eventName)) {
            this.engagement.bounceRate = 0; // No longer a bounce
        }
    }

    /**
     * Check for conversion goals
     */
    checkConversionGoals(eventName, properties) {
        const conversionGoals = {
            'trial_started': 'trial_conversion',
            'premium_purchased': 'premium_conversion',
            'discount_used': 'fablebox_conversion',
            'puzzle_solved': 'engagement_goal',
            'achievement_earned': 'retention_goal'
        };
        
        const goalName = conversionGoals[eventName];
        if (goalName && !this.session.conversionGoals.has(goalName)) {
            this.session.conversionGoals.add(goalName);
            this.trackConversion(goalName, properties.value || 1);
        }
    }

    /**
     * Update conversion funnel
     */
    updateConversionFunnel(eventName, properties) {
        const funnelMap = {
            'game_loaded': () => this.conversionFunnel.awareness.gameLoaded++,
            'game_started': () => this.conversionFunnel.interest.gameStarted++,
            'character_selected': () => this.conversionFunnel.interest.characterSelected++,
            'puzzle_attempted': () => this.conversionFunnel.interest.firstPuzzleAttempted++,
            'path_completed': () => this.conversionFunnel.consideration.pathCompleted++,
            'upgrade_prompt_shown': () => this.conversionFunnel.consideration.upgradePromptViewed++,
            'trial_started': () => this.conversionFunnel.purchase.trialStarted++,
            'premium_purchased': () => this.conversionFunnel.purchase.premiumPurchased++
        };
        
        const funnelAction = funnelMap[eventName];
        if (funnelAction) {
            funnelAction();
        }
    }

    /**
     * Update heat map data
     */
    updateHeatmapData(eventName, properties) {
        if (properties.timeSpent && properties.elementId) {
            const key = `${properties.elementId}_${window.location.pathname}`;
            const current = this.heatmapData.timeSpent.get(key) || 0;
            this.heatmapData.timeSpent.set(key, current + properties.timeSpent);
        }
    }

    /**
     * Flush event batch to analytics service
     */
    async flushEventBatch() {
        if (this.session.events.length === 0) return;
        
        const batch = this.session.events.splice(0, this.config.batchSize);
        
        try {
            await this.sendEventsToService(batch);
            console.log(`📤 Sent ${batch.length} events to analytics service`);
        } catch (error) {
            console.warn('Failed to send analytics batch:', error);
            // Re-queue events for retry
            this.session.events.unshift(...batch);
        }
    }

    /**
     * Send events to analytics service
     */
    async sendEventsToService(events) {
        if (!this.config.endpoints.events) return;
        
        const payload = {
            session: this.session.id,
            user: this.session.userId,
            timestamp: Date.now(),
            events: events
        };
        
        // In production, send to actual analytics service
        // This is a demo implementation
        console.log('📊 Analytics payload:', payload);
        
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(resolve, 100);
        });
    }

    /**
     * Track session start
     */
    trackSessionStart() {
        this.trackEvent('session_start', {
            userAgent: navigator.userAgent,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            referrer: document.referrer,
            campaign: this.attribution.campaign,
            source: this.attribution.source
        }, { immediate: true });
    }

    /**
     * Setup event tracking for game interactions
     */
    setupEventTracking() {
        // Track page visibility
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.trackEvent('page_hidden');
            } else {
                this.trackEvent('page_visible');
            }
        });
        
        // Track errors
        window.addEventListener('error', (event) => {
            this.trackEvent('javascript_error', {
                message: event.message,
                filename: event.filename,
                line: event.lineno,
                column: event.colno
            });
        });
        
        // Track unload
        window.addEventListener('beforeunload', () => {
            this.trackEvent('session_end', {
                duration: Date.now() - this.session.startTime,
                engagement: this.engagement
            }, { immediate: true });
        });
    }

    /**
     * Start engagement tracking
     */
    startEngagementTracking() {
        // Track time on page
        setInterval(() => {
            if (!document.hidden) {
                this.trackEvent('time_on_page', {
                    page: window.location.pathname,
                    duration: 30000 // 30 second intervals
                });
            }
        }, 30000);
        
        // Track idle time
        let idleTimer;
        const resetIdleTimer = () => {
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => {
                this.trackEvent('user_idle', {
                    idleDuration: 300000 // 5 minutes
                });
            }, 300000);
        };
        
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, resetIdleTimer, true);
        });
    }

    /**
     * Get conversion funnel analysis
     */
    getConversionFunnelAnalysis() {
        const total = this.conversionFunnel.awareness.gameLoaded || 1;
        
        return {
            awareness: {
                gameLoaded: this.conversionFunnel.awareness.gameLoaded,
                rate: 100 // Base rate
            },
            interest: {
                gameStarted: this.conversionFunnel.interest.gameStarted,
                rate: (this.conversionFunnel.interest.gameStarted / total) * 100
            },
            consideration: {
                pathCompleted: this.conversionFunnel.consideration.pathCompleted,
                rate: (this.conversionFunnel.consideration.pathCompleted / total) * 100
            },
            purchase: {
                premiumPurchased: this.conversionFunnel.purchase.premiumPurchased,
                rate: (this.conversionFunnel.purchase.premiumPurchased / total) * 100
            }
        };
    }

    /**
     * Utility functions
     */
    generateSessionId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getUserId() {
        let userId = localStorage.getItem('enchantedLibrary_userId');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('enchantedLibrary_userId', userId);
        }
        return userId;
    }

    getDeviceInfo() {
        const ua = navigator.userAgent;
        return {
            type: /Mobile|Android|iPhone|iPad/.test(ua) ? 'mobile' : 'desktop',
            browser: this.getBrowserName(ua),
            os: this.getOSName(ua),
            screen: `${screen.width}x${screen.height}`
        };
    }

    getBrowserName(userAgent) {
        if (userAgent.includes('Chrome')) return 'Chrome';
        if (userAgent.includes('Firefox')) return 'Firefox';
        if (userAgent.includes('Safari')) return 'Safari';
        if (userAgent.includes('Edge')) return 'Edge';
        return 'Unknown';
    }

    getOSName(userAgent) {
        if (userAgent.includes('Windows')) return 'Windows';
        if (userAgent.includes('Mac')) return 'macOS';
        if (userAgent.includes('Linux')) return 'Linux';
        if (userAgent.includes('Android')) return 'Android';
        if (userAgent.includes('iOS')) return 'iOS';
        return 'Unknown';
    }

    getCampaignData() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            source: urlParams.get('utm_source'),
            medium: urlParams.get('utm_medium'),
            campaign: urlParams.get('utm_campaign'),
            content: urlParams.get('utm_content'),
            term: urlParams.get('utm_term')
        };
    }

    getTrafficSource() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('utm_source') || this.deriveTrafficSource();
    }

    getTrafficMedium() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('utm_medium') || 'organic';
    }

    getCampaignName() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('utm_campaign') || 'direct';
    }

    getUTMParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            source: urlParams.get('utm_source'),
            medium: urlParams.get('utm_medium'),
            campaign: urlParams.get('utm_campaign'),
            content: urlParams.get('utm_content'),
            term: urlParams.get('utm_term')
        };
    }

    deriveTrafficSource() {
        const referrer = document.referrer;
        if (!referrer) return 'direct';
        if (referrer.includes('google')) return 'google';
        if (referrer.includes('facebook')) return 'facebook';
        if (referrer.includes('twitter')) return 'twitter';
        if (referrer.includes('instagram')) return 'instagram';
        return 'referral';
    }

    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }

    /**
     * Clean up analytics system
     */
    destroy() {
        // Flush remaining events
        this.flushEventBatch();
        
        // Track session end
        this.trackEvent('session_end', {
            duration: Date.now() - this.session.startTime,
            engagement: this.engagement
        }, { immediate: true });
        
        console.log('📊 Analytics system destroyed');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalyticsSystem;
} else {
    window.AnalyticsSystem = AnalyticsSystem;
}
