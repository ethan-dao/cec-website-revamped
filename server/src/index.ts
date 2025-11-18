import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// CRITICAL: Allow your Vercel domain here later
app.use(cors({
  origin: [
    "http://localhost:3000", 
    "https://your-vercel-project.vercel.app"
  ] 
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});