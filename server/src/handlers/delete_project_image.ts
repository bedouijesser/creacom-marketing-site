
import { db } from '../db';
import { projectImagesTable } from '../db/schema';
import { eq } from 'drizzle-orm';

export const deleteProjectImage = async (id: number): Promise<{ success: boolean }> => {
  try {
    // Delete the project image by ID
    const result = await db.delete(projectImagesTable)
      .where(eq(projectImagesTable.id, id))
      .returning()
      .execute();

    // Return success based on whether a row was deleted
    return { success: result.length > 0 };
  } catch (error) {
    console.error('Project image deletion failed:', error);
    throw error;
  }
};
