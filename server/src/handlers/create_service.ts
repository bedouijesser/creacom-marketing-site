
import { db } from '../db';
import { servicesTable } from '../db/schema';
import { type CreateServiceInput, type Service } from '../schema';

export const createService = async (input: CreateServiceInput): Promise<Service> => {
  try {
    // Insert service record
    const result = await db.insert(servicesTable)
      .values({
        title_en: input.title_en,
        title_fr: input.title_fr,
        description_en: input.description_en,
        description_fr: input.description_fr
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Service creation failed:', error);
    throw error;
  }
};
