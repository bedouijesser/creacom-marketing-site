
import { db } from '../db';
import { caseStudiesTable } from '../db/schema';
import { type CreateCaseStudyInput, type CaseStudy } from '../schema';

export const createCaseStudy = async (input: CreateCaseStudyInput): Promise<CaseStudy> => {
  try {
    // Insert case study record
    const result = await db.insert(caseStudiesTable)
      .values({
        title_en: input.title_en,
        title_fr: input.title_fr,
        description_en: input.description_en,
        description_fr: input.description_fr,
        client_name_en: input.client_name_en,
        client_name_fr: input.client_name_fr,
        challenge_description_en: input.challenge_description_en,
        challenge_description_fr: input.challenge_description_fr,
        solution_description_en: input.solution_description_en,
        solution_description_fr: input.solution_description_fr,
        results_description_en: input.results_description_en,
        results_description_fr: input.results_description_fr
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Case study creation failed:', error);
    throw error;
  }
};
