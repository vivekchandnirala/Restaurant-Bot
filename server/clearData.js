const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
const Menu = require('./models/Menu');

const clearData = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/restaurantbot');
        
        // Clear all collections
        await Restaurant.deleteMany({});
        await Menu.deleteMany({});
        
        console.log('All data cleared successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error clearing data:', error);
        process.exit(1);
    }
};

clearData();