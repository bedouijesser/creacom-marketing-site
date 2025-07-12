
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { trpc } from '@/utils/trpc';
import { Globe, Phone, Mail, MapPin, Clock, Instagram, Facebook, MessageSquare } from 'lucide-react';
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
      const [servicesData, projectsData, caseStudiesData, homeContentData] = await Promise.all([
        trpc.getServices.query(),
        trpc.getProjects.query(),
        trpc.getCaseStudies.query(),
        trpc.getHomePageContent.query()
      ]);

      setServices(servicesData);
      setProjects(projectsData);
      setCaseStudies(caseStudiesData);
      setHomePageContent(homeContentData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }

    // Load contact details separately with error handling
    try {
      const contactDetailsData = await trpc.getContactDetails.query();
      setContactDetails(contactDetailsData);
    } catch (error) {
      console.error('Failed to load contact details:', error);
      setContactDetails(null);
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
      <header className="bg-white shadow-md border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Crea'com</h1>
                <p className="text-sm text-gray-500">
                  {currentLanguage === 'en' ? 'Graphic Design & Printing' : 'Conception graphique & impression'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentLanguage('en')}
                className={`flex items-center space-x-1 text-gray-700 hover:text-gray-900 ${
                  currentLanguage === 'en' ? 'font-semibold text-blue-600' : ''
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>EN</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentLanguage('fr')}
                className={`flex items-center space-x-1 text-gray-700 hover:text-gray-900 ${
                  currentLanguage === 'fr' ? 'font-semibold text-blue-600' : ''
                }`}
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
      <footer className="bg-slate-900 text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
            {/* Brand Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="text-lg font-bold">Crea'com</span>
              </div>
              <p className="text-gray-400">
                {currentLanguage === 'en' 
                  ? '© 2024 Crea\'com. All rights reserved.' 
                  : '© 2024 Crea\'com. Tous droits réservés.'}
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {currentLanguage === 'en' ? 'Contact' : 'Contact'}
              </h3>
              {contactDetails && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{contactDetails.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{contactDetails.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{contactDetails.address}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">
                      {getLocalizedText(contactDetails.working_hours_en, contactDetails.working_hours_fr)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Social Media */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {currentLanguage === 'en' ? 'Follow Us' : 'Suivez-nous'}
              </h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <MessageSquare className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
