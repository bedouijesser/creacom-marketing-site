
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { caseStudiesTable, caseStudyImagesTable } from '../db/schema';
import { type CreateCaseStudyInput, type CreateCaseStudyImageInput } from '../schema';
import { getCaseStudyImages } from '../handlers/get_case_study_images';

// Test data
const testCaseStudy: CreateCaseStudyInput = {
  title_en: 'Test Case Study',
  title_fr: 'Étude de cas de test',
  description_en: 'A test case study',
  description_fr: 'Une étude de cas de test',
  client_name_en: 'Test Client',
  client_name_fr: 'Client de test',
  challenge_description_en: 'Test challenge',
  challenge_description_fr: 'Défi de test',
  solution_description_en: 'Test solution',
  solution_description_fr: 'Solution de test',
  results_description_en: 'Test results',
  results_description_fr: 'Résultats de test'
};

const testImages: Omit<CreateCaseStudyImageInput, 'case_study_id'>[] = [
  {
    image_url: 'https://example.com/image1.jpg',
    alt_text_en: 'First image',
    alt_text_fr: 'Première image',
    display_order: 2
  },
  {
    image_url: 'https://example.com/image2.jpg',
    alt_text_en: 'Second image',
    alt_text_fr: 'Deuxième image',
    display_order: 1
  },
  {
    image_url: 'https://example.com/image3.jpg',
    alt_text_en: null,
    alt_text_fr: null,
    display_order: 3
  }
];

describe('getCaseStudyImages', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when case study has no images', async () => {
    // Create case study without images
    const caseStudyResult = await db.insert(caseStudiesTable)
      .values(testCaseStudy)
      .returning()
      .execute();

    const result = await getCaseStudyImages(caseStudyResult[0].id);

    expect(result).toEqual([]);
  });

  it('should return images ordered by display_order', async () => {
    // Create case study
    const caseStudyResult = await db.insert(caseStudiesTable)
      .values(testCaseStudy)
      .returning()
      .execute();

    const caseStudyId = caseStudyResult[0].id;

    // Create images with different display orders
    await db.insert(caseStudyImagesTable)
      .values(testImages.map(image => ({
        ...image,
        case_study_id: caseStudyId
      })))
      .execute();

    const result = await getCaseStudyImages(caseStudyId);

    expect(result).toHaveLength(3);
    
    // Verify ordering by display_order
    expect(result[0].display_order).toBe(1);
    expect(result[1].display_order).toBe(2);
    expect(result[2].display_order).toBe(3);
    
    // Verify correct images are returned
    expect(result[0].image_url).toBe('https://example.com/image2.jpg');
    expect(result[1].image_url).toBe('https://example.com/image1.jpg');
    expect(result[2].image_url).toBe('https://example.com/image3.jpg');
  });

  it('should return correct image data structure', async () => {
    // Create case study
    const caseStudyResult = await db.insert(caseStudiesTable)
      .values(testCaseStudy)
      .returning()
      .execute();

    const caseStudyId = caseStudyResult[0].id;

    // Create a single image
    await db.insert(caseStudyImagesTable)
      .values({
        case_study_id: caseStudyId,
        image_url: 'https://example.com/test.jpg',
        alt_text_en: 'Test image',
        alt_text_fr: 'Image de test',
        display_order: 1
      })
      .execute();

    const result = await getCaseStudyImages(caseStudyId);

    expect(result).toHaveLength(1);
    
    const image = result[0];
    expect(image.id).toBeDefined();
    expect(image.case_study_id).toBe(caseStudyId);
    expect(image.image_url).toBe('https://example.com/test.jpg');
    expect(image.alt_text_en).toBe('Test image');
    expect(image.alt_text_fr).toBe('Image de test');
    expect(image.display_order).toBe(1);
    expect(image.created_at).toBeInstanceOf(Date);
  });

  it('should only return images for the specified case study', async () => {
    // Create two case studies
    const caseStudy1 = await db.insert(caseStudiesTable)
      .values(testCaseStudy)
      .returning()
      .execute();

    const caseStudy2 = await db.insert(caseStudiesTable)
      .values({
        ...testCaseStudy,
        title_en: 'Second Case Study'
      })
      .returning()
      .execute();

    // Create images for both case studies
    await db.insert(caseStudyImagesTable)
      .values([
        {
          case_study_id: caseStudy1[0].id,
          image_url: 'https://example.com/case1.jpg',
          alt_text_en: 'Case 1 image',
          alt_text_fr: null,
          display_order: 1
        },
        {
          case_study_id: caseStudy2[0].id,
          image_url: 'https://example.com/case2.jpg',
          alt_text_en: 'Case 2 image',
          alt_text_fr: null,
          display_order: 1
        }
      ])
      .execute();

    const result1 = await getCaseStudyImages(caseStudy1[0].id);
    const result2 = await getCaseStudyImages(caseStudy2[0].id);

    expect(result1).toHaveLength(1);
    expect(result2).toHaveLength(1);
    
    expect(result1[0].case_study_id).toBe(caseStudy1[0].id);
    expect(result1[0].image_url).toBe('https://example.com/case1.jpg');
    
    expect(result2[0].case_study_id).toBe(caseStudy2[0].id);
    expect(result2[0].image_url).toBe('https://example.com/case2.jpg');
  });

  it('should handle null alt text values', async () => {
    // Create case study
    const caseStudyResult = await db.insert(caseStudiesTable)
      .values(testCaseStudy)
      .returning()
      .execute();

    const caseStudyId = caseStudyResult[0].id;

    // Create image with null alt text
    await db.insert(caseStudyImagesTable)
      .values({
        case_study_id: caseStudyId,
        image_url: 'https://example.com/no-alt.jpg',
        alt_text_en: null,
        alt_text_fr: null,
        display_order: 1
      })
      .execute();

    const result = await getCaseStudyImages(caseStudyId);

    expect(result).toHaveLength(1);
    expect(result[0].alt_text_en).toBeNull();
    expect(result[0].alt_text_fr).toBeNull();
  });
});
