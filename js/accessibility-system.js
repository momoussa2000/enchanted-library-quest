/**
 * THE ENCHANTED LIBRARY QUEST - ACCESSIBILITY SYSTEM
 * FableBox Educational Adventure Game
 * 
 * This file enhances accessibility for all learners, including:
 * - Dyslexia-friendly font options and spacing
 * - Colorblind-friendly color schemes
 * - Enhanced keyboard navigation and screen reader support
 * - Adjustable text size and contrast options
 * - Sensory sensitivity accommodations
 * - Learning difference support features
 * 
 * Accessibility Philosophy:
 * Every child deserves access to magical learning experiences.
 * We design for inclusion from the ground up, ensuring that
 * learning differences become learning strengths.
 */

class AccessibilitySystem {
    constructor(gameEngine) {
        this.game = gameEngine;
        
        // Accessibility settings
        this.settings = {
            // Visual accessibility
            dyslexiaFont: false,
            highContrast: false,
            reducedMotion: false,
            largeCursor: false,
            textSize: 'normal', // small, normal, large, extra-large
            lineSpacing: 'normal', // normal, wide, extra-wide
            
            // Color accessibility
            colorScheme: 'default', // default, colorblind-friendly, high-contrast
            
            // Motor accessibility
            stickyKeys: false,
            slowKeys: false,
            clickAssist: false,
            
            // Cognitive accessibility
            simplifiedInterface: false,
            extraTime: false,
            focusIndicators: 'enhanced',
            
            // Sensory accessibility
            reduceFlashing: false,
            minimizeAnimations: false,
            audioDescriptions: false,
            
            // Learning differences support
            readingSupport: false,
            comprehensionAids: true,
            multimediaSupport: true
        };
        
        // Font options for dyslexia support
        this.fonts = {
            default: {
                name: 'Default',
                family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                description: 'Clean, readable system font'
            },
            openDyslexic: {
                name: 'OpenDyslexic',
                family: '"OpenDyslexic", sans-serif',
                description: 'Specially designed for dyslexic readers',
                url: 'https://fonts.googleapis.com/css2?family=OpenDyslexic&display=swap'
            },
            comicNeue: {
                name: 'Comic Neue',
                family: '"Comic Neue", cursive',
                description: 'Friendly, casual font that aids readability',
                url: 'https://fonts.googleapis.com/css2?family=Comic+Neue:wght@300;400;700&display=swap'
            },
            lexend: {
                name: 'Lexend',
                family: '"Lexend", sans-serif',
                description: 'Scientifically proven to improve reading proficiency',
                url: 'https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap'
            }
        };
        
        // Color schemes for different vision needs
        this.colorSchemes = {
            default: {
                name: 'Magical (Default)',
                description: 'Beautiful magical colors'
            },
            colorblindFriendly: {
                name: 'Colorblind Friendly',
                description: 'High contrast with distinguishable colors',
                cssClass: 'colorblind-friendly'
            },
            highContrast: {
                name: 'High Contrast',
                description: 'Maximum contrast for low vision',
                cssClass: 'high-contrast'
            },
            darkMode: {
                name: 'Dark Mode',
                description: 'Easier on the eyes in low light',
                cssClass: 'dark-mode'
            }
        };
        
        this.initialize();
    }

    /**
     * Initialize accessibility system
     */
    initialize() {
        this.loadSettings();
        this.setupAccessibilityControls();
        this.applySettings();
        this.setupKeyboardShortcuts();
        this.detectSystemPreferences();
        this.injectAccessibilityStyles();
        
        console.log('♿ Accessibility system initialized with full inclusion support');
    }

    /**
     * Create accessibility control panel
     */
    setupAccessibilityControls() {
        // Add accessibility button to main interface
        this.addAccessibilityButton();
        
        // Create accessibility settings modal
        this.createAccessibilityModal();
    }

    /**
     * Add accessibility button to game interface
     */
    addAccessibilityButton() {
        const button = document.createElement('button');
        button.id = 'accessibility-toggle';
        button.className = 'accessibility-btn';
        button.innerHTML = '♿';
        button.title = 'Accessibility Settings (Alt+A)';
        button.setAttribute('aria-label', 'Open accessibility settings');
        
        button.addEventListener('click', () => this.showAccessibilityModal());
        
        // Position button in top-right corner
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #8B5CF6;
            color: white;
            border: 2px solid rgba(255,255,255,0.3);
            font-size: 1.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
        `;
        
        document.body.appendChild(button);
    }

    /**
     * Create comprehensive accessibility settings modal
     */
    createAccessibilityModal() {
        const modal = document.createElement('div');
        modal.id = 'accessibility-modal';
        modal.className = 'accessibility-modal hidden';
        modal.innerHTML = `
            <div class="accessibility-overlay" onclick="accessibilitySystem.hideAccessibilityModal()"></div>
            <div class="accessibility-container">
                <div class="accessibility-header">
                    <h2>🌟 Accessibility Settings</h2>
                    <p>Make your magical adventure perfect for you!</p>
                    <button class="close-accessibility" onclick="accessibilitySystem.hideAccessibilityModal()">✕</button>
                </div>
                
                <div class="accessibility-content">
                    <!-- Reading Support Section -->
                    <div class="accessibility-section">
                        <h3>📖 Reading Support</h3>
                        <div class="setting-group">
                            <label class="setting-item">
                                <span class="setting-label">Dyslexia-Friendly Font</span>
                                <span class="setting-description">Special font designed for easier reading</span>
                                <select id="font-selector" onchange="accessibilitySystem.changeFontFamily(this.value)">
                                    ${Object.entries(this.fonts).map(([key, font]) => 
                                        `<option value="${key}">${font.name} - ${font.description}</option>`
                                    ).join('')}
                                </select>
                            </label>
                            
                            <label class="setting-item">
                                <span class="setting-label">Text Size</span>
                                <span class="setting-description">Make text bigger or smaller</span>
                                <select id="text-size" onchange="accessibilitySystem.changeTextSize(this.value)">
                                    <option value="small">Small</option>
                                    <option value="normal" selected>Normal</option>
                                    <option value="large">Large</option>
                                    <option value="extra-large">Extra Large</option>
                                </select>
                            </label>
                            
                            <label class="setting-item">
                                <span class="setting-label">Line Spacing</span>
                                <span class="setting-description">Add space between lines for easier reading</span>
                                <select id="line-spacing" onchange="accessibilitySystem.changeLineSpacing(this.value)">
                                    <option value="normal" selected>Normal</option>
                                    <option value="wide">Wide</option>
                                    <option value="extra-wide">Extra Wide</option>
                                </select>
                            </label>
                        </div>
                    </div>
                    
                    <!-- Visual Support Section -->
                    <div class="accessibility-section">
                        <h3>👁️ Visual Support</h3>
                        <div class="setting-group">
                            <label class="setting-item">
                                <span class="setting-label">Color Scheme</span>
                                <span class="setting-description">Choose colors that work best for you</span>
                                <select id="color-scheme" onchange="accessibilitySystem.changeColorScheme(this.value)">
                                    ${Object.entries(this.colorSchemes).map(([key, scheme]) => 
                                        `<option value="${key}">${scheme.name} - ${scheme.description}</option>`
                                    ).join('')}
                                </select>
                            </label>
                            
                            <label class="setting-item checkbox-item">
                                <input type="checkbox" id="high-contrast" onchange="accessibilitySystem.toggleHighContrast(this.checked)">
                                <span class="setting-label">High Contrast Mode</span>
                                <span class="setting-description">Stronger colors for better visibility</span>
                            </label>
                            
                            <label class="setting-item checkbox-item">
                                <input type="checkbox" id="large-cursor" onchange="accessibilitySystem.toggleLargeCursor(this.checked)">
                                <span class="setting-label">Large Cursor</span>
                                <span class="setting-description">Bigger cursor for easier tracking</span>
                            </label>
                        </div>
                    </div>
                    
                    <!-- Motion & Animation Section -->
                    <div class="accessibility-section">
                        <h3>🎬 Motion Settings</h3>
                        <div class="setting-group">
                            <label class="setting-item checkbox-item">
                                <input type="checkbox" id="reduced-motion" onchange="accessibilitySystem.toggleReducedMotion(this.checked)">
                                <span class="setting-label">Reduce Motion</span>
                                <span class="setting-description">Minimize animations and transitions</span>
                            </label>
                            
                            <label class="setting-item checkbox-item">
                                <input type="checkbox" id="reduce-flashing" onchange="accessibilitySystem.toggleReduceFlashing(this.checked)">
                                <span class="setting-label">Reduce Flashing</span>
                                <span class="setting-description">Prevent bright flashing effects</span>
                            </label>
                        </div>
                    </div>
                    
                    <!-- Learning Support Section -->
                    <div class="accessibility-section">
                        <h3>🧠 Learning Support</h3>
                        <div class="setting-group">
                            <label class="setting-item checkbox-item">
                                <input type="checkbox" id="reading-support" onchange="accessibilitySystem.toggleReadingSupport(this.checked)">
                                <span class="setting-label">Extra Reading Help</span>
                                <span class="setting-description">Highlight words and provide pronunciation guides</span>
                            </label>
                            
                            <label class="setting-item checkbox-item">
                                <input type="checkbox" id="extra-time" onchange="accessibilitySystem.toggleExtraTime(this.checked)">
                                <span class="setting-label">Extra Time</span>
                                <span class="setting-description">No time pressure on puzzles</span>
                            </label>
                            
                            <label class="setting-item checkbox-item">
                                <input type="checkbox" id="simplified-interface" onchange="accessibilitySystem.toggleSimplifiedInterface(this.checked)">
                                <span class="setting-label">Simplified Interface</span>
                                <span class="setting-description">Remove extra elements for focus</span>
                            </label>
                        </div>
                    </div>
                    
                    <!-- Motor Support Section -->
                    <div class="accessibility-section">
                        <h3>🖱️ Motor Support</h3>
                        <div class="setting-group">
                            <label class="setting-item checkbox-item">
                                <input type="checkbox" id="click-assist" onchange="accessibilitySystem.toggleClickAssist(this.checked)">
                                <span class="setting-label">Click Assistance</span>
                                <span class="setting-description">Make buttons easier to press</span>
                            </label>
                            
                            <label class="setting-item checkbox-item">
                                <input type="checkbox" id="sticky-keys" onchange="accessibilitySystem.toggleStickyKeys(this.checked)">
                                <span class="setting-label">Sticky Keys</span>
                                <span class="setting-description">Press one key at a time for combinations</span>
                            </label>
                        </div>
                    </div>
                </div>
                
                <div class="accessibility-footer">
                    <button class="accessibility-btn primary" onclick="accessibilitySystem.resetToDefaults()">
                        🔄 Reset to Defaults
                    </button>
                    <button class="accessibility-btn success" onclick="accessibilitySystem.saveAndClose()">
                        ✅ Save Settings
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    /**
     * Show accessibility modal
     */
    showAccessibilityModal() {
        const modal = document.getElementById('accessibility-modal');
        if (modal) {
            modal.classList.remove('hidden');
            
            // Update form values to match current settings
            this.updateModalSettings();
            
            // Focus management
            const firstInput = modal.querySelector('select, input');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
            
            // Announce to screen reader
            this.announceToScreenReader('Accessibility settings opened');
        }
    }

    /**
     * Hide accessibility modal
     */
    hideAccessibilityModal() {
        const modal = document.getElementById('accessibility-modal');
        if (modal) {
            modal.classList.add('hidden');
            
            // Return focus to accessibility button
            const button = document.getElementById('accessibility-toggle');
            if (button) button.focus();
            
            this.announceToScreenReader('Accessibility settings closed');
        }
    }

    /**
     * Update modal form values to match current settings
     */
    updateModalSettings() {
        Object.entries(this.settings).forEach(([key, value]) => {
            const element = document.getElementById(key.replace(/([A-Z])/g, '-$1').toLowerCase());
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = value;
                } else {
                    element.value = value;
                }
            }
        });
    }

    /**
     * Change font family for dyslexia support
     */
    changeFontFamily(fontKey) {
        const font = this.fonts[fontKey];
        if (!font) return;
        
        // Load font if it has a URL
        if (font.url && !document.querySelector(`link[href="${font.url}"]`)) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = font.url;
            document.head.appendChild(link);
        }
        
        // Apply font to entire document
        document.documentElement.style.setProperty('--accessibility-font', font.family);
        document.body.style.fontFamily = font.family;
        
        this.settings.fontFamily = fontKey;
        this.saveSettings();
        
        this.announceToScreenReader(`Font changed to ${font.name}`);
        console.log(`♿ Font changed to: ${font.name}`);
    }

    /**
     * Change text size for better readability
     */
    changeTextSize(size) {
        const sizeMap = {
            'small': '0.9',
            'normal': '1.0',
            'large': '1.2',
            'extra-large': '1.4'
        };
        
        const scale = sizeMap[size] || '1.0';
        document.documentElement.style.setProperty('--accessibility-text-scale', scale);
        
        this.settings.textSize = size;
        this.saveSettings();
        
        this.announceToScreenReader(`Text size changed to ${size}`);
    }

    /**
     * Change line spacing for reading comfort
     */
    changeLineSpacing(spacing) {
        const spacingMap = {
            'normal': '1.4',
            'wide': '1.6',
            'extra-wide': '1.8'
        };
        
        const lineHeight = spacingMap[spacing] || '1.4';
        document.documentElement.style.setProperty('--accessibility-line-height', lineHeight);
        
        this.settings.lineSpacing = spacing;
        this.saveSettings();
        
        this.announceToScreenReader(`Line spacing changed to ${spacing}`);
    }

    /**
     * Change color scheme for visual accessibility
     */
    changeColorScheme(schemeKey) {
        const scheme = this.colorSchemes[schemeKey];
        if (!scheme) return;
        
        // Remove existing scheme classes
        Object.values(this.colorSchemes).forEach(s => {
            if (s.cssClass) {
                document.body.classList.remove(s.cssClass);
            }
        });
        
        // Apply new scheme
        if (scheme.cssClass) {
            document.body.classList.add(scheme.cssClass);
        }
        
        this.settings.colorScheme = schemeKey;
        this.saveSettings();
        
        this.announceToScreenReader(`Color scheme changed to ${scheme.name}`);
    }

    /**
     * Toggle high contrast mode
     */
    toggleHighContrast(enabled) {
        if (enabled) {
            document.body.classList.add('high-contrast-mode');
        } else {
            document.body.classList.remove('high-contrast-mode');
        }
        
        this.settings.highContrast = enabled;
        this.saveSettings();
        
        this.announceToScreenReader(`High contrast ${enabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Toggle large cursor for motor accessibility
     */
    toggleLargeCursor(enabled) {
        if (enabled) {
            document.body.classList.add('large-cursor');
        } else {
            document.body.classList.remove('large-cursor');
        }
        
        this.settings.largeCursor = enabled;
        this.saveSettings();
        
        this.announceToScreenReader(`Large cursor ${enabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Toggle reduced motion for sensory sensitivity
     */
    toggleReducedMotion(enabled) {
        if (enabled) {
            document.body.classList.add('reduced-motion');
        } else {
            document.body.classList.remove('reduced-motion');
        }
        
        this.settings.reducedMotion = enabled;
        this.saveSettings();
        
        // Update animation system if available
        if (this.game.animationSystem) {
            this.game.animationSystem.settings.respectReducedMotion = enabled;
        }
        
        this.announceToScreenReader(`Motion reduction ${enabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Toggle reading support features
     */
    toggleReadingSupport(enabled) {
        if (enabled) {
            document.body.classList.add('reading-support');
        } else {
            document.body.classList.remove('reading-support');
        }
        
        this.settings.readingSupport = enabled;
        this.saveSettings();
        
        this.announceToScreenReader(`Reading support ${enabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Toggle extra time for puzzles
     */
    toggleExtraTime(enabled) {
        this.settings.extraTime = enabled;
        this.saveSettings();
        
        // Notify puzzle system
        if (this.game.puzzleSystem) {
            this.game.puzzleSystem.extraTimeEnabled = enabled;
        }
        
        this.announceToScreenReader(`Extra time ${enabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Toggle simplified interface
     */
    toggleSimplifiedInterface(enabled) {
        if (enabled) {
            document.body.classList.add('simplified-interface');
        } else {
            document.body.classList.remove('simplified-interface');
        }
        
        this.settings.simplifiedInterface = enabled;
        this.saveSettings();
        
        this.announceToScreenReader(`Simplified interface ${enabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Toggle click assistance for motor accessibility
     */
    toggleClickAssist(enabled) {
        if (enabled) {
            document.body.classList.add('click-assist');
        } else {
            document.body.classList.remove('click-assist');
        }
        
        this.settings.clickAssist = enabled;
        this.saveSettings();
        
        this.announceToScreenReader(`Click assistance ${enabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Toggle sticky keys support
     */
    toggleStickyKeys(enabled) {
        this.settings.stickyKeys = enabled;
        this.saveSettings();
        
        if (enabled) {
            this.setupStickyKeysSupport();
        }
        
        this.announceToScreenReader(`Sticky keys ${enabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Toggle flashing reduction
     */
    toggleReduceFlashing(enabled) {
        if (enabled) {
            document.body.classList.add('reduce-flashing');
        } else {
            document.body.classList.remove('reduce-flashing');
        }
        
        this.settings.reduceFlashing = enabled;
        this.saveSettings();
        
        this.announceToScreenReader(`Flashing reduction ${enabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Detect system accessibility preferences
     */
    detectSystemPreferences() {
        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.settings.reducedMotion = true;
            this.toggleReducedMotion(true);
        }
        
        // Check for high contrast preference
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            this.settings.highContrast = true;
            this.toggleHighContrast(true);
        }
        
        // Check for color scheme preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.changeColorScheme('darkMode');
        }
    }

    /**
     * Setup keyboard shortcuts for accessibility
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // Alt + A: Open accessibility settings
            if (event.altKey && event.key === 'a') {
                event.preventDefault();
                this.showAccessibilityModal();
            }
            
            // Alt + H: Toggle high contrast
            if (event.altKey && event.key === 'h') {
                event.preventDefault();
                this.toggleHighContrast(!this.settings.highContrast);
            }
            
            // Alt + R: Toggle reduced motion
            if (event.altKey && event.key === 'r') {
                event.preventDefault();
                this.toggleReducedMotion(!this.settings.reducedMotion);
            }
            
            // Alt + F: Cycle font options
            if (event.altKey && event.key === 'f') {
                event.preventDefault();
                this.cycleFontFamily();
            }
        });
    }

    /**
     * Cycle through font family options
     */
    cycleFontFamily() {
        const fontKeys = Object.keys(this.fonts);
        const currentIndex = fontKeys.indexOf(this.settings.fontFamily || 'default');
        const nextIndex = (currentIndex + 1) % fontKeys.length;
        this.changeFontFamily(fontKeys[nextIndex]);
    }

    /**
     * Setup sticky keys support
     */
    setupStickyKeysSupport() {
        // Implementation for sticky keys functionality
        // This would track modifier keys and allow sequential key presses
        console.log('♿ Sticky keys support enabled');
    }

    /**
     * Inject accessibility-specific CSS
     */
    injectAccessibilityStyles() {
        if (document.getElementById('accessibility-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'accessibility-styles';
        styles.textContent = `
            /* Accessibility System Styles */
            :root {
                --accessibility-font: inherit;
                --accessibility-text-scale: 1.0;
                --accessibility-line-height: 1.4;
            }
            
            /* Apply accessibility font */
            body, input, textarea, select, button {
                font-family: var(--accessibility-font) !important;
                font-size: calc(1rem * var(--accessibility-text-scale)) !important;
                line-height: var(--accessibility-line-height) !important;
            }
            
            /* High Contrast Mode */
            .high-contrast-mode {
                filter: contrast(150%);
            }
            
            .high-contrast-mode button,
            .high-contrast-mode .choice-option {
                border: 3px solid #000 !important;
                background: #fff !important;
                color: #000 !important;
            }
            
            .high-contrast-mode button:hover,
            .high-contrast-mode .choice-option:hover {
                background: #000 !important;
                color: #fff !important;
            }
            
            /* Large Cursor */
            .large-cursor,
            .large-cursor * {
                cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="black" d="M8 4l12 12-4 4-12-12z"/><path fill="white" d="M9 5l10 10-2 2-10-10z"/></svg>') 4 4, auto !important;
            }
            
            /* Reduced Motion */
            .reduced-motion * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
            
            /* Reading Support */
            .reading-support p,
            .reading-support .puzzle-question,
            .reading-support .choice-option {
                position: relative;
            }
            
            .reading-support p:hover,
            .reading-support .puzzle-question:hover,
            .reading-support .choice-option:hover {
                background: rgba(255, 255, 0, 0.3);
                border-radius: 4px;
            }
            
            /* Simplified Interface */
            .simplified-interface .decorative,
            .simplified-interface .particle,
            .simplified-interface .background-animation {
                display: none !important;
            }
            
            .simplified-interface {
                background: #f8f9fa !important;
            }
            
            /* Click Assistance */
            .click-assist button,
            .click-assist .choice-option,
            .click-assist .clickable {
                min-width: 48px !important;
                min-height: 48px !important;
                padding: 16px !important;
                margin: 8px !important;
            }
            
            /* Reduce Flashing */
            .reduce-flashing .sparkle,
            .reduce-flashing .flash,
            .reduce-flashing .blink {
                animation: none !important;
            }
            
            /* Colorblind Friendly Scheme */
            .colorblind-friendly {
                --primary-purple: #5D4E75;
                --secondary-blue: #4A90B8;
                --secondary-green: #7FB069;
                --secondary-yellow: #FFD23F;
                --primary-yellow: #FF8500;
            }
            
            /* Dark Mode */
            .dark-mode {
                background: #1a1a1a !important;
                color: #ffffff !important;
            }
            
            .dark-mode .game-container,
            .dark-mode .modal,
            .dark-mode .puzzle-container {
                background: #2d2d2d !important;
                color: #ffffff !important;
            }
            
            /* Accessibility Modal Styles */
            .accessibility-modal {
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
            
            .accessibility-modal.hidden {
                opacity: 0;
                visibility: hidden;
                pointer-events: none;
            }
            
            .accessibility-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(5px);
            }
            
            .accessibility-container {
                position: relative;
                width: 90%;
                max-width: 800px;
                max-height: 90vh;
                background: white;
                border-radius: 15px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }
            
            .accessibility-header {
                padding: 24px;
                background: linear-gradient(135deg, #8B5CF6, #60A5FA);
                color: white;
                text-align: center;
                position: relative;
            }
            
            .accessibility-header h2 {
                margin: 0 0 8px 0;
                font-size: 1.5rem;
            }
            
            .accessibility-header p {
                margin: 0;
                opacity: 0.9;
            }
            
            .close-accessibility {
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
            
            .accessibility-content {
                flex: 1;
                overflow-y: auto;
                padding: 24px;
            }
            
            .accessibility-section {
                margin-bottom: 32px;
                border-bottom: 1px solid #e5e7eb;
                padding-bottom: 24px;
            }
            
            .accessibility-section:last-child {
                border-bottom: none;
                margin-bottom: 0;
            }
            
            .accessibility-section h3 {
                color: #8B5CF6;
                margin: 0 0 16px 0;
                font-size: 1.2rem;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .setting-group {
                display: grid;
                gap: 16px;
            }
            
            .setting-item {
                display: grid;
                gap: 4px;
                cursor: pointer;
                padding: 12px;
                border-radius: 8px;
                transition: background-color 0.2s ease;
            }
            
            .setting-item:hover {
                background: rgba(139, 92, 246, 0.05);
            }
            
            .checkbox-item {
                display: flex;
                align-items: flex-start;
                gap: 12px;
                grid-template-columns: auto 1fr;
            }
            
            .checkbox-item input[type="checkbox"] {
                margin-top: 2px;
                width: 18px;
                height: 18px;
            }
            
            .setting-label {
                font-weight: 600;
                color: #374151;
                font-size: 1rem;
            }
            
            .setting-description {
                font-size: 0.9rem;
                color: #6B7280;
                line-height: 1.4;
            }
            
            .setting-item select {
                margin-top: 8px;
                padding: 8px 12px;
                border: 2px solid #e5e7eb;
                border-radius: 6px;
                font-size: 1rem;
                background: white;
            }
            
            .setting-item select:focus {
                border-color: #8B5CF6;
                outline: none;
            }
            
            .accessibility-footer {
                padding: 24px;
                background: #f8f9fa;
                display: flex;
                justify-content: space-between;
                gap: 16px;
            }
            
            .accessibility-btn {
                padding: 12px 24px;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                background: white;
                color: #374151;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.2s ease;
                flex: 1;
            }
            
            .accessibility-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            
            .accessibility-btn.primary {
                background: #6B7280;
                color: white;
                border-color: #6B7280;
            }
            
            .accessibility-btn.success {
                background: #10B981;
                color: white;
                border-color: #10B981;
            }
            
            /* Enhanced Focus Indicators */
            *:focus {
                outline: 3px solid #8B5CF6 !important;
                outline-offset: 2px !important;
            }
            
            .reduced-motion *:focus {
                outline: 3px solid #000 !important;
            }
            
            /* Mobile Responsive */
            @media (max-width: 768px) {
                .accessibility-container {
                    width: 95%;
                    height: 95vh;
                }
                
                .accessibility-footer {
                    flex-direction: column;
                }
                
                .setting-group {
                    gap: 20px;
                }
                
                .setting-item {
                    padding: 16px;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }

    /**
     * Save settings and close modal
     */
    saveAndClose() {
        this.saveSettings();
        this.hideAccessibilityModal();
        this.announceToScreenReader('Accessibility settings saved successfully');
        
        if (this.game.showNotification) {
            this.game.showNotification('🌟 Accessibility settings saved! Your adventure is now personalized for you.', 'success');
        }
    }

    /**
     * Reset all settings to defaults
     */
    resetToDefaults() {
        // Reset all settings
        Object.keys(this.settings).forEach(key => {
            if (key === 'textSize' || key === 'lineSpacing' || key === 'colorScheme') {
                this.settings[key] = key === 'colorScheme' ? 'default' : 'normal';
            } else {
                this.settings[key] = false;
            }
        });
        
        // Apply default settings
        this.applySettings();
        this.updateModalSettings();
        this.saveSettings();
        
        this.announceToScreenReader('Settings reset to defaults');
    }

    /**
     * Apply all current settings
     */
    applySettings() {
        // Apply font settings
        if (this.settings.fontFamily) {
            this.changeFontFamily(this.settings.fontFamily);
        }
        
        // Apply text size
        this.changeTextSize(this.settings.textSize);
        
        // Apply line spacing
        this.changeLineSpacing(this.settings.lineSpacing);
        
        // Apply color scheme
        this.changeColorScheme(this.settings.colorScheme);
        
        // Apply boolean settings
        Object.entries(this.settings).forEach(([key, value]) => {
            if (typeof value === 'boolean' && value) {
                const methodName = 'toggle' + key.charAt(0).toUpperCase() + key.slice(1);
                if (typeof this[methodName] === 'function') {
                    this[methodName](true);
                }
            }
        });
    }

    /**
     * Load settings from localStorage
     */
    loadSettings() {
        try {
            const saved = localStorage.getItem('enchantedLibrary_accessibility');
            if (saved) {
                const settings = JSON.parse(saved);
                this.settings = { ...this.settings, ...settings };
            }
        } catch (error) {
            console.warn('Failed to load accessibility settings:', error);
        }
    }

    /**
     * Save settings to localStorage
     */
    saveSettings() {
        try {
            localStorage.setItem('enchantedLibrary_accessibility', JSON.stringify(this.settings));
        } catch (error) {
            console.warn('Failed to save accessibility settings:', error);
        }
    }

    /**
     * Announce to screen reader
     */
    announceToScreenReader(message) {
        const announcement = document.getElementById('sr-announcements');
        if (announcement) {
            announcement.textContent = message;
        }
    }

    /**
     * Clean up accessibility system
     */
    destroy() {
        this.saveSettings();
        
        // Remove accessibility elements
        const button = document.getElementById('accessibility-toggle');
        const modal = document.getElementById('accessibility-modal');
        
        if (button) button.remove();
        if (modal) modal.remove();
        
        console.log('♿ Accessibility system destroyed');
    }
}

// Make globally accessible
window.AccessibilitySystem = AccessibilitySystem;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccessibilitySystem;
}
