const Restaurant = require('../models/Restaurant');
const Menu = require('../models/Menu');

const seedData = async () => {
    try {
        // Check if data already exists
        const existingRestaurants = await Restaurant.find();
        if (existingRestaurants.length > 0) {
            console.log('Data already exists, skipping seed');
            return;
        }

        // Create restaurants
        const restaurants = [
            {
                name: 'The Nawaabs',
                address: '18A, 7B/A, Fatehabad Rd, opposite Axis Bank, Bansal Nagar, Tajganj, Agra, Uttar Pradesh 282001',
                phone: '070270 24829',
                hours: 'Open ⋅ Closes 12 AM',
                priceRange: '₹300-800',
                serviceOptions: ['All you can eat', 'Outdoor seating', 'Vegan options'],
                description: 'Authentic Mughlai cuisine with traditional flavors and royal dining experience.',
                image: 'https://via.placeholder.com/400x300/8E44AD/FFFFFF?text=The+Nawaabs'
            },
            {
                name: 'Heart of Taj Café & Kitchen',
                address: 'P6 Taj Nagri phase 1, near shilpgram road, Phase One Colony, Agra, Uttar Pradesh 282004',
                phone: '098765 43210',
                hours: 'Open ⋅ Closes 10 PM',
                priceRange: '₹250-600',
                serviceOptions: ['All you can eat', 'Happy-hour food', 'Fireplace'],
                description: 'Multi-cuisine restaurant with cozy ambiance and fireplace dining.',
                image: 'https://via.placeholder.com/400x300/E67E22/FFFFFF?text=Heart+of+Taj'
            },
            {
                name: 'Govinda\'s Restaurant Mathura',
                address: 'near Deep Nursing Home, Radha Nagar, Krishna Nagar, Mathura, Uttar Pradesh 281004',
                phone: '063963 64690',
                hours: 'Open ⋅ Closes 9:30 PM',
                priceRange: '₹200-600',
                serviceOptions: ['Pure Vegetarian', 'Spiritual dining', 'Traditional thali'],
                description: 'Pure vegetarian restaurant serving Krishna consciousness inspired meals.',
                image: 'https://via.placeholder.com/400x300/27AE60/FFFFFF?text=Govindas'
            },
            {
                name: 'Taj Terrace',
                address: 'Hotel taj resorts, Eastern gate of tajmahal, near shilpgram, tajganj, Agra, Uttar Pradesh 282001',
                phone: '070600 05331',
                hours: 'Open ⋅ Closes 11 PM',
                priceRange: '₹400-1000',
                serviceOptions: ['Outdoor seating', 'Private dining room', 'Live music'],
                description: 'Fine dining with Taj Mahal view, live music, and premium Indian cuisine.',
                image: 'https://via.placeholder.com/400x300/3498DB/FFFFFF?text=Taj+Terrace'
            },
            {
                name: 'Treat Restaurant',
                address: 'Tajmahal south gate, Kinari Bazar, Kaserat Bazar, Tajganj, Agra, Uttar Pradesh 282001',
                phone: '093190 12891',
                hours: 'Open ⋅ Closes 11 PM',
                priceRange: '₹200-400',
                serviceOptions: ['Reservations required', 'All you can eat', 'Happy-hour food'],
                description: 'Family-friendly restaurant near Taj Mahal with affordable Indian cuisine.',
                image: 'https://via.placeholder.com/400x300/E74C3C/FFFFFF?text=Treat+Restaurant'
            }
        ];

        const createdRestaurants = await Restaurant.insertMany(restaurants);
        console.log('Restaurants seeded successfully');

        // Create menu items for each restaurant
        const menuItems = [];

        // The Nawaabs menu
        const nawaabsId = createdRestaurants[0]._id;
        menuItems.push(
            // Appetizers
            { name: 'Chicken Tikka', description: 'Tender chicken marinated in yogurt and spices, grilled to perfection', price: 280, category: 'Appetizers', isVeg: false, restaurantId: nawaabsId },
            { name: 'Mutton Seekh Kebab', description: 'Minced mutton kebabs with aromatic spices', price: 320, category: 'Appetizers', isVeg: false, restaurantId: nawaabsId },
            { name: 'Paneer Tikka', description: 'Cottage cheese cubes grilled with bell peppers and onions', price: 240, category: 'Appetizers', isVeg: true, restaurantId: nawaabsId },
            
            // Main Course
            { name: 'Butter Chicken', description: 'Creamy tomato-based curry with tender chicken pieces', price: 380, category: 'Main Course', isVeg: false, restaurantId: nawaabsId },
            { name: 'Mutton Rogan Josh', description: 'Kashmiri style mutton curry with aromatic spices', price: 450, category: 'Main Course', isVeg: false, restaurantId: nawaabsId },
            { name: 'Dal Makhani', description: 'Rich and creamy black lentil curry', price: 220, category: 'Main Course', isVeg: true, restaurantId: nawaabsId },
            
            // Biryani
            { name: 'Chicken Biryani', description: 'Fragrant basmati rice with spiced chicken', price: 350, category: 'Biryani', isVeg: false, restaurantId: nawaabsId },
            { name: 'Mutton Biryani', description: 'Traditional mutton biryani with saffron rice', price: 420, category: 'Biryani', isVeg: false, restaurantId: nawaabsId },
            { name: 'Vegetable Biryani', description: 'Mixed vegetables with aromatic basmati rice', price: 280, category: 'Biryani', isVeg: true, restaurantId: nawaabsId }
        );

        // Heart of Taj Café menu
        const heartOfTajId = createdRestaurants[1]._id;
        menuItems.push(
            { name: 'Chicken Tandoori', description: 'Half chicken marinated in yogurt and tandoori spices', price: 320, category: 'Tandoor', isVeg: false, restaurantId: heartOfTajId },
            { name: 'Fish Tikka', description: 'Fresh fish marinated and grilled in tandoor', price: 380, category: 'Tandoor', isVeg: false, restaurantId: heartOfTajId },
            { name: 'Tandoori Naan', description: 'Freshly baked bread in tandoor oven', price: 60, category: 'Tandoor', isVeg: true, restaurantId: heartOfTajId },
            { name: 'Chicken Curry', description: 'Home-style chicken curry with onion gravy', price: 280, category: 'Main Course', isVeg: false, restaurantId: heartOfTajId },
            { name: 'Palak Paneer', description: 'Cottage cheese in spinach gravy', price: 240, category: 'Main Course', isVeg: true, restaurantId: heartOfTajId },
            { name: 'Masala Chai', description: 'Traditional Indian spiced tea', price: 40, category: 'Beverages', isVeg: true, restaurantId: heartOfTajId }
        );

        // Govinda's Restaurant menu (Pure Vegetarian)
        const govindasId = createdRestaurants[2]._id;
        menuItems.push(
            { name: 'Govinda Thali', description: 'Complete vegetarian meal with dal, sabzi, rice, roti, and dessert', price: 180, category: 'Main Course', isVeg: true, restaurantId: govindasId },
            { name: 'Rajma Chawal', description: 'Kidney beans curry with steamed rice', price: 140, category: 'Main Course', isVeg: true, restaurantId: govindasId },
            { name: 'Chole Bhature', description: 'Spicy chickpea curry with fried bread', price: 120, category: 'Main Course', isVeg: true, restaurantId: govindasId },
            { name: 'Aloo Paratha', description: 'Stuffed potato flatbread with yogurt and pickle', price: 100, category: 'Main Course', isVeg: true, restaurantId: govindasId },
            { name: 'Kheer', description: 'Traditional rice pudding with cardamom', price: 80, category: 'Desserts', isVeg: true, restaurantId: govindasId },
            { name: 'Lassi', description: 'Sweet yogurt drink', price: 60, category: 'Beverages', isVeg: true, restaurantId: govindasId }
        );

        // Taj Terrace menu
        const tajTerraceId = createdRestaurants[3]._id;
        menuItems.push(
            { name: 'Taj Special Biryani', description: 'Premium biryani with tender mutton and saffron', price: 500, category: 'Biryani', isVeg: false, restaurantId: tajTerraceId },
            { name: 'Tandoori Prawns', description: 'Jumbo prawns marinated in tandoori spices', price: 450, category: 'Tandoor', isVeg: false, restaurantId: tajTerraceId },
            { name: 'Paneer Makhani', description: 'Cottage cheese in rich tomato and butter gravy', price: 280, category: 'Main Course', isVeg: true, restaurantId: tajTerraceId },
            { name: 'Garlic Naan', description: 'Naan bread topped with garlic and herbs', price: 80, category: 'Tandoor', isVeg: true, restaurantId: tajTerraceId },
            { name: 'Gulab Jamun', description: 'Sweet milk dumplings in sugar syrup', price: 120, category: 'Desserts', isVeg: true, restaurantId: tajTerraceId },
            { name: 'Fresh Lime Soda', description: 'Refreshing lime drink with mint', price: 80, category: 'Beverages', isVeg: true, restaurantId: tajTerraceId }
        );

        // Treat Restaurant menu
        const treatId = createdRestaurants[4]._id;
        menuItems.push(
            { name: 'Chicken Biryani', description: 'Traditional chicken biryani with aromatic rice', price: 260, category: 'Biryani', isVeg: false, restaurantId: treatId },
            { name: 'Vegetable Biryani', description: 'Mixed vegetable biryani with basmati rice', price: 220, category: 'Biryani', isVeg: true, restaurantId: treatId },
            { name: 'Butter Naan', description: 'Soft naan bread with butter', price: 50, category: 'Tandoor', isVeg: true, restaurantId: treatId },
            { name: 'Chicken Tikka Masala', description: 'Grilled chicken in creamy tomato sauce', price: 300, category: 'Main Course', isVeg: false, restaurantId: treatId },
            { name: 'Dal Tadka', description: 'Yellow lentils tempered with spices', price: 150, category: 'Main Course', isVeg: true, restaurantId: treatId },
            { name: 'Kulfi', description: 'Traditional Indian ice cream', price: 70, category: 'Desserts', isVeg: true, restaurantId: treatId }
        );

        await Menu.insertMany(menuItems);
        console.log('Menu items seeded successfully');

    } catch (error) {
        console.error('Error seeding data:', error);
    }
};

// Run seed data
seedData();
