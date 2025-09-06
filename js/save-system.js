/**
 * THE ENCHANTED LIBRARY QUEST - SAVE SYSTEM
 * FableBox Educational Adventure Game
 * 
 * This file contains the comprehensive save/load system that handles:
 * - Auto-save functionality after each scene
 * - Multiple save slots for different players
 * - Cloud save preparation and API structure
 * - Progress export for parents and educators
 * - Data validation and corruption recovery
 * - Cross-device synchronization support
 * 
 * Save System Philosophy:
 * The save system ensures no progress is ever lost while providing
 * flexibility for multiple users and detailed progress tracking for
 * parents and educators to monitor learning progress.
 */

class SaveSystem {
    constructor(gameEngine) {
        this.game = gameEngine;
        this.maxSaveSlots = 5;
        this.autoSaveEnabled = true;
        this.cloudSaveEnabled = false;
        this.compressionEnabled = true;
        
        // Save data structure
        this.saveStructure = {
            metadata: {
                version: '1.0.0',
                created: null,
                lastModified: null,
                deviceId: null,
                gameVersion: '1.0.0'
            },
            playerData: {
                name: '',
                age: 7,
                character: null,
                avatar: null,
                preferences: {}
            },
            gameProgress: {
                currentScene: 'start',
                currentPath: null,
                scenesVisited: [],
                pathsCompleted: [],
                totalPlayTime: 0,
                sessionStartTime: null
            },
            puzzleProgress: {
                totalPuzzles: 0,
                puzzlesSolved: 0,
                hintsUsed: 0,
                averageTime: 0,
                skillLevels: {
                    math: { attempted: 0, correct: 0, level: 1 },
                    language: { attempted: 0, correct: 0, level: 1 },
                    science: { attempted: 0, correct: 0, level: 1 }
                },
                detailedStats: []
            },
            achievements: {
                earned: [],
                progress: {},
                totalPoints: 0
            },
            settings: {
                audio: {},
                accessibility: {},
                difficulty: 'medium'
            }
        };
        
        // Cloud save API configuration
        this.cloudConfig = {
            endpoint: 'https://api.fablebox.com/saves',
            apiKey: process.env.FABLEBOX_API_KEY || null,
            timeout: 10000,
            retries: 3
        };
        
        this.initialize();
    }

    /**
     * Initialize the save system
     */
    initialize() {
        // Generate or retrieve device ID
        this.deviceId = this.getOrCreateDeviceId();
        
        // Set up auto-save intervals
        this.setupAutoSave();
        
        // Set up beforeunload handler
        this.setupUnloadHandler();
        
        // Initialize cloud save if available
        this.initializeCloudSave();
        
        console.log('💾 Save system initialized');
    }

    /**
     * Get or create unique device ID
     */
    getOrCreateDeviceId() {
        let deviceId = localStorage.getItem('enchantedLibrary_deviceId');
        if (!deviceId) {
            deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('enchantedLibrary_deviceId', deviceId);
        }
        return deviceId;
    }

    /**
     * Set up auto-save functionality
     */
    setupAutoSave() {
        if (!this.autoSaveEnabled) return;
        
        // Auto-save every 30 seconds
        this.autoSaveInterval = setInterval(() => {
            this.autoSave();
        }, 30000);
        
        // Auto-save on scene changes
        if (this.game.sceneManager) {
            const originalLoadScene = this.game.sceneManager.loadScene.bind(this.game.sceneManager);
            this.game.sceneManager.loadScene = (sceneId) => {
                const result = originalLoadScene(sceneId);
                this.autoSave();
                return result;
            };
        }
    }

    /**
     * Set up unload handler for final save
     */
    setupUnloadHandler() {
        window.addEventListener('beforeunload', () => {
            this.saveGame(0, true); // Quick save to slot 0
        });
        
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.autoSave();
            }
        });
    }

    /**
     * Initialize cloud save functionality
     */
    async initializeCloudSave() {
        if (!this.cloudConfig.apiKey) {
            console.log('🌐 Cloud save not configured (no API key)');
            return;
        }
        
        try {
            // Test cloud save connectivity
            const response = await fetch(`${this.cloudConfig.endpoint}/health`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.cloudConfig.apiKey}`,
                    'Content-Type': 'application/json'
                },
                signal: AbortSignal.timeout(this.cloudConfig.timeout)
            });
            
            if (response.ok) {
                this.cloudSaveEnabled = true;
                console.log('🌐 Cloud save enabled');
                
                // Attempt to sync existing saves
                this.syncCloudSaves();
            }
        } catch (error) {
            console.warn('🌐 Cloud save unavailable:', error.message);
        }
    }

    /**
     * Create a save data object
     */
    createSaveData() {
        const saveData = JSON.parse(JSON.stringify(this.saveStructure));
        
        // Update metadata
        saveData.metadata.created = saveData.metadata.created || Date.now();
        saveData.metadata.lastModified = Date.now();
        saveData.metadata.deviceId = this.deviceId;
        
        // Update player data
        if (this.game.gameState && this.game.gameState.player) {
            Object.assign(saveData.playerData, this.game.gameState.player);
        }
        
        // Update game progress
        if (this.game.gameState) {
            Object.assign(saveData.gameProgress, {
                currentScene: this.game.gameState.currentScene || 'start',
                currentPath: this.game.gameState.currentPath || null,
                scenesVisited: this.game.gameState.scenesVisited || [],
                pathsCompleted: this.game.gameState.pathsCompleted || [],
                totalPlayTime: this.calculateTotalPlayTime(),
                sessionStartTime: this.game.gameState.sessionStartTime || Date.now()
            });
        }
        
        // Update puzzle progress
        if (this.game.puzzleSystem) {
            const analytics = this.game.puzzleSystem.learningAnalytics;
            saveData.puzzleProgress = {
                totalPuzzles: analytics.mathSkills.attempted + analytics.languageSkills.attempted + analytics.scienceSkills.attempted,
                puzzlesSolved: analytics.mathSkills.correct + analytics.languageSkills.correct + analytics.scienceSkills.correct,
                hintsUsed: analytics.totalHintsUsed || 0,
                averageTime: this.calculateAverageTime(analytics),
                skillLevels: {
                    math: this.calculateSkillLevel(analytics.mathSkills),
                    language: this.calculateSkillLevel(analytics.languageSkills),
                    science: this.calculateSkillLevel(analytics.scienceSkills)
                },
                detailedStats: analytics.learningPatterns || []
            };
        }
        
        // Update achievements
        if (this.game.achievementSystem) {
            saveData.achievements = this.game.achievementSystem.getProgressData();
        }
        
        // Update settings
        saveData.settings = {
            audio: this.game.soundSystem ? this.game.soundSystem.getSettings() : {},
            accessibility: this.game.accessibilitySettings || {},
            difficulty: this.game.gameState ? this.game.gameState.difficulty : 'medium'
        };
        
        return saveData;
    }

    /**
     * Save game to specified slot
     */
    async saveGame(slotId = 0, isAutoSave = false) {
        try {
            const saveData = this.createSaveData();
            const saveKey = `enchantedLibrary_save_${slotId}`;
            
            // Compress save data if enabled
            const dataToSave = this.compressionEnabled ? 
                this.compressSaveData(saveData) : saveData;
            
            // Save locally
            localStorage.setItem(saveKey, JSON.stringify(dataToSave));
            
            // Update save metadata
            const metadata = {
                slotId: slotId,
                playerName: saveData.playerData.name || 'Unnamed Player',
                lastModified: saveData.metadata.lastModified,
                progress: this.calculateProgressPercentage(saveData),
                playTime: saveData.gameProgress.totalPlayTime,
                isAutoSave: isAutoSave
            };
            
            this.updateSaveMetadata(slotId, metadata);
            
            // Cloud save if enabled
            if (this.cloudSaveEnabled && !isAutoSave) {
                await this.saveToCloud(slotId, saveData);
            }
            
            if (!isAutoSave) {
                console.log(`💾 Game saved to slot ${slotId}`);
                this.game.showNotification(`Game saved successfully! 💾`, 'success');
            }
            
            return true;
            
        } catch (error) {
            console.error('Save failed:', error);
            this.game.showNotification('Save failed. Please try again.', 'error');
            return false;
        }
    }

    /**
     * Load game from specified slot
     */
    async loadGame(slotId = 0) {
        try {
            const saveKey = `enchantedLibrary_save_${slotId}`;
            const savedData = localStorage.getItem(saveKey);
            
            if (!savedData) {
                throw new Error(`No save data found in slot ${slotId}`);
            }
            
            let saveData = JSON.parse(savedData);
            
            // Decompress if needed
            if (this.compressionEnabled && saveData.compressed) {
                saveData = this.decompressSaveData(saveData);
            }
            
            // Validate save data
            if (!this.validateSaveData(saveData)) {
                throw new Error('Save data is corrupted or invalid');
            }
            
            // Apply save data to game
            await this.applySaveData(saveData);
            
            console.log(`💾 Game loaded from slot ${slotId}`);
            this.game.showNotification(`Game loaded successfully! 🎮`, 'success');
            
            return true;
            
        } catch (error) {
            console.error('Load failed:', error);
            this.game.showNotification('Load failed. Save data may be corrupted.', 'error');
            return false;
        }
    }

    /**
     * Apply loaded save data to game state
     */
    async applySaveData(saveData) {
        // Restore player data
        if (this.game.gameState) {
            Object.assign(this.game.gameState.player, saveData.playerData);
            Object.assign(this.game.gameState, saveData.gameProgress);
        }
        
        // Restore puzzle progress
        if (this.game.puzzleSystem) {
            this.game.puzzleSystem.learningAnalytics = this.reconstructAnalytics(saveData.puzzleProgress);
        }
        
        // Restore achievements
        if (this.game.achievementSystem) {
            this.game.achievementSystem.loadProgressData(saveData.achievements);
        }
        
        // Restore settings
        if (this.game.soundSystem && saveData.settings.audio) {
            Object.assign(this.game.soundSystem.settings, saveData.settings.audio);
        }
        
        // Navigate to saved scene
        if (this.game.sceneManager && saveData.gameProgress.currentScene) {
            this.game.sceneManager.loadScene(saveData.gameProgress.currentScene);
        }
    }

    /**
     * Auto-save current progress
     */
    autoSave() {
        if (!this.autoSaveEnabled) return;
        
        // Use slot 0 for auto-saves
        this.saveGame(0, true);
    }

    /**
     * Get list of available saves
     */
    getSaveList() {
        const saves = [];
        
        for (let i = 0; i < this.maxSaveSlots; i++) {
            const metadata = this.getSaveMetadata(i);
            if (metadata) {
                saves.push(metadata);
            } else {
                saves.push({
                    slotId: i,
                    empty: true,
                    playerName: 'Empty Slot',
                    lastModified: null,
                    progress: 0,
                    playTime: 0
                });
            }
        }
        
        return saves;
    }

    /**
     * Delete save from slot
     */
    deleteSave(slotId) {
        const saveKey = `enchantedLibrary_save_${slotId}`;
        const metadataKey = `enchantedLibrary_metadata_${slotId}`;
        
        localStorage.removeItem(saveKey);
        localStorage.removeItem(metadataKey);
        
        // Delete from cloud if enabled
        if (this.cloudSaveEnabled) {
            this.deleteFromCloud(slotId);
        }
        
        console.log(`💾 Save slot ${slotId} deleted`);
    }

    /**
     * Export save data for parents/educators
     */
    exportProgressReport(slotId = 0, format = 'json') {
        try {
            const saveKey = `enchantedLibrary_save_${slotId}`;
            const savedData = localStorage.getItem(saveKey);
            
            if (!savedData) {
                throw new Error('No save data found');
            }
            
            let saveData = JSON.parse(savedData);
            if (this.compressionEnabled && saveData.compressed) {
                saveData = this.decompressSaveData(saveData);
            }
            
            const report = this.generateProgressReport(saveData);
            
            switch (format) {
                case 'json':
                    return JSON.stringify(report, null, 2);
                    
                case 'csv':
                    return this.convertToCSV(report);
                    
                case 'html':
                    return this.generateHTMLReport(report);
                    
                default:
                    return report;
            }
            
        } catch (error) {
            console.error('Export failed:', error);
            return null;
        }
    }

    /**
     * Generate detailed progress report
     */
    generateProgressReport(saveData) {
        return {
            playerInfo: {
                name: saveData.playerData.name,
                age: saveData.playerData.age,
                character: saveData.playerData.character,
                totalPlayTime: this.formatPlayTime(saveData.gameProgress.totalPlayTime),
                lastPlayed: new Date(saveData.metadata.lastModified).toLocaleDateString()
            },
            
            gameProgress: {
                currentScene: saveData.gameProgress.currentScene,
                pathsCompleted: saveData.gameProgress.pathsCompleted.length,
                totalScenes: saveData.gameProgress.scenesVisited.length,
                completionPercentage: this.calculateProgressPercentage(saveData)
            },
            
            educationalProgress: {
                totalPuzzlesSolved: saveData.puzzleProgress.puzzlesSolved,
                totalPuzzlesAttempted: saveData.puzzleProgress.totalPuzzles,
                successRate: saveData.puzzleProgress.totalPuzzles > 0 ? 
                    (saveData.puzzleProgress.puzzlesSolved / saveData.puzzleProgress.totalPuzzles * 100).toFixed(1) + '%' : '0%',
                averageTime: this.formatTime(saveData.puzzleProgress.averageTime),
                hintsUsed: saveData.puzzleProgress.hintsUsed,
                
                skillBreakdown: {
                    math: {
                        level: saveData.puzzleProgress.skillLevels.math.level,
                        attempted: saveData.puzzleProgress.skillLevels.math.attempted,
                        correct: saveData.puzzleProgress.skillLevels.math.correct,
                        successRate: saveData.puzzleProgress.skillLevels.math.attempted > 0 ?
                            (saveData.puzzleProgress.skillLevels.math.correct / saveData.puzzleProgress.skillLevels.math.attempted * 100).toFixed(1) + '%' : '0%'
                    },
                    language: {
                        level: saveData.puzzleProgress.skillLevels.language.level,
                        attempted: saveData.puzzleProgress.skillLevels.language.attempted,
                        correct: saveData.puzzleProgress.skillLevels.language.correct,
                        successRate: saveData.puzzleProgress.skillLevels.language.attempted > 0 ?
                            (saveData.puzzleProgress.skillLevels.language.correct / saveData.puzzleProgress.skillLevels.language.attempted * 100).toFixed(1) + '%' : '0%'
                    },
                    science: {
                        level: saveData.puzzleProgress.skillLevels.science.level,
                        attempted: saveData.puzzleProgress.skillLevels.science.attempted,
                        correct: saveData.puzzleProgress.skillLevels.science.correct,
                        successRate: saveData.puzzleProgress.skillLevels.science.attempted > 0 ?
                            (saveData.puzzleProgress.skillLevels.science.correct / saveData.puzzleProgress.skillLevels.science.attempted * 100).toFixed(1) + '%' : '0%'
                    }
                }
            },
            
            achievements: {
                total: saveData.achievements.earned.length,
                points: saveData.achievements.totalPoints,
                recent: saveData.achievements.earned.slice(-5) // Last 5 achievements
            },
            
            detailedStats: saveData.puzzleProgress.detailedStats.map(stat => ({
                timestamp: new Date(stat.timestamp).toLocaleDateString(),
                puzzleType: stat.puzzleType,
                subtype: stat.subtype,
                difficulty: stat.difficulty,
                correct: stat.isCorrect,
                attempts: stat.attempts,
                hintsUsed: stat.hintsUsed
            }))
        };
    }

    /**
     * Cloud save operations
     */
    async saveToCloud(slotId, saveData) {
        if (!this.cloudSaveEnabled) return;
        
        try {
            const response = await fetch(`${this.cloudConfig.endpoint}/save`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.cloudConfig.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    deviceId: this.deviceId,
                    slotId: slotId,
                    saveData: saveData,
                    timestamp: Date.now()
                }),
                signal: AbortSignal.timeout(this.cloudConfig.timeout)
            });
            
            if (!response.ok) {
                throw new Error(`Cloud save failed: ${response.status}`);
            }
            
            console.log('☁️ Save uploaded to cloud');
            
        } catch (error) {
            console.warn('Cloud save failed:', error);
        }
    }

    async loadFromCloud(slotId) {
        if (!this.cloudSaveEnabled) return null;
        
        try {
            const response = await fetch(`${this.cloudConfig.endpoint}/load`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.cloudConfig.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    deviceId: this.deviceId,
                    slotId: slotId
                }),
                signal: AbortSignal.timeout(this.cloudConfig.timeout)
            });
            
            if (!response.ok) {
                throw new Error(`Cloud load failed: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('☁️ Save downloaded from cloud');
            
            return data.saveData;
            
        } catch (error) {
            console.warn('Cloud load failed:', error);
            return null;
        }
    }

    async syncCloudSaves() {
        if (!this.cloudSaveEnabled) return;
        
        try {
            // Get cloud save list
            const response = await fetch(`${this.cloudConfig.endpoint}/list`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.cloudConfig.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    deviceId: this.deviceId
                }),
                signal: AbortSignal.timeout(this.cloudConfig.timeout)
            });
            
            if (!response.ok) return;
            
            const cloudSaves = await response.json();
            
            // Sync newer saves from cloud
            for (const cloudSave of cloudSaves.saves) {
                const localMetadata = this.getSaveMetadata(cloudSave.slotId);
                
                if (!localMetadata || cloudSave.timestamp > localMetadata.lastModified) {
                    const cloudData = await this.loadFromCloud(cloudSave.slotId);
                    if (cloudData) {
                        const saveKey = `enchantedLibrary_save_${cloudSave.slotId}`;
                        localStorage.setItem(saveKey, JSON.stringify(cloudData));
                        console.log(`☁️ Synced save slot ${cloudSave.slotId} from cloud`);
                    }
                }
            }
            
        } catch (error) {
            console.warn('Cloud sync failed:', error);
        }
    }

    /**
     * Utility functions
     */
    calculateTotalPlayTime() {
        if (!this.game.gameState || !this.game.gameState.sessionStartTime) {
            return 0;
        }
        
        const sessionTime = Date.now() - this.game.gameState.sessionStartTime;
        const previousTime = this.game.gameState.totalPlayTime || 0;
        
        return previousTime + sessionTime;
    }

    calculateProgressPercentage(saveData) {
        const totalScenes = Object.keys(window.STORY_SCENES || {}).length || 20;
        const visitedScenes = saveData.gameProgress.scenesVisited.length;
        return Math.min(100, (visitedScenes / totalScenes * 100));
    }

    calculateSkillLevel(skillData) {
        if (skillData.attempted === 0) return 1;
        
        const successRate = skillData.correct / skillData.attempted;
        const baseLevel = Math.floor(skillData.attempted / 10) + 1;
        const bonusLevel = successRate > 0.8 ? 1 : 0;
        
        return Math.min(10, baseLevel + bonusLevel);
    }

    calculateAverageTime(analytics) {
        const patterns = analytics.learningPatterns || [];
        if (patterns.length === 0) return 0;
        
        const totalTime = patterns.reduce((sum, pattern) => sum + (pattern.timeSpent || 0), 0);
        return totalTime / patterns.length;
    }

    validateSaveData(saveData) {
        // Basic structure validation
        const requiredFields = ['metadata', 'playerData', 'gameProgress', 'puzzleProgress'];
        return requiredFields.every(field => saveData.hasOwnProperty(field));
    }

    compressSaveData(saveData) {
        // Simple compression (in production, use proper compression library)
        return {
            compressed: true,
            data: JSON.stringify(saveData)
        };
    }

    decompressSaveData(compressedData) {
        return JSON.parse(compressedData.data);
    }

    formatPlayTime(milliseconds) {
        const hours = Math.floor(milliseconds / 3600000);
        const minutes = Math.floor((milliseconds % 3600000) / 60000);
        return `${hours}h ${minutes}m`;
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    updateSaveMetadata(slotId, metadata) {
        const metadataKey = `enchantedLibrary_metadata_${slotId}`;
        localStorage.setItem(metadataKey, JSON.stringify(metadata));
    }

    getSaveMetadata(slotId) {
        const metadataKey = `enchantedLibrary_metadata_${slotId}`;
        const metadata = localStorage.getItem(metadataKey);
        return metadata ? JSON.parse(metadata) : null;
    }

    /**
     * Clean up save system
     */
    destroy() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
        
        // Final auto-save
        this.autoSave();
        
        console.log('💾 Save system destroyed');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SaveSystem;
} else {
    window.SaveSystem = SaveSystem;
}
