
import { db } from '../db';
import { caseStudyImagesTable } from '../db/schema';
import { type CaseStudyImage } from '../schema';
import { eq, asc } from 'drizzle-orm';

export const getCaseStudyImages = async (caseStudyId: number): Promise<CaseStudyImage[]> => {
  try {
    const result = await db.select()
      .from(caseStudyImagesTable)
      .where(eq(caseStudyImagesTable.case_study_id, caseStudyId))
      .orderBy(asc(caseStudyImagesTable.display_order))
      .execute();

    return result;
  } catch (error) {
    console.error('Failed to fetch case study images:', error);
    throw error;
  }
};
