
import { db } from '../db';
import { contactFormSubmissionsTable } from '../db/schema';
import { type CreateContactFormSubmissionInput, type ContactFormSubmission } from '../schema';

export const createContactFormSubmission = async (input: CreateContactFormSubmissionInput): Promise<ContactFormSubmission> => {
  try {
    // Insert contact form submission record
    const result = await db.insert(contactFormSubmissionsTable)
      .values({
        name: input.name,
        email: input.email,
        message: input.message
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Contact form submission creation failed:', error);
    throw error;
  }
};
