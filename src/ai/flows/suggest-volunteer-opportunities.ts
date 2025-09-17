'use server';

/**
 * @fileOverview Suggests suitable volunteer opportunities for individuals based on their interests extracted from their messages.
 *
 * - suggestVolunteerOpportunities - A function that suggests volunteer opportunities based on contact's message.
 * - SuggestVolunteerOpportunitiesInput - The input type for the suggestVolunteerOpportunities function.
 * - SuggestVolunteerOpportunitiesOutput - The return type for the suggestVolunteerOpportunities function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestVolunteerOpportunitiesInputSchema = z.object({
  contactMessage: z
    .string()
    .describe('The message from the contact expressing their interests.'),
});
export type SuggestVolunteerOpportunitiesInput = z.infer<
  typeof SuggestVolunteerOpportunitiesInputSchema
>;

const SuggestVolunteerOpportunitiesOutputSchema = z.object({
  suggestedOpportunities: z
    .array(z.string())
    .describe(
      'A list of suggested volunteer opportunities based on the contact message.'
    ),
});
export type SuggestVolunteerOpportunitiesOutput = z.infer<
  typeof SuggestVolunteerOpportunitiesOutputSchema
>;

export async function suggestVolunteerOpportunities(
  input: SuggestVolunteerOpportunitiesInput
): Promise<SuggestVolunteerOpportunitiesOutput> {
  return suggestVolunteerOpportunitiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestVolunteerOpportunitiesPrompt',
  input: {schema: SuggestVolunteerOpportunitiesInputSchema},
  output: {schema: SuggestVolunteerOpportunitiesOutputSchema},
  prompt: `You are an AI assistant helping administrators find suitable volunteer opportunities for people who have contacted the organization.

  Based on the following message from the contact, suggest a few volunteer opportunities that might be a good fit for them. Return a numbered list of opportunities.

  Contact Message: {{{contactMessage}}}

  Suggested Volunteer Opportunities:
  `,
});

const suggestVolunteerOpportunitiesFlow = ai.defineFlow(
  {
    name: 'suggestVolunteerOpportunitiesFlow',
    inputSchema: SuggestVolunteerOpportunitiesInputSchema,
    outputSchema: SuggestVolunteerOpportunitiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
