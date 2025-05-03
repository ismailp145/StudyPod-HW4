import express, { Request, Response, Router } from 'express';
import { PodcastAudio } from '../types/PodcastAudio';

const router: Router = express.Router();

let podcastAudios: PodcastAudio[] = [
  { id: 1, audio: "placeholder for audio content", voiceStyle: "casual", speed: 1.0 }
];

// GET – Retrieve all podcast audios
router.get('/', (req: Request, res: Response): void => {
  res.json({ podcastAudios });
});

// POST – Create a new podcast audio
router.post('/', (req: Request, res: Response): void => {
  const { audio, voiceStyle, speed } = req.body;
  if (!audio || !voiceStyle || speed === undefined) {
    res.status(400).json({ error: "Audio, voiceStyle and speed are required" });
    return;
  }

  const newAudio: PodcastAudio = {
    id: podcastAudios.length + 1,
    audio,
    voiceStyle,
    speed,
  };

  podcastAudios.push(newAudio);
  res.status(201).json({ podcastAudios });
});

// DELETE – Remove a podcast audio by ID
router.delete('/:id', (req: Request, res: Response): void => {
  const id = parseInt(req.params.id, 10);
  const before = podcastAudios.length;
  podcastAudios = podcastAudios.filter(pa => pa.id !== id);

  if (podcastAudios.length === before) {
    res.status(404).json({ error: "Podcast audio not found" });
    return;
  }

  res.json({ message: "Podcast audio deleted", podcastAudios });
});

export default router;
