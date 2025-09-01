import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Phone, Mail, MapPin } from 'lucide-react';
import { useFooterContent } from '../hooks/useContentstack';

const Footer: React.FC = () => {
  // Fetch footer content from Contentstack with fallback
  const { data: footerContent, loading, error } = useFooterContent();

  // Helper function to extract text from rich text copyright field
  const getCopyrightText = () => {
    if (!footerContent?.copyright) return '© 2025 MediLink. All rights reserved.';
    
    try {
      // Extract text from rich text structure
      const firstChild = footerContent.copyright.children?.[0];
      const textChild = firstChild?.children?.[0];
      return textChild?.text || '© 2025 MediLink. All rights reserved.';
    } catch (error) {
      return '© 2025 MediLink. All rights reserved.';
    }
  };

  // Show loading state if needed
  if (loading) {
    return (
      <footer className="bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse text-center">
            <div className="h-8 bg-blue-800 rounded w-32 mx-auto"></div>
          </div>
        </div>
      </footer>
    );
  }

  // Log error if any
  if (error) {
    console.error('Error loading footer content:', error);
  }
  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Platform Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">{footerContent?.title}</span>
            </div>
            <p className="text-blue-200 mb-4">
              {footerContent?.footer_banner}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{footerContent?.footer_quick_links?.title}</h3>
            <ul className="space-y-2">
              {footerContent?.footer_quick_links?.links?.map((link) => (
                <li key={link._metadata.uid}>
                  <Link 
                    to={link.link.href} 
                    className="text-blue-200 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{footerContent?.support?.title}</h3>
            <ul className="space-y-2">
              {footerContent?.support?.support_links?.map((link) => (
                <li key={link._metadata.uid}>
                  <Link 
                    to={link.link.href} 
                    className="text-blue-200 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              {footerContent?.contact_info?.contact_number && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-400" />
                  <span className="text-blue-200">{footerContent.contact_info.contact_number}</span>
                </div>
              )}
              {footerContent?.contact_info?.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <span className="text-blue-200">{footerContent.contact_info.email}</span>
                </div>
              )}
              {footerContent?.contact_info?.address && (
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-blue-400" />
                  <span className="text-blue-200">{footerContent.contact_info.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-blue-800 text-center">
          <p className="text-blue-200">{getCopyrightText()}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;