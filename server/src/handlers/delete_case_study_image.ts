
import { db } from '../db';
import { caseStudyImagesTable } from '../db/schema';
import { eq } from 'drizzle-orm';

export const deleteCaseStudyImage = async (id: number): Promise<{ success: boolean }> => {
  try {
    // Delete the case study image by ID
    const result = await db.delete(caseStudyImagesTable)
      .where(eq(caseStudyImagesTable.id, id))
      .returning()
      .execute();

    // Return success based on whether any rows were deleted
    return { success: result.length > 0 };
  } catch (error) {
    console.error('Case study image deletion failed:', error);
    throw error;
  }
};
