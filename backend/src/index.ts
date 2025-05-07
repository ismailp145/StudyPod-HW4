import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import podcastSummaryRoutes from './routes/podcastSummaryRoutes';
import userRoutes from './routes/userRoutes';
import podcastAudioRoutes from './routes/podcastAudioRoutes';
import * as dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/podcast-summary', podcastSummaryRoutes);
app.use('/users', userRoutes);
app.use('/podcast-audio', podcastAudioRoutes);

// Root test route
app.get('/', (req: Request, res: Response): void => {
  res.send('StudyPod API is running - Convert your study materials to podcasts!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});