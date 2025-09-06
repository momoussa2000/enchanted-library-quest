/**
 * THE ENCHANTED LIBRARY QUEST - ADVANCED PUZZLE SYSTEM
 * FableBox Educational Adventure Game
 * 
 * This file contains a comprehensive educational puzzle system with:
 * - Age-appropriate math, language, and science puzzles
 * - Adaptive difficulty based on performance
 * - Graduated hint system
 * - Encouraging feedback mechanisms
 * - Visual learning aids and interactive elements
 * 
 * Educational Design Philosophy:
 * The puzzle system is designed around constructivist learning theory,
 * providing scaffolded support, multiple representations, and positive
 * reinforcement to build confidence and understanding.
 */

/**
 * Base Puzzle Class
 * Provides common functionality for all puzzle types
 */
class BasePuzzle {
    constructor(config) {
        this.id = config.id;
        this.type = config.type;
        this.subtype = config.subtype;
        this.ageGroup = config.ageGroup || 'mixed';
        this.difficulty = config.difficulty || 'medium';
        this.title = config.title;
        this.question = config.question;
        this.correctAnswer = config.correctAnswer;
        this.options = config.options || [];
        this.hints = config.hints || [];
        this.feedback = config.feedback || {};
        this.visualAids = config.visualAids || {};
        this.metadata = config.metadata || {};
        
        // Performance tracking
        this.attempts = 0;
        this.maxAttempts = config.maxAttempts || 3;
        this.hintsUsed = 0;
        this.startTime = null;
        this.endTime = null;
        this.isCompleted = false;
        this.isCorrect = false;
        this.userAnswer = null;
    }

    /**
     * Start the puzzle and begin timing
     */
    start() {
        this.startTime = Date.now();
        this.attempts = 0;
        this.hintsUsed = 0;
        this.isCompleted = false;
        this.isCorrect = false;
        console.log(`🧩 Starting puzzle: ${this.title}`);
    }

    /**
     * Submit an answer and check correctness
     */
    submitAnswer(answer) {
        this.attempts++;
        this.userAnswer = answer;
        this.isCorrect = this.checkAnswer(answer);
        
        if (this.isCorrect || this.attempts >= this.maxAttempts) {
            this.complete();
        }
        
        return {
            isCorrect: this.isCorrect,
            feedback: this.getFeedback(),
            canRetry: this.attempts < this.maxAttempts && !this.isCorrect,
            hintsAvailable: this.hintsUsed < this.hints.length
        };
    }

    /**
     * Check if the provided answer is correct
     */
    checkAnswer(answer) {
        if (Array.isArray(this.correctAnswer)) {
            return JSON.stringify(answer) === JSON.stringify(this.correctAnswer);
        }
        return answer === this.correctAnswer;
    }

    /**
     * Get appropriate feedback based on performance
     */
    getFeedback() {
        if (this.isCorrect) {
            return this.getPositiveFeedback();
        } else {
            return this.getEncouragingFeedback();
        }
    }

    /**
     * Get positive feedback for correct answers
     */
    getPositiveFeedback() {
        const positive = this.feedback.positive || [
            "Excellent work! You've got it! ⭐",
            "Perfect! Your thinking is spot on! 🎉", 
            "Amazing! You solved it beautifully! ✨",
            "Outstanding! You're a natural problem solver! 🌟",
            "Wonderful! That's exactly right! 🎊"
        ];
        
        const baseMessage = positive[Math.floor(Math.random() * positive.length)];
        
        // Add performance-based bonus messages
        if (this.attempts === 1) {
            return baseMessage + " And you got it on your first try! Incredible! 🚀";
        } else if (this.hintsUsed === 0) {
            return baseMessage + " You figured it out all by yourself! 💪";
        } else {
            return baseMessage + " Great persistence and problem-solving! 🔍";
        }
    }

    /**
     * Get encouraging feedback for incorrect answers
     */
    getEncouragingFeedback() {
        const encouraging = this.feedback.encouraging || [
            "Good thinking! Let's try a different approach. 🤔",
            "You're on the right track! Keep exploring the problem. 🌱",
            "Great effort! Every attempt teaches us something new. 📚",
            "Nice try! Learning happens when we keep trying. 💡",
            "You're thinking hard about this! Let's look at it another way. 🔄"
        ];
        
        let message = encouraging[Math.floor(Math.random() * encouraging.length)];
        
        // Add attempt-specific guidance
        if (this.attempts >= this.maxAttempts) {
            message += " The answer was " + this.getCorrectAnswerDisplay() + ". You'll get it next time! 🌈";
        } else if (this.hintsUsed < this.hints.length) {
            message += " Would you like a hint to help you? 💭";
        }
        
        return message;
    }

    /**
     * Get the next available hint
     */
    getNextHint() {
        if (this.hintsUsed < this.hints.length) {
            const hint = this.hints[this.hintsUsed];
            this.hintsUsed++;
            return {
                hint: hint,
                level: this.hintsUsed,
                total: this.hints.length
            };
        }
        return null;
    }

    /**
     * Complete the puzzle
     */
    complete() {
        this.endTime = Date.now();
        this.isCompleted = true;
        
        // Calculate performance metrics
        const timeSpent = (this.endTime - this.startTime) / 1000;
        const efficiency = this.isCorrect ? (1 / this.attempts) * (1 - (this.hintsUsed * 0.1)) : 0;
        
        return {
            timeSpent: timeSpent,
            attempts: this.attempts,
            hintsUsed: this.hintsUsed,
            efficiency: efficiency,
            isCorrect: this.isCorrect
        };
    }

    /**
     * Get display version of correct answer
     */
    getCorrectAnswerDisplay() {
        if (Array.isArray(this.correctAnswer)) {
            return this.correctAnswer.join(', ');
        }
        return this.correctAnswer.toString();
    }

    /**
     * Generate HTML for puzzle display
     */
    generateHTML() {
        return `
            <div class="puzzle-container" data-puzzle-id="${this.id}">
                <div class="puzzle-header">
                    <h3 class="puzzle-title">${this.title}</h3>
                    <div class="puzzle-meta">
                        <span class="puzzle-type">${this.type}</span>
                        <span class="puzzle-difficulty">${this.difficulty}</span>
                    </div>
                </div>
                <div class="puzzle-content">
                    <div class="puzzle-question">${this.question}</div>
                    ${this.generateVisualAids()}
                    ${this.generateAnswerInterface()}
                </div>
                <div class="puzzle-controls">
                    ${this.generateHintButton()}
                    ${this.generateSubmitButton()}
                </div>
                <div class="puzzle-feedback"></div>
            </div>
        `;
    }

    /**
     * Generate visual aids for the puzzle
     */
    generateVisualAids() {
        return '<div class="visual-aids"></div>';
    }

    /**
     * Generate answer interface (to be overridden by subclasses)
     */
    generateAnswerInterface() {
        return '<div class="answer-interface">Override in subclass</div>';
    }

    /**
     * Generate hint button
     */
    generateHintButton() {
        return `
            <button class="hint-btn ui-element" ${this.hintsUsed >= this.hints.length ? 'disabled' : ''}>
                <svg viewBox="0 0 100 100" class="hint-icon">
                    <use href="assets/images/ui-elements.svg#hint-lightbulb"/>
                </svg>
                Hint (${this.hintsUsed}/${this.hints.length})
            </button>
        `;
    }

    /**
     * Generate submit button
     */
    generateSubmitButton() {
        return `
            <button class="submit-btn primary-btn">
                Check Answer
            </button>
        `;
    }
}

/**
 * Math Puzzle Class
 * Handles mathematical problems with age-appropriate difficulty
 */
class MathPuzzle extends BasePuzzle {
    constructor(config) {
        super(config);
        this.operation = config.operation || 'addition';
        this.numbers = config.numbers || [];
        this.showWork = config.showWork || false;
        this.useVisualObjects = config.useVisualObjects || false;
        this.objectType = config.objectType || 'stars';
    }

    /**
     * Generate visual counting objects for younger children
     */
    generateVisualObjects(count, type = 'stars') {
        const objects = {
            stars: '⭐',
            apples: '🍎',
            hearts: '💕',
            gems: '💎',
            coins: '🪙',
            flowers: '🌸'
        };
        
        const emoji = objects[type] || objects.stars;
        let html = '<div class="visual-objects">';
        
        for (let i = 0; i < count; i++) {
            html += `<span class="visual-object" style="animation-delay: ${i * 0.1}s">${emoji}</span>`;
        }
        
        html += '</div>';
        return html;
    }

    /**
     * Generate visual aids for math problems
     */
    generateVisualAids() {
        if (!this.useVisualObjects) return '';
        
        let html = '<div class="math-visual-aids">';
        
        if (this.operation === 'addition' || this.operation === 'counting') {
            // Show groups of objects for addition/counting
            this.numbers.forEach((num, index) => {
                html += `
                    <div class="number-group">
                        <div class="group-label">Group ${index + 1}: ${num}</div>
                        ${this.generateVisualObjects(num, this.objectType)}
                    </div>
                `;
            });
        } else if (this.operation === 'subtraction') {
            // Show objects being removed
            const total = this.numbers[0];
            const remove = this.numbers[1];
            
            html += `
                <div class="subtraction-visual">
                    <div class="group-label">Start with: ${total}</div>
                    ${this.generateVisualObjects(total, this.objectType)}
                    <div class="removal-indicator">Remove ${remove}:</div>
                </div>
            `;
        } else if (this.operation === 'division') {
            // Show equal groups
            const total = this.numbers[0];
            const groups = this.numbers[1];
            const perGroup = Math.floor(total / groups);
            
            for (let i = 0; i < groups; i++) {
                html += `
                    <div class="division-group">
                        <div class="group-label">Group ${i + 1}</div>
                        ${this.generateVisualObjects(perGroup, this.objectType)}
                    </div>
                `;
            }
        }
        
        html += '</div>';
        return html;
    }

    /**
     * Generate answer interface for math problems
     */
    generateAnswerInterface() {
        if (this.options && this.options.length > 0) {
            // Multiple choice
            return `
                <div class="answer-interface multiple-choice">
                    ${this.options.map((option, index) => `
                        <button class="choice-option math-choice" data-value="${option}">
                            ${option}
                        </button>
                    `).join('')}
                </div>
            `;
        } else {
            // Number input
            return `
                <div class="answer-interface number-input">
                    <input type="number" 
                           class="math-input" 
                           placeholder="Enter your answer"
                           min="0" 
                           max="1000"
                           aria-label="Math answer input">
                </div>
            `;
        }
    }

    /**
     * Create age-appropriate math puzzles
     */
    static createAgePuzzle(ageGroup, difficulty = 'medium') {
        const puzzles = {
            'ages4-6': [
                {
                    operation: 'counting',
                    title: 'Count the Magic Stars',
                    question: 'How many stars do you see?',
                    numbers: [Math.floor(Math.random() * 5) + 1],
                    useVisualObjects: true,
                    objectType: 'stars',
                    maxAttempts: 3,
                    hints: [
                        'Try pointing to each star and counting: 1, 2, 3...',
                        'Count slowly and carefully. Each star counts as 1.',
                        'Look at all the stars and count them one by one.'
                    ]
                },
                {
                    operation: 'addition',
                    title: 'Ruby\'s Treasure Count',
                    question: 'Ruby found 2 gold coins, then found 3 more. How many coins does she have now?',
                    numbers: [2, 3],
                    correctAnswer: 5,
                    useVisualObjects: true,
                    objectType: 'coins',
                    options: [4, 5, 6, 7],
                    hints: [
                        'Start with 2 coins, then add 3 more coins.',
                        'You can count: 2 coins + 3 coins = ? coins',
                        'Put the groups together: 2 + 3 = 5'
                    ]
                }
            ],
            'ages7-9': [
                {
                    operation: 'multiplication',
                    title: 'Wizard\'s Spell Components',
                    question: 'Sage needs 4 ingredients for each spell. If he wants to make 3 spells, how many ingredients does he need?',
                    numbers: [4, 3],
                    correctAnswer: 12,
                    options: [10, 12, 14, 16],
                    hints: [
                        'Think about groups: 4 ingredients per spell, 3 spells total.',
                        'You can add: 4 + 4 + 4 = ? or multiply: 4 × 3 = ?',
                        '4 × 3 means 4 groups of 3, which equals 12.'
                    ]
                },
                {
                    operation: 'division',
                    title: 'Scout\'s Fair Sharing',
                    question: 'Scout has 15 berries to share equally among 3 friends. How many berries does each friend get?',
                    numbers: [15, 3],
                    correctAnswer: 5,
                    useVisualObjects: true,
                    objectType: 'apples',
                    options: [4, 5, 6, 7],
                    hints: [
                        'Think about sharing equally: 15 berries for 3 friends.',
                        'Try dividing: 15 ÷ 3 = ?',
                        'Each friend should get the same amount: 15 ÷ 3 = 5'
                    ]
                }
            ],
            'ages10-12': [
                {
                    operation: 'word-problem',
                    title: 'Library Adventure Problem',
                    question: 'The Enchanted Library has 8 shelves. Each shelf has 12 books. If 1/4 of all the books are magical, how many magical books are there?',
                    correctAnswer: 24,
                    showWork: true,
                    hints: [
                        'First, find the total number of books: 8 shelves × 12 books per shelf.',
                        'Total books = 8 × 12 = 96 books.',
                        'Now find 1/4 of 96: 96 ÷ 4 = 24 magical books.'
                    ]
                }
            ]
        };

        const ageOptions = puzzles[ageGroup] || puzzles['ages7-9'];
        const selected = ageOptions[Math.floor(Math.random() * ageOptions.length)];
        
        return new MathPuzzle({
            id: `math-${Date.now()}`,
            type: 'math',
            subtype: selected.operation,
            ageGroup: ageGroup,
            difficulty: difficulty,
            ...selected
        });
    }
}

/**
 * Language Puzzle Class
 * Handles reading, writing, and language comprehension
 */
class LanguagePuzzle extends BasePuzzle {
    constructor(config) {
        super(config);
        this.languageSkill = config.languageSkill || 'vocabulary';
        this.words = config.words || [];
        this.sentences = config.sentences || [];
        this.storyElements = config.storyElements || [];
    }

    /**
     * Generate answer interface for language problems
     */
    generateAnswerInterface() {
        switch (this.languageSkill) {
            case 'rhyming':
                return this.generateRhymingInterface();
            case 'sentence-building':
                return this.generateSentenceInterface();
            case 'vocabulary':
                return this.generateVocabularyInterface();
            case 'sequencing':
                return this.generateSequencingInterface();
            case 'letter-recognition':
                return this.generateLetterInterface();
            default:
                return super.generateAnswerInterface();
        }
    }

    /**
     * Generate rhyming puzzle interface
     */
    generateRhymingInterface() {
        return `
            <div class="answer-interface rhyming-puzzle">
                <div class="rhyming-prompt">Find the word that rhymes with: <strong>${this.words[0]}</strong></div>
                <div class="rhyming-options">
                    ${this.options.map(option => `
                        <button class="choice-option rhyme-choice" data-value="${option}">
                            <span class="word">${option}</span>
                            <span class="pronunciation">[${this.getPronunciation(option)}]</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Generate sentence building interface
     */
    generateSentenceInterface() {
        return `
            <div class="answer-interface sentence-building">
                <div class="sentence-prompt">Arrange these words to make a sentence:</div>
                <div class="word-bank">
                    ${this.words.map(word => `
                        <div class="word-tile draggable" data-word="${word}">
                            ${word}
                        </div>
                    `).join('')}
                </div>
                <div class="sentence-builder" data-target="sentence">
                    <div class="drop-zone">Drop words here to build your sentence</div>
                </div>
            </div>
        `;
    }

    /**
     * Generate vocabulary matching interface
     */
    generateVocabularyInterface() {
        return `
            <div class="answer-interface vocabulary-puzzle">
                <div class="vocabulary-prompt">Match the word with its meaning:</div>
                <div class="word-display">
                    <span class="target-word">${this.words[0]}</span>
                </div>
                <div class="meaning-options">
                    ${this.options.map(option => `
                        <button class="choice-option vocab-choice" data-value="${option}">
                            ${option}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Generate story sequencing interface
     */
    generateSequencingInterface() {
        return `
            <div class="answer-interface story-sequencing">
                <div class="sequence-prompt">Put these story parts in the right order:</div>
                <div class="story-parts">
                    ${this.storyElements.map((element, index) => `
                        <div class="story-part draggable" data-order="${index}">
                            <div class="part-number"></div>
                            <div class="part-text">${element}</div>
                        </div>
                    `).join('')}
                </div>
                <div class="sequence-builder">
                    <div class="sequence-slots">
                        ${this.storyElements.map((_, index) => `
                            <div class="sequence-slot" data-position="${index + 1}">
                                <span class="slot-number">${index + 1}</span>
                                <div class="slot-content">Drop here</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Generate letter recognition interface
     */
    generateLetterInterface() {
        return `
            <div class="answer-interface letter-recognition">
                <div class="letter-prompt">${this.question}</div>
                <div class="letter-display">
                    <span class="target-letter">${this.words[0]}</span>
                </div>
                <div class="letter-options">
                    ${this.options.map(option => `
                        <button class="choice-option letter-choice" data-value="${option}">
                            <span class="letter-upper">${option.toUpperCase()}</span>
                            <span class="letter-lower">${option.toLowerCase()}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Get pronunciation guide for rhyming
     */
    getPronunciation(word) {
        const pronunciations = {
            'cat': 'kat',
            'hat': 'hat', 
            'bat': 'bat',
            'rat': 'rat',
            'sun': 'sŭn',
            'fun': 'fŭn',
            'run': 'rŭn',
            'book': 'bo͝ok',
            'look': 'lo͝ok',
            'took': 'to͝ok',
            'tree': 'trē',
            'free': 'frē',
            'bee': 'bē'
        };
        
        return pronunciations[word.toLowerCase()] || word;
    }

    /**
     * Create age-appropriate language puzzles
     */
    static createAgePuzzle(ageGroup, difficulty = 'medium') {
        const puzzles = {
            'ages4-6': [
                {
                    languageSkill: 'letter-recognition',
                    title: 'Owl\'s Alphabet Helper',
                    question: 'Which letter makes the "buh" sound?',
                    words: ['B'],
                    options: ['A', 'B', 'C', 'D'],
                    correctAnswer: 'B',
                    hints: [
                        'Listen for the sound: "buh" like in "book".',
                        'The letter B makes the "buh" sound.',
                        'Think of words that start with "buh": ball, book, butterfly.'
                    ]
                },
                {
                    languageSkill: 'rhyming',
                    title: 'Magic Rhyming Words',
                    question: 'Help Sage find the rhyming word!',
                    words: ['cat'],
                    options: ['dog', 'hat', 'bird', 'fish'],
                    correctAnswer: 'hat',
                    hints: [
                        'Words that rhyme sound similar at the end.',
                        'Cat rhymes with words that end in "-at".',
                        'Hat and cat both end with the same sound!'
                    ]
                }
            ],
            'ages7-9': [
                {
                    languageSkill: 'sentence-building',
                    title: 'Magical Sentence Spell',
                    question: 'Help Sage arrange these words into a proper sentence:',
                    words: ['The', 'wizard', 'reads', 'magic', 'books'],
                    correctAnswer: ['The', 'wizard', 'reads', 'magic', 'books'],
                    hints: [
                        'Start with "The" - sentences often begin with "the".',
                        'Think about who is doing what: who reads?',
                        'The wizard reads magic books - who, action, what.'
                    ]
                },
                {
                    languageSkill: 'vocabulary',
                    title: 'Scout\'s Word Discovery',
                    question: 'What does "explore" mean?',
                    words: ['explore'],
                    options: [
                        'to search and discover new places',
                        'to run very fast',
                        'to read a book quietly',
                        'to eat delicious food'
                    ],
                    correctAnswer: 'to search and discover new places',
                    hints: [
                        'Think about what Scout the Explorer does.',
                        'Explore means to go and discover new things.',
                        'When you explore, you search for and find new places!'
                    ]
                }
            ],
            'ages10-12': [
                {
                    languageSkill: 'sequencing',
                    title: 'Story Adventure Sequence',
                    question: 'Put these story events in the correct order:',
                    storyElements: [
                        'The hero enters the enchanted library',
                        'Strange things begin happening with the books',
                        'The hero meets magical companions',
                        'Together they solve puzzles to restore order',
                        'The library returns to normal and everyone celebrates'
                    ],
                    correctAnswer: [0, 1, 2, 3, 4],
                    hints: [
                        'Stories usually start with the main character arriving somewhere.',
                        'Think about cause and effect: what happens first leads to what happens next.',
                        'The sequence is: arrival → problem → meeting helpers → solving → celebration.'
                    ]
                }
            ]
        };

        const ageOptions = puzzles[ageGroup] || puzzles['ages7-9'];
        const selected = ageOptions[Math.floor(Math.random() * ageOptions.length)];
        
        return new LanguagePuzzle({
            id: `language-${Date.now()}`,
            type: 'language',
            subtype: selected.languageSkill,
            ageGroup: ageGroup,
            difficulty: difficulty,
            ...selected
        });
    }
}

/**
 * Science Puzzle Class
 * Handles natural world understanding and scientific concepts
 */
class SciencePuzzle extends BasePuzzle {
    constructor(config) {
        super(config);
        this.scienceArea = config.scienceArea || 'nature';
        this.concepts = config.concepts || [];
        this.experiments = config.experiments || [];
        this.observations = config.observations || [];
    }

    /**
     * Generate visual aids for science concepts
     */
    generateVisualAids() {
        switch (this.scienceArea) {
            case 'habitats':
                return this.generateHabitatVisual();
            case 'weather':
                return this.generateWeatherVisual();
            case 'physics':
                return this.generatePhysicsVisual();
            case 'life-cycles':
                return this.generateLifeCycleVisual();
            case 'geography':
                return this.generateGeographyVisual();
            default:
                return '<div class="science-visual-aids"></div>';
        }
    }

    /**
     * Generate habitat visualization
     */
    generateHabitatVisual() {
        const habitatScenes = {
            'arctic': '🏔️❄️🐧🦭',
            'desert': '🏜️🌵🦎🐪',
            'forest': '🌲🌳🦌🐿️',
            'ocean': '🌊🐟🐙🦈',
            'jungle': '🌴🐒🦜🐆'
        };

        return `
            <div class="habitat-visual">
                <div class="habitat-scenes">
                    ${Object.entries(habitatScenes).map(([habitat, emojis]) => `
                        <div class="habitat-scene" data-habitat="${habitat}">
                            <div class="habitat-name">${habitat.charAt(0).toUpperCase() + habitat.slice(1)}</div>
                            <div class="habitat-emojis">${emojis}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Generate weather visualization
     */
    generateWeatherVisual() {
        return `
            <div class="weather-visual">
                <div class="weather-scene">
                    <div class="sky">
                        <div class="clouds">
                            <div class="cloud light">☁️</div>
                            <div class="cloud dark">⛈️</div>
                            <div class="cloud sunny">⛅</div>
                        </div>
                    </div>
                    <div class="weather-elements">
                        <span class="weather-icon">☀️</span>
                        <span class="weather-icon">🌧️</span>
                        <span class="weather-icon">❄️</span>
                        <span class="weather-icon">🌈</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Generate physics demonstration
     */
    generatePhysicsVisual() {
        return `
            <div class="physics-visual">
                <div class="physics-demo">
                    <div class="balance-scale">
                        <div class="scale-arm"></div>
                        <div class="scale-items">
                            <div class="item heavy">🪨</div>
                            <div class="item light">🪶</div>
                        </div>
                    </div>
                    <div class="float-sink">
                        <div class="water">🌊</div>
                        <div class="objects">
                            <span class="floating">🏀</span>
                            <span class="sinking">🪨</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Generate life cycle visualization
     */
    generateLifeCycleVisual() {
        return `
            <div class="lifecycle-visual">
                <div class="lifecycle-stages">
                    <div class="stage">
                        <div class="stage-icon">🥚</div>
                        <div class="stage-label">Egg</div>
                    </div>
                    <div class="stage">
                        <div class="stage-icon">🐛</div>
                        <div class="stage-label">Caterpillar</div>
                    </div>
                    <div class="stage">
                        <div class="stage-icon">🛡️</div>
                        <div class="stage-label">Chrysalis</div>
                    </div>
                    <div class="stage">
                        <div class="stage-icon">🦋</div>
                        <div class="stage-label">Butterfly</div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Generate geography visualization
     */
    generateGeographyVisual() {
        return `
            <div class="geography-visual">
                <div class="world-map">
                    <div class="continent" data-continent="africa">🌍</div>
                    <div class="continent" data-continent="asia">🌏</div>
                    <div class="continent" data-continent="americas">🌎</div>
                </div>
                <div class="geographic-features">
                    <span class="feature">🏔️ Mountains</span>
                    <span class="feature">🏞️ Rivers</span>
                    <span class="feature">🏝️ Islands</span>
                    <span class="feature">🏜️ Deserts</span>
                </div>
            </div>
        `;
    }

    /**
     * Generate answer interface for science problems
     */
    generateAnswerInterface() {
        if (this.scienceArea === 'physics' && this.subtype === 'drag-drop') {
            return this.generateDragDropInterface();
        } else {
            return `
                <div class="answer-interface science-multiple-choice">
                    ${this.options.map(option => `
                        <button class="choice-option science-choice" data-value="${option}">
                            ${option}
                        </button>
                    `).join('')}
                </div>
            `;
        }
    }

    /**
     * Generate drag and drop interface for physics experiments
     */
    generateDragDropInterface() {
        return `
            <div class="answer-interface drag-drop-physics">
                <div class="physics-scenario">
                    <div class="scenario-description">${this.question}</div>
                    <div class="drop-zones">
                        <div class="drop-zone" data-category="float">
                            <div class="zone-label">Things that Float</div>
                            <div class="zone-content">🌊</div>
                        </div>
                        <div class="drop-zone" data-category="sink">
                            <div class="zone-label">Things that Sink</div>
                            <div class="zone-content">⬇️</div>
                        </div>
                    </div>
                </div>
                <div class="draggable-items">
                    ${this.concepts.map(item => `
                        <div class="draggable-item" data-item="${item.name}" data-property="${item.property}">
                            <span class="item-icon">${item.icon}</span>
                            <span class="item-name">${item.name}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Create age-appropriate science puzzles
     */
    static createAgePuzzle(ageGroup, difficulty = 'medium') {
        const puzzles = {
            'ages4-6': [
                {
                    scienceArea: 'habitats',
                    title: 'Animal Home Detective',
                    question: 'Where do penguins live?',
                    options: [
                        'Hot sandy deserts',
                        'Cold icy places',
                        'Warm tropical forests',
                        'Underground caves'
                    ],
                    correctAnswer: 'Cold icy places',
                    hints: [
                        'Think about what penguins look like. Do they have thick feathers?',
                        'Penguins need to stay warm, so they live in cold places.',
                        'Penguins live in cold, icy places like Antarctica!'
                    ]
                },
                {
                    scienceArea: 'weather',
                    title: 'Cloud Detective',
                    question: 'Which clouds usually bring rain?',
                    options: [
                        'Light white fluffy clouds',
                        'Dark thick clouds',
                        'No clouds at all',
                        'Very thin wispy clouds'
                    ],
                    correctAnswer: 'Dark thick clouds',
                    hints: [
                        'Think about what you see in the sky before it rains.',
                        'Dark clouds are full of water that wants to fall.',
                        'Dark, thick clouds bring rain!'
                    ]
                }
            ],
            'ages7-9': [
                {
                    scienceArea: 'physics',
                    title: 'Float or Sink Experiment',
                    question: 'Which objects will float in water?',
                    subtype: 'drag-drop',
                    concepts: [
                        { name: 'Ball', icon: '🏀', property: 'float' },
                        { name: 'Rock', icon: '🪨', property: 'sink' },
                        { name: 'Feather', icon: '🪶', property: 'float' },
                        { name: 'Coin', icon: '🪙', property: 'sink' }
                    ],
                    correctAnswer: ['Ball', 'Feather'],
                    hints: [
                        'Think about which objects are lighter or have air inside.',
                        'Heavy objects usually sink, light objects usually float.',
                        'Balls have air inside so they float. Rocks and coins are heavy so they sink.'
                    ]
                },
                {
                    scienceArea: 'life-cycles',
                    title: 'Butterfly Life Cycle',
                    question: 'What comes after the caterpillar stage in a butterfly\'s life?',
                    options: [
                        'Egg',
                        'Adult butterfly',
                        'Chrysalis (cocoon)',
                        'Baby caterpillar'
                    ],
                    correctAnswer: 'Chrysalis (cocoon)',
                    hints: [
                        'The caterpillar needs to change before becoming a butterfly.',
                        'Caterpillars wrap themselves up to transform.',
                        'The chrysalis is where the caterpillar changes into a butterfly!'
                    ]
                }
            ],
            'ages10-12': [
                {
                    scienceArea: 'geography',
                    title: 'World Explorer Challenge',
                    question: 'Which continent has the most countries?',
                    options: [
                        'North America',
                        'Africa',
                        'Asia',
                        'Europe'
                    ],
                    correctAnswer: 'Africa',
                    hints: [
                        'Think about the size and political divisions of continents.',
                        'This continent is very large and has many different nations.',
                        'Africa has 54 countries, more than any other continent!'
                    ]
                },
                {
                    scienceArea: 'physics',
                    title: 'Simple Machines',
                    question: 'A seesaw is an example of which simple machine?',
                    options: [
                        'Pulley',
                        'Lever',
                        'Wheel and axle',
                        'Inclined plane'
                    ],
                    correctAnswer: 'Lever',
                    hints: [
                        'Think about how a seesaw works - it pivots around a center point.',
                        'This machine helps us lift heavy things using a fulcrum.',
                        'A seesaw is a lever - it uses a fulcrum to balance forces!'
                    ]
                }
            ]
        };

        const ageOptions = puzzles[ageGroup] || puzzles['ages7-9'];
        const selected = ageOptions[Math.floor(Math.random() * ageOptions.length)];
        
        return new SciencePuzzle({
            id: `science-${Date.now()}`,
            type: 'science',
            subtype: selected.scienceArea,
            ageGroup: ageGroup,
            difficulty: difficulty,
            ...selected
        });
    }
}

/**
 * Adaptive Difficulty Manager
 * Adjusts puzzle difficulty based on player performance
 */
class AdaptiveDifficultyManager {
    constructor() {
        this.performanceHistory = [];
        this.currentLevel = 'medium';
        this.adjustmentThreshold = 3; // Number of puzzles before adjustment
        this.successTarget = 0.7; // Target success rate (70%)
    }

    /**
     * Record puzzle performance
     */
    recordPerformance(puzzle, result) {
        const performance = {
            puzzleId: puzzle.id,
            type: puzzle.type,
            difficulty: puzzle.difficulty,
            ageGroup: puzzle.ageGroup,
            isCorrect: result.isCorrect,
            attempts: result.attempts,
            hintsUsed: result.hintsUsed,
            timeSpent: result.timeSpent,
            efficiency: result.efficiency,
            timestamp: Date.now()
        };
        
        this.performanceHistory.push(performance);
        
        // Limit history to last 20 puzzles
        if (this.performanceHistory.length > 20) {
            this.performanceHistory = this.performanceHistory.slice(-20);
        }
        
        this.evaluateAdjustment();
    }

    /**
     * Evaluate if difficulty adjustment is needed
     */
    evaluateAdjustment() {
        if (this.performanceHistory.length < this.adjustmentThreshold) {
            return;
        }
        
        const recentPerformance = this.performanceHistory.slice(-this.adjustmentThreshold);
        const successRate = recentPerformance.filter(p => p.isCorrect).length / recentPerformance.length;
        const avgEfficiency = recentPerformance.reduce((sum, p) => sum + p.efficiency, 0) / recentPerformance.length;
        
        console.log(`📊 Performance Analysis: Success Rate: ${(successRate * 100).toFixed(1)}%, Efficiency: ${(avgEfficiency * 100).toFixed(1)}%`);
        
        if (successRate > 0.8 && avgEfficiency > 0.6) {
            // Player is doing very well, increase difficulty
            this.increaseDifficulty();
        } else if (successRate < 0.4 || avgEfficiency < 0.3) {
            // Player is struggling, decrease difficulty
            this.decreaseDifficulty();
        }
    }

    /**
     * Increase difficulty level
     */
    increaseDifficulty() {
        const levels = ['easy', 'medium', 'hard', 'expert'];
        const currentIndex = levels.indexOf(this.currentLevel);
        
        if (currentIndex < levels.length - 1) {
            this.currentLevel = levels[currentIndex + 1];
            console.log(`🔥 Difficulty increased to: ${this.currentLevel}`);
            this.showDifficultyFeedback('increased');
        }
    }

    /**
     * Decrease difficulty level
     */
    decreaseDifficulty() {
        const levels = ['easy', 'medium', 'hard', 'expert'];
        const currentIndex = levels.indexOf(this.currentLevel);
        
        if (currentIndex > 0) {
            this.currentLevel = levels[currentIndex - 1];
            console.log(`📉 Difficulty decreased to: ${this.currentLevel}`);
            this.showDifficultyFeedback('decreased');
        }
    }

    /**
     * Show feedback about difficulty adjustment
     */
    showDifficultyFeedback(direction) {
        const messages = {
            increased: [
                "🌟 You're doing amazing! Let's try something a bit more challenging!",
                "🚀 Wow! You're ready for harder puzzles. Great job!",
                "⭐ Excellent work! Time to level up your skills!",
                "🎯 You're mastering these puzzles! Ready for the next level?"
            ],
            decreased: [
                "🌱 Let's try some easier puzzles to build confidence!",
                "💡 No worries! We'll practice with simpler problems first.",
                "🤗 Everyone learns at their own pace. Let's take smaller steps!",
                "🌈 Great effort! Let's try some gentler challenges."
            ]
        };
        
        const messageList = messages[direction];
        const message = messageList[Math.floor(Math.random() * messageList.length)];
        
        // This would trigger a UI notification in the actual game
        console.log(`Difficulty Adjustment: ${message}`);
    }

    /**
     * Get recommended difficulty for new puzzle
     */
    getRecommendedDifficulty() {
        return this.currentLevel;
    }

    /**
     * Get performance statistics
     */
    getPerformanceStats() {
        if (this.performanceHistory.length === 0) {
            return null;
        }
        
        const total = this.performanceHistory.length;
        const correct = this.performanceHistory.filter(p => p.isCorrect).length;
        const avgTime = this.performanceHistory.reduce((sum, p) => sum + p.timeSpent, 0) / total;
        const avgHints = this.performanceHistory.reduce((sum, p) => sum + p.hintsUsed, 0) / total;
        
        return {
            totalPuzzles: total,
            successRate: correct / total,
            averageTime: avgTime,
            averageHints: avgHints,
            currentDifficulty: this.currentLevel
        };
    }
}

// Export classes for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BasePuzzle,
        MathPuzzle,
        LanguagePuzzle,
        SciencePuzzle,
        AdaptiveDifficultyManager
    };
} else {
    // Browser environment
    window.BasePuzzle = BasePuzzle;
    window.MathPuzzle = MathPuzzle;
    window.LanguagePuzzle = LanguagePuzzle;
    window.SciencePuzzle = SciencePuzzle;
    window.AdaptiveDifficultyManager = AdaptiveDifficultyManager;
}
