
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { caseStudiesTable } from '../db/schema';
import { getCaseStudy } from '../handlers/get_case_study';

const testCaseStudy = {
  title_en: 'Test Case Study',
  title_fr: 'Étude de cas test',
  description_en: 'A test case study description',
  description_fr: 'Une description d\'étude de cas test',
  client_name_en: 'Test Client',
  client_name_fr: 'Client test',
  challenge_description_en: 'The challenge we faced',
  challenge_description_fr: 'Le défi que nous avons relevé',
  solution_description_en: 'The solution we provided',
  solution_description_fr: 'La solution que nous avons fournie',
  results_description_en: 'The results we achieved',
  results_description_fr: 'Les résultats que nous avons obtenus'
};

describe('getCaseStudy', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return case study when found', async () => {
    // Create a case study
    const created = await db.insert(caseStudiesTable)
      .values(testCaseStudy)
      .returning()
      .execute();

    const caseStudyId = created[0].id;

    // Get the case study
    const result = await getCaseStudy(caseStudyId);

    expect(result).not.toBeNull();
    expect(result!.id).toBe(caseStudyId);
    expect(result!.title_en).toBe('Test Case Study');
    expect(result!.title_fr).toBe('Étude de cas test');
    expect(result!.description_en).toBe('A test case study description');
    expect(result!.description_fr).toBe('Une description d\'étude de cas test');
    expect(result!.client_name_en).toBe('Test Client');
    expect(result!.client_name_fr).toBe('Client test');
    expect(result!.challenge_description_en).toBe('The challenge we faced');
    expect(result!.challenge_description_fr).toBe('Le défi que nous avons relevé');
    expect(result!.solution_description_en).toBe('The solution we provided');
    expect(result!.solution_description_fr).toBe('La solution que nous avons fournie');
    expect(result!.results_description_en).toBe('The results we achieved');
    expect(result!.results_description_fr).toBe('Les résultats que nous avons obtenus');
    expect(result!.created_at).toBeInstanceOf(Date);
    expect(result!.updated_at).toBeInstanceOf(Date);
  });

  it('should return null when case study not found', async () => {
    const result = await getCaseStudy(999);

    expect(result).toBeNull();
  });

  it('should return correct case study when multiple exist', async () => {
    // Create multiple case studies
    const caseStudy1 = await db.insert(caseStudiesTable)
      .values({
        ...testCaseStudy,
        title_en: 'First Case Study',
        title_fr: 'Première étude de cas'
      })
      .returning()
      .execute();

    const caseStudy2 = await db.insert(caseStudiesTable)
      .values({
        ...testCaseStudy,
        title_en: 'Second Case Study',
        title_fr: 'Deuxième étude de cas'
      })
      .returning()
      .execute();

    // Get the second case study
    const result = await getCaseStudy(caseStudy2[0].id);

    expect(result).not.toBeNull();
    expect(result!.id).toBe(caseStudy2[0].id);
    expect(result!.title_en).toBe('Second Case Study');
    expect(result!.title_fr).toBe('Deuxième étude de cas');
  });
});
