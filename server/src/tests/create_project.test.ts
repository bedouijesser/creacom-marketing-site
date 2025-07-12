
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { projectsTable } from '../db/schema';
import { type CreateProjectInput } from '../schema';
import { createProject } from '../handlers/create_project';
import { eq } from 'drizzle-orm';

const testInput: CreateProjectInput = {
  title_en: 'Test Project',
  title_fr: 'Projet de Test',
  description_en: 'A project for testing purposes',
  description_fr: 'Un projet à des fins de test',
  category: 'graphic_design'
};

describe('createProject', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a project with multilingual content', async () => {
    const result = await createProject(testInput);

    // Verify all fields are populated correctly
    expect(result.title_en).toEqual('Test Project');
    expect(result.title_fr).toEqual('Projet de Test');
    expect(result.description_en).toEqual('A project for testing purposes');
    expect(result.description_fr).toEqual('Un projet à des fins de test');
    expect(result.category).toEqual('graphic_design');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save project to database', async () => {
    const result = await createProject(testInput);

    // Query database to verify project was saved
    const projects = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.id, result.id))
      .execute();

    expect(projects).toHaveLength(1);
    expect(projects[0].title_en).toEqual('Test Project');
    expect(projects[0].title_fr).toEqual('Projet de Test');
    expect(projects[0].description_en).toEqual('A project for testing purposes');
    expect(projects[0].description_fr).toEqual('Un projet à des fins de test');
    expect(projects[0].category).toEqual('graphic_design');
    expect(projects[0].created_at).toBeInstanceOf(Date);
    expect(projects[0].updated_at).toBeInstanceOf(Date);
  });

  it('should handle different project categories', async () => {
    const digitalPrintingProject: CreateProjectInput = {
      title_en: 'Digital Printing Project',
      title_fr: 'Projet d\'Impression Numérique',
      description_en: 'Digital printing test project',
      description_fr: 'Projet de test d\'impression numérique',
      category: 'digital_printing'
    };

    const result = await createProject(digitalPrintingProject);

    expect(result.category).toEqual('digital_printing');
    expect(result.title_en).toEqual('Digital Printing Project');
    expect(result.title_fr).toEqual('Projet d\'Impression Numérique');
  });

  it('should create projects with packaging category', async () => {
    const packagingProject: CreateProjectInput = {
      title_en: 'Packaging Design',
      title_fr: 'Conception d\'Emballage',
      description_en: 'Creative packaging solutions',
      description_fr: 'Solutions d\'emballage créatives',
      category: 'packaging'
    };

    const result = await createProject(packagingProject);

    expect(result.category).toEqual('packaging');
    
    // Verify it's saved correctly in database
    const projects = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.id, result.id))
      .execute();

    expect(projects[0].category).toEqual('packaging');
  });
});
