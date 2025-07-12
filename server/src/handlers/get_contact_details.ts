
import { db } from '../db';
import { contactDetailsTable } from '../db/schema';
import { type ContactDetails } from '../schema';

export const getContactDetails = async (): Promise<ContactDetails | null> => {
  try {
    // Get the first (and should be only) contact details record
    const result = await db.select()
      .from(contactDetailsTable)
      .limit(1)
      .execute();

    if (result.length === 0) {
      return null;
    }

    return result[0];
  } catch (error) {
    console.error('Failed to fetch contact details:', error);
    throw error;
  }
};
