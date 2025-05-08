import express, { NextFunction, Request, Response, Router } from 'express';
import { PodcastSummary } from '../types/PodcastSummary';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import { PodcastSummarySchema } from '../schema/PodcastSummary.schema';

const router: Router = express.Router();

dotenv.config();

let podcastSummaries: PodcastSummary[] = [
  { id: "1", title: "Introduction to Physics", textContent: "Basic physics concepts"},
  { id: "2", title: "Advanced Mathematics", textContent: "Complex mathematical theorems"},
  { id: "3", title: "History Overview", textContent: "Major historical events"}
];

// GET - Retrieve all podcasts
router.get('/', (req: Request, res: Response): void => {
  res.json({ podcastSummaries });
});

// Validation middleware
// const validatePodcastSummary = (req: Request, res: Response, next: NextFunction) => {
//   try {
//     PodcastSummarySchema.parse(req.body);
//     next();
//   } catch (error) {
//     res.status(400).json({ error: "Invalid request body", details: error });
//   }
// };

// POST - Create a new podcast
router.post('/', async (req: Request, res: Response): Promise<void> => {
  console.log("Received POST request to /generate-podcast-script");
  const { title, textContent } = req.body;
  
  if (!textContent || typeof textContent !== 'string') {
    res.status(400).json({ error: "Missing or invalid 'textContent' field in JSON request body." });
    return;
  }

  if (textContent.length > 50000) {
    console.log("Payload Too Large: Input text exceeds limit.");
    res.status(413).json({ error: "Input text too long." });
    return;
  }

  console.log("Input Text:", textContent);
  // --- Prompt Engineering ---
  const prompt = `
  You are a podcast script writer. Your task is to generate an engaging podcast script
  (approximately 2-4 minutes speaking time) based on the following text.

  The script should include:
  - A clear introduction by a host (or hosts).
  - The main content derived from the input text, presented in a conversational style.
  - Optional: Suggestions for sound effects or music cues (e.g., "[Intro Music Fades In]").
  - A concluding remark or sign-off.

  Input Text:
  ---
  ${textContent}
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
      console.log(`Sending request to Gemini API (text length: ${textContent.length})...`);
      const result = await model.generateContent(prompt);
      const response = result.response;
      const podcastScript = response.text();
      console.log("Successfully received response from Gemini API.");

      // add to podcastSummaries
      podcastSummaries.push({ id: (podcastSummaries.length + 1).toString(), title: title, textContent: podcastScript });

      // --- Return Result ---
      res.status(200).json({ podcast_script: podcastScript });
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
router.delete('/:id', (req: Request, res: Response): void => {
  const id = parseInt(req.params.id);
  const initialLength = podcastSummaries.length;
  
  podcastSummaries = podcastSummaries.filter(podcastSummary => podcastSummary.id !== id.toString());
  
  if (podcastSummaries.length === initialLength) {
    res.status(404).json({ error: "Podcast not found" });
    return;
  }
  
  res.json({ message: "Podcast deleted", podcastSummaries });
});

export default router;