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
    const customerName = document.getElementById('customerName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const deliveryType = document.getElementById('deliveryType');
    const address = document.getElementById('address');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    
    let isValid = true;
    
    // Check if cart has items
    if (cart.length === 0) {
        isValid = false;
    }
    
    // Check required fields only if elements exist
    if (!customerName || !customerName.value.trim()) {
        isValid = false;
    }
    
    if (!email || !email.value.trim()) {
        isValid = false;
    }
    
    if (!phone || !phone.value.trim()) {
        isValid = false;
    }
    
    if (!deliveryType || !deliveryType.value) {
        isValid = false;
    }
    
    // Check address for delivery
    if (deliveryType && deliveryType.value === 'delivery' && (!address || !address.value.trim())) {
        isValid = false;
    }
    
    // Validate email format
    if (email && email.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            isValid = false;
        }
    }
    
    // Validate phone format
    if (phone && phone.value.trim()) {
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone.value.trim().replace(/\s/g, ''))) {
            isValid = false;
        }
    }
    
    if (placeOrderBtn) {
        // Only disable if cart is empty, allow button to be clicked for validation feedback
        placeOrderBtn.disabled = cart.length === 0;
        
        // Debug logging
        console.log('Validation result:', {
            isValid,
            cartLength: cart.length,
            customerName: customerName ? customerName.value : 'null',
            email: email ? email.value : 'null',
            phone: phone ? phone.value : 'null',
            deliveryType: deliveryType ? deliveryType.value : 'null',
            address: address ? address.value : 'null'
        });
    }
    
    return isValid;
}

// Handle place order
async function handlePlaceOrder() {
    console.log('Place order button clicked');
    console.log('Current cart:', cart);
    
    if (!validateForm()) {
        showError('Please fill in all required fields correctly.');
        return;
    }
    
    const paymentMethodElement = document.querySelector('input[name="paymentMethod"]:checked');
    if (!paymentMethodElement) {
        showError('Please select a payment method.');
        return;
    }
    
    const paymentMethod = paymentMethodElement.value;
    console.log('Payment method selected:', paymentMethod);
    
    if (paymentMethod === 'online') {
        // Show payment gateway modal
        showPaymentModal();
    } else {
        // Process COD order directly
        await processOrder('cod');
    }
}

// Show payment gateway modal
function showPaymentModal() {
    const modal = new bootstrap.Modal(document.getElementById('paymentModal'));
    document.getElementById('paymentTotal').textContent = orderTotal;
    
    // Setup payment method listeners
    setupPaymentMethodListeners();
    
    modal.show();
}

// Setup payment method listeners
function setupPaymentMethodListeners() {
    const paymentMethods = document.querySelectorAll('input[name="paymentGateway"]');
    const paymentDetails = document.getElementById('paymentDetails');
    const processPaymentBtn = document.getElementById('processPaymentBtn');
    
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            updatePaymentDetails(this.value);
        });
    });
    
    processPaymentBtn.addEventListener('click', function() {
        processPayment();
    });
    
    // Initialize with default selection
    updatePaymentDetails('upi');
}

// Update payment details based on selected method
function updatePaymentDetails(method) {
    const paymentDetails = document.getElementById('paymentDetails');
    
    switch(method) {
        case 'upi':
            paymentDetails.innerHTML = `
                <div class="mb-3">
                    <label for="upiId" class="form-label">UPI ID</label>
                    <input type="text" class="form-control" id="upiId" placeholder="yourname@upi" required>
                </div>
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i> Enter your UPI ID to complete the payment
                </div>
            `;
            break;
        case 'card':
            paymentDetails.innerHTML = `
                <div class="mb-3">
                    <label for="cardNumber" class="form-label">Card Number</label>
                    <input type="text" class="form-control" id="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19" required>
                </div>
                <div class="row">
                    <div class="col-6">
                        <label for="expiryDate" class="form-label">Expiry Date</label>
                        <input type="text" class="form-control" id="expiryDate" placeholder="MM/YY" maxlength="5" required>
                    </div>
                    <div class="col-6">
                        <label for="cvv" class="form-label">CVV</label>
                        <input type="text" class="form-control" id="cvv" placeholder="123" maxlength="3" required>
                    </div>
                </div>
                <div class="alert alert-info mt-3">
                    <i class="fas fa-shield-alt"></i> Your card details are secure and encrypted
                </div>
            `;
            break;
        case 'netbanking':
            paymentDetails.innerHTML = `
                <div class="mb-3">
                    <label for="bank" class="form-label">Select Bank</label>
                    <select class="form-select" id="bank" required>
                        <option value="">Choose your bank</option>
                        <option value="sbi">State Bank of India</option>
                        <option value="hdfc">HDFC Bank</option>
                        <option value="icici">ICICI Bank</option>
                        <option value="axis">Axis Bank</option>
                        <option value="pnb">Punjab National Bank</option>
                    </select>
                </div>
                <div class="alert alert-info">
                    <i class="fas fa-university"></i> You will be redirected to your bank's secure portal
                </div>
            `;
            break;
    }
}

// Process payment (simulate payment gateway)
async function processPayment() {
    const paymentMethod = document.querySelector('input[name="paymentGateway"]:checked').value;
    const processPaymentBtn = document.getElementById('processPaymentBtn');
    
    // Validate payment fields
    if (!validatePaymentFields(paymentMethod)) {
        showError('Please fill in all payment details correctly.');
        return;
    }
    
    // Simulate payment processing
    processPaymentBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    processPaymentBtn.disabled = true;
    
    try {
        // Simulate payment gateway delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Hide payment modal
        const paymentModal = bootstrap.Modal.getInstance(document.getElementById('paymentModal'));
        paymentModal.hide();
        
        // Process order with online payment
        await processOrder('online', paymentMethod);
        
    } catch (error) {
        showError('Payment failed. Please try again.');
    } finally {
        processPaymentBtn.innerHTML = '<i class="fas fa-lock"></i> Pay Now';
        processPaymentBtn.disabled = false;
    }
}

// Validate payment fields
function validatePaymentFields(method) {
    switch(method) {
        case 'upi':
            const upiId = document.getElementById('upiId').value.trim();
            return upiId.length > 0 && upiId.includes('@');
        case 'card':
            const cardNumber = document.getElementById('cardNumber').value.trim();
            const expiryDate = document.getElementById('expiryDate').value.trim();
            const cvv = document.getElementById('cvv').value.trim();
            return cardNumber.length >= 13 && expiryDate.length === 5 && cvv.length === 3;
        case 'netbanking':
            const bank = document.getElementById('bank').value;
            return bank.length > 0;
        default:
            return false;
    }
}

// Process order with payment information
async function processOrder(paymentType, paymentMethod = null) {
    const orderData = {
        customerName: document.getElementById('customerName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        address: document.getElementById('address').value.trim(),
        restaurantId: selectedRestaurant ? selectedRestaurant._id : null,
        items: cart,
        deliveryType: document.getElementById('deliveryType').value,
        paymentType: paymentType,
        paymentMethod: paymentMethod
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
        showSuccessModal(result.order, paymentType);
        
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
function showSuccessModal(order, paymentType) {
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    const orderDetails = document.getElementById('orderDetails');
    
    const paymentInfo = paymentType === 'online' 
        ? `<p><strong>Payment:</strong> <span class="badge bg-success">Paid Online</span></p>` 
        : `<p><strong>Payment:</strong> <span class="badge bg-warning">Cash on Delivery</span></p>`;
    
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
            ${paymentInfo}
            <p><strong>Status:</strong> <span class="badge bg-warning">Pending</span></p>
        </div>
        <div class="alert alert-success mt-3">
            <i class="fas fa-check-circle"></i> 
            Your order has been placed successfully! ${paymentType === 'online' ? 'Payment received.' : 'You will receive a confirmation call shortly.'}
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
