
import { serial, text, pgTable, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const projectCategoryEnum = pgEnum('project_category', ['graphic_design', 'digital_printing', 'packaging', 'other']);

// Services table
export const servicesTable = pgTable('services', {
  id: serial('id').primaryKey(),
  title_en: text('title_en').notNull(),
  title_fr: text('title_fr').notNull(),
  description_en: text('description_en').notNull(),
  description_fr: text('description_fr').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Projects table
export const projectsTable = pgTable('projects', {
  id: serial('id').primaryKey(),
  title_en: text('title_en').notNull(),
  title_fr: text('title_fr').notNull(),
  description_en: text('description_en').notNull(),
  description_fr: text('description_fr').notNull(),
  category: projectCategoryEnum('category').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Project images table
export const projectImagesTable = pgTable('project_images', {
  id: serial('id').primaryKey(),
  project_id: integer('project_id').notNull().references(() => projectsTable.id, { onDelete: 'cascade' }),
  image_url: text('image_url').notNull(),
  alt_text_en: text('alt_text_en'),
  alt_text_fr: text('alt_text_fr'),
  display_order: integer('display_order').notNull().default(0),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Case studies table
export const caseStudiesTable = pgTable('case_studies', {
  id: serial('id').primaryKey(),
  title_en: text('title_en').notNull(),
  title_fr: text('title_fr').notNull(),
  description_en: text('description_en').notNull(),
  description_fr: text('description_fr').notNull(),
  client_name_en: text('client_name_en').notNull(),
  client_name_fr: text('client_name_fr').notNull(),
  challenge_description_en: text('challenge_description_en').notNull(),
  challenge_description_fr: text('challenge_description_fr').notNull(),
  solution_description_en: text('solution_description_en').notNull(),
  solution_description_fr: text('solution_description_fr').notNull(),
  results_description_en: text('results_description_en').notNull(),
  results_description_fr: text('results_description_fr').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Case study images table
export const caseStudyImagesTable = pgTable('case_study_images', {
  id: serial('id').primaryKey(),
  case_study_id: integer('case_study_id').notNull().references(() => caseStudiesTable.id, { onDelete: 'cascade' }),
  image_url: text('image_url').notNull(),
  alt_text_en: text('alt_text_en'),
  alt_text_fr: text('alt_text_fr'),
  display_order: integer('display_order').notNull().default(0),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Contact form submissions table
export const contactFormSubmissionsTable = pgTable('contact_form_submissions', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  message: text('message').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Contact details table
export const contactDetailsTable = pgTable('contact_details', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  address: text('address').notNull(),
  working_hours_en: text('working_hours_en').notNull(),
  working_hours_fr: text('working_hours_fr').notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Home page content table
export const homePageContentTable = pgTable('home_page_content', {
  id: serial('id').primaryKey(),
  hero_title_en: text('hero_title_en').notNull(),
  hero_title_fr: text('hero_title_fr').notNull(),
  hero_subtitle_en: text('hero_subtitle_en').notNull(),
  hero_subtitle_fr: text('hero_subtitle_fr').notNull(),
  about_section_en: text('about_section_en').notNull(),
  about_section_fr: text('about_section_fr').notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Relations
export const projectsRelations = relations(projectsTable, ({ many }) => ({
  images: many(projectImagesTable)
}));

export const projectImagesRelations = relations(projectImagesTable, ({ one }) => ({
  project: one(projectsTable, {
    fields: [projectImagesTable.project_id],
    references: [projectsTable.id]
  })
}));

export const caseStudiesRelations = relations(caseStudiesTable, ({ many }) => ({
  images: many(caseStudyImagesTable)
}));

export const caseStudyImagesRelations = relations(caseStudyImagesTable, ({ one }) => ({
  caseStudy: one(caseStudiesTable, {
    fields: [caseStudyImagesTable.case_study_id],
    references: [caseStudiesTable.id]
  })
}));

// Export all tables for relation queries
export const tables = {
  services: servicesTable,
  projects: projectsTable,
  projectImages: projectImagesTable,
  caseStudies: caseStudiesTable,
  caseStudyImages: caseStudyImagesTable,
  contactFormSubmissions: contactFormSubmissionsTable,
  contactDetails: contactDetailsTable,
  homePageContent: homePageContentTable
};
