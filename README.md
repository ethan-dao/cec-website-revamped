CEC Website Revamped

A full-stack web application featuring a Next.js frontend, Express backend, Supabase database, and Cloudflare R2 storage.

🏗 Project Structure

This project uses a Monorepo structure:

client/: The Frontend (Next.js + Tailwind CSS) hosted on Vercel.

server/: The Backend (Express.js + Node.js) hosted on DigitalOcean.

🚀 Getting Started

1. Clone the Repository

git clone [https://github.com/your-username/cec-website-revamped.git](https://github.com/your-username/cec-website-revamped.git)
cd cec-website-revamped


2. Backend Setup (Server)

The backend handles API requests, database connections, and file uploads.

Install Dependencies:

cd server
npm install


Configure Environment Variables:

Create a file named .env inside the server/ folder.

Add the following keys (see How to get Keys below):

PORT=4000
# Database (Supabase)
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.xyz.supabase.co:5432/postgres
SUPABASE_URL=[https://your-project.supabase.co](https://your-project.supabase.co)
SUPABASE_KEY=your_service_role_key

# Storage (Cloudflare R2)
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET_NAME=cec-uploads


Run the Server:

npm run dev


The server will start at http://localhost:4000.

3. Frontend Setup (Client)

The frontend connects to the backend API.

Install Dependencies:

cd ../client
npm install


Configure Environment Variables:

Create a file named .env.local inside the client/ folder.

Add the API URL:

# For local development
NEXT_PUBLIC_API_URL=http://localhost:4000

# For production (Vercel), update this in the Vercel Dashboard


Run the Frontend:

npm run dev


The website will start at http://localhost:3000.

🔑 How to Get Your Keys

1. Supabase (Database)

DATABASE_URL: Go to Supabase Dashboard → Settings → Database → Connection String → URI. (Don't forget to replace [YOUR-PASSWORD] with your actual DB password).

SUPABASE_URL: Go to Settings → API.

SUPABASE_KEY: Go to Settings → API → Project API Keys. Use the service_role (secret) key for the backend.

2. Cloudflare R2 (Storage)

Account ID: R2 Dashboard → Right sidebar (Account Details).

Access/Secret Keys: R2 Dashboard → Manage R2 API Tokens → Create API Token.

Permissions: Object Read & Write.

Bucket: Select your specific bucket (cec-uploads).

Bucket Name: The name you gave the bucket (e.g., cec-uploads).

🛠 API Endpoints

Method

Endpoint

Description

GET

/

Health check (Returns "API is running")

POST

/upload

Uploads a file to Cloudflare R2. Expects a form-data body with key file.

GET

/test-db

Verifies connection to Supabase notes table.

📦 Deployment

Frontend (Vercel)

Import the client folder as the Root Directory in Vercel.

Add the NEXT_PUBLIC_API_URL environment variable in Vercel Settings.

Backend (DigitalOcean Droplet)

SSH into the droplet.

Clone the repo and navigate to server/.

Add .env file with production secrets.

Run npm run build then pm2 start dist/index.js.
