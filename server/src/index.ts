// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 4000;

// app.use(cors({
//   origin: [
//     "http://localhost:3000", 
//     "https://cec-website-revamped.vercel.app/"
//   ] 
// }));
// app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('API is running');
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2Client } from './storage.js'; 
import { supabase } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const upload = multer({ storage: multer.memoryStorage() });

app.use(cors({
    origin: [
      "http://localhost:3000",                         
      "https://cec-website-revamped.vercel.app",        
      /\.vercel\.app$/                                 // Allow ALL Vercel preview URLs
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  }));

app.use(express.json());

// test uploads to cloudflare r2
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileName = `${Date.now()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await r2Client.send(command);

    const publicUrl = `https://pub-${process.env.R2_ACCOUNT_ID}.r2.dev/${fileName}`;
    
    res.json({ 
      success: true, 
      url: publicUrl,
      fileName: fileName 
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// test upload to database
app.get('/test-db', async (req, res) => {
    try {
        // query test database
        const { data, error } = await supabase
        .from('notes')
        .select('*');

        if (error) throw error;

        res.json({ 
        message: "Database connection successful!", 
        data: data 
        });

    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database connection failed' });
    }
  });

app.get('/', (req, res) => {
    res.send('API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ARCHIVE API ENDPOINTS

// GET all events for a specific drawer (category)
app.get('/archive/:category', async (req, res) => {
    const { category } = req.params;

    try {
        const { data, error } = await supabase
        .from('archive_events')
        .select('*')
        .eq('category', category)
        .order('event_date', { ascending: false });

        if (error) throw error;
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch drawer' });
    }
});
  
// GET all images for a specific event
app.get('/archive/event/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
        const { data, error } = await supabase
            .from('archive_images')
            .select('*')
            .eq('event_id', id);
  
        if (error) throw error;
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch images' });
    }
});