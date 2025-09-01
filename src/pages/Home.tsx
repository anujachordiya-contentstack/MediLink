import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Brain, Bone, Eye, Baby, Stethoscope } from 'lucide-react';
import SpecialtyCard from '../components/SpecialtyCard';
import DoctorCard from '../components/DoctorCard';
import AdviceCard from '../components/AdviceCard';
import { useHeroSection, useMedicalSpecialties, useLatestMedicalAdvice, useFeaturedDoctorsSection } from '../hooks/useContentstack';
// Featured doctors hook is now in useContentstack
import { Button, MedicalSpecialty } from '../types';

const Home: React.FC = () => {
  const { data: heroData, loading: heroLoading, error: heroError } = useHeroSection();
  const { data: specialtiesData, loading: specialtiesLoading, error: specialtiesError } = useMedicalSpecialties();
  const { data: featuredDoctorsSection, loading: doctorsLoading, error: doctorsError } = useFeaturedDoctorsSection();
  const { data: latestMedicalAdvice } = useLatestMedicalAdvice();

  // Helper function to map specialty names to actual icons
  const getIconComponent = (specialtyName: string) => {
    const name = specialtyName.toLowerCase();
    if (name.includes('cardio') || name.includes('heart')) return Heart;
    if (name.includes('neuro') || name.includes('brain')) return Brain;
    if (name.includes('orthop') || name.includes('bone')) return Bone;
    if (name.includes('ophthal') || name.includes('eye')) return Eye;
    if (name.includes('pediatr') || name.includes('child')) return Baby;
    if (name.includes('general') || name.includes('medicine')) return Stethoscope;
    return Heart; // Default fallback
  };
  
  const specialties = [
    {
      name: 'Cardiology',
      icon: Heart,
      description: 'Heart and cardiovascular health specialists'
    },
    {
      name: 'Neurology',
      icon: Brain,
      description: 'Brain and nervous system experts'
    },
    {
      name: 'Orthopedics',
      icon: Bone,
      description: 'Bone, joint, and muscle care'
    },
    {
      name: 'Ophthalmology',
      icon: Eye,
      description: 'Eye care and vision specialists'
    },
    {
      name: 'Pediatrics',
      icon: Baby,
      description: 'Children\'s health and wellness'
    },
    {
      name: 'General Medicine',
      icon: Stethoscope,
      description: 'Comprehensive primary healthcare'
    }
  ];

  const featuredDoctors = [
    {
      id: '1',
      name: 'Dr. Michael Johnson',
      specialty: 'Cardiologist',
      image: 'https://images.pexels.com/photos/612805/pexels-photo-612805.jpeg?auto=compress&cs=tinysrgb&w=400',
      experience: 15,
      fee: 150,
      languages: ['English', 'Spanish'],
      rating: 4.8,
      reviews: 124
    },
    
  ];

  // Use latest medical advice data from Contentstack
  const latestAdvice = latestMedicalAdvice?.health_advice_cards || [];

  return (
    <div>
      {/* Hero Section */}
      {heroLoading ? (
        <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-pulse">
                <div className="h-12 bg-blue-800 rounded mb-6"></div>
                <div className="h-6 bg-blue-800 rounded mb-4"></div>
                <div className="h-6 bg-blue-800 rounded mb-8"></div>
                <div className="flex gap-4">
                  <div className="h-12 w-32 bg-blue-800 rounded"></div>
                  <div className="h-12 w-32 bg-blue-800 rounded"></div>
                </div>
              </div>
              <div className="hidden lg:block animate-pulse">
                <div className="h-64 bg-blue-800 rounded-lg"></div>
              </div>
            </div>
          </div>
        </section>
      ) : heroError || !heroData ? (
        <section className="bg-gradient-to-r from-red-900 to-red-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Error Loading Hero Content</h1>
            <p className="text-red-100">Please check your Contentstack configuration</p>
          </div>
        </section>
      ) : (
        <section 
          className={`bg-gradient-to-r ${heroData.background_color || 'from-blue-900 to-blue-700'} text-${heroData.text_color || 'white'} py-20`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                              <div>
                  <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                    {heroData.title}
                  </h1>
                  <p className="text-xl text-blue-100 mb-8">
                    {heroData.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {heroData.reference && heroData.reference.map((button: Button, index: number) => (
                      <Link
                        key={button.uid || index}
                        to={button.link?.href || '#'}
                        className={`px-8 py-3 rounded-lg font-semibold transition-colors duration-200 text-center ${
                          button.button_style === 'primary' || index === 0
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'border border-blue-300 text-white hover:bg-blue-800'
                        }`}
                      >
                        {button.label || button.link?.title || `Button ${index + 1}`}
                      </Link>
                    ))}
                  </div>
                </div>
              <div className="hidden lg:block">
                {heroData.banner_image?.url ? (
                  <img
                    src={heroData.banner_image.url}
                    alt={heroData.banner_image.title || 'Healthcare Professional'}
                    className="rounded-lg shadow-2xl"
                  />
                ) : (
                  <div className="h-64 bg-blue-800 rounded-lg flex items-center justify-center">
                    <Heart className="h-16 w-16 text-blue-300" />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* CMS Status Indicator for Hero Section (Development Only) */}
          {/* {import.meta.env.DEV && (
            <div className="bg-green-600 text-white text-xs py-1 px-4 text-center">
              {isContentstackConfigured() 
                ? '✅ Hero content from Contentstack CMS' 
                : '⚠️ Using fallback hero data - Configure Contentstack'
              }
            </div>
          )} */}
        </section>
      )}

      {/* Medical Specialties */}
      {specialtiesLoading ? (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="h-8 bg-gray-300 rounded mb-4 mx-auto w-64 animate-pulse"></div>
              <div className="h-6 bg-gray-300 rounded mx-auto w-96 animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
                  <div className="h-12 w-12 bg-gray-300 rounded mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : specialtiesError || !specialtiesData ? (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Medical Specialties</h2>
            <p className="text-lg text-red-600">Error loading specialties. Using fallback data.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {specialties.map((specialty, index) => (
                <SpecialtyCard key={index} {...specialty} />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {specialtiesData.title}
              </h2>
              <p className="text-lg text-gray-600">
                {specialtiesData.description}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {specialtiesData.reference && specialtiesData.reference.length > 0 ? (
                // Check if we have full specialty data or just references
                specialtiesData.reference[0]?.title ? (
                  // We have full data
                  specialtiesData.reference
                    ?.sort((a: MedicalSpecialty, b: MedicalSpecialty) => (a.display_order || 0) - (b.display_order || 0))
                    .map((specialty: MedicalSpecialty) => (
                      <SpecialtyCard 
                        key={specialty.uid}
                        name={specialty.title}
                        icon={getIconComponent(specialty.title)}
                        description={specialty.description}
                      />
                    ))
                ) : (
                  // We only have reference UIDs, use fallback data
                  <div className="col-span-full text-center text-yellow-600">
                    <p>⚠️ Referenced specialty data not populated. Using fallback specialties.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
                      {specialties.map((specialty, index) => (
                        <SpecialtyCard key={index} {...specialty} />
                      ))}
                    </div>
                  </div>
                )
              ) : (
                // No references found, use fallback
                specialties.map((specialty, index) => (
                  <SpecialtyCard key={index} {...specialty} />
                ))
              )}
            </div>
          </div>
          
          {/* CMS Status Indicator for Medical Specialties (Development Only) */}
          {/* {import.meta.env.DEV && (
            <div className="bg-purple-600 text-white text-xs py-1 px-4 text-center">
              {isContentstackConfigured() 
                ? '✅ Medical specialties from Contentstack CMS' 
                : '⚠️ Using fallback specialties data - Configure Contentstack'
              }
            </div>
          )} */}
        </section>
      )}

      {/* Featured Doctors */}
      {doctorsLoading ? (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="h-8 bg-gray-300 rounded mb-4 mx-auto w-64 animate-pulse"></div>
              <div className="h-6 bg-gray-300 rounded mx-auto w-96 animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
                  <div className="h-32 bg-gray-300 rounded mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                    <div className="h-4 bg-gray-300 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : doctorsError || !featuredDoctorsSection ? (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Doctors</h2>
            <p className="text-lg text-red-600">Error loading doctors. Using fallback data.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {featuredDoctors.map((doctor) => (
                <DoctorCard 
                  key={doctor.id} 
                  {...doctor} 
                  image={{ url: doctor.image, filename: 'doctor.jpg' }}
                />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                to="/find-doctors"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                View All Doctors
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {featuredDoctorsSection.title}
              </h2>
              <p className="text-lg text-gray-600">
                {featuredDoctorsSection.description}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredDoctorsSection.reference && featuredDoctorsSection.reference.length > 0 ? (
                // Data is already normalized by the hook - use doctor UID for linking
                featuredDoctorsSection.reference
                  .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
                  .slice(0, featuredDoctorsSection.display_limit || 6)
                  .map((doctor) => {
                    // Extract fee directly from CMS structure - just use the fee as a number
                    const feeValue = doctor.consultation_fee?.fee ? 
                      parseInt(String(doctor.consultation_fee.fee), 10) : 0;
                    
                    return (
                      <DoctorCard 
                        key={doctor.uid}
                        id={doctor.uid} // This UID will be used for /doctor/{uid} routing
                        name={doctor.title}
                        specialty={doctor.speciality}
                        image={doctor.image ? {
                          url: doctor.image.url,
                          filename: doctor.image.filename || 'doctor.jpg',
                          content_type: doctor.image.content_type,
                          file_size: doctor.image.file_size
                        } : {
                          url: 'https://images.pexels.com/photos/612805/pexels-photo-612805.jpeg?auto=compress&cs=tinysrgb&w=400',
                          filename: 'doctor.jpg'
                        }}
                        experience={parseInt(doctor.experience?.replace(/\D/g, '') || '0', 10)}
                        fee={feeValue}
                        consultation_fee={doctor.consultation_fee}
                        languages={doctor.language ? [doctor.language] : []}
                        rating={doctor.ratings?.value || 4.5}
                        reviews={parseInt(doctor.reviews?.replace(/\D/g, '') || '0', 10)}
                      />
                    );
                  })
              ) : (
                // No references found, use fallback
                featuredDoctors.map((doctor) => (
                  <DoctorCard 
                    key={doctor.id} 
                    {...doctor} 
                    image={{ url: doctor.image, filename: 'doctor.jpg' }}
                  />
                ))
              )}
            </div>
            <div className="text-center mt-12">
              <Link
                to="/find-doctors"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                View All Doctors
              </Link>
            </div>
          </div>
          
    
        </section>
      )}

      {/* Latest Medical Advice */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{latestMedicalAdvice?.title || 'Latest Medical Advice'}</h2>
            <p className="text-lg text-gray-600">{latestMedicalAdvice?.header || 'Stay informed with our health articles and tips'}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {latestAdvice.map((article: any, index: number) => {
              // Extract doctor name from doctor_reference
              const doctorName = article.doctor_reference?.[0]?.title || 
                               article.doctor_reference?.[0]?.name || 
                               article.author_reference?.[0]?.title || 
                               article.author_reference?.[0]?.name || 
                               article.author || 
                               article.author_name || 
                               'Medical Expert';
              
              // Format date to show only date part (no time)
              const formatDate = (dateString: string | undefined) => {
                if (!dateString) {
                  // If no date available, use current date minus a few days for variety
                  const today = new Date();
                  const daysAgo = [1, 3, 5][index] || 1;
                  today.setDate(today.getDate() - daysAgo);
                  return today.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  });
                }
                try {
                  const date = new Date(dateString);
                  if (isNaN(date.getTime())) {
                    // Invalid date, create a fallback date
                    const today = new Date();
                    const daysAgo = [2, 5, 7][index] || 2;
                    today.setDate(today.getDate() - daysAgo);
                    return today.toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    });
                  }
                  return date.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  });
                } catch (e) {
                  // Error parsing date, use fallback
                  const today = new Date();
                  const daysAgo = [1, 4, 6][index] || 1;
                  today.setDate(today.getDate() - daysAgo);
                  return today.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  });
                }
              };
              
              const formattedDate = formatDate(
                article.date || 
                article.created_at || 
                article.updated_at || 
                article.publish_details?.time ||
                article.published_at
              );
              
              return (
                <AdviceCard 
                  key={article.uid || index} 
                  id={article.uid || `article-${index}`}
                  title={article.title || `Health Article ${index + 1}`}
                  description={article.description || article.short_description || 'Learn more about this important health topic...'}
                  image={article.image?.url || article.image || 'https://images.pexels.com/photos/7659564/pexels-photo-7659564.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  date={formattedDate}
                  author={doctorName}
                  author_reference={article.doctor_reference || article.author_reference}
                  button_references={article.button_references}
                  category={article.category}
                  read_time={article.read_time || '5 min read'}
                />
              );
            })}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/health-advice"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Browse More Articles
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;