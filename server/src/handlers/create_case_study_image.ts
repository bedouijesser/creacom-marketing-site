
import { db } from '../db';
import { caseStudyImagesTable } from '../db/schema';
import { type CreateCaseStudyImageInput, type CaseStudyImage } from '../schema';

export const createCaseStudyImage = async (input: CreateCaseStudyImageInput): Promise<CaseStudyImage> => {
  try {
    // Insert case study image record
    const result = await db.insert(caseStudyImagesTable)
      .values({
        case_study_id: input.case_study_id,
        image_url: input.image_url,
        alt_text_en: input.alt_text_en,
        alt_text_fr: input.alt_text_fr,
        display_order: input.display_order
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Case study image creation failed:', error);
    throw error;
  }
};
