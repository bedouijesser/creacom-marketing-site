
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { servicesTable } from '../db/schema';
import { type UpdateServiceInput, type CreateServiceInput } from '../schema';
import { updateService } from '../handlers/update_service';
import { eq } from 'drizzle-orm';

// Test data
const testServiceData: CreateServiceInput = {
  title_en: 'Original Service',
  title_fr: 'Service Original',
  description_en: 'Original description',
  description_fr: 'Description originale'
};

const createTestService = async () => {
  const result = await db.insert(servicesTable)
    .values(testServiceData)
    .returning()
    .execute();
  return result[0];
};

describe('updateService', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update service with all fields', async () => {
    const service = await createTestService();
    
    const updateInput: UpdateServiceInput = {
      id: service.id,
      title_en: 'Updated Service',
      title_fr: 'Service Mis à Jour',
      description_en: 'Updated description',
      description_fr: 'Description mise à jour'
    };

    const result = await updateService(updateInput);

    expect(result.id).toEqual(service.id);
    expect(result.title_en).toEqual('Updated Service');
    expect(result.title_fr).toEqual('Service Mis à Jour');
    expect(result.description_en).toEqual('Updated description');
    expect(result.description_fr).toEqual('Description mise à jour');
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at > service.updated_at).toBe(true);
  });

  it('should update service with partial fields', async () => {
    const service = await createTestService();
    
    const updateInput: UpdateServiceInput = {
      id: service.id,
      title_en: 'Partially Updated'
    };

    const result = await updateService(updateInput);

    expect(result.id).toEqual(service.id);
    expect(result.title_en).toEqual('Partially Updated');
    expect(result.title_fr).toEqual('Service Original'); // unchanged
    expect(result.description_en).toEqual('Original description'); // unchanged
    expect(result.description_fr).toEqual('Description originale'); // unchanged
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at > service.updated_at).toBe(true);
  });

  it('should persist changes to database', async () => {
    const service = await createTestService();
    
    const updateInput: UpdateServiceInput = {
      id: service.id,
      title_en: 'Database Test',
      description_fr: 'Test de base de données'
    };

    await updateService(updateInput);

    // Verify changes in database
    const updatedService = await db.select()
      .from(servicesTable)
      .where(eq(servicesTable.id, service.id))
      .execute();

    expect(updatedService).toHaveLength(1);
    expect(updatedService[0].title_en).toEqual('Database Test');
    expect(updatedService[0].title_fr).toEqual('Service Original'); // unchanged
    expect(updatedService[0].description_en).toEqual('Original description'); // unchanged
    expect(updatedService[0].description_fr).toEqual('Test de base de données');
    expect(updatedService[0].updated_at).toBeInstanceOf(Date);
  });

  it('should throw error for non-existent service', async () => {
    const updateInput: UpdateServiceInput = {
      id: 999,
      title_en: 'Non-existent Service'
    };

    expect(updateService(updateInput)).rejects.toThrow(/Service with id 999 not found/i);
  });

  it('should update only updated_at when no fields provided', async () => {
    const service = await createTestService();
    
    const updateInput: UpdateServiceInput = {
      id: service.id
    };

    const result = await updateService(updateInput);

    expect(result.id).toEqual(service.id);
    expect(result.title_en).toEqual('Original Service');
    expect(result.title_fr).toEqual('Service Original');
    expect(result.description_en).toEqual('Original description');
    expect(result.description_fr).toEqual('Description originale');
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at > service.updated_at).toBe(true);
  });
});
