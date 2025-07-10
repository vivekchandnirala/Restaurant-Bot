const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');

// Create a new reservation
router.post('/', async (req, res) => {
    try {
        const {
            customerName,
            email,
            phone,
            restaurantId,
            date,
            time,
            guests,
            specialRequests
        } = req.body;

        // Validate required fields
        if (!customerName || !email || !phone || !restaurantId || !date || !time || !guests) {
            return res.status(400).json({ error: 'All required fields must be provided' });
        }

        const reservation = new Reservation({
            customerName,
            email,
            phone,
            restaurantId,
            date: new Date(date),
            time,
            guests,
            specialRequests
        });

        await reservation.save();
        await reservation.populate('restaurantId', 'name');
        
        res.status(201).json({
            message: 'Reservation created successfully',
            reservation
        });
    } catch (error) {
        console.error('Error creating reservation:', error);
        res.status(500).json({ error: 'Failed to create reservation' });
    }
});

// Get all reservations for a customer
router.get('/customer/:email', async (req, res) => {
    try {
        const reservations = await Reservation.find({ email: req.params.email })
            .populate('restaurantId', 'name address')
            .sort({ date: -1 });
        res.json(reservations);
    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).json({ error: 'Failed to fetch reservations' });
    }
});

module.exports = router;
