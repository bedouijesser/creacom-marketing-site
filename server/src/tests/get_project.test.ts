
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { projectsTable } from '../db/schema';
import { type CreateProjectInput } from '../schema';
import { getProject } from '../handlers/get_project';

// Test project data
const testProject: CreateProjectInput = {
  title_en: 'Test Project',
  title_fr: 'Projet de Test',
  description_en: 'A test project description',
  description_fr: 'Une description de projet de test',
  category: 'graphic_design'
};

describe('getProject', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return a project when it exists', async () => {
    // Create test project
    const insertResults = await db.insert(projectsTable)
      .values(testProject)
      .returning()
      .execute();

    const createdProject = insertResults[0];

    // Get the project
    const result = await getProject(createdProject.id);

    expect(result).not.toBeNull();
    expect(result!.id).toEqual(createdProject.id);
    expect(result!.title_en).toEqual('Test Project');
    expect(result!.title_fr).toEqual('Projet de Test');
    expect(result!.description_en).toEqual('A test project description');
    expect(result!.description_fr).toEqual('Une description de projet de test');
    expect(result!.category).toEqual('graphic_design');
    expect(result!.created_at).toBeInstanceOf(Date);
    expect(result!.updated_at).toBeInstanceOf(Date);
  });

  it('should return null when project does not exist', async () => {
    const result = await getProject(999);

    expect(result).toBeNull();
  });

  it('should return correct project when multiple projects exist', async () => {
    // Create multiple projects
    const project1 = await db.insert(projectsTable)
      .values({
        title_en: 'Project 1',
        title_fr: 'Projet 1',
        description_en: 'Description 1',
        description_fr: 'Description 1',
        category: 'graphic_design'
      })
      .returning()
      .execute();

    const project2 = await db.insert(projectsTable)
      .values({
        title_en: 'Project 2',
        title_fr: 'Projet 2',
        description_en: 'Description 2',
        description_fr: 'Description 2',
        category: 'digital_printing'
      })
      .returning()
      .execute();

    // Get specific project
    const result = await getProject(project2[0].id);

    expect(result).not.toBeNull();
    expect(result!.id).toEqual(project2[0].id);
    expect(result!.title_en).toEqual('Project 2');
    expect(result!.category).toEqual('digital_printing');
  });
});
