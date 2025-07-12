
import { db } from '../db';
import { projectsTable } from '../db/schema';
import { eq } from 'drizzle-orm';

export const deleteProject = async (id: number): Promise<{ success: boolean }> => {
  try {
    // Delete project record - images will be cascade deleted due to foreign key constraint
    const result = await db.delete(projectsTable)
      .where(eq(projectsTable.id, id))
      .returning()
      .execute();

    // Return success status based on whether a record was deleted
    return { success: result.length > 0 };
  } catch (error) {
    console.error('Project deletion failed:', error);
    throw error;
  }
};
