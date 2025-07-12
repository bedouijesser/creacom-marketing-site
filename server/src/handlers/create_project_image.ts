
import { db } from '../db';
import { projectImagesTable, projectsTable } from '../db/schema';
import { type CreateProjectImageInput, type ProjectImage } from '../schema';
import { eq } from 'drizzle-orm';

export const createProjectImage = async (input: CreateProjectImageInput): Promise<ProjectImage> => {
  try {
    // Verify the project exists to prevent foreign key constraint violations
    const project = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.id, input.project_id))
      .limit(1)
      .execute();

    if (project.length === 0) {
      throw new Error(`Project with id ${input.project_id} does not exist`);
    }

    // Insert project image record
    const result = await db.insert(projectImagesTable)
      .values({
        project_id: input.project_id,
        image_url: input.image_url,
        alt_text_en: input.alt_text_en,
        alt_text_fr: input.alt_text_fr,
        display_order: input.display_order
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Project image creation failed:', error);
    throw error;
  }
};
