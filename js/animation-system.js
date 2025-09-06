/**
 * THE ENCHANTED LIBRARY QUEST - ANIMATION SYSTEM
 * FableBox Educational Adventure Game
 * 
 * This file contains the comprehensive animation system that handles:
 * - Smooth scene transitions with multiple effects
 * - Character entrance and exit animations
 * - Magical particle effects and sparkles
 * - Floating animations for UI elements
 * - Parallax scrolling for immersive backgrounds
 * - Performance-optimized animation management
 * 
 * Animation Philosophy:
 * Animations enhance the magical storytelling experience while maintaining
 * focus on educational content. All animations respect user preferences
 * for reduced motion and provide graceful fallbacks.
 */

class AnimationSystem {
    constructor(gameEngine) {
        this.game = gameEngine;
        this.activeAnimations = new Map();
        this.particleSystems = [];
        this.transitionQueue = [];
        this.isTransitioning = false;
        
        // Animation settings
        this.settings = {
            respectReducedMotion: true,
            enableParticles: true,
            animationSpeed: 1.0,
            maxParticles: 50,
            enableParallax: true
        };
        
        // Check for reduced motion preference
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.initialize();
    }

    /**
     * Initialize the animation system
     */
    initialize() {
        // Create animation containers
        this.createAnimationContainers();
        
        // Set up animation observers
        this.setupIntersectionObserver();
        
        // Initialize parallax system
        this.initializeParallax();
        
        // Add CSS animation utilities
        this.injectAnimationCSS();
        
        console.log('🎨 Animation system initialized');
    }

    /**
     * Create containers for different animation layers
     */
    createAnimationContainers() {
        // Particle container (top layer)
        if (!document.getElementById('particle-container')) {
            const particleContainer = document.createElement('div');
            particleContainer.id = 'particle-container';
            particleContainer.className = 'animation-layer particle-layer';
            particleContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 9999;
                overflow: hidden;
            `;
            document.body.appendChild(particleContainer);
        }

        // Transition overlay
        if (!document.getElementById('transition-overlay')) {
            const transitionOverlay = document.createElement('div');
            transitionOverlay.id = 'transition-overlay';
            transitionOverlay.className = 'animation-layer transition-layer';
            transitionOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 9998;
                opacity: 0;
                background: linear-gradient(135deg, #8B5CF6, #60A5FA);
                transition: opacity 0.5s ease;
            `;
            document.body.appendChild(transitionOverlay);
        }

        // Floating elements container
        if (!document.getElementById('floating-container')) {
            const floatingContainer = document.createElement('div');
            floatingContainer.id = 'floating-container';
            floatingContainer.className = 'animation-layer floating-layer';
            floatingContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1000;
                overflow: hidden;
            `;
            document.body.appendChild(floatingContainer);
        }
    }

    /**
     * Inject CSS animations
     */
    injectAnimationCSS() {
        if (document.getElementById('animation-styles')) return;

        const style = document.createElement('style');
        style.id = 'animation-styles';
        style.textContent = `
            /* Scene Transition Animations */
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }

            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }

            @keyframes slideInLeft {
                from { transform: translateX(-100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }

            @keyframes slideInUp {
                from { transform: translateY(100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }

            @keyframes slideInDown {
                from { transform: translateY(-100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }

            /* Character Animations */
            @keyframes characterEntrance {
                0% { transform: translateY(20px) scale(0.8); opacity: 0; }
                50% { transform: translateY(-5px) scale(1.05); opacity: 0.8; }
                100% { transform: translateY(0) scale(1); opacity: 1; }
            }

            @keyframes characterBounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }

            @keyframes characterFloat {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                33% { transform: translateY(-8px) rotate(1deg); }
                66% { transform: translateY(-4px) rotate(-1deg); }
            }

            /* Magical Effects */
            @keyframes sparkle {
                0% { transform: scale(0) rotate(0deg); opacity: 0; }
                50% { transform: scale(1) rotate(180deg); opacity: 1; }
                100% { transform: scale(0.8) rotate(360deg); opacity: 0; }
            }

            @keyframes twinkle {
                0%, 100% { opacity: 0.3; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.2); }
            }

            @keyframes magicalGlow {
                0%, 100% { box-shadow: 0 0 10px rgba(139, 92, 246, 0.3); }
                50% { box-shadow: 0 0 30px rgba(139, 92, 246, 0.8), 0 0 50px rgba(96, 165, 250, 0.4); }
            }

            /* Floating Animations */
            @keyframes floatUp {
                0% { transform: translateY(0) scale(1); opacity: 1; }
                100% { transform: translateY(-200px) scale(0.5); opacity: 0; }
            }

            @keyframes floatSway {
                0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
                25% { transform: translateX(-10px) translateY(-5px) rotate(-2deg); }
                75% { transform: translateX(10px) translateY(-3px) rotate(2deg); }
            }

            /* Page Turn Effect */
            @keyframes pageFlip {
                0% { transform: rotateY(0deg); }
                50% { transform: rotateY(-90deg); }
                100% { transform: rotateY(0deg); }
            }

            /* Success Pulse */
            @keyframes successPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); filter: brightness(1.2); }
                100% { transform: scale(1); }
            }

            /* Reduced Motion Fallbacks */
            @media (prefers-reduced-motion: reduce) {
                * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
                
                .character-display {
                    animation: none !important;
                }
                
                .particle {
                    display: none !important;
                }
            }

            /* Animation Utility Classes */
            .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
            .animate-fade-out { animation: fadeOut 0.5s ease-out forwards; }
            .animate-slide-in-right { animation: slideInRight 0.6s ease-out forwards; }
            .animate-slide-in-left { animation: slideInLeft 0.6s ease-out forwards; }
            .animate-slide-in-up { animation: slideInUp 0.6s ease-out forwards; }
            .animate-slide-in-down { animation: slideInDown 0.6s ease-out forwards; }
            .animate-character-entrance { animation: characterEntrance 1s ease-out forwards; }
            .animate-character-bounce { animation: characterBounce 2s ease-in-out infinite; }
            .animate-character-float { animation: characterFloat 4s ease-in-out infinite; }
            .animate-sparkle { animation: sparkle 1s ease-out forwards; }
            .animate-twinkle { animation: twinkle 2s ease-in-out infinite; }
            .animate-magical-glow { animation: magicalGlow 3s ease-in-out infinite; }
            .animate-float-up { animation: floatUp 3s ease-out forwards; }
            .animate-float-sway { animation: floatSway 6s ease-in-out infinite; }
            .animate-page-flip { animation: pageFlip 0.8s ease-in-out; }
            .animate-success-pulse { animation: successPulse 0.6s ease-out; }
        `;
        document.head.appendChild(style);
    }

    /**
     * Scene transition system
     */
    async transitionToScene(newSceneId, transitionType = 'fade') {
        if (this.isTransitioning) {
            this.transitionQueue.push({ newSceneId, transitionType });
            return;
        }

        this.isTransitioning = true;
        
        try {
            // Start transition effect
            await this.startTransition(transitionType);
            
            // Load new scene during transition
            if (this.game.sceneManager) {
                this.game.sceneManager.loadScene(newSceneId);
            }
            
            // Complete transition
            await this.completeTransition(transitionType);
            
        } catch (error) {
            console.error('Scene transition error:', error);
        } finally {
            this.isTransitioning = false;
            
            // Process queued transitions
            if (this.transitionQueue.length > 0) {
                const next = this.transitionQueue.shift();
                setTimeout(() => this.transitionToScene(next.newSceneId, next.transitionType), 100);
            }
        }
    }

    /**
     * Start transition effect
     */
    async startTransition(type) {
        const overlay = document.getElementById('transition-overlay');
        const currentScreen = document.querySelector('.game-screen.active');
        
        if (this.reducedMotion) {
            // Immediate transition for reduced motion
            if (overlay) overlay.style.opacity = '1';
            return new Promise(resolve => setTimeout(resolve, 50));
        }

        switch (type) {
            case 'fade':
                if (currentScreen) currentScreen.classList.add('animate-fade-out');
                await this.wait(300);
                break;
                
            case 'slide-right':
                if (currentScreen) currentScreen.classList.add('animate-slide-out-left');
                await this.wait(400);
                break;
                
            case 'slide-left':
                if (currentScreen) currentScreen.classList.add('animate-slide-out-right');
                await this.wait(400);
                break;
                
            case 'page-flip':
                if (currentScreen) currentScreen.classList.add('animate-page-flip');
                await this.wait(400);
                break;
                
            default:
                await this.wait(200);
        }
        
        if (overlay) {
            overlay.style.opacity = '1';
            await this.wait(200);
        }
    }

    /**
     * Complete transition effect
     */
    async completeTransition(type) {
        const overlay = document.getElementById('transition-overlay');
        const newScreen = document.querySelector('.game-screen.active');
        
        if (this.reducedMotion) {
            if (overlay) overlay.style.opacity = '0';
            return new Promise(resolve => setTimeout(resolve, 50));
        }

        await this.wait(100);
        
        if (overlay) {
            overlay.style.opacity = '0';
        }
        
        if (newScreen) {
            switch (type) {
                case 'fade':
                    newScreen.classList.add('animate-fade-in');
                    break;
                case 'slide-right':
                    newScreen.classList.add('animate-slide-in-right');
                    break;
                case 'slide-left':
                    newScreen.classList.add('animate-slide-in-left');
                    break;
                case 'page-flip':
                    newScreen.classList.add('animate-fade-in');
                    break;
            }
        }
        
        await this.wait(500);
    }

    /**
     * Character entrance animation
     */
    animateCharacterEntrance(characterElement, entranceType = 'bounce') {
        if (this.reducedMotion || !characterElement) return;

        // Remove existing animation classes
        characterElement.classList.remove('animate-character-entrance', 'animate-character-bounce', 'animate-character-float');
        
        // Force reflow
        characterElement.offsetHeight;
        
        switch (entranceType) {
            case 'bounce':
                characterElement.classList.add('animate-character-entrance');
                setTimeout(() => {
                    characterElement.classList.add('animate-character-bounce');
                }, 1000);
                break;
                
            case 'float':
                characterElement.classList.add('animate-character-entrance');
                setTimeout(() => {
                    characterElement.classList.add('animate-character-float');
                }, 1000);
                break;
                
            case 'entrance-only':
                characterElement.classList.add('animate-character-entrance');
                break;
        }
        
        // Add magical glow effect
        setTimeout(() => {
            characterElement.classList.add('animate-magical-glow');
        }, 500);
    }

    /**
     * Create sparkle effect for correct answers
     */
    createSparkleEffect(targetElement, options = {}) {
        if (this.reducedMotion || !this.settings.enableParticles) return;

        const defaults = {
            count: 12,
            colors: ['#FCD34D', '#F59E0B', '#8B5CF6', '#60A5FA', '#34D399'],
            duration: 2000,
            spread: 100
        };
        
        const config = { ...defaults, ...options };
        const rect = targetElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < config.count; i++) {
            setTimeout(() => {
                this.createSparkleParticle(centerX, centerY, config);
            }, i * 50);
        }
    }

    /**
     * Create individual sparkle particle
     */
    createSparkleParticle(x, y, config) {
        const container = document.getElementById('particle-container');
        if (!container) return;

        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle-particle';
        
        const color = config.colors[Math.floor(Math.random() * config.colors.length)];
        const size = Math.random() * 8 + 4;
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * config.spread + 20;
        const endX = x + Math.cos(angle) * distance;
        const endY = y + Math.sin(angle) * distance;
        
        sparkle.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            box-shadow: 0 0 ${size * 2}px ${color};
        `;
        
        container.appendChild(sparkle);
        
        // Animate sparkle
        sparkle.classList.add('animate-sparkle');
        
        // Animate movement
        sparkle.animate([
            { transform: `translate(0, 0) scale(0)`, opacity: 0 },
            { transform: `translate(${(endX - x) * 0.5}px, ${(endY - y) * 0.5}px) scale(1)`, opacity: 1, offset: 0.5 },
            { transform: `translate(${endX - x}px, ${endY - y}px) scale(0)`, opacity: 0 }
        ], {
            duration: config.duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        // Clean up
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, config.duration);
    }

    /**
     * Create floating elements (stars, hearts, etc.)
     */
    createFloatingElements(emoji, count = 5, options = {}) {
        if (this.reducedMotion || !this.settings.enableParticles) return;

        const defaults = {
            duration: 4000,
            spread: 200,
            startY: window.innerHeight + 50
        };
        
        const config = { ...defaults, ...options };
        const container = document.getElementById('floating-container');
        if (!container) return;

        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                this.createFloatingElement(emoji, config);
            }, i * 200);
        }
    }

    /**
     * Create individual floating element
     */
    createFloatingElement(emoji, config) {
        const container = document.getElementById('floating-container');
        if (!container) return;

        const element = document.createElement('div');
        element.className = 'floating-element';
        
        const startX = Math.random() * (window.innerWidth - 50);
        const endY = -100;
        const swayAmount = Math.random() * 60 - 30;
        
        element.style.cssText = `
            position: absolute;
            left: ${startX}px;
            top: ${config.startY}px;
            font-size: ${Math.random() * 20 + 20}px;
            pointer-events: none;
            z-index: 1001;
            user-select: none;
        `;
        
        element.textContent = emoji;
        container.appendChild(element);
        
        // Animate floating movement
        element.animate([
            { 
                transform: `translate(0, 0) rotate(0deg)`,
                opacity: 0
            },
            { 
                transform: `translate(${swayAmount * 0.5}px, ${(config.startY + endY) * 0.3}px) rotate(${Math.random() * 360}deg)`,
                opacity: 1,
                offset: 0.3
            },
            { 
                transform: `translate(${swayAmount}px, ${config.startY + endY}px) rotate(${Math.random() * 720}deg)`,
                opacity: 0
            }
        ], {
            duration: config.duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        // Clean up
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }, config.duration);
    }

    /**
     * Initialize parallax scrolling system
     */
    initializeParallax() {
        if (this.reducedMotion || !this.settings.enableParallax) return;

        this.parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (this.parallaxElements.length > 0) {
            this.parallaxHandler = this.throttle(() => {
                this.updateParallax();
            }, 16); // ~60fps
            
            window.addEventListener('scroll', this.parallaxHandler);
            window.addEventListener('resize', this.parallaxHandler);
        }
    }

    /**
     * Update parallax positions
     */
    updateParallax() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        this.parallaxElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const yPos = -(scrollTop * speed);
            
            // Only animate elements in viewport
            if (rect.bottom >= 0 && rect.top <= windowHeight) {
                element.style.transform = `translate3d(0, ${yPos}px, 0)`;
            }
        });
    }

    /**
     * Setup intersection observer for animation triggers
     */
    setupIntersectionObserver() {
        if (!window.IntersectionObserver) return;

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animationType = element.dataset.animateOnView;
                    
                    if (animationType && !this.reducedMotion) {
                        element.classList.add(`animate-${animationType}`);
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        // Observe elements with animation triggers
        document.querySelectorAll('[data-animate-on-view]').forEach(el => {
            this.observer.observe(el);
        });
    }

    /**
     * Animate button press
     */
    animateButtonPress(buttonElement) {
        if (this.reducedMotion || !buttonElement) return;

        buttonElement.classList.add('animate-success-pulse');
        
        setTimeout(() => {
            buttonElement.classList.remove('animate-success-pulse');
        }, 600);
    }

    /**
     * Create success celebration
     */
    createSuccessCelebration(targetElement) {
        if (this.reducedMotion) return;

        // Add glow effect
        if (targetElement) {
            targetElement.classList.add('animate-magical-glow');
            setTimeout(() => {
                targetElement.classList.remove('animate-magical-glow');
            }, 3000);
        }

        // Create sparkles
        this.createSparkleEffect(targetElement || document.body, {
            count: 20,
            duration: 3000,
            spread: 150
        });

        // Create floating stars
        this.createFloatingElements('⭐🌟✨', 8, {
            duration: 3000,
            startY: window.innerHeight * 0.8
        });
    }

    /**
     * Utility functions
     */
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Clean up animation system
     */
    destroy() {
        // Remove event listeners
        if (this.parallaxHandler) {
            window.removeEventListener('scroll', this.parallaxHandler);
            window.removeEventListener('resize', this.parallaxHandler);
        }

        // Disconnect observer
        if (this.observer) {
            this.observer.disconnect();
        }

        // Clear active animations
        this.activeAnimations.clear();
        this.particleSystems = [];
        this.transitionQueue = [];
        
        // Remove animation containers
        ['particle-container', 'transition-overlay', 'floating-container'].forEach(id => {
            const element = document.getElementById(id);
            if (element) element.remove();
        });

        console.log('🎨 Animation system destroyed');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationSystem;
} else {
    window.AnimationSystem = AnimationSystem;
}
