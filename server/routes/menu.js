const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');

// Get menu items for a restaurant
router.get('/:restaurantId', async (req, res) => {
    try {
        const { category } = req.query;
        let query = { restaurantId: req.params.restaurantId };
        
        if (category) {
            query.category = category;
        }
        
        const menuItems = await Menu.find(query).populate('restaurantId', 'name');
        res.json(menuItems);
    } catch (error) {
        console.error('Error fetching menu:', error);
        res.status(500).json({ error: 'Failed to fetch menu items' });
    }
});

// Get menu item by ID
router.get('/item/:id', async (req, res) => {
    try {
        const menuItem = await Menu.findById(req.params.id).populate('restaurantId', 'name');
        if (!menuItem) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        res.json(menuItem);
    } catch (error) {
        console.error('Error fetching menu item:', error);
        res.status(500).json({ error: 'Failed to fetch menu item' });
    }
});

module.exports = router;
