/**
 * THE ENCHANTED LIBRARY QUEST - SOUND SYSTEM
 * FableBox Educational Adventure Game
 * 
 * This file contains the comprehensive audio management system that handles:
 * - Background music tracks for different areas
 * - Sound effects for interactions and feedback
 * - Character voice snippets and narration
 * - Ambient soundscapes for immersion
 * - Audio accessibility and user preferences
 * - Performance-optimized audio loading and playback
 * 
 * Audio Design Philosophy:
 * Audio enhances the magical learning experience while respecting user
 * preferences and accessibility needs. All audio is optional and can be
 * controlled independently (music, effects, voices).
 */

class SoundSystem {
    constructor(gameEngine) {
        this.game = gameEngine;
        this.audioContext = null;
        this.audioCache = new Map();
        this.activeSounds = new Map();
        this.currentMusic = null;
        this.fadeTimeouts = new Set();
        
        // Audio settings
        this.settings = {
            masterVolume: 0.7,
            musicVolume: 0.5,
            effectsVolume: 0.8,
            voiceVolume: 0.9,
            ambientVolume: 0.3,
            musicEnabled: true,
            effectsEnabled: true,
            voicesEnabled: true,
            ambientEnabled: true,
            audioFormat: 'mp3' // fallback to 'ogg' if needed
        };
        
        // Audio library structure
        this.audioLibrary = {
            music: {
                menu: 'assets/audio/music/enchanted-menu.mp3',
                library: 'assets/audio/music/magical-library.mp3',
                forest: 'assets/audio/music/mystical-forest.mp3',
                cave: 'assets/audio/music/dragon-cave.mp3',
                tower: 'assets/audio/music/wizard-tower.mp3',
                clouds: 'assets/audio/music/cloud-kingdom.mp3',
                puzzle: 'assets/audio/music/thinking-time.mp3',
                celebration: 'assets/audio/music/victory-fanfare.mp3'
            },
            effects: {
                // UI Sounds
                buttonClick: 'assets/audio/effects/button-click.mp3',
                buttonHover: 'assets/audio/effects/button-hover.mp3',
                pageFlip: 'assets/audio/effects/page-flip.mp3',
                bookOpen: 'assets/audio/effects/book-open.mp3',
                bookClose: 'assets/audio/effects/book-close.mp3',
                
                // Puzzle Feedback
                success: 'assets/audio/effects/success-chime.mp3',
                failure: 'assets/audio/effects/gentle-wrong.mp3',
                hint: 'assets/audio/effects/hint-sparkle.mp3',
                starEarned: 'assets/audio/effects/star-collect.mp3',
                
                // Magical Effects
                sparkle: 'assets/audio/effects/magic-sparkle.mp3',
                whoosh: 'assets/audio/effects/magic-whoosh.mp3',
                chime: 'assets/audio/effects/magic-chime.mp3',
                portal: 'assets/audio/effects/portal-open.mp3',
                
                // Character Sounds
                dragonRoar: 'assets/audio/effects/friendly-dragon.mp3',
                owlHoot: 'assets/audio/effects/wise-owl.mp3',
                mouseSqueak: 'assets/audio/effects/cute-mouse.mp3'
            },
            voices: {
                // Narrator
                narrator: {
                    welcome: 'assets/audio/voices/narrator/welcome.mp3',
                    introduction: 'assets/audio/voices/narrator/introduction.mp3',
                    pathChoice: 'assets/audio/voices/narrator/choose-path.mp3',
                    celebration: 'assets/audio/voices/narrator/celebration.mp3'
                },
                
                // Character Voices
                owl: {
                    greeting: 'assets/audio/voices/owl/greeting.mp3',
                    explanation: 'assets/audio/voices/owl/explanation.mp3',
                    encouragement: 'assets/audio/voices/owl/encouragement.mp3'
                },
                dragon: {
                    greeting: 'assets/audio/voices/dragon/greeting.mp3',
                    challenge: 'assets/audio/voices/dragon/challenge.mp3',
                    celebration: 'assets/audio/voices/dragon/celebration.mp3'
                },
                wizard: {
                    greeting: 'assets/audio/voices/wizard/greeting.mp3',
                    spellCast: 'assets/audio/voices/wizard/spell-cast.mp3',
                    wisdom: 'assets/audio/voices/wizard/wisdom.mp3'
                },
                mouse: {
                    greeting: 'assets/audio/voices/mouse/greeting.mp3',
                    adventure: 'assets/audio/voices/mouse/adventure.mp3',
                    discovery: 'assets/audio/voices/mouse/discovery.mp3'
                }
            },
            ambient: {
                library: 'assets/audio/ambient/library-atmosphere.mp3',
                forest: 'assets/audio/ambient/forest-sounds.mp3',
                cave: 'assets/audio/ambient/cave-echoes.mp3',
                tower: 'assets/audio/ambient/tower-wind.mp3',
                clouds: 'assets/audio/ambient/cloud-breeze.mp3'
            }
        };
        
        this.initialize();
    }

    /**
     * Initialize the sound system
     */
    async initialize() {
        try {
            // Create audio context (modern browsers)
            if (window.AudioContext || window.webkitAudioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            // Load user preferences
            this.loadSettings();
            
            // Set up audio event listeners
            this.setupEventListeners();
            
            // Prepare audio directory structure
            this.prepareAudioStructure();
            
            console.log('🔊 Sound system initialized');
            
        } catch (error) {
            console.warn('Audio initialization failed:', error);
            this.settings.musicEnabled = false;
            this.settings.effectsEnabled = false;
        }
    }

    /**
     * Prepare audio directory structure (for development)
     */
    prepareAudioStructure() {
        // This method documents the expected audio file structure
        // In production, these files would be provided by audio designers
        
        const structure = {
            'assets/audio/': {
                'music/': [
                    'enchanted-menu.mp3',
                    'magical-library.mp3', 
                    'mystical-forest.mp3',
                    'dragon-cave.mp3',
                    'wizard-tower.mp3',
                    'cloud-kingdom.mp3',
                    'thinking-time.mp3',
                    'victory-fanfare.mp3'
                ],
                'effects/': [
                    'button-click.mp3', 'button-hover.mp3', 'page-flip.mp3',
                    'book-open.mp3', 'book-close.mp3', 'success-chime.mp3',
                    'gentle-wrong.mp3', 'hint-sparkle.mp3', 'star-collect.mp3',
                    'magic-sparkle.mp3', 'magic-whoosh.mp3', 'magic-chime.mp3',
                    'portal-open.mp3', 'friendly-dragon.mp3', 'wise-owl.mp3',
                    'cute-mouse.mp3'
                ],
                'voices/': {
                    'narrator/': ['welcome.mp3', 'introduction.mp3', 'choose-path.mp3', 'celebration.mp3'],
                    'owl/': ['greeting.mp3', 'explanation.mp3', 'encouragement.mp3'],
                    'dragon/': ['greeting.mp3', 'challenge.mp3', 'celebration.mp3'],
                    'wizard/': ['greeting.mp3', 'spell-cast.mp3', 'wisdom.mp3'],
                    'mouse/': ['greeting.mp3', 'adventure.mp3', 'discovery.mp3']
                },
                'ambient/': [
                    'library-atmosphere.mp3',
                    'forest-sounds.mp3',
                    'cave-echoes.mp3', 
                    'tower-wind.mp3',
                    'cloud-breeze.mp3'
                ]
            }
        };
        
        console.log('📁 Audio structure prepared:', structure);
    }

    /**
     * Load audio settings from localStorage
     */
    loadSettings() {
        const saved = localStorage.getItem('enchantedLibrary_audioSettings');
        if (saved) {
            try {
                const settings = JSON.parse(saved);
                this.settings = { ...this.settings, ...settings };
            } catch (error) {
                console.warn('Failed to load audio settings:', error);
            }
        }
    }

    /**
     * Save audio settings to localStorage
     */
    saveSettings() {
        try {
            localStorage.setItem('enchantedLibrary_audioSettings', JSON.stringify(this.settings));
        } catch (error) {
            console.warn('Failed to save audio settings:', error);
        }
    }

    /**
     * Set up event listeners for user interaction
     */
    setupEventListeners() {
        // Resume audio context on first user interaction (browser requirement)
        const resumeAudio = () => {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            document.removeEventListener('click', resumeAudio);
            document.removeEventListener('keydown', resumeAudio);
        };
        
        document.addEventListener('click', resumeAudio);
        document.addEventListener('keydown', resumeAudio);
        
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAll();
            } else {
                this.resumeAll();
            }
        });
    }

    /**
     * Preload audio file
     */
    async preloadAudio(key, url) {
        if (this.audioCache.has(key)) {
            return this.audioCache.get(key);
        }

        try {
            const audio = new Audio();
            audio.preload = 'auto';
            audio.crossOrigin = 'anonymous';
            
            await new Promise((resolve, reject) => {
                audio.addEventListener('canplaythrough', resolve);
                audio.addEventListener('error', reject);
                audio.src = url;
            });
            
            this.audioCache.set(key, audio);
            return audio;
            
        } catch (error) {
            console.warn(`Failed to preload audio: ${key}`, error);
            // Create silent fallback
            const silentAudio = new Audio();
            silentAudio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmASBJvEAA==';
            this.audioCache.set(key, silentAudio);
            return silentAudio;
        }
    }

    /**
     * Play background music
     */
    async playMusic(trackName, options = {}) {
        if (!this.settings.musicEnabled) return;

        const defaults = {
            loop: true,
            volume: this.settings.musicVolume * this.settings.masterVolume,
            fadeIn: 2000,
            fadeOut: 1000
        };
        
        const config = { ...defaults, ...options };
        const url = this.audioLibrary.music[trackName];
        
        if (!url) {
            console.warn(`Music track not found: ${trackName}`);
            return;
        }

        try {
            // Fade out current music if playing
            if (this.currentMusic) {
                await this.fadeOut(this.currentMusic, config.fadeOut);
                this.currentMusic.pause();
            }

            // Load and play new music
            const audio = await this.preloadAudio(`music_${trackName}`, url);
            audio.loop = config.loop;
            audio.volume = 0;
            
            await audio.play();
            this.currentMusic = audio;
            this.activeSounds.set(`music_${trackName}`, audio);
            
            // Fade in new music
            if (config.fadeIn > 0) {
                await this.fadeIn(audio, config.volume, config.fadeIn);
            } else {
                audio.volume = config.volume;
            }
            
            console.log(`🎵 Playing music: ${trackName}`);
            
        } catch (error) {
            console.warn(`Failed to play music: ${trackName}`, error);
        }
    }

    /**
     * Play sound effect
     */
    async playEffect(effectName, options = {}) {
        if (!this.settings.effectsEnabled) return;

        const defaults = {
            volume: this.settings.effectsVolume * this.settings.masterVolume,
            loop: false,
            delay: 0
        };
        
        const config = { ...defaults, ...options };
        const url = this.audioLibrary.effects[effectName];
        
        if (!url) {
            console.warn(`Sound effect not found: ${effectName}`);
            return;
        }

        try {
            if (config.delay > 0) {
                setTimeout(() => this.playEffect(effectName, { ...config, delay: 0 }), config.delay);
                return;
            }

            const audio = await this.preloadAudio(`effect_${effectName}`, url);
            
            // Clone audio for simultaneous playback
            const audioClone = audio.cloneNode();
            audioClone.volume = config.volume;
            audioClone.loop = config.loop;
            
            const playId = `effect_${effectName}_${Date.now()}`;
            this.activeSounds.set(playId, audioClone);
            
            audioClone.addEventListener('ended', () => {
                this.activeSounds.delete(playId);
            });
            
            await audioClone.play();
            console.log(`🔊 Playing effect: ${effectName}`);
            
        } catch (error) {
            console.warn(`Failed to play effect: ${effectName}`, error);
        }
    }

    /**
     * Play character voice
     */
    async playVoice(character, clipName, options = {}) {
        if (!this.settings.voicesEnabled) return;

        const defaults = {
            volume: this.settings.voiceVolume * this.settings.masterVolume,
            interrupt: true
        };
        
        const config = { ...defaults, ...options };
        const voiceData = this.audioLibrary.voices[character];
        
        if (!voiceData || !voiceData[clipName]) {
            console.warn(`Voice clip not found: ${character}.${clipName}`);
            return;
        }

        try {
            // Stop current voice if interrupting
            if (config.interrupt) {
                this.stopVoices();
            }

            const url = voiceData[clipName];
            const audio = await this.preloadAudio(`voice_${character}_${clipName}`, url);
            
            audio.volume = config.volume;
            const playId = `voice_${character}_${clipName}_${Date.now()}`;
            this.activeSounds.set(playId, audio);
            
            audio.addEventListener('ended', () => {
                this.activeSounds.delete(playId);
            });
            
            await audio.play();
            console.log(`🗣️ Playing voice: ${character}.${clipName}`);
            
        } catch (error) {
            console.warn(`Failed to play voice: ${character}.${clipName}`, error);
        }
    }

    /**
     * Play ambient sound
     */
    async playAmbient(ambientName, options = {}) {
        if (!this.settings.ambientEnabled) return;

        const defaults = {
            volume: this.settings.ambientVolume * this.settings.masterVolume,
            loop: true,
            fadeIn: 3000
        };
        
        const config = { ...defaults, ...options };
        const url = this.audioLibrary.ambient[ambientName];
        
        if (!url) {
            console.warn(`Ambient sound not found: ${ambientName}`);
            return;
        }

        try {
            // Stop current ambient
            this.stopAmbient();

            const audio = await this.preloadAudio(`ambient_${ambientName}`, url);
            audio.loop = config.loop;
            audio.volume = 0;
            
            await audio.play();
            this.activeSounds.set(`ambient_${ambientName}`, audio);
            
            // Fade in ambient sound
            if (config.fadeIn > 0) {
                await this.fadeIn(audio, config.volume, config.fadeIn);
            } else {
                audio.volume = config.volume;
            }
            
            console.log(`🌊 Playing ambient: ${ambientName}`);
            
        } catch (error) {
            console.warn(`Failed to play ambient: ${ambientName}`, error);
        }
    }

    /**
     * Fade in audio
     */
    async fadeIn(audio, targetVolume, duration) {
        return new Promise(resolve => {
            const startVolume = audio.volume;
            const steps = 50;
            const stepTime = duration / steps;
            const volumeStep = (targetVolume - startVolume) / steps;
            
            let currentStep = 0;
            const fadeInterval = setInterval(() => {
                currentStep++;
                audio.volume = Math.min(startVolume + (volumeStep * currentStep), targetVolume);
                
                if (currentStep >= steps) {
                    clearInterval(fadeInterval);
                    audio.volume = targetVolume;
                    resolve();
                }
            }, stepTime);
        });
    }

    /**
     * Fade out audio
     */
    async fadeOut(audio, duration) {
        return new Promise(resolve => {
            const startVolume = audio.volume;
            const steps = 50;
            const stepTime = duration / steps;
            const volumeStep = startVolume / steps;
            
            let currentStep = 0;
            const fadeInterval = setInterval(() => {
                currentStep++;
                audio.volume = Math.max(startVolume - (volumeStep * currentStep), 0);
                
                if (currentStep >= steps) {
                    clearInterval(fadeInterval);
                    audio.volume = 0;
                    resolve();
                }
            }, stepTime);
        });
    }

    /**
     * Stop specific audio type
     */
    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
            this.currentMusic = null;
        }
        
        this.activeSounds.forEach((audio, key) => {
            if (key.startsWith('music_')) {
                audio.pause();
                this.activeSounds.delete(key);
            }
        });
    }

    stopEffects() {
        this.activeSounds.forEach((audio, key) => {
            if (key.startsWith('effect_')) {
                audio.pause();
                this.activeSounds.delete(key);
            }
        });
    }

    stopVoices() {
        this.activeSounds.forEach((audio, key) => {
            if (key.startsWith('voice_')) {
                audio.pause();
                this.activeSounds.delete(key);
            }
        });
    }

    stopAmbient() {
        this.activeSounds.forEach((audio, key) => {
            if (key.startsWith('ambient_')) {
                audio.pause();
                this.activeSounds.delete(key);
            }
        });
    }

    /**
     * Stop all audio
     */
    stopAll() {
        this.stopMusic();
        this.stopEffects();
        this.stopVoices();
        this.stopAmbient();
    }

    /**
     * Pause all audio
     */
    pauseAll() {
        this.activeSounds.forEach(audio => {
            if (!audio.paused) {
                audio.pause();
                audio.dataset.wasPaused = 'false';
            } else {
                audio.dataset.wasPaused = 'true';
            }
        });
    }

    /**
     * Resume all audio
     */
    resumeAll() {
        this.activeSounds.forEach(audio => {
            if (audio.dataset.wasPaused === 'false') {
                audio.play().catch(console.warn);
            }
        });
    }

    /**
     * Update volume settings
     */
    setMasterVolume(volume) {
        this.settings.masterVolume = Math.max(0, Math.min(1, volume));
        this.updateAllVolumes();
        this.saveSettings();
    }

    setMusicVolume(volume) {
        this.settings.musicVolume = Math.max(0, Math.min(1, volume));
        this.updateMusicVolume();
        this.saveSettings();
    }

    setEffectsVolume(volume) {
        this.settings.effectsVolume = Math.max(0, Math.min(1, volume));
        this.saveSettings();
    }

    setVoiceVolume(volume) {
        this.settings.voiceVolume = Math.max(0, Math.min(1, volume));
        this.saveSettings();
    }

    setAmbientVolume(volume) {
        this.settings.ambientVolume = Math.max(0, Math.min(1, volume));
        this.updateAmbientVolume();
        this.saveSettings();
    }

    /**
     * Update volumes for active audio
     */
    updateAllVolumes() {
        this.updateMusicVolume();
        this.updateAmbientVolume();
    }

    updateMusicVolume() {
        const targetVolume = this.settings.musicVolume * this.settings.masterVolume;
        if (this.currentMusic) {
            this.currentMusic.volume = targetVolume;
        }
    }

    updateAmbientVolume() {
        const targetVolume = this.settings.ambientVolume * this.settings.masterVolume;
        this.activeSounds.forEach((audio, key) => {
            if (key.startsWith('ambient_')) {
                audio.volume = targetVolume;
            }
        });
    }

    /**
     * Toggle audio categories
     */
    toggleMusic() {
        this.settings.musicEnabled = !this.settings.musicEnabled;
        if (!this.settings.musicEnabled) {
            this.stopMusic();
        }
        this.saveSettings();
        return this.settings.musicEnabled;
    }

    toggleEffects() {
        this.settings.effectsEnabled = !this.settings.effectsEnabled;
        if (!this.settings.effectsEnabled) {
            this.stopEffects();
        }
        this.saveSettings();
        return this.settings.effectsEnabled;
    }

    toggleVoices() {
        this.settings.voicesEnabled = !this.settings.voicesEnabled;
        if (!this.settings.voicesEnabled) {
            this.stopVoices();
        }
        this.saveSettings();
        return this.settings.voicesEnabled;
    }

    toggleAmbient() {
        this.settings.ambientEnabled = !this.settings.ambientEnabled;
        if (!this.settings.ambientEnabled) {
            this.stopAmbient();
        }
        this.saveSettings();
        return this.settings.ambientEnabled;
    }

    /**
     * Scene-based audio management
     */
    playSceneAudio(sceneId) {
        // Stop current audio and play scene-appropriate tracks
        this.stopVoices();
        
        const sceneAudioMap = {
            'start': { music: 'menu', ambient: null },
            'library': { music: 'library', ambient: 'library' },
            'dragonPath': { music: 'cave', ambient: 'cave' },
            'wizardPath': { music: 'tower', ambient: 'tower' },
            'explorerPath': { music: 'clouds', ambient: 'clouds' },
            'puzzle': { music: 'puzzle', ambient: null },
            'celebration': { music: 'celebration', ambient: null }
        };
        
        const audioConfig = sceneAudioMap[sceneId] || sceneAudioMap['library'];
        
        if (audioConfig.music) {
            this.playMusic(audioConfig.music);
        }
        
        if (audioConfig.ambient) {
            this.playAmbient(audioConfig.ambient);
        }
    }

    /**
     * Get current settings for UI
     */
    getSettings() {
        return { ...this.settings };
    }

    /**
     * Clean up sound system
     */
    destroy() {
        this.stopAll();
        
        // Clear timeouts
        this.fadeTimeouts.forEach(timeout => clearTimeout(timeout));
        this.fadeTimeouts.clear();
        
        // Close audio context
        if (this.audioContext) {
            this.audioContext.close();
        }
        
        // Clear caches
        this.audioCache.clear();
        this.activeSounds.clear();
        
        console.log('🔊 Sound system destroyed');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SoundSystem;
} else {
    window.SoundSystem = SoundSystem;
}
