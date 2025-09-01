import React, { useState, useEffect } from 'react';
import { 
  getDoctorCards,
  getDoctorProfile,
  getMedicalSpecialties,
  getHeaderContent,
  getHeroSection,
  getFindDoctorsPageContent,
  getAboutUsPageContent,
  getFooterContent,
  getHealthAdviceSection,
  getHealthAdviceArticle,
  getLatestMedicalAdvice,
  getDoctorsRecommendation,
  getPatientInquiriesPageContent,
  getFeaturedDoctorsSection
} from '../services/contentstack';
import { 
  MedicalSpecialtiesSection, 
  HeaderContent,
  HeroSection,
  FindDoctorsPageContent,
  AboutUsPageContent,
  FooterContent,
  HealthAdviceSection,
  HealthAdviceArticle,
  PatientInquiriesPageContent,
  FeaturedDoctorsSection,
  NormalizedFeaturedDoctorsSection
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
        // Error fetching data
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error };
};



// Find Doctors Page Content Hook
export const useFindDoctorsPageContent = () => {
  const { data, loading, error } = useContentstack<FindDoctorsPageContent>(
    getFindDoctorsPageContent
  );
  
  return { data, loading, error };
};

// Medical Specialties Hook
export const useMedicalSpecialties = () => {
  const { data, loading, error } = useContentstack<MedicalSpecialtiesSection>(
    getMedicalSpecialties
  );
  
  return { data, loading, error };
};

// Hero Section Hook
export const useHeroSection = () => {
  const { data, loading, error } = useContentstack<HeroSection>(
    getHeroSection
  );
  
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

// About Us Page Content Hook
export const useAboutUsPageContent = () => {
  const { data, loading, error } = useContentstack<AboutUsPageContent>(
    getAboutUsPageContent
  );
  
  return { data, loading, error };
};

// Footer Content Hook
export const useFooterContent = () => {
  const { data, loading, error } = useContentstack<FooterContent>(
    getFooterContent
  );
  
  return { data, loading, error };
};

// Health Advice Section Hook
export const useHealthAdviceSection = () => {
  const { data, loading, error } = useContentstack<HealthAdviceSection>(
    getHealthAdviceSection
  );
  
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

// Header Content Hook (with fallback data)
export const useHeaderContent = () => {
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

// Patient Inquiries Page Content Hook
export const usePatientInquiriesPageContent = () => {
  const { data, loading, error } = useContentstack<PatientInquiriesPageContent>(
    getPatientInquiriesPageContent
  );
  
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

// Hook for fetching doctor cards
export const useDoctorCards = () => {
  const { data, loading, error } = useContentstack(() => getDoctorCards());
  
  return { data, loading, error };
};

// Latest Medical Advice Section
export const useLatestMedicalAdvice = () => {
  const { data, loading, error } = useContentstack<any>(getLatestMedicalAdvice);
  
  return { data, loading, error };
};

// Featured Doctors Section Hook
export const useFeaturedDoctorsSection = () => {
  const { data: contentstackData, loading, error } = useContentstack<FeaturedDoctorsSection>(getFeaturedDoctorsSection);

  // Normalize the data by converting CMS doctors to component format
  const data = React.useMemo((): NormalizedFeaturedDoctorsSection | null => {
    if (!contentstackData) {
      return null;
    }

    return {
      uid: contentstackData.uid,
      title: contentstackData.title,
      description: contentstackData.description,
      reference: contentstackData.reference || [],
      display_limit: contentstackData.display_limit
    };
  }, [contentstackData]);
  
  return { data, loading, error };
};

// Hook to get doctors recommendation based on personalization variant (using proper Entry variants)
export const useDoctorsRecommendationByVariant = (variant: string | null, specialty: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!specialty) {
      setLoading(false);
      return;
    }
    
    if (!variant) {
      setLoading(true);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const variantData = await getDoctorsRecommendation([variant]);
        setData(variantData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [variant, specialty]);

  return { data, loading, error };
};

