
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { servicesTable } from '../db/schema';
import { type CreateServiceInput } from '../schema';
import { deleteService } from '../handlers/delete_service';
import { eq } from 'drizzle-orm';

// Test service data
const testService: CreateServiceInput = {
  title_en: 'Test Service',
  title_fr: 'Service Test',
  description_en: 'A service for testing',
  description_fr: 'Un service pour tester'
};

describe('deleteService', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should delete an existing service', async () => {
    // Create a service first
    const [createdService] = await db.insert(servicesTable)
      .values(testService)
      .returning()
      .execute();

    // Delete the service
    const result = await deleteService(createdService.id);

    // Verify deletion was successful
    expect(result.success).toBe(true);

    // Verify service is removed from database
    const services = await db.select()
      .from(servicesTable)
      .where(eq(servicesTable.id, createdService.id))
      .execute();

    expect(services).toHaveLength(0);
  });

  it('should return false for non-existent service', async () => {
    // Try to delete a service that doesn't exist
    const result = await deleteService(999);

    // Should return false since no rows were affected
    expect(result.success).toBe(false);
  });

  it('should not affect other services', async () => {
    // Create multiple services
    const [service1] = await db.insert(servicesTable)
      .values(testService)
      .returning()
      .execute();

    const [service2] = await db.insert(servicesTable)
      .values({
        ...testService,
        title_en: 'Another Service',
        title_fr: 'Autre Service'
      })
      .returning()
      .execute();

    // Delete only the first service
    const result = await deleteService(service1.id);

    expect(result.success).toBe(true);

    // Verify only the first service was deleted
    const remainingServices = await db.select()
      .from(servicesTable)
      .execute();

    expect(remainingServices).toHaveLength(1);
    expect(remainingServices[0].id).toBe(service2.id);
    expect(remainingServices[0].title_en).toBe('Another Service');
  });
});
