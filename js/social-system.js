/**
 * THE ENCHANTED LIBRARY QUEST - SOCIAL SYSTEM
 * FableBox Educational Adventure Game
 * 
 * This file contains the social features system that handles:
 * - Certificate sharing on social media platforms
 * - Friend invitation system with referral bonuses
 * - Leaderboards for puzzle completion times and achievements
 * - Family account management with multiple children
 * - Viral growth mechanics and social proof features
 * 
 * Social Philosophy:
 * Creates meaningful connections around learning achievements while
 * maintaining child safety and privacy protection as top priorities.
 */

class SocialSystem {
    constructor(gameEngine) {
        this.game = gameEngine;
        
        // Social features configuration
        this.config = {
            maxFriends: 50,
            maxFamilyMembers: 4,
            leaderboardLimit: 100,
            shareImageDimensions: { width: 800, height: 600 },
            inviteRewards: {
                inviter: { type: 'premium_days', value: 3 },
                invitee: { type: 'bonus_paths', value: 2 }
            }
        };
        
        // User social state
        this.socialState = {
            userId: this.generateUserId(),
            displayName: '',
            friends: [],
            pendingInvites: [],
            familyAccount: null,
            inviteCode: this.generateInviteCode(),
            invitedBy: null,
            shareHistory: [],
            privacySettings: {
                allowFriendRequests: true,
                showOnLeaderboard: true,
                allowCertificateSharing: true,
                parentalControlsEnabled: true
            }
        };
        
        // Leaderboard data
        this.leaderboards = {
            puzzleSpeed: {
                name: 'Fastest Puzzle Solvers',
                entries: [],
                timeframe: 'weekly',
                category: 'speed'
            },
            achievements: {
                name: 'Achievement Champions',
                entries: [],
                timeframe: 'monthly',
                category: 'achievements'
            },
            paths: {
                name: 'Adventure Explorers',
                entries: [],
                timeframe: 'all_time',
                category: 'completion'
            }
        };
        
        // Family account structure
        this.familyAccountTemplate = {
            id: null,
            parentEmail: '',
            parentName: '',
            children: [],
            sharedProgress: {
                totalAchievements: 0,
                totalPlayTime: 0,
                favoriteCharacters: [],
                completedStories: []
            },
            settings: {
                allowSocialFeatures: true,
                shareProgressWithEducators: false,
                receiveProgressEmails: true,
                childSafetyMode: true
            }
        };
        
        // Social media platforms
        this.socialPlatforms = {
            facebook: {
                name: 'Facebook',
                icon: '📘',
                shareUrl: 'https://www.facebook.com/sharer/sharer.php',
                enabled: true
            },
            twitter: {
                name: 'Twitter',
                icon: '🐦',
                shareUrl: 'https://twitter.com/intent/tweet',
                enabled: true
            },
            instagram: {
                name: 'Instagram',
                icon: '📷',
                shareUrl: null, // Stories API
                enabled: true
            },
            pinterest: {
                name: 'Pinterest',
                icon: '📌',
                shareUrl: 'https://pinterest.com/pin/create/button/',
                enabled: true
            },
            linkedin: {
                name: 'LinkedIn',
                icon: '💼',
                shareUrl: 'https://www.linkedin.com/sharing/share-offsite/',
                enabled: true
            }
        };
        
        this.initialize();
    }

    /**
     * Initialize social system
     */
    initialize() {
        this.loadSocialState();
        this.initializeLeaderboards();
        this.setupSocialEventListeners();
        this.checkForInviteCode();
        
        console.log('👥 Social system initialized');
    }

    /**
     * Load social state from storage
     */
    loadSocialState() {
        try {
            const saved = localStorage.getItem('enchantedLibrary_social');
            if (saved) {
                const data = JSON.parse(saved);
                this.socialState = { ...this.socialState, ...data };
            }
        } catch (error) {
            console.warn('Failed to load social state:', error);
        }
    }

    /**
     * Save social state
     */
    saveSocialState() {
        try {
            localStorage.setItem('enchantedLibrary_social', JSON.stringify(this.socialState));
        } catch (error) {
            console.warn('Failed to save social state:', error);
        }
    }

    /**
     * Generate certificate for sharing
     */
    async generateCertificate(playerName, achievements, completionData) {
        const certificate = {
            id: 'cert_' + Date.now(),
            playerName: playerName,
            date: new Date().toLocaleDateString(),
            achievements: achievements,
            stats: {
                pathsCompleted: completionData.pathsCompleted || 0,
                puzzlesSolved: completionData.puzzlesSolved || 0,
                totalTime: completionData.totalTime || 0,
                favoriteCharacter: completionData.favoriteCharacter || 'Ruby the Dragon'
            },
            design: 'enchanted_library',
            shareableImageUrl: null
        };
        
        // Generate shareable image
        certificate.shareableImageUrl = await this.createCertificateImage(certificate);
        
        return certificate;
    }

    /**
     * Create certificate image for sharing
     */
    async createCertificateImage(certificate) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        canvas.width = this.config.shareImageDimensions.width;
        canvas.height = this.config.shareImageDimensions.height;
        
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#8B5CF6');
        gradient.addColorStop(0.5, '#60A5FA');
        gradient.addColorStop(1, '#34D399');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add decorative border
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 8;
        ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
        
        // Add title
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🏆 Achievement Certificate', canvas.width / 2, 100);
        
        // Add player name
        ctx.font = 'bold 36px Arial';
        ctx.fillText(`Congratulations ${certificate.playerName}!`, canvas.width / 2, 180);
        
        // Add achievements
        ctx.font = '24px Arial';
        ctx.fillText('🌟 Library Quest Completed', canvas.width / 2, 240);
        
        // Add stats
        ctx.font = '20px Arial';
        ctx.textAlign = 'left';
        const statsY = 300;
        ctx.fillText(`📚 Paths Completed: ${certificate.stats.pathsCompleted}`, 100, statsY);
        ctx.fillText(`🧩 Puzzles Solved: ${certificate.stats.puzzlesSolved}`, 100, statsY + 40);
        ctx.fillText(`⏱️ Total Time: ${this.formatPlayTime(certificate.stats.totalTime)}`, 100, statsY + 80);
        ctx.fillText(`❤️ Favorite Character: ${certificate.stats.favoriteCharacter}`, 100, statsY + 120);
        
        // Add date and branding
        ctx.textAlign = 'center';
        ctx.font = '18px Arial';
        ctx.fillText(`Earned on ${certificate.date}`, canvas.width / 2, 500);
        ctx.fillText('🎮 The Enchanted Library Quest by FableBox', canvas.width / 2, 540);
        
        // Convert to data URL
        return canvas.toDataURL('image/png', 0.9);
    }

    /**
     * Share certificate on social media
     */
    shareCertificate(certificate, platform) {
        const shareData = this.prepareCertificateShareData(certificate);
        
        switch (platform) {
            case 'facebook':
                this.shareToFacebook(shareData);
                break;
            case 'twitter':
                this.shareToTwitter(shareData);
                break;
            case 'instagram':
                this.shareToInstagram(shareData);
                break;
            case 'pinterest':
                this.shareToPinterest(shareData);
                break;
            case 'linkedin':
                this.shareToLinkedIn(shareData);
                break;
            case 'native':
                this.shareNative(shareData);
                break;
            default:
                console.warn('Unsupported sharing platform:', platform);
        }
        
        // Track share
        this.trackShare(certificate, platform);
    }

    /**
     * Prepare certificate share data
     */
    prepareCertificateShareData(certificate) {
        return {
            title: `🏆 ${certificate.playerName} completed The Enchanted Library Quest!`,
            description: `Amazing achievement! ${certificate.stats.puzzlesSolved} puzzles solved across ${certificate.stats.pathsCompleted} adventure paths. Join the magical learning journey at FableBox!`,
            url: 'https://fablebox.com/games/enchanted-library',
            image: certificate.shareableImageUrl,
            hashtags: ['FableBox', 'EnchantedLibrary', 'LearningGames', 'EducationalGames', 'KidsLearning']
        };
    }

    /**
     * Share to Facebook
     */
    shareToFacebook(shareData) {
        const params = new URLSearchParams({
            u: shareData.url,
            quote: `${shareData.title}\n\n${shareData.description}`
        });
        
        window.open(`${this.socialPlatforms.facebook.shareUrl}?${params}`, '_blank', 'width=600,height=400');
    }

    /**
     * Share to Twitter
     */
    shareToTwitter(shareData) {
        const params = new URLSearchParams({
            text: `${shareData.title}\n\n${shareData.description}`,
            url: shareData.url,
            hashtags: shareData.hashtags.join(',')
        });
        
        window.open(`${this.socialPlatforms.twitter.shareUrl}?${params}`, '_blank', 'width=600,height=400');
    }

    /**
     * Share to Instagram (download prompt)
     */
    shareToInstagram(shareData) {
        // Instagram doesn't support direct URL sharing, so we provide the image for download
        this.downloadCertificateImage(shareData.image, 'enchanted-library-certificate.png');
        
        this.game.showNotification('📷 Certificate downloaded! Share it on Instagram Stories or Posts.', 'info', 5000);
    }

    /**
     * Share to Pinterest
     */
    shareToPinterest(shareData) {
        const params = new URLSearchParams({
            url: shareData.url,
            media: shareData.image,
            description: `${shareData.title} - ${shareData.description}`
        });
        
        window.open(`${this.socialPlatforms.pinterest.shareUrl}?${params}`, '_blank', 'width=600,height=400');
    }

    /**
     * Share to LinkedIn
     */
    shareToLinkedIn(shareData) {
        const params = new URLSearchParams({
            url: shareData.url,
            title: shareData.title,
            summary: shareData.description
        });
        
        window.open(`${this.socialPlatforms.linkedin.shareUrl}?${params}`, '_blank', 'width=600,height=400');
    }

    /**
     * Native sharing (Web Share API)
     */
    async shareNative(shareData) {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: shareData.title,
                    text: shareData.description,
                    url: shareData.url
                });
            } catch (error) {
                console.log('Native sharing cancelled or failed:', error);
            }
        } else {
            // Fallback to copy to clipboard
            await this.copyShareText(shareData);
        }
    }

    /**
     * Copy share text to clipboard
     */
    async copyShareText(shareData) {
        const shareText = `${shareData.title}\n\n${shareData.description}\n\n${shareData.url}`;
        
        try {
            await navigator.clipboard.writeText(shareText);
            this.game.showNotification('📋 Share text copied to clipboard!', 'success');
        } catch (error) {
            console.warn('Copy to clipboard failed:', error);
        }
    }

    /**
     * Download certificate image
     */
    downloadCertificateImage(imageUrl, filename) {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /**
     * Generate friend invite
     */
    generateFriendInvite(message = '') {
        const invite = {
            id: 'invite_' + Date.now(),
            fromUserId: this.socialState.userId,
            fromName: this.socialState.displayName || 'A Friend',
            inviteCode: this.generateInviteCode(),
            message: message,
            timestamp: Date.now(),
            used: false,
            rewards: this.config.inviteRewards
        };
        
        return invite;
    }

    /**
     * Send friend invite
     */
    async sendFriendInvite(email, message = '') {
        const invite = this.generateFriendInvite(message);
        
        // In production, send email via backend service
        const inviteLink = `https://fablebox.com/games/enchanted-library?invite=${invite.inviteCode}`;
        
        const emailData = {
            to: email,
            subject: `🎮 Join me in The Enchanted Library Quest!`,
            html: this.generateInviteEmailHTML(invite, inviteLink)
        };
        
        // Simulate email sending (in production, use actual email service)
        console.log('📧 Friend invite sent:', emailData);
        
        // Track invite
        this.trackInvite(invite);
        
        return invite;
    }

    /**
     * Generate invite email HTML
     */
    generateInviteEmailHTML(invite, inviteLink) {
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #8B5CF6, #60A5FA); padding: 30px; text-align: center; color: white;">
                    <h1>🏰 You're Invited to a Magical Adventure!</h1>
                    <p style="font-size: 18px;">${invite.fromName} wants you to join them in The Enchanted Library Quest</p>
                </div>
                
                <div style="padding: 30px; background: #f9fafb;">
                    <h2 style="color: #8B5CF6;">🎮 What awaits you:</h2>
                    <ul style="font-size: 16px; line-height: 1.6;">
                        <li>🧩 Educational puzzles in math, language, and science</li>
                        <li>📚 Three magical story paths with beloved characters</li>
                        <li>🏆 Achievement system and progress tracking</li>
                        <li>👨‍👩‍👧‍👦 Parent dashboard for learning insights</li>
                        <li>🎁 Special bonus: ${invite.rewards.invitee.value} extra paths for joining!</li>
                    </ul>
                    
                    ${invite.message ? `
                        <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #8B5CF6;">
                            <p><strong>Personal message from ${invite.fromName}:</strong></p>
                            <p style="font-style: italic;">"${invite.message}"</p>
                        </div>
                    ` : ''}
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${inviteLink}" style="background: #8B5CF6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px;">
                            🚀 Start My Adventure
                        </a>
                    </div>
                    
                    <p style="text-align: center; color: #6B7280; font-size: 14px;">
                        This magical learning experience is brought to you by FableBox<br>
                        <a href="https://fablebox.com" style="color: #8B5CF6;">Learn more about personalized children's books</a>
                    </p>
                </div>
            </div>
        `;
    }

    /**
     * Process invite code (when new user joins)
     */
    processInviteCode(inviteCode) {
        // In production, verify invite code with backend
        const invite = this.findInviteByCode(inviteCode);
        
        if (invite && !invite.used) {
            // Award bonuses
            this.awardInviteBonuses(invite);
            
            // Mark invite as used
            invite.used = true;
            
            // Set invited by relationship
            this.socialState.invitedBy = invite.fromUserId;
            this.saveSocialState();
            
            return true;
        }
        
        return false;
    }

    /**
     * Award invite bonuses
     */
    awardInviteBonuses(invite) {
        // Award invitee bonus (new user gets extra paths)
        if (invite.rewards.invitee.type === 'bonus_paths') {
            this.game.showNotification(`🎁 Welcome bonus: ${invite.rewards.invitee.value} extra adventure paths!`, 'success');
        }
        
        // Award inviter bonus (original user gets premium days)
        // This would be handled by the backend in production
        console.log(`🎊 Invite bonus awarded: ${invite.rewards.inviter.value} ${invite.rewards.inviter.type}`);
    }

    /**
     * Update leaderboard
     */
    updateLeaderboard(category, playerData) {
        const leaderboard = this.leaderboards[category];
        if (!leaderboard) return;
        
        // Create entry
        const entry = {
            userId: this.socialState.userId,
            displayName: this.socialState.displayName || 'Anonymous',
            score: playerData.score,
            timestamp: Date.now(),
            metadata: playerData.metadata || {}
        };
        
        // Add to leaderboard
        leaderboard.entries.push(entry);
        
        // Sort and limit
        leaderboard.entries.sort((a, b) => {
            if (category === 'puzzleSpeed') {
                return a.score - b.score; // Lower time is better
            } else {
                return b.score - a.score; // Higher score is better
            }
        });
        
        leaderboard.entries = leaderboard.entries.slice(0, this.config.leaderboardLimit);
        
        // Save leaderboard
        this.saveLeaderboards();
        
        // Check for achievements
        this.checkLeaderboardAchievements(category, entry);
    }

    /**
     * Get leaderboard rankings
     */
    getLeaderboardRankings(category, limit = 10) {
        const leaderboard = this.leaderboards[category];
        if (!leaderboard) return [];
        
        return leaderboard.entries.slice(0, limit).map((entry, index) => ({
            rank: index + 1,
            ...entry
        }));
    }

    /**
     * Create family account
     */
    createFamilyAccount(parentData) {
        const familyAccount = {
            ...this.familyAccountTemplate,
            id: 'family_' + Date.now(),
            parentEmail: parentData.email,
            parentName: parentData.name,
            createdAt: Date.now()
        };
        
        // Add current user as first child
        this.addChildToFamily(familyAccount.id, {
            userId: this.socialState.userId,
            displayName: this.socialState.displayName,
            age: this.game.gameState.player.age || 7,
            joinedAt: Date.now()
        });
        
        this.socialState.familyAccount = familyAccount.id;
        this.saveSocialState();
        
        return familyAccount;
    }

    /**
     * Add child to family account
     */
    addChildToFamily(familyId, childData) {
        // In production, this would be handled by backend
        console.log('👨‍👩‍👧‍👦 Adding child to family:', familyId, childData);
    }

    /**
     * Show social sharing modal
     */
    showSharingModal(certificate) {
        const modal = document.createElement('div');
        modal.className = 'social-modal-overlay';
        modal.innerHTML = `
            <div class="social-modal">
                <div class="social-header">
                    <h2>🎉 Share Your Achievement!</h2>
                    <button class="close-modal" onclick="this.closest('.social-modal-overlay').remove()">✕</button>
                </div>
                
                <div class="social-content">
                    <div class="certificate-preview">
                        <img src="${certificate.shareableImageUrl}" alt="Achievement Certificate" style="width: 100%; border-radius: 8px;">
                    </div>
                    
                    <div class="share-platforms">
                        <h3>📢 Share on Social Media</h3>
                        <div class="platform-buttons">
                            ${Object.entries(this.socialPlatforms).map(([key, platform]) => `
                                <button class="platform-btn" onclick="socialSystem.shareCertificate(certificate, '${key}')">
                                    <span class="platform-icon">${platform.icon}</span>
                                    <span class="platform-name">${platform.name}</span>
                                </button>
                            `).join('')}
                            <button class="platform-btn" onclick="socialSystem.shareCertificate(certificate, 'native')">
                                <span class="platform-icon">📱</span>
                                <span class="platform-name">More Apps</span>
                            </button>
                        </div>
                    </div>
                    
                    <div class="invite-friends">
                        <h3>👫 Invite Friends</h3>
                        <p>Share the magic of learning with friends and family!</p>
                        <button class="invite-btn" onclick="socialSystem.showInviteModal()">
                            🎮 Invite Friends to Play
                        </button>
                    </div>
                    
                    <div class="download-option">
                        <button class="download-btn" onclick="socialSystem.downloadCertificateImage('${certificate.shareableImageUrl}', 'certificate.png')">
                            📥 Download Certificate
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Make certificate available globally for sharing
        window.certificate = certificate;
    }

    /**
     * Show friend invite modal
     */
    showInviteModal() {
        const modal = document.createElement('div');
        modal.className = 'invite-modal-overlay';
        modal.innerHTML = `
            <div class="invite-modal">
                <div class="invite-header">
                    <h2>👫 Invite Friends to Play</h2>
                    <button class="close-modal" onclick="this.closest('.invite-modal-overlay').remove()">✕</button>
                </div>
                
                <div class="invite-content">
                    <div class="invite-benefits">
                        <h3>🎁 Invite Rewards</h3>
                        <div class="reward-items">
                            <div class="reward-item">
                                <span class="reward-icon">🎮</span>
                                <span>Your friend gets ${this.config.inviteRewards.invitee.value} bonus adventure paths</span>
                            </div>
                            <div class="reward-item">
                                <span class="reward-icon">⭐</span>
                                <span>You get ${this.config.inviteRewards.inviter.value} days of premium features</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="invite-form">
                        <h3>📧 Send Personal Invite</h3>
                        <div class="form-group">
                            <label>Friend's Email</label>
                            <input type="email" id="invite-email" placeholder="friend@example.com" required>
                        </div>
                        <div class="form-group">
                            <label>Personal Message (Optional)</label>
                            <textarea id="invite-message" placeholder="Come join me in this amazing learning adventure!" rows="3"></textarea>
                        </div>
                        <button class="send-invite-btn" onclick="socialSystem.sendInviteFromModal()">
                            📤 Send Invite
                        </button>
                    </div>
                    
                    <div class="invite-link">
                        <h3>🔗 Share Invite Link</h3>
                        <div class="link-container">
                            <input type="text" id="invite-link" value="https://fablebox.com/games/enchanted-library?invite=${this.socialState.inviteCode}" readonly>
                            <button onclick="socialSystem.copyInviteLink()">📋 Copy</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    /**
     * Send invite from modal
     */
    async sendInviteFromModal() {
        const email = document.getElementById('invite-email').value;
        const message = document.getElementById('invite-message').value;
        
        if (!email) {
            this.game.showNotification('Please enter a valid email address.', 'warning');
            return;
        }
        
        try {
            await this.sendFriendInvite(email, message);
            this.game.showNotification('🎉 Invite sent successfully!', 'success');
            document.querySelector('.invite-modal-overlay').remove();
        } catch (error) {
            this.game.showNotification('Failed to send invite. Please try again.', 'error');
        }
    }

    /**
     * Copy invite link
     */
    async copyInviteLink() {
        const linkInput = document.getElementById('invite-link');
        
        try {
            await navigator.clipboard.writeText(linkInput.value);
            this.game.showNotification('📋 Invite link copied!', 'success');
        } catch (error) {
            linkInput.select();
            document.execCommand('copy');
            this.game.showNotification('📋 Invite link copied!', 'success');
        }
    }

    /**
     * Utility functions
     */
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateInviteCode() {
        return 'INVITE' + Math.random().toString(36).substr(2, 6).toUpperCase();
    }

    formatPlayTime(milliseconds) {
        const hours = Math.floor(milliseconds / 3600000);
        const minutes = Math.floor((milliseconds % 3600000) / 60000);
        return `${hours}h ${minutes}m`;
    }

    trackShare(certificate, platform) {
        this.socialState.shareHistory.push({
            certificateId: certificate.id,
            platform: platform,
            timestamp: Date.now()
        });
        this.saveSocialState();
        
        // Track analytics
        if (this.game.monetizationSystem) {
            this.game.monetizationSystem.trackEngagementEvent('certificate_shared', { platform });
        }
    }

    trackInvite(invite) {
        // Track analytics
        if (this.game.monetizationSystem) {
            this.game.monetizationSystem.trackEngagementEvent('friend_invited', { inviteCode: invite.inviteCode });
        }
    }

    checkForInviteCode() {
        const urlParams = new URLSearchParams(window.location.search);
        const inviteCode = urlParams.get('invite');
        
        if (inviteCode) {
            this.processInviteCode(inviteCode);
        }
    }

    findInviteByCode(code) {
        // In production, this would query the backend
        // For demo, return a mock invite
        return {
            id: 'demo_invite',
            fromUserId: 'demo_user',
            fromName: 'Demo Friend',
            inviteCode: code,
            used: false,
            rewards: this.config.inviteRewards
        };
    }

    checkLeaderboardAchievements(category, entry) {
        // Check if player reached top rankings
        const rankings = this.getLeaderboardRankings(category);
        const playerRank = rankings.findIndex(r => r.userId === entry.userId) + 1;
        
        if (playerRank <= 3 && this.game.achievementSystem) {
            // Award leaderboard achievement
            const achievementId = `leaderboard_${category}_top3`;
            this.game.achievementSystem.awardAchievement(achievementId);
        }
    }

    saveLeaderboards() {
        try {
            localStorage.setItem('enchantedLibrary_leaderboards', JSON.stringify(this.leaderboards));
        } catch (error) {
            console.warn('Failed to save leaderboards:', error);
        }
    }

    initializeLeaderboards() {
        try {
            const saved = localStorage.getItem('enchantedLibrary_leaderboards');
            if (saved) {
                const data = JSON.parse(saved);
                this.leaderboards = { ...this.leaderboards, ...data };
            }
        } catch (error) {
            console.warn('Failed to load leaderboards:', error);
        }
    }

    setupSocialEventListeners() {
        // Listen for game events that trigger social features
        document.addEventListener('pathCompleted', (event) => {
            // Update leaderboards when path is completed
            this.updateLeaderboard('paths', {
                score: 1,
                metadata: { pathId: event.detail.pathId }
            });
        });
        
        document.addEventListener('puzzleSolved', (event) => {
            // Update puzzle speed leaderboard
            if (event.detail.timeSpent) {
                this.updateLeaderboard('puzzleSpeed', {
                    score: event.detail.timeSpent,
                    metadata: { puzzleId: event.detail.puzzleId }
                });
            }
        });
    }

    /**
     * Clean up social system
     */
    destroy() {
        this.saveSocialState();
        this.saveLeaderboards();
        
        // Remove any active modals
        document.querySelectorAll('.social-modal-overlay, .invite-modal-overlay').forEach(el => el.remove());
        
        console.log('👥 Social system destroyed');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SocialSystem;
} else {
    window.SocialSystem = SocialSystem;
}
