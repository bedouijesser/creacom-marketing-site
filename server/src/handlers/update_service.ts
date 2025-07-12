
import { db } from '../db';
import { servicesTable } from '../db/schema';
import { type UpdateServiceInput, type Service } from '../schema';
import { eq } from 'drizzle-orm';

export const updateService = async (input: UpdateServiceInput): Promise<Service> => {
  try {
    // Build update object with only provided fields
    const updateData: Record<string, any> = {
      updated_at: new Date()
    };

    if (input.title_en !== undefined) {
      updateData['title_en'] = input.title_en;
    }
    if (input.title_fr !== undefined) {
      updateData['title_fr'] = input.title_fr;
    }
    if (input.description_en !== undefined) {
      updateData['description_en'] = input.description_en;
    }
    if (input.description_fr !== undefined) {
      updateData['description_fr'] = input.description_fr;
    }

    // Update service record
    const result = await db.update(servicesTable)
      .set(updateData)
      .where(eq(servicesTable.id, input.id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new Error(`Service with id ${input.id} not found`);
    }

    return result[0];
  } catch (error) {
    console.error('Service update failed:', error);
    throw error;
  }
};
