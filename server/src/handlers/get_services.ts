
import { db } from '../db';
import { servicesTable } from '../db/schema';
import { type Service } from '../schema';

export const getServices = async (): Promise<Service[]> => {
  try {
    const results = await db.select()
      .from(servicesTable)
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch services:', error);
    throw error;
  }
};
