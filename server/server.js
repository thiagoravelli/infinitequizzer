import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { validateTheme } from './controllers/themeController.js';
import { generateQuestion } from './controllers/questionController.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Serve static files from the public directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.post('/api/validateTheme', validateTheme);
app.post('/api/generateQuestion', generateQuestion);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
