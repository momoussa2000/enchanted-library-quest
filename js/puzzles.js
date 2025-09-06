/**
 * THE ENCHANTED LIBRARY QUEST - EDUCATIONAL PUZZLE SYSTEM
 * FableBox Educational Adventure Game
 * 
 * This file contains the educational puzzle system that handles:
 * - Math puzzles (addition, subtraction, patterns, counting)
 * - Language puzzles (rhyming, vocabulary, sentence structure)
 * - Science puzzles (weather, animals, geography)
 * - Adaptive difficulty scaling based on age groups
 * - Visual learning aids and interactive elements
 * - Progress tracking and educational analytics
 * 
 * Educational Philosophy:
 * Puzzles are designed following research-based learning principles:
 * - Scaffolded learning with progressive difficulty
 * - Multiple representation formats (visual, auditory, kinesthetic)
 * - Immediate feedback with explanatory reasoning
 * - Gamification elements that maintain motivation
 * - Error analysis to identify learning gaps
 */

class PuzzleSystem {
    constructor(gameEngine) {
        this.game = gameEngine;
        this.currentPuzzle = null;
        this.puzzleHistory = [];
        
        // Initialize advanced puzzle system components
        this.adaptiveDifficultyManager = new AdaptiveDifficultyManager();
        this.currentAdvancedPuzzle = null;
        this.puzzleGenerators = {
            math: MathPuzzle,
            language: LanguagePuzzle,
            science: SciencePuzzle
        };
        
        // Legacy adaptive difficulty (maintained for compatibility)
        this.adaptiveDifficulty = {
            successStreak: 0,
            failureStreak: 0,
            adjustmentThreshold: 3
        };
        
        // Educational tracking
        this.learningAnalytics = {
            mathSkills: { attempted: 0, correct: 0, timeSpent: 0 },
            languageSkills: { attempted: 0, correct: 0, timeSpent: 0 },
            scienceSkills: { attempted: 0, correct: 0, timeSpent: 0 },
            commonErrors: [],
            learningPatterns: []
        };
        
        // Puzzle interface elements
        this.puzzleElements = {
            container: document.getElementById('puzzle-input-container'),
            visual: document.getElementById('puzzle-visual'),
            feedback: document.getElementById('puzzle-feedback'),
            hint: document.getElementById('puzzle-hint'),
            question: document.getElementById('puzzle-question')
        };
        
        // Visual learning aids configuration
        this.visualConfig = {
            countingObjects: ['🍎', '🐛', '⭐', '🌟', '💎', '🌸', '🐝', '🦋'],
            patternShapes: ['🔵', '🔴', '🟡', '🟢', '🟣', '🟠'],
            animalEmojis: ['🐻', '🦎', '🐙', '🦅', '🐧', '🐪', '🦒', '🐨'],
            weatherEmojis: ['☀️', '🌧️', '❄️', '⛈️', '🌈', '☁️', '🌙', '⭐']
        };
        
        this.startTime = null;
        this.selectedAnswer = null;
        this.multipleAnswers = {};
        
        // Bind methods
        this.handleAnswerSubmission = this.handleAnswerSubmission.bind(this);
        this.validateAnswer = this.validateAnswer.bind(this);
        this.provideFeedback = this.provideFeedback.bind(this);
    }

    /**
     * Initialize puzzle system
     */
    initialize() {
        this.setupPuzzleEventListeners();
        console.log('🧩 Puzzle System initialized');
    }

    /**
     * Set up puzzle-specific event listeners
     */
    setupPuzzleEventListeners() {
        // Submit answer button
        const submitBtn = document.getElementById('submit-answer');
        if (submitBtn) {
            submitBtn.addEventListener('click', this.handleAnswerSubmission);
        }

        // Hint button
        const hintBtn = document.getElementById('puzzle-hint');
        if (hintBtn) {
            hintBtn.addEventListener('click', () => this.showHint());
        }

        // Skip button
        const skipBtn = document.getElementById('skip-puzzle');
        if (skipBtn) {
            skipBtn.addEventListener('click', () => this.skipPuzzle());
        }

        // Keyboard shortcuts for puzzle interaction
        document.addEventListener('keydown', (e) => {
            if (this.game.gameState.currentScreen === 'puzzle') {
                this.handlePuzzleKeyboard(e);
            }
        });
    }

    /**
     * Load and display a puzzle
     */
    async loadPuzzle(puzzleId, scene) {
        try {
            console.log(`🧩 Loading puzzle: ${puzzleId}`);
            
            // Try to get puzzle data from game data first, then from STORY_SCENES
            let puzzleData = this.game.gameData?.puzzles[puzzleId];
            let puzzleContent = null;
            
            if (puzzleData) {
                // Use existing game data structure
                const difficulty = this.game.gameState.player.difficulty;
                puzzleContent = puzzleData.difficulty[difficulty];
            } else {
                // Create puzzle data from STORY_SCENES structure
                const storyScene = window.STORY_SCENES ? window.STORY_SCENES[puzzleId] : null;
                if (storyScene && storyScene.puzzle) {
                    puzzleData = {
                        id: puzzleId,
                        type: this.inferPuzzleType(storyScene.puzzle),
                        subtype: storyScene.puzzle.visual || 'general',
                        title: storyScene.text
                    };
                    puzzleContent = storyScene.puzzle;
                }
            }

            if (!puzzleData || !puzzleContent) {
                throw new Error(`Puzzle not found: ${puzzleId}`);
            }

            // Store current puzzle reference
            this.currentPuzzle = {
                id: puzzleId,
                data: puzzleData,
                content: puzzleContent,
                scene: scene,
                attempts: 0,
                maxAttempts: scene.maxAttempts || 3,
                startTime: Date.now(),
                hintsUsed: 0
            };

            // Update puzzle display
            this.renderPuzzle();
            
            // Track puzzle start
            this.trackPuzzleStart(puzzleData.type);
            
            // Update accessibility
            this.announcePuzzleToScreenReader();

        } catch (error) {
            console.error('❌ Failed to load puzzle:', error);
            this.game.showError(`Failed to load puzzle: ${error.message}`);
        }
    }

    /**
     * Infer puzzle type from puzzle content
     */
    inferPuzzleType(puzzleContent) {
        if (typeof puzzleContent.answer === 'number') {
            return 'math';
        } else if (Array.isArray(puzzleContent.answer)) {
            return 'language';
        } else if (puzzleContent.question.toLowerCase().includes('cloud') || 
                   puzzleContent.question.toLowerCase().includes('penguin') ||
                   puzzleContent.question.toLowerCase().includes('weather')) {
            return 'science';
        } else {
            return 'language';
        }
    }

    /**
     * Render the current puzzle
     */
    renderPuzzle() {
        if (!this.currentPuzzle) return;

        const { data, content } = this.currentPuzzle;

        // Update puzzle info display
        this.updatePuzzleInfo(data);
        
        // Update puzzle question
        this.updatePuzzleQuestion(content.question);
        
        // Create visual learning aids
        this.createVisualAids(content);
        
        // Create input interface based on puzzle type
        this.createPuzzleInterface(content);
        
        // Reset feedback
        this.clearFeedback();
        
        // Focus on first input element
        this.focusFirstInput();
    }

    /**
     * Update puzzle type and difficulty display
     */
    updatePuzzleInfo(puzzleData) {
        const typeElement = document.getElementById('puzzle-type');
        const difficultyElement = document.getElementById('puzzle-difficulty');
        
        if (typeElement) {
            typeElement.textContent = this.formatPuzzleType(puzzleData.subtype);
        }
        
        if (difficultyElement) {
            const difficulty = this.game.gameState.player.difficulty;
            difficultyElement.textContent = this.formatDifficulty(difficulty);
        }
    }

    /**
     * Format puzzle type for display
     */
    formatPuzzleType(subtype) {
        const typeMap = {
            'addition': 'Addition',
            'subtraction': 'Subtraction', 
            'patterns': 'Patterns',
            'rhyming': 'Rhyming',
            'vocabulary': 'Vocabulary',
            'sentences': 'Sentences',
            'weather': 'Weather',
            'animals': 'Animals',
            'geography': 'Geography'
        };
        return typeMap[subtype] || subtype.charAt(0).toUpperCase() + subtype.slice(1);
    }

    /**
     * Format difficulty for display
     */
    formatDifficulty(difficulty) {
        const difficultyMap = {
            'easy': 'Apprentice',
            'medium': 'Scholar', 
            'hard': 'Master'
        };
        return difficultyMap[difficulty] || difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    }

    /**
     * Update puzzle question text
     */
    updatePuzzleQuestion(question) {
        if (this.puzzleElements.question) {
            this.puzzleElements.question.textContent = question;
        }
    }

    /**
     * Create visual learning aids for the puzzle
     */
    createVisualAids(puzzleContent) {
        if (!this.puzzleElements.visual) return;

        // Clear existing visual content
        this.puzzleElements.visual.innerHTML = '';

        // Create visual aids based on puzzle type and content
        if (puzzleContent.visual) {
            switch (puzzleContent.visual) {
                case 'gem_counter':
                    this.createCountingVisual('💎', puzzleContent);
                    break;
                case 'star_counter':
                    this.createCountingVisual('⭐', puzzleContent);
                    break;
                case 'coin_pattern':
                    this.createPatternVisual('🪙', puzzleContent);
                    break;
                case 'rhyming_animals':
                    this.createRhymingVisual(puzzleContent);
                    break;
                case 'seasonal_weather':
                    this.createWeatherVisual(puzzleContent);
                    break;
                case 'animal_homes':
                    this.createHabitatVisual(puzzleContent);
                    break;
                default:
                    this.createGenericVisual(puzzleContent);
            }
        }
    }

    /**
     * Create counting visual for math problems
     */
    createCountingVisual(emoji, puzzleContent) {
        const container = this.puzzleElements.visual;
        
        // Extract numbers from question for visual representation
        const numbers = this.extractNumbersFromQuestion(puzzleContent.question);
        
        if (numbers.length >= 2) {
            // Create visual groups for addition/subtraction
            const group1 = this.createVisualGroup(emoji, numbers[0], 'group-1');
            const group2 = this.createVisualGroup(emoji, numbers[1], 'group-2');
            
            container.appendChild(group1);
            
            // Add operation symbol
            const operation = this.detectOperation(puzzleContent.question);
            const operationElement = document.createElement('div');
            operationElement.className = 'operation-symbol';
            operationElement.textContent = operation;
            container.appendChild(operationElement);
            
            container.appendChild(group2);
            
            // Add equals sign and result placeholder
            const equalsElement = document.createElement('div');
            equalsElement.className = 'operation-symbol';
            equalsElement.textContent = '=';
            container.appendChild(equalsElement);
            
            const resultElement = document.createElement('div');
            resultElement.className = 'result-placeholder';
            resultElement.textContent = '?';
            container.appendChild(resultElement);
        }
    }

    /**
     * Create visual group of objects for counting
     */
    createVisualGroup(emoji, count, className) {
        const group = document.createElement('div');
        group.className = `visual-group ${className}`;
        
        for (let i = 0; i < Math.min(count, 10); i++) {
            const item = document.createElement('span');
            item.className = 'visual-item';
            item.textContent = emoji;
            group.appendChild(item);
        }
        
        if (count > 10) {
            const moreText = document.createElement('div');
            moreText.className = 'count-text';
            moreText.textContent = `${count} total`;
            group.appendChild(moreText);
        }
        
        return group;
    }

    /**
     * Create pattern visual for pattern recognition
     */
    createPatternVisual(baseEmoji, puzzleContent) {
        const container = this.puzzleElements.visual;
        
        // Extract pattern from question
        const patternNumbers = this.extractNumbersFromQuestion(puzzleContent.question);
        
        if (patternNumbers.length > 0) {
            const patternContainer = document.createElement('div');
            patternContainer.className = 'pattern-container';
            
            patternNumbers.forEach((num, index) => {
                const numberBox = document.createElement('div');
                numberBox.className = 'pattern-number';
                numberBox.textContent = num;
                
                // Add visual elements for each number
                const visualCount = Math.min(num, 5);
                for (let i = 0; i < visualCount; i++) {
                    const dot = document.createElement('span');
                    dot.className = 'pattern-dot';
                    dot.textContent = baseEmoji;
                    numberBox.appendChild(dot);
                }
                
                patternContainer.appendChild(numberBox);
                
                // Add arrow between numbers
                if (index < patternNumbers.length - 1) {
                    const arrow = document.createElement('div');
                    arrow.className = 'pattern-arrow';
                    arrow.textContent = '→';
                    patternContainer.appendChild(arrow);
                }
            });
            
            // Add question mark for next number
            const questionBox = document.createElement('div');
            questionBox.className = 'pattern-number question-mark';
            questionBox.textContent = '?';
            patternContainer.appendChild(questionBox);
            
            container.appendChild(patternContainer);
        }
    }

    /**
     * Create rhyming visual for language puzzles
     */
    createRhymingVisual(puzzleContent) {
        const container = this.puzzleElements.visual;
        
        // Create visual word pairs
        const wordsContainer = document.createElement('div');
        wordsContainer.className = 'rhyming-container';
        
        // Add sound wave animation
        const soundWaves = document.createElement('div');
        soundWaves.className = 'sound-waves';
        soundWaves.innerHTML = '🎵 🎶 🎵';
        wordsContainer.appendChild(soundWaves);
        
        container.appendChild(wordsContainer);
    }

    /**
     * Create weather visual for science puzzles
     */
    createWeatherVisual(puzzleContent) {
        const container = this.puzzleElements.visual;
        
        const weatherContainer = document.createElement('div');
        weatherContainer.className = 'weather-container';
        
        // Create seasonal sections
        const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
        const weatherEmojis = {
            'Spring': '🌸🌧️',
            'Summer': '☀️🌻', 
            'Fall': '🍂🌬️',
            'Winter': '❄️⛄'
        };
        
        seasons.forEach(season => {
            const seasonBox = document.createElement('div');
            seasonBox.className = 'season-box';
            seasonBox.innerHTML = `
                <div class="season-name">${season}</div>
                <div class="season-weather">${weatherEmojis[season]}</div>
            `;
            weatherContainer.appendChild(seasonBox);
        });
        
        container.appendChild(weatherContainer);
    }

    /**
     * Create habitat visual for animal puzzles
     */
    createHabitatVisual(puzzleContent) {
        const container = this.puzzleElements.visual;
        
        const habitatContainer = document.createElement('div');
        habitatContainer.className = 'habitat-container';
        
        // Create habitat zones
        const habitats = {
            'Arctic': { emoji: '🐧🏔️', animals: ['🐧', '🐻‍❄️', '🦭'] },
            'Desert': { emoji: '🐪🏜️', animals: ['🐪', '🦎', '🐍'] },
            'Ocean': { emoji: '🐠🌊', animals: ['🐠', '🐙', '🦈'] },
            'Forest': { emoji: '🐻🌲', animals: ['🐻', '🦌', '🐿️'] }
        };
        
        Object.entries(habitats).forEach(([name, data]) => {
            const habitatBox = document.createElement('div');
            habitatBox.className = 'habitat-box';
            habitatBox.innerHTML = `
                <div class="habitat-name">${name}</div>
                <div class="habitat-scene">${data.emoji}</div>
                <div class="habitat-animals">${data.animals.join(' ')}</div>
            `;
            habitatContainer.appendChild(habitatBox);
        });
        
        container.appendChild(habitatContainer);
    }

    /**
     * Create generic visual placeholder
     */
    createGenericVisual(puzzleContent) {
        const container = this.puzzleElements.visual;
        
        const placeholder = document.createElement('div');
        placeholder.className = 'generic-visual';
        placeholder.innerHTML = '🧩✨';
        
        container.appendChild(placeholder);
    }

    /**
     * Create puzzle input interface based on content type
     */
    createPuzzleInterface(puzzleContent) {
        if (!this.puzzleElements.container) return;

        // Clear existing interface
        this.puzzleElements.container.innerHTML = '';
        this.selectedAnswer = null;
        this.multipleAnswers = {};

        // Create interface based on input type
        if (puzzleContent.options) {
            this.createMultipleChoiceInterface(puzzleContent);
        } else if (puzzleContent.inputType === 'number') {
            this.createNumberInputInterface(puzzleContent);
        } else if (puzzleContent.inputType === 'text') {
            this.createTextInputInterface(puzzleContent);
        } else if (puzzleContent.inputType === 'matching') {
            this.createMatchingInterface(puzzleContent);
        } else if (puzzleContent.inputType === 'ordering') {
            this.createOrderingInterface(puzzleContent);
        } else {
            // Default to multiple choice if no specific type
            this.createMultipleChoiceInterface(puzzleContent);
        }
    }

    /**
     * Create multiple choice interface
     */
    createMultipleChoiceInterface(puzzleContent) {
        const container = this.puzzleElements.container;
        
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'multiple-choice-options';
        
        puzzleContent.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'choice-btn';
            button.textContent = option;
            button.type = 'button';
            button.setAttribute('aria-label', `Choice ${index + 1}: ${option}`);
            button.setAttribute('data-option-value', option);
            
            button.addEventListener('click', () => this.selectMultipleChoice(button, option));
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.selectMultipleChoice(button, option);
                }
            });
            
            optionsContainer.appendChild(button);
        });
        
        container.appendChild(optionsContainer);
    }

    /**
     * Create number input interface
     */
    createNumberInputInterface(puzzleContent) {
        const container = this.puzzleElements.container;
        
        const inputContainer = document.createElement('div');
        inputContainer.className = 'number-input-container';
        
        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'puzzle-input number-input';
        input.placeholder = 'Enter your answer';
        input.id = 'puzzle-answer-input';
        input.setAttribute('aria-label', 'Number answer input');
        input.min = '0';
        input.max = '1000';
        
        // Add visual number pad for younger learners
        if (this.game.gameState.player.difficulty === 'easy') {
            this.addVisualNumberPad(inputContainer, input);
        }
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.handleAnswerSubmission();
            }
        });
        
        inputContainer.appendChild(input);
        container.appendChild(inputContainer);
    }

    /**
     * Create text input interface
     */
    createTextInputInterface(puzzleContent) {
        const container = this.puzzleElements.container;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'puzzle-input text-input';
        input.placeholder = 'Type your answer';
        input.id = 'puzzle-answer-input';
        input.setAttribute('aria-label', 'Text answer input');
        input.autocomplete = 'off';
        input.autocapitalize = 'off';
        input.spellcheck = 'false';
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.handleAnswerSubmission();
            }
        });
        
        container.appendChild(input);
    }

    /**
     * Create matching interface for matching puzzles
     */
    createMatchingInterface(puzzleContent) {
        const container = this.puzzleElements.container;
        
        const matchingContainer = document.createElement('div');
        matchingContainer.className = 'matching-container';
        
        // Get items to match
        const items = Object.keys(puzzleContent.answer);
        const definitions = Object.values(puzzleContent.answer);
        
        // Create left column (items)
        const leftColumn = document.createElement('div');
        leftColumn.className = 'matching-column left-column';
        leftColumn.innerHTML = '<h4>Match These:</h4>';
        
        items.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'matching-item';
            itemElement.textContent = item;
            itemElement.draggable = true;
            itemElement.setAttribute('data-item', item);
            itemElement.setAttribute('data-index', index);
            
            itemElement.addEventListener('click', () => this.selectMatchingItem(itemElement));
            this.addDragAndDropHandlers(itemElement);
            
            leftColumn.appendChild(itemElement);
        });
        
        // Create right column (definitions)
        const rightColumn = document.createElement('div');
        rightColumn.className = 'matching-column right-column';
        rightColumn.innerHTML = '<h4>With These:</h4>';
        
        // Shuffle definitions for challenge
        const shuffledDefinitions = [...definitions].sort(() => Math.random() - 0.5);
        
        shuffledDefinitions.forEach((definition, index) => {
            const defElement = document.createElement('div');
            defElement.className = 'matching-definition';
            defElement.textContent = definition;
            defElement.setAttribute('data-definition', definition);
            defElement.setAttribute('data-index', index);
            
            defElement.addEventListener('click', () => this.selectMatchingDefinition(defElement));
            this.addDropZoneHandlers(defElement);
            
            rightColumn.appendChild(defElement);
        });
        
        matchingContainer.appendChild(leftColumn);
        matchingContainer.appendChild(rightColumn);
        container.appendChild(matchingContainer);
        
        // Add instructions
        const instructions = document.createElement('div');
        instructions.className = 'matching-instructions';
        instructions.textContent = 'Click or drag items to match them with their definitions';
        container.appendChild(instructions);
    }

    /**
     * Create word ordering interface
     */
    createOrderingInterface(puzzleContent) {
        const container = this.puzzleElements.container;
        
        const orderingContainer = document.createElement('div');
        orderingContainer.className = 'ordering-container';
        
        // Get words to order
        const correctOrder = puzzleContent.answer;
        const shuffledWords = [...correctOrder].sort(() => Math.random() - 0.5);
        
        // Create word bank
        const wordBank = document.createElement('div');
        wordBank.className = 'word-bank';
        wordBank.innerHTML = '<h4>Word Bank:</h4>';
        
        shuffledWords.forEach((word, index) => {
            const wordElement = document.createElement('div');
            wordElement.className = 'word-tile';
            wordElement.textContent = word;
            wordElement.draggable = true;
            wordElement.setAttribute('data-word', word);
            wordElement.setAttribute('data-index', index);
            
            wordElement.addEventListener('click', () => this.selectWordForOrdering(wordElement));
            this.addDragAndDropHandlers(wordElement);
            
            wordBank.appendChild(wordElement);
        });
        
        // Create sentence construction area
        const sentenceArea = document.createElement('div');
        sentenceArea.className = 'sentence-construction';
        sentenceArea.innerHTML = '<h4>Build Your Sentence:</h4>';
        
        const dropZone = document.createElement('div');
        dropZone.className = 'sentence-drop-zone';
        dropZone.textContent = 'Drop words here to build your sentence';
        this.addDropZoneHandlers(dropZone);
        
        sentenceArea.appendChild(dropZone);
        
        orderingContainer.appendChild(wordBank);
        orderingContainer.appendChild(sentenceArea);
        container.appendChild(orderingContainer);
    }

    /**
     * Add visual number pad for younger learners
     */
    addVisualNumberPad(container, input) {
        const numberPad = document.createElement('div');
        numberPad.className = 'visual-number-pad';
        
        for (let i = 1; i <= 10; i++) {
            const numberBtn = document.createElement('button');
            numberBtn.className = 'number-btn';
            numberBtn.textContent = i;
            numberBtn.type = 'button';
            numberBtn.setAttribute('aria-label', `Number ${i}`);
            
            numberBtn.addEventListener('click', () => {
                input.value = i;
                input.focus();
            });
            
            numberPad.appendChild(numberBtn);
        }
        
        container.appendChild(numberPad);
    }

    /**
     * Handle multiple choice selection
     */
    selectMultipleChoice(button, option) {
        // Remove previous selections
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Mark new selection
        button.classList.add('selected');
        
        // Store selected answer
        this.selectedAnswer = option;
        
        // Visual feedback
        if (this.game.gameState.settings.animationsEnabled) {
            button.style.transform = 'scale(1.05)';
            setTimeout(() => {
                button.style.transform = '';
            }, 200);
        }
        
        this.game.announceToScreenReader(`Selected: ${option}`);
    }

    /**
     * Handle matching item selection
     */
    selectMatchingItem(itemElement) {
        // Visual feedback for selection
        document.querySelectorAll('.matching-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        itemElement.classList.add('selected');
        this.currentMatchingItem = itemElement.getAttribute('data-item');
    }

    /**
     * Handle matching definition selection
     */
    selectMatchingDefinition(defElement) {
        if (!this.currentMatchingItem) {
            this.game.announceToScreenReader('Please select an item first');
            return;
        }
        
        // Store the match
        const definition = defElement.getAttribute('data-definition');
        this.multipleAnswers[this.currentMatchingItem] = definition;
        
        // Visual feedback
        defElement.classList.add('matched');
        defElement.textContent = `${this.currentMatchingItem} → ${definition}`;
        
        // Find and mark the item as matched
        const itemElement = document.querySelector(`[data-item="${this.currentMatchingItem}"]`);
        if (itemElement) {
            itemElement.classList.add('matched');
        }
        
        this.currentMatchingItem = null;
        
        this.game.announceToScreenReader(`Matched ${this.currentMatchingItem} with ${definition}`);
    }

    /**
     * Handle word selection for ordering
     */
    selectWordForOrdering(wordElement) {
        const dropZone = document.querySelector('.sentence-drop-zone');
        if (!dropZone) return;
        
        const word = wordElement.getAttribute('data-word');
        
        // Add word to sentence
        if (dropZone.textContent === 'Drop words here to build your sentence') {
            dropZone.textContent = '';
        }
        
        const wordInSentence = document.createElement('span');
        wordInSentence.className = 'word-in-sentence';
        wordInSentence.textContent = word;
        wordInSentence.setAttribute('data-word', word);
        
        wordInSentence.addEventListener('click', () => {
            // Remove word from sentence
            wordInSentence.remove();
            wordElement.style.display = 'block';
            this.updateOrderedAnswer();
        });
        
        dropZone.appendChild(wordInSentence);
        dropZone.appendChild(document.createTextNode(' '));
        
        // Hide word from bank
        wordElement.style.display = 'none';
        
        this.updateOrderedAnswer();
    }

    /**
     * Update ordered answer from sentence construction
     */
    updateOrderedAnswer() {
        const wordsInSentence = document.querySelectorAll('.word-in-sentence');
        this.selectedAnswer = Array.from(wordsInSentence).map(span => span.getAttribute('data-word'));
    }

    /**
     * Add drag and drop handlers for interactive elements
     */
    addDragAndDropHandlers(element) {
        element.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', element.getAttribute('data-word') || element.getAttribute('data-item'));
            element.classList.add('dragging');
        });
        
        element.addEventListener('dragend', () => {
            element.classList.remove('dragging');
        });
    }

    /**
     * Add drop zone handlers
     */
    addDropZoneHandlers(dropZone) {
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });
        
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-over');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            
            const data = e.dataTransfer.getData('text/plain');
            // Handle drop based on context
            if (dropZone.classList.contains('sentence-drop-zone')) {
                this.handleWordDrop(data, dropZone);
            } else if (dropZone.classList.contains('matching-definition')) {
                this.handleMatchingDrop(data, dropZone);
            }
        });
    }

    /**
     * Handle word drop in sentence construction
     */
    handleWordDrop(word, dropZone) {
        const wordElement = document.querySelector(`[data-word="${word}"]`);
        if (wordElement && wordElement.style.display !== 'none') {
            this.selectWordForOrdering(wordElement);
        }
    }

    /**
     * Handle matching drop
     */
    handleMatchingDrop(item, dropZone) {
        const definition = dropZone.getAttribute('data-definition');
        this.multipleAnswers[item] = definition;
        
        dropZone.classList.add('matched');
        dropZone.textContent = `${item} → ${definition}`;
        
        const itemElement = document.querySelector(`[data-item="${item}"]`);
        if (itemElement) {
            itemElement.classList.add('matched');
        }
    }

    /**
     * Handle answer submission
     */
    handleAnswerSubmission() {
        if (!this.currentPuzzle) {
            console.error('No current puzzle to submit answer for');
            return;
        }

        let userAnswer = this.getUserAnswer();
        
        if (userAnswer === null || userAnswer === undefined || userAnswer === '') {
            this.provideFeedback('Please provide an answer before submitting.', 'error');
            return;
        }

        this.currentPuzzle.attempts++;
        
        // Record attempt for analytics
        this.recordAttempt(userAnswer);
        
        // Validate answer
        const isCorrect = this.validateAnswer(userAnswer, this.currentPuzzle.content.answer);
        
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
        // Multiple choice answer
        if (this.selectedAnswer !== null && this.selectedAnswer !== undefined) {
            return this.selectedAnswer;
        }
        
        // Text/number input answer
        const input = document.getElementById('puzzle-answer-input');
        if (input) {
            return input.type === 'number' ? parseInt(input.value) || 0 : input.value.trim();
        }
        
        // Matching answer
        if (Object.keys(this.multipleAnswers).length > 0) {
            return this.multipleAnswers;
        }
        
        // Ordering answer (array of words)
        if (Array.isArray(this.selectedAnswer)) {
            return this.selectedAnswer;
        }
        
        return null;
    }

    /**
     * Validate user answer against correct answer
     */
    validateAnswer(userAnswer, correctAnswer) {
        // Handle different answer types
        if (Array.isArray(correctAnswer)) {
            // Array comparison for ordering puzzles
            if (!Array.isArray(userAnswer)) return false;
            if (userAnswer.length !== correctAnswer.length) return false;
            
            return userAnswer.every((answer, index) => 
                this.normalizeAnswer(answer) === this.normalizeAnswer(correctAnswer[index])
            );
        } else if (typeof correctAnswer === 'object' && correctAnswer !== null) {
            // Object comparison for matching puzzles
            if (typeof userAnswer !== 'object') return false;
            
            const correctKeys = Object.keys(correctAnswer);
            const userKeys = Object.keys(userAnswer);
            
            if (correctKeys.length !== userKeys.length) return false;
            
            return correctKeys.every(key => 
                this.normalizeAnswer(userAnswer[key]) === this.normalizeAnswer(correctAnswer[key])
            );
        } else {
            // Simple comparison for multiple choice, text, and number answers
            return this.normalizeAnswer(userAnswer) === this.normalizeAnswer(correctAnswer);
        }
    }

    /**
     * Normalize answer for comparison
     */
    normalizeAnswer(answer) {
        if (typeof answer === 'string') {
            return answer.toLowerCase().trim().replace(/[^\w\s]/g, '');
        }
        return answer;
    }

    /**
     * Handle correct answer
     */
    handleCorrectAnswer() {
        console.log('✅ Correct answer!');
        
        const timeSpent = Date.now() - this.currentPuzzle.startTime;
        const starsEarned = this.calculateStarsEarned();
        
        // Update game state
        this.game.gameState.progress.stars += starsEarned;
        this.game.gameState.progress.puzzlesSolved++;
        
        // Update adaptive difficulty
        this.adaptiveDifficulty.successStreak++;
        this.adaptiveDifficulty.failureStreak = 0;
        
        // Record success for analytics
        this.recordSuccess(timeSpent);
        
        // Provide positive feedback
        this.provideFeedback(
            `🎉 Excellent! ${this.currentPuzzle.content.explanation} You earned ${starsEarned} stars!`,
            'success'
        );
        
        // Create celebration effects
        this.createSuccessEffects();
        
        // Continue to next scene
        setTimeout(() => {
            this.proceedToNextScene(this.currentPuzzle.scene.successScene);
        }, 2500);
        
        this.game.announceToScreenReader(
            `Correct! ${this.currentPuzzle.content.explanation}. Earned ${starsEarned} stars.`
        );
    }

    /**
     * Handle incorrect answer
     */
    handleIncorrectAnswer() {
        console.log('❌ Incorrect answer');
        
        const attemptsLeft = this.currentPuzzle.maxAttempts - this.currentPuzzle.attempts;
        
        // Update adaptive difficulty
        this.adaptiveDifficulty.failureStreak++;
        this.adaptiveDifficulty.successStreak = 0;
        
        // Record error for analytics
        this.recordError();
        
        if (attemptsLeft > 0) {
            // Provide encouraging feedback with hints
            let feedback = `Not quite right. You have ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining.`;
            
            // Add contextual hint based on puzzle type
            const contextualHint = this.getContextualHint();
            if (contextualHint) {
                feedback += ` ${contextualHint}`;
            }
            
            this.provideFeedback(feedback, 'error');
            
            // Clear input for retry
            this.clearInputForRetry();
            
        } else {
            // No attempts left, show answer and explanation
            const correctAnswer = this.formatCorrectAnswer(this.currentPuzzle.content.answer);
            this.provideFeedback(
                `The correct answer was: ${correctAnswer}. ${this.currentPuzzle.content.explanation}`,
                'hint'
            );
            
            setTimeout(() => {
                this.proceedToNextScene(this.currentPuzzle.scene.failureScene || this.currentPuzzle.scene.successScene);
            }, 4000);
        }
        
        this.game.announceToScreenReader(
            `Incorrect. ${attemptsLeft > 0 ? `${attemptsLeft} attempts remaining.` : 'Moving to next scene.'}`
        );
    }

    /**
     * Get contextual hint based on puzzle type and previous errors
     */
    getContextualHint() {
        const puzzleType = this.currentPuzzle.data.subtype;
        
        switch (puzzleType) {
            case 'addition':
                return 'Try counting all the objects together.';
            case 'subtraction':
                return 'Start with the first number and take away the second.';
            case 'patterns':
                return 'Look at how much each number increases or decreases.';
            case 'rhyming':
                return 'Listen for words that sound similar at the end.';
            case 'vocabulary':
                return 'Think about what the word means in everyday situations.';
            case 'sentences':
                return 'Start with who or what is doing the action.';
            case 'weather':
                return 'Think about what weather you see in each season.';
            case 'animals':
                return 'Consider where each animal would be most comfortable.';
            case 'geography':
                return 'Think about the key features that make each place unique.';
            default:
                return 'Take your time and think through the problem step by step.';
        }
    }

    /**
     * Format correct answer for display
     */
    formatCorrectAnswer(answer) {
        if (Array.isArray(answer)) {
            return answer.join(', ');
        } else if (typeof answer === 'object') {
            return Object.entries(answer).map(([key, value]) => `${key}: ${value}`).join('; ');
        } else {
            return answer.toString();
        }
    }

    /**
     * Clear input elements for retry
     */
    clearInputForRetry() {
        // Clear text/number inputs
        const input = document.getElementById('puzzle-answer-input');
        if (input) {
            input.value = '';
            input.focus();
        }
        
        // Clear multiple choice selections
        this.selectedAnswer = null;
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Clear matching selections
        this.multipleAnswers = {};
        this.currentMatchingItem = null;
        
        // Clear ordering selections
        const dropZone = document.querySelector('.sentence-drop-zone');
        if (dropZone) {
            dropZone.innerHTML = 'Drop words here to build your sentence';
            document.querySelectorAll('.word-tile').forEach(tile => {
                tile.style.display = 'block';
            });
        }
    }

    /**
     * Calculate stars earned based on performance
     */
    calculateStarsEarned() {
        const baseStars = 2;
        const attempts = this.currentPuzzle.attempts;
        const hintsUsed = this.currentPuzzle.hintsUsed;
        const timeSpent = Date.now() - this.currentPuzzle.startTime;
        
        let stars = baseStars;
        
        // Perfect attempt bonus
        if (attempts === 1 && hintsUsed === 0) {
            stars += 1;
        }
        
        // Speed bonus for quick correct answers (under 30 seconds)
        if (timeSpent < 30000 && attempts === 1) {
            stars += 1;
        }
        
        // Difficulty modifier
        const difficultyMultiplier = {
            'easy': 1.0,
            'medium': 1.2,
            'hard': 1.5
        };
        
        const difficulty = this.game.gameState.player.difficulty;
        stars = Math.round(stars * difficultyMultiplier[difficulty]);
        
        // Minimum 1 star for any correct answer
        return Math.max(1, stars);
    }

    /**
     * Show hint for current puzzle
     */
    showHint() {
        if (!this.currentPuzzle) return;
        
        const hint = this.currentPuzzle.content.hint;
        if (hint) {
            this.currentPuzzle.hintsUsed++;
            this.provideFeedback(`💡 Hint: ${hint}`, 'hint');
            this.game.announceToScreenReader(`Hint: ${hint}`);
        } else {
            this.provideFeedback('No hint available for this puzzle.', 'hint');
        }
    }

    /**
     * Skip current puzzle
     */
    skipPuzzle() {
        const skipPenalty = this.game.gameData.difficultyLevels[this.game.gameState.player.difficulty].modifiers.skipPenalty;
        
        if (skipPenalty > 0) {
            this.game.gameState.progress.stars = Math.max(0, this.game.gameState.progress.stars - skipPenalty);
            this.provideFeedback(`Puzzle skipped. Lost ${skipPenalty} star${skipPenalty !== 1 ? 's' : ''}.`, 'error');
        } else {
            this.provideFeedback('Puzzle skipped. No penalty for beginners!', 'hint');
        }
        
        // Record skip for analytics
        this.recordSkip();
        
        setTimeout(() => {
            this.proceedToNextScene(this.currentPuzzle.scene.successScene);
        }, 1500);
        
        this.game.announceToScreenReader(
            `Puzzle skipped. ${skipPenalty > 0 ? `Lost ${skipPenalty} stars.` : 'No penalty.'}`
        );
    }

    /**
     * Provide feedback to user
     */
    provideFeedback(message, type) {
        if (!this.puzzleElements.feedback) return;
        
        this.puzzleElements.feedback.textContent = message;
        this.puzzleElements.feedback.className = `puzzle-feedback ${type}`;
        
        // Auto-clear feedback after delay
        setTimeout(() => {
            this.clearFeedback();
        }, type === 'success' ? 3000 : 8000);
    }

    /**
     * Clear feedback display
     */
    clearFeedback() {
        if (this.puzzleElements.feedback) {
            this.puzzleElements.feedback.textContent = '';
            this.puzzleElements.feedback.className = 'puzzle-feedback';
        }
    }

    /**
     * Create success effects
     */
    createSuccessEffects() {
        if (!this.game.gameState.settings.animationsEnabled) return;
        
        // Create celebration particles
        const celebrationEmojis = ['🎉', '⭐', '✨', '🌟', '💫'];
        
        for (let i = 0; i < 12; i++) {
            setTimeout(() => {
                const emoji = celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)];
                this.game.createParticle(emoji, {
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight
                });
            }, i * 100);
        }
        
        // Flash success color
        const puzzleScreen = document.getElementById('puzzle-screen');
        if (puzzleScreen) {
            puzzleScreen.style.boxShadow = '0 0 20px rgba(52, 211, 153, 0.5)';
            setTimeout(() => {
                puzzleScreen.style.boxShadow = '';
            }, 1000);
        }
    }

    /**
     * Create an advanced puzzle using the new puzzle system
     */
    createAdvancedPuzzle(type, ageGroup, difficulty = null) {
        // Determine player's age group if not provided
        if (!ageGroup) {
            const playerAge = this.game.gameState.player.age || 7;
            if (playerAge <= 6) ageGroup = 'ages4-6';
            else if (playerAge <= 9) ageGroup = 'ages7-9';
            else ageGroup = 'ages10-12';
        }
        
        // Use adaptive difficulty if not specified
        if (!difficulty) {
            difficulty = this.adaptiveDifficultyManager.getRecommendedDifficulty();
        }
        
        const PuzzleClass = this.puzzleGenerators[type];
        if (!PuzzleClass) {
            console.error(`Unknown puzzle type: ${type}`);
            return null;
        }
        
        try {
            const puzzle = PuzzleClass.createAgePuzzle(ageGroup, difficulty);
            console.log(`🎯 Created ${type} puzzle for ${ageGroup} at ${difficulty} difficulty`);
            return puzzle;
        } catch (error) {
            console.error(`Error creating ${type} puzzle:`, error);
            return null;
        }
    }

    /**
     * Load an advanced puzzle for a specific story scene
     */
    loadAdvancedPuzzleForScene(sceneId) {
        // Get the story scene to determine puzzle type
        const storyScene = window.STORY_SCENES ? window.STORY_SCENES[sceneId] : null;
        if (!storyScene || !storyScene.puzzle) {
            console.log('No advanced puzzle defined for scene:', sceneId);
            return false;
        }
        
        // Determine puzzle type from scene puzzle data
        let puzzleType = 'math'; // default
        if (sceneId.includes('wizard') || storyScene.puzzle.question.toLowerCase().includes('word') || 
            storyScene.puzzle.question.toLowerCase().includes('sentence')) {
            puzzleType = 'language';
        } else if (sceneId.includes('explorer') || storyScene.puzzle.question.toLowerCase().includes('cloud') ||
                   storyScene.puzzle.question.toLowerCase().includes('penguin')) {
            puzzleType = 'science';
        }
        
        // Create and load the advanced puzzle
        const difficulty = this.adaptiveDifficultyManager.getRecommendedDifficulty();
        const ageGroup = this.getPlayerAgeGroup();
        
        const puzzle = this.createAdvancedPuzzle(puzzleType, ageGroup, difficulty);
        if (!puzzle) {
            return false;
        }
        
        // Override with story scene specific data if available
        if (storyScene.puzzle.question) puzzle.question = storyScene.puzzle.question;
        if (storyScene.puzzle.answer !== undefined) puzzle.correctAnswer = storyScene.puzzle.answer;
        if (storyScene.puzzle.options) puzzle.options = storyScene.puzzle.options;
        if (storyScene.puzzle.hint) {
            puzzle.hints = Array.isArray(storyScene.puzzle.hint) ? storyScene.puzzle.hint : [storyScene.puzzle.hint];
        }
        
        this.currentAdvancedPuzzle = puzzle;
        puzzle.start();
        
        return true;
    }

    /**
     * Get player age group for puzzle difficulty
     */
    getPlayerAgeGroup() {
        const playerAge = this.game.gameState.player.age || 7;
        if (playerAge <= 6) return 'ages4-6';
        else if (playerAge <= 9) return 'ages7-9';
        else return 'ages10-12';
    }

    /**
     * Show feedback for advanced puzzles with enhanced animations
     */
    showAdvancedFeedback(message, type = 'info') {
        const feedbackContainer = document.querySelector('.puzzle-feedback') || this.puzzleElements.feedback;
        if (!feedbackContainer) return;
        
        const iconMap = {
            success: '🎉',
            error: '🤔', 
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        feedbackContainer.innerHTML = `
            <div class="feedback-display ${type}">
                <div class="feedback-icon">${iconMap[type]}</div>
                <div class="feedback-message">${message}</div>
            </div>
        `;
        feedbackContainer.className = `puzzle-feedback ${type}-feedback`;
        
        // Add animation and effects
        feedbackContainer.style.animation = 'feedbackSlideIn 0.3s ease-out';
        
        if (type === 'success') {
            // Add celebration effects
            this.game.createFloatingElements('⭐🌟✨', 5, {
                startColor: '#FCD34D',
                endColor: '#F59E0B',
                duration: 2000
            });
        }
    }

    /**
     * Proceed to next scene
     */
    proceedToNextScene(nextSceneId) {
        if (nextSceneId === 'path_complete') {
            this.game.completeStoryPath();
        } else if (nextSceneId) {
            // Use scene manager to load the next scene
            if (this.game.sceneManager) {
                this.game.sceneManager.loadScene(nextSceneId);
            } else {
                this.game.loadScene(nextSceneId);
            }
        } else {
            console.error('No next scene specified');
            this.game.showError('Story progression error. Please restart the game.');
        }
    }

    /**
     * Focus on first input element
     */
    focusFirstInput() {
        setTimeout(() => {
            const firstInput = this.puzzleElements.container.querySelector('input, button.choice-btn');
            if (firstInput) {
                firstInput.focus();
            }
        }, 100);
    }

    /**
     * Handle puzzle keyboard navigation
     */
    handlePuzzleKeyboard(event) {
        const { key } = event;
        
        if (key === 'Enter') {
            // Submit answer if not focused on input
            if (document.activeElement.tagName !== 'INPUT') {
                event.preventDefault();
                this.handleAnswerSubmission();
            }
        } else if (key === 'h' && event.ctrlKey) {
            // Show hint
            event.preventDefault();
            this.showHint();
        } else if (key === 'ArrowUp' || key === 'ArrowDown') {
            // Navigate between multiple choice options
            this.navigatePuzzleChoices(key === 'ArrowDown');
        }
    }

    /**
     * Navigate between puzzle choices with keyboard
     */
    navigatePuzzleChoices(down) {
        const choices = document.querySelectorAll('.choice-btn');
        if (choices.length === 0) return;
        
        const currentIndex = Array.from(choices).findIndex(choice => choice === document.activeElement);
        let nextIndex;
        
        if (currentIndex === -1) {
            nextIndex = 0;
        } else if (down) {
            nextIndex = (currentIndex + 1) % choices.length;
        } else {
            nextIndex = (currentIndex - 1 + choices.length) % choices.length;
        }
        
        choices[nextIndex].focus();
    }

    /**
     * Announce puzzle to screen reader
     */
    announcePuzzleToScreenReader() {
        if (!this.currentPuzzle) return;
        
        const { data, content } = this.currentPuzzle;
        
        let announcement = `${data.title} puzzle. ${this.formatPuzzleType(data.subtype)} challenge. `;
        announcement += `${content.question}`;
        
        if (content.options) {
            announcement += ` ${content.options.length} choices available.`;
        } else {
            announcement += ' Enter your answer.';
        }
        
        this.game.announceToScreenReader(announcement);
    }

    /**
     * Extract numbers from question text for visual aids
     */
    extractNumbersFromQuestion(question) {
        const numbers = question.match(/\d+/g);
        return numbers ? numbers.map(Number) : [];
    }

    /**
     * Detect mathematical operation from question
     */
    detectOperation(question) {
        if (question.includes('found') || question.includes('and') || question.includes('total')) {
            return '+';
        } else if (question.includes('gave') || question.includes('left') || question.includes('remaining')) {
            return '−';
        }
        return '+'; // default to addition
    }

    /**
     * Track puzzle start for analytics
     */
    trackPuzzleStart(puzzleType) {
        const category = puzzleType;
        if (this.learningAnalytics[category + 'Skills']) {
            this.learningAnalytics[category + 'Skills'].attempted++;
        }
    }

    /**
     * Record attempt for analytics
     */
    recordAttempt(userAnswer) {
        // Record common error patterns for adaptive learning
        if (this.currentPuzzle.attempts > 1) {
            this.learningAnalytics.commonErrors.push({
                puzzleId: this.currentPuzzle.id,
                userAnswer: userAnswer,
                correctAnswer: this.currentPuzzle.content.answer,
                timestamp: Date.now()
            });
        }
    }

    /**
     * Record success for analytics
     */
    recordSuccess(timeSpent) {
        const category = this.currentPuzzle.data.type;
        if (this.learningAnalytics[category + 'Skills']) {
            this.learningAnalytics[category + 'Skills'].correct++;
            this.learningAnalytics[category + 'Skills'].timeSpent += timeSpent;
        }
        
        // Record learning pattern
        this.learningAnalytics.learningPatterns.push({
            puzzleId: this.currentPuzzle.id,
            attempts: this.currentPuzzle.attempts,
            hintsUsed: this.currentPuzzle.hintsUsed,
            timeSpent: timeSpent,
            success: true,
            timestamp: Date.now()
        });
    }

    /**
     * Record error for analytics
     */
    recordError() {
        // This helps identify learning gaps and difficult concepts
        console.log('Recording learning analytics for error');
    }

    /**
     * Record skip for analytics
     */
    recordSkip() {
        this.learningAnalytics.learningPatterns.push({
            puzzleId: this.currentPuzzle.id,
            attempts: this.currentPuzzle.attempts,
            skipped: true,
            timestamp: Date.now()
        });
    }

    /**
     * Get learning analytics summary
     */
    getLearningAnalytics() {
        return {
            ...this.learningAnalytics,
            adaptiveDifficulty: this.adaptiveDifficulty
        };
    }

    /**
     * Clean up puzzle system resources
     */
    destroy() {
        this.currentPuzzle = null;
        this.selectedAnswer = null;
        this.multipleAnswers = {};
        
        console.log('🧹 Puzzle System cleanup complete');
    }
}

// Make PuzzleSystem available globally
window.PuzzleSystem = PuzzleSystem;
