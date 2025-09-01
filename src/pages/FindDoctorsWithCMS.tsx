import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import DoctorCard from '../components/DoctorCard';
import { useDoctorCards } from '../hooks/useContentstack';
import { convertDoctorCardFormat } from '../utils/contentstackHelpers';

const FindDoctorsWithCMS: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch doctors from Contentstack with fallback to static data
  const { data: contentstackDoctors, loading, error } = useDoctorCards();

  const specialties = [
    'All Specialties',
    'Cardiology',
    'Neurology', 
    'Pediatrics',
    'Orthopedics',
    'Psychiatry',
    'Ophthalmology',
    'General Medicine'
  ];

  // Convert Contentstack doctors to legacy format for compatibility
  const doctors = contentstackDoctors?.map(convertDoctorCardFormat) || [];

  // Helper function to check if doctor specialty matches selected filter
  const matchesSpecialtyFilter = (doctorSpecialty: string, selectedFilter: string): boolean => {
    if (selectedFilter === '' || selectedFilter === 'All Specialties') {
      return true;
    }
    
    const doctorSpec = doctorSpecialty.toLowerCase();
    const filter = selectedFilter.toLowerCase();
    
    // Handle specialty mappings
    const specialtyMappings: { [key: string]: string[] } = {
      'cardiology': ['cardiologist', 'cardiology', 'internal medicine'],
      'neurology': ['neurologist', 'neurology'],
      'pediatrics': ['pediatrician', 'pediatrics'],
      'orthopedics': ['orthopedic', 'orthopedics'],
      'psychiatry': ['psychiatrist', 'psychiatry'],
      'ophthalmology': ['ophthalmologist', 'ophthalmology', 'eye'],
      'general medicine': ['general', 'internal medicine', 'family medicine', 'primary care']
    };
    
    const mappedTerms = specialtyMappings[filter] || [filter];
    return mappedTerms.some(term => doctorSpec.includes(term));
  };

  // Handle URL search parameters for specialty filtering
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const specialtyParam = searchParams.get('specialty');
    
    if (specialtyParam) {
      // Check if the specialty from URL exists in our specialties list
      const matchingSpecialty = specialties.find(
        specialty => specialty.toLowerCase() === specialtyParam.toLowerCase()
      );
      
      if (matchingSpecialty) {
        setSelectedSpecialty(matchingSpecialty);
      }
    }
  }, [location.search, specialties]);

  // Update URL when specialty filter changes
  const handleSpecialtyChange = (specialty: string) => {
    setSelectedSpecialty(specialty);
    
    // Update URL to reflect current filter state
    const searchParams = new URLSearchParams(location.search);
    if (specialty && specialty !== 'All Specialties') {
      searchParams.set('specialty', specialty);
    } else {
      searchParams.delete('specialty');
    }
    
    const newSearch = searchParams.toString();
    const newPath = newSearch ? `${location.pathname}?${newSearch}` : location.pathname;
    navigate(newPath, { replace: true });
  };

  const filteredDoctors = doctors.filter((doctor: any) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = matchesSpecialtyFilter(doctor.specialty, selectedSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  // Loading state
  if (loading) {
    return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading doctors...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">Error loading doctors: {error}</p>
            <p className="text-gray-600 mt-2">Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Doctors</h1>
          <p className="text-lg text-gray-600">Search and connect with qualified healthcare professionals</p>
          
        </div>

        {/* Search and Filter */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by doctor name, specialty, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedSpecialty}
              onChange={(e) => handleSpecialtyChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Showing {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''}
            {selectedSpecialty && selectedSpecialty !== 'All Specialties' && (
              <span className="ml-2">
                in <span className="font-medium text-blue-600">{selectedSpecialty}</span>
              </span>
            )}
            {searchTerm && (
              <span className="ml-2">
                matching "<span className="font-medium text-blue-600">{searchTerm}</span>"
              </span>
            )}
          </p>
          {(searchTerm || (selectedSpecialty && selectedSpecialty !== 'All Specialties')) && (
            <button
              onClick={() => {
                setSearchTerm('');
                handleSpecialtyChange('');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Doctor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredDoctors.map((doctor: any) => (
            <DoctorCard 
              key={doctor.id} 
              {...doctor} 
              image={typeof doctor.image === 'string' ? { url: doctor.image, filename: 'doctor.jpg' } : doctor.image}
            />
          ))}
        </div>

        {/* Load More Button */}
        {filteredDoctors.length > 0 && (
          <div className="text-center">
            <button className="bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors duration-200">
              Load More Doctors
            </button>
          </div>
        )}

        {/* No Results */}
        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No doctors found matching your criteria.</p>
            <p className="text-gray-500">Try adjusting your search terms or specialty filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindDoctorsWithCMS;

