
import { db } from '../db';
import { servicesTable } from '../db/schema';
import { eq } from 'drizzle-orm';

export const deleteService = async (id: number): Promise<{ success: boolean }> => {
  try {
    // Delete the service by ID
    const result = await db.delete(servicesTable)
      .where(eq(servicesTable.id, id))
      .returning()
      .execute();

    // Return success based on whether a row was deleted
    return { success: result.length > 0 };
  } catch (error) {
    console.error('Service deletion failed:', error);
    throw error;
  }
};
