# Getting Started

<cite>
**Referenced Files in This Document**
- [README.md](file://README.md)
- [START_APP.bat](file://START_APP.bat)
- [START_APP.ps1](file://START_APP.ps1)
- [backend/server.js](file://backend/server.js)
- [backend/.env.example](file://backend/.env.example)
- [frontend/vite.config.js](file://frontend/vite.config.js)
- [frontend/.env.example](file://frontend/.env.example)
- [backend/controllers/authController.js](file://backend/controllers/authController.js)
- [backend/models/User.js](file://backend/models/User.js)
- [backend/models/Loan.js](file://backend/models/Loan.js)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Environment Configuration](#environment-configuration)
5. [Initial Setup Procedures](#initial-setup-procedures)
6. [Running the Application](#running-the-application)
7. [Verification Steps](#verification-steps)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Expected Behavior During Initial Setup](#expected-behavior-during-initial-setup)
10. [Conclusion](#conclusion)

## Introduction
This guide helps you set up and run the Smart Loan & Debt Stress Analyzer locally. It covers prerequisites, installation, environment configuration, both manual and automated startup approaches, verification steps, and troubleshooting for common issues.

## Prerequisites
Ensure you have the following installed before proceeding:
- Node.js v14 or higher
- npm v6 or higher (comes with Node.js)
- Git
- MongoDB Atlas account
- Postman (optional, for API testing)

These requirements are essential for building and running both the backend and frontend applications.

**Section sources**
- [README.md:93-101](file://README.md#L93-L101)

## Installation
Follow these steps to install the application:

1. Clone the repository
   - Use Git to clone the repository and navigate into the project directory.

2. Backend setup
   - Navigate to the backend directory.
   - Install dependencies using npm.
   - Create a `.env` file with required variables (see Configuration section).

3. Frontend setup
   - Navigate to the frontend directory.
   - Install dependencies using npm.
   - Create a `.env` file with the API base URL (see Configuration section).

4. Optional: Use the automated startup scripts
   - Double-click either `START_APP.bat` (Windows Command Prompt) or `START_APP.ps1` (PowerShell) to automatically install dependencies and start both servers.

**Section sources**
- [README.md:103-171](file://README.md#L103-L171)
- [README.md:208-233](file://README.md#L208-L233)

## Environment Configuration
Configure environment variables for both backend and frontend:

Backend (.env)
- Create a `.env` file in the backend directory with the following keys:
  - MONGO_URI: Your MongoDB connection string
  - PORT: Backend port (default 5000)
  - JWT_SECRET: Secret key for JWT signing
  - GEMINI_API_KEY: Gemini API key for AI features

Frontend (.env)
- Create a `.env` file in the frontend directory with:
  - VITE_API_URL: Base URL for API requests (e.g., http://localhost:5000/api)

Notes:
- The backend defaults to localhost MongoDB if MONGO_URI is missing.
- The frontend proxies API requests to the backend on port 5000.

**Section sources**
- [backend/.env.example:1-9](file://backend/.env.example#L1-L9)
- [frontend/.env.example:1-2](file://frontend/.env.example#L1-L2)
- [backend/server.js:21](file://backend/server.js#L21)
- [frontend/vite.config.js:11-18](file://frontend/vite.config.js#L11-L18)

## Initial Setup Procedures
Complete these steps to prepare your local environment:

1. MongoDB Atlas setup
   - Create a cluster and database user.
   - Obtain the connection string and add it to the backend `.env`.
   - Configure network access to allow connections from your IP or anywhere.

2. Generate a JWT secret
   - Use a cryptographically secure random generator to create a strong JWT_SECRET.

3. Configure CORS
   - The backend enables CORS for development with credentials and various methods.

4. Start the backend
   - Run the backend in development mode to initialize the database connection and create indexes.

5. Start the frontend
   - Run the frontend in development mode; it will proxy API calls to the backend.

**Section sources**
- [README.md:172-207](file://README.md#L172-L207)
- [backend/server.js:9-18](file://backend/server.js#L9-L18)
- [backend/server.js:67-85](file://backend/server.js#L67-L85)

## Running the Application
Choose one of the following approaches:

Option 1: Manual startup (recommended for development)
- Terminal 1: Start the backend
  - Navigate to the backend directory and run the development script.
- Terminal 2: Start the frontend
  - Navigate to the frontend directory and run the development script.
- Visit the frontend at http://localhost:5173.

Option 2: Automated startup (Windows)
- Double-click `START_APP.bat` or `START_APP.ps1` to automatically install dependencies and start both servers.
- The scripts open separate terminal windows for backend and frontend, then open the browser.

Notes:
- The backend listens on port 5000.
- The frontend runs on port 5173 and proxies API calls to the backend.

**Section sources**
- [README.md:9-18](file://README.md#L9-L18)
- [README.md:208-233](file://README.md#L208-L233)
- [START_APP.bat:44](file://START_APP.bat#L44)
- [START_APP.ps1:57](file://START_APP.ps1#L57)
- [START_APP.ps1:74](file://START_APP.ps1#L74)

## Verification Steps
After starting both servers, verify the setup:

1. Backend health check
   - Access the backend health endpoint to confirm it is running.
   - Expected response indicates success and current timestamp.

2. Frontend availability
   - Open the frontend in your browser at http://localhost:5173.
   - Ensure the UI loads without errors.

3. API connectivity
   - Use Postman to test authentication endpoints:
     - Register a user
     - Login to obtain a token
     - Use the token to access protected routes

4. Database connectivity
   - Confirm the backend logs show successful MongoDB connection.
   - Verify that indexes are created for AI features.

**Section sources**
- [backend/server.js:125-127](file://backend/server.js#L125-L127)
- [README.md:408-486](file://README.md#L408-L486)
- [backend/server.js:32-42](file://backend/server.js#L32-L42)
- [backend/server.js:44-65](file://backend/server.js#L44-L65)

## Troubleshooting Guide
Common issues and resolutions:

- MongoDB connection error
  - Verify the MONGO_URI in the backend `.env` file.
  - Ensure network access settings allow connections from your IP.
  - Confirm your internet connection and cluster availability.

- Port conflicts
  - If port 5000 (backend) or 5173 (frontend) is in use, terminate the conflicting process.
  - Change the PORT in the backend `.env` if needed.

- CORS errors
  - Ensure the frontend VITE_API_URL points to the backend address.
  - Restart the backend after changing CORS-related settings.

- Token expiration
  - Default token expiry is 7 days; adjust as needed in the authentication controller.
  - Users will need to log in again after expiry.

- Index creation conflicts
  - The backend handles known index conflicts gracefully during initialization.

**Section sources**
- [README.md:574-598](file://README.md#L574-L598)
- [backend/server.js:67-85](file://backend/server.js#L67-L85)
- [backend/server.js:44-65](file://backend/server.js#L44-L65)
- [backend/controllers/authController.js:5](file://backend/controllers/authController.js#L5)

## Expected Behavior During Initial Setup
- Backend startup
  - Initializes database connection with retry logic.
  - Creates indexes for AI features.
  - Logs successful connection and health status.

- Frontend startup
  - Proxies API requests to the backend.
  - Opens the application in the default browser.

- First-time users
  - Register a new user, then log in to receive a JWT token.
  - Use the token to access protected routes and dashboard features.

- Database behavior
  - User and Loan models are created with required fields.
  - Financial profile fields are initialized for new users.

**Section sources**
- [backend/server.js:67-85](file://backend/server.js#L67-L85)
- [backend/server.js:44-65](file://backend/server.js#L44-L65)
- [backend/models/User.js:4-17](file://backend/models/User.js#L4-L17)
- [backend/models/Loan.js:3-15](file://backend/models/Loan.js#L3-L15)
- [backend/controllers/authController.js:5](file://backend/controllers/authController.js#L5)

## Conclusion
You now have the Smart Loan & Debt Stress Analyzer running locally. Use the manual startup method for development flexibility or the automated scripts for convenience. If you encounter issues, refer to the troubleshooting section. For production deployment, update environment variables and configure MongoDB Atlas accordingly.