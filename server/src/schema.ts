
import { z } from 'zod';

// Language enum
export const languageSchema = z.enum(['en', 'fr']);
export type Language = z.infer<typeof languageSchema>;

// Service schemas
export const serviceSchema = z.object({
  id: z.number(),
  title_en: z.string(),
  title_fr: z.string(),
  description_en: z.string(),
  description_fr: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Service = z.infer<typeof serviceSchema>;

export const createServiceInputSchema = z.object({
  title_en: z.string().min(1),
  title_fr: z.string().min(1),
  description_en: z.string().min(1),
  description_fr: z.string().min(1)
});

export type CreateServiceInput = z.infer<typeof createServiceInputSchema>;

export const updateServiceInputSchema = z.object({
  id: z.number(),
  title_en: z.string().min(1).optional(),
  title_fr: z.string().min(1).optional(),
  description_en: z.string().min(1).optional(),
  description_fr: z.string().min(1).optional()
});

export type UpdateServiceInput = z.infer<typeof updateServiceInputSchema>;

// Project schemas
export const projectCategorySchema = z.enum(['graphic_design', 'digital_printing', 'packaging', 'other']);
export type ProjectCategory = z.infer<typeof projectCategorySchema>;

export const projectSchema = z.object({
  id: z.number(),
  title_en: z.string(),
  title_fr: z.string(),
  description_en: z.string(),
  description_fr: z.string(),
  category: projectCategorySchema,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Project = z.infer<typeof projectSchema>;

export const createProjectInputSchema = z.object({
  title_en: z.string().min(1),
  title_fr: z.string().min(1),
  description_en: z.string().min(1),
  description_fr: z.string().min(1),
  category: projectCategorySchema
});

export type CreateProjectInput = z.infer<typeof createProjectInputSchema>;

export const updateProjectInputSchema = z.object({
  id: z.number(),
  title_en: z.string().min(1).optional(),
  title_fr: z.string().min(1).optional(),
  description_en: z.string().min(1).optional(),
  description_fr: z.string().min(1).optional(),
  category: projectCategorySchema.optional()
});

export type UpdateProjectInput = z.infer<typeof updateProjectInputSchema>;

// Project image schemas
export const projectImageSchema = z.object({
  id: z.number(),
  project_id: z.number(),
  image_url: z.string().url(),
  alt_text_en: z.string().nullable(),
  alt_text_fr: z.string().nullable(),
  display_order: z.number().int(),
  created_at: z.coerce.date()
});

export type ProjectImage = z.infer<typeof projectImageSchema>;

export const createProjectImageInputSchema = z.object({
  project_id: z.number(),
  image_url: z.string().url(),
  alt_text_en: z.string().nullable(),
  alt_text_fr: z.string().nullable(),
  display_order: z.number().int().default(0)
});

export type CreateProjectImageInput = z.infer<typeof createProjectImageInputSchema>;

// Case study schemas
export const caseStudySchema = z.object({
  id: z.number(),
  title_en: z.string(),
  title_fr: z.string(),
  description_en: z.string(),
  description_fr: z.string(),
  client_name_en: z.string(),
  client_name_fr: z.string(),
  challenge_description_en: z.string(),
  challenge_description_fr: z.string(),
  solution_description_en: z.string(),
  solution_description_fr: z.string(),
  results_description_en: z.string(),
  results_description_fr: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type CaseStudy = z.infer<typeof caseStudySchema>;

export const createCaseStudyInputSchema = z.object({
  title_en: z.string().min(1),
  title_fr: z.string().min(1),
  description_en: z.string().min(1),
  description_fr: z.string().min(1),
  client_name_en: z.string().min(1),
  client_name_fr: z.string().min(1),
  challenge_description_en: z.string().min(1),
  challenge_description_fr: z.string().min(1),
  solution_description_en: z.string().min(1),
  solution_description_fr: z.string().min(1),
  results_description_en: z.string().min(1),
  results_description_fr: z.string().min(1)
});

export type CreateCaseStudyInput = z.infer<typeof createCaseStudyInputSchema>;

export const updateCaseStudyInputSchema = z.object({
  id: z.number(),
  title_en: z.string().min(1).optional(),
  title_fr: z.string().min(1).optional(),
  description_en: z.string().min(1).optional(),
  description_fr: z.string().min(1).optional(),
  client_name_en: z.string().min(1).optional(),
  client_name_fr: z.string().min(1).optional(),
  challenge_description_en: z.string().min(1).optional(),
  challenge_description_fr: z.string().min(1).optional(),
  solution_description_en: z.string().min(1).optional(),
  solution_description_fr: z.string().min(1).optional(),
  results_description_en: z.string().min(1).optional(),
  results_description_fr: z.string().min(1).optional()
});

export type UpdateCaseStudyInput = z.infer<typeof updateCaseStudyInputSchema>;

// Case study image schemas
export const caseStudyImageSchema = z.object({
  id: z.number(),
  case_study_id: z.number(),
  image_url: z.string().url(),
  alt_text_en: z.string().nullable(),
  alt_text_fr: z.string().nullable(),
  display_order: z.number().int(),
  created_at: z.coerce.date()
});

export type CaseStudyImage = z.infer<typeof caseStudyImageSchema>;

export const createCaseStudyImageInputSchema = z.object({
  case_study_id: z.number(),
  image_url: z.string().url(),
  alt_text_en: z.string().nullable(),
  alt_text_fr: z.string().nullable(),
  display_order: z.number().int().default(0)
});

export type CreateCaseStudyImageInput = z.infer<typeof createCaseStudyImageInputSchema>;

// Contact form schemas
export const contactFormSubmissionSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
  created_at: z.coerce.date()
});

export type ContactFormSubmission = z.infer<typeof contactFormSubmissionSchema>;

export const createContactFormSubmissionInputSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1)
});

export type CreateContactFormSubmissionInput = z.infer<typeof createContactFormSubmissionInputSchema>;

// Contact details schemas
export const contactDetailsSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  working_hours_en: z.string(),
  working_hours_fr: z.string(),
  updated_at: z.coerce.date()
});

export type ContactDetails = z.infer<typeof contactDetailsSchema>;

export const updateContactDetailsInputSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  working_hours_en: z.string().optional(),
  working_hours_fr: z.string().optional()
});

export type UpdateContactDetailsInput = z.infer<typeof updateContactDetailsInputSchema>;

// Home page content schemas
export const homePageContentSchema = z.object({
  id: z.number(),
  hero_title_en: z.string(),
  hero_title_fr: z.string(),
  hero_subtitle_en: z.string(),
  hero_subtitle_fr: z.string(),
  about_section_en: z.string(),
  about_section_fr: z.string(),
  updated_at: z.coerce.date()
});

export type HomePageContent = z.infer<typeof homePageContentSchema>;

export const updateHomePageContentInputSchema = z.object({
  hero_title_en: z.string().min(1).optional(),
  hero_title_fr: z.string().min(1).optional(),
  hero_subtitle_en: z.string().min(1).optional(),
  hero_subtitle_fr: z.string().min(1).optional(),
  about_section_en: z.string().min(1).optional(),
  about_section_fr: z.string().min(1).optional()
});

export type UpdateHomePageContentInput = z.infer<typeof updateHomePageContentInputSchema>;

// Query filters
export const getProjectsFilterSchema = z.object({
  category: projectCategorySchema.optional(),
  limit: z.number().int().positive().optional(),
  offset: z.number().int().nonnegative().optional()
});

export type GetProjectsFilter = z.infer<typeof getProjectsFilterSchema>;

export const getCaseStudiesFilterSchema = z.object({
  limit: z.number().int().positive().optional(),
  offset: z.number().int().nonnegative().optional()
});

export type GetCaseStudiesFilter = z.infer<typeof getCaseStudiesFilterSchema>;

// ID parameter schemas
export const idParamSchema = z.object({
  id: z.number()
});

export type IdParam = z.infer<typeof idParamSchema>;
