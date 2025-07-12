
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { caseStudiesTable, caseStudyImagesTable } from '../db/schema';
import { type CreateCaseStudyInput, type CreateCaseStudyImageInput } from '../schema';
import { deleteCaseStudyImage } from '../handlers/delete_case_study_image';
import { eq } from 'drizzle-orm';

// Test data
const testCaseStudy: CreateCaseStudyInput = {
  title_en: 'Test Case Study',
  title_fr: 'Étude de cas test',
  description_en: 'A test case study description',
  description_fr: 'Une description d\'étude de cas test',
  client_name_en: 'Test Client',
  client_name_fr: 'Client test',
  challenge_description_en: 'Test challenge',
  challenge_description_fr: 'Défi test',
  solution_description_en: 'Test solution',
  solution_description_fr: 'Solution test',
  results_description_en: 'Test results',
  results_description_fr: 'Résultats test'
};

const testCaseStudyImage: CreateCaseStudyImageInput = {
  case_study_id: 1,
  image_url: 'https://example.com/image.jpg',
  alt_text_en: 'Test image',
  alt_text_fr: 'Image test',
  display_order: 1
};

describe('deleteCaseStudyImage', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should delete a case study image', async () => {
    // Create a case study first
    const caseStudyResult = await db.insert(caseStudiesTable)
      .values(testCaseStudy)
      .returning()
      .execute();

    const caseStudyId = caseStudyResult[0].id;

    // Create a case study image
    const imageResult = await db.insert(caseStudyImagesTable)
      .values({
        ...testCaseStudyImage,
        case_study_id: caseStudyId
      })
      .returning()
      .execute();

    const imageId = imageResult[0].id;

    // Delete the case study image
    const result = await deleteCaseStudyImage(imageId);

    expect(result.success).toBe(true);
  });

  it('should remove image from database', async () => {
    // Create a case study first
    const caseStudyResult = await db.insert(caseStudiesTable)
      .values(testCaseStudy)
      .returning()
      .execute();

    const caseStudyId = caseStudyResult[0].id;

    // Create a case study image
    const imageResult = await db.insert(caseStudyImagesTable)
      .values({
        ...testCaseStudyImage,
        case_study_id: caseStudyId
      })
      .returning()
      .execute();

    const imageId = imageResult[0].id;

    // Delete the case study image
    await deleteCaseStudyImage(imageId);

    // Verify the image was deleted
    const deletedImages = await db.select()
      .from(caseStudyImagesTable)
      .where(eq(caseStudyImagesTable.id, imageId))
      .execute();

    expect(deletedImages).toHaveLength(0);
  });

  it('should return false when image does not exist', async () => {
    const nonExistentId = 999;

    const result = await deleteCaseStudyImage(nonExistentId);

    expect(result.success).toBe(false);
  });

  it('should not affect other case study images', async () => {
    // Create a case study first
    const caseStudyResult = await db.insert(caseStudiesTable)
      .values(testCaseStudy)
      .returning()
      .execute();

    const caseStudyId = caseStudyResult[0].id;

    // Create multiple case study images
    const image1Result = await db.insert(caseStudyImagesTable)
      .values({
        ...testCaseStudyImage,
        case_study_id: caseStudyId,
        image_url: 'https://example.com/image1.jpg'
      })
      .returning()
      .execute();

    const image2Result = await db.insert(caseStudyImagesTable)
      .values({
        ...testCaseStudyImage,
        case_study_id: caseStudyId,
        image_url: 'https://example.com/image2.jpg'
      })
      .returning()
      .execute();

    // Delete only the first image
    await deleteCaseStudyImage(image1Result[0].id);

    // Verify the second image still exists
    const remainingImages = await db.select()
      .from(caseStudyImagesTable)
      .where(eq(caseStudyImagesTable.id, image2Result[0].id))
      .execute();

    expect(remainingImages).toHaveLength(1);
    expect(remainingImages[0].image_url).toBe('https://example.com/image2.jpg');
  });
});
