
import { db } from '../db';
import { homePageContentTable } from '../db/schema';
import { type HomePageContent } from '../schema';

export const getHomePageContent = async (): Promise<HomePageContent | null> => {
  try {
    // Get the first (and typically only) home page content record
    const results = await db.select()
      .from(homePageContentTable)
      .limit(1)
      .execute();

    if (results.length === 0) {
      return null;
    }

    return results[0];
  } catch (error) {
    console.error('Failed to get home page content:', error);
    throw error;
  }
};
