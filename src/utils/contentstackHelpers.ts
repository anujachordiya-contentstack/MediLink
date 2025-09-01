import { Doctor as ContentstackDoctor, DoctorCardCMS } from '../types';

// Helper function to convert Contentstack Doctor to legacy Doctor format for backward compatibility
export const convertDoctorFormat = (doctor: ContentstackDoctor) => {
  return {
    id: doctor.uid,
    name: doctor.name,
    specialty: doctor.specialty,
    image: doctor.profile_image?.url || '',
    experience: doctor.experience_years,
    fee: doctor.consultation_fee,
    languages: doctor.languages || [],
    rating: doctor.rating,
    reviews: doctor.total_reviews,
    location: doctor.location,
    availability: doctor.availability_status,
    about: doctor.about_description,
    qualifications: doctor.qualifications?.map(q => ({
      degree: q.degree_name,
      institution: q.institution,
      year: q.completion_year,
      type: q.qualification_type
    })) || [],
    specializations: doctor.specializations?.map(s => s.name) || [],
    phone: doctor.contact_phone,
    email: doctor.contact_email,
    address: doctor.clinic_address
  };
};

// Helper function to convert DoctorCardCMS to legacy format for backward compatibility
export const convertDoctorCardFormat = (doctor: DoctorCardCMS) => {
  // Extract doctor name from title (remove specialty suffix if present)
  const doctorName = doctor.title.includes('Cardiologist') 
    ? doctor.title.replace('Cardiologist', '').trim()
    : doctor.title.replace(doctor.speciality, '').trim() || doctor.title;

  return {
    id: doctor.uid,
    name: doctorName,
    specialty: doctor.speciality,
    image: doctor.image ? {
      url: doctor.image.url,
      filename: doctor.image.filename || 'doctor.jpg',
      content_type: doctor.image.content_type,
      file_size: doctor.image.file_size
    } : {
      url: 'https://images.pexels.com/photos/612805/pexels-photo-612805.jpeg?auto=compress&cs=tinysrgb&w=400',
      filename: 'default-doctor.jpg'
    },
    experience: parseInt(doctor.experience?.replace(/\D/g, '') || '0') || 0,
    fee: parseInt(doctor.consultation_fee?.fee?.replace(/\D/g, '') || '0') || 0,
    languages: doctor.language ? doctor.language.split(', ') : [],
    rating: doctor.ratings?.value || 0,
    reviews: parseInt(doctor.reviews?.replace(/\D/g, '') || '0') || 0,
    location: doctor.location || '',
    availability: doctor.availability_status || 'Available',
    about: doctor.about_description || '',
    qualifications: doctor.qualifications || [],
    specializations: doctor.specializations || [doctor.speciality],
    phone: doctor.contact_phone || '',
    email: doctor.contact_email || '',
    address: doctor.clinic_address || ''
  };
};

// Helper to format Contentstack asset URLs
export const getImageUrl = (asset: any, transform?: string) => {
  if (!asset?.url) return '';
  
  if (transform) {
    return `${asset.url}?${transform}`;
  }
  
  return asset.url;
};

// Helper to format Contentstack rich text
export const formatRichText = (richTextContent: any) => {
  if (!richTextContent) return '';
  
  // Basic rich text to HTML conversion
  // You might want to use a more sophisticated library like @contentstack/rich-text-html-renderer
  if (typeof richTextContent === 'string') {
    return richTextContent;
  }
  
  return JSON.stringify(richTextContent);
};

// Helper to extract plain text from rich text
export const extractPlainText = (richTextContent: any, maxLength?: number) => {
  let text = '';
  
  if (typeof richTextContent === 'string') {
    text = richTextContent;
  } else if (richTextContent?.children) {
    // Extract text from rich text JSON structure
    const extractText = (nodes: any[]): string => {
      return nodes.map(node => {
        if (node.text) return node.text;
        if (node.children) return extractText(node.children);
        return '';
      }).join('');
    };
    
    text = extractText(richTextContent.children);
  }
  
  // Remove HTML tags if any
  text = text.replace(/<[^>]*>/g, '');
  
  if (maxLength && text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  
  return text;
};

// Helper to check if running in development mode
export const isDevelopmentMode = () => {
  return import.meta.env.DEV;
};

// Helper to check if Contentstack is properly configured
export const isContentstackConfigured = () => {

  return !!(
    import.meta.env.VITE_CONTENTSTACK_API_KEY &&
    import.meta.env.VITE_CONTENTSTACK_DELIVERY_TOKEN &&
    import.meta.env.VITE_CONTENTSTACK_ENVIRONMENT
  );
};
