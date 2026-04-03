# Car Customizer - MERN Stack with Three.js

A full-stack car customization website built with **MERN Stack** (MongoDB, Express, React, Node.js) and **Three.js** for 3D visualization. Users can customize cars in real-time 3D, place orders, and make payments through Stripe integration.

## 🚀 Features

### User Features
- ✅ User authentication (Register/Login with JWT)
- ✅ Browse available car models
- ✅ Real-time 3D car customization with Three.js
- ✅ Customize colors, wheels, interior, and extras
- ✅ Place orders with customization details
- ✅ Secure payment processing with Stripe
- ✅ User dashboard to view past orders
- ✅ Responsive design

### Admin Features
- ✅ Admin authentication and authorization
- ✅ View all orders and manage order status
- ✅ Dashboard with analytics (revenue, orders, users)
- ✅ Monthly revenue charts
- ✅ Top selling cars insights
- ✅ User management
- ✅ Car inventory management (CRUD operations)

## 🛠️ Tech Stack

### Backend
- **Node.js** & **Express.js** - Server and API
- **MongoDB** & **Mongoose** - Database
- **JWT** - Authentication
- **Bcrypt.js** - Password hashing
- **Stripe** - Payment gateway
- **Express Validator** - Input validation
- **CORS** - Cross-origin resource sharing
- **Cookie Parser** - Cookie handling

### Frontend
- **React 18** with **Vite** - UI framework
- **React Router DOM** - Routing
- **Three.js** - 3D rendering
- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - Three.js helpers
- **Axios** - HTTP client
- **Stripe React** - Payment components

## 📁 Project Structure

```
CarCustomizer/
├── backend/
│   ├── config/
│   │   └── database.js           # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── carController.js      # Car CRUD operations
│   │   ├── orderController.js    # Order management
│   │   ├── adminController.js    # Admin dashboard
│   │   └── paymentController.js  # Stripe integration
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Car.js                # Car schema
│   │   └── Order.js              # Order schema
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── carRoutes.js          # Car endpoints
│   │   ├── orderRoutes.js        # Order endpoints
│   │   ├── adminRoutes.js        # Admin endpoints
│   │   └── paymentRoutes.js      # Payment endpoints
│   ├── middleware/
│   │   └── auth.js               # JWT verification & role check
│   ├── utils/
│   │   └── tokenUtils.js         # Token generation
│   ├── .env                      # Environment variables
│   ├── server.js                 # Express server
│   ├── seedData.js               # Database seeding script
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── auth/
    │   │   │   ├── ProtectedRoute.jsx
    │   │   │   └── AdminRoute.jsx
    │   │   ├── layout/
    │   │   │   └── Navbar.jsx
    │   │   ├── car/              # 3D car components (TO DO)
    │   │   ├── admin/            # Admin components (TO DO)
    │   │   └── payment/          # Payment components (TO DO)
    │   ├── pages/
    │   │   ├── Home.jsx          # Landing page (TO DO)
    │   │   ├── Login.jsx         # Login page (TO DO)
    │   │   ├── Register.jsx      # Register page (TO DO)
    │   │   ├── CarSelection.jsx  # Car listing (TO DO)
    │   │   ├── Configurator.jsx  # 3D customizer (TO DO)
    │   │   ├── Checkout.jsx      # Checkout page (TO DO)
    │   │   ├── UserDashboard.jsx # User orders (TO DO)
    │   │   └── AdminDashboard.jsx# Admin panel (TO DO)
    │   ├── contexts/
    │   │   └── AuthContext.jsx   # Auth state management
    │   ├── utils/
    │   │   └── api.js            # Axios configuration
    │   ├── App.jsx               # Main app component
    │   └── main.jsx              # Entry point
    ├── .env                      # Environment variables
    ├── package.json
    └── vite.config.js

```

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Stripe account (for payment processing)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd CarCustomizer/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Edit `.env` file with your credentials:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/car-customizer
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   JWT_EXPIRE=7d
   NODE_ENV=development
   
   # Stripe Payment Gateway
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   
   # Frontend URL
   CLIENT_URL=http://localhost:5173
   ```

4. **Start MongoDB:**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Seed the database (adds 2 cars + admin user):**
   ```bash
   npm run seed
   ```
   
   **Admin Credentials:**
   - Email: `admin@carcustomizer.com`
   - Password: `admin123`

6. **Start the backend server:**
   ```bash
   npm run dev
   ```
   
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd CarCustomizer/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Edit `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   App will run on `http://localhost:5173`

## 📊 Database Schema

### User Model
- name, email, password (hashed)
- role (user/admin)
- phone, address
- createdAt

### Car Model
- name, brand, model
- basePrice, description
- specifications (engine, hp, torque, etc.)
- modelPath (3D model file)
- thumbnail, images
- customizationOptions:
  - colors (with prices)
  - wheels (with prices)
  - interior (with prices)
  - extras (with prices)
- isAvailable

### Order Model
- user, car (references)
- customization (selected options)
- pricing (base + customization + total)
- customerDetails
- paymentInfo (Stripe payment details)
- orderStatus (pending/confirmed/processing/shipped/delivered/cancelled)
- deliveryDate, notes
- createdAt, updatedAt

## 🔐 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /me` - Get current user
- `GET /logout` - Logout user
- `PUT /updatedetails` - Update user details
- `PUT /updatepassword` - Update password

### Cars (`/api/cars`)
- `GET /` - Get all cars
- `GET /:id` - Get single car
- `GET /:id/customization` - Get customization options
- `POST /` - Create car (Admin only)
- `PUT /:id` - Update car (Admin only)
- `DELETE /:id` - Delete car (Admin only)

### Orders (`/api/orders`)
- `POST /` - Create order
- `GET /myorders` - Get user orders
- `GET /:id` - Get single order
- `PUT /:id/status` - Update order status (Admin)
- `PUT /:id/payment` - Update payment status

### Admin (`/api/admin`)
- `GET /orders` - Get all orders
- `GET /stats` - Get dashboard statistics
- `GET /users` - Get all users
- `PUT /users/:id/role` - Update user role
- `DELETE /users/:id` - Delete user

### Payment (`/api/payment`)
- `POST /create-payment-intent` - Create Stripe payment
- `GET /config` - Get Stripe publishable key
- `POST /webhook` - Stripe webhook handler

## 🎨 Pre-seeded Cars

### 1. Tesla Model S Plaid
- **Price:** $89,990
- **Engine:** Tri Motor All-Wheel Drive
- **Horsepower:** 1,020 hp
- **Colors:** Pearl White, Solid Black, Midnight Silver, Deep Blue, Red Multi-Coat
- **Wheels:** 19" Tempest, 21" Arachnid
- **Interior:** All Black, Black & White, Cream
- **Extras:** Enhanced Autopilot, FSD, Premium Audio

### 2. Porsche 911 Turbo S
- **Price:** $207,000
- **Engine:** 3.8L Twin-Turbo Flat-6
- **Horsepower:** 640 hp
- **Colors:** Carrara White, Jet Black, Racing Yellow, Guards Red, Miami Blue, GT Silver
- **Wheels:** 20/21" Turbo S, 20/21" Sport Classic
- **Interior:** Black, Bordeaux Red, Cognac, Chalk Leather
- **Extras:** Sport Chrono, Burmester Sound, Carbon Ceramic Brakes, Sport Exhaust

## 🔄 What's Completed

### ✅ Backend (100%)
- [x] Server setup with Express
- [x] MongoDB connection
- [x] User authentication with JWT
- [x] User and Admin models
- [x] Car and Order models
- [x] All CRUD operations
- [x] Role-based authorization
- [x] Stripe payment integration
- [x] Webhook handling
- [x] Admin dashboard APIs
- [x] Analytics & insights
- [x] Database seeding script

### ✅ Frontend (40%)
- [x] React app with Vite
- [x] Project structure
- [x] Routing setup
- [x] AuthContext for state management
- [x] Protected routes
- [x] Admin routes
- [x] API utility with Axios
- [x] Navbar component
- [ ] Authentication pages (Login/Register)
- [ ] Home/Landing page
- [ ] Car selection page
- [ ] 3D Car configurator with Three.js
- [ ] Customization panel UI
- [ ] Checkout page with Stripe
- [ ] User dashboard
- [ ] Admin dashboard
- [ ] Styling/CSS

## 🚧 Next Steps (Frontend Pages to Build)

### Priority 1: Authentication Pages
1. **Login.jsx** - User login form
2. **Register.jsx** - User registration form

### Priority 2: Main Pages
3. **Home.jsx** - Landing page with hero section
4. **CarSelection.jsx** - Display all available cars

### Priority 3: 3D Customization
5. **Configurator.jsx** - Main 3D configurator page
6. **CarViewer.jsx** (component) - Three.js 3D car viewer
7. **CustomizationPanel.jsx** (component) - Options panel

### Priority 4: Checkout & Payment
8. **Checkout.jsx** - Order summary and payment
9. **StripeCheckout.jsx** (component) - Stripe payment form

### Priority 5: Dashboards
10. **UserDashboard.jsx** - User order history
11. **AdminDashboard.jsx** - Admin panel with stats

### Priority 6: Styling
12. Add CSS for all components
13. Make responsive design
14. Add animations and transitions

## 📝 Notes for 3D Implementation

### Three.js Setup
```javascript
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useGLTF } from '@react-three/drei';

// Car model loader
function CarModel({ modelPath, color }) {
  const { scene } = useGLTF(modelPath);
  // Apply color to car body material
  // Return primitive with the scene
}

// Main configurator
<Canvas camera={{ position: [5, 2, 5] }}>
  <ambientLight intensity={0.5} />
  <spotLight position={[10, 10, 10]} />
  <CarModel modelPath={car.modelPath} color={selectedColor} />
  <OrbitControls />
  <Environment preset="sunset" />
</Canvas>
```

### 3D Model Requirements
- Format: `.glb` or `.gltf`
- Car models should have named materials (e.g., "Body", "Interior", "Wheels")
- Place models in `frontend/public/models/` directory

## 🔧 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`

### Stripe Payment Issues
- Verify Stripe keys are correct
- Use test keys for development
- Test cards: `4242 4242 4242 4242`

### CORS Errors
- Ensure backend `CLIENT_URL` matches frontend URL
- Check CORS configuration in `server.js`

## 🤝 Contributing

This is a boilerplate project. Feel free to:
- Add more car models
- Implement additional customization options
- Improve UI/UX design
- Add more admin features
- Implement email notifications
- Add social authentication

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🙋‍♂️ Support

For issues or questions:
1. Check the API endpoints are working: `http://localhost:5000/api/health`
2. Verify MongoDB connection
3. Check browser console for frontend errors
4. Review server logs for backend errors

---

**Built with ❤️ using MERN Stack + Three.js**
