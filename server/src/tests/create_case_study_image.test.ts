
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { caseStudyImagesTable, caseStudiesTable } from '../db/schema';
import { type CreateCaseStudyImageInput } from '../schema';
import { createCaseStudyImage } from '../handlers/create_case_study_image';
import { eq } from 'drizzle-orm';

describe('createCaseStudyImage', () => {
  let caseStudyId: number;

  beforeEach(async () => {
    await createDB();
    
    // Create a case study first since images require a valid case_study_id
    const caseStudyResult = await db.insert(caseStudiesTable)
      .values({
        title_en: 'Test Case Study',
        title_fr: 'Étude de Cas Test',
        description_en: 'Test description',
        description_fr: 'Description de test',
        client_name_en: 'Test Client',
        client_name_fr: 'Client Test',
        challenge_description_en: 'Test challenge',
        challenge_description_fr: 'Défi test',
        solution_description_en: 'Test solution',
        solution_description_fr: 'Solution test',
        results_description_en: 'Test results',
        results_description_fr: 'Résultats test'
      })
      .returning()
      .execute();

    caseStudyId = caseStudyResult[0].id;
  });

  afterEach(resetDB);

  it('should create a case study image', async () => {
    const testInput: CreateCaseStudyImageInput = {
      case_study_id: caseStudyId,
      image_url: 'https://example.com/image.jpg',
      alt_text_en: 'Test image',
      alt_text_fr: 'Image test',
      display_order: 1
    };

    const result = await createCaseStudyImage(testInput);

    // Basic field validation
    expect(result.case_study_id).toEqual(caseStudyId);
    expect(result.image_url).toEqual('https://example.com/image.jpg');
    expect(result.alt_text_en).toEqual('Test image');
    expect(result.alt_text_fr).toEqual('Image test');
    expect(result.display_order).toEqual(1);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save case study image to database', async () => {
    const testInput: CreateCaseStudyImageInput = {
      case_study_id: caseStudyId,
      image_url: 'https://example.com/image.jpg',
      alt_text_en: 'Test image',
      alt_text_fr: 'Image test',
      display_order: 1
    };

    const result = await createCaseStudyImage(testInput);

    // Query database to verify image was saved
    const images = await db.select()
      .from(caseStudyImagesTable)
      .where(eq(caseStudyImagesTable.id, result.id))
      .execute();

    expect(images).toHaveLength(1);
    expect(images[0].case_study_id).toEqual(caseStudyId);
    expect(images[0].image_url).toEqual('https://example.com/image.jpg');
    expect(images[0].alt_text_en).toEqual('Test image');
    expect(images[0].alt_text_fr).toEqual('Image test');
    expect(images[0].display_order).toEqual(1);
    expect(images[0].created_at).toBeInstanceOf(Date);
  });

  it('should use default display_order from schema', async () => {
    const testInput: CreateCaseStudyImageInput = {
      case_study_id: caseStudyId,
      image_url: 'https://example.com/image.jpg',
      alt_text_en: 'Test image',
      alt_text_fr: 'Image test',
      display_order: 0 // This is the default from Zod schema
    };

    const result = await createCaseStudyImage(testInput);

    expect(result.display_order).toEqual(0);
  });

  it('should handle null alt text values', async () => {
    const testInput: CreateCaseStudyImageInput = {
      case_study_id: caseStudyId,
      image_url: 'https://example.com/image.jpg',
      alt_text_en: null,
      alt_text_fr: null,
      display_order: 0
    };

    const result = await createCaseStudyImage(testInput);

    expect(result.alt_text_en).toBeNull();
    expect(result.alt_text_fr).toBeNull();
    expect(result.case_study_id).toEqual(caseStudyId);
    expect(result.image_url).toEqual('https://example.com/image.jpg');
  });

  it('should throw error for non-existent case study', async () => {
    const testInput: CreateCaseStudyImageInput = {
      case_study_id: 99999, // Non-existent case study ID
      image_url: 'https://example.com/image.jpg',
      alt_text_en: 'Test image',
      alt_text_fr: 'Image test',
      display_order: 0
    };

    await expect(createCaseStudyImage(testInput)).rejects.toThrow(/violates foreign key constraint/i);
  });
});
