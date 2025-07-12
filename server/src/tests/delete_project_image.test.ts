
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { projectsTable, projectImagesTable } from '../db/schema';
import { type CreateProjectInput, type CreateProjectImageInput } from '../schema';
import { deleteProjectImage } from '../handlers/delete_project_image';
import { eq } from 'drizzle-orm';

// Test data
const testProject: CreateProjectInput = {
  title_en: 'Test Project',
  title_fr: 'Projet Test',
  description_en: 'A test project',
  description_fr: 'Un projet de test',
  category: 'graphic_design'
};

const testProjectImage: CreateProjectImageInput = {
  project_id: 1, // Will be updated after project creation
  image_url: 'https://example.com/test-image.jpg',
  alt_text_en: 'Test image',
  alt_text_fr: 'Image de test',
  display_order: 1
};

describe('deleteProjectImage', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should delete an existing project image', async () => {
    // Create a project first
    const projectResult = await db.insert(projectsTable)
      .values(testProject)
      .returning()
      .execute();

    const projectId = projectResult[0].id;

    // Create a project image
    const imageResult = await db.insert(projectImagesTable)
      .values({
        ...testProjectImage,
        project_id: projectId
      })
      .returning()
      .execute();

    const imageId = imageResult[0].id;

    // Delete the project image
    const result = await deleteProjectImage(imageId);

    // Verify deletion was successful
    expect(result.success).toBe(true);

    // Verify the image was actually deleted from the database
    const remainingImages = await db.select()
      .from(projectImagesTable)
      .where(eq(projectImagesTable.id, imageId))
      .execute();

    expect(remainingImages).toHaveLength(0);
  });

  it('should return false when deleting non-existent project image', async () => {
    // Try to delete a non-existent image
    const result = await deleteProjectImage(999);

    // Verify deletion was not successful
    expect(result.success).toBe(false);
  });

  it('should not affect other project images when deleting one', async () => {
    // Create a project first
    const projectResult = await db.insert(projectsTable)
      .values(testProject)
      .returning()
      .execute();

    const projectId = projectResult[0].id;

    // Create two project images
    const imageResult1 = await db.insert(projectImagesTable)
      .values({
        ...testProjectImage,
        project_id: projectId,
        display_order: 1
      })
      .returning()
      .execute();

    const imageResult2 = await db.insert(projectImagesTable)
      .values({
        ...testProjectImage,
        project_id: projectId,
        image_url: 'https://example.com/test-image-2.jpg',
        display_order: 2
      })
      .returning()
      .execute();

    const imageId1 = imageResult1[0].id;
    const imageId2 = imageResult2[0].id;

    // Delete the first image
    const result = await deleteProjectImage(imageId1);

    // Verify deletion was successful
    expect(result.success).toBe(true);

    // Verify only the first image was deleted
    const remainingImages = await db.select()
      .from(projectImagesTable)
      .where(eq(projectImagesTable.project_id, projectId))
      .execute();

    expect(remainingImages).toHaveLength(1);
    expect(remainingImages[0].id).toBe(imageId2);
  });
});
