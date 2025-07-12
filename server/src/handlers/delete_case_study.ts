
import { db } from '../db';
import { caseStudiesTable } from '../db/schema';
import { eq } from 'drizzle-orm';

export const deleteCaseStudy = async (id: number): Promise<{ success: boolean }> => {
  try {
    // Delete case study record (images will be cascade deleted due to foreign key constraint)
    const result = await db.delete(caseStudiesTable)
      .where(eq(caseStudiesTable.id, id))
      .returning()
      .execute();

    // Return success based on whether a record was actually deleted
    return { success: result.length > 0 };
  } catch (error) {
    console.error('Case study deletion failed:', error);
    throw error;
  }
};
