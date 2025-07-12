
import { db } from '../db';
import { contactFormSubmissionsTable } from '../db/schema';
import { type ContactFormSubmission } from '../schema';
import { desc } from 'drizzle-orm';

export const getContactFormSubmissions = async (): Promise<ContactFormSubmission[]> => {
  try {
    const results = await db.select()
      .from(contactFormSubmissionsTable)
      .orderBy(desc(contactFormSubmissionsTable.created_at))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch contact form submissions:', error);
    throw error;
  }
};
