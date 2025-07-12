
import { db } from '../db';
import { caseStudiesTable } from '../db/schema';
import { type UpdateCaseStudyInput, type CaseStudy } from '../schema';
import { eq } from 'drizzle-orm';

export const updateCaseStudy = async (input: UpdateCaseStudyInput): Promise<CaseStudy> => {
  try {
    // First check if the case study exists
    const existingCaseStudy = await db.select()
      .from(caseStudiesTable)
      .where(eq(caseStudiesTable.id, input.id))
      .execute();

    if (existingCaseStudy.length === 0) {
      throw new Error(`Case study with id ${input.id} not found`);
    }

    // Build update object with only provided fields
    const updateData: Record<string, any> = {
      updated_at: new Date()
    };

    if (input.title_en !== undefined) updateData['title_en'] = input.title_en;
    if (input.title_fr !== undefined) updateData['title_fr'] = input.title_fr;
    if (input.description_en !== undefined) updateData['description_en'] = input.description_en;
    if (input.description_fr !== undefined) updateData['description_fr'] = input.description_fr;
    if (input.client_name_en !== undefined) updateData['client_name_en'] = input.client_name_en;
    if (input.client_name_fr !== undefined) updateData['client_name_fr'] = input.client_name_fr;
    if (input.challenge_description_en !== undefined) updateData['challenge_description_en'] = input.challenge_description_en;
    if (input.challenge_description_fr !== undefined) updateData['challenge_description_fr'] = input.challenge_description_fr;
    if (input.solution_description_en !== undefined) updateData['solution_description_en'] = input.solution_description_en;
    if (input.solution_description_fr !== undefined) updateData['solution_description_fr'] = input.solution_description_fr;
    if (input.results_description_en !== undefined) updateData['results_description_en'] = input.results_description_en;
    if (input.results_description_fr !== undefined) updateData['results_description_fr'] = input.results_description_fr;

    // Update the case study
    const result = await db.update(caseStudiesTable)
      .set(updateData)
      .where(eq(caseStudiesTable.id, input.id))
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Case study update failed:', error);
    throw error;
  }
};
