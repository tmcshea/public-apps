# Everdell Score Tracker 🌳

A beautiful web app to track your Everdell board game scores with detailed breakdowns for every scoring category.

## Features

### 🎯 Detailed Score Tracking
- **Base Card Points** - Total printed points on cards in your city
- **Point Tokens** - Tokens collected during gameplay
- **Purple Card Bonuses** - End-game prosperity bonuses
- **Journey Points** - Select from standard journey values (None/2/3/4/5)
- **Basic Events** - Checkboxes for each of 4 basic events (3 pts each)
- **Special Events** - Add any number of custom special events with names and points
- **Auto-calculated totals** that update in real-time as you enter scores

### 📊 Enhanced Statistics
- **Head-to-Head Record** - Tyler vs Hanna wins/losses displayed prominently
- **Player Win Rates** - Track who's dominating
- **Category Breakdown** - Visual bars showing where points typically come from
- **Scoring Trends** - Compare recent games to all-time averages
- **Highest Scores** - Track record-breaking games

### 📝 Game History
- Full breakdown displayed for each player (Cards | Tokens | Purple | Journey | Events)
- **Game Notes** - Add optional comments like "Hanna dominated with Farm+Husband+Wife combo"
- Delete individual games if needed
- Chronological history with timestamps

### 📱 Mobile-Friendly
- Responsive design works on phones and tablets
- Collapsible events section to reduce clutter
- Touch-friendly inputs and buttons

## How to Use

1. Open `index.html` in any modern web browser
2. Tyler and Hanna are pre-filled as default players
3. Enter scores in each category - the total updates automatically
4. Expand "Events" section to track basic and special events
5. Add optional game notes
6. Click "Save Game" when done
7. View your stats and history below!

## Scoring Categories Explained

| Category | Description |
|----------|-------------|
| 🃏 Base Cards | Points printed on cards in your city |
| 🪙 Point Tokens | Point tokens collected during the game |
| 💜 Purple Bonuses | End-game scoring from Prosperity cards |
| 🗺️ Journey | Journey destination points (if using Pearlbrook) |
| 🎪 Basic Events | 4 shared events on the board (3 pts each) |
| ✨ Special Events | Unique events achieved during the game |

## Running Locally

No installation required! Just open the HTML file:

```bash
# Option 1: Double-click index.html in your file explorer

# Option 2: Serve it locally (optional, for development)
python -m http.server 8000
# Then visit http://localhost:8000
```

## Tech Stack

- Pure HTML/CSS/JavaScript (no frameworks needed)
- LocalStorage for data persistence
- Responsive CSS Grid layout
- Mobile-first design

## Data Storage

All game data is stored in your browser's localStorage. The app automatically migrates old data formats to the new detailed breakdown format.

### Backup Your Data

1. Open browser DevTools (F12)
2. Go to Console tab
3. Run: `localStorage.getItem('everdellGames')`
4. Copy the output to save your data

### Restore Data

```javascript
localStorage.setItem('everdellGames', 'YOUR_DATA_HERE')
```

## Version History

### v2.0 (Latest)
- ✨ Detailed score breakdown (cards, tokens, purple, journey, events)
- ✨ Basic events with checkboxes (4 events × 3 pts each)
- ✨ Special events with custom names and points
- ✨ Head-to-head statistics (Tyler vs Hanna)
- ✨ Category breakdown visualization
- ✨ Game notes field
- ✨ Scoring trends analysis
- ✨ Collapsible sections for cleaner UI
- ✨ Individual game deletion
- ✨ Automatic data migration from v1

### v1.0
- Basic score tracking
- Game history
- Win statistics

## Future Ideas

- Export to CSV
- Charts and graphs over time
- Expansion tracking (which expansions were used)
- Cloud sync option
- Share game results

---

Built with ⚡ by Victor for Tyler & Hanna
