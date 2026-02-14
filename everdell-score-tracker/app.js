/**
 * Everdell Score Tracker v3.0
 * Enhanced with player selection, season tracking, and woodland theming
 */

const EverdellApp = {
    // Storage key for localStorage
    STORAGE_KEY: 'everdellGames',
    DATA_VERSION: 3,
    
    // Game constants
    JOURNEY_OPTIONS: [0, 2, 3, 4, 5],
    BASIC_EVENTS: ['Event 1', 'Event 2', 'Event 3', 'Event 4'],
    BASIC_EVENT_POINTS: 3,
    SEASONS: ['Winter', 'Spring', 'Summer', 'Autumn'],
    SEASON_WORKERS: {
        'Winter': 2,
        'Spring': 3,
        'Summer': 4,
        'Autumn': 6
    },
    
    // Current game state
    currentPlayers: [],
    games: [],
    
    // Initialize the app
    init() {
        console.log('🌳 Everdell Score Tracker initializing...');
        this.loadGames();
        this.migrateData();
        this.setupEventListeners();
        this.renderStats();
        this.renderHistory();
        this.initializeDefaultGame();
        console.log('✅ App ready!');
    },
    
    // Setup all event listeners
    setupEventListeners() {
        // Player setup buttons
        document.querySelectorAll('.player-count-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectPlayerCount(e));
        });
        
        const startGameBtn = document.getElementById('startGameBtn');
        if (startGameBtn) {
            startGameBtn.addEventListener('click', () => this.startNewGame());
        }
        
        // Main game buttons
        const newGameBtn = document.getElementById('newGameBtn');
        if (newGameBtn) {
            newGameBtn.addEventListener('click', () => this.showPlayerSetup());
        }
        
        const saveGameBtn = document.getElementById('saveGameBtn');
        if (saveGameBtn) {
            saveGameBtn.addEventListener('click', () => this.saveGame());
        }
        
        const clearDataBtn = document.getElementById('clearDataBtn');
        if (clearDataBtn) {
            clearDataBtn.addEventListener('click', () => this.clearAllData());
        }
    },
    
    // Load games from localStorage
    loadGames() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        this.games = stored ? JSON.parse(stored) : [];
    },
    
    // Save games to localStorage
    saveGames() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.games));
    },
    
    // Migrate old data format to new format
    migrateData() {
        let migrated = false;
        
        this.games = this.games.map(game => {
            // Skip if already migrated to v3
            if (game.version === this.DATA_VERSION) return game;
            
            // Migrate each player
            game.players = game.players.map(player => {
                if (typeof player.score === 'number' && !player.breakdown) {
                    migrated = true;
                    return {
                        name: player.name,
                        season: player.season || 'Autumn',
                        breakdown: {
                            cards: player.score,
                            tokens: 0,
                            purple: 0,
                            journey: 0,
                            basicEvents: 0,
                            specialEvents: []
                        },
                        totalScore: player.score
                    };
                }
                // Add season if missing
                if (!player.season) {
                    player.season = 'Autumn';
                    migrated = true;
                }
                return player;
            });
            
            game.version = this.DATA_VERSION;
            return game;
        });
        
        if (migrated) {
            this.saveGames();
            console.log('📦 Data migrated to v3 format');
        }
    },
    
    // Initialize with default 2-player game (Tyler & Hanna)
    initializeDefaultGame() {
        this.currentPlayers = ['Tyler', 'Hanna'];
        this.initializePlayerInputs();
    },
    
    // Show player setup screen
    showPlayerSetup() {
        document.getElementById('newGameSection').style.display = 'none';
        document.getElementById('playerSetupSection').style.display = 'block';
        document.getElementById('playerNamesSetup').style.display = 'none';
        
        // Reset selection
        document.querySelectorAll('.player-count-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
    },
    
    // Handle player count selection
    selectPlayerCount(event) {
        const count = parseInt(event.target.dataset.count);
        
        // Update button states
        document.querySelectorAll('.player-count-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        event.target.classList.add('selected');
        
        // Show name input section
        document.getElementById('playerNamesSetup').style.display = 'block';
        
        // Generate name inputs
        const container = document.getElementById('playerNameInputs');
        container.innerHTML = '';
        
        const defaultNames = ['Tyler', 'Hanna', 'Player 3', 'Player 4'];
        
        for (let i = 0; i < count; i++) {
            const input = document.createElement('div');
            input.className = 'player-name-field';
            input.innerHTML = `
                <label>🦊 Player ${i + 1}</label>
                <input type="text" class="player-name-setup-input" placeholder="Enter name" value="${defaultNames[i]}" />
            `;
            container.appendChild(input);
        }
    },
    
    // Start new game with selected players
    startNewGame() {
        const inputs = document.querySelectorAll('.player-name-setup-input');
        const names = Array.from(inputs).map(input => input.value.trim()).filter(name => name);
        
        if (names.length < 2) {
            alert('Please enter at least 2 player names!');
            return;
        }
        
        this.currentPlayers = names;
        this.initializePlayerInputs();
        
        // Switch to game screen
        document.getElementById('playerSetupSection').style.display = 'none';
        document.getElementById('newGameSection').style.display = 'block';
        
        // Clear any previous data
        document.getElementById('gameNotes').value = '';
    },
    
    // Initialize player input forms
    initializePlayerInputs() {
        const container = document.getElementById('playersInput');
        container.innerHTML = '';
        
        this.currentPlayers.forEach(playerName => {
            container.appendChild(this.createPlayerCard(playerName));
        });
    },
    
    // Create a player input card
    createPlayerCard(playerName = '') {
        const card = document.createElement('div');
        card.className = 'player-score-card';
        card.innerHTML = `
            <div class="player-header">
                <div class="player-info">
                    <span class="player-avatar">🦊</span>
                    <span class="player-name">${playerName}</span>
                </div>
                <div class="total-display">0</div>
            </div>
            
            <div class="season-selector">
                <label>🍂 Season</label>
                <div class="season-buttons">
                    <button class="season-btn" data-season="Winter">❄️ Winter</button>
                    <button class="season-btn" data-season="Spring">🌸 Spring</button>
                    <button class="season-btn" data-season="Summer">☀️ Summer</button>
                    <button class="season-btn selected" data-season="Autumn">🍁 Autumn</button>
                </div>
                <div class="worker-count">Workers: <span class="worker-value">6</span></div>
            </div>
            
            <div class="score-breakdown">
                <div class="score-field">
                    <label><span class="emoji">🏠</span> Base Cards</label>
                    <input type="number" class="cards-input" min="0" value="0">
                </div>
                <div class="score-field">
                    <label><span class="emoji">🌰</span> Point Tokens</label>
                    <input type="number" class="tokens-input" min="0" value="0">
                </div>
                <div class="score-field">
                    <label><span class="emoji">✨</span> Purple Bonuses</label>
                    <input type="number" class="purple-input" min="0" value="0">
                </div>
                <div class="score-field journey-field">
                    <label><span class="emoji">🗺️</span> Journey</label>
                    <div class="journey-container">
                        <div class="journey-option">
                            <input type="checkbox" class="journey-check-3" id="${playerName}-journey-3">
                            <label for="${playerName}-journey-3">3 pts</label>
                        </div>
                        <div class="journey-option">
                            <input type="checkbox" class="journey-check-4" id="${playerName}-journey-4">
                            <label for="${playerName}-journey-4">4 pts</label>
                        </div>
                        <div class="journey-option">
                            <input type="checkbox" class="journey-check-5" id="${playerName}-journey-5">
                            <label for="${playerName}-journey-5">5 pts</label>
                        </div>
                        <div class="journey-option journey-2pt">
                            <label for="${playerName}-journey-2">2 pts ×</label>
                            <input type="number" class="journey-2pt-count" id="${playerName}-journey-2" min="0" max="10" value="0">
                        </div>
                    </div>
                    <div class="journey-total">Total: <span class="journey-total-value">0</span> pts</div>
                </div>
            </div>
            
            <button class="collapsible-toggle">
                ▼ Events (Basic & Special)
            </button>
            
            <div class="collapsible-content">
                <div class="basic-events-section">
                    <label>🎪 Basic Events (3 pts each)</label>
                    <div class="basic-events-row">
                        <label class="event-checkbox-group">
                            <input type="checkbox" class="basic-event-check">
                            <span>Event 1</span>
                        </label>
                        <label class="event-checkbox-group">
                            <input type="checkbox" class="basic-event-check">
                            <span>Event 2</span>
                        </label>
                        <label class="event-checkbox-group">
                            <input type="checkbox" class="basic-event-check">
                            <span>Event 3</span>
                        </label>
                        <label class="event-checkbox-group">
                            <input type="checkbox" class="basic-event-check">
                            <span>Event 4</span>
                        </label>
                        <div class="basic-event-total">= <span class="basic-events-total-value">0</span> pts</div>
                    </div>
                </div>
                
                <div class="special-events-section">
                    <div class="special-events-header">
                        <label>🎯 Special Events</label>
                        <button class="add-special-event-btn">+ Add Event</button>
                    </div>
                    <div class="special-events-list"></div>
                    <div class="special-event-total">Total: <span class="special-events-total-value">0</span> pts</div>
                </div>
            </div>
        `;
        
        // Setup event listeners for this card
        this.setupCardEventListeners(card);
        
        return card;
    },
    
    // Setup event listeners for a player card
    setupCardEventListeners(card) {
        // Season buttons
        card.querySelectorAll('.season-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectSeason(e, card));
        });
        
        // Score inputs
        card.querySelectorAll('.cards-input, .tokens-input, .purple-input, .basic-event-check').forEach(input => {
            input.addEventListener('change', () => this.updateTotal(card));
            input.addEventListener('input', () => this.updateTotal(card));
        });
        
        // Journey inputs
        card.querySelectorAll('.journey-check-3, .journey-check-4, .journey-check-5, .journey-2pt-count').forEach(input => {
            input.addEventListener('change', () => this.updateTotal(card));
            input.addEventListener('input', () => this.updateTotal(card));
        });
        
        // Collapsible toggle
        const toggle = card.querySelector('.collapsible-toggle');
        toggle.addEventListener('click', () => this.toggleCollapsible(toggle));
        
        // Add special event button
        const addEventBtn = card.querySelector('.add-special-event-btn');
        addEventBtn.addEventListener('click', () => this.addSpecialEvent(card));
    },
    
    // Handle season selection
    selectSeason(event, card) {
        const season = event.target.dataset.season;
        
        // Update button states
        card.querySelectorAll('.season-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        event.target.classList.add('selected');
        
        // Update worker count
        const workerCount = this.SEASON_WORKERS[season];
        card.querySelector('.worker-value').textContent = workerCount;
    },
    
    // Toggle collapsible section
    toggleCollapsible(btn) {
        btn.classList.toggle('active');
        const content = btn.nextElementSibling;
        content.classList.toggle('show');
        btn.textContent = content.classList.contains('show') 
            ? '▲ Events (Basic & Special)' 
            : '▼ Events (Basic & Special)';
    },
    
    // Add a special event row
    addSpecialEvent(card) {
        const list = card.querySelector('.special-events-list');
        const row = document.createElement('div');
        row.className = 'special-event-row';
        row.innerHTML = `
            <input type="text" placeholder="Event name" class="special-event-name">
            <input type="number" placeholder="Pts" class="special-event-pts" min="0" value="">
            <button class="remove-event-btn">×</button>
        `;
        list.appendChild(row);
        
        // Setup event listeners for this row
        const ptsInput = row.querySelector('.special-event-pts');
        ptsInput.addEventListener('change', () => this.updateTotal(card));
        ptsInput.addEventListener('input', () => this.updateTotal(card));
        
        const removeBtn = row.querySelector('.remove-event-btn');
        removeBtn.addEventListener('click', () => this.removeSpecialEvent(row, card));
    },
    
    // Remove a special event row
    removeSpecialEvent(row, card) {
        row.remove();
        this.updateTotal(card);
    },
    
    // Update the total score display for a player card
    updateTotal(card) {
        // Get all values
        const cards = parseInt(card.querySelector('.cards-input').value) || 0;
        const tokens = parseInt(card.querySelector('.tokens-input').value) || 0;
        const purple = parseInt(card.querySelector('.purple-input').value) || 0;
        
        // Calculate journey points
        let journey = 0;
        if (card.querySelector('.journey-check-3')?.checked) journey += 3;
        if (card.querySelector('.journey-check-4')?.checked) journey += 4;
        if (card.querySelector('.journey-check-5')?.checked) journey += 5;
        const journey2Count = parseInt(card.querySelector('.journey-2pt-count')?.value) || 0;
        journey += journey2Count * 2;
        
        // Update journey total display
        const journeyTotalElement = card.querySelector('.journey-total-value');
        if (journeyTotalElement) {
            journeyTotalElement.textContent = journey;
        }
        
        // Basic events
        const basicEventChecks = card.querySelectorAll('.basic-event-check:checked');
        const basicEvents = basicEventChecks.length * this.BASIC_EVENT_POINTS;
        card.querySelector('.basic-events-total-value').textContent = basicEvents;
        
        // Special events
        const specialEventInputs = card.querySelectorAll('.special-event-pts');
        let specialEvents = 0;
        specialEventInputs.forEach(input => {
            specialEvents += parseInt(input.value) || 0;
        });
        card.querySelector('.special-events-total-value').textContent = specialEvents;
        
        // Total
        const total = cards + tokens + purple + journey + basicEvents + specialEvents;
        card.querySelector('.total-display').textContent = total;
    },
    
    // Collect player data from a card
    collectPlayerData(card) {
        const name = card.querySelector('.player-name').textContent.trim();
        if (!name) return null;
        
        // Get selected season
        const selectedSeasonBtn = card.querySelector('.season-btn.selected');
        const season = selectedSeasonBtn ? selectedSeasonBtn.dataset.season : 'Autumn';
        
        const cards = parseInt(card.querySelector('.cards-input').value) || 0;
        const tokens = parseInt(card.querySelector('.tokens-input').value) || 0;
        const purple = parseInt(card.querySelector('.purple-input').value) || 0;
        
        // Calculate journey points
        let journey = 0;
        if (card.querySelector('.journey-check-3')?.checked) journey += 3;
        if (card.querySelector('.journey-check-4')?.checked) journey += 4;
        if (card.querySelector('.journey-check-5')?.checked) journey += 5;
        const journey2Count = parseInt(card.querySelector('.journey-2pt-count')?.value) || 0;
        journey += journey2Count * 2;
        
        // Basic events count
        const basicEventChecks = card.querySelectorAll('.basic-event-check:checked');
        const basicEventsCount = basicEventChecks.length;
        const basicEvents = basicEventsCount * this.BASIC_EVENT_POINTS;
        
        // Special events
        const specialEventRows = card.querySelectorAll('.special-event-row');
        const specialEvents = [];
        specialEventRows.forEach(row => {
            const eventName = row.querySelector('.special-event-name').value.trim();
            const eventPts = parseInt(row.querySelector('.special-event-pts').value) || 0;
            if (eventName || eventPts > 0) {
                specialEvents.push({ name: eventName || 'Unnamed Event', points: eventPts });
            }
        });
        
        const totalScore = cards + tokens + purple + journey + basicEvents + 
            specialEvents.reduce((sum, e) => sum + e.points, 0);
        
        return {
            name,
            season,
            breakdown: {
                cards,
                tokens,
                purple,
                journey,
                basicEvents: basicEventsCount,
                specialEvents
            },
            totalScore
        };
    },
    
    // Save a new game
    saveGame() {
        const playerCards = document.querySelectorAll('.player-score-card');
        const players = [];
        
        // Collect player data
        playerCards.forEach(card => {
            const playerData = this.collectPlayerData(card);
            if (playerData) {
                players.push(playerData);
            }
        });
        
        // Validate
        if (players.length < 2) {
            alert('Please have at least 2 players!');
            return;
        }
        
        // Check at least some scores exist
        const hasScores = players.some(p => p.totalScore > 0);
        if (!hasScores) {
            alert('Please enter some scores!');
            return;
        }
        
        // Sort players by score (highest first)
        players.sort((a, b) => b.totalScore - a.totalScore);
        
        // Get notes
        const notes = document.getElementById('gameNotes').value.trim();
        
        // Create game object
        const game = {
            id: Date.now(),
            date: new Date().toISOString(),
            version: this.DATA_VERSION,
            players: players,
            notes: notes || null
        };
        
        // Add to games array and save
        this.games.unshift(game);
        this.saveGames();
        
        // Clear inputs and reset
        this.clearInputs();
        
        // Re-render stats and history
        this.renderStats();
        this.renderHistory();
        
        // Show success message
        alert(`🎉 Game saved! ${players[0].name} won with ${players[0].totalScore} points! 👑`);
    },
    
    // Clear all input fields
    clearInputs() {
        // Reset to current players
        this.initializePlayerInputs();
        document.getElementById('gameNotes').value = '';
    },
    
    // Calculate statistics
    calculateStats() {
        if (this.games.length === 0) return null;
        
        const playerStats = {};
        let highestScore = 0;
        let highestScorePlayer = '';
        let highestScoreDate = null;
        
        const categoryTotals = {
            cards: 0,
            tokens: 0,
            purple: 0,
            journey: 0,
            events: 0
        };
        let totalPointsAllGames = 0;
        
        this.games.forEach(game => {
            game.players.forEach((player, index) => {
                if (!playerStats[player.name]) {
                    playerStats[player.name] = {
                        games: 0,
                        wins: 0,
                        totalScore: 0,
                        highestScore: 0,
                        categoryTotals: { cards: 0, tokens: 0, purple: 0, journey: 0, events: 0 }
                    };
                }
                
                const stats = playerStats[player.name];
                stats.games++;
                stats.totalScore += player.totalScore;
                
                if (index === 0) stats.wins++;
                
                if (player.totalScore > stats.highestScore) {
                    stats.highestScore = player.totalScore;
                }
                
                if (player.totalScore > highestScore) {
                    highestScore = player.totalScore;
                    highestScorePlayer = player.name;
                    highestScoreDate = game.date;
                }
                
                // Aggregate category stats
                if (player.breakdown) {
                    const b = player.breakdown;
                    stats.categoryTotals.cards += b.cards || 0;
                    stats.categoryTotals.tokens += b.tokens || 0;
                    stats.categoryTotals.purple += b.purple || 0;
                    stats.categoryTotals.journey += b.journey || 0;
                    
                    const eventPoints = (b.basicEvents || 0) * this.BASIC_EVENT_POINTS + 
                        (b.specialEvents || []).reduce((sum, e) => sum + e.points, 0);
                    stats.categoryTotals.events += eventPoints;
                    
                    categoryTotals.cards += b.cards || 0;
                    categoryTotals.tokens += b.tokens || 0;
                    categoryTotals.purple += b.purple || 0;
                    categoryTotals.journey += b.journey || 0;
                    categoryTotals.events += eventPoints;
                    totalPointsAllGames += player.totalScore;
                }
            });
        });
        
        // Calculate category percentages
        const categoryPercentages = {};
        if (totalPointsAllGames > 0) {
            Object.keys(categoryTotals).forEach(key => {
                categoryPercentages[key] = (categoryTotals[key] / totalPointsAllGames * 100).toFixed(1);
            });
        }
        
        return {
            totalGames: this.games.length,
            highestScore,
            highestScorePlayer,
            highestScoreDate,
            playerStats,
            categoryTotals,
            categoryPercentages,
            totalPointsAllGames
        };
    },
    
    // Render statistics
    renderStats() {
        const container = document.getElementById('statsContent');
        const stats = this.calculateStats();
        
        if (!stats) {
            container.innerHTML = '<p class="empty-state">🌳 No games recorded yet. Start your woodland adventure!</p>';
            return;
        }
        
        let html = '';
        
        // Basic stats grid
        html += '<div class="stats-grid">';
        
        html += `
            <div class="stat-card">
                <div class="stat-icon">🎲</div>
                <div class="stat-label">Total Games</div>
                <div class="stat-value">${stats.totalGames}</div>
            </div>
        `;
        
        html += `
            <div class="stat-card">
                <div class="stat-icon">👑</div>
                <div class="stat-label">Highest Score</div>
                <div class="stat-value">${stats.highestScore}</div>
                <div class="stat-sub">${stats.highestScorePlayer}</div>
            </div>
        `;
        
        html += '</div>';
        
        // Player-specific stats
        if (Object.keys(stats.playerStats).length > 0) {
            html += '<h3 class="section-title">🦊 Player Stats</h3>';
            html += '<div class="stats-grid">';
            
            Object.entries(stats.playerStats).forEach(([name, pStats]) => {
                const winRate = ((pStats.wins / pStats.games) * 100).toFixed(0);
                const avgScore = (pStats.totalScore / pStats.games).toFixed(1);
                
                html += `
                    <div class="stat-card player-stat">
                        <div class="stat-label">${name}</div>
                        <div class="stat-value">${pStats.wins}</div>
                        <div class="stat-sub">wins (${winRate}%)</div>
                        <div class="stat-sub" style="margin-top: 8px;">
                            Avg: ${avgScore} | High: ${pStats.highestScore}
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
        }
        
        // Category breakdown
        if (stats.totalPointsAllGames > 0) {
            html += `
                <div class="category-breakdown">
                    <h3 class="section-title">📊 Where Points Come From</h3>
                    
                    <div class="category-bar">
                        <span class="category-label">🏠 Cards</span>
                        <div class="category-bar-track">
                            <div class="category-bar-fill cards" style="width: ${stats.categoryPercentages.cards}%"></div>
                        </div>
                        <span class="category-value">${stats.categoryPercentages.cards}%</span>
                    </div>
                    
                    <div class="category-bar">
                        <span class="category-label">🌰 Tokens</span>
                        <div class="category-bar-track">
                            <div class="category-bar-fill tokens" style="width: ${stats.categoryPercentages.tokens}%"></div>
                        </div>
                        <span class="category-value">${stats.categoryPercentages.tokens}%</span>
                    </div>
                    
                    <div class="category-bar">
                        <span class="category-label">✨ Purple</span>
                        <div class="category-bar-track">
                            <div class="category-bar-fill purple" style="width: ${stats.categoryPercentages.purple}%"></div>
                        </div>
                        <span class="category-value">${stats.categoryPercentages.purple}%</span>
                    </div>
                    
                    <div class="category-bar">
                        <span class="category-label">🗺️ Journey</span>
                        <div class="category-bar-track">
                            <div class="category-bar-fill journey" style="width: ${stats.categoryPercentages.journey}%"></div>
                        </div>
                        <span class="category-value">${stats.categoryPercentages.journey}%</span>
                    </div>
                    
                    <div class="category-bar">
                        <span class="category-label">🎪 Events</span>
                        <div class="category-bar-track">
                            <div class="category-bar-fill events" style="width: ${stats.categoryPercentages.events}%"></div>
                        </div>
                        <span class="category-value">${stats.categoryPercentages.events}%</span>
                    </div>
                </div>
            `;
        }
        
        container.innerHTML = html;
    },
    
    // Format breakdown for display
    formatBreakdown(breakdown) {
        if (!breakdown) return '';
        
        const parts = [];
        
        if (breakdown.cards > 0) {
            parts.push(`<span class="breakdown-item cards">🏠 ${breakdown.cards}</span>`);
        }
        if (breakdown.tokens > 0) {
            parts.push(`<span class="breakdown-item tokens">🌰 ${breakdown.tokens}</span>`);
        }
        if (breakdown.purple > 0) {
            parts.push(`<span class="breakdown-item purple">✨ ${breakdown.purple}</span>`);
        }
        if (breakdown.journey > 0) {
            parts.push(`<span class="breakdown-item journey">🗺️ ${breakdown.journey}</span>`);
        }
        
        const basicEventPts = (breakdown.basicEvents || 0) * this.BASIC_EVENT_POINTS;
        const specialEventPts = (breakdown.specialEvents || []).reduce((sum, e) => sum + e.points, 0);
        const totalEvents = basicEventPts + specialEventPts;
        
        if (totalEvents > 0) {
            parts.push(`<span class="breakdown-item events">🎪 ${totalEvents}</span>`);
        }
        
        return parts.join('');
    },
    
    // Render game history
    renderHistory() {
        const container = document.getElementById('historyContent');
        
        if (this.games.length === 0) {
            container.innerHTML = '<p class="empty-state">🌳 No games recorded yet.</p>';
            return;
        }
        
        let html = '';
        
        this.games.forEach((game, gameIndex) => {
            const date = new Date(game.date);
            const dateStr = date.toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            html += `
                <div class="game-card">
                    <div class="game-card-header">
                        <div class="game-date">📅 ${dateStr}</div>
                        <button class="delete-game-btn" data-index="${gameIndex}">🗑️</button>
                    </div>
                    <div class="game-players">
            `;
            
            game.players.forEach((player, index) => {
                const winnerClass = index === 0 ? 'winner' : '';
                const breakdownHtml = this.formatBreakdown(player.breakdown);
                const seasonIcon = this.getSeasonIcon(player.season || 'Autumn');
                
                html += `
                    <div class="player-result ${winnerClass}">
                        <div class="player-result-header">
                            <div class="player-result-name">
                                <span class="player-name">${player.name}</span>
                                <span class="season-badge">${seasonIcon}</span>
                            </div>
                            <span class="score">${player.totalScore}</span>
                        </div>
                        ${breakdownHtml ? `<div class="score-breakdown-display">${breakdownHtml}</div>` : ''}
                    </div>
                `;
            });
            
            html += '</div>';
            
            // Add notes if present
            if (game.notes) {
                html += `<div class="game-notes-display">📝 ${this.escapeHtml(game.notes)}</div>`;
            }
            
            html += '</div>';
        });
        
        container.innerHTML = html;
        
        // Add delete button listeners
        container.querySelectorAll('.delete-game-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.deleteGame(index);
            });
        });
    },
    
    // Get season icon
    getSeasonIcon(season) {
        const icons = {
            'Winter': '❄️',
            'Spring': '🌸',
            'Summer': '☀️',
            'Autumn': '🍁'
        };
        return icons[season] || '🍁';
    },
    
    // Delete a specific game
    deleteGame(index) {
        if (confirm('🗑️ Delete this game?')) {
            this.games.splice(index, 1);
            this.saveGames();
            this.renderStats();
            this.renderHistory();
        }
    },
    
    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    // Clear all data (with confirmation)
    clearAllData() {
        if (confirm('⚠️ Are you sure you want to delete ALL game data? This cannot be undone!')) {
            if (confirm('Really sure? This will delete everything!')) {
                localStorage.removeItem(this.STORAGE_KEY);
                this.games = [];
                this.renderStats();
                this.renderHistory();
                alert('🧹 All data cleared!');
            }
        }
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    EverdellApp.init();
});
