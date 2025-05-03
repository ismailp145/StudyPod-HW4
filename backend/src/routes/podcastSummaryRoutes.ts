import express, { Request, Response, Router } from 'express';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();
const router: Router = express.Router();

// GET - Retrieve all podcasts
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const podcastSummaries = await prisma.podcastSummary.findMany();
    res.json({ podcastSummaries });
  } catch (error) {
    console.error('Error fetching podcasts:', error);
    res.status(500).json({ error: 'Failed to retrieve podcasts' });
  }
});

// Create a new podcast
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { title, summary } = req.body;

  if (!title || !summary) {
    res.status(400).json({ error: 'Title and summary are required' });
    return;
  }

  try {
    const newPodcast = await prisma.podcastSummary.create({
      data: {
        title,
        summary,
      },
    });

    res.status(201).json({ podcastSummary: newPodcast });
  } catch (error) {
    console.error('Error creating podcast:', error);
    res.status(500).json({ error: 'Failed to create podcast' });
  }
});

// Remove a podcast by ID
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;

  try {
    const deletedPodcast = await prisma.podcastSummary.delete({
      where: {
        id: id,
      },
    });

    res.json({ message: 'Podcast deleted', deletedPodcast });
  } catch (error) {
    console.error('Error deleting podcast:', error);
    res
      .status(404)
      .json({ error: 'Podcast not found or could not be deleted' });
  }
});

export default router;
