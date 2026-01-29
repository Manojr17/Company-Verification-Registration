# Company Registration & Verification Module

A full-stack web application for company registration and verification built with modern technologies and a sleek dark theme with neon blue accents.

## 🚀 Tech Stack

### Frontend
- **React 19** with Vite for fast development
- **Redux Toolkit** for state management
- **Material-UI (MUI)** with Emotion for styling
- **React Hook Form** for form handling
- **React Query** for data fetching and caching
- **Firebase Auth** for authentication (email/password + SMS OTP)
- **Cloudinary** for image uploads (logo/banner)
- **React Router DOM** for routing
- **React Toastify** for notifications
- **React Responsive** for responsive design

### Backend
- **Node.js 20** with Express framework
- **PostgreSQL 15** database
- **bcrypt** for password hashing
- **JWT** tokens with 90-day expiry
- **express-validator** for input validation
- **sanitize-html** for input sanitization
- **libphonenumber-js** for phone number validation
- **helmet** for security headers
- **cors** for cross-origin requests
- **compression** for response compression

## 🎨 Design Features

- **Dark Theme** with primary background (#010a1f)
- **Neon Blue Glow Effects** (#00f7ff) on all interactive elements
- **Responsive Design** optimized for all device sizes
- **Smooth Animations** and micro-interactions
- **Modern UI Components** with glassmorphism effects

## 🔐 Security Features

- Firebase Authentication with email verification
- JWT-based API authentication
- Input validation and sanitization
- SQL injection protection
- XSS protection with security headers
- Password hashing with bcrypt
- Rate limiting and CORS protection

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   ├── auth/           # Authentication components
│   │   ├── common/         # Reusable components
│   │   ├── company/        # Company-related components
│   │   └── dashboard/      # Dashboard components
│   ├── config/             # Configuration files
│   ├── services/           # API services
│   └── store/              # Redux store and slices
├── backend/
│   ├── config/             # Database and Firebase config
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── routes/             # API routes
│   └── database/           # Database schema
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20 or higher
- PostgreSQL 15 or higher
- Firebase project with Authentication enabled
- Cloudinary account for image uploads

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Database setup:**
   ```bash
   # Create PostgreSQL database
   createdb company_registration_db
   
   # Run the schema migration
   psql -d company_registration_db -f database/schema.sql
   ```

3. **Environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration values
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase and Cloudinary config
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🔧 Environment Configuration

### Backend (.env)
```env
PORT=3001
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=company_registration_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=90d

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
```

### Frontend (.env)
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your_app_id

VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

VITE_API_BASE_URL=http://localhost:3001/api
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Company Management
- `POST /api/company/register` - Register new company
- `PUT /api/company/update` - Update company profile
- `GET /api/company/profile` - Get company profile

## 🔄 User Flow

1. **Registration:** User creates account with Firebase Auth
2. **Verification:** Email verification sent automatically
3. **Login:** Firebase auth + backend JWT token generation
4. **Company Registration:** Multi-step form with image uploads
5. **Dashboard:** View and manage company profile
6. **Profile Management:** Edit user and company details

## 🎯 Key Features

- **Multi-step Company Registration** with progress tracking
- **Image Upload** for company logo and banner via Cloudinary
- **Real-time Form Validation** with helpful error messages
- **Responsive Design** that works on all devices
- **Dark Mode UI** with neon glow effects
- **Toast Notifications** for user feedback
- **Protected Routes** with authentication checks
- **Profile Management** for users and companies

## 🛠️ Custom Components

- **NeonInput:** Input component with neon blue glow effects
- **NeonButton:** Button component with hover animations
- **LoadingSpinner:** Animated loading component with neon effects
- **ProtectedRoute:** Route wrapper for authentication

## 📱 Responsive Breakpoints

- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

## 🔒 Security Considerations

- All inputs are validated and sanitized
- JWT tokens have 90-day expiration
- Firebase handles secure authentication
- SQL injection protection with parameterized queries
- XSS protection with Content Security Policy
- HTTPS enforcement in production

## 🚀 Deployment

The application is ready for production deployment with:
- Environment-based configuration
- Security headers and CORS setup
- Optimized build process
- Database migrations
- Health check endpoints

## 📄 License

This project is licensed under the MIT License.