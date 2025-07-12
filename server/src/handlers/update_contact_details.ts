
import { db } from '../db';
import { contactDetailsTable } from '../db/schema';
import { type UpdateContactDetailsInput, type ContactDetails } from '../schema';
import { eq } from 'drizzle-orm';

export const updateContactDetails = async (input: UpdateContactDetailsInput): Promise<ContactDetails> => {
  try {
    // First, check if contact details exist
    const existingDetails = await db.select()
      .from(contactDetailsTable)
      .limit(1)
      .execute();

    if (existingDetails.length === 0) {
      throw new Error('No contact details found to update');
    }

    const contactId = existingDetails[0].id;

    // Update contact details
    const result = await db.update(contactDetailsTable)
      .set({
        ...input,
        updated_at: new Date()
      })
      .where(eq(contactDetailsTable.id, contactId))
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Contact details update failed:', error);
    throw error;
  }
};
