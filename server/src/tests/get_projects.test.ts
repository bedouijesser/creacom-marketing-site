
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { projectsTable } from '../db/schema';
import { type CreateProjectInput, type GetProjectsFilter } from '../schema';
import { getProjects } from '../handlers/get_projects';

// Test data
const testProjects: CreateProjectInput[] = [
  {
    title_en: 'Graphic Design Project',
    title_fr: 'Projet de Design Graphique',
    description_en: 'A creative graphic design project',
    description_fr: 'Un projet de design graphique créatif',
    category: 'graphic_design'
  },
  {
    title_en: 'Digital Printing Project',
    title_fr: 'Projet d\'Impression Numérique',
    description_en: 'A digital printing project',
    description_fr: 'Un projet d\'impression numérique',
    category: 'digital_printing'
  },
  {
    title_en: 'Packaging Project',
    title_fr: 'Projet d\'Emballage',
    description_en: 'A packaging design project',
    description_fr: 'Un projet de conception d\'emballage',
    category: 'packaging'
  }
];

describe('getProjects', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return all projects when no filter is provided', async () => {
    // Create test projects
    await db.insert(projectsTable).values(testProjects).execute();

    const results = await getProjects();

    expect(results).toHaveLength(3);
    expect(results[0].title_en).toBeDefined();
    expect(results[0].title_fr).toBeDefined();
    expect(results[0].description_en).toBeDefined();
    expect(results[0].description_fr).toBeDefined();
    expect(results[0].category).toBeDefined();
    expect(results[0].created_at).toBeInstanceOf(Date);
    expect(results[0].updated_at).toBeInstanceOf(Date);
  });

  it('should filter projects by category', async () => {
    // Create test projects
    await db.insert(projectsTable).values(testProjects).execute();

    const filter: GetProjectsFilter = {
      category: 'graphic_design'
    };

    const results = await getProjects(filter);

    expect(results).toHaveLength(1);
    expect(results[0].category).toEqual('graphic_design');
    expect(results[0].title_en).toEqual('Graphic Design Project');
    expect(results[0].title_fr).toEqual('Projet de Design Graphique');
  });

  it('should apply limit filter', async () => {
    // Create test projects
    await db.insert(projectsTable).values(testProjects).execute();

    const filter: GetProjectsFilter = {
      limit: 2
    };

    const results = await getProjects(filter);

    expect(results).toHaveLength(2);
  });

  it('should apply offset filter', async () => {
    // Create test projects
    await db.insert(projectsTable).values(testProjects).execute();

    const filter: GetProjectsFilter = {
      offset: 1,
      limit: 2
    };

    const results = await getProjects(filter);

    expect(results).toHaveLength(2);
    // Results should be different from the first 2 due to offset
    const allResults = await getProjects();
    expect(results[0].id).not.toEqual(allResults[0].id);
  });

  it('should combine category and pagination filters', async () => {
    // Create more test data for this test
    const additionalProjects: CreateProjectInput[] = [
      {
        title_en: 'Another Graphic Design',
        title_fr: 'Un Autre Design Graphique',
        description_en: 'Another graphic design project',
        description_fr: 'Un autre projet de design graphique',
        category: 'graphic_design'
      },
      {
        title_en: 'Third Graphic Design',
        title_fr: 'Troisième Design Graphique',
        description_en: 'Third graphic design project',
        description_fr: 'Troisième projet de design graphique',
        category: 'graphic_design'
      }
    ];

    await db.insert(projectsTable).values([...testProjects, ...additionalProjects]).execute();

    const filter: GetProjectsFilter = {
      category: 'graphic_design',
      limit: 2
    };

    const results = await getProjects(filter);

    expect(results).toHaveLength(2);
    results.forEach(project => {
      expect(project.category).toEqual('graphic_design');
    });
  });

  it('should return empty array when no projects match filter', async () => {
    // Create test projects
    await db.insert(projectsTable).values(testProjects).execute();

    const filter: GetProjectsFilter = {
      category: 'other'
    };

    const results = await getProjects(filter);

    expect(results).toHaveLength(0);
  });

  it('should return empty array when no projects exist', async () => {
    const results = await getProjects();

    expect(results).toHaveLength(0);
  });
});
