import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SpecialtyCardProps {
  name: string;
  icon: LucideIcon;
  description: string;
}

const SpecialtyCard: React.FC<SpecialtyCardProps> = ({ name, icon: Icon, description }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to find doctors page with specialty filter
    navigate(`/find-doctors?specialty=${encodeURIComponent(name)}`);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-6 text-center transition-transform duration-200 hover:scale-105 hover:shadow-lg cursor-pointer hover:bg-blue-50 border border-transparent hover:border-blue-200"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
        <Icon className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{name}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

export default SpecialtyCard;