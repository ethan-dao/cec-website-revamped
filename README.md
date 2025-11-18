CEC Website Revamped

A full stack web application featuring a Next.js frontend, an Express backend, a Supabase PostgreSQL database, and Cloudflare R2 storage.

Project Structure

This project uses a Monorepo structure:

cec-website-revamped/
│
├── client/   # Frontend (Next.js + Tailwind CSS) hosted on Vercel
├── server/   # Backend (Express.js + Node.js) hosted on DigitalOcean

Getting Started
1. Clone the Repository
git clone https://github.com/your-username/cec-website-revamped.git
cd cec-website-revamped

2. Backend Setup (server)

The backend handles all API requests, database connections, and file uploads.

Install Dependencies
cd server
npm install

Configure Environment Variables

Create a file named .env inside the server/ folder.

Add the following keys:

PORT=4000

# Database (Supabase)
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.xyz.supabase.co:5432/postgres
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_service_role_key

# Storage (Cloudflare R2)
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET_NAME=cec-uploads

Run the Server
npm run dev


Server runs at:

http://localhost:4000

3. Frontend Setup (client)

The frontend connects directly to the backend API.

Install Dependencies
cd ../client
npm install

Configure Environment Variables

Create a file named .env.local inside the client/ folder:

NEXT_PUBLIC_API_URL=http://localhost:4000


For production, update this value in the Vercel Dashboard.

Run the Frontend
npm run dev


Frontend runs at:

http://localhost:3000

How to Get Your Keys
Supabase (Database)

DATABASE_URL
Supabase Dashboard → Settings → Database → Connection String → URI
Replace [YOUR-PASSWORD] with your actual password.

SUPABASE_URL
Supabase Dashboard → Settings → API.

SUPABASE_KEY
Supabase Dashboard → Settings → API → Project API Keys.
Use the service_role key for backend only.

Cloudflare R2 (Storage)

Account ID
R2 Dashboard → Right sidebar.

Access and Secret Keys
R2 Dashboard → Manage R2 API Tokens → Create API Token.
Permissions: Object Read and Write.

Bucket Name
The bucket you created (example: cec-uploads).

API Endpoints
Method	Endpoint	Description
GET	/	Health check. Returns "API is running".
POST	/upload	Uploads file to Cloudflare R2. Expects file in form-data.
GET	/test-db	Tests connection to Supabase notes table.
Deployment
Frontend (Vercel)

Import the client/ folder as the root directory.

Add NEXT_PUBLIC_API_URL in Vercel Environment Variables.

Backend (DigitalOcean Droplet)

SSH into the droplet.

Clone the repo and go to server/.

Add your production .env file.

Build and run:

npm run build
npm start
