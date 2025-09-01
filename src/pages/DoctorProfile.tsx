import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Calendar,
  GraduationCap,
  Stethoscope,
  Heart,
  Activity,
  Shield,
  Users
} from 'lucide-react';
import { AvailabilitySchedule } from '../types';
import AppointmentModal from '../components/AppointmentModal';

import { useDoctorProfile } from '../hooks/useContentstack';
import { mapCMSDoctorToProfile } from '../utils/doctorProfileMapper';
import { usePersonalize } from '../hooks/usePersonalize';
import { personalizeService } from '../services/personalize.service';
import PersonalizedRecommendations from '../components/PersonalizedRecommendations';

const DoctorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState<boolean>(false);

  // Fetch doctor data from Contentstack
  const { data: cmsDoctor, loading, error } = useDoctorProfile(id || '');
  
  // Map CMS data to component format
  const doctorFromCMS = mapCMSDoctorToProfile(cmsDoctor);

  // Initialize personalization
  usePersonalize({ autoInitialize: true });

  // Fallback doctors data for when CMS is not available or loading
  const doctors: any[] = [
    {
      id: '1',
      name: 'Dr. John Smith',
      specialty: 'Cardiologist',
      image: 'https://images.pexels.com/photos/612805/pexels-photo-612805.jpeg?auto=compress&cs=tinysrgb&w=400',
      experience: 15,
      fee: 150,
      languages: ['English', 'Spanish'],
      rating: 4.8,
      reviews: 124,
      location: 'New York Medical Center',
      availability: 'Available Today',
      about: 'Dr. John Smith is a board-certified cardiologist with over 15 years of experience in treating cardiovascular diseases. He specializes in preventive cardiology, heart failure management, and interventional procedures.',
      qualifications: [
        { degree: 'MD - Doctor of Medicine', institution: 'Harvard Medical School', year: '2005', type: 'degree' },
        { degree: 'Cardiology Fellowship', institution: 'Johns Hopkins Hospital', year: '2008-2011', type: 'fellowship' },
        { degree: 'Board Certification', institution: 'American Board of Internal Medicine - Cardiology', year: '2011', type: 'certification' }
      ],
      specializations: ['Heart Disease', 'Interventional Cardiology', 'Preventive Cardiology', 'Heart Failure', 'Hypertension', 'General Medicine'],
      phone: '(555) 123-4567',
      email: 'dr.smith@medilink.com',
      address: '123 Medical Plaza, Suite 456, New York, NY 10001'
    },
    {
      id: '2',
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist & Internal Medicine',
      image: 'https://images.pexels.com/photos/559457/pexels-photo-559457.jpeg?auto=compress&cs=tinysrgb&w=400',
      experience: 15,
      fee: 150,
      languages: ['English', 'French'],
      rating: 4.9,
      reviews: 127,
      location: 'New York Medical Center',
      availability: 'Available Today',
      about: 'Dr. Sarah Johnson is a board-certified cardiologist with over 15 years of experience in treating cardiovascular diseases. She specializes in preventive cardiology, heart failure management, and interventional procedures. She completed her medical degree from Harvard Medical School and her cardiology fellowship at Johns Hopkins Hospital. Dr. Johnson is committed to providing personalized, compassionate care to all her patients.',
      qualifications: [
        { degree: 'MD - Doctor of Medicine', institution: 'Harvard Medical School', year: '2005', type: 'degree' },
        { degree: 'Cardiology Fellowship', institution: 'Johns Hopkins Hospital', year: '2008-2011', type: 'fellowship' },
        { degree: 'Board Certification', institution: 'American Board of Internal Medicine - Cardiology', year: '2011', type: 'certification' }
      ],
      specializations: ['Heart Disease', 'Interventional Cardiology', 'Preventive Cardiology', 'Heart Failure', 'Hypertension', 'General Medicine'],
      phone: '(555) 123-4567',
      email: 'dr.johnson@medilink.com',
      address: '123 Medical Plaza, Suite 456, New York, NY 10001'
    },
    {
      id: '3',
      name: 'Dr. Michael Chen',
      specialty: 'Neurologist',
      image: 'https://images.pexels.com/photos/582750/pexels-photo-582750.jpeg?auto=compress&cs=tinysrgb&w=400',
      experience: 12,
      fee: 180,
      languages: ['English', 'Mandarin'],
      rating: 4.7,
      reviews: 156,
      location: 'City Neurological Institute',
      availability: 'Available Tomorrow',
      about: 'Dr. Michael Chen is a board-certified neurologist specializing in movement disorders, epilepsy, and neurodegenerative diseases. With over 12 years of experience, he provides comprehensive neurological care.',
      qualifications: [
        { degree: 'MD - Doctor of Medicine', institution: 'Stanford Medical School', year: '2008', type: 'degree' },
        { degree: 'Neurology Residency', institution: 'Mayo Clinic', year: '2008-2012', type: 'fellowship' },
        { degree: 'Board Certification', institution: 'American Board of Neurology', year: '2012', type: 'certification' }
      ],
      specializations: ['Movement Disorders', 'Epilepsy', 'Neurodegenerative Diseases', 'Stroke Care', 'Headache Medicine'],
      phone: '(555) 789-0123',
      email: 'dr.chen@medilink.com',
      address: '456 Neurological Center, Suite 789, New York, NY 10002'
    },
    {
      id: '4',
      name: 'Dr. Emily Davis',
      specialty: 'Pediatrician',
      image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=400',
      experience: 10,
      fee: 100,
      languages: ['English'],
      rating: 4.9,
      reviews: 203,
      location: 'Children\'s Health Center',
      availability: 'Available Today',
      about: 'Dr. Emily Davis is a dedicated pediatrician with 10 years of experience in child healthcare. She specializes in preventive care, developmental assessments, and childhood illnesses.',
      qualifications: [
        { degree: 'MD - Doctor of Medicine', institution: 'Yale Medical School', year: '2010', type: 'degree' },
        { degree: 'Pediatric Residency', institution: 'Children\'s Hospital Boston', year: '2010-2013', type: 'fellowship' },
        { degree: 'Board Certification', institution: 'American Board of Pediatrics', year: '2013', type: 'certification' }
      ],
      specializations: ['Preventive Care', 'Developmental Assessment', 'Childhood Illnesses', 'Vaccination', 'Growth Monitoring'],
      phone: '(555) 456-7890',
      email: 'dr.davis@medilink.com',
      address: '789 Children\'s Plaza, Suite 123, New York, NY 10003'
    },
    {
      id: '5',
      name: 'Dr. Robert Wilson',
      specialty: 'Orthopedic Surgeon',
      image: 'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=400',
      experience: 20,
      fee: 200,
      languages: ['English', 'German'],
      rating: 4.6,
      reviews: 95,
      location: 'Orthopedic Specialists Center',
      availability: 'Available Next Week',
      about: 'Dr. Robert Wilson is a highly experienced orthopedic surgeon with 20 years of practice. He specializes in joint replacement, sports medicine, and trauma surgery.',
      qualifications: [
        { degree: 'MD - Doctor of Medicine', institution: 'Johns Hopkins Medical School', year: '2000', type: 'degree' },
        { degree: 'Orthopedic Surgery Residency', institution: 'Hospital for Special Surgery', year: '2000-2005', type: 'fellowship' },
        { degree: 'Board Certification', institution: 'American Board of Orthopedic Surgery', year: '2005', type: 'certification' }
      ],
      specializations: ['Joint Replacement', 'Sports Medicine', 'Trauma Surgery', 'Arthroscopy', 'Spine Surgery'],
      phone: '(555) 321-6540',
      email: 'dr.wilson@medilink.com',
      address: '321 Orthopedic Lane, Suite 654, New York, NY 10004'
    },
    {
      id: '6',
      name: 'Dr. Lisa Martinez',
      specialty: 'Psychiatrist',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      experience: 7,
      fee: 130,
      languages: ['English', 'Spanish'],
      rating: 4.8,
      reviews: 67,
      location: 'Mental Health Associates',
      availability: 'Available Today',
      about: 'Dr. Lisa Martinez is a compassionate psychiatrist with 7 years of experience in mental health care. She specializes in anxiety disorders, depression, and behavioral therapy.',
      qualifications: [
        { degree: 'MD - Doctor of Medicine', institution: 'Columbia Medical School', year: '2013', type: 'degree' },
        { degree: 'Psychiatry Residency', institution: 'New York Presbyterian Hospital', year: '2013-2017', type: 'fellowship' },
        { degree: 'Board Certification', institution: 'American Board of Psychiatry', year: '2017', type: 'certification' }
      ],
      specializations: ['Anxiety Disorders', 'Depression', 'Behavioral Therapy', 'PTSD Treatment', 'Addiction Medicine'],
      phone: '(555) 987-6543',
      email: 'dr.martinez@medilink.com',
      address: '987 Mental Health Blvd, Suite 321, New York, NY 10005'
    }
  ];

  // Use Contentstack doctor data if available, otherwise fallback
  const finalDoctor = doctorFromCMS || doctors.find(d => d.uid === id) || doctors[0];

  // Track specialty interest for personalization
  React.useEffect(() => {
    const specialty = finalDoctor?.specialty || finalDoctor?.speciality || finalDoctor?.specialization;
    
    if (specialty) {
      personalizeService.trackDoctorSpecialtyInterest(specialty);
    }
  }, [finalDoctor?.specialty, finalDoctor?.speciality, finalDoctor?.specialization]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-48 mb-6"></div>
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-start space-x-6">
                <div className="w-32 h-32 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-8 bg-gray-300 rounded w-64 mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded w-48 mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded w-32"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state or no doctor found
  if (error || !finalDoctor) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Doctor Not Found</h2>
            <p className="text-gray-600 mb-8">The doctor profile you're looking for could not be found.</p>
            <Link to="/find-doctors" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Browse All Doctors
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Use finalDoctor's actual availability schedule or fallback
  const availabilitySchedule: AvailabilitySchedule[] = finalDoctor.availability_schedule?.length > 0 ? 
    finalDoctor.availability_schedule : [
      { day: 'Monday', hours: '9:00 AM - 5:00 PM', is_available: true },
      { day: 'Tuesday', hours: '9:00 AM - 5:00 PM', is_available: true },
      { day: 'Wednesday', hours: '9:00 AM - 5:00 PM', is_available: true },
      { day: 'Thursday', hours: '9:00 AM - 5:00 PM', is_available: true },
      { day: 'Friday', hours: '9:00 AM - 3:00 PM', is_available: true },
      { day: 'Weekend', hours: 'Closed', is_available: false }
    ];

  const getSpecializationIcon = (specialization: string) => {
    switch (specialization.toLowerCase()) {
      case 'heart disease':
        return Heart;
      case 'interventional cardiology':
        return Activity;
      case 'preventive cardiology':
        return Shield;
      case 'heart failure':
        return Heart;
      case 'hypertension':
        return Activity;
      case 'general medicine':
        return Users;
      default:
        return Stethoscope;
    }
  };

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span>›</span>
            <Link to="/find-doctors" className="hover:text-blue-600 transition-colors">Doctors</Link>
            <span>›</span>
            <span className="text-gray-900">{finalDoctor.name}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Doctor Header */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
                <div className="flex-shrink-0">
                  <img
                    src={typeof finalDoctor.profile_image === 'string' ? finalDoctor.profile_image : finalDoctor.profile_image?.url || 'https://images.pexels.com/photos/612805/pexels-photo-612805.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={finalDoctor.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">{finalDoctor.name}</h1>
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="text-lg font-semibold text-gray-900">{finalDoctor.rating}</span>
                      <span className="text-gray-600">({finalDoctor.total_reviews} reviews)</span>
                    </div>
                  </div>
                  <p className="text-lg text-blue-600 font-medium mb-3">{finalDoctor.specialty}</p>
                  <div className="flex flex-wrap items-center space-x-6 text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{finalDoctor.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Stethoscope className="w-4 h-4" />
                      <span>{finalDoctor.experience_years}+ years experience</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-600 text-sm">In-Person Consultation</span>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About {finalDoctor.name}</h2>
              <p className="text-gray-700 leading-relaxed">{finalDoctor.about_description}</p>
            </div>

            {/* Qualifications & Education */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Qualifications & Education</h2>
              <div className="space-y-6">
                {(finalDoctor.qualifications || []).map((qual: any, index: number) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <GraduationCap className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{qual.degree}</h3>
                      <p className="text-gray-600">{qual.institution}</p>
                      <p className="text-gray-500 text-sm">({qual.year})</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Specializations */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Specializations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(finalDoctor.specializations || []).map((spec: any, index: number) => {
                  const IconComponent = getSpecializationIcon(spec);
                  return (
                    <div key={index} className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
                      <IconComponent className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-900">{spec}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Consultation Fee */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Consultation Fee</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">₹{finalDoctor.consultation_fee}</div>
                <p className="text-gray-600 text-sm mb-4">Per consultation</p>
                <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Fee includes initial consultation and follow-up within 7 days</span>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                Availability
              </h3>
              <div className="space-y-3">
                {availabilitySchedule.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <span className="text-gray-700 font-medium">{schedule.day}</span>
                    <span className={`text-sm font-medium ${
                      schedule.hours === 'Closed' 
                        ? 'text-gray-500' 
                        : 'text-gray-900'
                    }`}>
                      {schedule.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-6">
              <button 
                onClick={() => setIsAppointmentModalOpen(true)}
                className="w-full bg-green-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-2 shadow-sm"
              >
                <Calendar className="w-5 h-5" />
                <span>Book Appointment</span>
              </button>
              <Link
                to="/inquiries"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 shadow-sm"
              >
                <Mail className="w-5 h-5" />
                <span>Send Inquiry</span>
              </Link>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Phone className="w-5 h-5 text-gray-400" />
                  </div>
                  <span className="text-gray-700">{finalDoctor.contact_phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <span className="text-gray-700 break-all">{finalDoctor.contact_email}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <MapPin className="w-5 h-5 text-gray-400" />
                  </div>
                  <span className="text-gray-700">{finalDoctor.clinic_address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personalized Recommendations Section */}
        <PersonalizedRecommendations
          currentDoctorSpecialty={finalDoctor.specialty}
          currentDoctorUid={finalDoctor.uid || id || ''}
        />

        {/* Appointment Modal */}
        <AppointmentModal
          isOpen={isAppointmentModalOpen}
          onClose={() => setIsAppointmentModalOpen(false)}
          doctorName={finalDoctor.name}
          doctorSpecialty={finalDoctor.specialty}
          doctorAddress={finalDoctor.clinic_address}
          consultationFee={finalDoctor.consultation_fee}
          availabilitySchedule={availabilitySchedule}
        />
      </div>
    </div>
  );
};

export default DoctorProfile;
