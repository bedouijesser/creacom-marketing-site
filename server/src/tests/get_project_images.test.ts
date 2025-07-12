
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { projectsTable, projectImagesTable } from '../db/schema';
import { type CreateProjectInput, type CreateProjectImageInput } from '../schema';
import { getProjectImages } from '../handlers/get_project_images';

const testProject: CreateProjectInput = {
  title_en: 'Test Project',
  title_fr: 'Projet Test',
  description_en: 'A test project',
  description_fr: 'Un projet de test',
  category: 'graphic_design'
};

const createTestProject = async () => {
  const result = await db.insert(projectsTable)
    .values(testProject)
    .returning()
    .execute();
  return result[0];
};

const createTestProjectImage = async (projectId: number, imageData: Partial<CreateProjectImageInput> = {}) => {
  const defaultImageData: CreateProjectImageInput = {
    project_id: projectId,
    image_url: 'https://example.com/image.jpg',
    alt_text_en: 'Test image',
    alt_text_fr: 'Image de test',
    display_order: 0
  };

  const result = await db.insert(projectImagesTable)
    .values({ ...defaultImageData, ...imageData })
    .returning()
    .execute();
  return result[0];
};

describe('getProjectImages', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when project has no images', async () => {
    const project = await createTestProject();
    const result = await getProjectImages(project.id);

    expect(result).toHaveLength(0);
  });

  it('should return project images ordered by display_order', async () => {
    const project = await createTestProject();
    
    // Create images with different display orders
    await createTestProjectImage(project.id, {
      image_url: 'https://example.com/image3.jpg',
      alt_text_en: 'Third image',
      display_order: 2
    });
    
    await createTestProjectImage(project.id, {
      image_url: 'https://example.com/image1.jpg',
      alt_text_en: 'First image', 
      display_order: 0
    });
    
    await createTestProjectImage(project.id, {
      image_url: 'https://example.com/image2.jpg',
      alt_text_en: 'Second image',
      display_order: 1
    });

    const result = await getProjectImages(project.id);

    expect(result).toHaveLength(3);
    expect(result[0].display_order).toBe(0);
    expect(result[0].alt_text_en).toBe('First image');
    expect(result[1].display_order).toBe(1);
    expect(result[1].alt_text_en).toBe('Second image');
    expect(result[2].display_order).toBe(2);
    expect(result[2].alt_text_en).toBe('Third image');
  });

  it('should return only images for the specified project', async () => {
    const project1 = await createTestProject();
    const project2 = await createTestProject();
    
    // Create images for both projects
    await createTestProjectImage(project1.id, {
      image_url: 'https://example.com/project1_image.jpg',
      alt_text_en: 'Project 1 image'
    });
    
    await createTestProjectImage(project2.id, {
      image_url: 'https://example.com/project2_image.jpg',
      alt_text_en: 'Project 2 image'
    });

    const result = await getProjectImages(project1.id);

    expect(result).toHaveLength(1);
    expect(result[0].project_id).toBe(project1.id);
    expect(result[0].alt_text_en).toBe('Project 1 image');
  });

  it('should return project images with all required fields', async () => {
    const project = await createTestProject();
    await createTestProjectImage(project.id, {
      image_url: 'https://example.com/test.jpg',
      alt_text_en: 'English alt text',
      alt_text_fr: 'Texte alternatif français',
      display_order: 5
    });

    const result = await getProjectImages(project.id);

    expect(result).toHaveLength(1);
    const image = result[0];
    expect(image.id).toBeDefined();
    expect(image.project_id).toBe(project.id);
    expect(image.image_url).toBe('https://example.com/test.jpg');
    expect(image.alt_text_en).toBe('English alt text');
    expect(image.alt_text_fr).toBe('Texte alternatif français');
    expect(image.display_order).toBe(5);
    expect(image.created_at).toBeInstanceOf(Date);
  });

  it('should handle null alt text fields', async () => {
    const project = await createTestProject();
    await createTestProjectImage(project.id, {
      image_url: 'https://example.com/test.jpg',
      alt_text_en: null,
      alt_text_fr: null,
      display_order: 0
    });

    const result = await getProjectImages(project.id);

    expect(result).toHaveLength(1);
    expect(result[0].alt_text_en).toBeNull();
    expect(result[0].alt_text_fr).toBeNull();
  });
});
