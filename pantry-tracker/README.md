# 🥫 Pantry Tracker - Phase 1: Inventory Management

A simple, mobile-friendly kitchen inventory system for Tyler & Hanna to track food items, manage expiration dates, and reduce waste.

## Features

### Core Functionality
- ✅ **Add Items** - Track food items with name, quantity, unit, category, location, expiration date, and notes
- ✅ **Smart Categorization** - 10 categories (Dairy, Produce, Meat, Pantry, Frozen, Snacks, Beverages, Condiments, Baking, Other)
- ✅ **Location Tracking** - Track where items are stored (Fridge, Freezer, Pantry, Cabinet, Counter)
- ✅ **Expiration Alerts** - Visual warnings for items expiring soon (7 days) or already expired
- ✅ **Quick Actions** - Use one unit, edit items, or delete with simple buttons
- ✅ **Filter & Sort** - Filter by category/location, sort by name/expiration/category/location/date added
- ✅ **Stats Dashboard** - See total items, items expiring soon, and expired items at a glance
- ✅ **Data Export/Import** - Export your inventory to JSON, import from backup
- ✅ **Mobile-Friendly** - Responsive design perfect for kitchen tablet/phone use

### Data Persistence
- All data stored in browser localStorage
- No server required - works completely offline
- Export/import for backups and data portability

## Quick Start

### Running Locally

1. **Clone or navigate to the project:**
   ```bash
   cd C:\Users\clawd\github\tyler-projects\pantry-tracker
   ```

2. **Open in browser:**
   - Simply open `index.html` in any modern web browser
   - Or use a local server:
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Node.js (if you have http-server installed)
     npx http-server -p 8000
     ```
   - Then visit: http://localhost:8000

### Deploying

#### GitHub Pages (Recommended)
1. Push to GitHub
2. Enable GitHub Pages in repo settings
3. Select branch and root folder
4. Access at: `https://<username>.github.io/<repo-name>/pantry-tracker/`

#### Any Static Host
- Upload `index.html`, `styles.css`, and `app.js` to any static file host
- Works on Netlify, Vercel, Cloudflare Pages, etc.

## Usage Guide

### Adding Items

1. Fill out the "Add Item" form:
   - **Item Name** (required) - e.g., "Milk", "Chicken Breast"
   - **Quantity** (required) - How many/much you have
   - **Unit** - count, lbs, oz, gal, qt, pt, cup, pkg, can, box
   - **Category** (required) - Select from 10 categories
   - **Location** (required) - Where it's stored
   - **Expiration Date** (optional) - When it expires
   - **Notes** (optional) - Any additional info

2. Click "Add to Inventory"

### Managing Items

- **Use One** - Decrements quantity by 1 (removes if last one)
- **Edit** - Loads item into form for editing (original is deleted)
- **Delete** - Removes item from inventory (with confirmation)

### Filtering & Sorting

**Filters:**
- Filter by Category (All, Dairy, Produce, Meat, etc.)
- Filter by Location (All, Fridge, Freezer, Pantry, etc.)

**Sort Options:**
- Name (A-Z or Z-A)
- Expiration (Soonest or Latest)
- Category
- Location
- Recently Added

**Quick Filters:**
- **Expiring Soon** - Shows items expiring in next 7 days
- **Expired Items** - Shows items past expiration
- **Show All** - Resets all filters

### Data Management

**Export:**
- Click "Export Data" to download a JSON file
- Use for backups or sharing between devices
- File named: `pantry-inventory-YYYY-MM-DD.json`

**Import:**
- Click "Import Data" and select a JSON file
- Replaces current inventory (export first if needed)

**Clear All:**
- Deletes all inventory data
- Double confirmation required
- **CAUTION:** This cannot be undone

## Technical Details

### Technology Stack
- Pure HTML5, CSS3, JavaScript
- Zero dependencies
- localStorage for data persistence
- Responsive CSS Grid and Flexbox layout

### Browser Compatibility
- Chrome/Edge (recommended)
- Firefox
- Safari
- Any modern browser with localStorage support

### Data Structure

Each inventory item is stored as:
```json
{
  "id": "unique-id",
  "name": "Milk",
  "quantity": 2,
  "unit": "gal",
  "category": "dairy",
  "location": "fridge",
  "expiration": "2026-02-27",
  "notes": "Whole milk from Costco",
  "addedDate": 1708473600000
}
```

### Categories & Locations

**Categories:**
- 🥛 Dairy & Eggs
- 🥬 Produce
- 🥩 Meat & Seafood
- 🥫 Pantry Staples
- 🧊 Frozen
- 🍿 Snacks
- 🥤 Beverages
- 🧂 Condiments & Sauces
- 🍪 Baking
- 📦 Other

**Locations:**
- 🧊 Refrigerator
- ❄️ Freezer
- 🚪 Pantry
- 🗄️ Cabinet
- 🪑 Counter

## Roadmap - Future Phases

This is **Phase 1** of a multi-phase project:

### Phase 2 - Recipe Book (Planned)
- Store and organize favorite recipes
- Tag recipes with ingredients
- Link recipes to inventory items

### Phase 3 - Meal Planner (Planned)
- Weekly meal planning
- Suggest recipes based on available inventory
- Prioritize items expiring soon

### Phase 4 - Shopping List (Planned)
- Auto-generate shopping lists
- Compare planned meals vs current inventory
- Track missing ingredients

## Project Info

- **Built By:** Forge (dev agent)
- **Built For:** Tyler & Hanna McShea
- **Date:** February 20, 2026
- **Project:** tyler-projects (Phase 1 of Pantry & Meal Planner)
- **Tech Stack:** HTML, CSS, JavaScript (zero dependencies)

## License

Personal use for Tyler & Hanna McShea.
