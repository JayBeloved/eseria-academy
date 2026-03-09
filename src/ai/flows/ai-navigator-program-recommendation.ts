'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AINavigatorProgramRecommendationInputSchema = z.object({
  academicInterests: z
    .string()
    .describe('The prospective student’s current industry, background, or academic interests.'),
  careerAspirations: z
    .string()
    .describe('The prospective student’s strategic goal, desired career pivot, or revenue target.'),
});
export type AINavigatorProgramRecommendationInput = z.infer<
  typeof AINavigatorProgramRecommendationInputSchema
>;

const AINavigatorProgramRecommendationOutputSchema = z.object({
  recommendedPrograms: z
    .array(z.string())
    .describe('A list of 2-3 specific, actionable technical modules or project focuses (e.g., "SQL for Business Value", "Python Automation Capstone").'),
  careerPathways: z
    .array(z.string())
    .describe('A list of 2-3 specific, high-value job titles or consulting positions.'),
  explanation: z
    .string()
    .describe(
      'A concise, hard-hitting explanation written in the voice of the Academy Dean. Explain how their current background is an "Unfair Advantage" when combined with data skills.'
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
  prompt: `You are the "Admissions Oracle" for Eseria Academy, an elite Data Analytics & AI Institute. 
Your goal is to evaluate a candidate's background and aspirations and prescribe a bespoke 16-week pathway.

CORE PHILOSOPHY (The 10xB Standard):
1. We do not mass-produce "reporting vending machines." We train strategic partners.
2. The user's past experience (even if non-technical) is their "Domain Advantage." We use tech to amplify it.
3. We focus on tools that drive ROI: SQL, Python, PowerBI, and AI Agents.
4. Tone: Professional, authoritative, direct, and focused on economic outcomes. Do not use corporate fluff.

Task: Based on the inputs, recommend specific curriculum focus areas, project the exact high-ticket job titles they should aim for, and provide a "Strategic Context" explaining WHY this path makes them non-substitutable in the market.

Candidate Background: {{{academicInterests}}}
Candidate Goal: {{{careerAspirations}}}`,
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