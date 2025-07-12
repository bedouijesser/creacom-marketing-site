
import { db } from '../db';
import { projectsTable } from '../db/schema';
import { type GetProjectsFilter, type Project } from '../schema';
import { eq } from 'drizzle-orm';

export const getProjects = async (filter?: GetProjectsFilter): Promise<Project[]> => {
  try {
    // Build complete query chains based on filters to avoid TypeScript issues
    
    if (filter?.category) {
      // Query with category filter
      if (filter.limit !== undefined && filter.offset !== undefined) {
        return await db.select()
          .from(projectsTable)
          .where(eq(projectsTable.category, filter.category))
          .orderBy(projectsTable.created_at)
          .limit(filter.limit)
          .offset(filter.offset)
          .execute();
      } else if (filter.limit !== undefined) {
        return await db.select()
          .from(projectsTable)
          .where(eq(projectsTable.category, filter.category))
          .orderBy(projectsTable.created_at)
          .limit(filter.limit)
          .execute();
      } else if (filter.offset !== undefined) {
        return await db.select()
          .from(projectsTable)
          .where(eq(projectsTable.category, filter.category))
          .orderBy(projectsTable.created_at)
          .offset(filter.offset)
          .execute();
      } else {
        return await db.select()
          .from(projectsTable)
          .where(eq(projectsTable.category, filter.category))
          .orderBy(projectsTable.created_at)
          .execute();
      }
    } else {
      // Query without category filter
      if (filter?.limit !== undefined && filter?.offset !== undefined) {
        return await db.select()
          .from(projectsTable)
          .orderBy(projectsTable.created_at)
          .limit(filter.limit)
          .offset(filter.offset)
          .execute();
      } else if (filter?.limit !== undefined) {
        return await db.select()
          .from(projectsTable)
          .orderBy(projectsTable.created_at)
          .limit(filter.limit)
          .execute();
      } else if (filter?.offset !== undefined) {
        return await db.select()
          .from(projectsTable)
          .orderBy(projectsTable.created_at)
          .offset(filter.offset)
          .execute();
      } else {
        return await db.select()
          .from(projectsTable)
          .orderBy(projectsTable.created_at)
          .execute();
      }
    }
  } catch (error) {
    console.error('Failed to get projects:', error);
    throw error;
  }
};
