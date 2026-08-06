# Interview Guide

A full stack interview preparation app built with React, Vite, Node.js, Express, MongoDB, and Google GenAI.

## Overview

This project includes:

- **Backend**: Express API with authentication, interview report generation, and resume PDF output.
- **Frontend**: React + Vite UI for registration, login, creating interview reports, viewing saved reports, and downloading resume PDFs.
- **AI Service**: Uses Google GenAI to generate custom interview reports based on a resume PDF, self-description, and job description.

## Features

- User registration and login with JWT authentication via cookies
- Protected interview routes for authenticated users
- Upload a resume PDF and generate a tailored interview report
- Store and list user-specific interview reports
- Download generated resume PDF for a selected report

## Repository Structure

- `Backend/`
  - `server.js` - Express entry point
  - `src/app.js` - Application routes and middleware
  - `src/config/database.js` - MongoDB connection
  - `src/controllers/` - Request controllers
  - `src/middlewares/` - Auth and file upload middleware
  - `src/models/` - Mongoose models
  - `src/routes/` - API routes
  - `src/services/ai.service.js` - Google GenAI integration and report generation

- `Frontend/`
  - `src/` - React application source files
  - `src/features/auth/` - Authentication pages and hooks
  - `src/features/interview/` - Interview report pages, hooks, and services
  - `src/lib/api.js` - Axios API client

## Requirements

- Node.js 18+ recommended
- MongoDB database
- Google GenAI API key

## Environment Variables

Create a `.env` file in the `Backend/` folder with:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_GENAI_API_KEY=your_google_genai_api_key
```

The backend also accepts `GOOGLE_API_KEY` or `GOOGLE_API_KEY_SECRET` as alternative API key variable names.

## Setup

### Backend

```bash
cd Backend
npm install
npm run dev
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

The frontend is configured to use `http://localhost:5000/api` by default. Update `Frontend/src/lib/api.js` or set `VITE_API_URL` if your backend runs on another host.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in with email and password
- `GET /api/auth/logout` - Log out and blacklist the token
- `GET /api/auth/get-me` - Get current authenticated user details

### Interview Reports

- `POST /api/interview/` - Generate a new interview report (requires auth, resume upload, self description, job description)
- `GET /api/interview/` - Get all interview reports for the logged-in user
- `GET /api/interview/report/:interviewId` - Get a single interview report by ID
- `POST /api/interview/resume/pdf/:interviewReportId` - Generate/download a resume PDF for the interview report

## Notes

- The backend uses `cookie-parser` for auth cookies.
- Only PDF resume uploads are supported.
- The AI report generation relies on the configured Google GenAI key.

## License

This project is published under the ISC license.
