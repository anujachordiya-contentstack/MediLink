import React from 'react';
import { Star, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DoctorCardProps {
  id: string;
  name: string;
  specialty: string;
  image: DoctorImage;
  experience: number;
  fee: number;
  consultation_fee?: {
    fee: string;
    fee_info: string;
  };
  languages?: string[] | string;
  rating: number;
  reviews: number;
}

interface DoctorImage {
  url: string;        // Direct URL to the image
  filename: string;   // File name from CMS
  content_type?: string; // Optional: mime type like image/png
  file_size?: number; // Optional: size in bytes
}
const DoctorCard: React.FC<DoctorCardProps> = ({
  id,
  name,
  specialty,
  image,
  experience,
  languages,
  rating,
  reviews,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:scale-105">
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={image.url}
            alt={name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
            <p className="text-blue-600 font-medium">{specialty}</p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium w-20">Experience:</span>
            <span>{experience} years</span>
          </div>
          {/* <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium w-20">Fee:</span>
            <span> ₹{consultation_fee?.fee || 'Contact for price'} consultation</span>
          </div> */}
          <div className="flex items-center text-sm text-gray-600">
            <Globe className="w-4 h-4 mr-2" />
            <span>
              {Array.isArray(languages) 
                ? languages.join(', ') 
                : typeof languages === 'string' 
                  ? languages 
                  : 'English'
              }
            </span>
          </div>
          <div className="flex items-center text-sm">
            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
            <span className="text-gray-900 font-medium">{rating}</span>
            <span className="text-gray-500 ml-1">({reviews} reviews)</span>
          </div>
        </div>

        <Link 
          to={`/doctor/${id}`}
          className="w-full bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors duration-200 block text-center"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default DoctorCard;