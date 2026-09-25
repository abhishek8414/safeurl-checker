# SafeURL Checker

SafeURL Checker is a full-stack cybersecurity web app that helps users analyze whether a URL appears likely safe, suspicious, or high risk based on heuristic checks.

> SafeURL Checker provides automated security analysis and should not be considered a guarantee that a website is completely safe.

## Features

- Homepage URL scanner with live analysis
- User registration and JWT login
- Protected dashboard and scan history
- MongoDB-backed storage for scan records
- Security score and risk-tier classification
- Modern responsive UI with light/dark mode support
- Backend input validation and rate limiting

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB Atlas (configured with `MONGO_URI`)
- Auth: JWT + bcrypt

## Project Structure

safeurl-checker/
├── client/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── package.json
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── .env

## Getting Started

### 1. Install dependencies

From the root folder:

npm install
npm install --prefix server
npm install --prefix client

### 2. Configure environment variables

Copy the example file and add your own values:

cp .env.example .env

Example `.env` values:

MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/safeurl?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_secure_secret
PORT=5000
FRONTEND_URL=http://localhost:5173

The backend requires a MongoDB connection. Set `MONGO_URI` to your MongoDB Atlas connection string. The server does not start an in-memory database.

### 3. Start the app

Run both frontend and backend together:

npm run dev

This starts:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### Deploy the backend on Render

Create a Web Service using the `server` directory as the Root Directory. Set the Build Command to `npm install` and the Start Command to `node server.js`. Add `MONGO_URI` (your MongoDB Atlas connection string), `JWT_SECRET` (a strong random secret), and `FRONTEND_URL` (the deployed frontend URL) to the Render environment. Render provides `PORT` automatically.

## API Endpoints

### Auth

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

### Scans

- POST /api/scan
- GET /api/scans
- GET /api/scans/:id
- DELETE /api/scans/:id
- DELETE /api/scans

## Sample URLs for Testing

- https://example.com
- https://www.paypal.com
- http://192.168.1.10
- https://secure-login-account-update.com
- https://example.com/redirect?next=login
- https://login.verify-account-secure.net

## Notes on Security Analysis

The tool performs heuristic checks such as:

- HTTPS validation
- URL length
- Suspicious keywords
- IP hostnames
- Redirect-like parameters
- Encoding or obfuscation patterns
- Punycode / IDN indicators

These checks are not definitive proof of maliciousness or safety. They are designed to support risk awareness rather than absolute security guarantees.

## License

This project is included for educational and demonstration purposes.
