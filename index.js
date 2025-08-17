const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { createSheetHeaders, writeSheet } = require('./googleSheetService');

const app = express();

app.use(bodyParser.json()); // Parses incoming JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // Parses form data
app.use(cookieParser()); // Parses cookies
app.use(cors()); // Enables CORS for all origins

const SPREADSHEET_ID = '1EBO8CH-kSbMneKJc2ftopg5oP8ylnxT0ONaydckaGLk'; // Your actual Sheet ID

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Tech Form Backend is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    port: 5004,
    endpoints: {
      'GET /health': 'Health check',
      'GET /create-headers': 'Create sheet headers',
      'POST /submit-form': 'Submit form data'
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Tech Form Backend API',
    version: '1.0.0',
    status: 'Running',
    documentation: {
      health: 'GET /health',
      createHeaders: 'GET /create-headers',
      submitForm: 'POST /submit-form'
    }
  });
});

// Test Google Auth status
app.get('/test-auth', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  
  try {
    const keyFilePath = path.join(__dirname, 'google_auth.json');
    const keyFileContent = fs.readFileSync(keyFilePath, 'utf8');
    const credentials = JSON.parse(keyFileContent);
    
    res.json({
      status: 'Google Auth file found',
      project_id: credentials.project_id,
      client_email: credentials.client_email,
      has_private_key: !!credentials.private_key
    });
  } catch (error) {
    res.status(500).json({
      status: 'Google Auth file error',
      error: error.message
    });
  }
});

// Create headers in the sheet (run once)
app.get('/create-headers', async (req, res) => {
  try {
    await createSheetHeaders(SPREADSHEET_ID);
    res.json({ message: 'Headers created' });
  } catch (error) {
    console.error('Error creating headers:', error);
    res.status(500).json({ error: 'Failed to create headers' });
  }
});

// Write form data to sheet
app.post('/submit-form', async (req, res) => {
  try {
    //const { name, email, phone, message, consultationType, date, mode, consultant, duration } = req.body;
    const { fullName, phone, loanAmount, message } = req.body || {};

    // Validate required fields (common to all forms: Name and Phone)
    // if (!name || !phone) {
    //   return res.status(400).json({ message: 'Required fields are missing (Name and Phone)' });
    // }
    if (!fullName || !phone || !loanAmount) {
      return res.status(400).json({
        message: "Required fields are missing (Full Name, Phone Number, Loan Amount)",
      });
    }
    

    // Optional fields default to empty strings
    // const values = [[
    //   name,
    //   email || '',
    //   phone,
    //   message || '',
    //   consultationType || 'Free Online Consultation',  // Default for Form 1
    //   date || '1 August 2025 at 10:30 am',             // Default for Form 1
    //   mode || 'Online Phone Call or Gmeet',            // Default for Form 1
    //   consultant || 'Vipin Choudhary',                 // Default for Form 1
    //   duration || '15 min'                             // Default for Form 1
    // ]];

    // await writeSheet(SPREADSHEET_ID, values);
    const submittedAt = new Date().toISOString();

    const values = [[
      String(fullName).trim(),   // A: Full Name
      String(phone).trim(),      // B: Phone Number
      String(loanAmount).trim(), // C: Total Loan Amount
      message ? String(message).trim() : "", // D: Message
      submittedAt                // E: Submitted At
    ]];

    await writeSheet(SPREADSHEET_ID, values);


    res.json({ message: 'Data written to sheet' });
  } catch (error) {
    console.error('Error writing to sheet:', error);
    res.status(500).json({ error: 'Failed to write data to sheet' });
  }
});

const PORT = 5004;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));