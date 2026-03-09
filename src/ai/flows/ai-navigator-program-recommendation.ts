'use server';
/**
 * @fileOverview An AI-powered tool that acts as a sophisticated recommender,
 * guiding prospective students to relevant academic programs, resources, and career pathways
 * based on their input for Eseria Citadel.
 *
 * - aiNavigatorProgramRecommendation - A function that handles the program recommendation process.
 * - AINavigatorProgramRecommendationInput - The input type for the aiNavigatorProgramRecommendation function.
 * - AINavigatorProgramRecommendationOutput - The return type for the aiNavigatorProgramRecommendation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AINavigatorProgramRecommendationInputSchema = z.object({
  academicInterests: z
    .string()
    .describe('The prospective student\u2019s academic interests.'),
  careerAspirations: z
    .string()
    .describe('The prospective student\u2019s career aspirations.'),
});
export type AINavigatorProgramRecommendationInput = z.infer<
  typeof AINavigatorProgramRecommendationInputSchema
>;

const AINavigatorProgramRecommendationOutputSchema = z.object({
  recommendedPrograms: z
    .array(z.string())
    .describe('A list of recommended academic programs from Eseria Citadel.'),
  careerPathways: z
    .array(z.string())
    .describe('A list of potential career pathways aligned with the recommendations.'),
  explanation: z
    .string()
    .describe(
      'A brief explanation of why these programs and pathways were recommended.'
    ),
});
export type AINavigatorProgramRecommendationOutput = z.infer<
  typeof AINavigatorProgramRecommendationOutputSchema
>;

export async function aiNavigatorProgramRecommendation(
  input: AINavigatorProgramRecommendationInput
): Promise<AINavigatorProgramRecommendationOutput> {
  return aiNavigatorProgramRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiNavigatorProgramRecommendationPrompt',
  input: { schema: AINavigatorProgramRecommendationInputSchema },
  output: { schema: AINavigatorProgramRecommendationOutputSchema },
  prompt: `You are the AI Navigator Tool for Eseria Citadel, an elite institution focused on Financial Engineering, Data Science, and AI Orchestration.
Your task is to recommend relevant academic programs and career pathways to prospective students based on their academic interests and career aspirations. Provide a concise explanation for your recommendations.

Eseria Citadel's programs are interdisciplinary and blend Financial Engineering, Data Science, and AI Orchestration.

Academic Interests: {{{academicInterests}}}
Career Aspirations: {{{careerAspirations}}}`,
});

const aiNavigatorProgramRecommendationFlow = ai.defineFlow(
  {
    name: 'aiNavigatorProgramRecommendationFlow',
    inputSchema: AINavigatorProgramRecommendationInputSchema,
    outputSchema: AINavigatorProgramRecommendationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
