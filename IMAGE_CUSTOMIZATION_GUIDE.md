# Restaurant & Food Image Customization Guide

This guide explains how to change restaurant and food images in your Indian Restaurant Bot Web Application.

## 🏪 Restaurant Images

### Method 1: Update Database Directly (Recommended)

1. **Access your MongoDB database**
   - Open MongoDB Compass or use command line
   - Connect to your database: `restaurantbot`
   - Go to the `restaurants` collection

2. **Update restaurant images**
   ```javascript
   // Example: Update The Nawaabs restaurant image
   db.restaurants.updateOne(
     { name: "The Nawaabs" },
     { $set: { image: "https://your-new-image-url.com/restaurant.jpg" } }
   )
   ```

3. **Image requirements**
   - Recommended size: 400x300 pixels
   - Format: JPG or PNG
   - Must be accessible via HTTPS URL

### Method 2: Update Seed Data File

1. **Edit the seed data file**: `server/data/seedData.js`
2. **Find the restaurant section** (around line 15-80)
3. **Update the image URLs**:
   ```javascript
   {
     name: "The Nawaabs",
     image: "https://your-new-image-url.com/restaurant.jpg",
     // ... other fields
   }
   ```

4. **Clear existing data and reseed**:
   ```bash
   node server/clearData.js
   node server/app.js
   ```

### Method 3: Using Image Upload Service

1. **Upload your images to a service like**:
   - **Cloudinary**: Free tier available
   - **AWS S3**: Paid service
   - **ImgBB**: Free image hosting
   - **GitHub**: Store in repository

2. **Get the direct image URL**
3. **Update using Method 1 or 2 above**

## 🍛 Food Images

### Method 1: Update Database Directly (Recommended)

1. **Access the `menus` collection in MongoDB**
2. **Update specific food items**:
   ```javascript
   // Example: Update Butter Chicken image
   db.menus.updateOne(
     { name: "Butter Chicken" },
     { $set: { image: "https://your-new-image-url.com/butter-chicken.jpg" } }
   )
   
   // Update multiple items at once
   db.menus.updateMany(
     { category: "Main Course" },
     { $set: { image: "https://your-new-image-url.com/main-course.jpg" } }
   )
   ```

### Method 2: Update Seed Data File

1. **Edit**: `server/data/seedData.js`
2. **Find the menu items section** (around line 100-400)
3. **Update food images**:
   ```javascript
   {
     name: "Butter Chicken",
     image: "https://your-new-image-url.com/butter-chicken.jpg",
     description: "Creamy tomato-based curry with tender chicken pieces",
     // ... other fields
   }
   ```

4. **Clear and reseed data**:
   ```bash
   node server/clearData.js
   node server/app.js
   ```

### Method 3: Bulk Update Script

Create a script to update multiple images at once:

```javascript
// bulk-update-images.js
const mongoose = require('mongoose');
const Menu = require('./server/models/Menu');

const imageUpdates = [
  { name: "Butter Chicken", image: "https://new-url.com/butter-chicken.jpg" },
  { name: "Chicken Tikka", image: "https://new-url.com/chicken-tikka.jpg" },
  // Add more items...
];

async function updateImages() {
  await mongoose.connect('mongodb://localhost:27017/restaurantbot');
  
  for (const update of imageUpdates) {
    await Menu.updateOne(
      { name: update.name },
      { $set: { image: update.image } }
    );
    console.log(`Updated: ${update.name}`);
  }
  
  mongoose.disconnect();
}

updateImages();
```

## 🖼️ Image Sources & Requirements

### Free Image Sources
- **Unsplash**: https://unsplash.com/s/photos/indian-food
- **Pexels**: https://www.pexels.com/search/indian%20food/
- **Pixabay**: https://pixabay.com/images/search/indian%20food/

### Image Requirements
- **Restaurant images**: 400x300px recommended
- **Food images**: 300x200px recommended
- **Format**: JPG, PNG, or WebP
- **URL**: Must be HTTPS and publicly accessible

### Image Hosting Services
1. **Cloudinary** (Recommended)
   - Free tier: 25GB storage
   - Auto-optimization
   - CDN delivery
   - Example URL: `https://res.cloudinary.com/your-account/image/upload/v1/restaurant.jpg`

2. **ImgBB**
   - Free hosting
   - Example URL: `https://i.ibb.co/abc123/image.jpg`

3. **GitHub Repository**
   - Store images in `/assets/images/`
   - Use raw GitHub URLs
   - Example: `https://raw.githubusercontent.com/user/repo/main/assets/images/food.jpg`

## 🔄 Current Image Structure

### Restaurant Images (5 restaurants)
```
The Nawaabs → Fine dining restaurant image
Heart of Taj Café & Kitchen → Cozy café image
Govinda's Restaurant Mathura → Vegetarian restaurant image
Taj Terrace → Premium restaurant with view
Treat Restaurant → Family-friendly restaurant image
```

### Food Categories & Images
```
Appetizers → Starter dishes (tikka, kebabs, samosas)
Main Course → Curry dishes (butter chicken, dal, paneer)
Biryani → Rice dishes (chicken, mutton, vegetable biryani)
Breads → Indian breads (naan, roti, paratha)
Desserts → Sweet dishes (gulab jamun, kulfi, kheer)
Beverages → Drinks (lassi, chai, fresh juices)
```

## 📝 Quick Update Commands

### Update single restaurant image:
```bash
# Connect to MongoDB
mongo restaurantbot

# Update command
db.restaurants.updateOne(
  { name: "Restaurant Name" },
  { $set: { image: "https://new-image-url.com/image.jpg" } }
)
```

### Update single food image:
```bash
# Connect to MongoDB
mongo restaurantbot

# Update command
db.menus.updateOne(
  { name: "Food Item Name" },
  { $set: { image: "https://new-image-url.com/food.jpg" } }
)
```

### View current images:
```bash
# Check restaurant images
db.restaurants.find({}, { name: 1, image: 1 })

# Check food images
db.menus.find({}, { name: 1, image: 1 })
```

## 🚀 Best Practices

1. **Use consistent image dimensions** for better layout
2. **Optimize images** for web (compress before uploading)
3. **Use descriptive filenames** (e.g., `butter-chicken.jpg` not `img1.jpg`)
4. **Test image URLs** before updating database
5. **Keep backup** of original image URLs
6. **Use CDN services** for better performance

## 🔧 Troubleshooting

### Images not showing?
- Check if URL is accessible in browser
- Ensure HTTPS (not HTTP)
- Verify CORS settings if using external hosting

### Need to reset all images?
```bash
# Reset to original seed data
node server/clearData.js
node server/app.js
```

### Database connection issues?
- Check MongoDB connection string
- Ensure MongoDB service is running
- Verify database name matches your config

## 📞 Support

If you need help with image customization:
1. Check image URLs are valid and accessible
2. Verify database connection
3. Test changes with a single item first
4. Use browser developer tools to check for errors

Remember: Always backup your database before making bulk changes!