import { useState, useEffect } from 'react';
import { 
  getDoctors, 
  getDoctor, 
  getDoctorCards,
  getFeaturedDoctors,
  getDoctorCard,
  getDoctorProfile,
  getFeaturedDoctorsSection,
  getArticles, 
  getArticle, 
  getSpecialties,
  getMedicalSpecialties,
  getHomePageContent,
  getHeaderContent,
  getGlobalSettings,
  getHeroSection,
  getFindDoctorsPageContent,
  getAboutUsPageContent,
  getFooterContent,
  getHealthAdviceSection,
  getHealthAdviceArticle
} from '../services/contentstack';
import { 
  DoctorCardCMS,
  FeaturedDoctorsSection, 
  MedicalSpecialtiesSection, 
  HeaderContent,
  HeroSection,
  FindDoctorsPageContent,
  AboutUsPageContent,
  VisionAndValues,
  OurTeam,
  HowItWorks,
  Button,
  FooterContent,
  HealthAdviceSection,
  HealthAdviceArticle
} from '../types';

// Generic hook for fetching content
export const useContentstack = <T>(
  fetchFunction: () => Promise<T>, 
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchFunction();
        setData(result);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error };
};

// Doctor Cards Hook with Fallback
export const useDoctorCardsWithFallback = () => {
  const { data: contentstackData, loading, error } = useContentstack<DoctorCardCMS[]>(
    getDoctorCards
  );

  // Fallback data (empty array for now, can be populated with sample data)
  const fallbackData: DoctorCardCMS[] = [];

  // Use Contentstack data if available, otherwise use fallback
  const data = contentstackData || fallbackData;
  
  return { data, loading, error };
};

// Find Doctors Page Content Hook with Fallback
export const useFindDoctorsPageContentWithFallback = () => {
  const { data: contentstackData, loading, error } = useContentstack<FindDoctorsPageContent>(
    getFindDoctorsPageContent
  );

  // Fallback data for find doctors page
  const fallbackData: FindDoctorsPageContent = {
    uid: 'find_doctors_fallback',
    page_title: 'Find Expert Doctors',
    page_subtitle: 'Connect with qualified healthcare professionals in your area',
    search_placeholder: 'Search by name, specialty, or location...',
    specialty_filter_label: 'Filter by Specialty',
    results_text: 'Showing {count} doctors',
    no_results_title: 'No doctors found',
    no_results_message: 'Try adjusting your search criteria or browse all available doctors.',
    load_more_button_text: 'Load More Doctors',
    created_at: '',
    updated_at: '',
    created_by: '',
    updated_by: '',
    locale: 'en-us',
    tags: []
  };

  // Use Contentstack data if available, otherwise use fallback
  const data = contentstackData || fallbackData;
  
  return { data, loading, error };
};

// Featured Doctors Section Hook with Fallback
export const useFeaturedDoctorsSectionWithFallback = () => {
  const { data: contentstackData, loading, error } = useContentstack<FeaturedDoctorsSection>(
    getFeaturedDoctorsSection
  );

  // Fallback data for featured doctors section
  const fallbackData: FeaturedDoctorsSection = {
    uid: 'featured_doctors_fallback',
    section_title: 'Featured Doctors',
    section_subtitle: 'Meet our experienced healthcare professionals',
    featured_doctors: [],
    created_at: '',
    updated_at: '',
    created_by: '',
    updated_by: '',
    locale: 'en-us',
    tags: []
  };

  // Use Contentstack data if available, otherwise use fallback
  const data = contentstackData || fallbackData;
  
  return { data, loading, error };
};

// Medical Specialties Hook with Fallback
export const useMedicalSpecialtiesWithFallback = () => {
  const { data: contentstackData, loading, error } = useContentstack<MedicalSpecialtiesSection>(
    getMedicalSpecialties
  );

  // Fallback data for medical specialties
  const fallbackData: MedicalSpecialtiesSection = {
    uid: 'medical_specialties_fallback',
    section_title: 'Medical Specialties',
    section_description: 'Find doctors by their area of expertise',
    specialties: [],
    created_at: '',
    updated_at: '',
    created_by: '',
    updated_by: '',
    locale: 'en-us',
    tags: []
  };

  // Use Contentstack data if available, otherwise use fallback
  const data = contentstackData || fallbackData;
  
  return { data, loading, error };
};

// Hero Section Hook with Fallback
export const useHeroSectionWithFallback = () => {
  const { data: contentstackData, loading, error } = useContentstack<HeroSection>(
    getHeroSection
  );

  // Fallback data for hero section
  const fallbackData: HeroSection = {
    uid: 'hero_fallback',
    title: 'Your Health, Our Priority',
    description: 'Connect with trusted healthcare professionals and manage your health journey with confidence.',
    created_at: '',
    updated_at: '',
    created_by: '',
    updated_by: '',
    locale: 'en-us',
    tags: []
  };

  // Use Contentstack data if available, otherwise use fallback
  const data = contentstackData || fallbackData;
  
  return { data, loading, error };
};

// Doctor Profile Hook
export const useDoctorProfile = (doctorUid: string) => {
  const { data, loading, error } = useContentstack<any>(
    () => getDoctorProfile(doctorUid),
    [doctorUid]
  );
  
  return { data, loading, error };
};

// About Us Page Content Hook with Fallback
export const useAboutUsPageContentWithFallback = () => {
  const { data: contentstackData, loading, error } = useContentstack<AboutUsPageContent>(
    getAboutUsPageContent
  );

  // Fallback data for about us page
  const fallbackData: AboutUsPageContent = {
    uid: 'about_us_fallback',
    banner_heading: 'Connecting Patients with Trusted Doctors',
    mission_title: 'Our Mission',
    mission_statment: 'At MediLink, our mission is to revolutionize healthcare accessibility by creating seamless connections between patients and medical professionals.',
    vision_values: {
      vision_value_title: 'Our Vision & Values',
      vision_and_values: []
    },
    our_team: {
      team_title: 'Our Team',
      team_description: 'Meet our experienced healthcare professionals',
      team_members: []
    },
    how_it_works: {
      how_it_works_title: 'How It Works',
      how_it_works_description: 'Your journey to better health in simple steps',
      how_it_works_steps: []
    },
    ready_to_connect: {
      ready_to_connect_title: 'Ready to Connect with Healthcare Professionals?',
      description: 'Have questions or need assistance? We\'re here to help you navigate your healthcare journey.',
      button_reference: []
    },
    created_at: '',
    updated_at: '',
    created_by: '',
    updated_by: '',
    locale: 'en-us',
    tags: []
  };

  // Use Contentstack data if available, otherwise use fallback
  const data = contentstackData || fallbackData;
  
  return { data, loading, error };
};

// Footer Content Hook with Fallback
export const useFooterContentWithFallback = () => {
  const { data: contentstackData, loading, error } = useContentstack<FooterContent>(
    getFooterContent
  );

  // Fallback data for footer
  const fallbackData: FooterContent = {
    uid: 'footer_fallback',
    title: 'MediLink',
    footer_banner: 'Connecting patients with healthcare professionals for better health outcomes.',
    footer_quick_links: {
      title: 'Quick Links',
      links: [
        {
          name: 'Home',
          _metadata: { uid: 'ql1' },
          link: { title: 'Home', href: '/' }
        },
        {
          name: 'Find Doctors',
          _metadata: { uid: 'ql2' },
          link: { title: 'Find Doctors', href: '/find-doctors' }
        },
        {
          name: 'Inquiries',
          _metadata: { uid: 'ql3' },
          link: { title: 'Inquiries', href: '/inquiries' }
        },
        {
          name: 'Health Advice',
          _metadata: { uid: 'ql4' },
          link: { title: 'Health Advice', href: '/health-advice' }
        },
        {
          name: 'About Us',
          _metadata: { uid: 'ql5' },
          link: { title: 'About Us', href: '/about' }
        }
      ]
    },
    support: {
      title: 'Support',
      support_links: [
        {
          name: 'Contact Us',
          _metadata: { uid: 'sl1' },
          link: { title: 'Contact Us', href: '/inquiries' }
        }
      ]
    },
    contact_info: {
      email: 'support@medilink.com',
      address: '123 Healthcare Ave, Medical District, NY 10001',
      contact_number: '+1 (555) 123-4567'
    },
    copyright: {
      type: 'doc',
      attrs: {},
      uid: 'copyright_fallback',
      children: [
        {
          type: 'p',
          attrs: {},
          uid: 'p1',
          children: [
            { text: '© 2025 MediLink. All rights reserved.' }
          ]
        }
      ],
      _version: 1
    },
    created_at: '',
    updated_at: '',
    created_by: '',
    updated_by: '',
    locale: 'en-us',
    tags: []
  };

  // Use Contentstack data if available, otherwise use fallback
  const data = contentstackData || fallbackData;
  
  return { data, loading, error };
};

// Health Advice Section Hook with Fallback
export const useHealthAdviceSectionWithFallback = () => {
  const { data: contentstackData, loading, error } = useContentstack<HealthAdviceSection>(
    getHealthAdviceSection
  );

  // Fallback data for health advice section
  const fallbackData: HealthAdviceSection = {
    uid: 'health_advice_fallback',
    title: 'Health Advice',
    sub_header: 'Stay informed with expert health articles, tips, and guidance from our medical professionals',
    health_advices: [],
    cta_buttons: [],
    created_at: '',
    updated_at: '',
    created_by: '',
    updated_by: '',
    locale: 'en-us',
    tags: []
  };

  // Use Contentstack data if available, otherwise use fallback
  const data = contentstackData || fallbackData;
  
  return { data, loading, error };
};

// Health Advice Article Hook
export const useHealthAdviceArticle = (articleUid: string) => {
  const { data, loading, error } = useContentstack<HealthAdviceArticle>(
    () => getHealthAdviceArticle(articleUid),
    [articleUid]
  );
  
  return { data, loading, error };
};

// Header Content Hook with Fallback
export const useHeaderContentWithFallback = () => {
  const { data: contentstackData, loading, error } = useContentstack<HeaderContent>(
    getHeaderContent
  );

  // Fallback data for header
  const fallbackData: HeaderContent = {
    uid: 'header_fallback',
    title: 'MediLink',
    navigation_menu: [
      {
        label: 'Home',
        _metadata: { uid: 'nav1' },
        link: { title: 'Home', href: '/' }
      },
      {
        label: 'Find Doctors',
        _metadata: { uid: 'nav2' },
        link: { title: 'Find Doctors', href: '/find-doctors' }
      },
      {
        label: 'Inquiries',
        _metadata: { uid: 'nav3' },
        link: { title: 'Inquiries', href: '/inquiries' }
      },
      {
        label: 'Health Advice',
        _metadata: { uid: 'nav4' },
        link: { title: 'Health Advice', href: '/health-advice' }
      },
      {
        label: 'About Us',
        _metadata: { uid: 'nav5' },
        link: { title: 'About Us', href: '/about' }
      }
    ],
    created_at: '',
    updated_at: '',
    created_by: '',
    updated_by: '',
    locale: 'en-us',
    tags: []
  };

  // Use Contentstack data if available, otherwise use fallback
  const data = contentstackData || fallbackData;
  
  return { data, loading, error };
};

// Helper function to get navigation URL based on label
export const getNavigationUrl = (label: string): string => {
  const urlMapping: { [key: string]: string } = {
    'Home': '/',
    'Find Doctors': '/find-doctors',
    'Inquiries': '/inquiries',
    'Inquires': '/inquiries', // Handle typo in CMS
    'Health Advice': '/health-advice',
    'About Us': '/about'
  };
  
  return urlMapping[label] || '/';
};
