
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { caseStudiesTable } from '../db/schema';
import { type UpdateCaseStudyInput, type CreateCaseStudyInput } from '../schema';
import { updateCaseStudy } from '../handlers/update_case_study';
import { eq } from 'drizzle-orm';

// Test input for creating a case study
const testCreateInput: CreateCaseStudyInput = {
  title_en: 'Original Title EN',
  title_fr: 'Original Title FR',
  description_en: 'Original Description EN',
  description_fr: 'Original Description FR',
  client_name_en: 'Original Client EN',
  client_name_fr: 'Original Client FR',
  challenge_description_en: 'Original Challenge EN',
  challenge_description_fr: 'Original Challenge FR',
  solution_description_en: 'Original Solution EN',
  solution_description_fr: 'Original Solution FR',
  results_description_en: 'Original Results EN',
  results_description_fr: 'Original Results FR'
};

// Test input for updating a case study
const testUpdateInput: UpdateCaseStudyInput = {
  id: 1,
  title_en: 'Updated Title EN',
  title_fr: 'Updated Title FR',
  description_en: 'Updated Description EN',
  client_name_en: 'Updated Client EN'
};

describe('updateCaseStudy', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update a case study with provided fields', async () => {
    // Create a case study first
    const created = await db.insert(caseStudiesTable)
      .values(testCreateInput)
      .returning()
      .execute();

    const caseStudyId = created[0].id;

    // Update with new input
    const updateInput: UpdateCaseStudyInput = {
      id: caseStudyId,
      title_en: 'Updated Title EN',
      title_fr: 'Updated Title FR',
      description_en: 'Updated Description EN',
      client_name_en: 'Updated Client EN'
    };

    const result = await updateCaseStudy(updateInput);

    // Verify updated fields
    expect(result.id).toEqual(caseStudyId);
    expect(result.title_en).toEqual('Updated Title EN');
    expect(result.title_fr).toEqual('Updated Title FR');
    expect(result.description_en).toEqual('Updated Description EN');
    expect(result.client_name_en).toEqual('Updated Client EN');

    // Verify unchanged fields remain the same
    expect(result.description_fr).toEqual('Original Description FR');
    expect(result.client_name_fr).toEqual('Original Client FR');
    expect(result.challenge_description_en).toEqual('Original Challenge EN');
    expect(result.challenge_description_fr).toEqual('Original Challenge FR');
    expect(result.solution_description_en).toEqual('Original Solution EN');
    expect(result.solution_description_fr).toEqual('Original Solution FR');
    expect(result.results_description_en).toEqual('Original Results EN');
    expect(result.results_description_fr).toEqual('Original Results FR');

    // Verify updated_at timestamp was updated
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at.getTime()).toBeGreaterThan(result.created_at.getTime());
  });

  it('should persist changes to database', async () => {
    // Create a case study first
    const created = await db.insert(caseStudiesTable)
      .values(testCreateInput)
      .returning()
      .execute();

    const caseStudyId = created[0].id;

    // Update the case study
    const updateInput: UpdateCaseStudyInput = {
      id: caseStudyId,
      title_en: 'Updated Title EN',
      client_name_fr: 'Updated Client FR'
    };

    await updateCaseStudy(updateInput);

    // Verify changes were saved to database
    const updated = await db.select()
      .from(caseStudiesTable)
      .where(eq(caseStudiesTable.id, caseStudyId))
      .execute();

    expect(updated).toHaveLength(1);
    expect(updated[0].title_en).toEqual('Updated Title EN');
    expect(updated[0].client_name_fr).toEqual('Updated Client FR');
    expect(updated[0].title_fr).toEqual('Original Title FR'); // Unchanged
    expect(updated[0].description_en).toEqual('Original Description EN'); // Unchanged
  });

  it('should update only multilingual solution and results fields', async () => {
    // Create a case study first
    const created = await db.insert(caseStudiesTable)
      .values(testCreateInput)
      .returning()
      .execute();

    const caseStudyId = created[0].id;

    // Update only solution and results fields
    const updateInput: UpdateCaseStudyInput = {
      id: caseStudyId,
      solution_description_en: 'New Solution EN',
      solution_description_fr: 'New Solution FR',
      results_description_en: 'New Results EN',
      results_description_fr: 'New Results FR'
    };

    const result = await updateCaseStudy(updateInput);

    // Verify only specified fields were updated
    expect(result.solution_description_en).toEqual('New Solution EN');
    expect(result.solution_description_fr).toEqual('New Solution FR');
    expect(result.results_description_en).toEqual('New Results EN');
    expect(result.results_description_fr).toEqual('New Results FR');

    // Verify other fields remain unchanged
    expect(result.title_en).toEqual('Original Title EN');
    expect(result.title_fr).toEqual('Original Title FR');
    expect(result.client_name_en).toEqual('Original Client EN');
    expect(result.challenge_description_en).toEqual('Original Challenge EN');
  });

  it('should throw error when case study does not exist', async () => {
    const updateInput: UpdateCaseStudyInput = {
      id: 999,
      title_en: 'Updated Title'
    };

    await expect(updateCaseStudy(updateInput)).rejects.toThrow(/not found/i);
  });

  it('should update all multilingual fields when provided', async () => {
    // Create a case study first
    const created = await db.insert(caseStudiesTable)
      .values(testCreateInput)
      .returning()
      .execute();

    const caseStudyId = created[0].id;

    // Update all fields
    const updateInput: UpdateCaseStudyInput = {
      id: caseStudyId,
      title_en: 'New Title EN',
      title_fr: 'New Title FR',
      description_en: 'New Description EN',
      description_fr: 'New Description FR',
      client_name_en: 'New Client EN',
      client_name_fr: 'New Client FR',
      challenge_description_en: 'New Challenge EN',
      challenge_description_fr: 'New Challenge FR',
      solution_description_en: 'New Solution EN',
      solution_description_fr: 'New Solution FR',
      results_description_en: 'New Results EN',
      results_description_fr: 'New Results FR'
    };

    const result = await updateCaseStudy(updateInput);

    // Verify all fields were updated
    expect(result.title_en).toEqual('New Title EN');
    expect(result.title_fr).toEqual('New Title FR');
    expect(result.description_en).toEqual('New Description EN');
    expect(result.description_fr).toEqual('New Description FR');
    expect(result.client_name_en).toEqual('New Client EN');
    expect(result.client_name_fr).toEqual('New Client FR');
    expect(result.challenge_description_en).toEqual('New Challenge EN');
    expect(result.challenge_description_fr).toEqual('New Challenge FR');
    expect(result.solution_description_en).toEqual('New Solution EN');
    expect(result.solution_description_fr).toEqual('New Solution FR');
    expect(result.results_description_en).toEqual('New Results EN');
    expect(result.results_description_fr).toEqual('New Results FR');
  });
});
