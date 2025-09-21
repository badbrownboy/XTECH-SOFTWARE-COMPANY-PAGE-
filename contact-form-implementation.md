# Contact Form Backend Implementation

This document provides details on how to implement the backend functionality for the contact form on your PeakTech website.

## Form Data Processing Flow

```
User Submits Form → Client-side Validation → API Request → Server Validation → Database Storage → Email Notification → Response to User
```

## 1. Required Server Files

### Contact Controller (`server/controllers/contactController.js`)

This will handle the logic for processing contact form submissions:

```javascript
// Example structure (to be implemented)
const Contact = require('../models/Contact');
const sendEmail = require('../utils/email');

// Submit a new contact form
exports.submitContact = async (req, res) => {
  try {
    // Extract form data
    const { firstName, lastName, email, company, message } = req.body;
    
    // Create new contact entry
    const newContact = new Contact({
      firstName,
      lastName,
      email,
      company,
      message,
      status: 'new',
      dateSubmitted: Date.now()
    });
    
    // Save to database
    await newContact.save();
    
    // Send notification email to admin
    await sendEmail({
      to: 'admin@peaktech.com',
      subject: 'New Contact Form Submission',
      text: `New inquiry from ${firstName} ${lastName} (${email})`
    });
    
    // Send confirmation email to user
    await sendEmail({
      to: email,
      subject: 'Thank you for contacting PeakTech',
      text: `Dear ${firstName}, thank you for reaching out to us. We'll be in touch shortly.`
    });
    
    // Return success
    return res.status(201).json({ 
      success: true, 
      message: 'Contact form submitted successfully' 
    });
    
  } catch (error) {
    console.error('Contact form submission error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'There was a problem submitting your form' 
    });
  }
};

// Get all contacts (admin only)
exports.getContacts = async (req, res) => {
  // Admin functionality - will require authentication
};

// Other controller methods for updating status, deleting, etc.
```

### Contact Model (`server/models/Contact.js`)

This defines the database schema for storing contact submissions:

```javascript
// Example structure (to be implemented)
const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    trim: true,
    lowercase: true
  },
  company: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'in-progress', 'completed', 'archived'],
    default: 'new'
  },
  dateSubmitted: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Contact', ContactSchema);
```

### Contact Routes (`server/routes/contactRoutes.js`)

This defines the API endpoints for the contact form:

```javascript
// Example structure (to be implemented)
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');

// Public route - anyone can submit a contact form
router.post('/', contactController.submitContact);

// Protected routes - only admins can access
router.get('/', protect, authorize('admin'), contactController.getContacts);
router.get('/:id', protect, authorize('admin'), contactController.getContact);
router.put('/:id', protect, authorize('admin'), contactController.updateContact);
router.delete('/:id', protect, authorize('admin'), contactController.deleteContact);

module.exports = router;
```

## 2. Frontend Integration

Modify the existing contact form in `index.html` to submit data to your API:

```javascript
// Example JavaScript to add to your frontend (to be implemented)
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.querySelector('.contact-form');
  
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form data
    const firstName = document.querySelector('input[placeholder="First Name"]').value;
    const lastName = document.querySelector('input[placeholder="Last Name"]').value;
    const email = document.querySelector('input[type="email"]').value;
    const company = document.querySelector('input[placeholder="Company"]').value;
    const message = document.querySelector('textarea').value;
    
    // Show loading state
    document.querySelector('.contact-submit-btn').textContent = 'Sending...';
    
    try {
      // Send data to your API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          company,
          message
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Show success message
        contactForm.innerHTML = `
          <div class="success-message">
            <h3>Thank you for reaching out!</h3>
            <p>We've received your message and will get back to you shortly.</p>
          </div>
        `;
      } else {
        // Show error
        throw new Error(data.message || 'Something went wrong');
      }
      
    } catch (error) {
      // Show error message
      document.querySelector('.contact-submit-btn').textContent = 'Submit';
      alert('There was a problem submitting your form: ' + error.message);
    }
  });
});
```

## 3. Admin Dashboard Setup

For managing submitted contacts, you'll need an admin dashboard:

1. Create a secure admin login page
2. Build a dashboard to view and manage contact submissions
3. Implement sorting, filtering, and status updates
4. Add functionality to export contacts to CSV

## 4. Email Notification System

Set up an email service to notify both admins and users:

```javascript
// Example email utility (to be implemented)
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });

  // Define email options
  const mailOptions = {
    from: `PeakTech <${process.env.FROM_EMAIL}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
```

## 5. Recommended Email Services

- **SendGrid** - Great for transactional emails
- **Mailgun** - Developer-friendly with good free tier
- **AWS SES** - Cost-effective for high volume
- **Postmark** - High deliverability for transactional emails

## 6. Security Considerations

- Implement rate limiting on the contact form to prevent spam
- Add CAPTCHA or other bot protection
- Sanitize all inputs to prevent injection attacks
- Don't expose email addresses in responses
- Secure the admin dashboard with proper authentication

## 7. Implementation Checklist

- [ ] Set up Node.js/Express server
- [ ] Configure MongoDB database
- [ ] Create Contact model
- [ ] Implement contact form submission endpoint
- [ ] Add email notification system
- [ ] Connect frontend form to API
- [ ] Add form validation (both client and server side)
- [ ] Create admin authentication system
- [ ] Build admin dashboard for contact management
- [ ] Test the entire flow
- [ ] Deploy to production
