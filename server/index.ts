import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { Resend } from 'resend';
import { db } from './db.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for Vite frontend
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Easing sanitization to protect against XSS injections
function sanitize(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Initialize Resend client conditionally to prevent server crash when RESEND_API_KEY is not set
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

if (!resendApiKey) {
  console.warn('WARNING: RESEND_API_KEY is not configured in environment variables. Email notifications will be skipped.');
}

// Admin Authorization Middleware
const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader === process.env.ADMIN_PASSWORD) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized. Invalid admin password.' });
  }
};

// Rate Limiter: Max 3 submissions per IP per 10 minutes
const consultationRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  message: { error: 'Too many consultation requests from this IP. Please try again in 10 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Predefined option lists for validations
const VALID_BUSINESS_TYPES = [
  'Restaurant', 'Cafe', 'Gym', 'Doctor / Clinic', 'Dentist', 'Real Estate',
  'Coaching Institute', 'Interior Design', 'Construction', 'E-commerce',
  'Salon', 'Photography', 'Agency', 'Other'
];

const VALID_SERVICES = [
  'Business Website', 'Website Redesign', 'Landing Page',
  'Google Business Profile Optimization', 'Website Maintenance', 'SEO', 'Branding', 'Other'
];

const VALID_BUDGETS = [
  'Under ₹4,000', '₹4,000 – ₹8,000', '₹8,000 – ₹12,000',
  '₹12,000 – ₹20,000', '₹20,000+', 'Not Sure Yet'
];

const VALID_TIMELINES = [
  'ASAP', 'Within 1 Week', 'Within 2 Weeks', 'Within 1 Month', 'Flexible'
];

/* ============================================================== */
/* API ROUTES */
/* ============================================================== */

// Root health check route
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Delhi Doors API Server is running.' });
});

// 1. Submit consultation request
app.post('/api/consultation', consultationRateLimiter, (req, res) => {
  const {
    name,
    company,
    email,
    phone,
    website,
    businessType,
    services,
    description,
    budget,
    customBudget,
    timeline,
    website_trap // Honeypot trap
  } = req.body;

  // SPAM Protection: Honeypot field checked
  if (website_trap) {
    console.log('[SPAM DETECTED] Honeypot field filled. Silently discarding.');
    return res.status(200).json({ success: true, message: 'Consultation request received.' });
  }

  // Server-Side Validations
  if (!name || !name.trim()) return res.status(400).json({ error: 'Full name is required.' });
  if (!company || !company.trim()) return res.status(400).json({ error: 'Company name is required.' });
  
  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'Email address is required.' });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  
  if (!phone || !phone.trim()) {
    return res.status(400).json({ error: 'Phone number is required.' });
  } else if (!/^[0-9+\-\s()]{7,15}$/.test(phone.trim())) {
    return res.status(400).json({ error: 'Please enter a valid phone number.' });
  }

  if (!businessType || !VALID_BUSINESS_TYPES.includes(businessType)) {
    return res.status(400).json({ error: 'Please select a valid business type.' });
  }

  if (!services || !Array.isArray(services) || services.length === 0) {
    return res.status(400).json({ error: 'Please select at least one service.' });
  }

  // Verify all services are valid
  const hasInvalidService = services.some(s => !VALID_SERVICES.includes(s));
  if (hasInvalidService) {
    return res.status(400).json({ error: 'One or more selected services are invalid.' });
  }

  if (!description || !description.trim()) {
    return res.status(400).json({ error: 'Project details/description is required.' });
  } else if (description.trim().length < 10) {
    return res.status(400).json({ error: 'Description must be at least 10 characters.' });
  }

  if (!budget || !VALID_BUDGETS.includes(budget)) {
    return res.status(400).json({ error: 'Please select a valid budget range.' });
  }

  if (!timeline || !VALID_TIMELINES.includes(timeline)) {
    return res.status(400).json({ error: 'Please select a valid timeline.' });
  }

  // Sanitize all text fields to prevent XSS
  const sanitizedName = sanitize(name.trim());
  const sanitizedCompany = sanitize(company.trim());
  const sanitizedEmail = sanitize(email.trim());
  const sanitizedPhone = sanitize(phone.trim());
  const sanitizedWebsite = website ? sanitize(website.trim()) : '';
  const sanitizedDescription = sanitize(description.trim());
  const sanitizedCustomBudget = customBudget ? sanitize(customBudget.trim()) : '';

  const id = 'lead_' + Date.now();
  const createdAt = new Date().toISOString();

  // Parameterized SQLite Query (Prevents SQL Injection)
  const query = `
    INSERT INTO consultation_requests (
      id, full_name, company_name, email, phone, website,
      business_type, services_requested, project_description,
      budget_range, expected_budget, timeline, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [
    id,
    sanitizedName,
    sanitizedCompany,
    sanitizedEmail,
    sanitizedPhone,
    sanitizedWebsite,
    businessType,
    JSON.stringify(services),
    sanitizedDescription,
    budget,
    sanitizedCustomBudget,
    timeline,
    'New Lead',
    createdAt
  ], function(err) {
    if (err) {
      console.error('Error inserting lead into SQLite:', err.message);
      return res.status(500).json({ error: 'Internal server error storing lead.' });
    }

    // Trigger Email Notification
    const emailSubject = `🚀 New Delhi Doors Lead`;
    const emailBody = `New consultation request received.

Full Name: ${sanitizedName}
Company Name: ${sanitizedCompany}
Email: ${sanitizedEmail}
Phone Number: ${sanitizedPhone}
Website URL: ${sanitizedWebsite || 'N/A'}
Business Type: ${businessType}
Services Requested: ${services.join(', ')}
Budget Range: ${budget}
Expected Budget: ${sanitizedCustomBudget || 'N/A'}
Timeline: ${timeline}
Project Description:
${sanitizedDescription}
Submission Date: ${new Date(createdAt).toLocaleString()}`;

    if (resend) {
      // Send lead notification email via Resend
      resend.emails.send({
        from: 'Delhi Doors Leads <onboarding@resend.dev>',
        to: process.env.NOTIFICATION_EMAIL || 'hello@delhidoors.com',
        subject: emailSubject,
        text: emailBody
      }).then((response) => {
        if (response.error) {
          console.error('Error sending Resend notification:', response.error.message);
        } else {
          console.log('Lead notification email sent successfully via Resend:', response.data?.id);
        }
      }).catch((mailErr) => {
        console.error('Uncaught error sending Resend notification:', mailErr);
      });
    } else {
      console.warn('Resend notification email skipped because RESEND_API_KEY is not configured.');
    }

    res.status(200).json({ success: true, message: 'Consultation request received.' });
  });
});

// 2. Admin Login Password Verification
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password && password === process.env.ADMIN_PASSWORD) {
    return res.status(200).json({ success: true });
  }
  res.status(401).json({ error: 'Invalid admin password.' });
});

// 3. Fetch all leads (Requires Admin Auth)
app.get('/api/leads', requireAdmin, (req, res) => {
  db.all('SELECT * FROM consultation_requests ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      console.error('Error fetching leads:', err.message);
      return res.status(500).json({ error: 'Error fetching leads database.' });
    }
    
    // Convert services string array back to JSON array
    const formattedRows = rows.map((row: any) => ({
      id: row.id,
      timestamp: row.created_at,
      name: row.full_name,
      company: row.company_name,
      email: row.email,
      phone: row.phone,
      website: row.website,
      businessType: row.business_type,
      services: JSON.parse(row.services_requested),
      description: row.project_description,
      budget: row.budget_range,
      customBudget: row.expected_budget,
      timeline: row.timeline,
      status: row.status
    }));

    res.status(200).json(formattedRows);
  });
});

// 4. Update Lead Status (Requires Admin Auth)
app.put('/api/leads/:id/status', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['New Lead', 'Contacted', 'Proposal Sent', 'Closed Won', 'Closed Lost'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value.' });
  }

  db.run('UPDATE consultation_requests SET status = ? WHERE id = ?', [status, id], function(err) {
    if (err) {
      console.error('Error updating status in SQLite:', err.message);
      return res.status(500).json({ error: 'Error updating lead status.' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Lead not found.' });
    }
    
    res.status(200).json({ success: true, id, status });
  });
});

// Start listening
app.listen(PORT, () => {
  console.log(`Backend server successfully listening on port ${PORT}`);
});
