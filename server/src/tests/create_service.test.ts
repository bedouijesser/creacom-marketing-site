
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { servicesTable } from '../db/schema';
import { type CreateServiceInput } from '../schema';
import { createService } from '../handlers/create_service';
import { eq } from 'drizzle-orm';

// Test input
const testInput: CreateServiceInput = {
  title_en: 'Test Service',
  title_fr: 'Service de Test',
  description_en: 'A service for testing purposes',
  description_fr: 'Un service pour les tests'
};

describe('createService', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a service', async () => {
    const result = await createService(testInput);

    // Basic field validation
    expect(result.title_en).toEqual('Test Service');
    expect(result.title_fr).toEqual('Service de Test');
    expect(result.description_en).toEqual('A service for testing purposes');
    expect(result.description_fr).toEqual('Un service pour les tests');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save service to database', async () => {
    const result = await createService(testInput);

    // Query using proper drizzle syntax
    const services = await db.select()
      .from(servicesTable)
      .where(eq(servicesTable.id, result.id))
      .execute();

    expect(services).toHaveLength(1);
    expect(services[0].title_en).toEqual('Test Service');
    expect(services[0].title_fr).toEqual('Service de Test');
    expect(services[0].description_en).toEqual('A service for testing purposes');
    expect(services[0].description_fr).toEqual('Un service pour les tests');
    expect(services[0].created_at).toBeInstanceOf(Date);
    expect(services[0].updated_at).toBeInstanceOf(Date);
  });

  it('should create service with multilingual content', async () => {
    const multilingualInput: CreateServiceInput = {
      title_en: 'Graphic Design',
      title_fr: 'Conception Graphique',
      description_en: 'Professional graphic design services',
      description_fr: 'Services de conception graphique professionnelle'
    };

    const result = await createService(multilingualInput);

    expect(result.title_en).toEqual('Graphic Design');
    expect(result.title_fr).toEqual('Conception Graphique');
    expect(result.description_en).toEqual('Professional graphic design services');
    expect(result.description_fr).toEqual('Services de conception graphique professionnelle');
  });
});
