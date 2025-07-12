
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { projectsTable, projectImagesTable } from '../db/schema';
import { type CreateProjectInput, type CreateProjectImageInput } from '../schema';
import { deleteProject } from '../handlers/delete_project';
import { eq } from 'drizzle-orm';

// Test project input
const testProjectInput: CreateProjectInput = {
  title_en: 'Test Project',
  title_fr: 'Projet Test',
  description_en: 'A project for testing',
  description_fr: 'Un projet pour tester',
  category: 'graphic_design'
};

describe('deleteProject', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should delete an existing project', async () => {
    // Create a project first
    const createdProject = await db.insert(projectsTable)
      .values(testProjectInput)
      .returning()
      .execute();

    const projectId = createdProject[0].id;

    // Delete the project
    const result = await deleteProject(projectId);

    // Verify successful deletion
    expect(result.success).toBe(true);

    // Verify project is removed from database
    const projects = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.id, projectId))
      .execute();

    expect(projects).toHaveLength(0);
  });

  it('should return false for non-existent project', async () => {
    // Try to delete a non-existent project
    const result = await deleteProject(999);

    // Should return false since no record was deleted
    expect(result.success).toBe(false);
  });

  it('should cascade delete associated project images', async () => {
    // Create a project first
    const createdProject = await db.insert(projectsTable)
      .values(testProjectInput)
      .returning()
      .execute();

    const projectId = createdProject[0].id;

    // Create associated images
    const imageInput: CreateProjectImageInput = {
      project_id: projectId,
      image_url: 'https://example.com/image1.jpg',
      alt_text_en: 'Test image',
      alt_text_fr: 'Image test',
      display_order: 0
    };

    const createdImage = await db.insert(projectImagesTable)
      .values(imageInput)
      .returning()
      .execute();

    const imageId = createdImage[0].id;

    // Delete the project
    const result = await deleteProject(projectId);

    // Verify successful deletion
    expect(result.success).toBe(true);

    // Verify project images are also deleted (cascade)
    const images = await db.select()
      .from(projectImagesTable)
      .where(eq(projectImagesTable.id, imageId))
      .execute();

    expect(images).toHaveLength(0);
  });

  it('should handle multiple associated images', async () => {
    // Create a project first
    const createdProject = await db.insert(projectsTable)
      .values(testProjectInput)
      .returning()
      .execute();

    const projectId = createdProject[0].id;

    // Create multiple associated images
    const imageInputs = [
      {
        project_id: projectId,
        image_url: 'https://example.com/image1.jpg',
        alt_text_en: 'Test image 1',
        alt_text_fr: 'Image test 1',
        display_order: 0
      },
      {
        project_id: projectId,
        image_url: 'https://example.com/image2.jpg',
        alt_text_en: 'Test image 2',
        alt_text_fr: 'Image test 2',
        display_order: 1
      }
    ];

    await db.insert(projectImagesTable)
      .values(imageInputs)
      .execute();

    // Delete the project
    const result = await deleteProject(projectId);

    // Verify successful deletion
    expect(result.success).toBe(true);

    // Verify all project images are deleted (cascade)
    const images = await db.select()
      .from(projectImagesTable)
      .where(eq(projectImagesTable.project_id, projectId))
      .execute();

    expect(images).toHaveLength(0);
  });
});
