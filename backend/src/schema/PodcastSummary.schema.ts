import { z } from "zod";

export const PodcastSummarySchema = z.object({
  id:        z.string(),
  title:     z.string().min(1),
  summary: z.string().min(1),
});