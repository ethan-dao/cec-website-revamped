# CEC Website Revamped

A full stack web application featuring a Next.js frontend, an Express backend, a Supabase PostgreSQL database, and Cloudflare R2 storage.

# Project Structure

This project uses a Monorepo structure:

cec-website-revamped/
- ├── client/   # Frontend (Next.js + Tailwind CSS) hosted on Vercel
- ├── server/   # Backend (Express.js + Node.js) hosted on DigitalOcean

# Getting Started
## 1. Clone the Repository
- git clone https://github.com/ethan-dao/cec-website-revamped.git
- cd cec-website-revamped

## 2. Backend Setup (server)

The backend handles all API requests, database connections, and file uploads.

### Install Dependencies and configure .env variables
- cd server
- npm install
- Then, add .env file once you are done to access database and object storage

### Run the server
- npm run build (Run whenever you make changes to any server files)
- npm start

Server runs at:
http://localhost:4000

## 3. Frontend Setup (client)

The frontend connects directly to the backend API.

### Install Dependencies and configure environmental variables
- cd ../client
- npm install
- Then, add .env file once you are done to access deployment


### Run the Frontend
- npm run dev

Frontend runs at:
http://localhost:3000

# API Endpoints
- GET	/	Health check. Returns "API is running".
- POST	/upload	Uploads file to Cloudflare R2. Expects file in form-data.
- GET	/test-db	Tests connection to Supabase notes table.
