/**
 * THE ENCHANTED LIBRARY QUEST - SCENE MANAGEMENT SYSTEM
 * FableBox Educational Adventure Game
 * 
 * This file contains the scene management system that handles:
 * - Story scene rendering and transitions
 * - Interactive dialogue systems
 * - Choice management and branching narratives
 * - Visual effects and animations for scenes
 * - Scene state persistence and restoration
 * 
 * Educational Design Philosophy:
 * Scenes are designed to maintain engagement through interactive storytelling,
 * progressive narrative complexity, and meaningful choice consequences that
 * reinforce learning objectives.
 */

/**
 * Complete Story Scenes Data Structure
 * Contains all story content, puzzles, and character interactions
 */
const STORY_SCENES = {
    start: {
        id: 'start',
        type: 'story',
        text: 'Welcome, brave adventurer, to the Enchanted Library! I am the Library Guardian, and I need your help. The magical books have gone haywire - all the story characters have escaped from their pages and are causing chaos throughout the library! Without their stories, the magic that keeps our library running is fading fast.',
        background: 'library-hall',
        character: 'guardian',
        choices: [
            {
                text: 'I want to help restore the library!',
                next: 'chooseCharacter',
                action: 'advance'
            },
            {
                text: 'Tell me more about what happened',
                next: 'backstory',
                action: 'learn'
            }
        ]
    },

    backstory: {
        id: 'backstory',
        type: 'story',
        text: 'It all started when someone accidentally knocked over the Crystal of Story Balance. When it shattered, the barrier between stories and reality broke down! Now Ruby the Dragon has lost her treasure, Sage the Wizard\'s spells are all mixed up, and Scout the Explorer can\'t find his way home. Each of them needs a special friend to help them solve puzzles and restore order.',
        background: 'library-hall',
        character: 'guardian',
        choices: [
            {
                text: 'I\'m ready to help them!',
                next: 'chooseCharacter',
                action: 'advance'
            }
        ]
    },

    chooseCharacter: {
        id: 'chooseCharacter',
        type: 'characterSelect',
        text: 'Choose your magical companion! Each friend needs help with different types of challenges. Who calls out to your brave heart?',
        background: 'character-selection',
        character: null,
        choices: [
            {
                text: 'Ruby the Dragon - Help find lost treasure with math magic',
                next: 'dragonIntro',
                action: 'selectCharacter',
                character: 'dragon'
            },
            {
                text: 'Sage the Wizard - Restore word spells and language magic',
                next: 'wizardIntro',
                action: 'selectCharacter',
                character: 'wizard'
            },
            {
                text: 'Scout the Explorer - Navigate with science and discovery',
                next: 'explorerIntro',
                action: 'selectCharacter',
                character: 'mouse'
            }
        ]
    },

    // DRAGON PATH SCENES
    dragonIntro: {
        id: 'dragonIntro',
        type: 'story',
        text: 'Ruby the Dragon looks up at you with hopeful, sparkling eyes. "Oh, wonderful! A brave friend to help me! When the Crystal shattered, all my precious treasure scattered across the library. I can sense it\'s still here, but it\'s hidden behind magical number puzzles. Will you help me solve them?"',
        background: 'treasure-cave',
        character: 'dragon',
        choices: [
            {
                text: 'Yes! Let\'s find your treasure together!',
                next: 'mainPath',
                action: 'advance'
            },
            {
                text: 'What kind of puzzles are they?',
                next: 'dragonExplain',
                action: 'learn'
            }
        ]
    },

    dragonExplain: {
        id: 'dragonExplain',
        type: 'story',
        text: 'Ruby\'s scales shimmer with excitement. "The treasure is protected by number magic! Some puzzles ask us to count and add things together, others want us to share things equally. My dragon wisdom tells me that math is like treasure hunting - you need to be careful, think step by step, and celebrate every discovery!"',
        background: 'treasure-cave',
        character: 'dragon',
        choices: [
            {
                text: 'That sounds fun! Let\'s start treasure hunting!',
                next: 'mainPath',
                action: 'advance'
            }
        ]
    },

    // WIZARD PATH SCENES
    wizardIntro: {
        id: 'wizardIntro',
        type: 'story',
        text: 'Sage the Wizard adjusts his starry hat and nods wisely. "Ah, a young scholar seeks to help restore the word magic! When the Crystal broke, all my spell words got jumbled and scattered. Without the right words in the right places, my magic cannot flow properly. The library needs word wizards like you!"',
        background: 'wizard-study',
        character: 'wizard',
        choices: [
            {
                text: 'I love words! Let\'s fix your spells!',
                next: 'mainPath',
                action: 'advance'
            },
            {
                text: 'How do word spells work?',
                next: 'wizardExplain',
                action: 'learn'
            }
        ]
    },

    wizardExplain: {
        id: 'wizardExplain',
        type: 'story',
        text: 'Sage\'s eyes twinkle with ancient knowledge. "Word magic is the most powerful magic of all! Some spells need words that sound alike - we call this rhyming magic. Others need words arranged in just the right order to make sense. And the strongest spells use words that mean exactly what we need them to mean. Each word is like a magical ingredient!"',
        background: 'wizard-study',
        character: 'wizard',
        choices: [
            {
                text: 'Word magic sounds amazing! Let\'s begin!',
                next: 'mainPath',
                action: 'advance'
            }
        ]
    },

    // EXPLORER PATH SCENES
    explorerIntro: {
        id: 'explorerIntro',
        type: 'story',
        text: 'Scout the Explorer Mouse adjusts his tiny backpack and looks up at you with bright, curious eyes. "A fellow explorer! Perfect! When the Crystal broke, I lost my magical map that shows where everything belongs in the natural world. Without it, all the weather, animals, and places are mixed up! Will you explore with me to set things right?"',
        background: 'explorer-den',
        character: 'mouse',
        choices: [
            {
                text: 'Yes! I love exploring and discovering!',
                next: 'mainPath',
                action: 'advance'
            },
            {
                text: 'What kind of things are mixed up?',
                next: 'explorerExplain',
                action: 'learn'
            }
        ]
    },

    explorerExplain: {
        id: 'explorerExplain',
        type: 'story',
        text: 'Scout\'s whiskers twitch with excitement. "Oh, everything in nature has its special place! Some animals live in hot places, others in cold places. Rain clouds look different from sunny skies. Mountains, rivers, and deserts all have their own features. My map helps everything find where it belongs, but now we need to use our science knowledge to rebuild it!"',
        background: 'explorer-den',
        character: 'mouse',
        choices: [
            {
                text: 'Science exploration sounds exciting! Let\'s go!',
                next: 'mainPath',
                action: 'advance'
            }
        ]
    },

    // MAIN PATH - THREE DOORWAYS
    mainPath: {
        id: 'mainPath',
        type: 'story',
        text: 'Your chosen companion leads you to the heart of the library, where three magical doorways glow with different colored light. "This is where our adventure truly begins," they say. "Each doorway holds a piece of what we need to restore. We must go through all three to complete our quest!"',
        background: 'library-hall',
        character: 'current',
        choices: [
            {
                text: 'Enter the Golden Doorway (shimmering with number magic)',
                next: 'firstChallenge',
                action: 'advance'
            }
        ]
    },

    // DRAGON PATH PUZZLES
    firstChallenge: {
        id: 'firstChallenge',
        type: 'story',
        text: 'As you step through the golden doorway, you find yourself in a glittering chamber. Ruby bounces excitedly beside you. "Look! There are piles of gold coins scattered everywhere! But they\'re protected by a counting spell. We need to figure out how many coins there are in total!"',
        background: 'treasure-cave',
        character: 'dragon',
        choices: [
            {
                text: 'Let\'s count them together!',
                next: 'dragonPath1',
                action: 'puzzle'
            }
        ]
    },

    dragonPath1: {
        id: 'dragonPath1',
        type: 'puzzle',
        text: 'Ruby points excitedly at two piles of golden coins. "I can see 15 coins in this big pile, and 8 coins in that smaller pile. If we put them all together, how many coins will we have for the treasure chest?"',
        background: 'treasure-cave',
        character: 'dragon',
        puzzle: {
            question: 'Ruby found 15 gold coins in one pile and 8 gold coins in another pile. How many coins are there in total?',
            answer: 23,
            options: [20, 23, 25, 27],
            hint: 'Try counting: Start with 15, then add 8 more. You can count on your fingers: 16, 17, 18, 19, 20, 21, 22, 23!',
            difficulty: 'easy',
            visual: 'coin-counting'
        },
        success: 'dragonPath1Success',
        failure: 'dragonPath1Help'
    },

    dragonPath1Success: {
        id: 'dragonPath1Success',
        type: 'story',
        text: 'Ruby claps her claws together joyfully! "Excellent! 23 coins exactly! You\'re a natural treasure hunter!" The coins magically flow into a beautiful chest that appears before you. "But wait - I sense more treasure nearby. Are you ready for the next challenge?"',
        background: 'treasure-cave',
        character: 'dragon',
        choices: [
            {
                text: 'Yes! What\'s the next treasure challenge?',
                next: 'secondChallenge',
                action: 'advance'
            }
        ]
    },

    dragonPath1Help: {
        id: 'dragonPath1Help',
        type: 'story',
        text: 'Ruby gives you an encouraging smile. "No worries! Treasure hunting takes practice. Let me show you my dragon trick: When we add numbers, we\'re putting groups together. Try counting all the coins as one big group - 15 plus 8 more!"',
        background: 'treasure-cave',
        character: 'dragon',
        choices: [
            {
                text: 'I understand now! Let me try again.',
                next: 'dragonPath1',
                action: 'retry'
            }
        ]
    },

    secondChallenge: {
        id: 'secondChallenge',
        type: 'story',
        text: 'Deeper in the treasure chamber, Ruby discovers a collection of sparkling gems. "Oh my! These beautiful gems were my favorites, but they need to be shared equally among my four treasure boxes. Each box should have the same number of gems. Can you help me figure out how many gems go in each box?"',
        background: 'treasure-cave',
        character: 'dragon',
        choices: [
            {
                text: 'Let\'s share the gems fairly!',
                next: 'dragonPath2',
                action: 'puzzle'
            }
        ]
    },

    dragonPath2: {
        id: 'dragonPath2',
        type: 'puzzle',
        text: 'Ruby shows you 20 beautiful, sparkling gems of different colors. "I have 4 treasure boxes here, and I want to put the same number of gems in each box so it\'s fair and equal. How many gems should go in each box?"',
        background: 'treasure-cave',
        character: 'dragon',
        puzzle: {
            question: 'Ruby has 20 gems to share equally among 4 treasure boxes. How many gems go in each box?',
            answer: 5,
            options: [4, 5, 6, 8],
            hint: 'Think about sharing equally! Try giving out the gems one at a time to each box. Or think: what number times 4 equals 20?',
            difficulty: 'medium',
            visual: 'gem-sharing'
        },
        success: 'dragonPath2Success',
        failure: 'dragonPath2Help'
    },

    dragonPath2Success: {
        id: 'dragonPath2Success',
        type: 'story',
        text: 'Ruby\'s eyes sparkle brighter than the gems! "Perfect! 5 gems in each box - that\'s exactly equal! You understand sharing magic!" She carefully places 5 gems in each ornate box. "Now I have one final gift for you, brave treasure hunter!"',
        background: 'treasure-cave',
        character: 'dragon',
        choices: [
            {
                text: 'What is it?',
                next: 'dragonComplete',
                action: 'advance'
            }
        ]
    },

    dragonPath2Help: {
        id: 'dragonPath2Help',
        type: 'story',
        text: 'Ruby nods understandingly. "Sharing equally can be tricky! Here\'s my dragon wisdom: imagine giving out gems one by one to each box. First box gets 1, second box gets 1, third box gets 1, fourth box gets 1. Then we start again! Keep going until all 20 gems are shared."',
        background: 'treasure-cave',
        character: 'dragon',
        choices: [
            {
                text: 'That makes sense! Let me try the sharing again.',
                next: 'dragonPath2',
                action: 'retry'
            }
        ]
    },

    dragonComplete: {
        id: 'dragonComplete',
        type: 'celebration',
        text: 'Ruby reaches into her treasure chest and pulls out a magnificent golden scale that gleams with inner light. "This is a Dragon Scale of Mathematical Wisdom! You\'ve proven that you can count, add, and share with the best of dragons. Wear it proudly - you are now an honorary member of the Dragon Treasure Hunters Guild!"',
        background: 'treasure-cave-complete',
        character: 'dragon',
        reward: 'golden-scale',
        choices: [
            {
                text: 'Thank you, Ruby! This has been amazing!',
                next: 'ending',
                action: 'complete'
            }
        ]
    },

    // WIZARD PATH PUZZLES
    wizardPath1: {
        id: 'wizardPath1',
        type: 'puzzle',
        text: 'Sage opens an ancient spell book with glowing pages. "This rhyming spell is almost complete, but one word is missing! Listen carefully: \'Through the forest with a swoosh, Behind the leafy green...\' We need a word that rhymes with \'swoosh\' and makes sense in a magical forest!"',
        background: 'wizard-study',
        character: 'wizard',
        puzzle: {
            question: 'Complete the rhyming spell: "Through the forest with a swoosh, Behind the leafy green ___"',
            answer: 'bush',
            options: ['tree', 'bush', 'rock', 'path'],
            hint: 'Listen to the sound! What word sounds like "swoosh" at the end? Think about what you might find in a forest that\'s green and leafy.',
            difficulty: 'easy',
            visual: 'rhyming-spell'
        },
        success: 'wizardPath1Success',
        failure: 'wizardPath1Help'
    },

    wizardPath1Success: {
        id: 'wizardPath1Success',
        type: 'story',
        text: 'Sage\'s hat sparkles with magical energy! "Magnificent! \'Bush\' rhymes perfectly with \'swoosh\'! You can hear the magic in matching sounds!" The spell book glows and the words arrange themselves beautifully on the page. "But there\'s one more spell that needs your word wisdom!"',
        background: 'wizard-study',
        character: 'wizard',
        choices: [
            {
                text: 'I\'m ready for the next word challenge!',
                next: 'wizardPath2',
                action: 'advance'
            }
        ]
    },

    wizardPath1Help: {
        id: 'wizardPath1Help',
        type: 'story',
        text: 'Sage strokes his beard thoughtfully. "Ah, rhyming magic takes practice! Listen with your ears: \'swoosh\' ends with an \'oosh\' sound. We need another word that ends with the same sound. Try saying each word and listen to how they end!"',
        background: 'wizard-study',
        character: 'wizard',
        choices: [
            {
                text: 'I\'ll listen more carefully for the rhyming sounds!',
                next: 'wizardPath1',
                action: 'retry'
            }
        ]
    },

    wizardPath2: {
        id: 'wizardPath2',
        type: 'puzzle',
        text: 'Sage shows you a collection of word cards floating in the air. "These words belong together in a sentence, but they\'re all mixed up! Can you arrange them in the right order to make the sentence make sense? Remember: good sentences tell us who is doing what!"',
        background: 'wizard-study',
        character: 'wizard',
        puzzle: {
            question: 'Arrange these words to make a proper sentence: "book", "the", "wizard", "reads", "magic"',
            answer: ['The', 'wizard', 'reads', 'magic', 'book'],
            options: 'word-ordering',
            hint: 'Start with "The" - then think: who is doing the action? What action are they doing? What are they doing it to?',
            difficulty: 'medium',
            visual: 'word-cards'
        },
        success: 'wizardPath2Success',
        failure: 'wizardPath2Help'
    },

    wizardPath2Success: {
        id: 'wizardPath2Success',
        type: 'story',
        text: 'Sage claps his hands with delight! "Excellent! \'The wizard reads magic book\' - perfect word order! You understand how sentences flow like magic spells!" The words glow and form a beautiful, complete spell in the air. "You have mastered the art of word magic!"',
        background: 'wizard-study',
        character: 'wizard',
        choices: [
            {
                text: 'Word magic is wonderful!',
                next: 'wizardComplete',
                action: 'advance'
            }
        ]
    },

    wizardPath2Help: {
        id: 'wizardPath2Help',
        type: 'story',
        text: 'Sage nods patiently. "Sentence magic follows a pattern! Think of it as telling a story: First, we say WHO (the wizard), then we say what they DO (reads), then we say WHAT they do it to (magic book). Try putting the words in that order!"',
        background: 'wizard-study',
        character: 'wizard',
        choices: [
            {
                text: 'I understand the pattern now! Let me arrange the words.',
                next: 'wizardPath2',
                action: 'retry'
            }
        ]
    },

    wizardComplete: {
        id: 'wizardComplete',
        type: 'celebration',
        text: 'Sage reaches into his robe and pulls out a beautiful quill pen that shimmers with starlight. "This is the Magical Quill of Word Wisdom! You have shown mastery of rhymes and sentences. With this quill, any words you write will carry the power of clear thinking and beautiful expression!"',
        background: 'wizard-study-complete',
        character: 'wizard',
        reward: 'magical-quill',
        choices: [
            {
                text: 'Thank you, Sage! I love learning about words!',
                next: 'ending',
                action: 'complete'
            }
        ]
    },

    // EXPLORER PATH PUZZLES
    explorerPath1: {
        id: 'explorerPath1',
        type: 'puzzle',
        text: 'Scout points his tiny paw up at the sky where different types of clouds float by. "Look! The weather is all mixed up! I need to find the rain clouds so I know where it might rain. Can you help me identify which clouds bring rain?"',
        background: 'weather-station',
        character: 'mouse',
        puzzle: {
            question: 'Which type of clouds usually bring rain?',
            answer: 'Dark, thick clouds',
            options: ['White, fluffy clouds', 'Dark, thick clouds', 'Thin, wispy clouds', 'No clouds'],
            hint: 'Think about what you see in the sky before it rains! Are the clouds light and fluffy, or dark and heavy-looking?',
            difficulty: 'easy',
            visual: 'cloud-types'
        },
        success: 'explorerPath1Success',
        failure: 'explorerPath1Help'
    },

    explorerPath1Success: {
        id: 'explorerPath1Success',
        type: 'story',
        text: 'Scout\'s whiskers twitch with excitement! "Exactly right! Dark, thick clouds are full of water and bring rain! You\'re a natural weather watcher!" He makes a note on his explorer pad. "Now I have another question about where animals live. Ready for the next discovery?"',
        background: 'weather-station',
        character: 'mouse',
        choices: [
            {
                text: 'Yes! I love learning about animals!',
                next: 'explorerPath2',
                action: 'advance'
            }
        ]
    },

    explorerPath1Help: {
        id: 'explorerPath1Help',
        type: 'story',
        text: 'Scout adjusts his explorer hat. "Good thinking! Let me share an explorer tip: When clouds are light and white, they\'re usually just floating peacefully. But when clouds become dark and thick, they\'re heavy with water that wants to fall as rain!"',
        background: 'weather-station',
        character: 'mouse',
        choices: [
            {
                text: 'That makes sense! Let me look at the clouds again.',
                next: 'explorerPath1',
                action: 'retry'
            }
        ]
    },

    explorerPath2: {
        id: 'explorerPath2',
        type: 'puzzle',
        text: 'Scout pulls out a picture of a penguin wearing a tiny scarf. "This little fellow got separated from his family! I need to help him get home, but I can\'t remember where penguins live. Do you know what kind of place penguins call home?"',
        background: 'animal-habitats',
        character: 'mouse',
        puzzle: {
            question: 'Where do penguins live?',
            answer: 'Cold, icy places',
            options: ['Hot, sandy deserts', 'Warm, tropical forests', 'Cold, icy places', 'Grassy meadows'],
            hint: 'Think about what penguins look like! They have thick feathers and fat to keep warm. What kind of place would they need that protection?',
            difficulty: 'easy',
            visual: 'penguin-habitat'
        },
        success: 'explorerPath2Success',
        failure: 'explorerPath2Help'
    },

    explorerPath2Success: {
        id: 'explorerPath2Success',
        type: 'story',
        text: 'Scout does a little happy dance! "Perfect! Penguins live in cold, icy places like Antarctica! Their thick feathers and fat keep them warm in the freezing cold!" He carefully marks the penguin\'s home on his map. "You\'re an amazing nature detective!"',
        background: 'animal-habitats',
        character: 'mouse',
        choices: [
            {
                text: 'I love helping animals find their homes!',
                next: 'explorerComplete',
                action: 'advance'
            }
        ]
    },

    explorerPath2Help: {
        id: 'explorerPath2Help',
        type: 'story',
        text: 'Scout nods encouragingly. "Think like an explorer! Look at the penguin\'s body - see those thick, fluffy feathers? And that layer of fat? Those are special adaptations to keep warm. Animals develop features that help them survive in their environment!"',
        background: 'animal-habitats',
        character: 'mouse',
        choices: [
            {
                text: 'I understand! Penguins are built for cold places!',
                next: 'explorerPath2',
                action: 'retry'
            }
        ]
    },

    explorerComplete: {
        id: 'explorerComplete',
        type: 'celebration',
        text: 'Scout reaches into his backpack and pulls out a beautiful golden compass that spins and points in all directions before settling. "This is the Golden Compass of Scientific Discovery! You\'ve shown that you can observe nature, ask good questions, and find the right answers. True explorers like you help us understand our amazing world!"',
        background: 'explorer-den-complete',
        character: 'mouse',
        reward: 'golden-compass',
        choices: [
            {
                text: 'Thank you, Scout! Science exploration is awesome!',
                next: 'ending',
                action: 'complete'
            }
        ]
    },

    // FINAL ENDING
    ending: {
        id: 'ending',
        type: 'celebration',
        text: 'Back in the main library, all three companions gather around you with glowing smiles. The Library Guardian appears with a warm, proud expression. "Incredible! You\'ve helped restore order to our Enchanted Library! Ruby has her treasure, Sage has his word magic, and Scout has his exploration map. But most importantly, you\'ve shown the greatest magic of all - the power of learning!"',
        background: 'achievement-celebration',
        character: 'all',
        choices: [
            {
                text: 'This was the best adventure ever!',
                next: 'certificate',
                action: 'celebrate'
            }
        ]
    },

    certificate: {
        id: 'certificate',
        type: 'celebration',
        text: 'The Library Guardian raises a hand and magical sparkles fill the air. "For your bravery, kindness, and wisdom, you are hereby awarded the Certificate of Enchanted Library Hero! You\'ve proven that learning is the greatest adventure of all. Remember - every question you ask, every problem you solve, and every new thing you discover makes you stronger and wiser!"',
        background: 'achievement-celebration',
        character: 'guardian',
        reward: 'certificate',
        choices: [
            {
                text: 'Thank you! I can\'t wait for my next learning adventure!',
                next: 'playAgain',
                action: 'complete'
            }
        ]
    },

    playAgain: {
        id: 'playAgain',
        type: 'story',
        text: 'The Enchanted Library sparkles with renewed magic, and all the story characters wave goodbye as they return to their books - until next time! The Library Guardian smiles warmly. "The library will always be here when you\'re ready for another learning adventure!"',
        background: 'library-hall',
        character: 'guardian',
        choices: [
            {
                text: 'Play again with a different companion!',
                next: 'chooseCharacter',
                action: 'restart'
            },
            {
                text: 'View my certificate and achievements',
                next: 'achievements',
                action: 'view'
            }
        ]
    }
};

class SceneManager {
    constructor(gameEngine) {
        this.game = gameEngine;
        this.currentScene = null;
        this.sceneHistory = [];
        this.sceneTransitionDuration = 500;
        this.dialogueSpeed = 50; // Characters per second for typewriter effect
        this.isTransitioning = false;
        
        // Animation and effect configurations
        this.effectsConfig = {
            fadeTransition: { duration: 300, easing: 'ease-in-out' },
            slideTransition: { duration: 400, easing: 'ease-out' },
            typewriterDelay: 20, // milliseconds between characters
            backgroundAnimationDuration: 2000
        };
        
        // Bind methods to preserve context
        this.handleSceneTransition = this.handleSceneTransition.bind(this);
        this.handleChoiceSelection = this.handleChoiceSelection.bind(this);
        this.playDialogueTypewriter = this.playDialogueTypewriter.bind(this);
    }

    /**
     * Initialize scene management system
     */
    initialize() {
        this.setupSceneElements();
        this.setupEventListeners();
        console.log('🎬 Scene Manager initialized');
    }

    /**
     * Set up scene-related DOM elements
     */
    setupSceneElements() {
        this.sceneElements = {
            // Story screen elements
            storyScreen: document.getElementById('story-screen'),
            sceneTitle: document.getElementById('scene-title'),
            sceneLocation: document.getElementById('scene-location'),
            storyText: document.getElementById('story-text'),
            characterDialogue: document.getElementById('character-dialogue'),
            sceneBackground: document.getElementById('scene-background'),
            choiceContainer: document.getElementById('choice-container'),
            continueButton: document.getElementById('continue-story'),
            companionAvatar: document.querySelector('.companion-avatar'),
            
            // Puzzle screen elements
            puzzleScreen: document.getElementById('puzzle-screen'),
            puzzleTitle: document.getElementById('puzzle-title'),
            puzzleQuestion: document.getElementById('puzzle-question'),
            puzzleVisual: document.getElementById('puzzle-visual'),
            puzzleInputContainer: document.getElementById('puzzle-input-container'),
            puzzleFeedback: document.getElementById('puzzle-feedback')
        };
    }

    /**
     * Set up scene-specific event listeners
     */
    setupEventListeners() {
        // Continue button handler
        if (this.sceneElements.continueButton) {
            this.sceneElements.continueButton.addEventListener('click', () => {
                this.handleContinueClick();
            });
        }

        // Keyboard navigation for scenes
        document.addEventListener('keydown', (e) => {
            if (this.game.gameState.currentScreen === 'story') {
                this.handleStoryKeyboard(e);
            }
        });
    }

    /**
     * Load and display a scene from STORY_SCENES data
     */
    async loadScene(sceneId, storyPath = null) {
        if (this.isTransitioning) {
            console.log('⏳ Scene transition in progress, queuing...');
            return;
        }

        try {
            this.isTransitioning = true;
            
            // Find scene in STORY_SCENES data structure
            const scene = STORY_SCENES[sceneId];
            if (!scene) {
                throw new Error(`Scene not found: ${sceneId}`);
            }

            console.log(`🎬 Loading scene: ${sceneId}`);
            
            // Add to scene history for back navigation
            if (this.currentScene) {
                this.sceneHistory.push(this.currentScene);
            }
            
            this.currentScene = scene;
            
            // Apply scene transition effect
            await this.transitionToScene(scene);
            
            // Render scene based on type
            if (scene.type === 'puzzle') {
                await this.renderPuzzleScene(scene);
            } else if (scene.type === 'characterSelect') {
                await this.renderCharacterSelectScene(scene);
            } else if (scene.type === 'celebration') {
                await this.renderCelebrationScene(scene);
            } else {
                await this.renderStoryScene(scene);
            }
            
            // Play scene-specific effects
            this.playSceneEffects(scene);
            
            // Update accessibility announcements
            this.announceSceneToScreenReader(scene);
            
        } catch (error) {
            console.error('❌ Failed to load scene:', error);
            this.game.showError(`Failed to load scene: ${error.message}`);
        } finally {
            this.isTransitioning = false;
        }
    }

    /**
     * Apply transition effect when moving to new scene
     */
    async transitionToScene(scene) {
        const currentScreen = document.querySelector('.screen.active');
        if (!currentScreen) return;

        // Fade out current content
        currentScreen.style.opacity = '0';
        
        await this.delay(this.effectsConfig.fadeTransition.duration);
        
        // Switch to appropriate screen
        const targetScreen = scene.type === 'story' ? 'story' : 'puzzle';
        this.game.showScreen(targetScreen);
        
        // Fade in new content
        const newScreen = document.querySelector('.screen.active');
        if (newScreen) {
            newScreen.style.opacity = '0';
            await this.delay(50); // Small delay to ensure DOM update
            newScreen.style.opacity = '1';
        }
    }

    /**
     * Render a story scene
     */
    async renderStoryScene(scene) {
        // Update basic scene information
        this.updateSceneTitle(scene.title);
        this.updateSceneLocation(scene.location);
        this.updateSceneBackground(scene.background);
        this.updateCompanionAvatar();
        
        // Render story text with typewriter effect
        await this.renderStoryText(scene.text);
        
        // Render character dialogue if present
        if (scene.characterDialogue) {
            await this.renderCharacterDialogue(scene.characterDialogue);
        }
        
        // Set up scene interactions
        if (scene.choices && scene.choices.length > 0) {
            this.renderChoices(scene.choices);
        } else {
            this.showContinueButton();
        }
        
        // Apply scene-specific styling
        this.applySceneTheme(scene);
    }

    /**
     * Render a puzzle scene
     */
    async renderPuzzleScene(scene) {
        // Switch to puzzle screen
        this.game.showScreen('puzzle');
        
        // Use puzzle system to handle the puzzle
        if (this.game.puzzleSystem && scene.puzzle) {
            // Create a puzzle data structure compatible with the puzzle system
            const puzzleData = {
                id: scene.id,
                type: scene.puzzle.difficulty === 'easy' ? 'math' : scene.puzzle.difficulty === 'medium' ? 'language' : 'science',
                subtype: scene.puzzle.visual || 'general',
                title: scene.text,
                difficulty: {
                    easy: scene.puzzle,
                    medium: scene.puzzle,
                    hard: scene.puzzle
                }
            };
            
            // Create a scene-like object for the puzzle system
            const puzzleScene = {
                puzzleId: scene.id,
                maxAttempts: 3,
                successScene: scene.success,
                failureScene: scene.failure
            };
            
            this.game.puzzleSystem.loadPuzzle(scene.id, puzzleScene);
        }
        
        console.log(`🧩 Puzzle scene rendered: ${scene.id}`);
    }

    /**
     * Render character selection scene
     */
    async renderCharacterSelectScene(scene) {
        // Switch to character creation screen
        this.game.showScreen('characterCreation');
        
        // Update scene text
        const instructionText = document.querySelector('.instruction-text');
        if (instructionText) {
            instructionText.textContent = scene.text;
        }
        
        // Update scene background
        this.updateSceneBackground(scene.background);
        
        console.log(`👥 Character selection scene rendered: ${scene.id}`);
    }

    /**
     * Render celebration scene
     */
    async renderCelebrationScene(scene) {
        // Switch to results screen
        this.game.showScreen('results');
        
        // Update celebration content
        const resultsContent = document.querySelector('.results-content');
        if (resultsContent) {
            resultsContent.innerHTML = `
                <div class="celebration-message">
                    <h2>🎉 ${scene.id === 'ending' ? 'Quest Complete!' : 'Achievement Unlocked!'}</h2>
                    <p>${scene.text}</p>
                    ${scene.reward ? `<div class="reward-display">🏆 You received: ${scene.reward}!</div>` : ''}
                </div>
            `;
        }
        
        // Update scene background
        this.updateSceneBackground(scene.background);
        
        // Show choices if available
        if (scene.choices && scene.choices.length > 0) {
            this.renderChoices(scene.choices);
        }
        
        console.log(`🎉 Celebration scene rendered: ${scene.id}`);
    }

    /**
     * Update scene title with animation
     */
    updateSceneTitle(title) {
        if (!this.sceneElements.sceneTitle) return;
        
        this.sceneElements.sceneTitle.style.opacity = '0';
        this.sceneElements.sceneTitle.textContent = title;
        
        // Animate title appearance
        setTimeout(() => {
            this.sceneElements.sceneTitle.style.opacity = '1';
        }, 100);
    }

    /**
     * Update scene location
     */
    updateSceneLocation(location) {
        if (!this.sceneElements.sceneLocation) return;
        
        this.sceneElements.sceneLocation.textContent = location;
    }

    /**
     * Update scene background with visual effects
     */
    updateSceneBackground(backgroundId) {
        if (!this.sceneElements.sceneBackground) return;
        
        // Background mapping for different locations
        const backgroundMap = {
            // Dragon path backgrounds
            'treasure-cave': { emoji: '🏴‍☠️💎', color: '#8B5CF6', animation: 'shimmer' },
            'math-books': { emoji: '📚🔢', color: '#60A5FA', animation: 'float' },
            'calculator-corner': { emoji: '🧮💭', color: '#34D399', animation: 'pulse' },
            'pattern-palace': { emoji: '🎭✨', color: '#FCD34D', animation: 'sparkle' },
            'treasure-cave-complete': { emoji: '🏆💎', color: '#F59E0B', animation: 'celebration' },
            
            // Wizard path backgrounds
            'wizard-study': { emoji: '🔮📖', color: '#8B5CF6', animation: 'mystical' },
            'poetry-books': { emoji: '📝🎵', color: '#EC4899', animation: 'rhythm' },
            'dictionary-hall': { emoji: '📖🏛️', color: '#6366F1', animation: 'knowledge' },
            'grammar-garden': { emoji: '🌸📝', color: '#10B981', animation: 'bloom' },
            'wizard-study-complete': { emoji: '🪄✨', color: '#7C3AED', animation: 'magical' },
            
            // Mouse path backgrounds
            'explorer-den': { emoji: '🗺️🎒', color: '#059669', animation: 'adventure' },
            'weather-station': { emoji: '🌦️⛈️', color: '#0EA5E9', animation: 'weather' },
            'animal-habitats': { emoji: '🦁🏔️', color: '#DC2626', animation: 'nature' },
            'geography-station': { emoji: '🗺️🌍', color: '#16A34A', animation: 'explore' },
            'explorer-den-complete': { emoji: '🧭⭐', color: '#0D9488', animation: 'discovery' },
            
            // Default
            'default': { emoji: '✨🏛️', color: '#6B7280', animation: 'gentle' }
        };
        
        const background = backgroundMap[backgroundId] || backgroundMap.default;
        
        // Apply background
        this.sceneElements.sceneBackground.innerHTML = background.emoji;
        this.sceneElements.sceneBackground.style.background = `linear-gradient(135deg, ${background.color}20, ${background.color}10)`;
        
        // Apply background animation
        this.applyBackgroundAnimation(background.animation);
    }

    /**
     * Apply background animation effects
     */
    applyBackgroundAnimation(animationType) {
        if (!this.game.gameState.settings.animationsEnabled) return;
        
        const background = this.sceneElements.sceneBackground;
        if (!background) return;
        
        // Remove existing animation classes
        background.classList.remove('shimmer', 'float', 'pulse', 'sparkle', 'celebration', 
                                   'mystical', 'rhythm', 'knowledge', 'bloom', 'magical',
                                   'adventure', 'weather', 'nature', 'explore', 'discovery', 'gentle');
        
        // Add new animation class
        background.classList.add(animationType);
        
        // Create additional particles for special animations
        if (['celebration', 'magical', 'discovery'].includes(animationType)) {
            this.createBackgroundParticles(animationType);
        }
    }

    /**
     * Create background particle effects
     */
    createBackgroundParticles(effectType) {
        const particleCount = effectType === 'celebration' ? 20 : 10;
        const emojis = {
            celebration: ['🎉', '🎊', '✨', '🌟', '💫'],
            magical: ['✨', '🔮', '⭐', '💫', '🪄'],
            discovery: ['🧭', '⭐', '💎', '🗺️', '🔍']
        };
        
        const particleEmojis = emojis[effectType] || ['✨'];
        
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                const emoji = particleEmojis[Math.floor(Math.random() * particleEmojis.length)];
                this.game.createParticle(emoji, {
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight
                });
            }, i * 200);
        }
    }

    /**
     * Update companion avatar with character-specific styling
     */
    updateCompanionAvatar() {
        if (!this.sceneElements.companionAvatar) return;
        
        const characterData = this.game.getCharacterData();
        if (!characterData) return;
        
        this.sceneElements.companionAvatar.innerHTML = characterData.emoji;
        this.sceneElements.companionAvatar.style.background = `linear-gradient(135deg, ${characterData.color}, ${characterData.color}80)`;
        
        // Add character-specific animation
        this.sceneElements.companionAvatar.classList.add('bounce');
        
        // Add hover effect for interaction feedback
        this.sceneElements.companionAvatar.setAttribute('title', characterData.name);
    }

    /**
     * Render story text with typewriter effect
     */
    async renderStoryText(text) {
        if (!this.sceneElements.storyText) return;
        
        // Clear existing text
        this.sceneElements.storyText.textContent = '';
        
        // Apply typewriter effect if animations enabled
        if (this.game.gameState.settings.animationsEnabled) {
            await this.playDialogueTypewriter(this.sceneElements.storyText, text);
        } else {
            this.sceneElements.storyText.textContent = text;
        }
    }

    /**
     * Render character dialogue with styling
     */
    async renderCharacterDialogue(dialogue) {
        if (!this.sceneElements.characterDialogue) return;
        
        const characterData = this.game.getCharacterData();
        if (!characterData) return;
        
        // Create dialogue HTML structure
        const dialogueHTML = `
            <div class="dialogue-avatar">${characterData.emoji}</div>
            <div class="dialogue-content">
                <strong>${characterData.name}:</strong>
                <span class="dialogue-text"></span>
            </div>
        `;
        
        this.sceneElements.characterDialogue.innerHTML = dialogueHTML;
        this.sceneElements.characterDialogue.style.display = 'block';
        
        // Apply character-specific styling
        this.sceneElements.characterDialogue.style.borderLeftColor = characterData.color;
        
        // Animate dialogue text
        const dialogueTextElement = this.sceneElements.characterDialogue.querySelector('.dialogue-text');
        if (dialogueTextElement) {
            if (this.game.gameState.settings.animationsEnabled) {
                await this.playDialogueTypewriter(dialogueTextElement, dialogue);
            } else {
                dialogueTextElement.textContent = dialogue;
            }
        }
    }

    /**
     * Play typewriter effect for text
     */
    async playDialogueTypewriter(element, text) {
        return new Promise(resolve => {
            let index = 0;
            element.textContent = '';
            
            const typeCharacter = () => {
                if (index < text.length) {
                    element.textContent += text[index];
                    index++;
                    setTimeout(typeCharacter, this.effectsConfig.typewriterDelay);
                } else {
                    resolve();
                }
            };
            
            typeCharacter();
        });
    }

    /**
     * Render story choices
     */
    renderChoices(choices) {
        if (!this.sceneElements.choiceContainer) return;
        
        // Clear existing choices
        this.sceneElements.choiceContainer.innerHTML = '';
        
        // Hide continue button
        this.hideContinueButton();
        
        // Create choice buttons
        choices.forEach((choice, index) => {
            const choiceButton = this.createChoiceButton(choice, index);
            this.sceneElements.choiceContainer.appendChild(choiceButton);
        });
        
        // Focus on first choice for accessibility
        const firstChoice = this.sceneElements.choiceContainer.querySelector('.choice-option');
        if (firstChoice) {
            setTimeout(() => firstChoice.focus(), 100);
        }
    }

    /**
     * Create a choice button element
     */
    createChoiceButton(choice, index) {
        const button = document.createElement('button');
        button.className = 'choice-option';
        button.textContent = choice.text;
        button.setAttribute('aria-label', `Choice ${index + 1}: ${choice.text}`);
        button.setAttribute('data-choice-index', index);
        
        // Add mood-based styling
        if (choice.mood) {
            button.classList.add(`mood-${choice.mood}`);
        }
        
        // Event listeners
        button.addEventListener('click', () => this.handleChoiceSelection(choice, button));
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.handleChoiceSelection(choice, button);
            }
        });
        
        // Add entrance animation
        if (this.game.gameState.settings.animationsEnabled) {
            button.style.opacity = '0';
            button.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                button.style.transition = 'all 0.3s ease-out';
                button.style.opacity = '1';
                button.style.transform = 'translateX(0)';
            }, index * 100);
        }
        
        return button;
    }

    /**
     * Handle choice selection
     */
    handleChoiceSelection(choice, buttonElement) {
        if (this.isTransitioning) return;
        
        console.log('📖 Story choice selected:', choice.text);
        
        // Visual feedback for selection
        this.highlightChoice(buttonElement);
        
        // Announce choice to screen reader
        this.game.announceToScreenReader(`Selected: ${choice.text}`);
        
        // Handle special actions
        if (choice.action === 'selectCharacter' && choice.character) {
            // Set the selected character in game state
            this.game.gameState.player.character = choice.character;
            this.game.gameState.player.currentPath = choice.character;
        }
        
        // Proceed to next scene after brief delay for feedback
        setTimeout(() => {
            if (choice.next) {
                this.loadScene(choice.next);
            } else {
                console.error('No next scene specified for choice:', choice);
            }
        }, 300);
    }

    /**
     * Highlight selected choice with visual feedback
     */
    highlightChoice(buttonElement) {
        if (!this.game.gameState.settings.animationsEnabled) return;
        
        // Disable other choices
        const allChoices = this.sceneElements.choiceContainer.querySelectorAll('.choice-option');
        allChoices.forEach(choice => {
            if (choice !== buttonElement) {
                choice.disabled = true;
                choice.style.opacity = '0.5';
            }
        });
        
        // Highlight selected choice
        buttonElement.classList.add('selected');
        buttonElement.style.transform = 'scale(1.05)';
        
        // Create selection particles
        this.game.createParticles(buttonElement, '✨', 3);
    }

    /**
     * Show continue button
     */
    showContinueButton() {
        if (!this.sceneElements.continueButton) return;
        
        // Clear choices
        if (this.sceneElements.choiceContainer) {
            this.sceneElements.choiceContainer.innerHTML = '';
        }
        
        // Show and focus continue button
        this.sceneElements.continueButton.style.display = 'block';
        setTimeout(() => this.sceneElements.continueButton.focus(), 100);
    }

    /**
     * Hide continue button
     */
    hideContinueButton() {
        if (this.sceneElements.continueButton) {
            this.sceneElements.continueButton.style.display = 'none';
        }
    }

    /**
     * Handle continue button click
     */
    handleContinueClick() {
        if (this.isTransitioning) return;
        
        const currentSceneIndex = this.getCurrentSceneIndex();
        const nextSceneIndex = currentSceneIndex + 1;
        
        // Check if there's a next scene in the current story path
        if (nextSceneIndex < this.game.currentStoryPath.scenes.length) {
            const nextScene = this.game.currentStoryPath.scenes[nextSceneIndex];
            this.game.loadScene(nextScene.id);
        } else {
            // End of story path
            this.game.completeStoryPath();
        }
    }

    /**
     * Get current scene index in story path
     */
    getCurrentSceneIndex() {
        if (!this.currentScene || !this.game.currentStoryPath) return -1;
        
        return this.game.currentStoryPath.scenes.findIndex(scene => 
            scene.id === this.currentScene.id
        );
    }

    /**
     * Update puzzle title
     */
    updatePuzzleTitle(title) {
        if (this.sceneElements.puzzleTitle) {
            this.sceneElements.puzzleTitle.textContent = title;
        }
    }

    /**
     * Update puzzle text
     */
    updatePuzzleText(text) {
        if (this.sceneElements.puzzleQuestion) {
            this.sceneElements.puzzleQuestion.textContent = text;
        }
    }

    /**
     * Clear puzzle content
     */
    clearPuzzleContent() {
        if (this.sceneElements.puzzleInputContainer) {
            this.sceneElements.puzzleInputContainer.innerHTML = '';
        }
        
        if (this.sceneElements.puzzleFeedback) {
            this.sceneElements.puzzleFeedback.textContent = '';
            this.sceneElements.puzzleFeedback.className = 'puzzle-feedback';
        }
    }

    /**
     * Apply scene-specific theming
     */
    applySceneTheme(scene) {
        const storyScreen = this.sceneElements.storyScreen;
        if (!storyScreen) return;
        
        // Remove existing theme classes
        storyScreen.classList.remove('theme-dragon', 'theme-wizard', 'theme-mouse');
        
        // Apply character-specific theme
        const character = this.game.gameState.player.character;
        if (character) {
            storyScreen.classList.add(`theme-${character}`);
        }
        
        // Apply location-specific styling if needed
        if (scene.location) {
            storyScreen.setAttribute('data-location', scene.location.toLowerCase().replace(/\s+/g, '-'));
        }
    }

    /**
     * Play scene-specific effects
     */
    playSceneEffects(scene) {
        if (!this.game.gameState.settings.animationsEnabled) return;
        
        // Play entrance animation for scene content
        this.playSceneEntranceAnimation();
        
        // Play scene-specific animations
        if (scene.animations) {
            scene.animations.forEach(animation => {
                this.playSceneAnimation(animation);
            });
        }
        
        // Play background music if specified
        if (scene.backgroundMusic) {
            this.playBackgroundMusic(scene.backgroundMusic);
        }
    }

    /**
     * Play scene entrance animation
     */
    playSceneEntranceAnimation() {
        const screenContent = document.querySelector('.screen.active .screen-content');
        if (!screenContent) return;
        
        screenContent.style.transform = 'translateY(20px)';
        screenContent.style.opacity = '0';
        
        setTimeout(() => {
            screenContent.style.transition = 'all 0.5s ease-out';
            screenContent.style.transform = 'translateY(0)';
            screenContent.style.opacity = '1';
        }, 50);
    }

    /**
     * Play specific scene animation
     */
    playSceneAnimation(animationType) {
        switch (animationType) {
            case 'floating_gems':
                this.createFloatingElements('💎', 3, 'float-up');
                break;
            case 'sparkle_effects':
                this.createFloatingElements('✨', 5, 'sparkle-twinkle');
                break;
            case 'magic_swirls':
                this.createFloatingElements('🌟', 4, 'magic-swirl');
                break;
            case 'nature_elements':
                this.createFloatingElements('🍃', 3, 'leaf-drift');
                break;
            default:
                console.log('Unknown animation type:', animationType);
        }
    }

    /**
     * Create floating elements with specific animation
     */
    createFloatingElements(emoji, count, animationClass) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const element = this.createAnimatedElement(emoji, animationClass);
                document.body.appendChild(element);
                
                // Remove element after animation
                setTimeout(() => {
                    if (element.parentNode) {
                        element.parentNode.removeChild(element);
                    }
                }, 4000);
            }, i * 300);
        }
    }

    /**
     * Create animated element with specific class
     */
    createAnimatedElement(content, animationClass) {
        const element = document.createElement('div');
        element.className = `floating-element ${animationClass}`;
        element.textContent = content;
        element.style.position = 'fixed';
        element.style.left = Math.random() * (window.innerWidth - 50) + 'px';
        element.style.top = window.innerHeight + 'px';
        element.style.fontSize = '2rem';
        element.style.pointerEvents = 'none';
        element.style.zIndex = '1000';
        
        return element;
    }

    /**
     * Play background music (placeholder for future audio system)
     */
    playBackgroundMusic(musicId) {
        if (!this.game.gameState.settings.soundEnabled) return;
        
        console.log(`🎵 Playing background music: ${musicId}`);
        // In a full implementation, this would load and play audio files
    }

    /**
     * Handle story screen keyboard navigation
     */
    handleStoryKeyboard(event) {
        const { key } = event;
        
        if (key === 'Enter' || key === ' ') {
            // Handle continue or choice selection
            const continueBtn = this.sceneElements.continueButton;
            const focusedChoice = document.activeElement;
            
            if (continueBtn && continueBtn.style.display !== 'none' && !focusedChoice.classList.contains('choice-option')) {
                event.preventDefault();
                this.handleContinueClick();
            }
        } else if (key === 'ArrowUp' || key === 'ArrowDown') {
            // Navigate between choices
            this.navigateChoices(key === 'ArrowDown');
        } else if (key === 'Escape') {
            // Back to previous scene (if history exists)
            this.goBackToPreviousScene();
        }
    }

    /**
     * Navigate between choice options with keyboard
     */
    navigateChoices(down) {
        const choices = this.sceneElements.choiceContainer.querySelectorAll('.choice-option');
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
     * Go back to previous scene (if available)
     */
    goBackToPreviousScene() {
        if (this.sceneHistory.length === 0) {
            this.game.announceToScreenReader('No previous scene available');
            return;
        }
        
        const previousScene = this.sceneHistory.pop();
        this.currentScene = previousScene;
        
        // Reload previous scene
        this.loadScene(previousScene.id, this.game.currentStoryPath);
        
        this.game.announceToScreenReader('Returned to previous scene');
    }

    /**
     * Announce scene information to screen readers
     */
    announceSceneToScreenReader(scene) {
        let announcement = `${scene.title}.`;
        
        if (scene.location) {
            announcement += ` Location: ${scene.location}.`;
        }
        
        announcement += ` ${scene.text}`;
        
        if (scene.characterDialogue) {
            const characterData = this.game.getCharacterData();
            const characterName = characterData ? characterData.name : 'Companion';
            announcement += ` ${characterName} says: ${scene.characterDialogue}`;
        }
        
        if (scene.choices && scene.choices.length > 0) {
            announcement += ` ${scene.choices.length} choices available. Use arrow keys to navigate.`;
        } else {
            announcement += ' Press Enter to continue.';
        }
        
        this.game.announceToScreenReader(announcement);
    }

    /**
     * Get scene state for saving
     */
    getSceneState() {
        return {
            currentSceneId: this.currentScene ? this.currentScene.id : null,
            sceneHistory: this.sceneHistory.map(scene => ({ id: scene.id, title: scene.title })),
            lastTransitionTime: Date.now()
        };
    }

    /**
     * Restore scene state from saved data
     */
    restoreSceneState(savedState) {
        if (savedState.currentSceneId) {
            // Scene will be loaded by the main game engine
            console.log(`🔄 Restoring scene state: ${savedState.currentSceneId}`);
        }
        
        // Note: Scene history restoration would need more complex implementation
        // to avoid circular dependencies with the game state
    }

    /**
     * Utility function for delays
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Clean up scene manager resources
     */
    destroy() {
        // Clear any ongoing animations or timeouts
        this.isTransitioning = false;
        
        // Remove event listeners
        document.removeEventListener('keydown', this.handleStoryKeyboard);
        
        console.log('🧹 Scene Manager cleanup complete');
    }
}

// Make SceneManager available globally
window.SceneManager = SceneManager;
