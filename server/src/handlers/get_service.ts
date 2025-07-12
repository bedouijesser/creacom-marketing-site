
import { db } from '../db';
import { servicesTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { type Service } from '../schema';

export const getService = async (id: number): Promise<Service | null> => {
  try {
    const results = await db.select()
      .from(servicesTable)
      .where(eq(servicesTable.id, id))
      .limit(1)
      .execute();

    if (results.length === 0) {
      return null;
    }

    return results[0];
  } catch (error) {
    console.error('Service retrieval failed:', error);
    throw error;
  }
};
