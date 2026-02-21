/**
 * Pantry Tracker - Phase 1: Inventory Management
 * A simple, mobile-friendly kitchen inventory system for Tyler & Hanna
 * Uses localStorage for data persistence
 */

// ========================================
// DATA MANAGEMENT
// ========================================

/**
 * Load inventory from localStorage
 * @returns {Array} Array of inventory items
 */
function loadInventory() {
    const data = localStorage.getItem('pantry-inventory');
    return data ? JSON.parse(data) : [];
}

/**
 * Save inventory to localStorage
 * @param {Array} inventory - Array of inventory items
 */
function saveInventory(inventory) {
    localStorage.setItem('pantry-inventory', JSON.stringify(inventory));
}

/**
 * Generate a unique ID for new items
 * @returns {string} Unique identifier
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ========================================
// CATEGORY & LOCATION HELPERS
// ========================================

const CATEGORY_EMOJIS = {
    'dairy': '🥛',
    'produce': '🥬',
    'meat': '🥩',
    'pantry': '🥫',
    'frozen': '🧊',
    'snacks': '🍿',
    'beverages': '🥤',
    'condiments': '🧂',
    'baking': '🍪',
    'other': '📦'
};

const LOCATION_EMOJIS = {
    'fridge': '🧊',
    'freezer': '❄️',
    'pantry': '🚪',
    'cabinet': '🗄️',
    'counter': '🪑'
};

const CATEGORY_LABELS = {
    'dairy': 'Dairy & Eggs',
    'produce': 'Produce',
    'meat': 'Meat & Seafood',
    'pantry': 'Pantry Staples',
    'frozen': 'Frozen',
    'snacks': 'Snacks',
    'beverages': 'Beverages',
    'condiments': 'Condiments & Sauces',
    'baking': 'Baking',
    'other': 'Other'
};

const LOCATION_LABELS = {
    'fridge': 'Refrigerator',
    'freezer': 'Freezer',
    'pantry': 'Pantry',
    'cabinet': 'Cabinet',
    'counter': 'Counter'
};

// ========================================
// DATE HELPERS
// ========================================

/**
 * Check if a date is expired
 * @param {string} expirationDate - ISO date string
 * @returns {boolean} True if expired
 */
function isExpired(expirationDate) {
    if (!expirationDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expDate = new Date(expirationDate);
    return expDate < today;
}

/**
 * Check if a date is expiring soon (within 7 days)
 * @param {string} expirationDate - ISO date string
 * @returns {boolean} True if expiring soon
 */
function isExpiringSoon(expirationDate) {
    if (!expirationDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expDate = new Date(expirationDate);
    const sevenDays = new Date(today);
    sevenDays.setDate(sevenDays.getDate() + 7);
    return expDate >= today && expDate <= sevenDays;
}

/**
 * Format a date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ========================================
// FILTERING & SORTING
// ========================================

/**
 * Filter inventory based on criteria
 * @param {Array} inventory - Full inventory
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered inventory
 */
function filterInventory(inventory, filters) {
    return inventory.filter(item => {
        // Category filter
        if (filters.category !== 'all' && item.category !== filters.category) {
            return false;
        }

        // Location filter
        if (filters.location !== 'all' && item.location !== filters.location) {
            return false;
        }

        // Special filters
        if (filters.expiringSoon && !isExpiringSoon(item.expiration)) {
            return false;
        }

        if (filters.expired && !isExpired(item.expiration)) {
            return false;
        }

        return true;
    });
}

/**
 * Sort inventory based on criteria
 * @param {Array} inventory - Inventory to sort
 * @param {string} sortBy - Sort criteria
 * @returns {Array} Sorted inventory
 */
function sortInventory(inventory, sortBy) {
    const sorted = [...inventory];

    switch (sortBy) {
        case 'name-asc':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'name-desc':
            return sorted.sort((a, b) => b.name.localeCompare(a.name));
        case 'expiration-asc':
            return sorted.sort((a, b) => {
                if (!a.expiration) return 1;
                if (!b.expiration) return -1;
                return new Date(a.expiration) - new Date(b.expiration);
            });
        case 'expiration-desc':
            return sorted.sort((a, b) => {
                if (!a.expiration) return 1;
                if (!b.expiration) return -1;
                return new Date(b.expiration) - new Date(a.expiration);
            });
        case 'category':
            return sorted.sort((a, b) => a.category.localeCompare(b.category));
        case 'location':
            return sorted.sort((a, b) => a.location.localeCompare(b.location));
        case 'added-desc':
            return sorted.sort((a, b) => b.addedDate - a.addedDate);
        default:
            return sorted;
    }
}

// ========================================
// UI RENDERING
// ========================================

/**
 * Render the inventory list
 * @param {Array} inventory - Inventory items to render
 */
function renderInventory(inventory) {
    const inventoryList = document.getElementById('inventory-list');
    const emptyState = document.getElementById('empty-state');

    if (inventory.length === 0) {
        inventoryList.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }

    inventoryList.classList.remove('hidden');
    emptyState.classList.add('hidden');

    inventoryList.innerHTML = inventory.map(item => {
        const expirationBadge = item.expiration
            ? `<span class="meta-badge ${isExpired(item.expiration) ? 'badge-expired' : isExpiringSoon(item.expiration) ? 'badge-expiring' : 'badge-expiration'}">
                ${isExpired(item.expiration) ? '🚨 Expired' : isExpiringSoon(item.expiration) ? '⚠️ ' : '📅 '} ${formatDate(item.expiration)}
               </span>`
            : '';

        return `
            <div class="inventory-item" data-id="${item.id}">
                <div class="item-header">
                    <div class="item-name">${item.name}</div>
                    <div class="item-quantity">${item.quantity} ${item.unit}</div>
                </div>
                <div class="item-meta">
                    <span class="meta-badge badge-category">${CATEGORY_EMOJIS[item.category]} ${CATEGORY_LABELS[item.category]}</span>
                    <span class="meta-badge badge-location">${LOCATION_EMOJIS[item.location]} ${LOCATION_LABELS[item.location]}</span>
                    ${expirationBadge}
                </div>
                ${item.notes ? `<div class="item-notes">📝 ${item.notes}</div>` : ''}
                <div class="item-actions">
                    <button class="btn-use" onclick="useItem('${item.id}')">✓ Use One</button>
                    <button class="btn-edit" onclick="editItem('${item.id}')">✏️ Edit</button>
                    <button class="btn-delete" onclick="deleteItem('${item.id}')">🗑️ Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Update stats display
 * @param {Array} inventory - Full inventory
 */
function updateStats(inventory) {
    document.getElementById('total-items').textContent = inventory.length;
    document.getElementById('expiring-soon').textContent = inventory.filter(item => isExpiringSoon(item.expiration)).length;
    document.getElementById('expired-count').textContent = inventory.filter(item => isExpired(item.expiration)).length;
}

/**
 * Refresh the display with current filters and sorting
 */
function refreshDisplay() {
    const inventory = loadInventory();
    const filters = {
        category: document.getElementById('filter-category').value,
        location: document.getElementById('filter-location').value
    };
    const sortBy = document.getElementById('sort-by').value;

    const filtered = filterInventory(inventory, filters);
    const sorted = sortInventory(filtered, sortBy);

    renderInventory(sorted);
    updateStats(inventory);
}

// ========================================
// ITEM ACTIONS
// ========================================

/**
 * Add a new item to inventory
 * @param {Object} itemData - Item data from form
 */
function addItem(itemData) {
    const inventory = loadInventory();
    const newItem = {
        id: generateId(),
        ...itemData,
        addedDate: Date.now()
    };
    inventory.push(newItem);
    saveInventory(inventory);
    refreshDisplay();
}

/**
 * Delete an item from inventory
 * @param {string} itemId - ID of item to delete
 */
function deleteItem(itemId) {
    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }

    const inventory = loadInventory();
    const filtered = inventory.filter(item => item.id !== itemId);
    saveInventory(filtered);
    refreshDisplay();
}

/**
 * Use one unit of an item (decrement quantity)
 * @param {string} itemId - ID of item to use
 */
function useItem(itemId) {
    const inventory = loadInventory();
    const item = inventory.find(i => i.id === itemId);

    if (!item) return;

    if (item.quantity > 1) {
        item.quantity--;
        saveInventory(inventory);
        refreshDisplay();
    } else {
        if (confirm('This is the last one. Remove from inventory?')) {
            deleteItem(itemId);
        }
    }
}

/**
 * Edit an existing item
 * @param {string} itemId - ID of item to edit
 */
function editItem(itemId) {
    const inventory = loadInventory();
    const item = inventory.find(i => i.id === itemId);

    if (!item) return;

    // Populate form with item data
    document.getElementById('item-name').value = item.name;
    document.getElementById('item-quantity').value = item.quantity;
    document.getElementById('item-unit').value = item.unit;
    document.getElementById('item-category').value = item.category;
    document.getElementById('item-location').value = item.location;
    document.getElementById('item-expiration').value = item.expiration || '';
    document.getElementById('item-notes').value = item.notes || '';

    // Delete the old item
    deleteItem(itemId);

    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========================================
// DATA EXPORT/IMPORT
// ========================================

/**
 * Export inventory data as JSON file
 */
function exportData() {
    const inventory = loadInventory();
    const dataStr = JSON.stringify(inventory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pantry-inventory-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

/**
 * Import inventory data from JSON file
 * @param {File} file - JSON file to import
 */
function importData(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const imported = JSON.parse(e.target.result);
            if (Array.isArray(imported)) {
                if (confirm(`Import ${imported.length} items? This will replace your current inventory.`)) {
                    saveInventory(imported);
                    refreshDisplay();
                    alert('Import successful!');
                }
            } else {
                alert('Invalid data format. Please select a valid JSON file.');
            }
        } catch (error) {
            alert('Error reading file. Please select a valid JSON file.');
        }
    };
    reader.readAsText(file);
}

/**
 * Clear all inventory data
 */
function clearAllData() {
    if (confirm('⚠️ WARNING: This will delete ALL inventory data. This cannot be undone. Are you sure?')) {
        if (confirm('Really delete everything? Consider exporting first.')) {
            localStorage.removeItem('pantry-inventory');
            refreshDisplay();
        }
    }
}

// ========================================
// EVENT LISTENERS
// ========================================

document.addEventListener('DOMContentLoaded', function () {
    // Initial render
    refreshDisplay();

    // Add item form submission
    document.getElementById('add-item-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const itemData = {
            name: document.getElementById('item-name').value.trim(),
            quantity: parseInt(document.getElementById('item-quantity').value),
            unit: document.getElementById('item-unit').value,
            category: document.getElementById('item-category').value,
            location: document.getElementById('item-location').value,
            expiration: document.getElementById('item-expiration').value || null,
            notes: document.getElementById('item-notes').value.trim() || null
        };

        addItem(itemData);

        // Reset form
        e.target.reset();
        document.getElementById('item-quantity').value = '1';
    });

    // Filter and sort controls
    document.getElementById('filter-category').addEventListener('change', refreshDisplay);
    document.getElementById('filter-location').addEventListener('change', refreshDisplay);
    document.getElementById('sort-by').addEventListener('change', refreshDisplay);

    // Quick filters
    document.getElementById('show-expiring').addEventListener('click', function () {
        const inventory = loadInventory();
        const expiring = inventory.filter(item => isExpiringSoon(item.expiration));
        renderInventory(expiring);
    });

    document.getElementById('show-expired').addEventListener('click', function () {
        const inventory = loadInventory();
        const expired = inventory.filter(item => isExpired(item.expiration));
        renderInventory(expired);
    });

    document.getElementById('show-all').addEventListener('click', function () {
        document.getElementById('filter-category').value = 'all';
        document.getElementById('filter-location').value = 'all';
        refreshDisplay();
    });

    // Data management
    document.getElementById('export-data').addEventListener('click', exportData);

    document.getElementById('import-data').addEventListener('click', function () {
        document.getElementById('import-file').click();
    });

    document.getElementById('import-file').addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            importData(file);
        }
    });

    document.getElementById('clear-all').addEventListener('click', clearAllData);
});
