import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Heart, Users, Lightbulb, CheckCircle } from 'lucide-react';
import { useAboutUsPageContent } from '../hooks/useContentstack';

const About: React.FC = () => {
  // Fetch About Us content from Contentstack with fallback
  const { data: aboutContent, loading, error } = useAboutUsPageContent();

  // Icon mapping function for values section
  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      shield: Shield,
      heart: Heart,
      users: Users,
      lightbulb: Lightbulb,
      checkCircle: CheckCircle
    };
    return icons[iconName?.toLowerCase()] || Shield;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Loading Hero */}
        <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-pulse">
              <div className="h-12 bg-blue-800 rounded mb-6 mx-auto w-64"></div>
              <div className="h-6 bg-blue-800 rounded mx-auto w-96"></div>
            </div>
          </div>
        </section>
        
        {/* Loading Content */}
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-gray-300 rounded w-48 mx-auto"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    console.error('Error loading About Us content:', error);
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{aboutContent?.banner_heading}</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Discover how we're transforming healthcare accessibility and connecting patients with trusted medical professionals.
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{aboutContent?.mission_title}</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {aboutContent?.mission_statment}
          </p>
        </div>
      </section>

      {/* Vision & Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{aboutContent?.vision_values?.vision_value_title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aboutContent?.vision_values?.vision_and_values?.sort((a, b) => (a.display_order || 0) - (b.display_order || 0)).map((value) => {
              const IconComponent = getIconComponent(value.icon_name || '');
              return (
                <div key={value.uid} className="bg-white rounded-lg p-8 text-center shadow-md">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <IconComponent className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{aboutContent?.how_it_works?.how_it_works_title}</h2>
            {aboutContent?.how_it_works?.how_it_works_description && (
              <p className="text-lg text-gray-600">{aboutContent.how_it_works.how_it_works_description}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aboutContent?.how_it_works?.how_it_works_steps?.sort((a, b) => (a.display_order || 0) - (b.display_order || 0)).map((step) => (
              <div key={step.uid} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full text-xl font-bold mb-4">
                  {step.step_number}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">{aboutContent?.ready_to_connect?.ready_to_connect_title}</h2>
          <p className="text-xl text-blue-100 mb-8">
            {aboutContent?.ready_to_connect?.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {aboutContent?.ready_to_connect?.button_reference && aboutContent.ready_to_connect.button_reference.length > 0 ? (
              aboutContent.ready_to_connect.button_reference.map((button, index) => (
                <Link
                  key={button.uid || index}
                  to={button.link?.url || '/inquiries'}
                  className={`px-8 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                    button.button_style === 'primary' || index === 0
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'border border-blue-300 text-white hover:bg-blue-800'
                  }`}
                >
                  {button.label || button.link?.title || 'Contact Us'}
                </Link>
              ))
            ) : (
              // Fallback buttons
              <>
                <Link
                  to="/inquiries"
                  className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200"
                >
                  Contact Us
                </Link>
                <Link
                  to="/inquiries"
                  className="border border-blue-300 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors duration-200"
                >
                  Submit Inquiry
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;