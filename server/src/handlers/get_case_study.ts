
import { db } from '../db';
import { caseStudiesTable } from '../db/schema';
import { type CaseStudy } from '../schema';
import { eq } from 'drizzle-orm';

export const getCaseStudy = async (id: number): Promise<CaseStudy | null> => {
  try {
    const results = await db.select()
      .from(caseStudiesTable)
      .where(eq(caseStudiesTable.id, id))
      .execute();

    if (results.length === 0) {
      return null;
    }

    return results[0];
  } catch (error) {
    console.error('Failed to get case study:', error);
    throw error;
  }
};
