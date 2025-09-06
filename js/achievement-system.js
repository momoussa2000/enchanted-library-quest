/**
 * THE ENCHANTED LIBRARY QUEST - ACHIEVEMENT SYSTEM
 * FableBox Educational Adventure Game
 * 
 * This file contains the comprehensive achievement system that handles:
 * - Learning milestone tracking and badges
 * - Progress-based achievement unlocking
 * - Skill mastery recognition and rewards
 * - Time-based and exploration achievements
 * - Motivational feedback and celebrations
 * - Achievement sharing and certificates
 * 
 * Achievement Philosophy:
 * The achievement system celebrates learning progress, effort, and exploration
 * while maintaining intrinsic motivation through meaningful recognition of
 * educational milestones and character growth.
 */

class AchievementSystem {
    constructor(gameEngine) {
        this.game = gameEngine;
        this.achievements = new Map();
        this.earnedAchievements = new Set();
        this.progressData = new Map();
        this.totalPoints = 0;
        this.notificationQueue = [];
        this.isShowingNotification = false;
        
        // Achievement categories
        this.categories = {
            learning: 'Learning Milestones',
            progress: 'Story Progress', 
            exploration: 'Adventure Spirit',
            mastery: 'Skill Mastery',
            time: 'Dedication',
            special: 'Special Recognition'
        };
        
        this.initialize();
    }

    /**
     * Initialize the achievement system
     */
    initialize() {
        this.defineAchievements();
        this.loadProgress();
        this.setupEventListeners();
        console.log('🏆 Achievement system initialized');
    }

    /**
     * Define all available achievements
     */
    defineAchievements() {
        // Learning Milestone Achievements
        this.addAchievement({
            id: 'first_puzzle',
            name: 'First Steps',
            description: 'Solve your very first puzzle!',
            category: 'learning',
            icon: '🧩',
            points: 10,
            condition: (data) => data.puzzlesSolved >= 1,
            rarity: 'common'
        });

        this.addAchievement({
            id: 'puzzle_master_5',
            name: 'Puzzle Explorer',
            description: 'Solve 5 different puzzles',
            category: 'learning',
            icon: '🔍',
            points: 25,
            condition: (data) => data.puzzlesSolved >= 5,
            rarity: 'common'
        });

        this.addAchievement({
            id: 'puzzle_master_10',
            name: 'Puzzle Champion',
            description: 'Solve 10 different puzzles',
            category: 'learning',
            icon: '⭐',
            points: 50,
            condition: (data) => data.puzzlesSolved >= 10,
            rarity: 'uncommon'
        });

        this.addAchievement({
            id: 'perfect_streak_3',
            name: 'Triple Perfect',
            description: 'Get 3 puzzles right in a row!',
            category: 'mastery',
            icon: '🎯',
            points: 30,
            condition: (data) => data.perfectStreak >= 3,
            rarity: 'uncommon'
        });

        this.addAchievement({
            id: 'perfect_streak_5',
            name: 'Unstoppable',
            description: 'Get 5 puzzles right in a row!',
            category: 'mastery',
            icon: '🔥',
            points: 75,
            condition: (data) => data.perfectStreak >= 5,
            rarity: 'rare'
        });

        // Story Progress Achievements
        this.addAchievement({
            id: 'meet_dragon',
            name: 'Dragon Friend',
            description: 'Meet Ruby the Dragon on your adventure',
            category: 'progress',
            icon: '🐲',
            points: 20,
            condition: (data) => data.charactersMetStack && data.charactersMetStack.includes('dragon'),
            rarity: 'common'
        });

        this.addAchievement({
            id: 'meet_wizard',
            name: 'Wise Student',
            description: 'Learn from Sage the Wizard',
            category: 'progress',
            icon: '🧙‍♂️',
            points: 20,
            condition: (data) => data.charactersMetStack && data.charactersMetStack.includes('wizard'),
            rarity: 'common'
        });

        this.addAchievement({
            id: 'meet_explorer',
            name: 'Fellow Explorer',
            description: 'Adventure with Scout the Explorer Mouse',
            category: 'progress',
            icon: '🐭',
            points: 20,
            condition: (data) => data.charactersMetStack && data.charactersMetStack.includes('explorer'),
            rarity: 'common'
        });

        this.addAchievement({
            id: 'complete_path',
            name: 'Path Walker',
            description: 'Complete your first adventure path',
            category: 'progress',
            icon: '🛤️',
            points: 100,
            condition: (data) => data.pathsCompleted >= 1,
            rarity: 'uncommon'
        });

        this.addAchievement({
            id: 'complete_all_paths',
            name: 'Master Adventurer',
            description: 'Complete all three adventure paths',
            category: 'progress',
            icon: '👑',
            points: 200,
            condition: (data) => data.pathsCompleted >= 3,
            rarity: 'legendary'
        });

        // Skill Mastery Achievements
        this.addAchievement({
            id: 'math_apprentice',
            name: 'Math Apprentice',
            description: 'Reach Level 3 in Mathematics',
            category: 'mastery',
            icon: '🔢',
            points: 40,
            condition: (data) => data.mathLevel >= 3,
            rarity: 'uncommon'
        });

        this.addAchievement({
            id: 'math_master',
            name: 'Math Master',
            description: 'Reach Level 5 in Mathematics',
            category: 'mastery',
            icon: '🧮',
            points: 80,
            condition: (data) => data.mathLevel >= 5,
            rarity: 'rare'
        });

        this.addAchievement({
            id: 'language_lover',
            name: 'Word Wizard',
            description: 'Reach Level 3 in Language Arts',
            category: 'mastery',
            icon: '📚',
            points: 40,
            condition: (data) => data.languageLevel >= 3,
            rarity: 'uncommon'
        });

        this.addAchievement({
            id: 'language_master',
            name: 'Literature Legend',
            description: 'Reach Level 5 in Language Arts',
            category: 'mastery',
            icon: '✍️',
            points: 80,
            condition: (data) => data.languageLevel >= 5,
            rarity: 'rare'
        });

        this.addAchievement({
            id: 'science_scholar',
            name: 'Science Scholar',
            description: 'Reach Level 3 in Science',
            category: 'mastery',
            icon: '🔬',
            points: 40,
            condition: (data) => data.scienceLevel >= 3,
            rarity: 'uncommon'
        });

        this.addAchievement({
            id: 'science_master',
            name: 'Science Sage',
            description: 'Reach Level 5 in Science',
            category: 'mastery',
            icon: '🧪',
            points: 80,
            condition: (data) => data.scienceLevel >= 5,
            rarity: 'rare'
        });

        // Time and Dedication Achievements
        this.addAchievement({
            id: 'first_session',
            name: 'Welcome Adventurer',
            description: 'Complete your first learning session',
            category: 'time',
            icon: '🌟',
            points: 5,
            condition: (data) => data.sessionsPlayed >= 1,
            rarity: 'common'
        });

        this.addAchievement({
            id: 'dedicated_learner',
            name: 'Dedicated Learner',
            description: 'Play for 7 different days',
            category: 'time',
            icon: '📅',
            points: 60,
            condition: (data) => data.uniqueDaysPlayed >= 7,
            rarity: 'uncommon'
        });

        this.addAchievement({
            id: 'speed_reader',
            name: 'Lightning Reader',
            description: 'Complete any path in under 20 minutes',
            category: 'special',
            icon: '⚡',
            points: 100,
            condition: (data) => data.fastestPathTime && data.fastestPathTime < 1200000, // 20 minutes
            rarity: 'rare'
        });

        // Helper and Wisdom Achievements
        this.addAchievement({
            id: 'wise_helper',
            name: 'Wise Helper',
            description: 'Use hints thoughtfully on 5 puzzles',
            category: 'learning',
            icon: '💡',
            points: 35,
            condition: (data) => data.hintsUsedWisely >= 5,
            rarity: 'uncommon'
        });

        this.addAchievement({
            id: 'independent_solver',
            name: 'Independent Thinker',
            description: 'Solve 10 puzzles without using any hints',
            category: 'mastery',
            icon: '🎓',
            points: 90,
            condition: (data) => data.puzzlesSolvedWithoutHints >= 10,
            rarity: 'rare'
        });

        // Special Recognition Achievements
        this.addAchievement({
            id: 'perfect_score',
            name: 'Perfect Adventure',
            description: 'Complete a path with perfect scores on all puzzles',
            category: 'special',
            icon: '💎',
            points: 150,
            condition: (data) => data.perfectPathCompleted,
            rarity: 'epic'
        });

        this.addAchievement({
            id: 'library_guardian',
            name: 'Library Guardian',
            description: 'Help restore complete order to the Enchanted Library',
            category: 'special',
            icon: '🏛️',
            points: 300,
            condition: (data) => data.gameCompleted && data.pathsCompleted >= 3,
            rarity: 'legendary'
        });

        this.addAchievement({
            id: 'exploration_expert',
            name: 'Exploration Expert',
            description: 'Visit every scene in the game',
            category: 'exploration',
            icon: '🗺️',
            points: 120,
            condition: (data) => data.scenesVisited >= this.getTotalScenesCount(),
            rarity: 'rare'
        });

        console.log(`🏆 Loaded ${this.achievements.size} achievements`);
    }

    /**
     * Add achievement to the system
     */
    addAchievement(achievement) {
        this.achievements.set(achievement.id, {
            ...achievement,
            dateCreated: Date.now(),
            isSecret: achievement.isSecret || false
        });
    }

    /**
     * Check and award achievements
     */
    checkAchievements() {
        const gameData = this.collectGameData();
        const newAchievements = [];

        this.achievements.forEach((achievement, id) => {
            if (!this.earnedAchievements.has(id)) {
                try {
                    if (achievement.condition(gameData)) {
                        this.awardAchievement(id);
                        newAchievements.push(achievement);
                    }
                } catch (error) {
                    console.warn(`Achievement check failed for ${id}:`, error);
                }
            }
        });

        if (newAchievements.length > 0) {
            this.showAchievementNotifications(newAchievements);
        }

        return newAchievements;
    }

    /**
     * Collect current game data for achievement checking
     */
    collectGameData() {
        const saveData = this.getCurrentSaveData();
        if (!saveData) return {};

        const puzzleProgress = saveData.puzzleProgress || {};
        const gameProgress = saveData.gameProgress || {};
        
        return {
            // Puzzle statistics
            puzzlesSolved: puzzleProgress.puzzlesSolved || 0,
            totalPuzzles: puzzleProgress.totalPuzzles || 0,
            hintsUsed: puzzleProgress.hintsUsed || 0,
            
            // Skill levels
            mathLevel: puzzleProgress.skillLevels?.math?.level || 1,
            languageLevel: puzzleProgress.skillLevels?.language?.level || 1,
            scienceLevel: puzzleProgress.skillLevels?.science?.level || 1,
            
            // Progress data
            pathsCompleted: gameProgress.pathsCompleted?.length || 0,
            scenesVisited: gameProgress.scenesVisited?.length || 0,
            currentScene: gameProgress.currentScene,
            
            // Character interactions
            charactersMetStack: gameProgress.charactersMetStack || [],
            
            // Time data
            totalPlayTime: gameProgress.totalPlayTime || 0,
            sessionsPlayed: this.getSessionsPlayed(),
            uniqueDaysPlayed: this.getUniqueDaysPlayed(),
            
            // Advanced metrics
            perfectStreak: this.calculatePerfectStreak(),
            puzzlesSolvedWithoutHints: this.getPuzzlesSolvedWithoutHints(),
            hintsUsedWisely: this.getWiseHintUsage(),
            fastestPathTime: this.getFastestPathTime(),
            perfectPathCompleted: this.checkPerfectPathCompletion(),
            gameCompleted: this.checkGameCompletion()
        };
    }

    /**
     * Award achievement to player
     */
    awardAchievement(achievementId) {
        const achievement = this.achievements.get(achievementId);
        if (!achievement || this.earnedAchievements.has(achievementId)) {
            return false;
        }

        // Mark as earned
        this.earnedAchievements.add(achievementId);
        
        // Add points
        this.totalPoints += achievement.points;
        
        // Update progress data
        this.progressData.set(achievementId, {
            dateEarned: Date.now(),
            points: achievement.points
        });
        
        // Save progress
        this.saveProgress();
        
        console.log(`🏆 Achievement earned: ${achievement.name} (+${achievement.points} points)`);
        
        // Trigger celebration effects
        this.triggerAchievementEffects(achievement);
        
        return true;
    }

    /**
     * Show achievement notification
     */
    showAchievementNotifications(achievements) {
        achievements.forEach(achievement => {
            this.notificationQueue.push(achievement);
        });
        
        if (!this.isShowingNotification) {
            this.processNotificationQueue();
        }
    }

    /**
     * Process notification queue
     */
    async processNotificationQueue() {
        if (this.notificationQueue.length === 0) {
            this.isShowingNotification = false;
            return;
        }

        this.isShowingNotification = true;
        const achievement = this.notificationQueue.shift();
        
        await this.displayAchievementNotification(achievement);
        
        // Wait before showing next notification
        setTimeout(() => {
            this.processNotificationQueue();
        }, 1000);
    }

    /**
     * Display achievement notification
     */
    async displayAchievementNotification(achievement) {
        return new Promise(resolve => {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `achievement-notification rarity-${achievement.rarity}`;
            notification.innerHTML = `
                <div class="achievement-content">
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div class="achievement-info">
                        <div class="achievement-title">Achievement Unlocked!</div>
                        <div class="achievement-name">${achievement.name}</div>
                        <div class="achievement-description">${achievement.description}</div>
                        <div class="achievement-points">+${achievement.points} points</div>
                    </div>
                </div>
                <div class="achievement-close" onclick="this.parentElement.remove()">✕</div>
            `;
            
            // Add styles if not exist
            this.ensureNotificationStyles();
            
            // Add to page
            document.body.appendChild(notification);
            
            // Animate in
            setTimeout(() => {
                notification.classList.add('show');
            }, 100);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                notification.classList.add('hide');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                    resolve();
                }, 500);
            }, 5000);
        });
    }

    /**
     * Ensure notification styles exist
     */
    ensureNotificationStyles() {
        if (document.getElementById('achievement-notification-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'achievement-notification-styles';
        styles.textContent = `
            .achievement-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                background: linear-gradient(135deg, #8B5CF6, #60A5FA);
                color: white;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                max-width: 350px;
                transform: translateX(400px);
                transition: all 0.5s ease;
                border: 2px solid rgba(255,255,255,0.2);
            }
            
            .achievement-notification.show {
                transform: translateX(0);
            }
            
            .achievement-notification.hide {
                transform: translateX(400px);
                opacity: 0;
            }
            
            .achievement-notification.rarity-rare {
                background: linear-gradient(135deg, #F59E0B, #EF4444);
                box-shadow: 0 8px 32px rgba(245, 158, 11, 0.4);
            }
            
            .achievement-notification.rarity-epic {
                background: linear-gradient(135deg, #8B5CF6, #EC4899);
                box-shadow: 0 8px 32px rgba(139, 92, 246, 0.4);
                animation: epicGlow 2s ease-in-out infinite alternate;
            }
            
            .achievement-notification.rarity-legendary {
                background: linear-gradient(135deg, #F59E0B, #F97316, #EF4444);
                box-shadow: 0 8px 32px rgba(245, 158, 11, 0.6);
                animation: legendaryGlow 1.5s ease-in-out infinite alternate;
            }
            
            .achievement-content {
                display: flex;
                gap: 15px;
                align-items: flex-start;
            }
            
            .achievement-icon {
                font-size: 2rem;
                flex-shrink: 0;
            }
            
            .achievement-info {
                flex: 1;
            }
            
            .achievement-title {
                font-size: 0.9rem;
                opacity: 0.8;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 4px;
            }
            
            .achievement-name {
                font-size: 1.1rem;
                font-weight: bold;
                margin-bottom: 4px;
            }
            
            .achievement-description {
                font-size: 0.9rem;
                opacity: 0.9;
                line-height: 1.3;
                margin-bottom: 8px;
            }
            
            .achievement-points {
                font-size: 0.8rem;
                background: rgba(255,255,255,0.2);
                padding: 4px 8px;
                border-radius: 12px;
                display: inline-block;
                font-weight: 600;
            }
            
            .achievement-close {
                position: absolute;
                top: 10px;
                right: 10px;
                cursor: pointer;
                opacity: 0.7;
                font-size: 1.2rem;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.2s ease;
            }
            
            .achievement-close:hover {
                opacity: 1;
                background: rgba(255,255,255,0.2);
            }
            
            @keyframes epicGlow {
                from { box-shadow: 0 8px 32px rgba(139, 92, 246, 0.4); }
                to { box-shadow: 0 8px 32px rgba(139, 92, 246, 0.8), 0 0 20px rgba(139, 92, 246, 0.3); }
            }
            
            @keyframes legendaryGlow {
                from { 
                    box-shadow: 0 8px 32px rgba(245, 158, 11, 0.6);
                    transform: translateX(0) scale(1);
                }
                to { 
                    box-shadow: 0 8px 32px rgba(245, 158, 11, 0.9), 0 0 30px rgba(245, 158, 11, 0.5);
                    transform: translateX(0) scale(1.02);
                }
            }
            
            @media (max-width: 768px) {
                .achievement-notification {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                    max-width: none;
                    transform: translateY(-200px);
                }
                
                .achievement-notification.show {
                    transform: translateY(0);
                }
                
                .achievement-notification.hide {
                    transform: translateY(-200px);
                }
            }
        `;
        
        document.head.appendChild(styles);
    }

    /**
     * Trigger visual effects for achievement
     */
    triggerAchievementEffects(achievement) {
        // Trigger confetti/celebration based on rarity
        if (this.game.animationSystem) {
            switch (achievement.rarity) {
                case 'legendary':
                case 'epic':
                    this.game.animationSystem.createSparkleEffect(document.body, {
                        count: 30,
                        colors: ['#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'],
                        duration: 4000,
                        spread: 200
                    });
                    break;
                    
                case 'rare':
                    this.game.animationSystem.createSparkleEffect(document.body, {
                        count: 20,
                        colors: ['#F59E0B', '#EF4444'],
                        duration: 3000,
                        spread: 150
                    });
                    break;
                    
                default:
                    this.game.animationSystem.createSparkleEffect(document.body, {
                        count: 12,
                        duration: 2000
                    });
            }
        }
        
        // Play achievement sound
        if (this.game.soundSystem) {
            const soundMap = {
                'legendary': 'celebration',
                'epic': 'starEarned',
                'rare': 'success',
                'uncommon': 'chime',
                'common': 'success'
            };
            
            this.game.soundSystem.playEffect(soundMap[achievement.rarity] || 'success');
        }
    }

    /**
     * Get achievement progress for dashboard
     */
    getProgressData() {
        return {
            earned: Array.from(this.earnedAchievements),
            totalPoints: this.totalPoints,
            progress: Object.fromEntries(this.progressData),
            categories: this.getCategoryProgress()
        };
    }

    /**
     * Get category progress
     */
    getCategoryProgress() {
        const categoryProgress = {};
        
        Object.keys(this.categories).forEach(category => {
            const categoryAchievements = Array.from(this.achievements.values())
                .filter(a => a.category === category);
            const earnedInCategory = categoryAchievements
                .filter(a => this.earnedAchievements.has(a.id));
            
            categoryProgress[category] = {
                total: categoryAchievements.length,
                earned: earnedInCategory.length,
                percentage: categoryAchievements.length > 0 ? 
                    Math.round((earnedInCategory.length / categoryAchievements.length) * 100) : 0
            };
        });
        
        return categoryProgress;
    }

    /**
     * Load achievement progress from save
     */
    loadProgress() {
        try {
            const saved = localStorage.getItem('enchantedLibrary_achievements');
            if (saved) {
                const data = JSON.parse(saved);
                this.earnedAchievements = new Set(data.earned || []);
                this.totalPoints = data.totalPoints || 0;
                this.progressData = new Map(Object.entries(data.progress || {}));
            }
        } catch (error) {
            console.warn('Failed to load achievement progress:', error);
        }
    }

    /**
     * Save achievement progress
     */
    saveProgress() {
        try {
            const data = {
                earned: Array.from(this.earnedAchievements),
                totalPoints: this.totalPoints,
                progress: Object.fromEntries(this.progressData)
            };
            localStorage.setItem('enchantedLibrary_achievements', JSON.stringify(data));
        } catch (error) {
            console.warn('Failed to save achievement progress:', error);
        }
    }

    /**
     * Utility functions for achievement conditions
     */
    getCurrentSaveData() {
        try {
            const saveKey = 'enchantedLibrary_save_0';
            const savedData = localStorage.getItem(saveKey);
            return savedData ? JSON.parse(savedData) : null;
        } catch (error) {
            return null;
        }
    }

    calculatePerfectStreak() {
        // Implementation depends on puzzle tracking
        return this.progressData.get('perfectStreak') || 0;
    }

    getPuzzlesSolvedWithoutHints() {
        // Implementation depends on detailed puzzle tracking
        return this.progressData.get('puzzlesSolvedWithoutHints') || 0;
    }

    getWiseHintUsage() {
        // Implementation depends on hint usage tracking
        return this.progressData.get('hintsUsedWisely') || 0;
    }

    getFastestPathTime() {
        // Implementation depends on time tracking
        return this.progressData.get('fastestPathTime') || null;
    }

    checkPerfectPathCompletion() {
        // Implementation depends on detailed scoring
        return this.progressData.get('perfectPathCompleted') || false;
    }

    checkGameCompletion() {
        const saveData = this.getCurrentSaveData();
        return saveData && saveData.gameProgress && 
               saveData.gameProgress.pathsCompleted && 
               saveData.gameProgress.pathsCompleted.length >= 3;
    }

    getSessionsPlayed() {
        // Implementation depends on session tracking
        return this.progressData.get('sessionsPlayed') || 0;
    }

    getUniqueDaysPlayed() {
        // Implementation depends on daily tracking
        return this.progressData.get('uniqueDaysPlayed') || 0;
    }

    getTotalScenesCount() {
        return window.STORY_SCENES ? Object.keys(window.STORY_SCENES).length : 20;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Listen for game events that might trigger achievements
        document.addEventListener('puzzleSolved', () => {
            setTimeout(() => this.checkAchievements(), 100);
        });
        
        document.addEventListener('sceneChanged', () => {
            setTimeout(() => this.checkAchievements(), 100);
        });
        
        document.addEventListener('pathCompleted', () => {
            setTimeout(() => this.checkAchievements(), 100);
        });
    }

    /**
     * Public methods for game integration
     */
    updateProgress(key, value) {
        this.progressData.set(key, value);
        this.checkAchievements();
    }

    incrementProgress(key, amount = 1) {
        const current = this.progressData.get(key) || 0;
        this.progressData.set(key, current + amount);
        this.checkAchievements();
    }

    /**
     * Clean up achievement system
     */
    destroy() {
        this.saveProgress();
        
        // Remove any active notifications
        document.querySelectorAll('.achievement-notification').forEach(el => el.remove());
        
        console.log('🏆 Achievement system destroyed');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AchievementSystem;
} else {
    window.AchievementSystem = AchievementSystem;
}
