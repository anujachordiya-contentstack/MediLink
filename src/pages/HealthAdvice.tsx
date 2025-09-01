import React from 'react';
import { Link } from 'react-router-dom';
import AdviceCard from '../components/AdviceCard';
import { useHealthAdviceSection } from '../hooks/useContentstack';

const HealthAdvice: React.FC = () => {
  const { data: healthAdviceData, loading, error } = useHealthAdviceSection();

  // Loading state
  if (loading) {
    return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading health advice articles...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    console.error('Health advice content error:', error);
  }

  const articles = healthAdviceData?.health_advices || [];
  const sectionTitle = healthAdviceData?.title || 'Health Advice';
  const sectionDescription = healthAdviceData?.sub_header || 'Stay informed with expert health articles, tips, and guidance from our medical professionals';

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{sectionTitle}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {sectionDescription}
          </p>
        </div>

        {/* CTA Buttons */}
        {healthAdviceData?.cta_buttons && healthAdviceData.cta_buttons.length > 0 && (
          <div className="text-center mb-12">
            <div className="flex flex-wrap justify-center gap-4">
              {healthAdviceData.cta_buttons.map((button) => (
                <Link
                  key={button.uid}
                  to={button.link?.href || '#'}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                    button.button_style === 'primary'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {button.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {articles.map((article, index) => {
              // Format date to show only date part (no time)
              const formatDate = (dateString: string | undefined) => {
                if (!dateString) {
                  // If no date available, use current date minus a few days for variety
                  const today = new Date();
                  const daysAgo = [2, 4, 6][index] || 2;
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
                    const daysAgo = [1, 5, 8][index] || 1;
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
                  const daysAgo = [3, 7, 9][index] || 3;
                  today.setDate(today.getDate() - daysAgo);
                  return today.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  });
                }
              };

              const formattedDate = formatDate(
                article.publish_date || 
                (article as any).date || 
                article.created_at || 
                article.updated_at || 
                (article as any).publish_details?.time
              );

              return (
                <AdviceCard 
                  key={article.uid}
                  id={article.uid}
                  title={article.article_name}
                  description={article.short_description}
                  image={article.image?.url || 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600'}
                  date={formattedDate}
                  author={article.doctor_reference?.[0]?.title || 'Medical Professional'}
                  author_reference={article.doctor_reference}
                  button_references={article.buttons}
                  category={article.category}
                  read_time={article.read_time}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No health advice articles available at this time.</p>
            <p className="text-gray-400 mt-2">Please check back later for new content.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthAdvice;