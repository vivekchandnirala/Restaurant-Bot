const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const Menu = require('../models/Menu');

// Simple chatbot logic
router.post('/', async (req, res) => {
    try {
        const { message } = req.body;
        const userMessage = message.toLowerCase();
        
        let response = '';
        
        // Menu related queries
        if (userMessage.includes('menu') || userMessage.includes('food') || userMessage.includes('dish')) {
            if (userMessage.includes('biryani')) {
                response = 'We have delicious Biryani at all our restaurants! Try our Chicken Biryani, Mutton Biryani, or Vegetable Biryani. Which restaurant would you like to visit?';
            } else if (userMessage.includes('tandoor')) {
                response = 'Our Tandoor specialties include Tandoori Chicken, Naan, and Kebabs. Available at The Nawaabs and Taj Terrace with outdoor seating!';
            } else {
                response = 'Our restaurants offer authentic Indian cuisine including Biryani, Tandoor items, Curries, and Desserts. Visit our menu page to see all options!';
            }
        }
        
        // Restaurant related queries
        else if (userMessage.includes('restaurant') || userMessage.includes('location') || userMessage.includes('address')) {
            response = 'We have 5 amazing Indian restaurants:\n' +
                      '1. The Nawaabs - Agra (Mughlai cuisine)\n' +
                      '2. Heart of Taj Café - Agra (Multi-cuisine)\n' +
                      '3. Govinda\'s Restaurant - Mathura (Vegetarian)\n' +
                      '4. Taj Terrace - Agra (Fine dining)\n' +
                      '5. Treat Restaurant - Agra (Family dining)';
        }
        
        // Reservation related queries
        else if (userMessage.includes('book') || userMessage.includes('reservation') || userMessage.includes('table')) {
            response = 'I can help you book a table! Please visit our reservation page or let me know:\n' +
                      '- Which restaurant?\n' +
                      '- Date and time?\n' +
                      '- Number of guests?\n' +
                      'You can also call directly: The Nawaabs (070270 24829) or Taj Terrace (070600 05331)';
        }
        
        // Order related queries
        else if (userMessage.includes('order') || userMessage.includes('delivery') || userMessage.includes('takeaway')) {
            response = 'You can place orders through our website! We offer both delivery and pickup options. ' +
                      'Browse our menu, add items to cart, and checkout with your details.';
        }
        
        // Price related queries
        else if (userMessage.includes('price') || userMessage.includes('cost') || userMessage.includes('expensive')) {
            response = 'Our restaurants have different price ranges:\n' +
                      '- Govinda\'s Restaurant: ₹200-600 per person\n' +
                      '- Treat Restaurant: ₹200-400 per person\n' +
                      '- Other restaurants: Affordable family dining\n' +
                      'Check individual menus for specific dish prices!';
        }
        
        // Hours related queries
        else if (userMessage.includes('open') || userMessage.includes('close') || userMessage.includes('hours') || userMessage.includes('time')) {
            response = 'Restaurant timings:\n' +
                      '- The Nawaabs: Open until 12 AM\n' +
                      '- Heart of Taj Café: Open until 10 PM\n' +
                      '- Govinda\'s Restaurant: Open until 9:30 PM\n' +
                      '- Taj Terrace: Open until 11 PM\n' +
                      '- Treat Restaurant: Open until 11 PM';
        }
        
        // Greeting responses
        else if (userMessage.includes('hello') || userMessage.includes('hi') || userMessage.includes('hey')) {
            response = 'Hello! Welcome to our Indian Restaurant Bot! 🍛\n' +
                      'I can help you with:\n' +
                      '- Finding restaurants\n' +
                      '- Viewing menus\n' +
                      '- Making reservations\n' +
                      '- Placing orders\n' +
                      'What would you like to know?';
        }
        
        // Default response
        else {
            response = 'I can help you with restaurant information, menus, reservations, and orders. ' +
                      'Try asking about "menu", "restaurants", "booking a table", or "placing an order"!';
        }
        
        res.json({ response });
    } catch (error) {
        console.error('Error processing chat message:', error);
        res.status(500).json({ error: 'Failed to process message' });
    }
});

module.exports = router;
