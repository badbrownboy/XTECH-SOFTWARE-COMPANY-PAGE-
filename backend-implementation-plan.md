# PeakTech Website - Backend & Database Implementation Plan

## 1. Backend Technology Stack Selection

### Recommended Primary Stack:
- **Node.js with Express.js**
  - Perfect match for your existing JavaScript frontend
  - Large ecosystem of packages and libraries
  - Easy to learn and implement
  - Great for building RESTful APIs
  
### Database Recommendation:
- **MongoDB**
  - Flexible document-based structure
  - Scales well for growing businesses
  - Works seamlessly with Node.js (MERN stack)
  - Perfect for storing customer data and projects

### Alternative Options (if preferred):
- **Firebase**
  - Quicker setup with managed authentication
  - Real-time database capabilities
  - Built-in hosting and serverless functions
  - Good for rapid deployment

## 2. Project Structure

```
PeaktechAi-main/
├── client/                 # Frontend files (your existing structure)
│   ├── assets/
│   ├── css/
│   ├── js/
│   └── index.html
├── server/                 # Backend files (to be created)
│   ├── config/             # Configuration files
│   │   ├── db.js           # Database connection
│   │   └── config.js       # Environment variables
│   ├── controllers/        # Request handlers
│   │   ├── contactController.js
│   │   ├── projectController.js
│   │   └── authController.js
│   ├── models/             # Database models
│   │   ├── Contact.js      # Customer inquiries
│   │   ├── Project.js      # Portfolio projects
│   │   └── User.js         # Admin users
│   ├── routes/             # API routes
│   │   ├── contactRoutes.js
│   │   ├── projectRoutes.js
│   │   └── authRoutes.js
│   ├── middleware/         # Custom middleware
│   │   ├── auth.js         # Authentication middleware
│   │   └── errorHandler.js
│   ├── utils/              # Helper functions
│   └── server.js           # Main server file
├── package.json            # Node.js dependencies
└── .env                    # Environment variables (not in git)
```

## 3. Database Schema Design

### Contact/Lead Schema
```javascript
{
  firstName: String,
  lastName: String,
  email: String,
  company: String,
  message: String,
  projectDescription: String,
  status: String,       // "new", "contacted", "in-progress", "completed"
  dateSubmitted: Date,
  lastUpdated: Date
}
```

### Project Schema
```javascript
{
  title: String,
  description: String,
  shortDescription: String,
  client: String,
  clientLogo: String,
  category: [String],   // "AI", "Mobile", "Web", "UI/UX"
  technologies: [String],
  features: [String],
  thumbnailImage: String,
  galleryImages: [String],
  testimonial: {
    quote: String,
    name: String,
    position: String,
    company: String
  },
  projectUrl: String,
  featured: Boolean,
  completionDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### User/Admin Schema
```javascript
{
  username: String,
  email: String,
  password: String,  // Hashed
  role: String,      // "admin", "editor"
  createdAt: Date,
  lastLogin: Date
}
```

## 4. API Endpoints

### Contact Form
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contact submissions (admin)
- `GET /api/contact/:id` - Get specific contact submission
- `PUT /api/contact/:id` - Update contact status
- `DELETE /api/contact/:id` - Delete contact submission

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/featured` - Get featured projects
- `GET /api/projects/:id` - Get specific project
- `GET /api/projects/category/:category` - Get projects by category
- `POST /api/projects` - Add new project (admin)
- `PUT /api/projects/:id` - Update project (admin)
- `DELETE /api/projects/:id` - Delete project (admin)

### Authentication
- `POST /api/auth/register` - Register new admin (secure)
- `POST /api/auth/login` - Login admin
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

## 5. Implementation Steps

### Phase 1: Setup & Basic API
1. Initialize Node.js project with Express
2. Set up MongoDB connection
3. Create basic models
4. Implement contact form submission API
5. Create basic authentication system for admin

### Phase 2: Project Management System
1. Implement project CRUD operations
2. Create portfolio filtering API
3. Add image upload capabilities
4. Implement admin dashboard for project management

### Phase 3: Frontend Integration
1. Connect contact form to backend API
2. Make portfolio/work sections dynamic
3. Add loading states and success/error messages
4. Implement authentication for admin access

### Phase 4: Advanced Features
1. Add email notifications for new inquiries
2. Implement analytics tracking
3. Create automated follow-up system
4. Add CRM-like features for lead management

## 6. Security Considerations

- Use HTTPS for all API communications
- Implement JWT for secure authentication
- Add rate limiting to prevent abuse
- Sanitize all user inputs
- Use environment variables for sensitive data
- Implement CSRF protection
- Add proper error handling

## 7. Deployment Options

### Recommended:
- **Backend**: Render.com, Heroku, or DigitalOcean
- **Database**: MongoDB Atlas (managed service)
- **Frontend**: Continue with your current hosting or Netlify/Vercel

### Alternative (All-in-one):
- **Firebase**: Hosting, Firestore, and Cloud Functions
- **AWS Amplify**: Full-stack hosting with managed backend

## 8. Estimated Timeline

- **Phase 1**: 1-2 weeks
- **Phase 2**: 2-3 weeks
- **Phase 3**: 1-2 weeks
- **Phase 4**: 2-3 weeks

Total estimated implementation time: 6-10 weeks depending on availability and complexity

## 9. First Steps to Get Started

1. Set up Node.js environment locally
2. Create a MongoDB Atlas account
3. Initialize a new Node.js project with:
   ```
   npm init
   npm install express mongoose dotenv cors bcryptjs jsonwebtoken
   ```
4. Create the server directory structure
5. Implement the basic server.js file
6. Connect to MongoDB
7. Start building your first API endpoints
