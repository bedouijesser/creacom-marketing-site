
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

// Schema imports
import {
  createServiceInputSchema,
  updateServiceInputSchema,
  idParamSchema,
  createProjectInputSchema,
  updateProjectInputSchema,
  getProjectsFilterSchema,
  createProjectImageInputSchema,
  createCaseStudyInputSchema,
  updateCaseStudyInputSchema,
  getCaseStudiesFilterSchema,
  createCaseStudyImageInputSchema,
  createContactFormSubmissionInputSchema,
  updateContactDetailsInputSchema,
  updateHomePageContentInputSchema
} from './schema';

// Handler imports
import { createService } from './handlers/create_service';
import { getServices } from './handlers/get_services';
import { getService } from './handlers/get_service';
import { updateService } from './handlers/update_service';
import { deleteService } from './handlers/delete_service';
import { createProject } from './handlers/create_project';
import { getProjects } from './handlers/get_projects';
import { getProject } from './handlers/get_project';
import { updateProject } from './handlers/update_project';
import { deleteProject } from './handlers/delete_project';
import { createProjectImage } from './handlers/create_project_image';
import { getProjectImages } from './handlers/get_project_images';
import { deleteProjectImage } from './handlers/delete_project_image';
import { createCaseStudy } from './handlers/create_case_study';
import { getCaseStudies } from './handlers/get_case_studies';
import { getCaseStudy } from './handlers/get_case_study';
import { updateCaseStudy } from './handlers/update_case_study';
import { deleteCaseStudy } from './handlers/delete_case_study';
import { createCaseStudyImage } from './handlers/create_case_study_image';
import { getCaseStudyImages } from './handlers/get_case_study_images';
import { deleteCaseStudyImage } from './handlers/delete_case_study_image';
import { createContactFormSubmission } from './handlers/create_contact_form_submission';
import { getContactFormSubmissions } from './handlers/get_contact_form_submissions';
import { getContactDetails } from './handlers/get_contact_details';
import { updateContactDetails } from './handlers/update_contact_details';
import { getHomePageContent } from './handlers/get_home_page_content';
import { updateHomePageContent } from './handlers/update_home_page_content';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Services
  createService: publicProcedure
    .input(createServiceInputSchema)
    .mutation(({ input }) => createService(input)),
  getServices: publicProcedure
    .query(() => getServices()),
  getService: publicProcedure
    .input(idParamSchema)
    .query(({ input }) => getService(input.id)),
  updateService: publicProcedure
    .input(updateServiceInputSchema)
    .mutation(({ input }) => updateService(input)),
  deleteService: publicProcedure
    .input(idParamSchema)
    .mutation(({ input }) => deleteService(input.id)),

  // Projects
  createProject: publicProcedure
    .input(createProjectInputSchema)
    .mutation(({ input }) => createProject(input)),
  getProjects: publicProcedure
    .input(getProjectsFilterSchema.optional())
    .query(({ input }) => getProjects(input)),
  getProject: publicProcedure
    .input(idParamSchema)
    .query(({ input }) => getProject(input.id)),
  updateProject: publicProcedure
    .input(updateProjectInputSchema)
    .mutation(({ input }) => updateProject(input)),
  deleteProject: publicProcedure
    .input(idParamSchema)
    .mutation(({ input }) => deleteProject(input.id)),

  // Project Images
  createProjectImage: publicProcedure
    .input(createProjectImageInputSchema)
    .mutation(({ input }) => createProjectImage(input)),
  getProjectImages: publicProcedure
    .input(idParamSchema)
    .query(({ input }) => getProjectImages(input.id)),
  deleteProjectImage: publicProcedure
    .input(idParamSchema)
    .mutation(({ input }) => deleteProjectImage(input.id)),

  // Case Studies
  createCaseStudy: publicProcedure
    .input(createCaseStudyInputSchema)
    .mutation(({ input }) => createCaseStudy(input)),
  getCaseStudies: publicProcedure
    .input(getCaseStudiesFilterSchema.optional())
    .query(({ input }) => getCaseStudies(input)),
  getCaseStudy: publicProcedure
    .input(idParamSchema)
    .query(({ input }) => getCaseStudy(input.id)),
  updateCaseStudy: publicProcedure
    .input(updateCaseStudyInputSchema)
    .mutation(({ input }) => updateCaseStudy(input)),
  deleteCaseStudy: publicProcedure
    .input(idParamSchema)
    .mutation(({ input }) => deleteCaseStudy(input.id)),

  // Case Study Images
  createCaseStudyImage: publicProcedure
    .input(createCaseStudyImageInputSchema)
    .mutation(({ input }) => createCaseStudyImage(input)),
  getCaseStudyImages: publicProcedure
    .input(idParamSchema)
    .query(({ input }) => getCaseStudyImages(input.id)),
  deleteCaseStudyImage: publicProcedure
    .input(idParamSchema)
    .mutation(({ input }) => deleteCaseStudyImage(input.id)),

  // Contact Form
  createContactFormSubmission: publicProcedure
    .input(createContactFormSubmissionInputSchema)
    .mutation(({ input }) => createContactFormSubmission(input)),
  getContactFormSubmissions: publicProcedure
    .query(() => getContactFormSubmissions()),

  // Contact Details
  getContactDetails: publicProcedure
    .query(() => getContactDetails()),
  updateContactDetails: publicProcedure
    .input(updateContactDetailsInputSchema)
    .mutation(({ input }) => updateContactDetails(input)),

  // Home Page Content
  getHomePageContent: publicProcedure
    .query(() => getHomePageContent()),
  updateHomePageContent: publicProcedure
    .input(updateHomePageContentInputSchema)
    .mutation(({ input }) => updateHomePageContent(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
