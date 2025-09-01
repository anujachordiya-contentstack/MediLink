import React from 'react';
import { usePersonalize, usePersonalizeVariant, PersonalizeConditional } from '../hooks/usePersonalize';
import { useDoctorsRecommendationByVariant } from '../hooks/useContentstack';
import { Users, Star, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import RecommendedCard from './RecommendedCard';

interface PersonalizedRecommendationsProps {
  currentDoctorSpecialty: string;
  currentDoctorUid: string;
}

const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({
  currentDoctorSpecialty,
  currentDoctorUid
}) => {
  // Initialize personalization service
  usePersonalize({ autoInitialize: true });
  
  // Get the active variant for doctor recommendations experience (ID: 1)
  // This matches your Contentstack setup with experience "Doctors Recommendation" (Short UID: 1)
  const recommendationVariant = usePersonalizeVariant('1');
  
  // Get variant to pass to CMS
  const variantToPass = recommendationVariant?.variantShortUid || null;
  
  // Fetch doctors recommendation based on personalization variant
  // FALLBACK: If personalization is taking too long, use a default variant after 3 seconds
  const [fallbackVariant, setFallbackVariant] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (!variantToPass && currentDoctorSpecialty) {
        setFallbackVariant('4'); // Default to variant 4 if personalization fails
      }
    }, 3000);
    
    // Clear timer if variant becomes available
    if (variantToPass) {
      clearTimeout(timer);
      setFallbackVariant(null);
    }
    
    return () => clearTimeout(timer);
  }, [variantToPass, currentDoctorSpecialty]);
  
  const finalVariant = variantToPass || fallbackVariant;
  
  const { 
    data: recommendationData
  } = useDoctorsRecommendationByVariant(
    finalVariant, 
    currentDoctorSpecialty
  );

  // Note: Personalization tracking is handled by DoctorProfile.tsx
  // This component only consumes the personalization data

  // Extract doctors from the recommendation data
  const recommendedDoctors = React.useMemo(() => {
    if (!recommendationData) return [];
    
    // Check multiple possible field names for recommended doctors
    const doctors = recommendationData.doctors_recommended || 
                   recommendationData.recommended_doctors || 
                   recommendationData.reference || 
                   [];
    
    // Filter out the current doctor
    return doctors.filter((doctor: any) => doctor.uid !== currentDoctorUid);
  }, [recommendationData, currentDoctorUid]);



  // Removed loading state for CMS data - only show personalization loading if needed

  // Default fallback content when no personalization is active
  const DefaultRecommendations = () => (
    <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
      <div className="flex items-center mb-4">
        <Users className="w-6 h-6 text-blue-600 mr-2" />
        <h3 className="text-xl font-semibold text-gray-900">
          Find More {currentDoctorSpecialty} Specialists
        </h3>
      </div>
      <p className="text-gray-600 mb-4">
        Looking for more specialists in {currentDoctorSpecialty}? Browse our network of qualified doctors.
      </p>
      
      <div className="bg-white p-4 rounded-lg border border-blue-200 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Browse All Specialists</h4>
            <p className="text-sm text-gray-600">Explore our complete directory of {currentDoctorSpecialty} professionals</p>
          </div>
        </div>
      </div>
      
      <Link
        to="/find-doctors"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        View All {currentDoctorSpecialty} Specialists
      </Link>
    </div>
  );

  // Personalized content for variant A - More detailed recommendations
  const PersonalizedVariantA = () => (
    <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
      <div className="flex items-center mb-4">
        <Star className="w-6 h-6 text-green-600 mr-2" />
        <h3 className="text-xl font-semibold text-gray-900">
          Top-Rated {currentDoctorSpecialty} Specialists for You
        </h3>
      </div>
      <p className="text-gray-600 mb-4">
        Based on your interests in {currentDoctorSpecialty}, we've curated these highly-rated specialists with similar expertise.
      </p>
      
      {/* Show actual recommended doctors with minimal cards */}
      {recommendedDoctors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {recommendedDoctors.slice(0, 4).map((doctor: any, index: number) => (
            <RecommendedCard 
              key={doctor.uid || index} 
              doctor={doctor} 
              variant="minimal"
              currentSpecialty={currentDoctorSpecialty}
              showBooking={false}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg border border-green-200">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Similar Specialists</h4>
                <p className="text-sm text-gray-600">Loading recommendations...</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-green-200">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Quick Booking</h4>
                <p className="text-sm text-gray-600">Same-day appointments</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Link
        to="/find-doctors"
        className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
      >
        View All Recommended Specialists
      </Link>
    </div>
  );

  // Personalized content for variant B - Focused on urgency
  const PersonalizedVariantB = () => (
    <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
      <div className="flex items-center mb-4">
        <Calendar className="w-6 h-6 text-purple-600 mr-2" />
        <h3 className="text-xl font-semibold text-gray-900">
          Urgent {currentDoctorSpecialty} Care Available
        </h3>
      </div>
      <p className="text-gray-600 mb-4">
        Need immediate {currentDoctorSpecialty} consultation? These specialists have same-day availability.
      </p>
      
      {/* Show actual recommended doctors with urgency focus */}
      {recommendedDoctors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {recommendedDoctors.slice(0, 3).map((doctor: any, index: number) => (
            <div key={doctor.uid || index} className="relative">
              <div className="absolute -top-2 -right-2 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                Available Today
              </div>
              <RecommendedCard 
                doctor={doctor} 
                variant="minimal"
                currentSpecialty={currentDoctorSpecialty}
                showBooking={false}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-4 rounded-lg border border-purple-200 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Emergency Consultations</h4>
              <p className="text-sm text-gray-600">Loading available doctors...</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-purple-600">Available Now</span>
            </div>
          </div>
        </div>
      )}
      
      <Link
        to="/find-doctors"
        className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
      >
        Book Emergency Consultation
      </Link>
    </div>
  );

  return (
    <>
      {/* Main Recommended Doctors Section - Show when we have recommendations */}
      {recommendedDoctors.length > 0 && (
        <div className="mt-8 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Recommended Specialists
                </h3>
                <p className="text-gray-600 text-sm">
                  {recommendedDoctors.length} specialists curated based on your current selection
                </p>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-emerald-100 px-3 py-1 rounded-full">
                <span className="text-emerald-700 font-medium text-sm">
                  ✨ Personalized
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recommendedDoctors.map((doctor: any, index: number) => (
              <RecommendedCard 
                key={doctor.uid || index} 
                doctor={doctor} 
                variant="minimal"
                currentSpecialty={currentDoctorSpecialty}
                showBooking={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Show variant A if user is assigned to variant 'a' for experience '1' */}
      <PersonalizeConditional 
        experienceShortUid="1" 
        variantShortUid="a"
        fallback={null}
      >
        <PersonalizedVariantA />
      </PersonalizeConditional>

      {/* Show variant B if user is assigned to variant 'b' for experience '1' */}
      <PersonalizeConditional 
        experienceShortUid="1" 
        variantShortUid="b"
        fallback={null}
      >
        <PersonalizedVariantB />
      </PersonalizeConditional>

      {/* Show default content ONLY if no recommendations are available */}
      {recommendedDoctors.length === 0 && (
        <DefaultRecommendations />
      )}
    </>
  );
};

export default PersonalizedRecommendations;
