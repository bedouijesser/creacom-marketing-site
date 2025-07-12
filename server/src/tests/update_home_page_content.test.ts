
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { homePageContentTable } from '../db/schema';
import { type UpdateHomePageContentInput } from '../schema';
import { updateHomePageContent } from '../handlers/update_home_page_content';

describe('updateHomePageContent', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create initial home page content when none exists', async () => {
    const input: UpdateHomePageContentInput = {
      hero_title_en: 'New Hero Title',
      hero_title_fr: 'Nouveau Titre Hero',
      hero_subtitle_en: 'New Subtitle',
      hero_subtitle_fr: 'Nouveau Sous-titre'
    };

    const result = await updateHomePageContent(input);

    expect(result.hero_title_en).toEqual('New Hero Title');
    expect(result.hero_title_fr).toEqual('Nouveau Titre Hero');
    expect(result.hero_subtitle_en).toEqual('New Subtitle');
    expect(result.hero_subtitle_fr).toEqual('Nouveau Sous-titre');
    expect(result.about_section_en).toEqual('About our company');
    expect(result.about_section_fr).toEqual('À propos de notre entreprise');
    expect(result.id).toBeDefined();
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should update existing home page content', async () => {
    // Create initial content
    await db.insert(homePageContentTable)
      .values({
        hero_title_en: 'Original Title',
        hero_title_fr: 'Titre Original',
        hero_subtitle_en: 'Original Subtitle',
        hero_subtitle_fr: 'Sous-titre Original',
        about_section_en: 'Original About',
        about_section_fr: 'À propos Original'
      })
      .execute();

    const input: UpdateHomePageContentInput = {
      hero_title_en: 'Updated Title',
      about_section_fr: 'À propos Mis à jour'
    };

    const result = await updateHomePageContent(input);

    expect(result.hero_title_en).toEqual('Updated Title');
    expect(result.hero_title_fr).toEqual('Titre Original'); // Should remain unchanged
    expect(result.hero_subtitle_en).toEqual('Original Subtitle'); // Should remain unchanged
    expect(result.hero_subtitle_fr).toEqual('Sous-titre Original'); // Should remain unchanged
    expect(result.about_section_en).toEqual('Original About'); // Should remain unchanged
    expect(result.about_section_fr).toEqual('À propos Mis à jour');
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should update all fields when provided', async () => {
    // Create initial content
    await db.insert(homePageContentTable)
      .values({
        hero_title_en: 'Original Title',
        hero_title_fr: 'Titre Original',
        hero_subtitle_en: 'Original Subtitle',
        hero_subtitle_fr: 'Sous-titre Original',
        about_section_en: 'Original About',
        about_section_fr: 'À propos Original'
      })
      .execute();

    const input: UpdateHomePageContentInput = {
      hero_title_en: 'Complete Update Title',
      hero_title_fr: 'Titre Complet Mis à jour',
      hero_subtitle_en: 'Complete Update Subtitle',
      hero_subtitle_fr: 'Sous-titre Complet Mis à jour',
      about_section_en: 'Complete Update About',
      about_section_fr: 'À propos Complet Mis à jour'
    };

    const result = await updateHomePageContent(input);

    expect(result.hero_title_en).toEqual('Complete Update Title');
    expect(result.hero_title_fr).toEqual('Titre Complet Mis à jour');
    expect(result.hero_subtitle_en).toEqual('Complete Update Subtitle');
    expect(result.hero_subtitle_fr).toEqual('Sous-titre Complet Mis à jour');
    expect(result.about_section_en).toEqual('Complete Update About');
    expect(result.about_section_fr).toEqual('À propos Complet Mis à jour');
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should persist changes to database', async () => {
    const input: UpdateHomePageContentInput = {
      hero_title_en: 'Persistent Title',
      hero_title_fr: 'Titre Persistant'
    };

    const result = await updateHomePageContent(input);

    // Verify data was saved to database
    const savedContent = await db.select()
      .from(homePageContentTable)
      .limit(1)
      .execute();

    expect(savedContent).toHaveLength(1);
    expect(savedContent[0].hero_title_en).toEqual('Persistent Title');
    expect(savedContent[0].hero_title_fr).toEqual('Titre Persistant');
    expect(savedContent[0].id).toEqual(result.id);
    expect(savedContent[0].updated_at).toBeInstanceOf(Date);
  });

  it('should handle empty input gracefully', async () => {
    const input: UpdateHomePageContentInput = {};

    const result = await updateHomePageContent(input);

    // Should create initial content with defaults
    expect(result.hero_title_en).toEqual('Welcome');
    expect(result.hero_title_fr).toEqual('Bienvenue');
    expect(result.hero_subtitle_en).toEqual('Professional printing services');
    expect(result.hero_subtitle_fr).toEqual('Services d\'impression professionnels');
    expect(result.about_section_en).toEqual('About our company');
    expect(result.about_section_fr).toEqual('À propos de notre entreprise');
    expect(result.id).toBeDefined();
    expect(result.updated_at).toBeInstanceOf(Date);
  });
});
