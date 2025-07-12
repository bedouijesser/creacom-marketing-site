
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactFormSubmissionsTable } from '../db/schema';
import { type CreateContactFormSubmissionInput } from '../schema';
import { createContactFormSubmission } from '../handlers/create_contact_form_submission';
import { eq } from 'drizzle-orm';

// Simple test input
const testInput: CreateContactFormSubmissionInput = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  message: 'I would like to inquire about your services.'
};

describe('createContactFormSubmission', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a contact form submission', async () => {
    const result = await createContactFormSubmission(testInput);

    // Basic field validation
    expect(result.name).toEqual('John Doe');
    expect(result.email).toEqual('john.doe@example.com');
    expect(result.message).toEqual('I would like to inquire about your services.');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save contact form submission to database', async () => {
    const result = await createContactFormSubmission(testInput);

    // Query using proper drizzle syntax
    const submissions = await db.select()
      .from(contactFormSubmissionsTable)
      .where(eq(contactFormSubmissionsTable.id, result.id))
      .execute();

    expect(submissions).toHaveLength(1);
    expect(submissions[0].name).toEqual('John Doe');
    expect(submissions[0].email).toEqual('john.doe@example.com');
    expect(submissions[0].message).toEqual('I would like to inquire about your services.');
    expect(submissions[0].created_at).toBeInstanceOf(Date);
  });

  it('should handle multilingual names and messages', async () => {
    const multilingualInput: CreateContactFormSubmissionInput = {
      name: 'Marie Dubois',
      email: 'marie.dubois@example.fr',
      message: 'Bonjour, je souhaiterais obtenir des informations sur vos services de conception graphique.'
    };

    const result = await createContactFormSubmission(multilingualInput);

    expect(result.name).toEqual('Marie Dubois');
    expect(result.email).toEqual('marie.dubois@example.fr');
    expect(result.message).toEqual('Bonjour, je souhaiterais obtenir des informations sur vos services de conception graphique.');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });
});
