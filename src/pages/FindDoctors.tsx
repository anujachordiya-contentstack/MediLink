import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import DoctorCard from '../components/DoctorCard';

import { useFindDoctorsPageContent, useDoctorCards } from '../hooks/useContentstack';
import { convertDoctorCardFormat } from '../utils/contentstackHelpers';

const FindDoctors: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 6;
  const location = useLocation();
  const navigate = useNavigate();
  const { data: contentstackDoctors, loading: doctorsLoading, error: doctorsError } = useDoctorCards();
  const { data: pageContent } = useFindDoctorsPageContent();

  // Convert Contentstack doctors to legacy format for compatibility
  const doctorsData = contentstackDoctors?.map(convertDoctorCardFormat) || [];

  const specialties = [
    pageContent?.specialty_filter_label || 'All Specialties',
    'Cardiology',
    'Neurology', 
    'Pediatrics',
    'Orthopedics',
    'Psychiatry',
    'Ophthalmology',
    'General Medicine'
  ];

  // Helper function to check if doctor specialty matches selected filter
  const matchesSpecialtyFilter = (doctorSpecialty: string, selectedFilter: string): boolean => {
    if (selectedFilter === '' || selectedFilter === 'All Specialties') {
      return true;
    }
    
    if (!doctorSpecialty) {
      return false;
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





  const filteredDoctors = (doctorsData || []).filter((doctor: any) => {
    const matchesSearch = doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = matchesSpecialtyFilter(doctor.specialty || '', selectedSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  // Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSpecialty]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);
  const startIndex = (currentPage - 1) * doctorsPerPage;
  const endIndex = startIndex + doctorsPerPage;
  const paginatedDoctors = filteredDoctors.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{pageContent?.page_title || 'Find Doctors'}</h1>
          <p className="text-lg text-gray-600">{pageContent?.page_subtitle || 'Search and connect with qualified healthcare professionals'}</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={pageContent?.search_placeholder || "Search by doctor name, specialty, or location..."}
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
            {filteredDoctors.length > 0 ? (
              <>
                Showing {startIndex + 1}-{Math.min(endIndex, filteredDoctors.length)} of {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''}
              </>
            ) : (
              <>No doctors found</>
            )}
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
              {pageContent?.clear_filters_text || 'Clear filters'}
            </button>
          )}
        </div>

        {/* Doctor Cards Grid */}
        {doctorsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
        ) : doctorsError ? (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg mb-4">Error loading doctors.</p>
            <p className="text-gray-500">Please try again later or contact support.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {paginatedDoctors.map((doctor: any) => (
                <DoctorCard 
                  key={doctor.id}
                  id={doctor.id}
                  name={doctor.name}
                  specialty={doctor.specialty}
                  image={typeof doctor.image === 'string' ? { url: doctor.image, filename: 'doctor.jpg' } : doctor.image}
                  experience={doctor.experience}
                  fee={doctor.fee}
                  languages={doctor.languages}
                  rating={doctor.rating}
                  reviews={doctor.reviews}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2 mb-8">
                {/* Mobile: Current Page Info */}
                <div className="sm:hidden text-sm text-gray-600 mb-2">
                  Page {currentPage} of {totalPages}
                </div>
                
                <div className="flex items-center space-x-1">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center px-2 sm:px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4 sm:mr-1" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  {/* Page Numbers - Desktop */}
                  <div className="hidden sm:flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                      // Show first page, last page, current page, and pages around current page
                      const isFirstOrLast = pageNum === 1 || pageNum === totalPages;
                      const isAroundCurrent = Math.abs(pageNum - currentPage) <= 1;
                      
                      if (isFirstOrLast || isAroundCurrent) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                              currentPage === pageNum
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (
                        (pageNum === 2 && currentPage > 4) ||
                        (pageNum === totalPages - 1 && currentPage < totalPages - 3)
                      ) {
                        return (
                          <span key={pageNum} className="px-2 py-2 text-sm text-gray-400">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  {/* Page Numbers - Mobile (just current, previous, next) */}
                  <div className="flex sm:hidden space-x-1">
                    {currentPage > 1 && (
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="px-2 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                      >
                        {currentPage - 1}
                      </button>
                    )}
                    <button className="px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-md">
                      {currentPage}
                    </button>
                    {currentPage < totalPages && (
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="px-2 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                      >
                        {currentPage + 1}
                      </button>
                    )}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center px-2 sm:px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === totalPages
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4 sm:ml-1" />
                  </button>
                </div>
              </div>
            )}

            {/* No Results */}
            {filteredDoctors.length === 0 && !doctorsLoading && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-4">{pageContent?.no_results_title || 'No doctors found matching your criteria.'}</p>
                <p className="text-gray-500">{pageContent?.no_results_message || 'Try adjusting your search terms or specialty filter.'}</p>
              </div>
            )}
          </>
        )}

       
      </div>
    </div>
  );
};

export default FindDoctors;