require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '..')));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;


mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ Connected to MongoDB Atlas");
  require('./data/seedData');
}).catch((err) => {
  console.error("❌ MongoDB Connection Error:", err);
});


// Routes
app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/chat', require('./routes/chatbot'));

// Serve frontend pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.get('/menu', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'menu.html'));
});

app.get('/reserve', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'reserve.html'));
});

app.get('/order', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'order.html'));
});

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'chat.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
