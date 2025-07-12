
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactFormSubmissionsTable } from '../db/schema';
import { type CreateContactFormSubmissionInput } from '../schema';
import { getContactFormSubmissions } from '../handlers/get_contact_form_submissions';

describe('getContactFormSubmissions', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no submissions exist', async () => {
    const result = await getContactFormSubmissions();
    expect(result).toEqual([]);
  });

  it('should return all contact form submissions', async () => {
    // Create test submissions
    const submission1: CreateContactFormSubmissionInput = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello, I need help with my project.'
    };

    const submission2: CreateContactFormSubmissionInput = {
      name: 'Jane Smith',
      email: 'jane@example.com',
      message: 'I am interested in your services.'
    };

    await db.insert(contactFormSubmissionsTable)
      .values([submission1, submission2])
      .execute();

    const result = await getContactFormSubmissions();

    expect(result).toHaveLength(2);
    expect(result[0].name).toBeDefined();
    expect(result[0].email).toBeDefined();
    expect(result[0].message).toBeDefined();
    expect(result[0].created_at).toBeInstanceOf(Date);
    expect(result[0].id).toBeDefined();
  });

  it('should return submissions ordered by creation date (newest first)', async () => {
    // Create submissions with slight delay to ensure different timestamps
    const submission1: CreateContactFormSubmissionInput = {
      name: 'First Submission',
      email: 'first@example.com',
      message: 'This was submitted first.'
    };

    await db.insert(contactFormSubmissionsTable)
      .values(submission1)
      .execute();

    // Small delay to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    const submission2: CreateContactFormSubmissionInput = {
      name: 'Second Submission',
      email: 'second@example.com',
      message: 'This was submitted second.'
    };

    await db.insert(contactFormSubmissionsTable)
      .values(submission2)
      .execute();

    const result = await getContactFormSubmissions();

    expect(result).toHaveLength(2);
    // Newest submission should be first
    expect(result[0].name).toEqual('Second Submission');
    expect(result[1].name).toEqual('First Submission');
    expect(result[0].created_at.getTime()).toBeGreaterThan(result[1].created_at.getTime());
  });

  it('should return submissions with all required fields', async () => {
    const submission: CreateContactFormSubmissionInput = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message with all required fields.'
    };

    await db.insert(contactFormSubmissionsTable)
      .values(submission)
      .execute();

    const result = await getContactFormSubmissions();

    expect(result).toHaveLength(1);
    const retrievedSubmission = result[0];
    
    expect(retrievedSubmission.id).toBeDefined();
    expect(retrievedSubmission.name).toEqual('Test User');
    expect(retrievedSubmission.email).toEqual('test@example.com');
    expect(retrievedSubmission.message).toEqual('This is a test message with all required fields.');
    expect(retrievedSubmission.created_at).toBeInstanceOf(Date);
  });
});
