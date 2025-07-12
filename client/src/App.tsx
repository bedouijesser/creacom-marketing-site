
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { trpc } from '@/utils/trpc';
import { Globe, Phone, Mail, MapPin, Clock, AlertCircle } from 'lucide-react';
import type { 
  Service, 
  Project, 
  CaseStudy, 
  CreateContactFormSubmissionInput,
  ContactDetails,
  HomePageContent,
  Language,
  ProjectCategory 
} from '../../server/src/schema';

function App() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState('home');
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [contactDetails, setContactDetails] = useState<ContactDetails | null>(null);
  const [homePageContent, setHomePageContent] = useState<HomePageContent | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'all'>('all');
  const [isContactFormLoading, setIsContactFormLoading] = useState(false);
  const [contactFormData, setContactFormData] = useState<CreateContactFormSubmissionInput>({
    name: '',
    email: '',
    message: ''
  });

  // Load all data on component mount
  const loadAllData = useCallback(async () => {
    try {
      // Note: Using stub data as backend handlers are placeholders
      const [servicesData, projectsData, caseStudiesData, contactDetailsData, homeContentData] = await Promise.all([
        trpc.getServices.query(),
        trpc.getProjects.query(),
        trpc.getCaseStudies.query(),
        trpc.getContactDetails.query(),
        trpc.getHomePageContent.query()
      ]);

      // Since backend returns empty arrays/null, using stub data for demonstration
      setServices(servicesData.length > 0 ? servicesData : STUB_SERVICES);
      setProjects(projectsData.length > 0 ? projectsData : STUB_PROJECTS);
      setCaseStudies(caseStudiesData.length > 0 ? caseStudiesData : STUB_CASE_STUDIES);
      setContactDetails(contactDetailsData || STUB_CONTACT_DETAILS);
      setHomePageContent(homeContentData || STUB_HOME_CONTENT);
    } catch (error) {
      console.error('Failed to load data:', error);
      // Fallback to stub data on error
      setServices(STUB_SERVICES);
      setProjects(STUB_PROJECTS);
      setCaseStudies(STUB_CASE_STUDIES);
      setContactDetails(STUB_CONTACT_DETAILS);
      setHomePageContent(STUB_HOME_CONTENT);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleContactFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsContactFormLoading(true);
    try {
      await trpc.createContactFormSubmission.mutate(contactFormData);
      setContactFormData({ name: '', email: '', message: '' });
      alert(currentLanguage === 'en' ? 'Message sent successfully!' : 'Message envoyé avec succès!');
    } catch (error) {
      console.error('Failed to send message:', error);
      alert(currentLanguage === 'en' ? 'Failed to send message.' : 'Échec de l\'envoi du message.');
    } finally {
      setIsContactFormLoading(false);
    }
  };

  const getLocalizedText = (textEn: string, textFr: string) => {
    return currentLanguage === 'en' ? textEn : textFr;
  };

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter((project: Project) => project.category === selectedCategory);

  const categoryOptions = [
    { value: 'all', label: currentLanguage === 'en' ? 'All Categories' : 'Toutes les catégories' },
    { value: 'graphic_design', label: currentLanguage === 'en' ? 'Graphic Design' : 'Conception graphique' },
    { value: 'digital_printing', label: currentLanguage === 'en' ? 'Digital Printing' : 'Impression numérique' },
    { value: 'packaging', label: currentLanguage === 'en' ? 'Packaging' : 'Emballage' },
    { value: 'other', label: currentLanguage === 'en' ? 'Other' : 'Autre' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Crea'com</h1>
                <p className="text-sm text-gray-600">
                  {currentLanguage === 'en' ? 'Graphic Design & Printing' : 'Conception graphique & impression'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant={currentLanguage === 'en' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentLanguage('en')}
                className="flex items-center space-x-1"
              >
                <Globe className="w-4 h-4" />
                <span>EN</span>
              </Button>
              <Button
                variant={currentLanguage === 'fr' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentLanguage('fr')}
                className="flex items-center space-x-1"
              >
                <Globe className="w-4 h-4" />
                <span>FR</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="home">
                {currentLanguage === 'en' ? 'Home' : 'Accueil'}
              </TabsTrigger>
              <TabsTrigger value="services">
                {currentLanguage === 'en' ? 'Services' : 'Services'}
              </TabsTrigger>
              <TabsTrigger value="projects">
                {currentLanguage === 'en' ? 'Projects' : 'Projets'}
              </TabsTrigger>
              <TabsTrigger value="case-studies">
                {currentLanguage === 'en' ? 'Case Studies' : 'Études de cas'}
              </TabsTrigger>
              <TabsTrigger value="contact">
                {currentLanguage === 'en' ? 'Contact' : 'Contact'}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </nav>

      {/* Stub Data Notice */}
      <div className="container mx-auto px-4 py-2">
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {currentLanguage === 'en' 
              ? 'Note: Currently displaying demo data as backend handlers are placeholders.' 
              : 'Note: Affichage de données de démonstration car les gestionnaires backend sont des espaces réservés.'}
          </AlertDescription>
        </Alert>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Home Page */}
          <TabsContent value="home" className="space-y-8">
            {homePageContent && (
              <div className="text-center space-y-6">
                <div className="space-y-4">
                  <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                    {getLocalizedText(homePageContent.hero_title_en, homePageContent.hero_title_fr)}
                  </h1>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    {getLocalizedText(homePageContent.hero_subtitle_en, homePageContent.hero_subtitle_fr)}
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-8 shadow-lg">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    {currentLanguage === 'en' ? 'About Us' : 'À propos de nous'}
                  </h2>
                  <p className="text-gray-700 leading-relaxed max-w-4xl mx-auto">
                    {getLocalizedText(homePageContent.about_section_en, homePageContent.about_section_fr)}
                  </p>
                </div>
              </div>
            )}

            {/* Featured Services */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 text-center">
                {currentLanguage === 'en' ? 'Our Services' : 'Nos services'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.slice(0, 3).map((service: Service) => (
                  <Card key={service.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {getLocalizedText(service.title_en, service.title_fr)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        {getLocalizedText(service.description_en, service.description_fr)}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Featured Projects */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 text-center">
                {currentLanguage === 'en' ? 'Featured Projects' : 'Projets en vedette'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.slice(0, 3).map((project: Project) => (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">
                          {getLocalizedText(project.title_en, project.title_fr)}
                        </CardTitle>
                        <Badge variant="secondary">
                          {project.category.replace('_', ' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        {getLocalizedText(project.description_en, project.description_fr)}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Services Page */}
          <TabsContent value="services" className="space-y-6">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-gray-900">
                {currentLanguage === 'en' ? 'Our Services' : 'Nos services'}
              </h1>
              <p className="text-xl text-gray-600">
                {currentLanguage === 'en' 
                  ? 'Professional graphic design and printing solutions for your business' 
                  : 'Solutions professionnelles de conception graphique et d\'impression pour votre entreprise'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service: Service) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl">
                      {getLocalizedText(service.title_en, service.title_fr)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {getLocalizedText(service.description_en, service.description_fr)}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Projects Page */}
          <TabsContent value="projects" className="space-y-6">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-gray-900">
                {currentLanguage === 'en' ? 'Our Projects' : 'Nos projets'}
              </h1>
              <p className="text-xl text-gray-600">
                {currentLanguage === 'en' 
                  ? 'Explore our portfolio of creative solutions' 
                  : 'Explorez notre portfolio de solutions créatives'}
              </p>
            </div>

            <div className="flex justify-center mb-8">
              <Select value={selectedCategory} onValueChange={(value: ProjectCategory | 'all') => setSelectedCategory(value)}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder={currentLanguage === 'en' ? 'Select category' : 'Sélectionner une catégorie'} />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project: Project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">
                        {getLocalizedText(project.title_en, project.title_fr)}
                      </CardTitle>
                      <Badge variant="secondary">
                        {project.category.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      {getLocalizedText(project.description_en, project.description_fr)}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Case Studies Page */}
          <TabsContent value="case-studies" className="space-y-6">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-gray-900">
                {currentLanguage === 'en' ? 'Case Studies' : 'Études de cas'}
              </h1>
              <p className="text-xl text-gray-600">
                {currentLanguage === 'en' 
                  ? 'Success stories from our satisfied clients' 
                  : 'Histoires de succès de nos clients satisfaits'}
              </p>
            </div>

            <div className="space-y-8">
              {caseStudies.map((caseStudy: CaseStudy) => (
                <Card key={caseStudy.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      {getLocalizedText(caseStudy.title_en, caseStudy.title_fr)}
                    </CardTitle>
                    <CardDescription className="text-lg">
                      {currentLanguage === 'en' ? 'Client: ' : 'Client: '}
                      {getLocalizedText(caseStudy.client_name_en, caseStudy.client_name_fr)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-gray-700">
                      {getLocalizedText(caseStudy.description_en, caseStudy.description_fr)}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h3 className="font-semibold text-lg mb-2 text-red-600">
                          {currentLanguage === 'en' ? 'Challenge' : 'Défi'}
                        </h3>
                        <p className="text-gray-600">
                          {getLocalizedText(caseStudy.challenge_description_en, caseStudy.challenge_description_fr)}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-lg mb-2 text-blue-600">
                          {currentLanguage === 'en' ? 'Solution' : 'Solution'}
                        </h3>
                        <p className="text-gray-600">
                          {getLocalizedText(caseStudy.solution_description_en, caseStudy.solution_description_fr)}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-lg mb-2 text-green-600">
                          {currentLanguage === 'en' ? 'Results' : 'Résultats'}
                        </h3>
                        <p className="text-gray-600">
                          {getLocalizedText(caseStudy.results_description_en, caseStudy.results_description_fr)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Contact Page */}
          <TabsContent value="contact" className="space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-gray-900">
                {currentLanguage === 'en' ? 'Contact Us' : 'Contactez-nous'}
              </h1>
              <p className="text-xl text-gray-600">
                {currentLanguage === 'en' 
                  ? 'Get in touch for your next project' 
                  : 'Contactez-nous pour votre prochain projet'}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {currentLanguage === 'en' ? 'Send us a message' : 'Envoyez-nous un message'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactFormSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">
                        {currentLanguage === 'en' ? 'Name' : 'Nom'}
                      </Label>
                      <Input
                        id="name"
                        value={contactFormData.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setContactFormData((prev: CreateContactFormSubmissionInput) => ({ ...prev, name: e.target.value }))
                        }
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">
                        {currentLanguage === 'en' ? 'Email' : 'Email'}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={contactFormData.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setContactFormData((prev: CreateContactFormSubmissionInput) => ({ ...prev, email: e.target.value }))
                        }
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="message">
                        {currentLanguage === 'en' ? 'Message' : 'Message'}
                      </Label>
                      <Textarea
                        id="message"
                        value={contactFormData.message}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          setContactFormData((prev: CreateContactFormSubmissionInput) => ({ ...prev, message: e.target.value }))
                        }
                        rows={5}
                        required
                      />
                    </div>
                    
                    <Button type="submit" disabled={isContactFormLoading} className="w-full">
                      {isContactFormLoading 
                        ? (currentLanguage === 'en' ? 'Sending...' : 'Envoi en cours...') 
                        : (currentLanguage === 'en' ? 'Send Message' : 'Envoyer le message')}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Details */}
              {contactDetails && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {currentLanguage === 'en' ? 'Contact Information' : 'Informations de contact'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-600" />
                      <span>{contactDetails.email}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-600" />
                      <span>{contactDetails.phone}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-gray-600" />
                      <span>{contactDetails.address}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-600" />
                      <span>{getLocalizedText(contactDetails.working_hours_en, contactDetails.working_hours_fr)}</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <span className="text-xl font-bold">Crea'com</span>
            </div>
            <p className="text-gray-400">
              {currentLanguage === 'en' 
                ? '© 2024 Crea\'com. All rights reserved.' 
                : '© 2024 Crea\'com. Tous droits réservés.'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// STUB DATA - Used because backend handlers are placeholders
const STUB_SERVICES: Service[] = [
  {
    id: 1,
    title_en: "Brand Identity Design",
    title_fr: "Conception d'identité de marque",
    description_en: "Complete brand identity packages including logos, color schemes, typography, and brand guidelines to establish your unique market presence.",
    description_fr: "Packages d'identité de marque complets comprenant logos, schémas de couleurs, typographie et directives de marque pour établir votre présence unique sur le marché.",
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 2,
    title_en: "Digital Printing Services",
    title_fr: "Services d'impression numérique",
    description_en: "High-quality digital printing for business cards, brochures, posters, and marketing materials with fast turnaround times.",
    description_fr: "Impression numérique de haute qualité pour cartes de visite, brochures, affiches et matériel marketing avec des délais de livraison rapides.",
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 3,
    title_en: "Package Design",
    title_fr: "Conception d'emballage",
    description_en: "Creative packaging solutions that protect your products while creating memorable unboxing experiences for customers.",
    description_fr: "Solutions d'emballage créatives qui protègent vos produits tout en créant des expériences de déballage mémorables pour les clients.",
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 4,
    title_en: "Web Graphics & UI Design",
    title_fr: "Graphismes web et conception UI",
    description_en: "Custom web graphics, user interface elements, and digital assets optimized for online platforms and social media.",
    description_fr: "Graphismes web personnalisés, éléments d'interface utilisateur et ressources numériques optimisés pour les plateformes en ligne et les médias sociaux.",
    created_at: new Date(),
    updated_at: new Date()
  }
];

const STUB_PROJECTS: Project[] = [
  {
    id: 1,
    title_en: "Artisan Bakery Rebranding",
    title_fr: "Rebranding d'une boulangerie artisanale",
    description_en: "Complete visual identity redesign for a local artisan bakery, including new logo, packaging, and storefront signage.",
    description_fr: "Refonte complète de l'identité visuelle d'une boulangerie artisanale locale, incluant nouveau logo, emballage et signalétique de magasin.",
    category: 'graphic_design',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 2,
    title_en: "Corporate Annual Report",
    title_fr: "Rapport annuel d'entreprise",
    description_en: "Design and print production of a 64-page annual report with custom infographics and professional layout.",
    description_fr: "Conception et production d'impression d'un rapport annuel de 64 pages avec infographies personnalisées et mise en page professionnelle.",
    category: 'digital_printing',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 3,
    title_en: "Eco-Friendly Product Line",
    title_fr: "Gamme de produits écologiques",
    description_en: "Sustainable packaging design for a new line of eco-friendly household products with biodegradable materials.",
    description_fr: "Conception d'emballage durable pour une nouvelle gamme de produits ménagers écologiques avec des matériaux biodégradables.",
    category: 'packaging',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 4,
    title_en: "Tech Startup Marketing Kit",
    title_fr: "Kit marketing pour startup tech",
    description_en: "Complete marketing collateral including business cards, presentation templates, and booth graphics for trade shows.",
    description_fr: "Matériel marketing complet incluant cartes de visite, modèles de présentation et graphismes de stand pour salons professionnels.",
    category: 'graphic_design',
    created_at: new Date(),
    updated_at: new Date()
  }
];

const STUB_CASE_STUDIES: CaseStudy[] = [
  {
    id: 1,
    title_en: "Organic Farm Brand Transformation",
    title_fr: "Transformation de marque d'une ferme biologique",
    description_en: "A comprehensive rebranding project that increased customer engagement and sales.",
    description_fr: "Un projet de rebranding complet qui a augmenté l'engagement client et les ventes.",
    client_name_en: "Green Valley Organic Farm",
    client_name_fr: "Ferme biologique Green Valley",
    challenge_description_en: "The client needed to modernize their brand to appeal to younger demographics while maintaining their heritage and trust with existing customers.",
    challenge_description_fr: "Le client devait moderniser sa marque pour séduire les jeunes générations tout en préservant son héritage et la confiance de ses clients existants.",
    solution_description_en: "We created a fresh, modern identity that honored their 50-year history while appealing to health-conscious millennials through vibrant colors and contemporary typography.",
    solution_description_fr: "Nous avons créé une identité fraîche et moderne qui honorait leurs 50 ans d'histoire tout en séduisant les millennials soucieux de leur santé grâce à des couleurs vives et une typographie contemporaine.",
    results_description_en: "40% increase in social media engagement, 25% boost in direct sales, and successful expansion into 3 new markets within 6 months.",
    results_description_fr: "Augmentation de 40% de l'engagement sur les médias sociaux, hausse de 25% des ventes directes et expansion réussie sur 3 nouveaux marchés en 6 mois.",
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 2,
    title_en: "Restaurant Chain Menu Redesign",
    title_fr: "Refonte de menu pour chaîne de restaurants",
    description_en: "Strategic menu design that improved customer experience and increased average order value.",
    description_fr: "Conception stratégique de menu qui a amélioré l'expérience client et augmenté la valeur moyenne des commandes.",
    client_name_en: "Bistro Express",
    client_name_fr: "Bistro Express",
    challenge_description_en: "The restaurant chain had outdated menus that were difficult to read and didn't effectively highlight their premium offerings.",
    challenge_description_fr: "La chaîne de restaurants avait des menus obsolètes difficiles à lire et qui ne mettaient pas efficacement en valeur leurs offres premium.",
    solution_description_en: "We redesigned the menu layout using visual hierarchy, appetizing photography, and strategic placement of high-margin items.",
    solution_description_fr: "Nous avons repensé la mise en page du menu en utilisant une hiérarchie visuelle, une photographie appétissante et un placement stratégique des articles à forte marge.",
    results_description_en: "18% increase in average order value, 30% improvement in customer satisfaction scores, and reduced ordering time by 15%.",
    results_description_fr: "Augmentation de 18% de la valeur moyenne des commandes, amélioration de 30% des scores de satisfaction client et réduction du temps de commande de 15%.",
    created_at: new Date(),
    updated_at: new Date()
  }
];

const STUB_CONTACT_DETAILS: ContactDetails = {
  id: 1,
  email: "contact@creacom.ca",
  phone: "+1 (514) 555-0123",
  address: "123 Rue Saint-Denis, Montréal, QC H2X 3K8",
  working_hours_en: "Monday to Friday: 9:00 AM - 6:00 PM",
  working_hours_fr: "Lundi au vendredi : 9h00 - 18h00",
  updated_at: new Date()
};

const STUB_HOME_CONTENT: HomePageContent = {
  id: 1,
  hero_title_en: "Creative Solutions for Your Brand",
  hero_title_fr: "Solutions créatives pour votre marque",
  hero_subtitle_en: "Professional graphic design and printing services that bring your vision to life with exceptional quality and creativity.",
  hero_subtitle_fr: "Services professionnels de conception graphique et d'impression qui donnent vie à votre vision avec une qualité et une créativité exceptionnelles.",
  about_section_en: "At Crea'com, we are passionate about transforming ideas into compelling visual experiences. With over 15 years of expertise in graphic design and printing, we help businesses of all sizes establish their unique identity and communicate effectively with their target audience. Our team combines creative excellence with technical precision to deliver outstanding results that exceed expectations.",
  about_section_fr: "Chez Crea'com, nous sommes passionnés par la transformation d'idées en expériences visuelles convaincantes. Avec plus de 15 ans d'expertise en conception graphique et impression, nous aidons les entreprises de toutes tailles à établir leur identité unique et à communiquer efficacement avec leur public cible. Notre équipe combine l'excellence créative avec la précision technique pour offrir des résultats exceptionnels qui dépassent les attentes.",
  updated_at: new Date()
};

export default App;
