
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactDetailsTable } from '../db/schema';
import { getContactDetails } from '../handlers/get_contact_details';

describe('getContactDetails', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return null when no contact details exist', async () => {
    const result = await getContactDetails();
    expect(result).toBeNull();
  });

  it('should return contact details when they exist', async () => {
    // Create test contact details
    const testDetails = {
      email: 'contact@example.com',
      phone: '+1-555-123-4567',
      address: '123 Main St, City, State 12345',
      working_hours_en: 'Monday-Friday 9:00 AM - 5:00 PM',
      working_hours_fr: 'Lundi-Vendredi 9h00 - 17h00'
    };

    await db.insert(contactDetailsTable)
      .values(testDetails)
      .execute();

    const result = await getContactDetails();

    expect(result).not.toBeNull();
    expect(result!.email).toEqual('contact@example.com');
    expect(result!.phone).toEqual('+1-555-123-4567');
    expect(result!.address).toEqual('123 Main St, City, State 12345');
    expect(result!.working_hours_en).toEqual('Monday-Friday 9:00 AM - 5:00 PM');
    expect(result!.working_hours_fr).toEqual('Lundi-Vendredi 9h00 - 17h00');
    expect(result!.id).toBeDefined();
    expect(result!.updated_at).toBeInstanceOf(Date);
  });

  it('should return only the first record when multiple exist', async () => {
    // Create multiple contact details records
    const firstDetails = {
      email: 'first@example.com',
      phone: '+1-555-111-1111',
      address: '123 First St',
      working_hours_en: 'First hours',
      working_hours_fr: 'Premières heures'
    };

    const secondDetails = {
      email: 'second@example.com',
      phone: '+1-555-222-2222',
      address: '456 Second St',
      working_hours_en: 'Second hours',
      working_hours_fr: 'Deuxièmes heures'
    };

    await db.insert(contactDetailsTable)
      .values([firstDetails, secondDetails])
      .execute();

    const result = await getContactDetails();

    expect(result).not.toBeNull();
    expect(result!.email).toEqual('first@example.com');
    expect(result!.phone).toEqual('+1-555-111-1111');
    expect(result!.address).toEqual('123 First St');
  });

  it('should handle database queries correctly', async () => {
    // Create test contact details
    const testDetails = {
      email: 'test@example.com',
      phone: '+1-555-999-9999',
      address: '789 Test Avenue',
      working_hours_en: 'Test hours',
      working_hours_fr: 'Heures de test'
    };

    const insertResult = await db.insert(contactDetailsTable)
      .values(testDetails)
      .returning()
      .execute();

    const result = await getContactDetails();

    // Verify the returned data matches what was inserted
    expect(result!.id).toEqual(insertResult[0].id);
    expect(result!.updated_at).toBeInstanceOf(Date);
    expect(result!.updated_at.getTime()).toBeCloseTo(insertResult[0].updated_at.getTime(), -2);
  });
});
