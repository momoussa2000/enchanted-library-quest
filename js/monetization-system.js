/**
 * THE ENCHANTED LIBRARY QUEST - MONETIZATION SYSTEM
 * FableBox Educational Adventure Game
 * 
 * This file contains the comprehensive monetization and marketing system:
 * - Free vs Premium access control with daily limits
 * - 7-day trial system with graceful conversion prompts
 * - FableBox integration for book discounts and character customization
 * - Social sharing features and viral growth mechanics
 * - Analytics tracking for engagement and conversion optimization
 * 
 * Monetization Philosophy:
 * Provides genuine value through educational content while creating natural
 * upgrade incentives that enhance rather than restrict the learning experience.
 */

class MonetizationSystem {
    constructor(gameEngine) {
        this.game = gameEngine;
        
        // Subscription tiers
        this.tiers = {
            free: {
                name: 'Free Explorer',
                dailyPaths: 1,
                totalPaths: 3,
                features: ['Basic story paths', 'Core puzzles', 'Progress tracking'],
                restrictions: ['One path per day', 'Ads between sessions', 'Basic achievements']
            },
            trial: {
                name: '7-Day Adventure Trial',
                dailyPaths: -1, // unlimited
                totalPaths: -1, // unlimited
                duration: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
                features: ['All premium features', 'Unlimited paths', 'No ads', 'Special stories'],
                endDate: null
            },
            premium: {
                name: 'Premium Library Guardian',
                price: 9.99,
                currency: 'USD',
                billing: 'monthly',
                dailyPaths: -1, // unlimited
                totalPaths: -1, // unlimited
                features: [
                    'Unlimited story paths',
                    'Exclusive FableBox character stories',
                    'Advanced parent dashboard',
                    'Priority customer support',
                    'Ad-free experience',
                    'Early access to new content',
                    'Premium achievement badges',
                    'Family sharing (up to 4 children)'
                ]
            }
        };
        
        // User subscription state
        this.subscriptionState = {
            tier: 'free',
            startDate: Date.now(),
            endDate: null,
            trialUsed: false,
            pathsPlayedToday: 0,
            lastPlayDate: null,
            conversionAttempts: 0,
            engagementScore: 0
        };
        
        // FableBox integration
        this.fableboxIntegration = {
            apiEndpoint: 'https://api.fablebox.com/game-integration',
            discountCode: null,
            characterCustomization: null,
            bookOrderHistory: [],
            loyaltyPoints: 0
        };
        
        // Analytics tracking
        this.analytics = {
            sessionStart: Date.now(),
            engagementEvents: [],
            conversionFunnel: {
                gameStart: 0,
                pathCompleted: 0,
                upgradePromptShown: 0,
                trialStarted: 0,
                premiumPurchased: 0,
                bookDiscountUsed: 0
            },
            heatmapData: new Map(),
            abTestVariants: new Map()
        };
        
        // Social features
        this.socialFeatures = {
            friendsList: [],
            inviteCode: this.generateInviteCode(),
            leaderboardScores: [],
            familyAccount: null,
            shareableContent: []
        };
        
        this.initialize();
    }

    /**
     * Initialize monetization system
     */
    initialize() {
        this.loadSubscriptionState();
        this.checkDailyLimits();
        this.initializeAnalytics();
        this.setupConversionPrompts();
        this.trackEngagementEvent('system_init');
        
        console.log('💰 Monetization system initialized');
    }

    /**
     * Load subscription state from storage
     */
    loadSubscriptionState() {
        try {
            const saved = localStorage.getItem('enchantedLibrary_subscription');
            if (saved) {
                const data = JSON.parse(saved);
                this.subscriptionState = { ...this.subscriptionState, ...data };
                
                // Check if trial has expired
                if (this.subscriptionState.tier === 'trial' && this.subscriptionState.endDate) {
                    if (Date.now() > this.subscriptionState.endDate) {
                        this.handleTrialExpired();
                    }
                }
            }
        } catch (error) {
            console.warn('Failed to load subscription state:', error);
        }
    }

    /**
     * Save subscription state
     */
    saveSubscriptionState() {
        try {
            localStorage.setItem('enchantedLibrary_subscription', JSON.stringify(this.subscriptionState));
        } catch (error) {
            console.warn('Failed to save subscription state:', error);
        }
    }

    /**
     * Check daily path limits
     */
    checkDailyLimits() {
        const today = new Date().toDateString();
        const lastPlayDate = this.subscriptionState.lastPlayDate;
        
        // Reset daily counter if it's a new day
        if (!lastPlayDate || new Date(lastPlayDate).toDateString() !== today) {
            this.subscriptionState.pathsPlayedToday = 0;
            this.subscriptionState.lastPlayDate = today;
            this.saveSubscriptionState();
        }
    }

    /**
     * Check if user can start a new path
     */
    canStartPath() {
        const tier = this.tiers[this.subscriptionState.tier];
        
        if (tier.dailyPaths === -1) {
            return { allowed: true, reason: 'unlimited' };
        }
        
        if (this.subscriptionState.pathsPlayedToday >= tier.dailyPaths) {
            return { 
                allowed: false, 
                reason: 'daily_limit_reached',
                message: 'Daily path limit reached! Upgrade to Premium for unlimited access.',
                resetTime: this.getNextResetTime()
            };
        }
        
        return { allowed: true, reason: 'within_limit' };
    }

    /**
     * Start a new path (tracks usage)
     */
    startPath(pathId) {
        const canStart = this.canStartPath();
        
        if (!canStart.allowed) {
            this.showUpgradePrompt(canStart.reason, canStart.message);
            return false;
        }
        
        // Track path start
        this.subscriptionState.pathsPlayedToday++;
        this.saveSubscriptionState();
        
        // Analytics tracking
        this.trackEngagementEvent('path_started', { pathId });
        this.analytics.conversionFunnel.pathCompleted++;
        
        return true;
    }

    /**
     * Start 7-day trial
     */
    startTrial() {
        if (this.subscriptionState.trialUsed) {
            this.game.showNotification('Trial already used. Upgrade to Premium for unlimited access!', 'warning');
            return false;
        }
        
        this.subscriptionState.tier = 'trial';
        this.subscriptionState.endDate = Date.now() + this.tiers.trial.duration;
        this.subscriptionState.trialUsed = true;
        this.saveSubscriptionState();
        
        // Track trial start
        this.trackEngagementEvent('trial_started');
        this.analytics.conversionFunnel.trialStarted++;
        
        // Show trial welcome
        this.showTrialWelcome();
        
        // Schedule trial reminders
        this.scheduleTrialReminders();
        
        console.log('🆓 7-day trial started');
        return true;
    }

    /**
     * Upgrade to premium
     */
    async upgradeToPremium() {
        try {
            // In production, integrate with payment processor (Stripe, etc.)
            const paymentResult = await this.processPayment();
            
            if (paymentResult.success) {
                this.subscriptionState.tier = 'premium';
                this.subscriptionState.endDate = null; // No expiration for premium
                this.saveSubscriptionState();
                
                // Track conversion
                this.trackEngagementEvent('premium_purchased');
                this.analytics.conversionFunnel.premiumPurchased++;
                
                // Show welcome and benefits
                this.showPremiumWelcome();
                
                // Generate FableBox discount
                this.generateFableBoxDiscount();
                
                console.log('💎 Upgraded to Premium successfully');
                return true;
            }
        } catch (error) {
            console.error('Premium upgrade failed:', error);
            this.game.showNotification('Upgrade failed. Please try again.', 'error');
        }
        
        return false;
    }

    /**
     * Show upgrade prompt based on context
     */
    showUpgradePrompt(reason, message) {
        this.analytics.conversionFunnel.upgradePromptShown++;
        this.subscriptionState.conversionAttempts++;
        
        const prompt = document.createElement('div');
        prompt.className = 'upgrade-prompt-overlay';
        prompt.innerHTML = this.generateUpgradePromptHTML(reason, message);
        
        document.body.appendChild(prompt);
        
        // Add event listeners
        this.setupUpgradePromptListeners(prompt);
        
        // Track prompt shown
        this.trackEngagementEvent('upgrade_prompt_shown', { reason });
    }

    /**
     * Generate upgrade prompt HTML
     */
    generateUpgradePromptHTML(reason, message) {
        const tier = this.tiers[this.subscriptionState.tier];
        const canTrial = !this.subscriptionState.trialUsed;
        
        return `
            <div class="upgrade-prompt">
                <div class="upgrade-content">
                    <div class="upgrade-header">
                        <h2>✨ Unlock the Full Adventure!</h2>
                        <button class="close-prompt" onclick="this.closest('.upgrade-prompt-overlay').remove()">✕</button>
                    </div>
                    
                    <div class="limitation-message">
                        <div class="limitation-icon">🔒</div>
                        <p>${message}</p>
                    </div>
                    
                    <div class="upgrade-options">
                        ${canTrial ? `
                            <div class="upgrade-option trial-option">
                                <div class="option-header">
                                    <h3>🆓 Start Free Trial</h3>
                                    <div class="option-badge">Most Popular</div>
                                </div>
                                <div class="option-features">
                                    <ul>
                                        ${this.tiers.trial.features.map(f => `<li>✅ ${f}</li>`).join('')}
                                    </ul>
                                </div>
                                <div class="option-price">Free for 7 days</div>
                                <button class="upgrade-btn trial-btn" onclick="monetizationSystem.handleTrialStart()">
                                    Start Free Trial
                                </button>
                            </div>
                        ` : ''}
                        
                        <div class="upgrade-option premium-option">
                            <div class="option-header">
                                <h3>💎 Premium Access</h3>
                                <div class="option-badge premium">Best Value</div>
                            </div>
                            <div class="option-features">
                                <ul>
                                    ${this.tiers.premium.features.slice(0, 4).map(f => `<li>⭐ ${f}</li>`).join('')}
                                    <li class="feature-highlight">🎁 + 20% FableBox book discount!</li>
                                </ul>
                            </div>
                            <div class="option-price">
                                $${this.tiers.premium.price}/month
                                <span class="price-note">Cancel anytime</span>
                            </div>
                            <button class="upgrade-btn premium-btn" onclick="monetizationSystem.handlePremiumUpgrade()">
                                Upgrade Now
                            </button>
                        </div>
                    </div>
                    
                    <div class="upgrade-benefits">
                        <div class="benefit-item">
                            <span class="benefit-icon">📚</span>
                            <span>Connect with your FableBox books</span>
                        </div>
                        <div class="benefit-item">
                            <span class="benefit-icon">👨‍👩‍👧‍👦</span>
                            <span>Family dashboard & progress tracking</span>
                        </div>
                        <div class="benefit-item">
                            <span class="benefit-icon">🎮</span>
                            <span>New adventures added monthly</span>
                        </div>
                    </div>
                    
                    <div class="social-proof">
                        <p>⭐⭐⭐⭐⭐ "My kids love the unlimited access!" - Sarah M.</p>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Handle trial start from UI
     */
    handleTrialStart() {
        if (this.startTrial()) {
            document.querySelector('.upgrade-prompt-overlay')?.remove();
            this.game.showNotification('🎉 Trial activated! Enjoy 7 days of unlimited access!', 'success');
        }
    }

    /**
     * Handle premium upgrade from UI
     */
    async handlePremiumUpgrade() {
        document.querySelector('.upgrade-prompt-overlay')?.remove();
        
        // Show payment modal (in production, integrate with Stripe/etc.)
        this.showPaymentModal();
    }

    /**
     * Show payment modal
     */
    showPaymentModal() {
        const modal = document.createElement('div');
        modal.className = 'payment-modal-overlay';
        modal.innerHTML = `
            <div class="payment-modal">
                <div class="payment-header">
                    <h2>💎 Upgrade to Premium</h2>
                    <button class="close-modal" onclick="this.closest('.payment-modal-overlay').remove()">✕</button>
                </div>
                
                <div class="payment-content">
                    <div class="plan-summary">
                        <h3>Premium Library Guardian</h3>
                        <div class="plan-price">$${this.tiers.premium.price}/month</div>
                        <p>Unlimited access + 20% FableBox discount</p>
                    </div>
                    
                    <div class="payment-form">
                        <div class="form-group">
                            <label>Email Address</label>
                            <input type="email" id="payment-email" placeholder="parent@example.com" required>
                        </div>
                        
                        <div class="form-group">
                            <label>Payment Method</label>
                            <div class="payment-methods">
                                <button class="payment-method active" data-method="card">
                                    💳 Credit Card
                                </button>
                                <button class="payment-method" data-method="paypal">
                                    🅿️ PayPal
                                </button>
                                <button class="payment-method" data-method="apple">
                                    🍎 Apple Pay
                                </button>
                            </div>
                        </div>
                        
                        <div class="demo-notice">
                            <p>🚧 Demo Mode: This will simulate a successful payment</p>
                        </div>
                        
                        <button class="payment-submit-btn" onclick="monetizationSystem.processPaymentDemo()">
                            Start Premium Subscription
                        </button>
                    </div>
                    
                    <div class="payment-security">
                        <p>🔒 Secure payment processing • Cancel anytime • 30-day money-back guarantee</p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    /**
     * Process payment (demo version)
     */
    async processPaymentDemo() {
        const submitBtn = document.querySelector('.payment-submit-btn');
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;
        
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate successful payment
        const success = await this.upgradeToPremium();
        
        if (success) {
            document.querySelector('.payment-modal-overlay')?.remove();
        } else {
            submitBtn.textContent = 'Try Again';
            submitBtn.disabled = false;
        }
    }

    /**
     * Actual payment processing (production)
     */
    async processPayment() {
        // In production, integrate with Stripe, PayPal, etc.
        // This is a demo implementation
        return { success: true, transactionId: 'demo_' + Date.now() };
    }

    /**
     * Generate FableBox discount code
     */
    generateFableBoxDiscount() {
        const discountCode = 'QUEST20-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        this.fableboxIntegration.discountCode = {
            code: discountCode,
            discount: 0.20, // 20%
            expires: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
            used: false
        };
        
        this.showDiscountCodeModal(discountCode);
        
        // Track discount generation
        this.trackEngagementEvent('discount_generated', { code: discountCode });
    }

    /**
     * Show discount code modal
     */
    showDiscountCodeModal(code) {
        const modal = document.createElement('div');
        modal.className = 'discount-modal-overlay';
        modal.innerHTML = `
            <div class="discount-modal">
                <div class="discount-header">
                    <h2>🎁 Your FableBox Discount!</h2>
                </div>
                
                <div class="discount-content">
                    <div class="discount-code-display">
                        <div class="discount-label">20% OFF Your Next FableBox Order</div>
                        <div class="discount-code" id="discount-code">${code}</div>
                        <button class="copy-code-btn" onclick="monetizationSystem.copyDiscountCode()">
                            📋 Copy Code
                        </button>
                    </div>
                    
                    <div class="discount-features">
                        <h3>✨ Make Your Adventure Personal!</h3>
                        <ul>
                            <li>🎨 Feature your game character in your next book</li>
                            <li>📚 Create a story starring your child as the hero</li>
                            <li>🎁 Special edition covers featuring game artwork</li>
                            <li>⭐ Early access to new FableBox collections</li>
                        </ul>
                    </div>
                    
                    <div class="discount-actions">
                        <button class="fablebox-btn" onclick="monetizationSystem.goToFableBox()">
                            📚 Shop FableBox Now
                        </button>
                        <button class="close-discount" onclick="this.closest('.discount-modal-overlay').remove()">
                            Save for Later
                        </button>
                    </div>
                    
                    <div class="discount-expiry">
                        <p>⏰ Code expires in 30 days</p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    /**
     * Copy discount code to clipboard
     */
    async copyDiscountCode() {
        const code = document.getElementById('discount-code').textContent;
        
        try {
            await navigator.clipboard.writeText(code);
            this.game.showNotification('📋 Discount code copied!', 'success');
            
            // Track code copy
            this.trackEngagementEvent('discount_copied', { code });
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = code;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            this.game.showNotification('📋 Discount code copied!', 'success');
        }
    }

    /**
     * Navigate to FableBox website
     */
    goToFableBox() {
        const url = `https://fablebox.com/?discount=${this.fableboxIntegration.discountCode.code}&source=game`;
        window.open(url, '_blank');
        
        // Track FableBox visit
        this.trackEngagementEvent('fablebox_visit', { 
            code: this.fableboxIntegration.discountCode.code 
        });
        this.analytics.conversionFunnel.bookDiscountUsed++;
    }

    /**
     * Track engagement events
     */
    trackEngagementEvent(eventName, data = {}) {
        const event = {
            name: eventName,
            timestamp: Date.now(),
            sessionId: this.analytics.sessionId || this.generateSessionId(),
            userId: this.getUserId(),
            tier: this.subscriptionState.tier,
            data: data
        };
        
        this.analytics.engagementEvents.push(event);
        
        // Update engagement score
        this.updateEngagementScore(eventName);
        
        // Send to analytics service (in production)
        this.sendAnalyticsEvent(event);
        
        console.log('📊 Analytics:', eventName, data);
    }

    /**
     * Update engagement score based on action
     */
    updateEngagementScore(eventName) {
        const scoreMap = {
            'system_init': 1,
            'path_started': 5,
            'puzzle_solved': 3,
            'achievement_earned': 4,
            'trial_started': 15,
            'premium_purchased': 50,
            'discount_generated': 10,
            'fablebox_visit': 8,
            'friend_invited': 6,
            'certificate_shared': 7
        };
        
        const points = scoreMap[eventName] || 1;
        this.subscriptionState.engagementScore += points;
        this.saveSubscriptionState();
    }

    /**
     * Generate unique session ID
     */
    generateSessionId() {
        this.analytics.sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        return this.analytics.sessionId;
    }

    /**
     * Get or create user ID
     */
    getUserId() {
        let userId = localStorage.getItem('enchantedLibrary_userId');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('enchantedLibrary_userId', userId);
        }
        return userId;
    }

    /**
     * Send analytics event to service
     */
    sendAnalyticsEvent(event) {
        // In production, send to analytics service (Google Analytics, Mixpanel, etc.)
        if (typeof gtag !== 'undefined') {
            gtag('event', event.name, {
                custom_parameter_1: event.tier,
                custom_parameter_2: event.data
            });
        }
    }

    /**
     * Generate invite code for social features
     */
    generateInviteCode() {
        return 'INV' + Math.random().toString(36).substr(2, 6).toUpperCase();
    }

    /**
     * Handle trial expiration
     */
    handleTrialExpired() {
        this.subscriptionState.tier = 'free';
        this.subscriptionState.endDate = null;
        this.saveSubscriptionState();
        
        // Show trial expired prompt
        this.showTrialExpiredPrompt();
        
        // Track trial expiration
        this.trackEngagementEvent('trial_expired');
    }

    /**
     * Show trial expired prompt
     */
    showTrialExpiredPrompt() {
        this.game.showNotification('🔔 Your 7-day trial has ended. Upgrade to Premium to continue unlimited access!', 'warning', 5000);
        
        setTimeout(() => {
            this.showUpgradePrompt('trial_expired', 'Your trial period has ended. Upgrade to Premium for unlimited access to all adventures!');
        }, 2000);
    }

    /**
     * Schedule trial reminders
     */
    scheduleTrialReminders() {
        const endDate = this.subscriptionState.endDate;
        const now = Date.now();
        
        // 24 hours before expiry
        const reminderTime1 = endDate - (24 * 60 * 60 * 1000);
        if (reminderTime1 > now) {
            setTimeout(() => {
                this.game.showNotification('⏰ Your trial expires in 24 hours! Upgrade to keep unlimited access.', 'warning');
            }, reminderTime1 - now);
        }
        
        // 1 hour before expiry
        const reminderTime2 = endDate - (60 * 60 * 1000);
        if (reminderTime2 > now) {
            setTimeout(() => {
                this.game.showNotification('🚨 Trial expires in 1 hour! Upgrade now to avoid interruption.', 'warning');
            }, reminderTime2 - now);
        }
    }

    /**
     * Get next reset time for daily limits
     */
    getNextResetTime() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return tomorrow.getTime();
    }

    /**
     * Show premium welcome
     */
    showPremiumWelcome() {
        const modal = document.createElement('div');
        modal.className = 'welcome-modal-overlay';
        modal.innerHTML = `
            <div class="welcome-modal premium-welcome">
                <div class="welcome-header">
                    <h2>🎉 Welcome to Premium!</h2>
                </div>
                
                <div class="welcome-content">
                    <div class="welcome-features">
                        <h3>✨ You now have access to:</h3>
                        <ul>
                            ${this.tiers.premium.features.map(f => `<li>⭐ ${f}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="welcome-actions">
                        <button class="continue-btn" onclick="this.closest('.welcome-modal-overlay').remove()">
                            🚀 Start Exploring!
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Auto-close after 5 seconds
        setTimeout(() => {
            modal.remove();
        }, 5000);
    }

    /**
     * Show trial welcome
     */
    showTrialWelcome() {
        this.game.showNotification('🆓 Welcome to your 7-day trial! Enjoy unlimited access to all adventures!', 'success', 4000);
    }

    /**
     * Get subscription status
     */
    getSubscriptionStatus() {
        return {
            tier: this.subscriptionState.tier,
            isActive: this.subscriptionState.tier !== 'free',
            daysRemaining: this.subscriptionState.endDate ? 
                Math.ceil((this.subscriptionState.endDate - Date.now()) / (24 * 60 * 60 * 1000)) : null,
            pathsPlayedToday: this.subscriptionState.pathsPlayedToday,
            pathsRemainingToday: this.tiers[this.subscriptionState.tier].dailyPaths === -1 ? 
                'unlimited' : Math.max(0, this.tiers[this.subscriptionState.tier].dailyPaths - this.subscriptionState.pathsPlayedToday)
        };
    }

    /**
     * Setup upgrade prompt listeners
     */
    setupUpgradePromptListeners(prompt) {
        // Add any specific event listeners for the upgrade prompt
        const trialBtn = prompt.querySelector('.trial-btn');
        const premiumBtn = prompt.querySelector('.premium-btn');
        
        if (trialBtn) {
            trialBtn.addEventListener('click', () => {
                this.trackEngagementEvent('trial_button_clicked');
            });
        }
        
        if (premiumBtn) {
            premiumBtn.addEventListener('click', () => {
                this.trackEngagementEvent('premium_button_clicked');
            });
        }
    }

    /**
     * Clean up monetization system
     */
    destroy() {
        this.saveSubscriptionState();
        
        // Remove any active modals
        document.querySelectorAll('.upgrade-prompt-overlay, .payment-modal-overlay, .discount-modal-overlay, .welcome-modal-overlay').forEach(el => el.remove());
        
        console.log('💰 Monetization system destroyed');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MonetizationSystem;
} else {
    window.MonetizationSystem = MonetizationSystem;
}
