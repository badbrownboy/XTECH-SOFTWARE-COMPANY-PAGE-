# Project Portfolio Management System

This document outlines how to implement a dynamic project portfolio system for your PeakTech website, allowing you to showcase your work and manage projects through an admin interface.

## Core Features

1. Dynamic project display on the website
2. Filtering projects by category (AI, Mobile, Web, UI/UX)
3. Detailed project pages with galleries and information
4. Admin interface for adding/editing projects
5. Featured projects highlighting on the homepage

## Database Schema

### Project Model (`server/models/Project.js`)

```javascript
const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  client: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Project description is required']
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  categories: {
    type: [String],
    required: [true, 'At least one category is required'],
    enum: ['AI', 'Mobile', 'Web', 'UI/UX']
  },
  technologies: {
    type: [String],
    required: [true, 'At least one technology is required']
  },
  features: [String],
  thumbnailImage: {
    type: String,
    required: [true, 'Thumbnail image is required']
  },
  galleryImages: [String],
  projectUrl: String,
  testimonial: {
    quote: String,
    name: String,
    position: String,
    company: String,
    avatar: String
  },
  featured: {
    type: Boolean,
    default: false
  },
  completionDate: Date,
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Auto-generate slug from title
ProjectSchema.pre('save', function(next) {
  this.slug = this.title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
  next();
});

module.exports = mongoose.model('Project', ProjectSchema);
```

## API Endpoints

### Project Controller (`server/controllers/projectController.js`)

```javascript
// Example structure (to be implemented)
const Project = require('../models/Project');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// Get all projects
exports.getProjects = asyncHandler(async (req, res, next) => {
  // Add query functionality for filtering
  const projects = await Project.find();
  
  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects
  });
});

// Get single project
exports.getProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  
  if (!project) {
    return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: project
  });
});

// Create new project
exports.createProject = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.createdBy = req.user.id;
  
  const project = await Project.create(req.body);
  
  res.status(201).json({
    success: true,
    data: project
  });
});

// Update project
exports.updateProject = asyncHandler(async (req, res, next) => {
  let project = await Project.findById(req.params.id);
  
  if (!project) {
    return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
  }
  
  // Make sure user is project owner
  if (project.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this project`, 401));
  }
  
  project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: project
  });
});

// Delete project
exports.deleteProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  
  if (!project) {
    return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
  }
  
  // Make sure user is project owner
  if (project.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this project`, 401));
  }
  
  await project.remove();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// Get featured projects
exports.getFeaturedProjects = asyncHandler(async (req, res, next) => {
  const projects = await Project.find({ featured: true });
  
  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects
  });
});

// Get projects by category
exports.getProjectsByCategory = asyncHandler(async (req, res, next) => {
  const projects = await Project.find({ 
    categories: { $in: [req.params.category] } 
  });
  
  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects
  });
});
```

### Project Routes (`server/routes/projectRoutes.js`)

```javascript
const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getFeaturedProjects,
  getProjectsByCategory
} = require('../controllers/projectController');

const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getProjects);
router.get('/featured', getFeaturedProjects);
router.get('/:id', getProject);
router.get('/category/:category', getProjectsByCategory);

// Protected routes - admin only
router.post('/', protect, authorize('admin'), createProject);
router.put('/:id', protect, authorize('admin'), updateProject);
router.delete('/:id', protect, authorize('admin'), deleteProject);

module.exports = router;
```

## Frontend Integration

### Dynamic Project Loading in Work Section

```javascript
// Example JavaScript to add to your work.js file (to be implemented)
document.addEventListener('DOMContentLoaded', async function() {
  // Fetch projects from API
  try {
    const response = await fetch('/api/projects');
    const data = await response.json();
    
    if (data.success) {
      // Display projects
      renderProjects(data.data);
      
      // Set up filter buttons
      setupFilters(data.data);
    } else {
      console.error('Failed to load projects');
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
});

function renderProjects(projects) {
  const workGrid = document.querySelector('.work-grid');
  
  // Clear any existing content
  workGrid.innerHTML = '';
  
  // Generate HTML for each project
  projects.forEach(project => {
    const projectHTML = `
      <div class="work-item" data-category="${project.categories.join(' ').toLowerCase()}">
        <div class="work-card">
          <div class="work-image">
            <img src="${project.thumbnailImage}" alt="${project.title}">
            <div class="work-overlay">
              <div class="overlay-content">
                ${project.categories.map(cat => `<span class="category-tag">${cat}</span>`).join('')}
                <h3>${project.title}</h3>
                <p>${project.shortDescription}</p>
                <a href="/project/${project.slug}" class="view-project">View Project</a>
              </div>
            </div>
            <div class="ai-3d-elements">
              <div class="neural-network"></div>
              <div class="ai-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    workGrid.innerHTML += projectHTML;
  });
}

function setupFilters(projects) {
  // Get all unique categories
  const categories = [...new Set(projects.flatMap(p => p.categories))];
  
  // Set up filter buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      const filterValue = this.getAttribute('data-filter');
      const workItems = document.querySelectorAll('.work-item');
      
      // Filter work items
      workItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category').includes(filterValue)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}
```

## Admin Dashboard for Project Management

Create an admin interface to manage projects with these features:

1. Project listing with search and filtering
2. Add/edit project form with image uploads
3. Toggle featured status
4. Drag-and-drop reordering
5. Analytics for project views

## Image Upload System

For project images, implement a secure upload system:

```javascript
// Example image upload middleware (to be implemented)
const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const multer = require('multer');

// Set storage engine
const storage = multer.diskStorage({
  destination: './public/uploads/projects/',
  filename: function(req, file, cb) {
    cb(null, `project-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Check file type
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|webp/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
}

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB max
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single('image'); // 'image' is the field name

// Upload middleware
exports.uploadProjectImage = asyncHandler(async (req, res, next) => {
  upload(req, res, function(err) {
    if (err) {
      return next(new ErrorResponse(err.message, 400));
    }
    
    if (!req.file) {
      return next(new ErrorResponse('Please upload a file', 400));
    }
    
    res.status(200).json({
      success: true,
      data: {
        fileName: req.file.filename,
        filePath: `/uploads/projects/${req.file.filename}`
      }
    });
  });
});
```

## Implementation Steps

1. Set up the server and database connection
2. Create the Project model
3. Implement CRUD API endpoints
4. Add authentication for admin routes
5. Create image upload functionality
6. Modify the frontend to dynamically load projects
7. Build the admin interface for project management
8. Test thoroughly with different project types
9. Deploy and monitor performance

## Additional Features to Consider

1. **Project Categories Management** - Create an admin interface to add/edit categories
2. **Related Projects** - Show related projects based on categories or technologies
3. **Project Metrics** - Track views and engagement for each project
4. **Client Management** - Add a client database connected to projects
5. **Case Study Builder** - Create detailed case studies with custom sections and metrics
6. **SEO Optimization** - Add metadata and structured data for each project
7. **Social Sharing** - Add sharing capabilities for projects

This implementation will give you a robust system to showcase your work and impress potential clients by demonstrating your portfolio of successful projects.
