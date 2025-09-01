import { Doctor, AvailabilitySchedule } from '../types';

// Map Contentstack doctor data to DoctorProfile component format
export const mapCMSDoctorToProfile = (cmsDoctor: any): Doctor | null => {
  if (!cmsDoctor) return null;

  try {
    // Parse experience and fee from string format
    const experienceYears = cmsDoctor.experience ? 
      parseInt(cmsDoctor.experience.replace(/\D/g, '')) || 0 : 0;
    
    const consultationFee = cmsDoctor.consultation_fee?.fee ? 
      parseInt(cmsDoctor.consultation_fee.fee.replace(/\D/g, '')) || 
      parseInt(cmsDoctor.fee?.replace(/\D/g, '')) || 0 : 0;

    // Parse languages from string format
    const languages = cmsDoctor.language ? 
      cmsDoctor.language.split(',').map((lang: string) => lang.trim()) : ['English'];

    // Parse rating
    const rating = cmsDoctor.ratings?.value || 4.0;

    // Parse reviews count
    const reviewsCount = cmsDoctor.reviews ? 
      parseInt(cmsDoctor.reviews.replace(/\D/g, '')) || 0 : 0;

    // Map availability slots to schedule format
    const availabilitySchedule: AvailabilitySchedule[] = (cmsDoctor.availability_slots || []).map((slot: any) => ({
      day: slot.availability?.days || '',
      hours: `${slot.availability?.start_time || ''} - ${slot.availability?.end_time || ''}`,
      is_available: true
    }));

    // Map qualifications from education field or create default
    const qualifications = cmsDoctor.qualifications_education?.length > 0 ? 
      cmsDoctor.qualifications_education.map((qual: any) => ({
        degree: qual.education?.degree || 'Unknown Degree',
        institution: qual.education?.institution || 'Unknown Institution', 
        year: qual.education?.year || 'Unknown Year',
        type: 'degree'
      })) : [
        { degree: 'MD - Doctor of Medicine', institution: 'Medical School', year: '2010', type: 'degree' }
      ];

    // Extract specializations
    const specializations = cmsDoctor.specializations || [cmsDoctor.speciality || 'General Medicine'];

    return {
      uid: cmsDoctor.uid,
      title: cmsDoctor.title,
      name: cmsDoctor.title,
      specialty: cmsDoctor.speciality || 'General Medicine',
      profile_image: cmsDoctor.image || {
        uid: 'default',
        title: 'Default Image',
        filename: 'default.jpg',
        url: 'https://images.pexels.com/photos/612805/pexels-photo-612805.jpeg?auto=compress&cs=tinysrgb&w=400',
        content_type: 'image/jpeg',
        file_size: 0
      },
      experience_years: experienceYears,
      consultation_fee: consultationFee,
      languages: languages,
      rating: rating,
      total_reviews: reviewsCount,
      location: cmsDoctor.contact_info?.address?.split(',')[0] || 'Medical Center',
      availability_status: availabilitySchedule.length > 0 ? 'Available' : 'Contact for Availability',
      about_description: cmsDoctor.doctor_bio || 'Experienced healthcare professional committed to providing quality care.',
      qualifications: qualifications,
      qualifications_education: cmsDoctor.qualifications_education || [],
      specializations: Array.isArray(specializations) ? specializations : [specializations],
      contact_phone: cmsDoctor.contact_info?.contact_no || '(555) 000-0000',
      contact_email: cmsDoctor.contact_info?.email_id || 'contact@medilink.com',
      clinic_address: cmsDoctor.contact_info?.address || 'Medical Center',
      availability_schedule: availabilitySchedule,
      created_at: cmsDoctor.created_at || '',
      updated_at: cmsDoctor.updated_at || '',
      created_by: cmsDoctor.created_by || '',
      updated_by: cmsDoctor.updated_by || '',
      locale: cmsDoctor.locale || 'en-us',
      tags: cmsDoctor.tags || []
    };
  } catch (error) {
    // Error mapping CMS doctor data
    return null;
  }
};

// Helper function to format availability for display
export const formatAvailabilitySlots = (slots: any[]): string => {
  if (!slots || slots.length === 0) return 'Contact for availability';
  
  return slots.map(slot => {
    const { days, start_time, end_time } = slot.availability || {};
    return `${days}: ${start_time} - ${end_time}`;
  }).join(', ');
};

// Helper function to extract fee information
export const extractFeeInfo = (cmsDoctor: any): { fee: number, info: string } => {
  const fee = cmsDoctor.consultation_fee?.fee ? 
    parseInt(cmsDoctor.consultation_fee.fee.replace(/\D/g, '')) || 
    parseInt(cmsDoctor.fee?.replace(/\D/g, '')) || 0 : 0;
  
  const info = cmsDoctor.consultation_fee?.fee_info || 'Standard consultation fee';
  
  return { fee, info };
};
