# Restaurant Bot Web Application

## Overview

This is a full-stack Restaurant Bot Web Application built with Node.js, Express, and MongoDB. The app provides users with the ability to search for Indian restaurants, view menus, make reservations, place orders, and interact with a chatbot for assistance. The application focuses on restaurants in Agra and Mathura, featuring authentic Indian cuisine.

## Recent Changes (July 10, 2025)

- Updated to use only authentic Indian restaurants with exact addresses and phone numbers provided by user
- Added 5 specific restaurants: The Nawaabs, Heart of Taj Café & Kitchen, Govinda's Restaurant Mathura, Taj Terrace, and Treat Restaurant
- Implemented MongoDB database with proper seeding of restaurant and menu data
- Fixed server configuration to run on port 5000 with proper MongoDB connection
- All APIs are fully functional for restaurant search, menu viewing, reservations, orders, and chatbot interactions

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Architecture
- **Framework**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **API Structure**: RESTful API endpoints organized by functionality
- **Static File Serving**: Express serves static HTML, CSS, and JavaScript files
- **CORS**: Enabled for cross-origin requests

### Frontend Architecture
- **Technology**: Vanilla HTML, CSS, and JavaScript (no frameworks)
- **Styling**: Bootstrap 5 for responsive design and FontAwesome for icons
- **Structure**: Multi-page application with dedicated pages for each feature
- **JavaScript**: Modular approach with separate JS files for each page

## Key Components

### 1. Restaurant Management
- **Model**: Restaurant schema with name, address, phone, hours, price range, and services
- **API**: `/api/restaurants` - GET all restaurants, search functionality
- **Frontend**: Restaurant listing and search interface

### 2. Menu System
- **Model**: Menu schema linked to restaurants with categories, prices, and dietary info
- **API**: `/api/menu/:restaurantId` - GET menu items by restaurant
- **Frontend**: Menu browsing with category filtering and vegetarian options

### 3. Reservation System
- **Model**: Reservation schema with customer details, date/time, and guest count
- **API**: `/api/reservations` - POST new reservations
- **Frontend**: Reservation form with date/time validation

### 4. Order Management
- **Model**: Order schema with customer info, items, delivery type, and total amount
- **API**: `/api/orders` - POST new orders
- **Frontend**: Shopping cart functionality and order placement

### 5. Chatbot Interface
- **Logic**: Simple rule-based chatbot without external APIs
- **API**: `/api/chat` - POST messages for bot responses
- **Frontend**: Real-time chat interface with message history

## Data Flow

### Restaurant Search Flow
1. User enters search query on homepage
2. Frontend sends GET request to `/api/restaurants` with search parameters
3. Backend queries MongoDB using regex for name/address/description matching
4. Results displayed as restaurant cards with details

### Menu Browsing Flow
1. User selects restaurant from dropdown
2. Frontend requests menu via `/api/menu/:restaurantId`
3. Backend retrieves menu items filtered by restaurant
4. Items displayed with category filtering and add-to-cart functionality

### Reservation Flow
1. User fills reservation form with details
2. Frontend validates form data and sends POST to `/api/reservations`
3. Backend saves reservation to MongoDB
4. Confirmation message displayed with reservation details

### Order Flow
1. User adds items to cart (stored in localStorage)
2. User proceeds to order page and fills customer details
3. Frontend sends POST to `/api/orders` with cart items and customer info
4. Backend calculates total and saves order to MongoDB
5. Order confirmation displayed

### Chatbot Flow
1. User sends message via chat interface
2. Frontend sends POST to `/api/chat` with message text
3. Backend processes message using keyword matching
4. Appropriate response generated and sent back
5. Chat history updated in real-time

## External Dependencies

### Backend Dependencies
- **express**: Web framework for Node.js
- **mongoose**: MongoDB ODM for data modeling
- **cors**: Cross-origin resource sharing middleware

### Frontend Dependencies
- **Bootstrap 5**: CSS framework for responsive design
- **FontAwesome**: Icon library for UI elements
- **No external JavaScript libraries** - uses vanilla JS

### Database
- **MongoDB**: NoSQL database for storing restaurants, menus, reservations, and orders
- **Connection**: Configurable via MONGODB_URI environment variable
- **Default**: Local MongoDB instance on port 27017

## Deployment Strategy

### Development Setup
1. Install Node.js dependencies: `npm install`
2. Start MongoDB service locally
3. Run server: `node server/app.js`
4. Access application at `http://localhost:3000`

### Production Considerations
- Set `MONGODB_URI` environment variable for production database
- Configure proper error handling and logging
- Add security middleware for production deployment
- Consider using PM2 for process management

### File Structure
```
/
├── server/
│   ├── app.js (main server file)
│   ├── models/ (MongoDB schemas)
│   ├── routes/ (API endpoints)
│   └── data/ (seed data)
├── css/ (stylesheets)
├── js/ (frontend JavaScript)
└── *.html (frontend pages)
```

### Data Seeding
- Automatic data seeding on first run
- Creates sample restaurants with menu items
- Covers restaurants in Agra and Mathura regions
- Includes various Indian cuisine categories

The application prioritizes simplicity and functionality over complex frameworks, making it easy to maintain and extend while providing a complete restaurant discovery and ordering experience.