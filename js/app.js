// Global variables
let restaurants = [];
let filteredRestaurants = [];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadRestaurants();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

// Load restaurants from API
async function loadRestaurants() {
    try {
        showLoading();
        const response = await fetch('/api/restaurants');
        
        if (!response.ok) {
            throw new Error('Failed to fetch restaurants');
        }
        
        restaurants = await response.json();
        filteredRestaurants = restaurants;
        displayRestaurants(restaurants);
    } catch (error) {
        console.error('Error loading restaurants:', error);
        showError('Failed to load restaurants. Please try again.');
    } finally {
        hideLoading();
    }
}

// Display restaurants
function displayRestaurants(restaurantList) {
    const container = document.getElementById('restaurantsList');
    if (!container) return;
    
    if (restaurantList.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i> No restaurants found matching your search criteria.
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = restaurantList.map(restaurant => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card restaurant-card h-100">
                <img src="${restaurant.image}" class="card-img-top" alt="${restaurant.name}">
                <div class="card-body">
                    <h5 class="card-title">${restaurant.name}</h5>
                    <p class="card-text text-truncate-2">${restaurant.description}</p>
                    <div class="restaurant-info mb-3">
                        <div class="d-flex align-items-center mb-2">
                            <i class="fas fa-map-marker-alt text-primary me-2"></i>
                            <small>${restaurant.address}</small>
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <i class="fas fa-clock text-primary me-2"></i>
                            <small>${restaurant.hours}</small>
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <i class="fas fa-phone text-primary me-2"></i>
                            <small>${restaurant.phone}</small>
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <i class="fas fa-rupee-sign text-primary me-2"></i>
                            <small>${restaurant.priceRange}</small>
                        </div>
                        <div class="d-flex align-items-center">
                            <i class="fas fa-star restaurant-rating me-1"></i>
                            <small>${restaurant.rating}/5</small>
                        </div>
                    </div>
                    <div class="mb-3">
                        ${restaurant.serviceOptions.map(option => 
                            `<span class="badge bg-secondary me-1">${option}</span>`
                        ).join('')}
                    </div>
                </div>
                <div class="card-footer">
                    <div class="d-grid gap-2">
                        <button class="btn btn-primary btn-sm" onclick="viewMenu('${restaurant._id}')">
                            <i class="fas fa-book"></i> View Menu
                        </button>
                        <button class="btn btn-outline-primary btn-sm" onclick="makeReservation('${restaurant._id}')">
                            <i class="fas fa-calendar-alt"></i> Make Reservation
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Perform search
function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (!searchTerm) {
        filteredRestaurants = restaurants;
    } else {
        filteredRestaurants = restaurants.filter(restaurant =>
            restaurant.name.toLowerCase().includes(searchTerm) ||
            restaurant.address.toLowerCase().includes(searchTerm) ||
            restaurant.description.toLowerCase().includes(searchTerm) ||
            restaurant.cuisine.toLowerCase().includes(searchTerm)
        );
    }
    
    displayRestaurants(filteredRestaurants);
}

// View menu
function viewMenu(restaurantId) {
    window.location.href = `/menu?restaurant=${restaurantId}`;
}

// Make reservation
function makeReservation(restaurantId) {
    window.location.href = `/reserve?restaurant=${restaurantId}`;
}

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
    const container = document.getElementById('restaurantsList');
    if (container) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle"></i> ${message}
                </div>
            </div>
        `;
    }
}

function showSuccess(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-success alert-dismissible fade show position-fixed';
    alert.style.cssText = 'top: 20px; right: 20px; z-index: 9999;';
    alert.innerHTML = `
        <i class="fas fa-check-circle"></i> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Format date
function formatDate(date) {
    return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

// Get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}
