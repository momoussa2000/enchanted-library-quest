/**
 * THE ENCHANTED LIBRARY QUEST - PARENT DASHBOARD
 * FableBox Educational Adventure Game
 * 
 * This file contains the comprehensive parent dashboard system that provides:
 * - Child's learning progress visualization
 * - Detailed gameplay statistics and analytics
 * - Educational insights and skill assessments
 * - Time management and session tracking
 * - Printable progress reports and certificates
 * - Learning recommendations and next steps
 * 
 * Dashboard Philosophy:
 * The parent dashboard empowers parents and educators with meaningful
 * insights into children's learning journey while maintaining the child's
 * sense of achievement and independence in their educational adventure.
 */

class ParentDashboard {
    constructor(gameEngine) {
        this.game = gameEngine;
        this.isVisible = false;
        this.currentView = 'overview';
        this.refreshInterval = null;
        
        // Dashboard sections
        this.sections = {
            overview: 'Learning Overview',
            progress: 'Story Progress', 
            skills: 'Educational Skills',
            time: 'Time & Sessions',
            achievements: 'Achievements',
            reports: 'Progress Reports'
        };
        
        // Chart instances for cleanup
        this.chartInstances = new Map();
        
        this.initialize();
    }

    /**
     * Initialize the parent dashboard
     */
    initialize() {
        this.createDashboardHTML();
        this.setupEventListeners();
        console.log('👨‍👩‍👧‍👦 Parent dashboard initialized');
    }

    /**
     * Create dashboard HTML structure
     */
    createDashboardHTML() {
        // Check if dashboard already exists
        if (document.getElementById('parent-dashboard')) return;

        const dashboardHTML = `
            <div id="parent-dashboard" class="parent-dashboard hidden">
                <div class="dashboard-overlay" onclick="parentDashboard.hide()"></div>
                <div class="dashboard-container">
                    <div class="dashboard-header">
                        <div class="dashboard-title">
                            <h2>📊 Parent Dashboard</h2>
                            <p class="player-info">Learning Progress for <span id="dashboard-player-name">Player</span></p>
                        </div>
                        <div class="dashboard-controls">
                            <button class="dashboard-btn refresh-btn" onclick="parentDashboard.refreshData()">
                                🔄 Refresh
                            </button>
                            <button class="dashboard-btn print-btn" onclick="parentDashboard.printReport()">
                                🖨️ Print Report
                            </button>
                            <button class="dashboard-btn close-btn" onclick="parentDashboard.hide()">
                                ✕ Close
                            </button>
                        </div>
                    </div>

                    <div class="dashboard-navigation">
                        ${Object.entries(this.sections).map(([key, title]) => `
                            <button class="nav-tab ${key === 'overview' ? 'active' : ''}" 
                                    data-section="${key}" onclick="parentDashboard.showSection('${key}')">
                                ${title}
                            </button>
                        `).join('')}
                    </div>

                    <div class="dashboard-content">
                        ${this.createOverviewSection()}
                        ${this.createProgressSection()}
                        ${this.createSkillsSection()}
                        ${this.createTimeSection()}
                        ${this.createAchievementsSection()}
                        ${this.createReportsSection()}
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', dashboardHTML);
    }

    /**
     * Create overview section
     */
    createOverviewSection() {
        return `
            <div class="dashboard-section overview-section active" data-section="overview">
                <div class="overview-cards">
                    <div class="stat-card primary">
                        <div class="stat-icon">🎯</div>
                        <div class="stat-content">
                            <div class="stat-label">Overall Progress</div>
                            <div class="stat-value" id="overall-progress">0%</div>
                            <div class="stat-subtext">Story completion</div>
                        </div>
                    </div>
                    
                    <div class="stat-card success">
                        <div class="stat-icon">🧩</div>
                        <div class="stat-content">
                            <div class="stat-label">Puzzles Solved</div>
                            <div class="stat-value" id="puzzles-solved">0</div>
                            <div class="stat-subtext">Out of <span id="puzzles-total">0</span> attempted</div>
                        </div>
                    </div>
                    
                    <div class="stat-card info">
                        <div class="stat-icon">⏱️</div>
                        <div class="stat-content">
                            <div class="stat-label">Time Played</div>
                            <div class="stat-value" id="time-played">0h 0m</div>
                            <div class="stat-subtext">Total learning time</div>
                        </div>
                    </div>
                    
                    <div class="stat-card warning">
                        <div class="stat-icon">🏆</div>
                        <div class="stat-content">
                            <div class="stat-label">Achievements</div>
                            <div class="stat-value" id="achievements-count">0</div>
                            <div class="stat-subtext">Badges earned</div>
                        </div>
                    </div>
                </div>

                <div class="overview-charts">
                    <div class="chart-container">
                        <h3>Learning Activity This Week</h3>
                        <canvas id="activity-chart" width="400" height="200"></canvas>
                    </div>
                    
                    <div class="chart-container">
                        <h3>Skill Development</h3>
                        <canvas id="skills-radar-chart" width="400" height="200"></canvas>
                    </div>
                </div>

                <div class="recent-activity">
                    <h3>Recent Learning Activity</h3>
                    <div id="recent-activities" class="activity-list">
                        <!-- Populated dynamically -->
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Create progress section
     */
    createProgressSection() {
        return `
            <div class="dashboard-section progress-section" data-section="progress">
                <div class="progress-overview">
                    <div class="story-map">
                        <h3>Story Adventure Map</h3>
                        <div id="story-progress-visual" class="story-visual">
                            <!-- Story path visualization -->
                        </div>
                    </div>
                    
                    <div class="progress-stats">
                        <div class="progress-item">
                            <div class="progress-label">Scenes Visited</div>
                            <div class="progress-bar">
                                <div class="progress-fill" id="scenes-progress"></div>
                            </div>
                            <div class="progress-text" id="scenes-text">0 / 0</div>
                        </div>
                        
                        <div class="progress-item">
                            <div class="progress-label">Adventure Paths</div>
                            <div class="path-badges" id="path-badges">
                                <!-- Path completion badges -->
                            </div>
                        </div>
                        
                        <div class="progress-item">
                            <div class="progress-label">Current Location</div>
                            <div class="current-scene" id="current-scene">
                                <!-- Current scene info -->
                            </div>
                        </div>
                    </div>
                </div>

                <div class="session-history">
                    <h3>Learning Sessions</h3>
                    <div id="session-timeline" class="timeline">
                        <!-- Session timeline -->
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Create skills section
     */
    createSkillsSection() {
        return `
            <div class="dashboard-section skills-section" data-section="skills">
                <div class="skill-categories">
                    <div class="skill-category math-skills">
                        <div class="skill-header">
                            <h3>🔢 Mathematics</h3>
                            <div class="skill-level" id="math-level">Level 1</div>
                        </div>
                        <div class="skill-stats">
                            <div class="skill-stat">
                                <span class="stat-label">Attempted:</span>
                                <span class="stat-value" id="math-attempted">0</span>
                            </div>
                            <div class="skill-stat">
                                <span class="stat-label">Correct:</span>
                                <span class="stat-value" id="math-correct">0</span>
                            </div>
                            <div class="skill-stat">
                                <span class="stat-label">Success Rate:</span>
                                <span class="stat-value" id="math-success-rate">0%</span>
                            </div>
                        </div>
                        <div class="skill-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" id="math-progress"></div>
                            </div>
                        </div>
                        <div class="skill-insights">
                            <h4>Strengths & Opportunities</h4>
                            <div id="math-insights" class="insights-list">
                                <!-- Math learning insights -->
                            </div>
                        </div>
                    </div>

                    <div class="skill-category language-skills">
                        <div class="skill-header">
                            <h3>📚 Language Arts</h3>
                            <div class="skill-level" id="language-level">Level 1</div>
                        </div>
                        <div class="skill-stats">
                            <div class="skill-stat">
                                <span class="stat-label">Attempted:</span>
                                <span class="stat-value" id="language-attempted">0</span>
                            </div>
                            <div class="skill-stat">
                                <span class="stat-label">Correct:</span>
                                <span class="stat-value" id="language-correct">0</span>
                            </div>
                            <div class="skill-stat">
                                <span class="stat-label">Success Rate:</span>
                                <span class="stat-value" id="language-success-rate">0%</span>
                            </div>
                        </div>
                        <div class="skill-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" id="language-progress"></div>
                            </div>
                        </div>
                        <div class="skill-insights">
                            <h4>Strengths & Opportunities</h4>
                            <div id="language-insights" class="insights-list">
                                <!-- Language learning insights -->
                            </div>
                        </div>
                    </div>

                    <div class="skill-category science-skills">
                        <div class="skill-header">
                            <h3>🔬 Science</h3>
                            <div class="skill-level" id="science-level">Level 1</div>
                        </div>
                        <div class="skill-stats">
                            <div class="skill-stat">
                                <span class="stat-label">Attempted:</span>
                                <span class="stat-value" id="science-attempted">0</span>
                            </div>
                            <div class="skill-stat">
                                <span class="stat-label">Correct:</span>
                                <span class="stat-value" id="science-correct">0</span>
                            </div>
                            <div class="skill-stat">
                                <span class="stat-label">Success Rate:</span>
                                <span class="stat-value" id="science-success-rate">0%</span>
                            </div>
                        </div>
                        <div class="skill-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" id="science-progress"></div>
                            </div>
                        </div>
                        <div class="skill-insights">
                            <h4>Strengths & Opportunities</h4>
                            <div id="science-insights" class="insights-list">
                                <!-- Science learning insights -->
                            </div>
                        </div>
                    </div>
                </div>

                <div class="learning-recommendations">
                    <h3>📝 Learning Recommendations</h3>
                    <div id="recommendations" class="recommendations-list">
                        <!-- Personalized learning suggestions -->
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Create time section
     */
    createTimeSection() {
        return `
            <div class="dashboard-section time-section" data-section="time">
                <div class="time-overview">
                    <div class="time-stats">
                        <div class="time-stat">
                            <div class="time-icon">📅</div>
                            <div class="time-content">
                                <div class="time-label">Today's Session</div>
                                <div class="time-value" id="today-time">0 minutes</div>
                            </div>
                        </div>
                        
                        <div class="time-stat">
                            <div class="time-icon">📊</div>
                            <div class="time-content">
                                <div class="time-label">This Week</div>
                                <div class="time-value" id="week-time">0h 0m</div>
                            </div>
                        </div>
                        
                        <div class="time-stat">
                            <div class="time-icon">🏆</div>
                            <div class="time-content">
                                <div class="time-label">Total Time</div>
                                <div class="time-value" id="total-time">0h 0m</div>
                            </div>
                        </div>
                        
                        <div class="time-stat">
                            <div class="time-icon">⚡</div>
                            <div class="time-content">
                                <div class="time-label">Avg Session</div>
                                <div class="time-value" id="avg-session">0 minutes</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="time-charts">
                    <div class="chart-container">
                        <h3>Daily Play Time (Last 7 Days)</h3>
                        <canvas id="daily-time-chart" width="600" height="300"></canvas>
                    </div>
                    
                    <div class="chart-container">
                        <h3>Activity Distribution</h3>
                        <canvas id="activity-pie-chart" width="400" height="300"></canvas>
                    </div>
                </div>

                <div class="time-goals">
                    <h3>⚡ Screen Time Goals</h3>
                    <div class="goal-setting">
                        <div class="goal-input">
                            <label for="daily-goal">Daily Goal (minutes):</label>
                            <input type="number" id="daily-goal" min="10" max="120" value="30">
                            <button onclick="parentDashboard.setDailyGoal()">Set Goal</button>
                        </div>
                        <div class="goal-progress">
                            <div class="goal-label">Today's Progress</div>
                            <div class="progress-bar goal-bar">
                                <div class="progress-fill" id="goal-progress"></div>
                            </div>
                            <div class="goal-text" id="goal-text">0 / 30 minutes</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Create achievements section
     */
    createAchievementsSection() {
        return `
            <div class="dashboard-section achievements-section" data-section="achievements">
                <div class="achievements-overview">
                    <div class="achievement-stats">
                        <div class="achievement-stat">
                            <div class="stat-number" id="total-achievements">0</div>
                            <div class="stat-label">Total Badges</div>
                        </div>
                        <div class="achievement-stat">
                            <div class="stat-number" id="achievement-points">0</div>
                            <div class="stat-label">Points Earned</div>
                        </div>
                        <div class="achievement-stat">
                            <div class="stat-number" id="recent-achievements">0</div>
                            <div class="stat-label">This Week</div>
                        </div>
                    </div>
                </div>

                <div class="achievements-grid">
                    <div class="achievement-category">
                        <h3>🏅 Learning Achievements</h3>
                        <div id="learning-achievements" class="achievement-list">
                            <!-- Learning achievement badges -->
                        </div>
                    </div>
                    
                    <div class="achievement-category">
                        <h3>⭐ Progress Achievements</h3>
                        <div id="progress-achievements" class="achievement-list">
                            <!-- Progress achievement badges -->
                        </div>
                    </div>
                    
                    <div class="achievement-category">
                        <h3>🎯 Special Achievements</h3>
                        <div id="special-achievements" class="achievement-list">
                            <!-- Special achievement badges -->
                        </div>
                    </div>
                </div>

                <div class="upcoming-achievements">
                    <h3>🎁 Almost There!</h3>
                    <div id="upcoming-achievements" class="upcoming-list">
                        <!-- Nearly achieved badges -->
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Create reports section
     */
    createReportsSection() {
        return `
            <div class="dashboard-section reports-section" data-section="reports">
                <div class="report-options">
                    <h3>📋 Generate Reports</h3>
                    <div class="report-buttons">
                        <button class="report-btn" onclick="parentDashboard.generateReport('summary')">
                            📊 Learning Summary
                        </button>
                        <button class="report-btn" onclick="parentDashboard.generateReport('detailed')">
                            📝 Detailed Progress
                        </button>
                        <button class="report-btn" onclick="parentDashboard.generateReport('certificate')">
                            🏆 Achievement Certificate
                        </button>
                        <button class="report-btn" onclick="parentDashboard.generateReport('export')">
                            💾 Export Data (CSV)
                        </button>
                    </div>
                </div>

                <div class="report-preview">
                    <h3>📄 Report Preview</h3>
                    <div id="report-content" class="report-display">
                        <p>Select a report type above to preview</p>
                    </div>
                </div>

                <div class="sharing-options">
                    <h3>📤 Share Progress</h3>
                    <div class="share-buttons">
                        <button class="share-btn" onclick="parentDashboard.shareViaEmail()">
                            📧 Email Report
                        </button>
                        <button class="share-btn" onclick="parentDashboard.shareProgress()">
                            🔗 Share Link
                        </button>
                        <button class="share-btn" onclick="parentDashboard.scheduleReport()">
                            📅 Schedule Weekly Reports
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Keyboard shortcut to open dashboard (Ctrl/Cmd + D)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'd' && e.shiftKey) {
                e.preventDefault();
                this.toggle();
            }
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });
    }

    /**
     * Show the dashboard
     */
    show() {
        const dashboard = document.getElementById('parent-dashboard');
        if (!dashboard) return;

        dashboard.classList.remove('hidden');
        this.isVisible = true;
        
        // Load current data
        this.refreshData();
        
        // Start auto-refresh
        this.startAutoRefresh();
        
        // Announce to screen reader
        const announcement = document.getElementById('sr-announcements');
        if (announcement) {
            announcement.textContent = 'Parent dashboard opened. Viewing learning progress and statistics.';
        }
    }

    /**
     * Hide the dashboard
     */
    hide() {
        const dashboard = document.getElementById('parent-dashboard');
        if (!dashboard) return;

        dashboard.classList.add('hidden');
        this.isVisible = false;
        
        // Stop auto-refresh
        this.stopAutoRefresh();
        
        // Clean up charts
        this.destroyCharts();
    }

    /**
     * Toggle dashboard visibility
     */
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    /**
     * Show specific section
     */
    showSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.section === sectionName);
        });

        // Update content
        document.querySelectorAll('.dashboard-section').forEach(section => {
            section.classList.toggle('active', section.dataset.section === sectionName);
        });

        this.currentView = sectionName;
        this.loadSectionData(sectionName);
    }

    /**
     * Load data for specific section
     */
    loadSectionData(sectionName) {
        switch (sectionName) {
            case 'overview':
                this.loadOverviewData();
                break;
            case 'progress':
                this.loadProgressData();
                break;
            case 'skills':
                this.loadSkillsData();
                break;
            case 'time':
                this.loadTimeData();
                break;
            case 'achievements':
                this.loadAchievementsData();
                break;
            case 'reports':
                this.loadReportsData();
                break;
        }
    }

    /**
     * Refresh all dashboard data
     */
    refreshData() {
        const saveData = this.getCurrentSaveData();
        if (!saveData) return;

        // Update player name
        const playerNameEl = document.getElementById('dashboard-player-name');
        if (playerNameEl) {
            playerNameEl.textContent = saveData.playerData.name || 'Player';
        }

        // Load current section data
        this.loadSectionData(this.currentView);
    }

    /**
     * Get current save data
     */
    getCurrentSaveData() {
        if (!this.game.saveSystem) return null;
        
        try {
            const saveKey = 'enchantedLibrary_save_0'; // Auto-save slot
            const savedData = localStorage.getItem(saveKey);
            if (!savedData) return null;
            
            return JSON.parse(savedData);
        } catch (error) {
            console.error('Failed to load save data for dashboard:', error);
            return null;
        }
    }

    /**
     * Load overview data
     */
    loadOverviewData() {
        const saveData = this.getCurrentSaveData();
        if (!saveData) return;

        // Update overview cards
        this.updateElement('overall-progress', `${Math.round(saveData.gameProgress.completionPercentage || 0)}%`);
        this.updateElement('puzzles-solved', saveData.puzzleProgress.puzzlesSolved);
        this.updateElement('puzzles-total', saveData.puzzleProgress.totalPuzzles);
        this.updateElement('time-played', this.formatPlayTime(saveData.gameProgress.totalPlayTime));
        this.updateElement('achievements-count', saveData.achievements.earned.length);

        // Load activity chart
        this.loadActivityChart();
        
        // Load skills radar chart
        this.loadSkillsRadarChart();
        
        // Load recent activities
        this.loadRecentActivities();
    }

    /**
     * Load progress data
     */
    loadProgressData() {
        const saveData = this.getCurrentSaveData();
        if (!saveData) return;

        // Update story progress visualization
        this.loadStoryProgressVisual();
        
        // Update progress bars
        this.updateProgressBars(saveData);
        
        // Load session timeline
        this.loadSessionTimeline();
    }

    /**
     * Load skills data
     */
    loadSkillsData() {
        const saveData = this.getCurrentSaveData();
        if (!saveData) return;

        const skills = ['math', 'language', 'science'];
        
        skills.forEach(skill => {
            const skillData = saveData.puzzleProgress.skillLevels[skill];
            
            this.updateElement(`${skill}-level`, `Level ${skillData.level}`);
            this.updateElement(`${skill}-attempted`, skillData.attempted);
            this.updateElement(`${skill}-correct`, skillData.correct);
            
            const successRate = skillData.attempted > 0 ? 
                Math.round((skillData.correct / skillData.attempted) * 100) : 0;
            this.updateElement(`${skill}-success-rate`, `${successRate}%`);
            
            // Update progress bar
            const progressEl = document.getElementById(`${skill}-progress`);
            if (progressEl) {
                progressEl.style.width = `${Math.min(100, skillData.level * 10)}%`;
            }
            
            // Load insights
            this.loadSkillInsights(skill, skillData);
        });
        
        // Load learning recommendations
        this.loadLearningRecommendations();
    }

    /**
     * Load time data
     */
    loadTimeData() {
        const saveData = this.getCurrentSaveData();
        if (!saveData) return;

        // Calculate time statistics
        const todayTime = this.calculateTodayTime();
        const weekTime = this.calculateWeekTime();
        const totalTime = saveData.gameProgress.totalPlayTime;
        const avgSession = this.calculateAverageSession();

        this.updateElement('today-time', `${Math.round(todayTime / 60000)} minutes`);
        this.updateElement('week-time', this.formatPlayTime(weekTime));
        this.updateElement('total-time', this.formatPlayTime(totalTime));
        this.updateElement('avg-session', `${Math.round(avgSession / 60000)} minutes`);

        // Load time charts
        this.loadDailyTimeChart();
        this.loadActivityPieChart();
        
        // Update goal progress
        this.updateGoalProgress();
    }

    /**
     * Utility functions
     */
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    formatPlayTime(milliseconds) {
        const hours = Math.floor(milliseconds / 3600000);
        const minutes = Math.floor((milliseconds % 3600000) / 60000);
        return `${hours}h ${minutes}m`;
    }

    startAutoRefresh() {
        this.stopAutoRefresh();
        this.refreshInterval = setInterval(() => {
            this.refreshData();
        }, 30000); // Refresh every 30 seconds
    }

    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    destroyCharts() {
        this.chartInstances.forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.chartInstances.clear();
    }

    /**
     * Report generation
     */
    generateReport(type) {
        console.log(`Generating ${type} report...`);
        // Implementation depends on chosen reporting library
    }

    printReport() {
        window.print();
    }

    /**
     * Clean up dashboard
     */
    destroy() {
        this.hide();
        this.stopAutoRefresh();
        
        const dashboard = document.getElementById('parent-dashboard');
        if (dashboard) {
            dashboard.remove();
        }
        
        console.log('👨‍👩‍👧‍👦 Parent dashboard destroyed');
    }
}

// Make dashboard globally accessible
window.parentDashboard = null;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParentDashboard;
} else {
    window.ParentDashboard = ParentDashboard;
}
