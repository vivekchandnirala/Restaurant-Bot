# 🇮🇳 Indian Restaurant Bot — Full-Stack Web Application

Welcome to the **Restaurant Bot**, a dynamic full-stack web app to simplify your dining experience. This project was developed as the final submission for the **Node.js Internship at Celebal Technologies**.

## ✨ Key Features

- 🔎 **Restaurant Discovery** (Search by location, cuisine, or name)
- 🍽️ **Menu Viewing** (Detailed, category-wise digital menus)
- 📆 **Table Reservation** (Choose date, time, guests)
- 🛒 **Order Management** (Cart-based food ordering)
- 💳 **Fake Payment Gateway** (UPI, Card, NetBanking, COD)
- 🤖 **Chatbot Assistant** (Floating bot on all pages)

## 🏗️ Tech Stack

- **Frontend**: HTML, CSS (Bootstrap), Vanilla JS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB + Mongoose
- **Chatbot**: Custom rule-based bot (no external APIs)

## 🔧 Setup Instructions

### 1. Clone & Navigate

```bash
git clone https://github.com/vivekchandnirala/Restaurant-Bot.git
cd restaurant-bot

2. Install Dependencies
npm install

3. Configure Environment
Create a .env file:

MONGODB_URI=mongodb://localhost:27017/restaurantbot
PORT=5000

4. Seed Database (Optional)
If you have seedData.js, run this once:

node server/data/seedData.js

5. Run Application

node server/app.js

Open browser: http://localhost:5000

