# Node.js Server Setup Guide

This guide provides step-by-step instructions for setting up the Node.js backend server for your PeakTech website.

## Prerequisites

- Node.js (v14.x or later) installed
- npm (v6.x or later) installed
- MongoDB account (for database)
- Basic knowledge of JavaScript and Express

## Step 1: Initialize Project

1. Open your terminal and navigate to your project directory
2. Create a `server` folder in your project root:

```bash
mkdir -p server/config server/controllers server/models server/routes server/middleware server/utils
```

3. Initialize a new Node.js project:

```bash
cd server
npm init -y
```

4. Update the package.json with scripts and information:

```json
{
  "name": "peaktech-backend",
  "version": "1.0.0",
  "description": "Backend API for PeakTech website",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "author": "Your Name",
  "license": "MIT"
}
```

## Step 2: Install Dependencies

Install the necessary packages:

```bash
npm install express mongoose dotenv cors helmet morgan bcryptjs jsonwebtoken express-rate-limit express-mongo-sanitize xss-clean hpp cookie-parser multer nodemailer
npm install -D nodemon
```

Package purposes:
- `express`: Web framework
- `mongoose`: MongoDB ORM
- `dotenv`: Environment variables
- `cors`: Cross-Origin Resource Sharing
- `helmet`: Security headers
- `morgan`: HTTP request logger
- `bcryptjs`: Password hashing
- `jsonwebtoken`: JWT authentication
- `express-rate-limit`: Rate limiting
- `express-mongo-sanitize`: Prevent NoSQL injection
- `xss-clean`: Prevent XSS attacks
- `hpp`: HTTP Parameter Pollution protection
- `cookie-parser`: Parse cookies
- `multer`: File uploads
- `nodemailer`: Send emails
- `nodemon`: Development auto-restart

## Step 3: Create Environment Variables

Create a `.env` file in the server directory:

```
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Email configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASSWORD=your_password
FROM_EMAIL=noreply@peaktech.com
FROM_NAME=PeakTech
```

⚠️ Add `.env` to your `.gitignore` file to keep secrets secure!

## Step 4: Create Server Entry Point

Create a `server.js` file in the server directory:

```javascript
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const auth = require('./routes/authRoutes');
const projects = require('./routes/projectRoutes');
const contact = require('./routes/contactRoutes');

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security middleware
app.use(cors());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(hpp());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/auth', auth);
app.use('/api/projects', projects);
app.use('/api/contact', contact);

// Custom error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
```

## Step 5: Set Up Database Connection

Create a `db.js` file in the config directory:

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;
```

## Step 6: Create Error Handling Middleware

Create an `error.js` file in the middleware directory:

```javascript
const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log for dev
  console.log(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};

module.exports = errorHandler;
```

## Step 7: Create Error Response Utility

Create an `errorResponse.js` file in the utils directory:

```javascript
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ErrorResponse;
```

## Step 8: Create Async Handler Middleware

Create an `async.js` file in the middleware directory:

```javascript
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
```

## Step 9: Create Authentication Middleware

Create an `auth.js` file in the middleware directory:

```javascript
const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    // Set token from cookie
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
```

## Step 10: Frontend Integration

To connect your frontend to this backend:

1. Update your contact form to submit to `/api/contact` endpoint
2. Modify your portfolio section to fetch projects from `/api/projects`
3. Create an admin login page that connects to `/api/auth/login`

Example frontend code to submit the contact form:

```javascript
// Add this to a new file js/contact.js and include it in your HTML
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.querySelector('.contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const formData = {
        firstName: document.querySelector('input[placeholder="First Name"]').value,
        lastName: document.querySelector('input[placeholder="Last Name"]').value,
        email: document.querySelector('input[type="email"]').value,
        company: document.querySelector('input[placeholder="Company"]').value,
        message: document.querySelector('textarea').value
      };
      
      try {
        const submitBtn = document.querySelector('.contact-submit-btn');
        submitBtn.innerHTML = 'Sending...';
        submitBtn.disabled = true;
        
        const response = await fetch('http://localhost:5000/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
          contactForm.innerHTML = `
            <div class="success-message">
              <h3>Thanks for reaching out!</h3>
              <p>We've received your message and will contact you soon.</p>
            </div>
          `;
        } else {
          throw new Error(data.error || 'Something went wrong');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('There was a problem submitting the form. Please try again.');
        
        const submitBtn = document.querySelector('.contact-submit-btn');
        submitBtn.innerHTML = 'Submit';
        submitBtn.disabled = false;
      }
    });
  }
});
```

## Step 11: Running the Server

1. Start the server in development mode:

```bash
npm run dev
```

2. Access the API at `http://localhost:5000/api`

## Step 12: Deployment

For production deployment:

1. Choose a hosting provider (Heroku, DigitalOcean, Render.com, etc.)
2. Set up environment variables in the hosting dashboard
3. Connect your GitHub repository or upload files
4. Configure the build process
5. Set up MongoDB Atlas for production database
6. Update CORS settings to allow only your domain
7. Implement SSL for secure connections

## Next Steps

After setting up the basic server:

1. Implement user authentication (admin accounts)
2. Create the contact form submission handling
3. Build the project portfolio management system
4. Add analytics tracking
5. Set up automated email notifications
6. Create an admin dashboard

These steps will give you a solid foundation for adding backend functionality to your PeakTech website.
