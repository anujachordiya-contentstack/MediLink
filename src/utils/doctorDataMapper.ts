import { DoctorCardCMS, DoctorCard } from '../types';

/**
 * Maps a doctor card from CMS format to normalized component format
 */
export const mapDoctorCardFromCMS = (cmsDoctor: DoctorCardCMS): DoctorCard => {
  // Extract doctor name from title (remove specialty suffix)
  const extractDoctorName = (title: string, specialty: string): string => {
    // If title ends with specialty, remove it
    if (title.endsWith(specialty)) {
      return title.replace(specialty, '').trim();
    }
    // Otherwise try to extract "Dr. FirstName LastName" pattern
    const match = title.match(/^(Dr\.\s+[A-Za-z\s]+)/);
    return match ? match[1].trim() : title;
  };

  // Extract numeric experience from string like "15 Years"
  const extractExperienceYears = (experience: string): number => {
    const match = experience.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  // Extract numeric fee from consultation_fee object or legacy fee string
  const extractConsultationFee = (cmsDoctor: DoctorCardCMS): number => {
    // Try multiple fee extraction methods
    
    // Method 1: New structure consultation_fee.fee
    if (cmsDoctor.consultation_fee?.fee) {
      const feeStr = String(cmsDoctor.consultation_fee.fee);
      const match = feeStr.match(/(\d+)/);
      if (match) return parseInt(match[1], 10);
    }
    
    // Method 2: Direct consultation_fee as string
    if (typeof cmsDoctor.consultation_fee === 'string') {
      const match = (cmsDoctor.consultation_fee as string).match(/(\d+)/);
      if (match) return parseInt(match[1], 10);
    }
    
    // Method 3: Legacy fee field
    if ((cmsDoctor as any).fee) {
      const feeStr = String((cmsDoctor as any).fee);
      const match = feeStr.match(/(\d+)/);
      if (match) return parseInt(match[1], 10);
    }
    
    // Method 4: Try direct numeric value
    if (typeof cmsDoctor.consultation_fee === 'number') {
      return cmsDoctor.consultation_fee;
    }
    
    return 0;
  };

  // Convert language string to array
  const extractLanguages = (language: string): string[] => {
    return language.split(',').map(lang => lang.trim()).filter(lang => lang.length > 0);
  };

  // Extract numeric reviews from string like "25 review"
  const extractTotalReviews = (reviews: string): number => {
    const match = reviews.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  return {
    uid: cmsDoctor.uid,
    title: cmsDoctor.title,
    doctor_name: extractDoctorName(cmsDoctor.title, cmsDoctor.speciality),
    specialty: cmsDoctor.speciality,
    profile_image: cmsDoctor.image,
    experience_years: extractExperienceYears(cmsDoctor.experience),
    consultation_fee: extractConsultationFee(cmsDoctor),
    consultation_fee_object: cmsDoctor.consultation_fee,
    languages: extractLanguages(cmsDoctor.language),
    rating: cmsDoctor.ratings?.value || 0,
    total_reviews: extractTotalReviews(cmsDoctor.reviews),
    
    // Use new contact_info structure or fallback to legacy fields  
    location: cmsDoctor.contact_info?.address || cmsDoctor.location || 'Location not specified',
    availability_status: cmsDoctor.availability_status || 'Contact for availability',
    about_description: cmsDoctor.doctor_bio || cmsDoctor.about_description || 'Experienced healthcare professional dedicated to providing quality medical care.',
    
    // Map qualifications from new structure
    qualifications: cmsDoctor.qualifications_education?.map(qual => ({
      degree_name: qual.education.degree,
      institution: qual.education.institution,
      completion_year: qual.education.year.toString(),
      qualification_type: 'degree' as const,
      uid: qual.education._metadata.uid,
      title: qual.education.degree,
      created_at: cmsDoctor.created_at,
      updated_at: cmsDoctor.updated_at,
      created_by: cmsDoctor.created_by,
      updated_by: cmsDoctor.updated_by,
      locale: cmsDoctor.locale,
      tags: []
    })) || cmsDoctor.qualifications || [],
    
    specializations: cmsDoctor.specializations || [cmsDoctor.speciality],
    
    // Use new contact_info structure or fallback
    contact_phone: cmsDoctor.contact_info?.contact_no || cmsDoctor.contact_phone || 'Contact information available upon request',
    contact_email: cmsDoctor.contact_info?.email_id || cmsDoctor.contact_email || 'Contact information available upon request',
    clinic_address: cmsDoctor.contact_info?.address || cmsDoctor.clinic_address || 'Address available upon request',
    
    is_featured: cmsDoctor.is_featured,
    display_order: cmsDoctor.display_order,
    
    // Adding missing fields required by DoctorCard interface
    reviews: extractTotalReviews(cmsDoctor.reviews),
    fee: extractConsultationFee(cmsDoctor),
    experience: extractExperienceYears(cmsDoctor.experience),
    created_at: cmsDoctor.created_at,
    updated_at: cmsDoctor.updated_at,
    created_by: cmsDoctor.created_by,
    updated_by: cmsDoctor.updated_by,
    locale: cmsDoctor.locale,
    tags: cmsDoctor.tags
  };
};

/**
 * Maps an array of CMS doctor cards to normalized format
 */
export const mapDoctorCardsFromCMS = (cmsDoctors: DoctorCardCMS[]): DoctorCard[] => {
  return cmsDoctors.map(mapDoctorCardFromCMS);
};

/**
 * Validates if a CMS doctor has the minimum required fields (updated for real API structure)
 */
export const isValidCMSDoctor = (cmsDoctor: any): cmsDoctor is DoctorCardCMS => {
  return (
    cmsDoctor &&
    typeof cmsDoctor.title === 'string' &&
    typeof cmsDoctor.speciality === 'string' &&
    typeof cmsDoctor.experience === 'string' &&
    // Updated validation for new API structure
    ((cmsDoctor.consultation_fee && typeof cmsDoctor.consultation_fee.fee === 'string') || 
     (typeof cmsDoctor.fee === 'string')) && // Support both old and new structure
    typeof cmsDoctor.language === 'string' &&
    cmsDoctor.ratings &&
    typeof cmsDoctor.ratings.value === 'number' &&
    typeof cmsDoctor.reviews === 'string'
  );
};

/**
 * Filters and maps CMS doctors, only including valid ones
 */
export const mapValidDoctorCardsFromCMS = (cmsDoctors: any[]): DoctorCard[] => {
  if (!cmsDoctors || !Array.isArray(cmsDoctors)) {
    return [];
  }
  
  const validDoctors = cmsDoctors.filter((doctor) => {
    return isValidCMSDoctor(doctor);
  });
  
  const mappedDoctors = validDoctors.map((doctor) => {
    return mapDoctorCardFromCMS(doctor);
  });
  
  return mappedDoctors;
};
