
import { db } from '../db';
import { projectsTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { type Project } from '../schema';

export const getProject = async (id: number): Promise<Project | null> => {
  try {
    const results = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.id, id))
      .execute();

    if (results.length === 0) {
      return null;
    }

    return results[0];
  } catch (error) {
    console.error('Failed to get project:', error);
    throw error;
  }
};
