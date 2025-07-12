
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { projectsTable } from '../db/schema';
import { type CreateProjectInput, type UpdateProjectInput } from '../schema';
import { updateProject } from '../handlers/update_project';
import { eq } from 'drizzle-orm';

// Create initial test project
const createTestProject = async (): Promise<number> => {
  const testProject: CreateProjectInput = {
    title_en: 'Original Title EN',
    title_fr: 'Original Title FR',
    description_en: 'Original description in English',
    description_fr: 'Original description in French',
    category: 'graphic_design'
  };

  const result = await db.insert(projectsTable)
    .values(testProject)
    .returning()
    .execute();

  return result[0].id;
};

describe('updateProject', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update all project fields', async () => {
    const projectId = await createTestProject();

    const updateInput: UpdateProjectInput = {
      id: projectId,
      title_en: 'Updated Title EN',
      title_fr: 'Updated Title FR',
      description_en: 'Updated description in English',
      description_fr: 'Updated description in French',
      category: 'digital_printing'
    };

    const result = await updateProject(updateInput);

    expect(result.id).toEqual(projectId);
    expect(result.title_en).toEqual('Updated Title EN');
    expect(result.title_fr).toEqual('Updated Title FR');
    expect(result.description_en).toEqual('Updated description in English');
    expect(result.description_fr).toEqual('Updated description in French');
    expect(result.category).toEqual('digital_printing');
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should update only specified fields', async () => {
    const projectId = await createTestProject();

    const updateInput: UpdateProjectInput = {
      id: projectId,
      title_en: 'Updated Title EN Only',
      category: 'packaging'
    };

    const result = await updateProject(updateInput);

    expect(result.id).toEqual(projectId);
    expect(result.title_en).toEqual('Updated Title EN Only');
    expect(result.title_fr).toEqual('Original Title FR'); // Should remain unchanged
    expect(result.description_en).toEqual('Original description in English'); // Should remain unchanged
    expect(result.description_fr).toEqual('Original description in French'); // Should remain unchanged
    expect(result.category).toEqual('packaging');
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should update project in database', async () => {
    const projectId = await createTestProject();

    const updateInput: UpdateProjectInput = {
      id: projectId,
      title_en: 'Database Updated Title',
      description_en: 'Database updated description'
    };

    await updateProject(updateInput);

    // Verify the update persisted in database
    const projects = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.id, projectId))
      .execute();

    expect(projects).toHaveLength(1);
    expect(projects[0].title_en).toEqual('Database Updated Title');
    expect(projects[0].description_en).toEqual('Database updated description');
    expect(projects[0].title_fr).toEqual('Original Title FR'); // Should remain unchanged
    expect(projects[0].updated_at).toBeInstanceOf(Date);
  });

  it('should throw error when project not found', async () => {
    const updateInput: UpdateProjectInput = {
      id: 999999, // Non-existent project ID
      title_en: 'This should fail'
    };

    await expect(updateProject(updateInput)).rejects.toThrow(/project not found/i);
  });

  it('should update timestamp when updating project', async () => {
    const projectId = await createTestProject();

    // Get original timestamp
    const originalProject = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.id, projectId))
      .execute();

    const originalTimestamp = originalProject[0].updated_at;

    // Wait a bit to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 10));

    const updateInput: UpdateProjectInput = {
      id: projectId,
      title_en: 'Updated for timestamp test'
    };

    const result = await updateProject(updateInput);

    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at.getTime()).toBeGreaterThan(originalTimestamp.getTime());
  });
});
