
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { servicesTable } from '../db/schema';
import { getServices } from '../handlers/get_services';

describe('getServices', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no services exist', async () => {
    const result = await getServices();
    expect(result).toEqual([]);
  });

  it('should return all services', async () => {
    // Create test services
    await db.insert(servicesTable).values([
      {
        title_en: 'Graphic Design',
        title_fr: 'Conception Graphique',
        description_en: 'Creative design solutions',
        description_fr: 'Solutions de conception créative'
      },
      {
        title_en: 'Digital Printing',
        title_fr: 'Impression Numérique',
        description_en: 'High-quality printing services',
        description_fr: 'Services d\'impression de haute qualité'
      }
    ]).execute();

    const result = await getServices();

    expect(result).toHaveLength(2);
    
    // Verify first service
    expect(result[0].title_en).toEqual('Graphic Design');
    expect(result[0].title_fr).toEqual('Conception Graphique');
    expect(result[0].description_en).toEqual('Creative design solutions');
    expect(result[0].description_fr).toEqual('Solutions de conception créative');
    expect(result[0].id).toBeDefined();
    expect(result[0].created_at).toBeInstanceOf(Date);
    expect(result[0].updated_at).toBeInstanceOf(Date);

    // Verify second service
    expect(result[1].title_en).toEqual('Digital Printing');
    expect(result[1].title_fr).toEqual('Impression Numérique');
    expect(result[1].description_en).toEqual('High-quality printing services');
    expect(result[1].description_fr).toEqual('Services d\'impression de haute qualité');
    expect(result[1].id).toBeDefined();
    expect(result[1].created_at).toBeInstanceOf(Date);
    expect(result[1].updated_at).toBeInstanceOf(Date);
  });

  it('should return services in creation order', async () => {
    // Create services with slight delay to ensure different timestamps
    await db.insert(servicesTable).values({
      title_en: 'First Service',
      title_fr: 'Premier Service',
      description_en: 'First description',
      description_fr: 'Première description'
    }).execute();

    await db.insert(servicesTable).values({
      title_en: 'Second Service',
      title_fr: 'Deuxième Service',
      description_en: 'Second description',
      description_fr: 'Deuxième description'
    }).execute();

    const result = await getServices();

    expect(result).toHaveLength(2);
    expect(result[0].title_en).toEqual('First Service');
    expect(result[1].title_en).toEqual('Second Service');
    expect(result[0].created_at <= result[1].created_at).toBe(true);
  });
});
