
import { db } from '../db';
import { projectImagesTable } from '../db/schema';
import { type ProjectImage } from '../schema';
import { eq, asc } from 'drizzle-orm';

export const getProjectImages = async (projectId: number): Promise<ProjectImage[]> => {
  try {
    const results = await db.select()
      .from(projectImagesTable)
      .where(eq(projectImagesTable.project_id, projectId))
      .orderBy(asc(projectImagesTable.display_order))
      .execute();

    return results;
  } catch (error) {
    console.error('Get project images failed:', error);
    throw error;
  }
};
