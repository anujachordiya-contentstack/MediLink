import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react';
import AdviceCard from '../components/AdviceCard';
import { useHealthAdviceArticle, useHealthAdviceSection } from '../hooks/useContentstack';

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Fetch the specific article and related articles
  const { data: article, loading: articleLoading, error: articleError } = useHealthAdviceArticle(id || '');
  const { data: healthAdviceData, loading: sectionLoading } = useHealthAdviceSection();
  
  // Loading state
  if (articleLoading || sectionLoading) {
    return (
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (articleError || !article) {
    return (
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/health-advice"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Health Advice</span>
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-8">The article you're looking for doesn't exist or has been removed.</p>
            <Link
              to="/health-advice"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              Browse All Articles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get author information
  const author = article.doctor_reference && article.doctor_reference.length > 0 
    ? article.doctor_reference[0] 
    : null;
  const authorName = author?.title || 'Medical Professional';
  const authorImage = author?.image?.url;

  // Format date to show only date part (no time)
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) {
      // If no date available, use current date minus a few days
      const today = new Date();
      today.setDate(today.getDate() - 2);
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
        today.setDate(today.getDate() - 1);
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
      today.setDate(today.getDate() - 3);
      return today.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  const formattedArticleDate = formatDate(
    article?.publish_date || 
    (article as any)?.date || 
    article?.created_at || 
    article?.updated_at
  );

  // Get related articles (excluding current article)
  const relatedArticles = healthAdviceData?.health_advices?.filter(
    relatedArticle => relatedArticle.uid !== article.uid
  ).slice(0, 3) || [];

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/health-advice"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Health Advice</span>
        </Link>

        {/* Article Header */}
        <header className="mb-8">
          {/* Category and Read Time */}
          {(article.category || article.read_time) && (
            <div className="flex items-center gap-2 mb-4">
              {article.category && (
                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {article.category}
                </span>
              )}
              {article.read_time && (
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{article.read_time}</span>
                </div>
              )}
            </div>
          )}

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {article.article_name}
          </h1>
          
          <div className="flex items-center space-x-6 text-gray-600 mb-6">
            {authorImage && (
              <img
                src={authorImage}
                alt={authorName}
                className="w-10 h-10 rounded-full"
              />
            )}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                {!authorImage && <User className="w-4 h-4" />}
                <span className="font-medium">{authorName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{formattedArticleDate}</span>
              </div>
            </div>
          </div>

          {article.image?.url && (
            <img
              src={article.image.url}
              alt={article.article_name}
              className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg"
            />
          )}
        </header>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none mb-12">
          <div className="text-gray-700 leading-relaxed space-y-6">
            {article.article_description ? (
              <div dangerouslySetInnerHTML={{ __html: article.article_description }} />
            ) : (
              <p>{article.short_description}</p>
            )}
          </div>
        </article>

        {/* Author Bio */}
        {author && (
        <div className="bg-blue-50 rounded-lg p-6 mb-12">
            <div className="flex items-start space-x-4">
              {authorImage && (
                <img
                  src={authorImage}
                  alt={authorName}
                  className="w-16 h-16 rounded-full"
                />
              )}
              <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">About the Author</h3>
                <p className="text-gray-600 mb-3">
                  {authorName} is a medical professional specializing in {author.speciality || 'healthcare'}.
                </p>
                <Link
                  to={`/doctor/${author.uid}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  View Doctor Profile
                  <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                </Link>
              </div>
            </div>
        </div>
        )}

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map((relatedArticle) => {
                const relatedFormattedDate = formatDate(
                  relatedArticle.publish_date || 
                  (relatedArticle as any).date || 
                  relatedArticle.created_at || 
                  relatedArticle.updated_at
                );

                return (
                  <AdviceCard 
                    key={relatedArticle.uid}
                    id={relatedArticle.uid}
                    title={relatedArticle.article_name}
                    description={relatedArticle.short_description}
                    image={relatedArticle.image?.url || 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600'}
                    date={relatedFormattedDate}
                    author={relatedArticle.doctor_reference?.[0]?.title || 'Medical Professional'}
                    author_reference={relatedArticle.doctor_reference}
                    button_references={relatedArticle.buttons}
                    category={relatedArticle.category}
                    read_time={relatedArticle.read_time}
                  />
                );
              })}
            </div>
        </section>
        )}
      </div>
    </div>
  );
};

export default ArticleDetail;