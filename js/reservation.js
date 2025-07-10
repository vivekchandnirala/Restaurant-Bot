// Global variables
let restaurants = [];
let selectedRestaurant = null;

// Initialize the reservation page
document.addEventListener('DOMContentLoaded', function() {
    loadRestaurants();
    setupEventListeners();
    setupDateRestrictions();
    
    // Check if restaurant is specified in URL
    const restaurantId = getUrlParameter('restaurant');
    if (restaurantId) {
        setTimeout(() => {
            const restaurantSelect = document.getElementById('restaurant');
            if (restaurantSelect) {
                restaurantSelect.value = restaurantId;
                selectedRestaurant = restaurants.find(r => r._id === restaurantId);
            }
        }, 1000);
    }
});

// Setup event listeners
function setupEventListeners() {
    const reservationForm = document.getElementById('reservationForm');
    const restaurantSelect = document.getElementById('restaurant');
    
    if (reservationForm) {
        reservationForm.addEventListener('submit', handleReservationSubmit);
    }
    
    if (restaurantSelect) {
        restaurantSelect.addEventListener('change', function() {
            const restaurantId = this.value;
            selectedRestaurant = restaurants.find(r => r._id === restaurantId);
        });
    }
}

// Setup date restrictions
function setupDateRestrictions() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        // Set minimum date to today
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        dateInput.min = todayStr;
        
        // Set maximum date to 3 months from today
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        const maxDateStr = maxDate.toISOString().split('T')[0];
        dateInput.max = maxDateStr;
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
        displayRestaurantInfo();
    } catch (error) {
        console.error('Error loading restaurants:', error);
        showError('Failed to load restaurants');
    }
}

// Populate restaurant select dropdown
function populateRestaurantSelect() {
    const restaurantSelect = document.getElementById('restaurant');
    if (!restaurantSelect) return;
    
    restaurantSelect.innerHTML = '<option value="">Select Restaurant</option>';
    restaurants.forEach(restaurant => {
        const option = document.createElement('option');
        option.value = restaurant._id;
        option.textContent = restaurant.name;
        restaurantSelect.appendChild(option);
    });
}

// Display restaurant information
function displayRestaurantInfo() {
    const container = document.getElementById('restaurantInfo');
    if (!container) return;
    
    container.innerHTML = restaurants.map(restaurant => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100">
                <img src="${restaurant.image}" class="card-img-top" alt="${restaurant.name}">
                <div class="card-body">
                    <h5 class="card-title">${restaurant.name}</h5>
                    <p class="card-text">${restaurant.description}</p>
                    <div class="restaurant-info">
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
                    </div>
                    <div class="mt-3">
                        ${restaurant.serviceOptions.map(option => 
                            `<span class="badge bg-secondary me-1">${option}</span>`
                        ).join('')}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Handle reservation form submission
async function handleReservationSubmit(e) {
    e.preventDefault();
    
    const formData = {
        customerName: document.getElementById('customerName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        restaurantId: document.getElementById('restaurant').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        guests: parseInt(document.getElementById('guests').value),
        specialRequests: document.getElementById('specialRequests').value.trim()
    };
    
    // Validate form data
    if (!validateReservationData(formData)) {
        return;
    }
    
    try {
        showLoading();
        const response = await fetch('/api/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create reservation');
        }
        
        const result = await response.json();
        showSuccessModal(result.reservation);
        document.getElementById('reservationForm').reset();
        
    } catch (error) {
        console.error('Error creating reservation:', error);
        showError(error.message || 'Failed to create reservation');
    } finally {
        hideLoading();
    }
}

// Validate reservation data
function validateReservationData(data) {
    const errors = [];
    
    if (!data.customerName) errors.push('Customer name is required');
    if (!data.email) errors.push('Email is required');
    if (!data.phone) errors.push('Phone number is required');
    if (!data.restaurantId) errors.push('Please select a restaurant');
    if (!data.date) errors.push('Date is required');
    if (!data.time) errors.push('Time is required');
    if (!data.guests || data.guests < 1) errors.push('Number of guests is required');
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Validate phone format
    const phoneRegex = /^[0-9]{10}$/;
    if (data.phone && !phoneRegex.test(data.phone.replace(/\s/g, ''))) {
        errors.push('Please enter a valid 10-digit phone number');
    }
    
    // Validate date (must be today or future)
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        errors.push('Reservation date must be today or in the future');
    }
    
    if (errors.length > 0) {
        showError(errors.join('<br>'));
        return false;
    }
    
    return true;
}

// Show success modal
function showSuccessModal(reservation) {
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    const reservationDetails = document.getElementById('reservationDetails');
    
    const restaurant = restaurants.find(r => r._id === reservation.restaurantId);
    
    reservationDetails.innerHTML = `
        <div class="reservation-summary">
            <h6>Reservation Details:</h6>
            <p><strong>Restaurant:</strong> ${restaurant ? restaurant.name : 'N/A'}</p>
            <p><strong>Date:</strong> ${formatDate(reservation.date)}</p>
            <p><strong>Time:</strong> ${reservation.time}</p>
            <p><strong>Guests:</strong> ${reservation.guests}</p>
            <p><strong>Customer:</strong> ${reservation.customerName}</p>
            <p><strong>Contact:</strong> ${reservation.phone}</p>
            ${reservation.specialRequests ? `<p><strong>Special Requests:</strong> ${reservation.specialRequests}</p>` : ''}
        </div>
        <div class="alert alert-info mt-3">
            <i class="fas fa-info-circle"></i> 
            Please save this confirmation for your records. The restaurant will contact you to confirm your reservation.
        </div>
    `;
    
    modal.show();
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
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger alert-dismissible fade show position-fixed';
    alert.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 400px;';
    alert.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 8000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}
