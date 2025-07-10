const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    hours: {
        type: String,
        required: true,
        trim: true
    },
    priceRange: {
        type: String,
        required: true,
        trim: true
    },
    serviceOptions: [String],
    cuisine: {
        type: String,
        default: 'Indian'
    },
    rating: {
        type: Number,
        default: 4.5
    },
    description: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Indian+Restaurant'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
