
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactDetailsTable } from '../db/schema';
import { type UpdateContactDetailsInput } from '../schema';
import { updateContactDetails } from '../handlers/update_contact_details';
import { eq } from 'drizzle-orm';

describe('updateContactDetails', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update contact details', async () => {
    // Create initial contact details
    await db.insert(contactDetailsTable)
      .values({
        email: 'old@example.com',
        phone: '123-456-7890',
        address: 'Old Address',
        working_hours_en: 'Mon-Fri 9-5',
        working_hours_fr: 'Lun-Ven 9-17'
      })
      .execute();

    const updateInput: UpdateContactDetailsInput = {
      email: 'new@example.com',
      phone: '098-765-4321',
      address: 'New Address',
      working_hours_en: 'Mon-Fri 8-6',
      working_hours_fr: 'Lun-Ven 8-18'
    };

    const result = await updateContactDetails(updateInput);

    expect(result.email).toEqual('new@example.com');
    expect(result.phone).toEqual('098-765-4321');
    expect(result.address).toEqual('New Address');
    expect(result.working_hours_en).toEqual('Mon-Fri 8-6');
    expect(result.working_hours_fr).toEqual('Lun-Ven 8-18');
    expect(result.id).toBeDefined();
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should update partial contact details', async () => {
    // Create initial contact details
    await db.insert(contactDetailsTable)
      .values({
        email: 'old@example.com',
        phone: '123-456-7890',
        address: 'Old Address',
        working_hours_en: 'Mon-Fri 9-5',
        working_hours_fr: 'Lun-Ven 9-17'
      })
      .execute();

    const updateInput: UpdateContactDetailsInput = {
      email: 'updated@example.com',
      working_hours_en: 'Mon-Fri 8-6'
    };

    const result = await updateContactDetails(updateInput);

    expect(result.email).toEqual('updated@example.com');
    expect(result.phone).toEqual('123-456-7890'); // Should remain unchanged
    expect(result.address).toEqual('Old Address'); // Should remain unchanged
    expect(result.working_hours_en).toEqual('Mon-Fri 8-6');
    expect(result.working_hours_fr).toEqual('Lun-Ven 9-17'); // Should remain unchanged
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save updated contact details to database', async () => {
    // Create initial contact details
    const initialDetails = await db.insert(contactDetailsTable)
      .values({
        email: 'old@example.com',
        phone: '123-456-7890',
        address: 'Old Address',
        working_hours_en: 'Mon-Fri 9-5',
        working_hours_fr: 'Lun-Ven 9-17'
      })
      .returning()
      .execute();

    const updateInput: UpdateContactDetailsInput = {
      email: 'verified@example.com',
      phone: '555-123-4567'
    };

    const result = await updateContactDetails(updateInput);

    // Verify data was saved in database
    const savedDetails = await db.select()
      .from(contactDetailsTable)
      .where(eq(contactDetailsTable.id, result.id))
      .execute();

    expect(savedDetails).toHaveLength(1);
    expect(savedDetails[0].email).toEqual('verified@example.com');
    expect(savedDetails[0].phone).toEqual('555-123-4567');
    expect(savedDetails[0].address).toEqual('Old Address');
    expect(savedDetails[0].working_hours_en).toEqual('Mon-Fri 9-5');
    expect(savedDetails[0].working_hours_fr).toEqual('Lun-Ven 9-17');
    expect(savedDetails[0].updated_at).toBeInstanceOf(Date);
  });

  it('should throw error when no contact details exist', async () => {
    const updateInput: UpdateContactDetailsInput = {
      email: 'test@example.com'
    };

    await expect(updateContactDetails(updateInput)).rejects.toThrow(/no contact details found/i);
  });
});
