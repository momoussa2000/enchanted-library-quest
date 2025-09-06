/**
 * THE ENCHANTED LIBRARY QUEST - INTERNATIONALIZATION SYSTEM
 * FableBox Educational Adventure Game
 * 
 * This file handles multi-language support and localization:
 * - Text string management and translation
 * - Locale-specific formatting (dates, numbers, currency)
 * - Right-to-left (RTL) language support
 * - Cultural adaptation for different regions
 * - Educational content localization
 * - Voice and audio localization preparation
 * 
 * Internationalization Philosophy:
 * Every child deserves to learn in their native language.
 * We create culturally relevant and linguistically appropriate
 * educational experiences that respect and celebrate diversity.
 */

class InternationalizationSystem {
    constructor(gameEngine) {
        this.game = gameEngine;
        
        // Current locale settings
        this.currentLocale = 'en-US';
        this.fallbackLocale = 'en-US';
        this.rtlLanguages = ['ar', 'he', 'fa', 'ur'];
        
        // Text strings database
        this.strings = new Map();
        
        // Locale-specific configurations
        this.localeConfigs = {
            'en-US': {
                name: 'English (US)',
                nativeName: 'English',
                direction: 'ltr',
                numberFormat: 'en-US',
                currency: 'USD',
                dateFormat: 'MM/DD/YYYY',
                voice: 'en-US',
                flag: '🇺🇸'
            },
            'es-ES': {
                name: 'Spanish (Spain)',
                nativeName: 'Español',
                direction: 'ltr',
                numberFormat: 'es-ES',
                currency: 'EUR',
                dateFormat: 'DD/MM/YYYY',
                voice: 'es-ES',
                flag: '🇪🇸'
            },
            'es-MX': {
                name: 'Spanish (Mexico)',
                nativeName: 'Español (México)',
                direction: 'ltr',
                numberFormat: 'es-MX',
                currency: 'MXN',
                dateFormat: 'DD/MM/YYYY',
                voice: 'es-MX',
                flag: '🇲🇽'
            },
            'fr-FR': {
                name: 'French (France)',
                nativeName: 'Français',
                direction: 'ltr',
                numberFormat: 'fr-FR',
                currency: 'EUR',
                dateFormat: 'DD/MM/YYYY',
                voice: 'fr-FR',
                flag: '🇫🇷'
            },
            'pt-BR': {
                name: 'Portuguese (Brazil)',
                nativeName: 'Português (Brasil)',
                direction: 'ltr',
                numberFormat: 'pt-BR',
                currency: 'BRL',
                dateFormat: 'DD/MM/YYYY',
                voice: 'pt-BR',
                flag: '🇧🇷'
            },
            'de-DE': {
                name: 'German',
                nativeName: 'Deutsch',
                direction: 'ltr',
                numberFormat: 'de-DE',
                currency: 'EUR',
                dateFormat: 'DD.MM.YYYY',
                voice: 'de-DE',
                flag: '🇩🇪'
            },
            'zh-CN': {
                name: 'Chinese (Simplified)',
                nativeName: '简体中文',
                direction: 'ltr',
                numberFormat: 'zh-CN',
                currency: 'CNY',
                dateFormat: 'YYYY/MM/DD',
                voice: 'zh-CN',
                flag: '🇨🇳'
            },
            'ja-JP': {
                name: 'Japanese',
                nativeName: '日本語',
                direction: 'ltr',
                numberFormat: 'ja-JP',
                currency: 'JPY',
                dateFormat: 'YYYY/MM/DD',
                voice: 'ja-JP',
                flag: '🇯🇵'
            },
            'ar-SA': {
                name: 'Arabic',
                nativeName: 'العربية',
                direction: 'rtl',
                numberFormat: 'ar-SA',
                currency: 'SAR',
                dateFormat: 'DD/MM/YYYY',
                voice: 'ar-SA',
                flag: '🇸🇦'
            }
        };
        
        this.initialize();
    }

    /**
     * Initialize internationalization system
     */
    async initialize() {
        // Detect user's preferred language
        this.detectUserLanguage();
        
        // Load default strings
        await this.loadDefaultStrings();
        
        // Load current locale strings
        await this.loadLocaleStrings(this.currentLocale);
        
        // Apply locale settings
        this.applyLocaleSettings();
        
        // Create language selector
        this.createLanguageSelector();
        
        console.log(`🌍 Internationalization system initialized with locale: ${this.currentLocale}`);
    }

    /**
     * Detect user's preferred language
     */
    detectUserLanguage() {
        // Check for saved preference
        const saved = localStorage.getItem('enchantedLibrary_locale');
        if (saved && this.localeConfigs[saved]) {
            this.currentLocale = saved;
            return;
        }
        
        // Detect from browser language
        const browserLang = navigator.language || navigator.userLanguage;
        
        // Try exact match first
        if (this.localeConfigs[browserLang]) {
            this.currentLocale = browserLang;
            return;
        }
        
        // Try language code only (e.g., 'en' from 'en-GB')
        const langCode = browserLang.split('-')[0];
        const matchingLocale = Object.keys(this.localeConfigs).find(locale => 
            locale.startsWith(langCode)
        );
        
        if (matchingLocale) {
            this.currentLocale = matchingLocale;
        }
        
        console.log(`🌍 Detected user language: ${browserLang} → Using: ${this.currentLocale}`);
    }

    /**
     * Load default English strings
     */
    async loadDefaultStrings() {
        const defaultStrings = {
            // Game UI
            'game.title': 'The Enchanted Library Quest',
            'game.subtitle': 'A Magical Learning Adventure',
            'game.loading': 'Loading your magical adventure...',
            'game.continue': 'Continue',
            'game.start': 'Start Adventure',
            'game.newGame': 'New Game',
            
            // Welcome Screen
            'welcome.title': 'Welcome, Young Scholar!',
            'welcome.subtitle': 'The magical library needs your help!',
            'welcome.namePrompt': 'What is your name, brave adventurer?',
            'welcome.namePlaceholder': 'Enter your name',
            'welcome.agePrompt': 'How old are you?',
            'welcome.characterPrompt': 'Choose your magical companion:',
            
            // Characters
            'character.dragon.name': 'Ruby the Dragon',
            'character.dragon.description': 'A friendly dragon who loves math puzzles and counting treasure!',
            'character.wizard.name': 'Sage the Wizard',
            'character.wizard.description': 'A wise wizard who masters words and language magic!',
            'character.mouse.name': 'Scout the Explorer Mouse',
            'character.mouse.description': 'A curious mouse who discovers the secrets of science!',
            
            // Story Navigation
            'story.chooseAdventure': 'Choose Your Adventure',
            'story.selectPath': 'Which magical path will you take?',
            'story.pathsAvailable': 'Adventures Available Today',
            'story.pathsLocked': 'More adventures unlock with Premium!',
            
            // Puzzles
            'puzzle.wellDone': 'Well done!',
            'puzzle.greatJob': 'Great job!',
            'puzzle.tryAgain': 'Not quite right, but keep trying!',
            'puzzle.almostThere': 'You\'re almost there!',
            'puzzle.needHint': 'Would you like a hint?',
            'puzzle.getHint': 'Get Hint',
            'puzzle.submit': 'Submit Answer',
            'puzzle.nextPuzzle': 'Next Challenge',
            'puzzle.backToStory': 'Continue Story',
            
            // Encouragement Messages
            'encouragement.effort': 'I love how hard you\'re trying!',
            'encouragement.thinking': 'Great thinking!',
            'encouragement.learning': 'You\'re learning so much!',
            'encouragement.brave': 'You\'re so brave to try new challenges!',
            'encouragement.smart': 'What a smart solution!',
            'encouragement.creative': 'How creative!',
            'encouragement.persistent': 'Your persistence is amazing!',
            
            // Achievements
            'achievement.unlocked': 'Achievement Unlocked!',
            'achievement.firstPuzzle': 'First Steps',
            'achievement.firstPuzzle.desc': 'You solved your very first puzzle!',
            'achievement.perfectScore': 'Perfect Score',
            'achievement.perfectScore.desc': 'You got every answer right!',
            'achievement.helper': 'Wise Helper',
            'achievement.helper.desc': 'You used hints thoughtfully!',
            
            // Parent Features
            'parent.dashboard': 'Parent Dashboard',
            'parent.progress': 'Learning Progress',
            'parent.insights': 'Educational Insights',
            'parent.timeSpent': 'Time Spent Learning',
            'parent.skillDevelopment': 'Skill Development',
            'parent.recommendations': 'Learning Recommendations',
            
            // Monetization
            'premium.upgrade': 'Upgrade to Premium',
            'premium.unlimited': 'Unlimited Adventures',
            'premium.familyFeatures': 'Family Features',
            'premium.tryFree': 'Try Free for 7 Days',
            'premium.startTrial': 'Start Free Trial',
            'premium.benefits': 'Premium Benefits',
            
            // FableBox Integration
            'fablebox.discount': 'Special Book Discount!',
            'fablebox.offer': '20% off your next personalized book',
            'fablebox.character': 'Feature your game character in your book',
            'fablebox.shop': 'Shop FableBox Books',
            'fablebox.exclusive': 'Exclusive story just for you!',
            
            // Accessibility
            'accessibility.settings': 'Accessibility Settings',
            'accessibility.readingSupport': 'Reading Support',
            'accessibility.visualSupport': 'Visual Support',
            'accessibility.motorSupport': 'Motor Support',
            'accessibility.save': 'Save Settings',
            'accessibility.reset': 'Reset to Defaults',
            
            // Common Actions
            'action.next': 'Next',
            'action.back': 'Back',
            'action.skip': 'Skip',
            'action.retry': 'Try Again',
            'action.save': 'Save',
            'action.cancel': 'Cancel',
            'action.close': 'Close',
            'action.help': 'Help',
            
            // Time and Progress
            'time.today': 'Today',
            'time.thisWeek': 'This Week',
            'time.total': 'Total',
            'progress.completed': 'Completed',
            'progress.inProgress': 'In Progress',
            'progress.locked': 'Locked',
            
            // Error Messages (child-friendly)
            'error.oops': 'Oops! Something went wrong.',
            'error.tryAgain': 'Let\'s try that again!',
            'error.loading': 'The magic is taking a little longer...',
            'error.connection': 'Check your internet connection.',
            
            // Educational Content Labels
            'subject.math': 'Mathematics',
            'subject.language': 'Language Arts',
            'subject.science': 'Science',
            'skill.addition': 'Addition',
            'skill.subtraction': 'Subtraction',
            'skill.reading': 'Reading',
            'skill.vocabulary': 'Vocabulary',
            'skill.animals': 'Animals',
            'skill.weather': 'Weather'
        };
        
        this.strings.set('en-US', defaultStrings);
    }

    /**
     * Load strings for specific locale
     */
    async loadLocaleStrings(locale) {
        if (locale === 'en-US') return; // Already loaded
        
        try {
            // In production, this would load from external files or API
            const response = await fetch(`assets/locales/${locale}.json`);
            if (response.ok) {
                const strings = await response.json();
                this.strings.set(locale, strings);
                console.log(`🌍 Loaded strings for locale: ${locale}`);
            } else {
                console.warn(`🌍 No strings found for locale: ${locale}, using fallback`);
            }
        } catch (error) {
            console.warn(`🌍 Failed to load locale ${locale}:`, error);
        }
    }

    /**
     * Get translated string
     */
    t(key, params = {}) {
        // Try current locale first
        let strings = this.strings.get(this.currentLocale);
        let text = strings && strings[key];
        
        // Fall back to default locale
        if (!text) {
            strings = this.strings.get(this.fallbackLocale);
            text = strings && strings[key];
        }
        
        // Fall back to key if no translation found
        if (!text) {
            console.warn(`🌍 Missing translation for key: ${key}`);
            return key;
        }
        
        // Replace parameters
        return this.replaceParams(text, params);
    }

    /**
     * Replace parameters in translated text
     */
    replaceParams(text, params) {
        return text.replace(/\{(\w+)\}/g, (match, param) => {
            return params[param] !== undefined ? params[param] : match;
        });
    }

    /**
     * Get localized number format
     */
    formatNumber(number, options = {}) {
        const config = this.localeConfigs[this.currentLocale];
        return new Intl.NumberFormat(config.numberFormat, options).format(number);
    }

    /**
     * Get localized currency format
     */
    formatCurrency(amount, currency = null) {
        const config = this.localeConfigs[this.currentLocale];
        const currencyCode = currency || config.currency;
        
        return new Intl.NumberFormat(config.numberFormat, {
            style: 'currency',
            currency: currencyCode
        }).format(amount);
    }

    /**
     * Get localized date format
     */
    formatDate(date, options = {}) {
        const config = this.localeConfigs[this.currentLocale];
        return new Intl.DateTimeFormat(config.numberFormat, options).format(date);
    }

    /**
     * Apply locale-specific settings
     */
    applyLocaleSettings() {
        const config = this.localeConfigs[this.currentLocale];
        
        // Set document direction for RTL languages
        document.documentElement.dir = config.direction;
        document.documentElement.lang = this.currentLocale.split('-')[0];
        
        // Apply RTL styles if needed
        if (config.direction === 'rtl') {
            document.body.classList.add('rtl-layout');
        } else {
            document.body.classList.remove('rtl-layout');
        }
        
        // Update page title
        document.title = this.t('game.title');
        
        // Update all existing text content
        this.updateAllTextContent();
    }

    /**
     * Update all text content on the page
     */
    updateAllTextContent() {
        // Update elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const params = element.getAttribute('data-i18n-params');
            
            let parsedParams = {};
            if (params) {
                try {
                    parsedParams = JSON.parse(params);
                } catch (error) {
                    console.warn('Invalid i18n params:', params);
                }
            }
            
            element.textContent = this.t(key, parsedParams);
        });
        
        // Update placeholder text
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });
        
        // Update aria-labels
        document.querySelectorAll('[data-i18n-aria]').forEach(element => {
            const key = element.getAttribute('data-i18n-aria');
            element.setAttribute('aria-label', this.t(key));
        });
    }

    /**
     * Create language selector UI
     */
    createLanguageSelector() {
        // Create language button
        const button = document.createElement('button');
        button.id = 'language-selector';
        button.className = 'language-btn';
        button.innerHTML = this.localeConfigs[this.currentLocale].flag;
        button.title = 'Change Language';
        button.setAttribute('aria-label', 'Language selection');
        
        // Position next to accessibility button
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 80px;
            z-index: 9999;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: white;
            color: #8B5CF6;
            border: 2px solid #8B5CF6;
            font-size: 1.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(139, 92, 246, 0.2);
        `;
        
        button.addEventListener('click', () => this.showLanguageSelector());
        document.body.appendChild(button);
        
        // Create language selection modal
        this.createLanguageModal();
    }

    /**
     * Create language selection modal
     */
    createLanguageModal() {
        const modal = document.createElement('div');
        modal.id = 'language-modal';
        modal.className = 'language-modal hidden';
        modal.innerHTML = `
            <div class="language-overlay" onclick="i18nSystem.hideLanguageSelector()"></div>
            <div class="language-container">
                <div class="language-header">
                    <h2>🌍 Choose Your Language</h2>
                    <p>Select your preferred language for the best learning experience</p>
                    <button class="close-language" onclick="i18nSystem.hideLanguageSelector()">✕</button>
                </div>
                
                <div class="language-content">
                    <div class="language-grid">
                        ${Object.entries(this.localeConfigs).map(([code, config]) => `
                            <button class="language-option ${code === this.currentLocale ? 'active' : ''}" 
                                    onclick="i18nSystem.changeLanguage('${code}')" 
                                    data-locale="${code}">
                                <div class="language-flag">${config.flag}</div>
                                <div class="language-name">${config.nativeName}</div>
                                <div class="language-english">${config.name}</div>
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <div class="language-footer">
                    <p>🌟 More languages coming soon! Help us translate at <a href="mailto:translate@fablebox.net">translate@fablebox.net</a></p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add styles
        this.injectLanguageStyles();
    }

    /**
     * Show language selector modal
     */
    showLanguageSelector() {
        const modal = document.getElementById('language-modal');
        if (modal) {
            modal.classList.remove('hidden');
            
            // Focus management
            const firstOption = modal.querySelector('.language-option');
            if (firstOption) {
                setTimeout(() => firstOption.focus(), 100);
            }
        }
    }

    /**
     * Hide language selector modal
     */
    hideLanguageSelector() {
        const modal = document.getElementById('language-modal');
        if (modal) {
            modal.classList.add('hidden');
            
            // Return focus to language button
            const button = document.getElementById('language-selector');
            if (button) button.focus();
        }
    }

    /**
     * Change language
     */
    async changeLanguage(locale) {
        if (!this.localeConfigs[locale]) {
            console.warn(`🌍 Unsupported locale: ${locale}`);
            return;
        }
        
        // Load strings for new locale
        await this.loadLocaleStrings(locale);
        
        // Update current locale
        this.currentLocale = locale;
        
        // Save preference
        localStorage.setItem('enchantedLibrary_locale', locale);
        
        // Apply new locale settings
        this.applyLocaleSettings();
        
        // Update language button
        const button = document.getElementById('language-selector');
        if (button) {
            button.innerHTML = this.localeConfigs[locale].flag;
        }
        
        // Update modal active state
        document.querySelectorAll('.language-option').forEach(option => {
            option.classList.toggle('active', option.dataset.locale === locale);
        });
        
        // Hide modal
        this.hideLanguageSelector();
        
        // Notify user
        if (this.game.showNotification) {
            this.game.showNotification(
                this.t('language.changed', { language: this.localeConfigs[locale].nativeName }),
                'success'
            );
        }
        
        // Update analytics
        if (this.game.analyticsSystem) {
            this.game.analyticsSystem.trackEvent('language_changed', { 
                from: this.previousLocale,
                to: locale 
            });
        }
        
        this.previousLocale = locale;
        console.log(`🌍 Language changed to: ${locale}`);
    }

    /**
     * Inject language selector styles
     */
    injectLanguageStyles() {
        if (document.getElementById('language-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'language-styles';
        styles.textContent = `
            /* Language Modal Styles */
            .language-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 15000;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .language-modal.hidden {
                opacity: 0;
                visibility: hidden;
                pointer-events: none;
            }
            
            .language-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(5px);
            }
            
            .language-container {
                position: relative;
                width: 90%;
                max-width: 600px;
                background: white;
                border-radius: 15px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                overflow: hidden;
            }
            
            .language-header {
                padding: 24px;
                background: linear-gradient(135deg, #8B5CF6, #60A5FA);
                color: white;
                text-align: center;
                position: relative;
            }
            
            .language-header h2 {
                margin: 0 0 8px 0;
                font-size: 1.5rem;
            }
            
            .language-header p {
                margin: 0;
                opacity: 0.9;
                font-size: 0.9rem;
            }
            
            .close-language {
                position: absolute;
                top: 16px;
                right: 16px;
                width: 32px;
                height: 32px;
                border: none;
                background: rgba(255, 255, 255, 0.2);
                color: white;
                border-radius: 50%;
                cursor: pointer;
                font-size: 1.2rem;
            }
            
            .language-content {
                padding: 24px;
            }
            
            .language-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                gap: 16px;
            }
            
            .language-option {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                padding: 20px 16px;
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                background: white;
                cursor: pointer;
                transition: all 0.2s ease;
                text-align: center;
            }
            
            .language-option:hover {
                border-color: #8B5CF6;
                background: rgba(139, 92, 246, 0.05);
                transform: translateY(-2px);
            }
            
            .language-option.active {
                border-color: #8B5CF6;
                background: rgba(139, 92, 246, 0.1);
                box-shadow: 0 4px 15px rgba(139, 92, 246, 0.2);
            }
            
            .language-flag {
                font-size: 2rem;
                margin-bottom: 4px;
            }
            
            .language-name {
                font-weight: 600;
                color: #374151;
                font-size: 1rem;
            }
            
            .language-english {
                font-size: 0.8rem;
                color: #6B7280;
            }
            
            .language-footer {
                padding: 20px 24px;
                background: #f8f9fa;
                text-align: center;
                font-size: 0.9rem;
                color: #6B7280;
            }
            
            .language-footer a {
                color: #8B5CF6;
                text-decoration: none;
            }
            
            .language-footer a:hover {
                text-decoration: underline;
            }
            
            /* RTL Layout Support */
            .rtl-layout {
                direction: rtl;
            }
            
            .rtl-layout .language-btn,
            .rtl-layout #accessibility-toggle {
                left: 20px;
                right: auto;
            }
            
            .rtl-layout #language-selector {
                left: 80px;
                right: auto;
            }
            
            .rtl-layout .choice-option,
            .rtl-layout .puzzle-container,
            .rtl-layout .game-container {
                text-align: right;
            }
            
            .rtl-layout .back-btn {
                transform: scaleX(-1);
            }
            
            /* Mobile Responsive */
            @media (max-width: 768px) {
                .language-container {
                    width: 95%;
                }
                
                .language-grid {
                    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                    gap: 12px;
                }
                
                .language-option {
                    padding: 16px 12px;
                }
                
                .language-flag {
                    font-size: 1.5rem;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }

    /**
     * Get current locale information
     */
    getCurrentLocale() {
        return {
            code: this.currentLocale,
            config: this.localeConfigs[this.currentLocale],
            isRTL: this.localeConfigs[this.currentLocale].direction === 'rtl'
        };
    }

    /**
     * Get available locales
     */
    getAvailableLocales() {
        return Object.entries(this.localeConfigs).map(([code, config]) => ({
            code,
            ...config
        }));
    }

    /**
     * Prepare content for localization
     */
    extractTextForTranslation() {
        // In development, this could extract all text strings for translation
        const textElements = document.querySelectorAll('*:not(script):not(style)');
        const extractedText = [];
        
        textElements.forEach(element => {
            if (element.children.length === 0 && element.textContent.trim()) {
                extractedText.push({
                    text: element.textContent.trim(),
                    element: element.tagName,
                    context: element.closest('[data-context]')?.getAttribute('data-context') || 'general'
                });
            }
        });
        
        return extractedText;
    }

    /**
     * Validate translations
     */
    validateTranslations() {
        const baseStrings = this.strings.get(this.fallbackLocale);
        const issues = [];
        
        this.strings.forEach((strings, locale) => {
            if (locale === this.fallbackLocale) return;
            
            // Check for missing keys
            Object.keys(baseStrings).forEach(key => {
                if (!strings[key]) {
                    issues.push({
                        locale,
                        type: 'missing',
                        key,
                        message: `Missing translation for key: ${key}`
                    });
                }
            });
            
            // Check for extra keys
            Object.keys(strings).forEach(key => {
                if (!baseStrings[key]) {
                    issues.push({
                        locale,
                        type: 'extra',
                        key,
                        message: `Extra key not in base locale: ${key}`
                    });
                }
            });
        });
        
        return issues;
    }

    /**
     * Create sample locale files for translators
     */
    generateTranslationTemplate() {
        const baseStrings = this.strings.get(this.fallbackLocale);
        const template = {};
        
        Object.keys(baseStrings).forEach(key => {
            template[key] = `[${key}] ${baseStrings[key]}`;
        });
        
        return JSON.stringify(template, null, 2);
    }

    /**
     * Clean up internationalization system
     */
    destroy() {
        // Remove language selector elements
        const button = document.getElementById('language-selector');
        const modal = document.getElementById('language-modal');
        const styles = document.getElementById('language-styles');
        
        if (button) button.remove();
        if (modal) modal.remove();
        if (styles) styles.remove();
        
        console.log('🌍 Internationalization system destroyed');
    }
}

// Make globally accessible
window.InternationalizationSystem = InternationalizationSystem;
window.i18nSystem = null; // Will be initialized by game engine

// Helper function for templates
window.t = function(key, params = {}) {
    return window.i18nSystem ? window.i18nSystem.t(key, params) : key;
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InternationalizationSystem;
}
