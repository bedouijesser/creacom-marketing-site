
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { caseStudiesTable } from '../db/schema';
import { type CreateCaseStudyInput } from '../schema';
import { createCaseStudy } from '../handlers/create_case_study';
import { eq } from 'drizzle-orm';

// Test input for case study creation
const testInput: CreateCaseStudyInput = {
  title_en: 'Test Case Study',
  title_fr: 'Étude de cas test',
  description_en: 'A comprehensive case study for testing purposes',
  description_fr: 'Une étude de cas complète à des fins de test',
  client_name_en: 'Test Client Corp',
  client_name_fr: 'Corporation Client Test',
  challenge_description_en: 'The client faced significant challenges in their marketing approach',
  challenge_description_fr: 'Le client a fait face à des défis importants dans son approche marketing',
  solution_description_en: 'We implemented a comprehensive digital strategy',
  solution_description_fr: 'Nous avons mis en place une stratégie numérique complète',
  results_description_en: 'The results exceeded expectations with 300% growth',
  results_description_fr: 'Les résultats ont dépassé les attentes avec une croissance de 300%'
};

describe('createCaseStudy', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a case study with all multilingual fields', async () => {
    const result = await createCaseStudy(testInput);

    // Verify all English fields
    expect(result.title_en).toEqual('Test Case Study');
    expect(result.description_en).toEqual('A comprehensive case study for testing purposes');
    expect(result.client_name_en).toEqual('Test Client Corp');
    expect(result.challenge_description_en).toEqual('The client faced significant challenges in their marketing approach');
    expect(result.solution_description_en).toEqual('We implemented a comprehensive digital strategy');
    expect(result.results_description_en).toEqual('The results exceeded expectations with 300% growth');

    // Verify all French fields
    expect(result.title_fr).toEqual('Étude de cas test');
    expect(result.description_fr).toEqual('Une étude de cas complète à des fins de test');
    expect(result.client_name_fr).toEqual('Corporation Client Test');
    expect(result.challenge_description_fr).toEqual('Le client a fait face à des défis importants dans son approche marketing');
    expect(result.solution_description_fr).toEqual('Nous avons mis en place une stratégie numérique complète');
    expect(result.results_description_fr).toEqual('Les résultats ont dépassé les attentes avec une croissance de 300%');

    // Verify metadata fields
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save case study to database', async () => {
    const result = await createCaseStudy(testInput);

    // Query the database to verify the record was saved
    const caseStudies = await db.select()
      .from(caseStudiesTable)
      .where(eq(caseStudiesTable.id, result.id))
      .execute();

    expect(caseStudies).toHaveLength(1);
    const savedCaseStudy = caseStudies[0];

    // Verify all fields were saved correctly
    expect(savedCaseStudy.title_en).toEqual('Test Case Study');
    expect(savedCaseStudy.title_fr).toEqual('Étude de cas test');
    expect(savedCaseStudy.client_name_en).toEqual('Test Client Corp');
    expect(savedCaseStudy.client_name_fr).toEqual('Corporation Client Test');
    expect(savedCaseStudy.created_at).toBeInstanceOf(Date);
    expect(savedCaseStudy.updated_at).toBeInstanceOf(Date);
  });

  it('should handle case studies with different content lengths', async () => {
    const longContentInput: CreateCaseStudyInput = {
      title_en: 'Very Long Case Study Title That Tests Character Limits',
      title_fr: 'Titre d\'étude de cas très long qui teste les limites de caractères',
      description_en: 'This is a very detailed description that contains multiple sentences and covers various aspects of the case study to test how the system handles longer content.',
      description_fr: 'Ceci est une description très détaillée qui contient plusieurs phrases et couvre divers aspects de l\'étude de cas pour tester comment le système gère le contenu plus long.',
      client_name_en: 'Enterprise Global Solutions International Corporation',
      client_name_fr: 'Corporation Internationale Solutions Globales Entreprise',
      challenge_description_en: 'The client faced multiple complex challenges including market penetration difficulties, brand recognition issues, and competition from established players in the industry.',
      challenge_description_fr: 'Le client a fait face à plusieurs défis complexes incluant des difficultés de pénétration du marché, des problèmes de reconnaissance de marque, et la concurrence des acteurs établis dans l\'industrie.',
      solution_description_en: 'We developed a comprehensive multi-phase solution that included strategic planning, digital transformation, brand repositioning, and targeted marketing campaigns.',
      solution_description_fr: 'Nous avons développé une solution complète multi-phases qui incluait la planification stratégique, la transformation numérique, le repositionnement de marque, et des campagnes marketing ciblées.',
      results_description_en: 'The implementation resulted in significant improvements across all key metrics including a 400% increase in market share, improved customer satisfaction ratings, and enhanced brand visibility.',
      results_description_fr: 'La mise en œuvre a entraîné des améliorations significatives dans toutes les métriques clés incluant une augmentation de 400% de la part de marché, des notes de satisfaction client améliorées, et une visibilité de marque renforcée.'
    };

    const result = await createCaseStudy(longContentInput);

    expect(result.title_en).toEqual(longContentInput.title_en);
    expect(result.description_en).toEqual(longContentInput.description_en);
    expect(result.challenge_description_en).toEqual(longContentInput.challenge_description_en);
    expect(result.solution_description_en).toEqual(longContentInput.solution_description_en);
    expect(result.results_description_en).toEqual(longContentInput.results_description_en);
  });
});
