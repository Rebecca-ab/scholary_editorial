import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import notesRoutes from './routes/notesRoutes.js';
import coursesRoutes from './routes/coursesRoutes.js';
import ratingsRoutes from './routes/ratingsRoutes.js';
import commentsRoutes from './routes/commentsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use('/uploads', express.static('src/uploads'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api', ratingsRoutes);
app.use('/api', commentsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
