'use server';

/**
 * @fileOverview A flow for detecting anomalies in attendance data.
 *
 * - detectAttendanceAnomalies - A function that analyzes attendance data for anomalies.
 * - DetectAttendanceAnomaliesInput - The input type for the detectAttendanceAnomalies function.
 * - DetectAttendanceAnomaliesOutput - The return type for the detectAttendanceAnomalies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectAttendanceAnomaliesInputSchema = z.object({
  attendanceData: z
    .string()
    .describe(
      'Attendance data in JSON format.  Must contain studentId, classId, and attendanceDate fields.  Dates must be ISO8601 format.'
    ),
});
export type DetectAttendanceAnomaliesInput = z.infer<
  typeof DetectAttendanceAnomaliesInputSchema
>;

const DetectAttendanceAnomaliesOutputSchema = z.object({
  anomalies: z
    .string()
    .describe(
      'A description of the anomalies detected in the attendance data.'
    ),
});
export type DetectAttendanceAnomaliesOutput = z.infer<
  typeof DetectAttendanceAnomaliesOutputSchema
>;

export async function detectAttendanceAnomalies(
  input: DetectAttendanceAnomaliesInput
): Promise<DetectAttendanceAnomaliesOutput> {
  return detectAttendanceAnomaliesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectAttendanceAnomaliesPrompt',
  input: {schema: DetectAttendanceAnomaliesInputSchema},
  output: {schema: DetectAttendanceAnomaliesOutputSchema},
  prompt: `You are an expert in analyzing attendance data to identify anomalies.

You are provided with attendance data in JSON format. Your task is to identify any unusual patterns or anomalies, such as sudden drops in attendance for a specific class, unusual absence patterns for students, or any other statistically significant deviations from the norm.

Return a description of the anomalies detected in the attendance data.

Attendance Data: {{{attendanceData}}}`,
});

const detectAttendanceAnomaliesFlow = ai.defineFlow(
  {
    name: 'detectAttendanceAnomaliesFlow',
    inputSchema: DetectAttendanceAnomaliesInputSchema,
    outputSchema: DetectAttendanceAnomaliesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
