// Global variables
let restaurants = [];
let menuItems = [];
let filteredMenuItems = [];
let selectedRestaurant = null;
let cart = [];
let activeCategory = 'all';

// Initialize the menu page
document.addEventListener('DOMContentLoaded', function() {
    loadRestaurants();
    setupEventListeners();
    
    // Check if restaurant is specified in URL
    const restaurantId = getUrlParameter('restaurant');
    if (restaurantId) {
        setTimeout(() => {
            const restaurantSelect = document.getElementById('restaurantSelect');
            if (restaurantSelect) {
                restaurantSelect.value = restaurantId;
                loadMenu(restaurantId);
            }
        }, 1000);
    }
});

// Setup event listeners
function setupEventListeners() {
    const restaurantSelect = document.getElementById('restaurantSelect');
    const categoryFilters = document.getElementById('categoryFilters');
    const vegOnlyFilter = document.getElementById('vegOnlyFilter');
    
    if (restaurantSelect) {
        restaurantSelect.addEventListener('change', function() {
            const restaurantId = this.value;
            if (restaurantId) {
                loadMenu(restaurantId);
            } else {
                clearMenu();
            }
        });
    }
    
    if (categoryFilters) {
        categoryFilters.addEventListener('click', function(e) {
            if (e.target.tagName === 'BUTTON') {
                const category = e.target.getAttribute('data-category');
                filterByCategory(category);
                
                // Update active button
                categoryFilters.querySelectorAll('.btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');
            }
        });
    }
    
    if (vegOnlyFilter) {
        vegOnlyFilter.addEventListener('change', function() {
            filterMenuItems();
        });
    }
}

// Load restaurants
async function loadRestaurants() {
    try {
        const response = await fetch('/api/restaurants');
        if (!response.ok) {
            throw new Error('Failed to fetch restaurants');
        }
        
        restaurants = await response.json();
        populateRestaurantSelect();
    } catch (error) {
        console.error('Error loading restaurants:', error);
        showError('Failed to load restaurants');
    }
}

// Populate restaurant select dropdown
function populateRestaurantSelect() {
    const restaurantSelect = document.getElementById('restaurantSelect');
    if (!restaurantSelect) return;
    
    restaurantSelect.innerHTML = '<option value="">Select Restaurant</option>';
    restaurants.forEach(restaurant => {
        const option = document.createElement('option');
        option.value = restaurant._id;
        option.textContent = restaurant.name;
        restaurantSelect.appendChild(option);
    });
}

// Load menu for selected restaurant
async function loadMenu(restaurantId) {
    try {
        showLoading();
        const response = await fetch(`/api/menu/${restaurantId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch menu');
        }
        
        menuItems = await response.json();
        filteredMenuItems = menuItems;
        selectedRestaurant = restaurants.find(r => r._id === restaurantId);
        
        updateRestaurantName();
        displayMenuItems();
        updateCart();
    } catch (error) {
        console.error('Error loading menu:', error);
        showError('Failed to load menu');
    } finally {
        hideLoading();
    }
}

// Update restaurant name display
function updateRestaurantName() {
    const restaurantNameElement = document.getElementById('restaurantName');
    if (restaurantNameElement && selectedRestaurant) {
        restaurantNameElement.textContent = selectedRestaurant.name;
    }
}

// Display menu items
function displayMenuItems() {
    const container = document.getElementById('menuItems');
    if (!container) return;
    
    if (filteredMenuItems.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i> No menu items found.
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredMenuItems.map(item => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card menu-item h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title">${item.name}</h5>
                        <div class="text-end">
                            <i class="fas fa-circle ${item.isVeg ? 'veg-indicator' : 'non-veg-indicator'}"></i>
                        </div>
                    </div>
                    <p class="card-text">${item.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="text-primary mb-0">₹${item.price}</h6>
                            <small class="text-muted">${item.category}</small>
                        </div>
                        <div class="btn-group" role="group">
                            <button class="btn btn-outline-primary btn-sm" onclick="removeFromCart('${item._id}')">
                                <i class="fas fa-minus"></i>
                            </button>
                            <button class="btn btn-outline-primary btn-sm" disabled>
                                <span id="qty-${item._id}">${getCartQuantity(item._id)}</span>
                            </button>
                            <button class="btn btn-outline-primary btn-sm" onclick="addToCart('${item._id}')">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter by category
function filterByCategory(category) {
    activeCategory = category;
    filterMenuItems();
}

// Filter menu items
function filterMenuItems() {
    const vegOnlyFilter = document.getElementById('vegOnlyFilter');
    const vegOnly = vegOnlyFilter ? vegOnlyFilter.checked : false;
    
    filteredMenuItems = menuItems.filter(item => {
        const categoryMatch = activeCategory === 'all' || item.category === activeCategory;
        const vegMatch = !vegOnly || item.isVeg;
        return categoryMatch && vegMatch;
    });
    
    displayMenuItems();
}

// Cart functions
function addToCart(itemId) {
    const item = menuItems.find(i => i._id === itemId);
    if (!item) return;
    
    const existingItem = cart.find(c => c.menuItemId === itemId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            menuItemId: itemId,
            name: item.name,
            price: item.price,
            quantity: 1
        });
    }
    
    updateCart();
    updateQuantityDisplay(itemId);
}

function removeFromCart(itemId) {
    const existingItem = cart.find(c => c.menuItemId === itemId);
    if (existingItem) {
        if (existingItem.quantity > 1) {
            existingItem.quantity -= 1;
        } else {
            cart = cart.filter(c => c.menuItemId !== itemId);
        }
    }
    
    updateCart();
    updateQuantityDisplay(itemId);
}

function getCartQuantity(itemId) {
    const item = cart.find(c => c.menuItemId === itemId);
    return item ? item.quantity : 0;
}

function updateQuantityDisplay(itemId) {
    const qtyElement = document.getElementById(`qty-${itemId}`);
    if (qtyElement) {
        qtyElement.textContent = getCartQuantity(itemId);
    }
}

// Update cart display
function updateCart() {
    const cartSummary = document.getElementById('cartSummary');
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        if (cartSummary) cartSummary.style.display = 'none';
        return;
    }
    
    if (cartSummary) cartSummary.style.display = 'block';
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (cartCount) cartCount.textContent = totalItems;
    if (cartTotal) cartTotal.textContent = totalAmount;
    
    if (cartItems) {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div>
                    <small>${item.name}</small><br>
                    <small class="text-muted">${item.quantity} × ₹${item.price}</small>
                </div>
                <div>
                    <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart('${item.menuItemId}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    // Store cart in localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('selectedRestaurant', JSON.stringify(selectedRestaurant));
}

// Proceed to order
function proceedToOrder() {
    if (cart.length === 0) {
        showError('Your cart is empty. Please add items to proceed.');
        return;
    }
    
    window.location.href = '/order';
}

// Clear menu
function clearMenu() {
    const container = document.getElementById('menuItems');
    const restaurantName = document.getElementById('restaurantName');
    
    if (container) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-muted">Please select a restaurant to view the menu</p>
            </div>
        `;
    }
    
    if (restaurantName) {
        restaurantName.textContent = 'Select a restaurant to view menu';
    }
    
    menuItems = [];
    filteredMenuItems = [];
    selectedRestaurant = null;
}

// Initialize cart from localStorage
document.addEventListener('DOMContentLoaded', function() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
});

// Utility functions
function showLoading() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = 'block';
    }
}

function hideLoading() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = 'none';
    }
}

function showError(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger alert-dismissible fade show position-fixed';
    alert.style.cssText = 'top: 20px; right: 20px; z-index: 9999;';
    alert.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}
