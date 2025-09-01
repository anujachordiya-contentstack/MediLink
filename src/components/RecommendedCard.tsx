import React from 'react';
import { Star, Calendar, MapPin, Phone, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Doctor {
  uid: string;
  title: string;
  name?: string;
  speciality?: string;
  specialty?: string;
  image?: {
    url: string;
  };
  experience?: string;
  ratings?: {
    value: number;
  };
  reviews?: string;
  consultation_fee?: {
    fee: string;
    fee_info?: string;
  };
  contact_info?: {
    address?: string;
    contact_no?: string;
  };
  availability_slots?: Array<{
    availability: {
      days: string;
      start_time: string;
      end_time: string;
    };
  }>;
  slug?: string;
}

interface RecommendedCardProps {
  doctor: Doctor;
  variant?: 'compact' | 'detailed' | 'minimal';
  showBooking?: boolean;
  currentSpecialty?: string;
}

const RecommendedCard: React.FC<RecommendedCardProps> = ({ 
  doctor, 
  variant = 'detailed', 
  showBooking = true,
  currentSpecialty 
}) => {
  const doctorName = doctor.title || doctor.name;
  const specialty = doctor.speciality || doctor.specialty;
  const doctorId = doctor.uid || doctor.slug;
  const profileLink = `/doctor/${doctorId}`;
  const imageUrl = doctor.image?.url || 'https://images.pexels.com/photos/612805/pexels-photo-612805.jpeg?auto=compress&cs=tinysrgb&w=400';

  if (variant === 'minimal') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200 hover:border-blue-300">
        <div className="text-center">
          <img
            src={imageUrl}
            alt={doctorName}
            className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-2 border-gray-100"
          />
          <h4 className="font-semibold text-gray-900 text-lg mb-1">{doctorName}</h4>
          <p className="text-blue-600 text-sm font-medium mb-1">{specialty}</p>
          {doctor.experience && (
            <p className="text-gray-600 text-sm mb-3">
              <Clock className="w-4 h-4 inline mr-1" />
              {doctor.experience} experience
            </p>
          )}
          {doctorId ? (
            <Link
              to={profileLink}
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors font-medium w-full"
            >
              View Full Profile
            </Link>
          ) : (
            <button
              disabled
              className="inline-block bg-gray-400 text-white px-4 py-2 rounded-lg text-sm cursor-not-allowed font-medium w-full"
              title="Doctor profile not available"
            >
              Profile Unavailable
            </button>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 hover:border-blue-300">
        <div className="flex items-center space-x-4">
          <img
            src={imageUrl}
            alt={doctorName}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-lg">{doctorName}</h4>
            <p className="text-blue-600 text-sm font-medium">{specialty}</p>
            
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
              {doctor.experience && (
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {doctor.experience}
                </span>
              )}
              {doctor.ratings?.value && (
                <span className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
                  {doctor.ratings.value}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2 mt-3">
              {doctorId ? (
                <Link
                  to={profileLink}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  View Profile
                </Link>
              ) : (
                <button
                  disabled
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg text-sm cursor-not-allowed"
                  title="Doctor profile not available"
                >
                  Profile Unavailable
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-blue-300 hover:-translate-y-1">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <img
            src={imageUrl}
            alt={doctorName}
            className="w-20 h-20 rounded-full object-cover border-3 border-white shadow-lg"
          />
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-xl">{doctorName}</h3>
            <p className="text-blue-600 font-semibold">{specialty}</p>
            
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
              {doctor.experience && (
                <span className="flex items-center bg-white px-2 py-1 rounded-full">
                  <Clock className="w-4 h-4 mr-1 text-blue-500" />
                  {doctor.experience} experience
                </span>
              )}
              {doctor.ratings?.value && (
                <span className="flex items-center bg-white px-2 py-1 rounded-full">
                  <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
                  {doctor.ratings.value} ({doctor.reviews || 'reviews'})
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Consultation Fee */}
          {doctor.consultation_fee?.fee && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Consultation Fee</p>
                  <p className="text-green-700 font-bold text-lg">₹{doctor.consultation_fee.fee}</p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600">₹</span>
                </div>
              </div>
              {doctor.consultation_fee.fee_info && (
                <p className="text-xs text-gray-500 mt-1">{doctor.consultation_fee.fee_info}</p>
              )}
            </div>
          )}

          {/* Contact Info */}
          {doctor.contact_info && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="space-y-2">
                {doctor.contact_info.address && (
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{doctor.contact_info.address}</p>
                  </div>
                )}
                {doctor.contact_info.contact_no && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <p className="text-sm text-gray-700">{doctor.contact_info.contact_no}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Availability */}
        {doctor.availability_slots && doctor.availability_slots.length > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
            <div className="flex items-center mb-2">
              <Calendar className="w-4 h-4 text-purple-600 mr-2" />
              <p className="text-sm font-medium text-gray-700">Available Times</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {doctor.availability_slots.slice(0, 2).map((slot, index) => (
                <div key={index} className="bg-white rounded px-2 py-1 text-xs text-gray-600">
                  <span className="font-medium">{slot.availability.days}:</span> {slot.availability.start_time} - {slot.availability.end_time}
                </div>
              ))}
            </div>
            {doctor.availability_slots.length > 2 && (
              <p className="text-xs text-purple-600 mt-1">+{doctor.availability_slots.length - 2} more slots</p>
            )}
          </div>
        )}

        {/* Recommendation Reason */}
        {currentSpecialty && specialty && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-amber-700">
              <span className="font-medium">🎯 Recommended for {currentSpecialty}</span>
              {specialty !== currentSpecialty && (
                <span className="block text-xs mt-1">Specialist in {specialty} with relevant expertise</span>
              )}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        {showBooking && (
          <div className="flex items-center space-x-3">
            {doctorId ? (
              <Link
                to={profileLink}
                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg text-center font-medium hover:bg-blue-700 transition-colors"
              >
                View Full Profile
              </Link>
            ) : (
              <button
                disabled
                className="flex-1 bg-gray-400 text-white px-4 py-3 rounded-lg text-center font-medium cursor-not-allowed"
                title="Doctor profile not available"
              >
                Profile Unavailable
              </button>
            )}
            <button className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
              Book Appointment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendedCard;
