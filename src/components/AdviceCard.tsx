import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import { DoctorCardCMS, Button } from '../types';

interface AdviceCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  author: string;
  author_reference?: DoctorCardCMS[];
  button_references?: Button[];
  category?: string;
  read_time?: string;
}

const AdviceCard: React.FC<AdviceCardProps> = ({
  id,
  title,
  description,
  image,
  date,
  author,
  author_reference,
}) => {
  // Get author information from reference if available
  const authorInfo = author_reference && author_reference.length > 0 
    ? author_reference[0] 
    : null;

  const authorName = authorInfo?.title || author;
  const authorImage = authorInfo?.image?.url;
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col h-full">
      {/* Large Image */}
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-64 object-cover"
        />
      </div>
      
      <div className="p-8 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">{title}</h3>
        
        {/* Description - will grow to fill available space */}
        <div className="flex-grow mb-6">
          <p className="text-gray-600 text-base leading-relaxed">
            {description}
          </p>
        </div>

        {/* Author Section - stays at consistent position */}
        <div className="flex items-center mb-6">
          <div className="flex items-center flex-1">
            {authorImage ? (
              <img
                src={authorImage}
                alt={authorName}
                className="w-12 h-12 rounded-full mr-4 object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                <User className="w-6 h-6 text-gray-500" />
              </div>
            )}
            <div>
              <div className="font-medium text-gray-900 text-base">{authorName}</div>
              <div className="flex items-center text-gray-500 text-sm mt-1">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{date || 'Recent'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - always at the bottom */}
        <div className="flex gap-3 mt-auto">
          {/* Read More Button */}
          <Link
            to={`/health-advice/${id}`}
            className="flex-1 bg-blue-600 text-white text-center px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            Read More
          </Link>
          
          {/* View Doctor Button */}
          {authorInfo && (
            <Link
              to={`/doctor/${authorInfo.uid}`}
              className="flex-1 bg-green-600 text-white text-center px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
            >
              View Doctor
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdviceCard;