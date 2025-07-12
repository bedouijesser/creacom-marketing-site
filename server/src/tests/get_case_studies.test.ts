
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { caseStudiesTable } from '../db/schema';
import { type CreateCaseStudyInput, type GetCaseStudiesFilter } from '../schema';
import { getCaseStudies } from '../handlers/get_case_studies';

// Test case study data
const testCaseStudy1: CreateCaseStudyInput = {
  title_en: 'Case Study 1',
  title_fr: 'Étude de cas 1',
  description_en: 'Description for case study 1',
  description_fr: 'Description pour étude de cas 1',
  client_name_en: 'Client One',
  client_name_fr: 'Client Un',
  challenge_description_en: 'Challenge description 1',
  challenge_description_fr: 'Description du défi 1',
  solution_description_en: 'Solution description 1',
  solution_description_fr: 'Description de la solution 1',
  results_description_en: 'Results description 1',
  results_description_fr: 'Description des résultats 1'
};

const testCaseStudy2: CreateCaseStudyInput = {
  title_en: 'Case Study 2',
  title_fr: 'Étude de cas 2',
  description_en: 'Description for case study 2',
  description_fr: 'Description pour étude de cas 2',
  client_name_en: 'Client Two',
  client_name_fr: 'Client Deux',
  challenge_description_en: 'Challenge description 2',
  challenge_description_fr: 'Description du défi 2',
  solution_description_en: 'Solution description 2',
  solution_description_fr: 'Description de la solution 2',
  results_description_en: 'Results description 2',
  results_description_fr: 'Description des résultats 2'
};

describe('getCaseStudies', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no case studies exist', async () => {
    const result = await getCaseStudies();
    expect(result).toEqual([]);
  });

  it('should return all case studies when no filter is provided', async () => {
    // Create test case studies
    await db.insert(caseStudiesTable).values([testCaseStudy1, testCaseStudy2]).execute();

    const result = await getCaseStudies();

    expect(result).toHaveLength(2);
    expect(result[0].title_en).toBeDefined();
    expect(result[0].title_fr).toBeDefined();
    expect(result[0].description_en).toBeDefined();
    expect(result[0].description_fr).toBeDefined();
    expect(result[0].client_name_en).toBeDefined();
    expect(result[0].client_name_fr).toBeDefined();
    expect(result[0].challenge_description_en).toBeDefined();
    expect(result[0].challenge_description_fr).toBeDefined();
    expect(result[0].solution_description_en).toBeDefined();
    expect(result[0].solution_description_fr).toBeDefined();
    expect(result[0].results_description_en).toBeDefined();
    expect(result[0].results_description_fr).toBeDefined();
    expect(result[0].created_at).toBeInstanceOf(Date);
    expect(result[0].updated_at).toBeInstanceOf(Date);
  });

  it('should order case studies by created_at descending (newest first)', async () => {
    // Create first case study
    await db.insert(caseStudiesTable).values(testCaseStudy1).execute();

    // Wait a bit to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    // Create second case study
    await db.insert(caseStudiesTable).values(testCaseStudy2).execute();

    const result = await getCaseStudies();

    expect(result).toHaveLength(2);
    expect(result[0].title_en).toEqual('Case Study 2'); // Newest first
    expect(result[1].title_en).toEqual('Case Study 1'); // Oldest last
    expect(result[0].created_at >= result[1].created_at).toBe(true);
  });

  it('should apply limit filter correctly', async () => {
    // Create test case studies
    await db.insert(caseStudiesTable).values([testCaseStudy1, testCaseStudy2]).execute();

    const filter: GetCaseStudiesFilter = {
      limit: 1
    };

    const result = await getCaseStudies(filter);

    expect(result).toHaveLength(1);
    expect(result[0].title_en).toBeDefined();
  });

  it('should apply offset filter correctly', async () => {
    // Create test case studies
    await db.insert(caseStudiesTable).values([testCaseStudy1, testCaseStudy2]).execute();

    const filter: GetCaseStudiesFilter = {
      offset: 1
    };

    const result = await getCaseStudies(filter);

    expect(result).toHaveLength(1);
    expect(result[0].title_en).toBeDefined();
  });

  it('should apply both limit and offset filters correctly', async () => {
    // Create multiple case studies
    const testCaseStudy3 = {
      ...testCaseStudy1,
      title_en: 'Case Study 3',
      title_fr: 'Étude de cas 3'
    };

    await db.insert(caseStudiesTable).values([testCaseStudy1, testCaseStudy2, testCaseStudy3]).execute();

    const filter: GetCaseStudiesFilter = {
      limit: 1,
      offset: 1
    };

    const result = await getCaseStudies(filter);

    expect(result).toHaveLength(1);
    expect(result[0].title_en).toBeDefined();
  });

  it('should handle empty filter object', async () => {
    // Create test case studies
    await db.insert(caseStudiesTable).values([testCaseStudy1, testCaseStudy2]).execute();

    const filter: GetCaseStudiesFilter = {};

    const result = await getCaseStudies(filter);

    expect(result).toHaveLength(2);
  });
});
