# 🚗 CarCustomizer - Full Stack Car Customization Platform

A modern full-stack web application for customizing cars with 3D visualization, built with React, Three.js, Node.js, Express, and MongoDB.

## Features

- 🔐 User Authentication (JWT)
- 🎨 Real-time car customization with 3D preview
- 💳 Stripe payment integration
- 👤 Admin dashboard for managing cars and orders
- 📱 Responsive design
- 🚀 Modern UI with React and Vite

## Tech Stack

### Frontend
- React 18
- Vite
- Three.js (for 3D car models)
- React Router
- Axios

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- Stripe API

## Project Structure

```
CarCustomizer/
├── backend/           # Node.js backend
│   ├── config/       # Database configuration
│   ├── controllers/  # Route controllers
│   ├── middleware/   # Auth middleware
│   ├── models/       # Mongoose models
│   ├── routes/       # API routes
│   └── utils/        # Utility functions
├── frontend/         # React frontend
│   ├── public/       # Static assets
│   ├── src/          # Source code
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   └── utils/
│   └── package.json
└── README.md
```

## Local Development Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/CarCustomizer.git
cd CarCustomizer
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
cp .env.example .env
# Edit .env with your credentials
```

4. **Run the Application**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5001/api

## Deployment Options

### Option 1: Deploy on Render (Recommended for Full-Stack)

#### Backend Deployment:
1. Go to https://render.com and create an account
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Name: car-customizer-backend
   - Environment: Node
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
5. Add environment variables from your `.env` file
6. Deploy!

#### Frontend Deployment:
1. In Render dashboard, click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - Name: car-customizer-frontend
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/dist`
4. Add environment variables from your `.env` file
5. Deploy!

### Option 2: Deploy on Railway

1. Go to https://railway.app
2. Create a new project
3. Deploy from GitHub
4. Add environment variables
5. Railway will automatically detect and deploy both frontend and backend

### Option 3: Deploy Frontend on Vercel/Netlify

#### Vercel:
```bash
cd frontend
npm install -g vercel
vercel login
vercel
```

Follow the prompts and add environment variables in Vercel dashboard.

#### Netlify:
```bash
cd frontend
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

### Option 4: Deploy on Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create car-customizer-api

# Deploy
git push heroku main
```

### Option 5: Deploy on DigitalOcean App Platform

1. Go to https://cloud.digitalocean.com/apps
2. Click "Create App"
3. Connect GitHub repository
4. Configure components (frontend and backend)
5. Add environment variables
6. Deploy

## Environment Variables

### Backend (.env)
```
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=production
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
CLIENT_URL=your_frontend_url
```

### Frontend (.env)
```
VITE_API_URL=your_backend_api_url
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## MongoDB Setup

For production, use MongoDB Atlas:
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in backend `.env`

## Stripe Setup

1. Go to https://dashboard.stripe.com
2. Get your API keys (Test or Production)
3. Update keys in both frontend and backend `.env` files

## Making First Admin User

After deployment, run this script on the server:
```bash
cd backend
node makeAdmin.js
```

Or use the registration page and manually update user role in MongoDB.

## API Endpoints

### Authentication
- POST /api/auth/register - Register user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Cars
- GET /api/cars - Get all cars
- GET /api/cars/:id - Get car by ID
- POST /api/cars - Create car (admin)
- PUT /api/cars/:id - Update car (admin)
- DELETE /api/cars/:id - Delete car (admin)

### Orders
- GET /api/orders - Get user orders
- POST /api/orders - Create order
- GET /api/orders/:id - Get order by ID

### Payment
- POST /api/payment/create-intent - Create payment intent

## Troubleshooting

### Database Connection Issues
- Check MongoDB is running
- Verify connection string
- Check network access (for Atlas)

### Payment Issues
- Verify Stripe keys are correct
- Check webhook configuration
- Ensure HTTPS in production

### Build Errors
- Clear node_modules and reinstall
- Check Node.js version
- Verify all environment variables

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Support

For issues and questions, please create an issue on GitHub.

---

Made with ❤️ using React, Node.js, and Three.js
