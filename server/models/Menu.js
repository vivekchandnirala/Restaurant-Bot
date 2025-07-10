const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Appetizers', 'Main Course', 'Biryani', 'Tandoor', 'Desserts', 'Beverages']
    },
    isVeg: {
        type: Boolean,
        default: true
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Indian+Dish'
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Menu', menuItemSchema);
