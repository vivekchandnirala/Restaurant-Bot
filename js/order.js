// Global variables
let cart = [];
let selectedRestaurant = null;
let orderTotal = 0;

// Initialize the order page
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromStorage();
    setupEventListeners();
    updateOrderDisplay();
    calculateTotal();
});

// Setup event listeners
function setupEventListeners() {
    const orderForm = document.getElementById('orderForm');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const deliveryTypeSelect = document.getElementById('deliveryType');
    
    if (orderForm) {
        orderForm.addEventListener('input', validateForm);
        orderForm.addEventListener('change', validateForm);
    }
    
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', handlePlaceOrder);
    }
    
    if (deliveryTypeSelect) {
        deliveryTypeSelect.addEventListener('change', function() {
            toggleAddressSection();
            calculateTotal();
        });
    }
    
    // Initialize address section visibility
    toggleAddressSection();
}

// Load cart from localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    const savedRestaurant = localStorage.getItem('selectedRestaurant');
    
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    
    if (savedRestaurant) {
        selectedRestaurant = JSON.parse(savedRestaurant);
    }
}

// Update order display
function updateOrderDisplay() {
    const orderItemsContainer = document.getElementById('orderItems');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    
    if (!orderItemsContainer) return;
    
    if (cart.length === 0) {
        orderItemsContainer.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle"></i> 
                No items in your order. <a href="/menu" class="alert-link">Browse menu</a> to add items.
            </div>
        `;
        
        if (placeOrderBtn) {
            placeOrderBtn.disabled = true;
        }
        return;
    }
    
    orderItemsContainer.innerHTML = `
        <div class="restaurant-info mb-3">
            <h6 class="text-primary">
                <i class="fas fa-store"></i> ${selectedRestaurant ? selectedRestaurant.name : 'Restaurant'}
            </h6>
            ${selectedRestaurant ? `<small class="text-muted">${selectedRestaurant.address}</small>` : ''}
        </div>
        <div class="order-items">
            ${cart.map(item => `
                <div class="order-item d-flex justify-content-between align-items-center py-2 border-bottom">
                    <div class="flex-grow-1">
                        <h6 class="mb-1">${item.name}</h6>
                        <small class="text-muted">₹${item.price} × ${item.quantity}</small>
                    </div>
                    <div class="d-flex align-items-center">
                        <button class="btn btn-sm btn-outline-danger me-2" onclick="removeFromCart('${item.menuItemId}')">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="mx-2">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-success me-3" onclick="addToCart('${item.menuItemId}')">
                            <i class="fas fa-plus"></i>
                        </button>
                        <strong>₹${item.price * item.quantity}</strong>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Cart management functions
function addToCart(itemId) {
    const existingItem = cart.find(c => c.menuItemId === itemId);
    if (existingItem) {
        existingItem.quantity += 1;
    }
    
    updateCart();
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
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateOrderDisplay();
    calculateTotal();
    validateForm();
}

// Toggle address section based on delivery type
function toggleAddressSection() {
    const deliveryType = document.getElementById('deliveryType');
    const addressSection = document.getElementById('addressSection');
    const addressInput = document.getElementById('address');
    
    if (deliveryType && addressSection && addressInput) {
        if (deliveryType.value === 'pickup') {
            addressSection.style.display = 'none';
            addressInput.removeAttribute('required');
        } else {
            addressSection.style.display = 'block';
            addressInput.setAttribute('required', 'required');
        }
    }
}

// Calculate total
function calculateTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryType = document.getElementById('deliveryType');
    const deliveryFee = deliveryType && deliveryType.value === 'pickup' ? 0 : 50;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + deliveryFee + tax;
    
    orderTotal = total;
    
    // Update display
    const subtotalElement = document.getElementById('subtotal');
    const deliveryFeeElement = document.getElementById('deliveryFee');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    
    if (subtotalElement) subtotalElement.textContent = subtotal;
    if (deliveryFeeElement) deliveryFeeElement.textContent = deliveryFee;
    if (taxElement) taxElement.textContent = tax;
    if (totalElement) totalElement.textContent = total;
}

// Validate form
function validateForm() {
    const customerName = document.getElementById('customerName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const deliveryType = document.getElementById('deliveryType').value;
    const address = document.getElementById('address').value.trim();
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    
    let isValid = true;
    
    // Check required fields
    if (!customerName || !email || !phone || !deliveryType) {
        isValid = false;
    }
    
    // Check address for delivery
    if (deliveryType === 'delivery' && !address) {
        isValid = false;
    }
    
    // Check if cart has items
    if (cart.length === 0) {
        isValid = false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        isValid = false;
    }
    
    // Validate phone format
    const phoneRegex = /^[0-9]{10}$/;
    if (phone && !phoneRegex.test(phone.replace(/\s/g, ''))) {
        isValid = false;
    }
    
    if (placeOrderBtn) {
        placeOrderBtn.disabled = !isValid;
    }
    
    return isValid;
}

// Handle place order
async function handlePlaceOrder() {
    if (!validateForm()) {
        showError('Please fill in all required fields correctly.');
        return;
    }
    
    const orderData = {
        customerName: document.getElementById('customerName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        address: document.getElementById('address').value.trim(),
        restaurantId: selectedRestaurant ? selectedRestaurant._id : null,
        items: cart,
        deliveryType: document.getElementById('deliveryType').value
    };
    
    // Validate order data
    if (!orderData.restaurantId) {
        showError('Restaurant information is missing. Please go back to menu and select items.');
        return;
    }
    
    try {
        showLoading();
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to place order');
        }
        
        const result = await response.json();
        
        // Clear cart
        cart = [];
        localStorage.removeItem('cart');
        localStorage.removeItem('selectedRestaurant');
        
        // Show success modal
        showSuccessModal(result.order);
        
        // Reset form
        document.getElementById('orderForm').reset();
        updateOrderDisplay();
        calculateTotal();
        
    } catch (error) {
        console.error('Error placing order:', error);
        showError(error.message || 'Failed to place order. Please try again.');
    } finally {
        hideLoading();
    }
}

// Show success modal
function showSuccessModal(order) {
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    const orderDetails = document.getElementById('orderDetails');
    
    orderDetails.innerHTML = `
        <div class="order-summary">
            <h6>Order Details:</h6>
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Restaurant:</strong> ${selectedRestaurant ? selectedRestaurant.name : 'N/A'}</p>
            <p><strong>Customer:</strong> ${order.customerName}</p>
            <p><strong>Phone:</strong> ${order.phone}</p>
            <p><strong>Delivery Type:</strong> ${order.deliveryType === 'delivery' ? 'Home Delivery' : 'Restaurant Pickup'}</p>
            ${order.deliveryType === 'delivery' ? `<p><strong>Address:</strong> ${order.address}</p>` : ''}
            <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
            <p><strong>Status:</strong> <span class="badge bg-warning">Pending</span></p>
        </div>
        <div class="alert alert-success mt-3">
            <i class="fas fa-check-circle"></i> 
            Your order has been placed successfully! You will receive a confirmation call shortly.
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

function showSuccess(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-success alert-dismissible fade show position-fixed';
    alert.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 400px;';
    alert.innerHTML = `
        <i class="fas fa-check-circle"></i> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Initialize form validation on page load
document.addEventListener('DOMContentLoaded', function() {
    validateForm();
});
