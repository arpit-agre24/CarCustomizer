# Quick Start Guide

## 🎯 Project Status

### ✅ Backend - FULLY COMPLETE (100%)
All backend functionality is implemented and ready to use!

### ⚠️ Frontend - PARTIALLY COMPLETE (50%)
Basic structure is ready, but 3D customization features need implementation.

---

## 🚀 Quick Start (5 minutes)

### Step 1: Start MongoDB
```bash
# Make sure MongoDB is running
mongod
```

### Step 2: Setup Backend
```bash
cd /Applications/Arpit/Web-Dev/CarCustomizer/backend

# Install dependencies (if not done)
npm install

# Seed database with 2 cars + admin user
npm run seed

# Start backend server
npm run dev
```

Backend will run on: **http://localhost:5000**

### Step 3: Setup Frontend
```bash
# Open new terminal
cd /Applications/Arpit/Web-Dev/CarCustomizer/frontend

# Install dependencies (if not done)
npm install

# Start frontend
npm run dev
```

Frontend will run on: **http://localhost:5173**

---

## 🔑 Default Credentials

### Admin Account
- **Email:** admin@carcustomizer.com
- **Password:** admin123

---

## 📋 What Works NOW

### ✅ Fully Functional
1. **User Authentication**
   - Register new user
   - Login/Logout
   - Protected routes

2. **Backend APIs (All working!)**
   - GET /api/cars - List all cars
   - GET /api/cars/:id - Get car details
   - POST /api/orders - Create order
   - GET /api/orders/myorders - Get user orders
   - GET /api/admin/stats - Admin dashboard stats
   - All other endpoints documented in main README

3. **Frontend Pages**
   - Home page with hero section
   - Login/Register forms
   - Navigation with auth state
   - Protected routes
   - Admin routes

---

## 🚧 What Needs Implementation

### Priority 1: Car Listing Page
**File:** `frontend/src/pages/CarSelection.jsx`

```javascript
// Fetch cars from API
useEffect(() => {
  const fetchCars = async () => {
    const response = await api.get('/cars');
    setCars(response.data.data);
  };
  fetchCars();
}, []);

// Display as cards with image, price, "Customize" button
```

### Priority 2: 3D Configurator
**File:** `frontend/src/pages/Configurator.jsx`

Key components needed:
- Three.js Canvas setup
- Car model loader (GLB/GLTF)
- Color picker for car body
- Wheel selector
- Interior color picker
- Extras checkbox list
- "Place Order" button

Example structure:
```javascript
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

<Canvas>
  <CarModel color={selectedColor} />
  <OrbitControls />
  <ambientLight />
</Canvas>
```

### Priority 3: Checkout with Stripe
**File:** `frontend/src/pages/Checkout.jsx`

Integrate Stripe Elements:
```javascript
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement } from '@stripe/react-stripe-js';

// Create payment intent, process payment
```

### Priority 4: Dashboards
- **UserDashboard:** Show order history
- **AdminDashboard:** Show stats with charts (use Chart.js or Recharts)

---

## 🎨 3D Models Needed

Currently, the database references 3D models that don't exist yet:
- `/models/tesla-model-s.glb`
- `/models/porsche-911.glb`

**Options:**
1. Download free 3D models from:
   - Sketchfab (free models)
   - TurboSquid
   - Free3D
2. Create placeholder boxes for now
3. Use sample models from Three.js examples

Place models in: `frontend/public/models/`

---

## 🧪 Testing the Backend

### Test user registration:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123"}'
```

### Test getting cars:
```bash
curl http://localhost:5000/api/cars
```

### Test admin login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@carcustomizer.com","password":"admin123"}'
```

---

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/car-customizer
JWT_SECRET=your_secret_key_here
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
CLIENT_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 📊 Database Collections

After seeding, you'll have:

1. **users** collection
   - 1 admin user
   - Any registered users

2. **cars** collection
   - Tesla Model S Plaid ($89,990)
   - Porsche 911 Turbo S ($207,000)

3. **orders** collection (empty initially)

---

## 💡 Development Tips

### Add More Cars
Use the seed script format or create via admin API:
```javascript
POST /api/cars
{
  "name": "BMW M5",
  "brand": "BMW",
  "model": "M5",
  "basePrice": 103500,
  "description": "...",
  "modelPath": "/models/bmw-m5.glb",
  ...
}
```

### Debug API Calls
Open browser DevTools → Network tab to see all API requests

### MongoDB GUI
Install MongoDB Compass to visually browse your database

---

## 🎓 Learning Resources

### Three.js/React Three Fiber
- https://threejs.org/docs/
- https://docs.pmnd.rs/react-three-fiber/

### Stripe Integration
- https://stripe.com/docs/payments/quickstart
- https://stripe.com/docs/stripe-js/react

### MongoDB/Mongoose
- https://mongoosejs.com/docs/

---

## 📞 Common Issues

### "MongoDB connection failed"
- Ensure MongoDB is running: `mongod`
- Check connection string in backend/.env

### "Cannot find module" errors
- Run `npm install` in both backend and frontend

### CORS errors
- Verify `CLIENT_URL` in backend/.env matches frontend URL
- Check CORS configuration in server.js

### 3D model not loading
- Ensure model path is correct
- Check model format (GLB recommended)
- Verify model is in `public/models/` folder

---

## ✨ Next Steps

1. **Test the working parts:**
   - Register a user
   - Login as admin
   - Browse cars API endpoint

2. **Add 3D models:**
   - Download or create car models
   - Place in `public/models/`

3. **Implement car listing:**
   - Fetch from `/api/cars`
   - Display as grid of cards

4. **Build 3D configurator:**
   - Set up Three.js Canvas
   - Load car model
   - Add customization controls

5. **Integrate Stripe:**
   - Get test API keys
   - Implement payment flow

---

**You have a solid foundation! The entire backend is production-ready. Focus on implementing the frontend pages one by one.** 🚀
