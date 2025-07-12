
import { db } from '../db';
import { caseStudiesTable } from '../db/schema';
import { type CaseStudy, type GetCaseStudiesFilter } from '../schema';
import { desc } from 'drizzle-orm';

export const getCaseStudies = async (filter?: GetCaseStudiesFilter): Promise<CaseStudy[]> => {
  try {
    // Build the query conditionally based on filters
    const baseQuery = db.select()
      .from(caseStudiesTable)
      .orderBy(desc(caseStudiesTable.created_at));

    // Apply pagination conditionally
    if (filter?.limit !== undefined && filter?.offset !== undefined) {
      const results = await baseQuery.limit(filter.limit).offset(filter.offset).execute();
      return results;
    } else if (filter?.limit !== undefined) {
      const results = await baseQuery.limit(filter.limit).execute();
      return results;
    } else if (filter?.offset !== undefined) {
      const results = await baseQuery.offset(filter.offset).execute();
      return results;
    } else {
      const results = await baseQuery.execute();
      return results;
    }
  } catch (error) {
    console.error('Failed to fetch case studies:', error);
    throw error;
  }
};
