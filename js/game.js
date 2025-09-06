/**
 * THE ENCHANTED LIBRARY QUEST - CORE GAME ENGINE
 * FableBox Educational Adventure Game
 * 
 * This file contains the main game engine that handles:
 * - Game state management and persistence
 * - Screen transitions and UI updates
 * - Player progress tracking
 * - Audio and visual effects
 * - Accessibility features
 */

class EnchantedLibraryGame {
    constructor() {
        // Validate configuration is loaded
        if (typeof CONFIG === 'undefined') {
            throw new Error('🔧 Game configuration not loaded. Please ensure gameConfig.js is loaded first.');
        }
        
        console.log(`🎮 Initializing ${CONFIG.NAME} v${CONFIG.VERSION} for ${CONFIG.DEVELOPER}`);
        
        // Game state initialization (driven by CONFIG)
        this.gameState = {
            currentScreen: 'loading',
            gameStarted: false,
            player: {
                name: '',
                character: null,
                difficulty: CONFIG.FEATURES.ADAPTIVE_DIFFICULTY ? 'auto' : 'scholar',
                currentPath: null,
                currentScene: null,
                age: CONFIG.TARGET_AGE_RANGE.min
            },
            progress: {
                stars: 0,
                puzzlesSolved: 0,
                totalPuzzles: CONFIG.CONTENT.PUZZLES_PER_PATH * CONFIG.CONTENT.STORY_PATHS.length,
                completionPercentage: 0,
                achievements: [],
                pathsCompleted: [],
                skillLevels: {
                    math: 1,
                    language: 1,
                    science: 1
                }
            },
            settings: {
                soundEnabled: CONFIG.FEATURES.SOUNDS_ENABLED,
                musicEnabled: CONFIG.FEATURES.BACKGROUND_MUSIC,
                animationsEnabled: CONFIG.FEATURES.ADVANCED_ANIMATIONS,
                autoSave: CONFIG.FEATURES.AUTO_SAVE,
                particleEffects: CONFIG.FEATURES.PARTICLE_EFFECTS,
                offlineMode: CONFIG.FEATURES.OFFLINE_MODE,
                accessibilityMode: CONFIG.FEATURES.ACCESSIBILITY,
                language: CONFIG.UI.DEFAULT_LANGUAGE
            },
            session: {
                startTime: null,
                lastSaveTime: null,
                totalPlayTime: 0,
                environment: CONFIG.ENVIRONMENT,
                version: CONFIG.VERSION
            },
            subscription: {
                tier: CONFIG.PREMIUM_FEATURES ? 'premium' : 'free',
                dailyPlaysUsed: 0,
                trialActive: false
            }
        };

        // Game data storage
        this.gameData = null;
        this.currentStoryPath = null;
        this.currentScene = null;
        
        // Game subsystems
        this.sceneManager = null;
        this.puzzleSystem = null;
        
        // UI element references
        this.screens = {};
        this.progressBar = null;
        this.particleContainer = null;
        this.screenReader = null;
        
        // Game configuration
        this.config = {
            autoSaveInterval: 30000, // 30 seconds
            particleLifetime: 3000,
            transitionDuration: 500,
            maxParticles: 20
        };

        // Bind methods to preserve context
        this.handleKeyboardInput = this.handleKeyboardInput.bind(this);
        this.autoSave = this.autoSave.bind(this);
        this.updateProgress = this.updateProgress.bind(this);
    }

    /**
     * Initialize the game
     */
    async initialize() {
        try {
            console.log('🎮 Initializing Enchanted Library Quest...');
            
            // Load game data
            await this.loadGameData();
            
            // Initialize UI elements
            this.initializeUI();
            
            // Initialize subsystems
            this.initializeSubsystems();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Check for saved game
            this.loadSavedGame();
            
            // Start loading sequence
            this.startLoadingSequence();
            
            console.log('✅ Game initialization complete!');
            
        } catch (error) {
            console.error('❌ Game initialization failed:', error);
            this.showError('Failed to initialize game. Please refresh and try again.');
        }
    }

    /**
     * Load game data from JSON file
     */
    async loadGameData() {
        try {
            const response = await fetch('assets/data/gameData.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.gameData = await response.json();
            console.log('📊 Game data loaded successfully');
        } catch (error) {
            console.error('❌ Failed to load game data:', error);
            throw error;
        }
    }

    /**
     * Initialize UI element references
     */
    initializeUI() {
        // Screen references
        this.screens = {
            loading: document.getElementById('loading-screen'),
            welcome: document.getElementById('welcome-screen'),
            characterCreation: document.getElementById('character-creation'),
            story: document.getElementById('story-screen'),
            puzzle: document.getElementById('puzzle-screen'),
            results: document.getElementById('results-screen')
        };

        // Progress tracking elements
        this.progressBar = {
            container: document.querySelector('.progress-header'),
            fill: document.getElementById('progress-fill'),
            stars: document.getElementById('stars-count'),
            completion: document.getElementById('completion-percent')
        };

        // Other UI elements
        this.particleContainer = document.getElementById('particles-container');
        this.screenReader = document.getElementById('sr-announcements');
        
        // Validate all required elements exist
        for (const [name, element] of Object.entries(this.screens)) {
            if (!element) {
                throw new Error(`Required screen element not found: ${name}`);
            }
        }

        console.log('🖥️ UI elements initialized');
    }

    /**
     * Initialize game subsystems
     */
    initializeSubsystems() {
        // Initialize animation system
        if (typeof AnimationSystem !== 'undefined') {
            this.animationSystem = new AnimationSystem(this);
        }
        
        // Initialize sound system
        if (typeof SoundSystem !== 'undefined') {
            this.soundSystem = new SoundSystem(this);
        }
        
        // Initialize save system
        if (typeof SaveSystem !== 'undefined') {
            this.saveSystem = new SaveSystem(this);
        }
        
        // Initialize achievement system
        if (typeof AchievementSystem !== 'undefined') {
            this.achievementSystem = new AchievementSystem(this);
        }
        
        // Initialize parent dashboard
        if (typeof ParentDashboard !== 'undefined') {
            window.parentDashboard = new ParentDashboard(this);
        }
        
        // Initialize monetization system
        if (typeof MonetizationSystem !== 'undefined') {
            this.monetizationSystem = new MonetizationSystem(this);
        }
        
        // Initialize social system
        if (typeof SocialSystem !== 'undefined') {
            this.socialSystem = new SocialSystem(this);
        }
        
        // Initialize analytics system
        if (typeof AnalyticsSystem !== 'undefined') {
            this.analyticsSystem = new AnalyticsSystem(this);
        }
        
        // Note: Accessibility and Internationalization systems are initialized 
        // globally in index.html to ensure they're available before game content loads
        
        // Initialize scene manager
        if (typeof SceneManager !== 'undefined') {
            this.sceneManager = new SceneManager(this);
            this.sceneManager.initialize();
        }
        
        // Initialize puzzle system
        if (typeof PuzzleSystem !== 'undefined') {
            this.puzzleSystem = new PuzzleSystem(this);
            this.puzzleSystem.initialize();
        }
        
        console.log('🔧 All game systems initialized');
        
        // Setup auto-save if enabled
        if (CONFIG.FEATURES.AUTO_SAVE) {
            this.setupAutoSave();
        }
        
        // Log configuration status
        if (CONFIG.isDevelopment()) {
            this.logConfigurationStatus();
        }
    }

    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        // Welcome screen buttons
        const startNewGameBtn = document.getElementById('start-new-game');
        const continueGameBtn = document.getElementById('continue-game');
        
        if (startNewGameBtn) {
            startNewGameBtn.addEventListener('click', () => this.startNewGame());
        }
        
        if (continueGameBtn) {
            continueGameBtn.addEventListener('click', () => this.continueGame());
        }

        // Character creation
        this.setupCharacterCreation();
        
        // Audio controls
        const muteBtn = document.getElementById('mute-btn');
        if (muteBtn) {
            muteBtn.addEventListener('click', () => this.toggleSound());
        }

        // Certificate modal
        this.setupCertificateModal();

        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyboardInput);
        
        // Auto-save interval
        if (this.gameState.settings.autoSave) {
            setInterval(this.autoSave, this.config.autoSaveInterval);
        }

        // Window events
        window.addEventListener('beforeunload', () => this.saveGame());
        window.addEventListener('focus', () => this.handleWindowFocus());
        window.addEventListener('blur', () => this.handleWindowBlur());

        console.log('🎧 Event listeners set up');
    }

    /**
     * Set up character creation interface
     */
    setupCharacterCreation() {
        const characterOptions = document.querySelectorAll('.character-option');
        const playerNameInput = document.getElementById('player-name');
        const beginAdventureBtn = document.getElementById('begin-adventure');
        const difficultyOptions = document.querySelectorAll('input[name="difficulty"]');

        // Character selection
        characterOptions.forEach(option => {
            option.addEventListener('click', () => this.selectCharacter(option));
            option.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.selectCharacter(option);
                }
            });
        });

        // Name input validation
        if (playerNameInput) {
            playerNameInput.addEventListener('input', () => this.validateCharacterCreation());
            playerNameInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.validateCharacterCreation();
                    if (!beginAdventureBtn.disabled) {
                        this.beginAdventure();
                    }
                }
            });
        }

        // Difficulty selection
        difficultyOptions.forEach(option => {
            option.addEventListener('change', () => {
                this.gameState.player.difficulty = option.value;
                this.announceToScreenReader(`Difficulty set to ${option.value}`);
            });
        });

        // Begin adventure button
        if (beginAdventureBtn) {
            beginAdventureBtn.addEventListener('click', () => this.beginAdventure());
        }
    }

    /**
     * Set up certificate modal functionality
     */
    setupCertificateModal() {
        const modal = document.getElementById('certificate-modal');
        const closeBtn = document.querySelector('.modal-close');
        const printBtn = document.getElementById('print-cert-btn');
        const printCertificateBtn = document.getElementById('print-certificate');

        if (printCertificateBtn) {
            printCertificateBtn.addEventListener('click', () => this.showCertificate());
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideCertificate());
        }

        if (printBtn) {
            printBtn.addEventListener('click', () => this.printCertificate());
        }

        // Close modal on outside click
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideCertificate();
                }
            });
        }
    }

    /**
     * Handle keyboard input for accessibility
     */
    handleKeyboardInput(event) {
        const { key, ctrlKey, altKey } = event;
        
        // Global keyboard shortcuts
        if (key === 'Escape') {
            this.handleEscape();
        } else if (key === 'h' && ctrlKey) {
            event.preventDefault();
            this.showHelp();
        } else if (key === 's' && ctrlKey) {
            event.preventDefault();
            this.saveGame();
            this.announceToScreenReader('Game saved');
        }

        // Screen-specific keyboard handling
        switch (this.gameState.currentScreen) {
            case 'characterCreation':
                this.handleCharacterCreationKeys(event);
                break;
            case 'story':
                this.handleStoryKeys(event);
                break;
            case 'puzzle':
                this.handlePuzzleKeys(event);
                break;
        }
    }

    /**
     * Handle character creation keyboard navigation
     */
    handleCharacterCreationKeys(event) {
        const characters = document.querySelectorAll('.character-option');
        const currentSelected = document.querySelector('.character-option.selected');
        
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            let currentIndex = Array.from(characters).indexOf(currentSelected);
            
            if (event.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % characters.length;
            } else {
                currentIndex = (currentIndex - 1 + characters.length) % characters.length;
            }
            
            this.selectCharacter(characters[currentIndex]);
            characters[currentIndex].focus();
        }
    }

    /**
     * Start the loading sequence
     */
    startLoadingSequence() {
        this.showScreen('loading');
        
        // Simulate loading time for dramatic effect
        setTimeout(() => {
            this.showScreen('welcome');
            this.updateContinueButtonVisibility();
        }, 3000);
    }

    /**
     * Check if saved game exists and update continue button
     */
    updateContinueButtonVisibility() {
        const continueBtn = document.getElementById('continue-game');
        const hasSavedGame = localStorage.getItem('enchantedLibraryGame') !== null;
        
        if (continueBtn) {
            continueBtn.style.display = hasSavedGame ? 'block' : 'none';
        }
    }

    /**
     * Start a new game
     */
    startNewGame() {
        console.log('🆕 Starting new game...');
        
        // Reset game state
        this.resetGameState();
        
        // Show character creation
        this.showScreen('characterCreation');
        
        // Focus on name input
        const nameInput = document.getElementById('player-name');
        if (nameInput) {
            setTimeout(() => nameInput.focus(), 100);
        }

        this.announceToScreenReader('Starting new adventure. Please enter your name and choose a companion.');
    }

    /**
     * Continue existing game
     */
    continueGame() {
        console.log('▶️ Continuing saved game...');
        
        if (this.loadSavedGame()) {
            this.resumeGame();
        } else {
            this.showError('No saved game found. Starting new game instead.');
            this.startNewGame();
        }
    }

    /**
     * Reset game state to initial values
     */
    resetGameState() {
        this.gameState = {
            currentScreen: 'characterCreation',
            gameStarted: false,
            player: {
                name: '',
                character: null,
                difficulty: 'easy',
                currentPath: null,
                currentScene: null
            },
            progress: {
                stars: 0,
                puzzlesSolved: 0,
                totalPuzzles: 0,
                completionPercentage: 0,
                achievements: [],
                pathsCompleted: []
            },
            settings: {
                soundEnabled: true,
                animationsEnabled: true,
                autoSave: true
            },
            session: {
                startTime: Date.now(),
                lastSaveTime: null,
                totalPlayTime: 0
            }
        };
        
        // Clear any selected character
        document.querySelectorAll('.character-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Reset form
        const nameInput = document.getElementById('player-name');
        if (nameInput) {
            nameInput.value = '';
        }
        
        // Reset difficulty to easy
        const easyRadio = document.querySelector('input[name="difficulty"][value="easy"]');
        if (easyRadio) {
            easyRadio.checked = true;
        }
    }

    /**
     * Select a character companion
     */
    selectCharacter(characterElement) {
        if (!characterElement) return;
        
        // Remove previous selection
        document.querySelectorAll('.character-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Add selection to clicked character
        characterElement.classList.add('selected');
        
        // Store character choice
        const characterId = characterElement.dataset.character;
        this.gameState.player.character = characterId;
        
        // Get character data for announcement
        const characterData = this.gameData?.characters[characterId];
        if (characterData) {
            this.announceToScreenReader(`Selected ${characterData.name}, ${characterData.description}`);
        }
        
        // Validate form
        this.validateCharacterCreation();
        
        // Add selection animation
        this.addSelectionEffect(characterElement);
    }

    /**
     * Add visual effect for character selection
     */
    addSelectionEffect(element) {
        if (!this.gameState.settings.animationsEnabled) return;
        
        element.style.transform = 'scale(1.05)';
        setTimeout(() => {
            element.style.transform = '';
        }, 200);
        
        this.createParticles(element, '✨', 5);
    }

    /**
     * Validate character creation form
     */
    validateCharacterCreation() {
        const nameInput = document.getElementById('player-name');
        const beginBtn = document.getElementById('begin-adventure');
        
        if (!nameInput || !beginBtn) return;
        
        const name = nameInput.value.trim();
        const character = this.gameState.player.character;
        
        const isValid = name.length >= 1 && character !== null;
        
        beginBtn.disabled = !isValid;
        
        if (isValid) {
            beginBtn.classList.add('pulse'); // Add visual feedback
            this.gameState.player.name = name;
        } else {
            beginBtn.classList.remove('pulse');
        }
        
        return isValid;
    }

    /**
     * Begin the adventure after character creation
     */
    beginAdventure() {
        if (!this.validateCharacterCreation()) {
            this.announceToScreenReader('Please enter your name and select a character before beginning.');
            return;
        }
        
        console.log('🚀 Beginning adventure with:', this.gameState.player);
        
        // Set up progress tracking
        this.initializeProgress();
        
        // Show progress bar
        if (this.progressBar.container) {
            this.progressBar.container.classList.add('visible');
        }
        
        // Start the appropriate story path
        this.startStoryPath();
        
        // Mark game as started
        this.gameState.gameStarted = true;
        this.gameState.session.startTime = Date.now();
        
        // Save initial state
        this.saveGame();
        
        this.announceToScreenReader(`Adventure begins! You are ${this.gameState.player.name} with ${this.getCharacterData().name} as your companion.`);
    }

    /**
     * Initialize progress tracking
     */
    initializeProgress() {
        const characterId = this.gameState.player.character;
        const storyPath = this.gameData.storyPaths[characterId];
        
        if (storyPath) {
            this.gameState.progress.totalPuzzles = this.countPuzzlesInPath(storyPath);
            this.currentStoryPath = storyPath;
        }
        
        this.updateProgressDisplay();
    }

    /**
     * Count total puzzles in a story path
     */
    countPuzzlesInPath(storyPath) {
        return storyPath.scenes.filter(scene => scene.type === 'puzzle').length;
    }

    /**
     * Start the story path for selected character
     */
    startStoryPath() {
        // Start with the introduction scene - no character selected yet
        this.loadScene('start');
    }

    /**
     * Load and display a specific scene
     */
    loadScene(sceneId) {
        console.log('🎬 Loading scene:', sceneId);
        
        this.gameState.player.currentScene = sceneId;
        
        // Use scene manager for scene loading
        if (this.sceneManager) {
            this.sceneManager.loadScene(sceneId);
        } else {
            this.showError('Scene manager not available');
            return;
        }
        
        // Update progress
        this.updateProgress();
        this.saveGame();
    }

    /**
     * Display a story scene
     */
    showStoryScene(scene) {
        this.showScreen('story');
        
        // Update scene content
        this.updateElement('scene-title', scene.title);
        this.updateElement('scene-location', scene.location);
        this.updateElement('story-text', scene.text);
        
        // Update character dialogue
        if (scene.characterDialogue) {
            const dialogueElement = document.getElementById('character-dialogue');
            if (dialogueElement) {
                dialogueElement.innerHTML = `<strong>${this.getCharacterData().name}:</strong> "${scene.characterDialogue}"`;
                dialogueElement.style.display = 'block';
            }
        }
        
        // Update companion avatar
        this.updateCompanionAvatar();
        
        // Update scene background
        this.updateSceneBackground(scene.background);
        
        // Handle choices or continue button
        if (scene.choices && scene.choices.length > 0) {
            this.showChoices(scene.choices);
        } else {
            this.showContinueButton(scene);
        }
        
        // Announce scene to screen reader
        this.announceToScreenReader(`${scene.title}. ${scene.text}`);
        
        // Play scene animations
        this.playSceneAnimations(scene);
    }

    /**
     * Display a puzzle scene
     */
    showPuzzleScene(scene) {
        this.showScreen('puzzle');
        
        // Use puzzle system for puzzle handling
        if (this.puzzleSystem) {
            this.puzzleSystem.loadPuzzle(scene.puzzleId, scene);
        } else {
            // Fallback to direct puzzle handling
            this.updateElement('puzzle-title', scene.title);
            this.updateElement('puzzle-question', scene.text);
            this.loadPuzzle(scene.puzzleId);
            this.setupPuzzleHandlers(scene);
        }
        
        this.announceToScreenReader(`Puzzle challenge: ${scene.title}. ${scene.text}`);
    }

    /**
     * Load and setup a puzzle
     */
    loadPuzzle(puzzleId) {
        const puzzle = this.gameData.puzzles[puzzleId];
        
        if (!puzzle) {
            this.showError(`Puzzle not found: ${puzzleId}`);
            return;
        }
        
        // Get difficulty-specific puzzle data
        const difficulty = this.gameState.player.difficulty;
        const puzzleData = puzzle.difficulty[difficulty];
        
        if (!puzzleData) {
            this.showError(`Puzzle difficulty not found: ${difficulty}`);
            return;
        }
        
        // Update puzzle info
        this.updateElement('puzzle-type', puzzle.subtype.charAt(0).toUpperCase() + puzzle.subtype.slice(1));
        this.updateElement('puzzle-difficulty', this.gameState.player.difficulty.charAt(0).toUpperCase() + this.gameState.player.difficulty.slice(1));
        
        // Update puzzle question
        this.updateElement('puzzle-question', puzzleData.question);
        
        // Create puzzle input interface
        this.createPuzzleInterface(puzzleData);
        
        // Store current puzzle for validation
        this.currentPuzzle = {
            id: puzzleId,
            data: puzzleData,
            attempts: 0,
            maxAttempts: this.currentScene.maxAttempts || 3
        };
    }

    /**
     * Create the appropriate puzzle interface based on type
     */
    createPuzzleInterface(puzzleData) {
        const container = document.getElementById('puzzle-input-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (puzzleData.options) {
            // Multiple choice interface
            this.createMultipleChoiceInterface(container, puzzleData);
        } else if (puzzleData.inputType === 'number') {
            // Number input interface
            this.createNumberInputInterface(container, puzzleData);
        } else if (puzzleData.inputType === 'text') {
            // Text input interface
            this.createTextInputInterface(container, puzzleData);
        } else if (puzzleData.inputType === 'matching') {
            // Matching interface
            this.createMatchingInterface(container, puzzleData);
        } else if (puzzleData.inputType === 'ordering') {
            // Word ordering interface
            this.createOrderingInterface(container, puzzleData);
        }
    }

    /**
     * Create multiple choice interface
     */
    createMultipleChoiceInterface(container, puzzleData) {
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'multiple-choice-options';
        
        puzzleData.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'choice-btn';
            button.textContent = option;
            button.onclick = () => this.selectChoice(button, option);
            button.onkeydown = (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.selectChoice(button, option);
                }
            };
            button.setAttribute('aria-label', `Choice ${index + 1}: ${option}`);
            
            optionsContainer.appendChild(button);
        });
        
        container.appendChild(optionsContainer);
    }

    /**
     * Create number input interface
     */
    createNumberInputInterface(container, puzzleData) {
        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'puzzle-input';
        input.placeholder = 'Enter your answer';
        input.id = 'puzzle-answer-input';
        input.setAttribute('aria-label', 'Number answer input');
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.submitPuzzleAnswer();
            }
        });
        
        container.appendChild(input);
    }

    /**
     * Create text input interface
     */
    createTextInputInterface(container, puzzleData) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'puzzle-input';
        input.placeholder = 'Type your answer';
        input.id = 'puzzle-answer-input';
        input.setAttribute('aria-label', 'Text answer input');
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.submitPuzzleAnswer();
            }
        });
        
        container.appendChild(input);
    }

    /**
     * Setup puzzle interaction handlers
     */
    setupPuzzleHandlers(scene) {
        const submitBtn = document.getElementById('submit-answer');
        const hintBtn = document.getElementById('puzzle-hint');
        const skipBtn = document.getElementById('skip-puzzle');
        
        if (submitBtn) {
            submitBtn.onclick = () => this.submitPuzzleAnswer();
        }
        
        if (hintBtn) {
            hintBtn.onclick = () => this.showHint();
        }
        
        if (skipBtn) {
            skipBtn.onclick = () => this.skipPuzzle();
        }
    }

    /**
     * Select a multiple choice option
     */
    selectChoice(button, choice) {
        // Remove previous selections
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Mark new selection
        button.classList.add('selected');
        
        // Store selected answer
        this.selectedAnswer = choice;
        
        this.announceToScreenReader(`Selected: ${choice}`);
    }

    /**
     * Submit puzzle answer
     */
    submitPuzzleAnswer() {
        if (!this.currentPuzzle) return;
        
        let userAnswer = this.getUserAnswer();
        
        if (userAnswer === null || userAnswer === undefined || userAnswer === '') {
            this.showPuzzleFeedback('Please select or enter an answer before submitting.', 'error');
            return;
        }
        
        this.currentPuzzle.attempts++;
        
        // Check if answer is correct
        const isCorrect = this.validateAnswer(userAnswer, this.currentPuzzle.data.answer);
        
        if (isCorrect) {
            this.handleCorrectAnswer();
        } else {
            this.handleIncorrectAnswer();
        }
    }

    /**
     * Get user's answer based on interface type
     */
    getUserAnswer() {
        if (this.selectedAnswer !== undefined) {
            return this.selectedAnswer;
        }
        
        const input = document.getElementById('puzzle-answer-input');
        if (input) {
            return input.type === 'number' ? parseInt(input.value) : input.value.trim();
        }
        
        return null;
    }

    /**
     * Validate user answer against correct answer
     */
    validateAnswer(userAnswer, correctAnswer) {
        // Handle different answer types
        if (Array.isArray(correctAnswer)) {
            // For matching or multiple correct answers
            return correctAnswer.some(answer => 
                this.normalizeAnswer(userAnswer) === this.normalizeAnswer(answer)
            );
        } else if (typeof correctAnswer === 'object') {
            // For matching puzzles with key-value pairs
            return JSON.stringify(userAnswer) === JSON.stringify(correctAnswer);
        } else {
            // Simple comparison
            return this.normalizeAnswer(userAnswer) === this.normalizeAnswer(correctAnswer);
        }
    }

    /**
     * Normalize answer for comparison (case-insensitive, trim whitespace)
     */
    normalizeAnswer(answer) {
        if (typeof answer === 'string') {
            return answer.toLowerCase().trim();
        }
        return answer;
    }

    /**
     * Handle correct answer
     */
    handleCorrectAnswer() {
        console.log('✅ Correct answer!');
        
        const starsEarned = this.calculateStarsEarned();
        this.gameState.progress.stars += starsEarned;
        this.gameState.progress.puzzlesSolved++;
        
        // Show success feedback
        this.showPuzzleFeedback(
            `🎉 Excellent! ${this.currentPuzzle.data.explanation} You earned ${starsEarned} stars!`,
            'success'
        );
        
        // Create celebration particles
        this.createCelebrationEffect();
        
        // Continue to next scene after delay
        setTimeout(() => {
            this.proceedToNextScene(this.currentScene.successScene);
        }, 2000);
        
        this.announceToScreenReader(`Correct! ${this.currentPuzzle.data.explanation}. Earned ${starsEarned} stars.`);
    }

    /**
     * Handle incorrect answer
     */
    handleIncorrectAnswer() {
        console.log('❌ Incorrect answer');
        
        const attemptsLeft = this.currentPuzzle.maxAttempts - this.currentPuzzle.attempts;
        
        if (attemptsLeft > 0) {
            this.showPuzzleFeedback(
                `Not quite right. You have ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining. Try again!`,
                'error'
            );
            
            // Clear input for retry
            const input = document.getElementById('puzzle-answer-input');
            if (input) {
                input.value = '';
                input.focus();
            }
            
            // Clear multiple choice selection
            this.selectedAnswer = undefined;
            document.querySelectorAll('.choice-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            
        } else {
            // No attempts left, show hint and allow continuation
            this.showPuzzleFeedback(
                `The correct answer was: ${this.currentPuzzle.data.answer}. ${this.currentPuzzle.data.explanation}`,
                'hint'
            );
            
            setTimeout(() => {
                this.proceedToNextScene(this.currentScene.failureScene || this.currentScene.successScene);
            }, 3000);
        }
        
        this.announceToScreenReader(`Incorrect. ${attemptsLeft > 0 ? `${attemptsLeft} attempts remaining.` : 'Moving to next scene.'}`);
    }

    /**
     * Calculate stars earned based on performance
     */
    calculateStarsEarned() {
        const baseStars = 2;
        const attempts = this.currentPuzzle.attempts;
        
        // Perfect attempt gets bonus star
        if (attempts === 1) {
            return baseStars + 1;
        } else if (attempts === 2) {
            return baseStars;
        } else {
            return Math.max(1, baseStars - 1);
        }
    }

    /**
     * Show puzzle feedback message
     */
    showPuzzleFeedback(message, type) {
        const feedbackElement = document.getElementById('puzzle-feedback');
        if (!feedbackElement) return;
        
        feedbackElement.textContent = message;
        feedbackElement.className = `puzzle-feedback ${type}`;
        
        // Auto-hide feedback after delay
        setTimeout(() => {
            feedbackElement.textContent = '';
            feedbackElement.className = 'puzzle-feedback';
        }, 10000);
    }

    /**
     * Show hint for current puzzle
     */
    showHint() {
        if (!this.currentPuzzle) return;
        
        const hint = this.currentPuzzle.data.hint;
        if (hint) {
            this.showPuzzleFeedback(`💡 Hint: ${hint}`, 'hint');
            this.announceToScreenReader(`Hint: ${hint}`);
        }
    }

    /**
     * Skip current puzzle (with star penalty)
     */
    skipPuzzle() {
        const skipPenalty = this.gameData.difficultyLevels[this.gameState.player.difficulty].modifiers.skipPenalty;
        
        if (skipPenalty > 0) {
            this.gameState.progress.stars = Math.max(0, this.gameState.progress.stars - skipPenalty);
            this.showPuzzleFeedback(`Puzzle skipped. Lost ${skipPenalty} star${skipPenalty !== 1 ? 's' : ''}.`, 'error');
        } else {
            this.showPuzzleFeedback('Puzzle skipped. No penalty for beginners!', 'hint');
        }
        
        setTimeout(() => {
            this.proceedToNextScene(this.currentScene.successScene);
        }, 1500);
        
        this.announceToScreenReader(`Puzzle skipped. ${skipPenalty > 0 ? `Lost ${skipPenalty} stars.` : 'No penalty.'}`);
    }

    /**
     * Proceed to the next scene
     */
    proceedToNextScene(nextSceneId) {
        if (nextSceneId === 'path_complete') {
            this.completeStoryPath();
        } else if (nextSceneId) {
            this.loadScene(nextSceneId);
        } else {
            console.error('No next scene specified');
            this.showError('Story progression error. Please restart the game.');
        }
    }

    /**
     * Complete the current story path
     */
    completeStoryPath() {
        console.log('🏆 Story path completed!');
        
        const characterId = this.gameState.player.character;
        this.gameState.progress.pathsCompleted.push(characterId);
        
        // Add completion bonus
        const bonusStars = 5;
        this.gameState.progress.stars += bonusStars;
        
        // Add achievement
        const achievement = this.getPathAchievement(characterId);
        if (achievement && !this.gameState.progress.achievements.includes(achievement.id)) {
            this.gameState.progress.achievements.push(achievement.id);
            this.gameState.progress.stars += achievement.rewardStars;
        }
        
        // Check for master achievement
        this.checkMasterAchievement();
        
        // Update completion percentage
        this.updateCompletionPercentage();
        
        // Show results screen
        this.showResultsScreen();
        
        this.announceToScreenReader('Congratulations! Story path completed! Viewing results...');
    }

    /**
     * Get achievement for completed path
     */
    getPathAchievement(characterId) {
        const achievementMap = {
            'dragon': 'dragon_master',
            'wizard': 'word_wizard',
            'mouse': 'science_explorer'
        };
        
        const achievementId = achievementMap[characterId];
        return achievementId ? this.gameData.achievements[achievementId] : null;
    }

    /**
     * Check if player earned master achievement
     */
    checkMasterAchievement() {
        const totalPaths = Object.keys(this.gameData.storyPaths).length;
        const completedPaths = this.gameState.progress.pathsCompleted.length;
        
        if (completedPaths >= totalPaths) {
            const masterAchievement = this.gameData.achievements.library_hero;
            if (masterAchievement && !this.gameState.progress.achievements.includes(masterAchievement.id)) {
                this.gameState.progress.achievements.push(masterAchievement.id);
                this.gameState.progress.stars += masterAchievement.rewardStars;
            }
        }
    }

    /**
     * Update completion percentage
     */
    updateCompletionPercentage() {
        const totalPaths = Object.keys(this.gameData.storyPaths).length;
        const completedPaths = this.gameState.progress.pathsCompleted.length;
        this.gameState.progress.completionPercentage = Math.round((completedPaths / totalPaths) * 100);
    }

    /**
     * Show results screen
     */
    showResultsScreen() {
        this.showScreen('results');
        
        // Update results display
        this.updateElement('final-stars', this.gameState.progress.stars);
        this.updateElement('puzzles-solved', this.gameState.progress.puzzlesSolved);
        this.updateElement('final-completion', `${this.gameState.progress.completionPercentage}%`);
        
        // Setup results screen buttons
        this.setupResultsButtons();
        
        // Create celebration effect
        this.createMajorCelebrationEffect();
    }

    /**
     * Setup results screen button handlers
     */
    setupResultsButtons() {
        const playAgainBtn = document.getElementById('play-again');
        const tryDifferentBtn = document.getElementById('try-different-path');
        
        if (playAgainBtn) {
            playAgainBtn.onclick = () => this.playAgain();
        }
        
        if (tryDifferentBtn) {
            tryDifferentBtn.onclick = () => this.tryDifferentPath();
        }
    }

    /**
     * Start over with same character
     */
    playAgain() {
        this.startNewGame();
    }

    /**
     * Try a different story path
     */
    tryDifferentPath() {
        // Reset to character selection but keep player name
        const playerName = this.gameState.player.name;
        this.resetGameState();
        this.gameState.player.name = playerName;
        
        // Pre-fill name input
        const nameInput = document.getElementById('player-name');
        if (nameInput) {
            nameInput.value = playerName;
        }
        
        this.showScreen('characterCreation');
        this.announceToScreenReader('Choose a different companion for a new adventure!');
    }

    /**
     * Show choices for story scene
     */
    showChoices(choices) {
        const container = document.getElementById('choice-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-option';
            button.textContent = choice.text;
            button.onclick = () => this.selectStoryChoice(choice);
            button.setAttribute('aria-label', `Choice ${index + 1}: ${choice.text}`);
            
            container.appendChild(button);
        });
        
        // Hide continue button
        const continueBtn = document.getElementById('continue-story');
        if (continueBtn) {
            continueBtn.style.display = 'none';
        }
    }

    /**
     * Select a story choice
     */
    selectStoryChoice(choice) {
        console.log('📖 Story choice selected:', choice.text);
        
        // Proceed to next scene
        if (choice.nextScene) {
            this.loadScene(choice.nextScene);
        }
        
        this.announceToScreenReader(`Selected: ${choice.text}`);
    }

    /**
     * Show continue button for story scene
     */
    showContinueButton(scene) {
        const container = document.getElementById('choice-container');
        const continueBtn = document.getElementById('continue-story');
        
        if (container) {
            container.innerHTML = '';
        }
        
        if (continueBtn) {
            continueBtn.style.display = 'block';
            continueBtn.onclick = () => {
                // Handle scene progression based on scene data
                // This is a simplified version - you might need more complex logic
                const nextSceneIndex = this.currentStoryPath.scenes.findIndex(s => s.id === scene.id) + 1;
                if (nextSceneIndex < this.currentStoryPath.scenes.length) {
                    const nextScene = this.currentStoryPath.scenes[nextSceneIndex];
                    this.loadScene(nextScene.id);
                } else {
                    this.completeStoryPath();
                }
            };
        }
    }

    /**
     * Update companion avatar display
     */
    updateCompanionAvatar() {
        const avatarElement = document.querySelector('.companion-avatar');
        if (!avatarElement) return;
        
        const characterData = this.getCharacterData();
        if (characterData) {
            avatarElement.innerHTML = characterData.emoji;
            avatarElement.style.background = characterData.color;
        }
    }

    /**
     * Update scene background
     */
    updateSceneBackground(backgroundId) {
        const backgroundElement = document.getElementById('scene-background');
        if (!backgroundElement) return;
        
        // For now, we'll use emoji backgrounds
        // In a full implementation, you'd load actual background images
        const backgroundMap = {
            'treasure-cave': '🏴‍☠️💎',
            'math-books': '📚🔢',
            'calculator-corner': '🧮💭',
            'pattern-palace': '🎭✨',
            'wizard-study': '🔮📖',
            'poetry-books': '📝🎵',
            'dictionary-hall': '📖🏛️',
            'grammar-garden': '🌸📝',
            'explorer-den': '🗺️🎒',
            'weather-station': '🌦️⛈️',
            'animal-habitats': '🦁🏔️',
            'geography-station': '🗺️🌍'
        };
        
        backgroundElement.innerHTML = backgroundMap[backgroundId] || '✨🏛️';
    }

    /**
     * Play scene animations
     */
    playSceneAnimations(scene) {
        if (!this.gameState.settings.animationsEnabled) return;
        
        if (scene.animations) {
            scene.animations.forEach(animation => {
                this.playAnimation(animation);
            });
        }
    }

    /**
     * Play specific animation
     */
    playAnimation(animationType) {
        switch (animationType) {
            case 'floating_gems':
                this.createFloatingElements('💎', 3);
                break;
            case 'sparkle_effects':
                this.createFloatingElements('✨', 5);
                break;
            default:
                console.log('Unknown animation type:', animationType);
        }
    }

    /**
     * Create floating elements animation
     */
    createFloatingElements(emoji, count) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                this.createParticle(emoji, {
                    x: Math.random() * window.innerWidth,
                    y: window.innerHeight + 50
                });
            }, i * 200);
        }
    }

    /**
     * Create particle effects
     */
    createParticles(sourceElement, emoji, count) {
        if (!this.gameState.settings.animationsEnabled) return;
        
        const rect = sourceElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                this.createParticle(emoji, {
                    x: centerX + (Math.random() - 0.5) * 100,
                    y: centerY + (Math.random() - 0.5) * 100
                });
            }, i * 100);
        }
    }

    /**
     * Create single particle
     */
    createParticle(content, position) {
        if (!this.particleContainer) return;
        
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = content;
        particle.style.left = position.x + 'px';
        particle.style.top = position.y + 'px';
        
        this.particleContainer.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, this.config.particleLifetime);
    }

    /**
     * Create celebration effect
     */
    createCelebrationEffect() {
        if (!this.gameState.settings.animationsEnabled) return;
        
        const emojis = ['🎉', '✨', '🌟', '🎊', '💫'];
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const emoji = emojis[Math.floor(Math.random() * emojis.length)];
                this.createParticle(emoji, {
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight
                });
            }, i * 100);
        }
    }

    /**
     * Create major celebration effect
     */
    createMajorCelebrationEffect() {
        if (!this.gameState.settings.animationsEnabled) return;
        
        // Multiple waves of celebration
        for (let wave = 0; wave < 3; wave++) {
            setTimeout(() => {
                this.createCelebrationEffect();
            }, wave * 1000);
        }
    }

    /**
     * Show certificate modal
     */
    showCertificate() {
        const modal = document.getElementById('certificate-modal');
        if (!modal) return;
        
        // Populate certificate data
        this.updateElement('certificate-name', this.gameState.player.name);
        this.updateElement('certificate-stars', this.gameState.progress.stars);
        this.updateElement('certificate-date', new Date().toLocaleDateString());
        
        // Get character specialty for skills
        const characterData = this.getCharacterData();
        const skills = characterData ? characterData.specialty : 'Problem Solving';
        this.updateElement('certificate-skills', skills);
        
        // Show modal
        modal.classList.add('active');
        
        // Focus on close button for accessibility
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.focus();
        }
        
        this.announceToScreenReader('Certificate of achievement displayed');
    }

    /**
     * Hide certificate modal
     */
    hideCertificate() {
        const modal = document.getElementById('certificate-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    /**
     * Print certificate
     */
    printCertificate() {
        window.print();
    }

    /**
     * Get current character data
     */
    getCharacterData() {
        if (!this.gameState.player.character || !this.gameData) return null;
        return this.gameData.characters[this.gameState.player.character];
    }

    /**
     * Update progress display
     */
    updateProgressDisplay() {
        if (!this.progressBar.fill) return;
        
        // Update progress bar
        const percentage = this.gameState.progress.completionPercentage;
        this.progressBar.fill.style.width = percentage + '%';
        
        // Update stats
        if (this.progressBar.stars) {
            this.progressBar.stars.textContent = `⭐ ${this.gameState.progress.stars}`;
        }
        
        if (this.progressBar.completion) {
            this.progressBar.completion.textContent = `${percentage}%`;
        }
    }

    /**
     * Update progress based on current state
     */
    updateProgress() {
        // Calculate completion based on current scene position
        if (this.currentStoryPath && this.currentScene) {
            const currentSceneIndex = this.currentStoryPath.scenes.findIndex(s => s.id === this.currentScene.id);
            const totalScenes = this.currentStoryPath.scenes.length;
            const pathProgress = Math.round((currentSceneIndex / totalScenes) * 100);
            
            // For single path, use path progress
            // For multiple paths, factor in completed paths
            const totalPaths = Object.keys(this.gameData.storyPaths).length;
            const completedPaths = this.gameState.progress.pathsCompleted.length;
            const overallProgress = Math.round(
                ((completedPaths * 100) + (pathProgress / totalPaths)) / totalPaths
            );
            
            this.gameState.progress.completionPercentage = Math.min(overallProgress, 100);
        }
        
        this.updateProgressDisplay();
    }

    /**
     * Toggle sound on/off
     */
    toggleSound() {
        this.gameState.settings.soundEnabled = !this.gameState.settings.soundEnabled;
        
        const muteBtn = document.getElementById('mute-btn');
        const audioIcon = muteBtn?.querySelector('.audio-icon');
        
        if (audioIcon) {
            audioIcon.textContent = this.gameState.settings.soundEnabled ? '🔊' : '🔇';
        }
        
        this.announceToScreenReader(
            this.gameState.settings.soundEnabled ? 'Sound enabled' : 'Sound disabled'
        );
        
        this.saveGame();
    }

    /**
     * Show screen and hide others
     */
    showScreen(screenName) {
        // Hide all screens
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        const targetScreen = this.screens[screenName];
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.gameState.currentScreen = screenName;
            
            // Handle screen-specific setup
            this.handleScreenChange(screenName);
        } else {
            console.error('Screen not found:', screenName);
        }
    }

    /**
     * Handle screen change events
     */
    handleScreenChange(screenName) {
        switch (screenName) {
            case 'story':
            case 'puzzle':
                // Show progress bar for game screens
                if (this.progressBar.container) {
                    this.progressBar.container.classList.add('visible');
                }
                break;
            case 'welcome':
            case 'characterCreation':
                // Hide progress bar for setup screens
                if (this.progressBar.container) {
                    this.progressBar.container.classList.remove('visible');
                }
                break;
        }
    }

    /**
     * Update element text content safely
     */
    updateElement(elementId, content) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = content;
        }
    }

    /**
     * Show error message to user
     */
    showError(message) {
        console.error('Game Error:', message);
        this.showNotification(message, 'error');
    }

    /**
     * Show notification to user
     */
    showNotification(message, type = 'info', duration = 3000) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `game-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        // Add styles if not exist
        this.ensureNotificationStyles();
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto-remove
        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }

    /**
     * Get notification icon for type
     */
    getNotificationIcon(type) {
        const icons = {
            'success': '✅',
            'error': '❌',
            'warning': '⚠️',
            'info': 'ℹ️'
        };
        return icons[type] || icons.info;
    }

    /**
     * Ensure notification styles exist
     */
    ensureNotificationStyles() {
        if (document.getElementById('game-notification-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'game-notification-styles';
        styles.textContent = `
            .game-notification {
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 9999;
                background: var(--white);
                border-radius: var(--border-radius);
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                padding: var(--spacing-md);
                transform: translateX(400px);
                transition: all 0.3s ease;
                border-left: 4px solid var(--secondary-blue);
                max-width: 300px;
            }
            
            .game-notification.success {
                border-left-color: var(--secondary-green);
            }
            
            .game-notification.error {
                border-left-color: #DC2626;
            }
            
            .game-notification.warning {
                border-left-color: var(--secondary-yellow);
            }
            
            .game-notification.show {
                transform: translateX(0);
            }
            
            .game-notification.hide {
                transform: translateX(400px);
                opacity: 0;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
            }
            
            .notification-icon {
                font-size: 1.2rem;
            }
            
            .notification-message {
                color: var(--dark-gray);
                font-weight: 500;
            }
        `;
        
        document.head.appendChild(styles);
    }

    /**
     * Play sound effect
     */
    playSound(soundName, options = {}) {
        if (this.soundSystem) {
            this.soundSystem.playEffect(soundName, options);
        }
    }

    /**
     * Trigger celebration effects
     */
    createCelebration(element, options = {}) {
        if (this.animationSystem) {
            this.animationSystem.createSuccessCelebration(element);
        }
        
        if (this.soundSystem) {
            this.soundSystem.playEffect('success');
        }
    }

    /**
     * Create floating elements effect
     */
    createFloatingElements(emojis, count, options = {}) {
        if (this.animationSystem) {
            this.animationSystem.createFloatingElements(emojis, count, options);
        }
    }

    /**
     * Announce message to screen readers
     */
    announceToScreenReader(message) {
        if (this.screenReader) {
            this.screenReader.textContent = message;
        }
    }

    /**
     * Save game state to localStorage
     */
    saveGame() {
        if (!this.gameState.settings.autoSave) return;
        
        try {
            const saveData = {
                ...this.gameState,
                session: {
                    ...this.gameState.session,
                    lastSaveTime: Date.now(),
                    totalPlayTime: this.calculateTotalPlayTime()
                }
            };
            
            localStorage.setItem('enchantedLibraryGame', JSON.stringify(saveData));
            console.log('💾 Game saved');
            
        } catch (error) {
            console.error('❌ Failed to save game:', error);
        }
    }

    /**
     * Load saved game from localStorage
     */
    loadSavedGame() {
        try {
            const savedData = localStorage.getItem('enchantedLibraryGame');
            if (!savedData) return false;
            
            const gameState = JSON.parse(savedData);
            this.gameState = { ...this.gameState, ...gameState };
            
            console.log('📥 Saved game loaded');
            return true;
            
        } catch (error) {
            console.error('❌ Failed to load saved game:', error);
            return false;
        }
    }

    /**
     * Resume saved game
     */
    resumeGame() {
        if (!this.gameState.gameStarted) {
            this.showError('No game in progress. Starting new game.');
            this.startNewGame();
            return;
        }
        
        // Set up game state
        this.initializeProgress();
        
        // Show progress bar
        if (this.progressBar.container) {
            this.progressBar.container.classList.add('visible');
        }
        
        // Load current path and scene
        if (this.gameState.player.currentPath) {
            this.currentStoryPath = this.gameData.storyPaths[this.gameState.player.currentPath];
        }
        
        if (this.gameState.player.currentScene) {
            this.loadScene(this.gameState.player.currentScene);
        } else {
            // Start from beginning of current path
            this.startStoryPath();
        }
        
        this.announceToScreenReader('Game resumed. Continuing your adventure...');
    }

    /**
     * Calculate total play time
     */
    calculateTotalPlayTime() {
        if (!this.gameState.session.startTime) return this.gameState.session.totalPlayTime;
        
        const currentSession = Date.now() - this.gameState.session.startTime;
        return this.gameState.session.totalPlayTime + currentSession;
    }

    /**
     * Auto-save game periodically
     */
    autoSave() {
        if (this.gameState.gameStarted) {
            this.saveGame();
        }
    }

    /**
     * Handle window focus events
     */
    handleWindowFocus() {
        // Resume any paused timers or animations
        console.log('🎯 Window focused');
    }

    /**
     * Handle window blur events
     */
    handleWindowBlur() {
        // Pause timers, auto-save
        this.saveGame();
        console.log('💤 Window blurred, game saved');
    }

    /**
     * Handle escape key press
     */
    handleEscape() {
        // Close any open modals
        const modal = document.querySelector('.modal.active');
        if (modal) {
            modal.classList.remove('active');
            return;
        }
        
        // Show help or pause menu (simplified for now)
        this.announceToScreenReader('Press H for help, S to save game');
    }

    /**
     * Show help information
     */
    showHelp() {
        const helpText = `
            Enchanted Library Quest - Help:
            - Use mouse or keyboard to navigate
            - Arrow keys to move between choices
            - Enter or Space to select
            - Escape to close dialogs
            - Ctrl+S to save game
            - Ctrl+H for this help
        `;
        
        alert(helpText); // Simple help display
        this.announceToScreenReader('Help information displayed');
    }

    /**
     * Setup auto-save functionality based on configuration
     */
    setupAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
        
        this.autoSaveInterval = setInterval(() => {
            if (this.gameState.gameStarted && this.gameState.currentScreen !== 'loading') {
                this.saveGame();
                
                if (CONFIG.VERBOSE_LOGGING) {
                    console.log('💾 Config-driven auto-save completed');
                }
            }
        }, CONFIG.GAMEPLAY.SAVE_INTERVAL);
        
        console.log(`💾 Auto-save enabled with ${CONFIG.GAMEPLAY.SAVE_INTERVAL / 1000}s interval`);
    }

    /**
     * Check if a feature is enabled based on configuration
     */
    isFeatureEnabled(featureName) {
        return CONFIG.isFeatureEnabled(featureName);
    }

    /**
     * Get configuration value safely
     */
    getConfigValue(path, defaultValue = null) {
        try {
            const keys = path.split('.');
            let current = CONFIG;
            
            for (const key of keys) {
                if (current && typeof current === 'object' && key in current) {
                    current = current[key];
                } else {
                    return defaultValue;
                }
            }
            
            return current;
        } catch (error) {
            console.warn(`⚠️ Failed to get config value: ${path}`, error);
            return defaultValue;
        }
    }

    /**
     * Check subscription limits based on configuration
     */
    canStartNewPath() {
        if (CONFIG.PREMIUM_FEATURES || this.gameState.subscription.tier === 'premium') {
            return { allowed: true, reason: 'premium' };
        }
        
        const today = new Date().toDateString();
        const lastPlayDate = localStorage.getItem('lastPlayDate');
        
        // Reset daily counter if new day
        if (lastPlayDate !== today) {
            this.gameState.subscription.dailyPlaysUsed = 0;
            localStorage.setItem('lastPlayDate', today);
        }
        
        if (this.gameState.subscription.dailyPlaysUsed >= CONFIG.DAILY_PLAY_LIMIT) {
            return {
                allowed: false,
                reason: 'daily_limit',
                message: `You've played ${CONFIG.DAILY_PLAY_LIMIT} adventure${CONFIG.DAILY_PLAY_LIMIT > 1 ? 's' : ''} today! Come back tomorrow for more magical learning!`
            };
        }
        
        return { allowed: true, reason: 'within_limit' };
    }

    /**
     * Log current configuration status (development mode)
     */
    logConfigurationStatus() {
        console.group('🔧 FableBox Game Configuration Status');
        console.log('📝 Version:', CONFIG.VERSION);
        console.log('🌍 Environment:', CONFIG.ENVIRONMENT);
        console.log('🎯 Target Age:', `${CONFIG.TARGET_AGE_RANGE.min}-${CONFIG.TARGET_AGE_RANGE.max} years`);
        console.log('💎 Premium Features:', CONFIG.PREMIUM_FEATURES ? 'Enabled' : 'Disabled');
        console.log('🎮 Daily Play Limit:', CONFIG.DAILY_PLAY_LIMIT === -1 ? 'Unlimited' : CONFIG.DAILY_PLAY_LIMIT);
        
        console.log('🎵 Audio Features:', {
            sounds: CONFIG.FEATURES.SOUNDS_ENABLED,
            music: CONFIG.FEATURES.BACKGROUND_MUSIC,
            voiceNarration: CONFIG.FEATURES.VOICE_NARRATION
        });
        
        console.log('✨ Visual Features:', {
            animations: CONFIG.FEATURES.ADVANCED_ANIMATIONS,
            particles: CONFIG.FEATURES.PARTICLE_EFFECTS
        });
        
        console.log('🌐 Platform Features:', {
            offline: CONFIG.FEATURES.OFFLINE_MODE,
            pwa: CONFIG.FEATURES.PWA_INSTALL,
            analytics: CONFIG.FEATURES.ANALYTICS_TRACKING
        });
        
        console.log('♿ Accessibility:', {
            enabled: CONFIG.FEATURES.ACCESSIBILITY,
            fonts: CONFIG.UI.DYSLEXIA_FONTS.length + ' dyslexia-friendly fonts',
            languages: CONFIG.UI.SUPPORTED_LANGUAGES.length + ' supported languages'
        });
        
        console.groupEnd();
    }

    /**
     * Override error display with child-friendly messages
     */
    showError(message) {
        console.error('🎮 FableBox Game Error:', message);
        
        // Use child-friendly error messages
        const friendlyMessage = this.getFriendlyErrorMessage(message);
        this.showNotification(friendlyMessage, 'error');
        
        // Report to analytics if enabled
        if (CONFIG.FEATURES.ERROR_REPORTING && this.analyticsSystem) {
            this.analyticsSystem.trackEvent('game_error', {
                message: message,
                screen: this.gameState.currentScreen,
                version: CONFIG.VERSION
            });
        }
    }

    /**
     * Convert technical errors to child-friendly messages
     */
    getFriendlyErrorMessage(technicalMessage) {
        const friendlyMessages = {
            'network': '🌐 The magic library is having trouble connecting. Please check your internet!',
            'loading': '📚 The magical books are taking longer to load. Let\'s try again!',
            'save': '💾 We couldn\'t save your progress right now, but don\'t worry - try again in a moment!',
            'audio': '🔊 The magical sounds aren\'t working right now, but you can still play and learn!',
            'config': '🔧 The magical settings need adjustment. Please refresh and try again!',
            'default': '✨ Something magical went wrong, but don\'t worry - we can fix it together!'
        };
        
        // Try to match technical message to friendly category
        for (const [key, message] of Object.entries(friendlyMessages)) {
            if (technicalMessage.toLowerCase().includes(key)) {
                return message;
            }
        }
        
        return friendlyMessages.default;
    }

    /**
     * Clean up game resources
     */
    destroy() {
        // Clean up subsystems
        if (this.sceneManager) {
            this.sceneManager.destroy();
        }
        
        if (this.puzzleSystem) {
            this.puzzleSystem.destroy();
        }
        
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeyboardInput);
        window.removeEventListener('beforeunload', () => this.saveGame());
        
        // Clear auto-save interval
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
        
        // Final save
        this.saveGame();
        
        console.log('🧹 Game cleanup complete');
    }
}

// Make the game class available globally
window.EnchantedLibraryGame = EnchantedLibraryGame;
