
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { servicesTable } from '../db/schema';
import { type CreateServiceInput } from '../schema';
import { getService } from '../handlers/get_service';

const testService: CreateServiceInput = {
  title_en: 'Test Service',
  title_fr: 'Service de Test',
  description_en: 'A service for testing purposes',
  description_fr: 'Un service à des fins de test'
};

describe('getService', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return a service when found', async () => {
    // Create a test service
    const createResult = await db.insert(servicesTable)
      .values(testService)
      .returning()
      .execute();

    const createdService = createResult[0];

    // Get the service
    const result = await getService(createdService.id);

    expect(result).not.toBeNull();
    expect(result!.id).toEqual(createdService.id);
    expect(result!.title_en).toEqual('Test Service');
    expect(result!.title_fr).toEqual('Service de Test');
    expect(result!.description_en).toEqual('A service for testing purposes');
    expect(result!.description_fr).toEqual('Un service à des fins de test');
    expect(result!.created_at).toBeInstanceOf(Date);
    expect(result!.updated_at).toBeInstanceOf(Date);
  });

  it('should return null when service not found', async () => {
    const result = await getService(999);

    expect(result).toBeNull();
  });

  it('should handle multiple services and return correct one', async () => {
    // Create multiple services
    const service1 = await db.insert(servicesTable)
      .values({
        title_en: 'Service 1',
        title_fr: 'Service 1 FR',
        description_en: 'Description 1',
        description_fr: 'Description 1 FR'
      })
      .returning()
      .execute();

    const service2 = await db.insert(servicesTable)
      .values({
        title_en: 'Service 2',
        title_fr: 'Service 2 FR',
        description_en: 'Description 2',
        description_fr: 'Description 2 FR'
      })
      .returning()
      .execute();

    // Get specific service
    const result = await getService(service2[0].id);

    expect(result).not.toBeNull();
    expect(result!.id).toEqual(service2[0].id);
    expect(result!.title_en).toEqual('Service 2');
    expect(result!.title_fr).toEqual('Service 2 FR');
    expect(result!.description_en).toEqual('Description 2');
    expect(result!.description_fr).toEqual('Description 2 FR');
  });
});
