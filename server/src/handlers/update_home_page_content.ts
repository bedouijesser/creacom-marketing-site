
import { db } from '../db';
import { homePageContentTable } from '../db/schema';
import { type UpdateHomePageContentInput, type HomePageContent } from '../schema';
import { eq } from 'drizzle-orm';

export const updateHomePageContent = async (input: UpdateHomePageContentInput): Promise<HomePageContent> => {
  try {
    // First, try to get existing home page content
    const existingContent = await db.select()
      .from(homePageContentTable)
      .limit(1)
      .execute();

    if (existingContent.length === 0) {
      // If no content exists, create initial content with provided fields
      const result = await db.insert(homePageContentTable)
        .values({
          hero_title_en: input.hero_title_en || 'Welcome',
          hero_title_fr: input.hero_title_fr || 'Bienvenue',
          hero_subtitle_en: input.hero_subtitle_en || 'Professional printing services',
          hero_subtitle_fr: input.hero_subtitle_fr || 'Services d\'impression professionnels',
          about_section_en: input.about_section_en || 'About our company',
          about_section_fr: input.about_section_fr || 'À propos de notre entreprise'
        })
        .returning()
        .execute();

      return result[0];
    } else {
      // Update existing content with only provided fields
      const updateData: any = {};
      
      if (input.hero_title_en !== undefined) updateData.hero_title_en = input.hero_title_en;
      if (input.hero_title_fr !== undefined) updateData.hero_title_fr = input.hero_title_fr;
      if (input.hero_subtitle_en !== undefined) updateData.hero_subtitle_en = input.hero_subtitle_en;
      if (input.hero_subtitle_fr !== undefined) updateData.hero_subtitle_fr = input.hero_subtitle_fr;
      if (input.about_section_en !== undefined) updateData.about_section_en = input.about_section_en;
      if (input.about_section_fr !== undefined) updateData.about_section_fr = input.about_section_fr;

      // Always update the timestamp
      updateData.updated_at = new Date();

      const result = await db.update(homePageContentTable)
        .set(updateData)
        .where(eq(homePageContentTable.id, existingContent[0].id))
        .returning()
        .execute();

      return result[0];
    }
  } catch (error) {
    console.error('Home page content update failed:', error);
    throw error;
  }
};
