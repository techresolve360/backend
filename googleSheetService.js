const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Read and parse the service account key file
const keyFilePath = path.join(__dirname, 'google_auth.json');
let credentials;

try {
  const keyFileContent = fs.readFileSync(keyFilePath, 'utf8');
  credentials = JSON.parse(keyFileContent);
} catch (error) {
  console.error('Error reading google_auth.json:', error.message);
  credentials = null;
}

const auth = credentials ? new google.auth.GoogleAuth({
  credentials: credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
}) : null;

const sheets = auth ? google.sheets({ version: 'v4', auth }) : null;

const createSheetHeaders = async (spreadsheetId) => {
  if (!sheets) {
    throw new Error('Google Sheets authentication not configured properly');
  }
  
  // const headers = [['Name', 'Email', 'Phone Number', 'Message', 'Consultation Type', 'Date', 'Mode', 'Consultant', 'Duration']];

  // await sheets.spreadsheets.values.update({
  //   spreadsheetId,
  //   range: 'Sheet1!A1:I1', // Range for 9 columns
  //   valueInputOption: 'RAW',
  //   requestBody: {
  //     values: headers
  //   }
  // });
  // createSheetHeaders
// const headers = [
//   ["Full Name", "Phone Number", "Total Loan Amount", "Preferred Language", "Call Time", "Submitted At"]
// ];
const headers = [
  ["Full Name", "Phone Number", "Total Loan Amount", "City","Other City", "Submitted At"]
];

await sheets.spreadsheets.values.update({
  spreadsheetId,
  range: "Sheet1!A1:F1",
  valueInputOption: "RAW",
  requestBody: { values: headers },
});


  console.log('Headers created');
};

const writeSheet = async (spreadsheetId, values) => {
  if (!sheets) {
    throw new Error('Google Sheets authentication not configured properly');
  }
  
  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Sheet1!A:F', // Range for 5 columns (Full Name, Phone, Loan Amount, Message, Submitted At)
    valueInputOption: 'RAW',
    requestBody: {
      values
    }
  });

  console.log('Data written:', response.data);
};

module.exports = { createSheetHeaders, writeSheet };