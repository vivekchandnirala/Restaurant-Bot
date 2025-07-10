# Indian Restaurant Bot Web Application

A comprehensive full-stack web application for 5 authentic Indian restaurants in Agra and Mathura, featuring restaurant search, menu browsing, reservations, orders, and chatbot functionality.

## Features

- **Restaurant Search**: Browse 5 authentic Indian restaurants with real addresses
- **Menu System**: View detailed menus with authentic food images
- **Reservation System**: Book tables with date/time validation
- **Order Management**: Place orders with shopping cart functionality
- **Payment Gateway**: Fake payment system with UPI, Card, and Net Banking
- **Chatbot**: Interactive bot for customer assistance
- **Floating Chatbot**: Easy access from all pages
- **Responsive Design**: Works on mobile and desktop

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB database (local or cloud)
- Git

### Installation

1. **Download/Clone the project**
   ```bash
   git clone <your-repository-url>
   cd restaurant-bot-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure MongoDB**
   
   **Option 1: Using Environment Variable**
   Create a `.env` file in the root directory:
   ```
   MONGODB_URI=mongodb://your-mongodb-url:27017/restaurantbot
   PORT=5000
   ```
   
   **Option 2: Direct Code Change**
   Edit `server/app.js` line 17:
   ```javascript
   // Change this line
   const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurantbot';
   
   // To your MongoDB URL
   const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://your-mongodb-url:27017/restaurantbot';
   ```

4. **Start the application**
   ```bash
   node server/app.js
   ```

5. **Access the application**
   Open your browser and go to: `http://localhost:5000`

## MongoDB Configuration Options

### Local MongoDB
```
MONGODB_URI=mongodb://localhost:27017/restaurantbot
```

### MongoDB Atlas (Cloud)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/restaurantbot
```

### MongoDB with Authentication
```
MONGODB_URI=mongodb://username:password@localhost:27017/restaurantbot
```

## Project Structure

```
/
├── server/
│   ├── app.js              # Main server file
│   ├── models/             # Database schemas
│   │   ├── Restaurant.js
│   │   ├── Menu.js
│   │   ├── Order.js
│   │   └── Reservation.js
│   ├── routes/             # API endpoints
│   │   ├── restaurants.js
│   │   ├── menu.js
│   │   ├── orders.js
│   │   ├── reservations.js
│   │   └── chatbot.js
│   └── data/
│       └── seedData.js     # Initial database data
├── css/
│   └── style.css          # Application styles
├── js/                    # Frontend JavaScript
│   ├── app.js
│   ├── menu.js
│   ├── order.js
│   ├── reservation.js
│   └── chat.js
├── *.html                 # Frontend pages
└── package.json
```

## API Endpoints

- `GET /api/restaurants` - Get all restaurants
- `GET /api/menu/:restaurantId` - Get menu for a restaurant
- `POST /api/reservations` - Create a reservation
- `POST /api/orders` - Place an order
- `POST /api/chat` - Chat with bot

## Database Seeding

The application automatically seeds the database with:
- 5 authentic Indian restaurants
- Menu items with authentic food images
- All necessary data for testing

## Payment System

The application includes a fake payment gateway for testing:
- **UPI Payment**: Simulated UPI transactions
- **Card Payment**: Credit/Debit card simulation
- **Net Banking**: Bank selection simulation
- **Cash on Delivery**: Available for all orders

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check your MongoDB URL is correct
   - Ensure MongoDB service is running
   - Verify network connectivity

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Or kill the process using port 5000

3. **Missing Dependencies**
   - Run `npm install` to install all packages

4. **Order Button Not Working**
   - This has been fixed in the latest version
   - Button now works for both Cash on Delivery and Online Payment
   - Make sure you have items in your cart before placing order

5. **Images Not Loading**
   - Check the IMAGE_CUSTOMIZATION_GUIDE.md for detailed instructions
   - Ensure image URLs are HTTPS and publicly accessible

### Environment Variables

Create a `.env` file for production:
```
MONGODB_URI=your-mongodb-connection-string
PORT=5000
NODE_ENV=production
```

## Development

To run in development mode:
```bash
# Start MongoDB (if local)
mongod

# Start the application
npm start
# or
node server/app.js
```

## Production Deployment

1. Set environment variables
2. Update MongoDB URI to production database
3. Configure proper error handling
4. Use process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server/app.js --name restaurant-bot
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes.