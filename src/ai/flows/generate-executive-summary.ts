'use server';

/**
 * @fileOverview A flow to generate an executive summary of attendance trends.
 *
 * - generateExecutiveSummary - A function that generates the executive summary.
 * - GenerateExecutiveSummaryInput - The input type for the generateExecutiveSummary function.
 * - GenerateExecutiveSummaryOutput - The return type for the generateExecutiveSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateExecutiveSummaryInputSchema = z.object({
  faculty: z.string().describe('The faculty to generate the executive summary for.'),
  department: z.string().describe('The department to generate the executive summary for.'),
  promotion: z.string().describe('The promotion to generate the executive summary for.'),
  startDate: z.string().describe('The start date for the executive summary.'),
  endDate: z.string().describe('The end date for the executive summary.'),
});
export type GenerateExecutiveSummaryInput = z.infer<typeof GenerateExecutiveSummaryInputSchema>;

const GenerateExecutiveSummaryOutputSchema = z.object({
  summary: z.string().describe('The executive summary of attendance trends.'),
});
export type GenerateExecutiveSummaryOutput = z.infer<typeof GenerateExecutiveSummaryOutputSchema>;

export async function generateExecutiveSummary(input: GenerateExecutiveSummaryInput): Promise<GenerateExecutiveSummaryOutput> {
  return generateExecutiveSummaryFlow(input);
}

const generateExecutiveSummaryPrompt = ai.definePrompt({
  name: 'generateExecutiveSummaryPrompt',
  input: {schema: GenerateExecutiveSummaryInputSchema},
  output: {schema: GenerateExecutiveSummaryOutputSchema},
  prompt: `You are an expert in analyzing attendance data and generating executive summaries.

  Generate an executive summary of attendance trends for the following parameters:

  Faculty: {{{faculty}}}
  Department: {{{department}}}
  Promotion: {{{promotion}}}
  Start Date: {{{startDate}}}
  End Date: {{{endDate}}}

  Highlight key insights such as the most common reasons for absence or correlations between attendance and student performance.
  The summary should be concise and easy to understand, providing an overview of the overall attendance situation and identifying areas for improvement.`,
});

const generateExecutiveSummaryFlow = ai.defineFlow(
  {
    name: 'generateExecutiveSummaryFlow',
    inputSchema: GenerateExecutiveSummaryInputSchema,
    outputSchema: GenerateExecutiveSummaryOutputSchema,
  },
  async input => {
    const {output} = await generateExecutiveSummaryPrompt(input);
    return output!;
  }
);
