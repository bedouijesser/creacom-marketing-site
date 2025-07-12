
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { homePageContentTable } from '../db/schema';
import { getHomePageContent } from '../handlers/get_home_page_content';

describe('getHomePageContent', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return null when no home page content exists', async () => {
    const result = await getHomePageContent();
    expect(result).toBeNull();
  });

  it('should return home page content when it exists', async () => {
    // Create test home page content
    const testContent = {
      hero_title_en: 'Welcome to Our Design Studio',
      hero_title_fr: 'Bienvenue dans notre studio de design',
      hero_subtitle_en: 'Creating beautiful designs for your business',
      hero_subtitle_fr: 'Créer de beaux designs pour votre entreprise',
      about_section_en: 'We are a creative design studio specializing in branding and digital solutions.',
      about_section_fr: 'Nous sommes un studio de design créatif spécialisé dans l\'image de marque et les solutions numériques.'
    };

    await db.insert(homePageContentTable)
      .values(testContent)
      .execute();

    const result = await getHomePageContent();

    expect(result).toBeDefined();
    expect(result?.hero_title_en).toBe(testContent.hero_title_en);
    expect(result?.hero_title_fr).toBe(testContent.hero_title_fr);
    expect(result?.hero_subtitle_en).toBe(testContent.hero_subtitle_en);
    expect(result?.hero_subtitle_fr).toBe(testContent.hero_subtitle_fr);
    expect(result?.about_section_en).toBe(testContent.about_section_en);
    expect(result?.about_section_fr).toBe(testContent.about_section_fr);
    expect(result?.id).toBeDefined();
    expect(result?.updated_at).toBeInstanceOf(Date);
  });

  it('should return only the first record when multiple exist', async () => {
    // Create multiple home page content records
    const firstContent = {
      hero_title_en: 'First Title',
      hero_title_fr: 'Premier Titre',
      hero_subtitle_en: 'First Subtitle',
      hero_subtitle_fr: 'Premier Sous-titre',
      about_section_en: 'First about section',
      about_section_fr: 'Première section à propos'
    };

    const secondContent = {
      hero_title_en: 'Second Title',
      hero_title_fr: 'Deuxième Titre',
      hero_subtitle_en: 'Second Subtitle',
      hero_subtitle_fr: 'Deuxième Sous-titre',
      about_section_en: 'Second about section',
      about_section_fr: 'Deuxième section à propos'
    };

    await db.insert(homePageContentTable)
      .values([firstContent, secondContent])
      .execute();

    const result = await getHomePageContent();

    expect(result).toBeDefined();
    expect(result?.hero_title_en).toBe(firstContent.hero_title_en);
    expect(result?.hero_title_fr).toBe(firstContent.hero_title_fr);
  });

  it('should return correct data structure', async () => {
    const testContent = {
      hero_title_en: 'Test Title',
      hero_title_fr: 'Titre Test',
      hero_subtitle_en: 'Test Subtitle',
      hero_subtitle_fr: 'Sous-titre Test',
      about_section_en: 'Test about section',
      about_section_fr: 'Section à propos test'
    };

    await db.insert(homePageContentTable)
      .values(testContent)
      .execute();

    const result = await getHomePageContent();

    expect(result).toBeDefined();
    expect(typeof result?.id).toBe('number');
    expect(typeof result?.hero_title_en).toBe('string');
    expect(typeof result?.hero_title_fr).toBe('string');
    expect(typeof result?.hero_subtitle_en).toBe('string');
    expect(typeof result?.hero_subtitle_fr).toBe('string');
    expect(typeof result?.about_section_en).toBe('string');
    expect(typeof result?.about_section_fr).toBe('string');
    expect(result?.updated_at).toBeInstanceOf(Date);
  });
});
