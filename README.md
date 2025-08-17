# TechResolve Backend - Loan Application API

A Node.js Express backend service for handling loan application form submissions with Google Sheets integration.

## Features

- **REST API** for loan application submissions
- **Google Sheets Integration** for automatic data storage
- **Form Validation** with required fields
- **CORS Support** for frontend integration
- **Health Check** endpoint for monitoring
- **Real-time Data Logging** with timestamps

## API Endpoints

### Health Check
```http
GET /health
```
Returns server status and available endpoints.

### Submit Loan Application
```http
POST /submit-form
Content-Type: application/json

{
  "fullName": "John Doe",
  "phone": "1234567890",
  "loanAmount": "50000",
  "message": "Need a personal loan for home renovation"
}
```

### Create Sheet Headers
```http
GET /create-headers
```
One-time setup to create column headers in Google Sheet.

## Required Fields

- **fullName** (string) - Applicant's full name
- **phone** (string) - Contact phone number
- **loanAmount** (string) - Total loan amount requested

## Optional Fields

- **message** (string) - Additional message or loan purpose

## Google Sheets Structure

The data is automatically stored in Google Sheets with the following columns:

| Column | Field | Description |
|--------|-------|-------------|
| A | Full Name | Applicant's complete name |
| B | Phone Number | Contact phone number |
| C | Total Loan Amount | Requested loan amount |
| D | Message | Additional notes or loan purpose |
| E | Submitted At | ISO timestamp of submission |

## Setup Instructions

### Prerequisites

- Node.js v16+ (tested with v22.12.0)
- Google Cloud Project with Sheets API enabled
- Google Service Account credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/techresolve360/backend.git
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Google Sheets Integration**
   
   a. Create a Google Cloud Project
   b. Enable Google Sheets API
   c. Create a service account and download JSON credentials
   d. Rename the credentials file to `google_auth.json`
   e. Place it in the project root directory

4. **Configure Google Sheet**
   
   a. Create a new Google Sheet or use existing one
   b. Copy the Sheet ID from the URL
   c. Update `SPREADSHEET_ID` in `index.js`
   d. Share the sheet with your service account email (found in `google_auth.json`)

5. **Start the server**
   ```bash
   # For Node.js v22+
   NODE_OPTIONS="--openssl-legacy-provider" npm start
   
   # For older Node.js versions
   npm start
   ```

### Environment Setup

For production deployment, consider using environment variables:

```bash
PORT=5004
SPREADSHEET_ID=your_sheet_id_here
```

## Configuration

### Update Sheet ID

In `index.js`, update the `SPREADSHEET_ID` constant:

```javascript
const SPREADSHEET_ID = 'your_google_sheet_id_here';
```

### Google Service Account

Ensure your `google_auth.json` file contains:

- `project_id`
- `client_email`
- `private_key`
- Other required Google service account fields

## Security Notes

- ⚠️ **Never commit `google_auth.json` to version control**
- The file is already added to `.gitignore`
- Use environment variables for production deployments
- Ensure proper CORS configuration for production

## API Response Examples

### Successful Submission
```json
{
  "message": "Data written to sheet"
}
```

### Validation Error
```json
{
  "message": "Required fields are missing (Full Name, Phone Number, and Loan Amount)"
}
```

### Server Error
```json
{
  "error": "Failed to write data to sheet"
}
```

## Development

### Running in Development
```bash
npm run dev  # Uses nodemon for auto-restart
```

### Testing Endpoints

**Health Check:**
```bash
curl http://localhost:5004/health
```

**Submit Application:**
```bash
curl -X POST http://localhost:5004/submit-form \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Jane Smith",
    "phone": "9876543210",
    "loanAmount": "25000",
    "message": "Business loan for expansion"
  }'
```

## Technology Stack

- **Backend Framework:** Express.js
- **Runtime:** Node.js
- **Data Storage:** Google Sheets API
- **Authentication:** Google Service Account
- **Dependencies:**
  - `express` - Web framework
  - `googleapis` - Google API client
  - `cors` - Cross-origin resource sharing
  - `body-parser` - Request body parsing
  - `cookie-parser` - Cookie handling

## Deployment

### Heroku Deployment

1. Create `Procfile`:
   ```
   web: NODE_OPTIONS="--openssl-legacy-provider" node index.js
   ```

2. Set environment variables:
   ```bash
   heroku config:set SPREADSHEET_ID=your_sheet_id
   ```

3. Add `google_auth.json` content as environment variable

### Vercel Deployment

1. Configure `vercel.json`
2. Set environment variables in Vercel dashboard
3. Handle `google_auth.json` through environment variables

## Troubleshooting

### Common Issues

1. **"Failed to create headers"**
   - Ensure Google Sheet is shared with service account email
   - Verify `google_auth.json` file exists and is valid

2. **Private key error with Node.js v22+**
   - Use `NODE_OPTIONS="--openssl-legacy-provider"` flag

3. **CORS errors**
   - Verify frontend domain is allowed
   - Check CORS configuration in `index.js`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License

## Support

For issues and questions, please create an issue in this repository.

---

**Repository:** https://github.com/techresolve360/backend
**Server:** http://localhost:5004 (development) 