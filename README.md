# 🛍️ SmartCart - AI-Powered E-commerce Application

A full-stack MERN e-commerce application with AI voice assistant integration for college project.

## ✨ Features

### User Features
- 🔐 User Authentication (Register/Login with JWT)
- 🛒 Shopping Cart Management
- 📦 Product Browsing with Filters & Search
- ⭐ Product Reviews & Ratings
- 🛍️ Order Placement & History
- 🎤 **AI Voice Assistant** (Unique Feature!)

### Admin Features
- 📊 Admin Dashboard with Statistics
- 📦 Product Management (CRUD operations)
- 🛒 Order Management
- 📁 Category Management

### AI Voice Assistant
- 🎙️ Voice-activated product search
- 💬 Natural language understanding
- 🤖 AI-powered recommendations (Google Gemini API)
- 📊 Voice-controlled shopping
- 🔊 Text-to-Speech responses

## 🚀 Technology Stack

### Frontend
- React.js
- Context API (State Management)
- React Router
- Web Speech API (Voice Recognition & Synthesis)
- React Icons
- React Toastify

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- Bcrypt.js
- Google Gemini AI API

### Database
- MongoDB (300-400 products with real images)

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation)
- npm or yarn

### 1. Clone the Repository
```bash
cd ecom
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create `.env` file in server directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key_here_change_this
GEMINI_API_KEY=your_gemini_api_key_here
```

**Get Gemini API Key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key (FREE)
3. Copy and paste it in `.env` file

### 3. Seed Database with 300+ Products

```bash
npm run seed
```

This will create:
- 8 Categories
- 300-400 Products with real images
- Sample users (admin & regular user)
- Sample orders

### 4. Start Backend Server

```bash
npm run dev
```

Server will run on `http://localhost:5000`

### 5. Setup Frontend

Open a new terminal:

```bash
cd client
npm install
npm start
```

Frontend will run on `http://localhost:3000`

## 👤 Demo Credentials

### Admin Account
- Email: `admin@ecom.com`
- Password: `admin123`

### User Account
- Email: `john@example.com`
- Password: `password123`

## 🎤 Using the Voice Assistant

1. Click the **microphone button** (floating button at bottom-right)
2. Speak your command clearly
3. Wait for AI response

### Example Voice Commands:
- "Show me laptops under 50000"
- "Recommend best smartphones"
- "What's trending in electronics?"
- "Add to cart"
- "Show my cart"
- "Compare iPhone and Samsung"

## 📂 Project Structure

```
ecom/
├── server/              # Backend (Node.js + Express)
│   ├── models/         # MongoDB schemas
│   ├── controllers/    # Business logic
│   ├── routes/         # API routes
│   ├── middleware/     # Auth & error handling
│   ├── config/         # Database config
│   ├── scripts/        # Seed data script
│   └── server.js       # Entry point
│
└── client/             # Frontend (React)
    ├── public/
    └── src/
        ├── components/ # Reusable components
        ├── pages/      # Page components
        ├── context/    # Context API (Auth, Cart, Voice)
        └── App.js      # Main app component
```

## 🔑 Key Features Explained

### 1. AI Voice Assistant
- Uses **Web Speech API** for voice recognition
- Integrates **Google Gemini AI** for intelligent responses
- Combines rule-based logic with AI for fast & smart responses
- Text-to-Speech for voice replies

### 2. Hybrid AI Approach
- **Rule-based**: Fast responses for simple commands (add to cart, show products)
- **AI-powered**: Complex queries handled by Gemini API (recommendations, comparisons)
- **Fallback**: Works offline for basic commands

### 3. Product Management
- 300+ products with real images from DummyJSON + custom data
- Advanced filtering (category, price, rating)
- Search functionality
- Pagination

### 4. Shopping Experience
- Guest cart (localStorage)
- User cart (database)
- Real-time cart updates
- Order tracking

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove from cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/myorders` - Get user orders
- `GET /api/orders` - Get all orders (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)

### AI Voice Assistant
- `POST /api/ai/voice-command` - Process voice command
- `POST /api/ai/recommendations` - Get AI recommendations
- `POST /api/ai/search` - Voice search products

## 🎨 Browser Support

Voice features work best in:
- ✅ Chrome/Edge (Recommended)
- ✅ Safari (iOS/macOS)
- ⚠️ Firefox (Limited support)

## 📝 Notes for College Project

### Unique Selling Points:
1. **AI Voice Assistant** - First of its kind in college projects
2. **Large Dataset** - 300+ products with real images
3. **Modern Tech Stack** - Latest MERN technologies
4. **Professional UI** - Clean, responsive design
5. **Complete Features** - End-to-end e-commerce functionality

### Presentation Tips:
1. Demonstrate voice assistant first (most impressive!)
2. Show product filtering & search
3. Complete a purchase flow
4. Show admin panel
5. Explain hybrid AI approach

## 🐛 Troubleshooting

### Voice Not Working?
- Use Chrome or Edge browser
- Allow microphone permissions
- Check if Gemini API key is set correctly

### MongoDB Connection Error?
- Make sure MongoDB is running: `mongod`
- Check connection string in `.env`

### Port Already in Use?
- Backend: Change PORT in `.env`
- Frontend: It will automatically ask for different port

## 📄 License

This project is created for educational purposes (College Project).

## 👨‍💻 Author

Created for college project - MERN Stack with AI Integration

---

## 🎉 Getting Started Quick Commands

```bash
# 1. Install backend dependencies
cd server && npm install

# 2. Setup environment variables
copy .env.example .env
# (Edit .env and add your Gemini API key)

# 3. Seed database with 300+ products
npm run seed

# 4. Start backend
npm run dev

# 5. In new terminal - Install frontend dependencies
cd client && npm install

# 6. Start frontend
npm start

# 7. Open browser at http://localhost:3000
# 8. Click microphone button and start talking! 🎤
```