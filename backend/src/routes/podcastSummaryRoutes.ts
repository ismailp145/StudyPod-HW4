import express, { NextFunction, Request, Response, Router } from 'express';
import { PrismaClient } from '../generated/prisma';
import dotenv from 'dotenv';
import { PodcastSummarySchema } from '../schema/PodcastSummary.schema';
import { GoogleGenerativeAI } from '@google/generative-ai';
dotenv.config();
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
// Validate the Body Request Middleware
const validatePodcastSummary = (req: Request, res: Response, next: NextFunction) => {
  try {
    PodcastSummarySchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid request body", details: error });
  }
};

// Create a new podcast
 router.post('/', validatePodcastSummary, async (req: Request, res: Response): Promise<void> => {
  const { title, summary } = req.body;

  if (!title || !summary) {
    res.status(400).json({ error: 'Title and summary are required' });
    return;
  }

  if (title.length > 50000) {
    console.log("Payload Too Large: Input text exceeds limit.");
    res.status(413).json({ error: "Input text too long." });
    return;
  }

  const prompt = `
  You are a podcast script writer. Your task is to generate an engaging podcast script
  (approximately 2-4 minutes speaking time) based on the following text.

  The script should include:
  - A clear introduction by a host (or hosts).
  - The main content derived from the input text, presented in a conversational style.
  - Avoid outputting any markdown formatting.
  - A concluding remark or sign-off.

  Input Text:
  ---
  ${summary}
  ---

  Podcast Script:
  `;

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  const model = ai.getGenerativeModel({
      model: "gemini-2.0-flash", 
  });
   if (!GEMINI_API_KEY) {
      console.error("FATAL ERROR: GEMINI_API_KEY environment variable is not set.");
      process.exit(1); // Exit if API key is missing
  }

    try {
      // --- Gemini API Call ---
      console.log(`Sending request to Gemini API (text length: ${summary.length})...`);
      const result = await model.generateContent(prompt);
      const response = result.response;
      const podcastScript = response.text();
      console.log("Successfully received response from Gemini API.");


      // --- Return Result ---
      // res.status(200).json({ podcast_script: podcastScript });
      
    const newPodcast = await prisma.podcastSummary.create({
          data: {
            title,
            summary: podcastScript,
          },
        });
    res.status(201).json({ podcastSummary: newPodcast });
    return 

  } catch (error) {
      // --- Error Handling ---
      console.error("Error calling Gemini API:", error);

      // Check if it's a safety-related blocking error
      if (error instanceof Error && error.message.includes('SAFETY')) {
          res.status(400).json({ error: "Content blocked due to safety settings.", details: error.message });
          return
      }
      
      // Generic server error
      res.status(500).json({ error: "Failed to generate podcast script due to an internal server error." });
      return
    }

});

router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled Error:", err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
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
