const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Create a new order
router.post('/', async (req, res) => {
    try {
        const {
            customerName,
            email,
            phone,
            address,
            restaurantId,
            items,
            deliveryType
        } = req.body;

        // Validate required fields
        if (!customerName || !email || !phone || !address || !restaurantId || !items || items.length === 0) {
            return res.status(400).json({ error: 'All required fields must be provided' });
        }

        // Calculate total amount
        const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const order = new Order({
            customerName,
            email,
            phone,
            address,
            restaurantId,
            items,
            totalAmount,
            deliveryType: deliveryType || 'delivery'
        });

        await order.save();
        await order.populate('restaurantId', 'name address');
        
        res.status(201).json({
            message: 'Order placed successfully',
            order
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to place order' });
    }
});

// Get all orders for a customer
router.get('/customer/:email', async (req, res) => {
    try {
        const orders = await Order.find({ email: req.params.email })
            .populate('restaurantId', 'name address')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

module.exports = router;
