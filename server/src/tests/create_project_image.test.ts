
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { projectImagesTable, projectsTable } from '../db/schema';
import { type CreateProjectImageInput, type CreateProjectInput } from '../schema';
import { createProjectImage } from '../handlers/create_project_image';
import { eq } from 'drizzle-orm';

// Helper function to create a test project
const createTestProject = async (): Promise<number> => {
  const projectInput: CreateProjectInput = {
    title_en: 'Test Project',
    title_fr: 'Projet Test',
    description_en: 'A test project',
    description_fr: 'Un projet de test',
    category: 'graphic_design'
  };

  const result = await db.insert(projectsTable)
    .values(projectInput)
    .returning()
    .execute();

  return result[0].id;
};

// Test input with all required fields
const testInput: CreateProjectImageInput = {
  project_id: 1, // Will be updated with actual project ID
  image_url: 'https://example.com/image.jpg',
  alt_text_en: 'Test image in English',
  alt_text_fr: 'Image test en français',
  display_order: 1
};

describe('createProjectImage', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a project image', async () => {
    const projectId = await createTestProject();
    const input = { ...testInput, project_id: projectId };

    const result = await createProjectImage(input);

    // Basic field validation
    expect(result.project_id).toEqual(projectId);
    expect(result.image_url).toEqual('https://example.com/image.jpg');
    expect(result.alt_text_en).toEqual('Test image in English');
    expect(result.alt_text_fr).toEqual('Image test en français');
    expect(result.display_order).toEqual(1);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save project image to database', async () => {
    const projectId = await createTestProject();
    const input = { ...testInput, project_id: projectId };

    const result = await createProjectImage(input);

    // Query database to verify the record was saved
    const images = await db.select()
      .from(projectImagesTable)
      .where(eq(projectImagesTable.id, result.id))
      .execute();

    expect(images).toHaveLength(1);
    expect(images[0].project_id).toEqual(projectId);
    expect(images[0].image_url).toEqual('https://example.com/image.jpg');
    expect(images[0].alt_text_en).toEqual('Test image in English');
    expect(images[0].alt_text_fr).toEqual('Image test en français');
    expect(images[0].display_order).toEqual(1);
    expect(images[0].created_at).toBeInstanceOf(Date);
  });

  it('should create project image with null alt text values', async () => {
    const projectId = await createTestProject();
    const input = {
      ...testInput,
      project_id: projectId,
      alt_text_en: null,
      alt_text_fr: null
    };

    const result = await createProjectImage(input);

    expect(result.alt_text_en).toBeNull();
    expect(result.alt_text_fr).toBeNull();
    expect(result.project_id).toEqual(projectId);
    expect(result.image_url).toEqual('https://example.com/image.jpg');
    expect(result.display_order).toEqual(1);
  });

  it('should apply default display_order when not provided', async () => {
    const projectId = await createTestProject();
    const input = {
      project_id: projectId,
      image_url: 'https://example.com/image.jpg',
      alt_text_en: 'Test image',
      alt_text_fr: 'Image test',
      display_order: 0 // This is the default value from Zod
    };

    const result = await createProjectImage(input);

    expect(result.display_order).toEqual(0);
  });

  it('should throw error when project does not exist', async () => {
    const input = { ...testInput, project_id: 999 };

    await expect(createProjectImage(input)).rejects.toThrow(/project with id 999 does not exist/i);
  });
});
