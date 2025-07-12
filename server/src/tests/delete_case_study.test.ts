
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { caseStudiesTable, caseStudyImagesTable } from '../db/schema';
import { type CreateCaseStudyInput, type CreateCaseStudyImageInput } from '../schema';
import { deleteCaseStudy } from '../handlers/delete_case_study';
import { eq } from 'drizzle-orm';

// Test data
const testCaseStudy: CreateCaseStudyInput = {
  title_en: 'Test Case Study',
  title_fr: 'Étude de cas de test',
  description_en: 'A test case study description',
  description_fr: 'Une description d\'étude de cas de test',
  client_name_en: 'Test Client',
  client_name_fr: 'Client de test',
  challenge_description_en: 'Test challenge description',
  challenge_description_fr: 'Description du défi de test',
  solution_description_en: 'Test solution description',
  solution_description_fr: 'Description de la solution de test',
  results_description_en: 'Test results description',
  results_description_fr: 'Description des résultats de test'
};

describe('deleteCaseStudy', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should delete a case study', async () => {
    // Create test case study
    const created = await db.insert(caseStudiesTable)
      .values(testCaseStudy)
      .returning()
      .execute();

    const caseStudyId = created[0].id;

    // Delete the case study
    const result = await deleteCaseStudy(caseStudyId);

    expect(result.success).toBe(true);

    // Verify case study was deleted
    const caseStudies = await db.select()
      .from(caseStudiesTable)
      .where(eq(caseStudiesTable.id, caseStudyId))
      .execute();

    expect(caseStudies).toHaveLength(0);
  });

  it('should return false when case study does not exist', async () => {
    const result = await deleteCaseStudy(999);

    expect(result.success).toBe(false);
  });

  it('should cascade delete associated images', async () => {
    // Create test case study
    const created = await db.insert(caseStudiesTable)
      .values(testCaseStudy)
      .returning()
      .execute();

    const caseStudyId = created[0].id;

    // Create associated images
    const imageInput: CreateCaseStudyImageInput = {
      case_study_id: caseStudyId,
      image_url: 'https://example.com/image.jpg',
      alt_text_en: 'Test image',
      alt_text_fr: 'Image de test',
      display_order: 1
    };

    await db.insert(caseStudyImagesTable)
      .values(imageInput)
      .execute();

    // Verify image exists
    const imagesBefore = await db.select()
      .from(caseStudyImagesTable)
      .where(eq(caseStudyImagesTable.case_study_id, caseStudyId))
      .execute();

    expect(imagesBefore).toHaveLength(1);

    // Delete the case study
    const result = await deleteCaseStudy(caseStudyId);

    expect(result.success).toBe(true);

    // Verify associated images were cascade deleted
    const imagesAfter = await db.select()
      .from(caseStudyImagesTable)
      .where(eq(caseStudyImagesTable.case_study_id, caseStudyId))
      .execute();

    expect(imagesAfter).toHaveLength(0);
  });

  it('should delete multiple associated images', async () => {
    // Create test case study
    const created = await db.insert(caseStudiesTable)
      .values(testCaseStudy)
      .returning()
      .execute();

    const caseStudyId = created[0].id;

    // Create multiple associated images
    const imageInputs: CreateCaseStudyImageInput[] = [
      {
        case_study_id: caseStudyId,
        image_url: 'https://example.com/image1.jpg',
        alt_text_en: 'First image',
        alt_text_fr: 'Première image',
        display_order: 1
      },
      {
        case_study_id: caseStudyId,
        image_url: 'https://example.com/image2.jpg',
        alt_text_en: 'Second image',
        alt_text_fr: 'Deuxième image',
        display_order: 2
      }
    ];

    await db.insert(caseStudyImagesTable)
      .values(imageInputs)
      .execute();

    // Verify images exist
    const imagesBefore = await db.select()
      .from(caseStudyImagesTable)
      .where(eq(caseStudyImagesTable.case_study_id, caseStudyId))
      .execute();

    expect(imagesBefore).toHaveLength(2);

    // Delete the case study
    const result = await deleteCaseStudy(caseStudyId);

    expect(result.success).toBe(true);

    // Verify all associated images were cascade deleted
    const imagesAfter = await db.select()
      .from(caseStudyImagesTable)
      .where(eq(caseStudyImagesTable.case_study_id, caseStudyId))
      .execute();

    expect(imagesAfter).toHaveLength(0);
  });
});
