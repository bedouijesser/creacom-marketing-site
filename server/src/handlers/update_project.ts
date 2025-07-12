
import { db } from '../db';
import { projectsTable } from '../db/schema';
import { type UpdateProjectInput, type Project } from '../schema';
import { eq } from 'drizzle-orm';

export const updateProject = async (input: UpdateProjectInput): Promise<Project> => {
  try {
    // Build update object with only provided fields
    const updateData: Partial<{
      title_en: string;
      title_fr: string;
      description_en: string;
      description_fr: string;
      category: 'graphic_design' | 'digital_printing' | 'packaging' | 'other';
      updated_at: Date;
    }> = {
      updated_at: new Date()
    };

    if (input.title_en !== undefined) {
      updateData.title_en = input.title_en;
    }
    if (input.title_fr !== undefined) {
      updateData.title_fr = input.title_fr;
    }
    if (input.description_en !== undefined) {
      updateData.description_en = input.description_en;
    }
    if (input.description_fr !== undefined) {
      updateData.description_fr = input.description_fr;
    }
    if (input.category !== undefined) {
      updateData.category = input.category;
    }

    // Update the project
    const result = await db.update(projectsTable)
      .set(updateData)
      .where(eq(projectsTable.id, input.id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new Error('Project not found');
    }

    return result[0];
  } catch (error) {
    console.error('Project update failed:', error);
    throw error;
  }
};
