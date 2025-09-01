import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ExternalLink, Heart } from 'lucide-react';
import { useHeaderContent, getNavigationUrl } from '../hooks/useContentstack';
import { NavigationMenuItem } from '../types';

interface MappedNavigationItem {
  label: string;
  url: string;
  is_external: boolean;
  order: number;
}

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { data: headerContent, error } = useHeaderContent();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Map CMS URLs to actual app routes
  const mapCmsUrlToAppRoute = (cmsUrl: string): string => {
    const urlMapping: { [key: string]: string } = {
      '/home': '/',
      '/doctors': '/find-doctors',
      '/inquires': '/inquiries',
      '/health-advice': '/health-advice',
      '/about-us': '/about'
    };
    
    return urlMapping[cmsUrl] || cmsUrl;
  };

  // Error handling - fall back to default behavior
  if (error || !headerContent) {
    console.error('Header content error:', error);
    return null;
  }

  // Map navigation menu items to include URLs
  const navigationItems = headerContent?.navigation_menu?.map((item: NavigationMenuItem, index: number) => ({
    label: item.label,
    url: item.link?.href ? mapCmsUrlToAppRoute(item.link.href) : getNavigationUrl(item.label),
    is_external: false,
    order: index + 1
  })) || [];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              {/* {headerContent?.logo?.url ? (
                <img
                  src={headerContent.logo.url}
                  alt={headerContent.title || 'MediLink'}
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <div className="flex flex-col">
                  <span 
                    className="text-xl font-bold" 
                    style={{ color: headerContent?.primary_color || '#1e40af' }}
                  >
                    {headerContent?.title || 'MediLink'}
                  </span>
                  {headerContent?.tagline && (
                    <span className="text-xs text-gray-500 -mt-1">
                      {headerContent?.tagline}
                    </span>
                  )}
                </div>
              )} */}              
              <Heart className="h-8 w-8 text-blue-400" />
              <div className="flex flex-col">
                  <span 
                    className="text-xl font-bold" 
                    style={{ color: headerContent?.primary_color || '#1e40af' }}
                  >
                    {headerContent?.title || 'MediLink'}
                  </span>
                  {headerContent?.tagline && (
                    <span className="text-xs text-gray-500 -mt-1">
                      {headerContent?.tagline}
                    </span>
                  )}
                </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigationItems.map((item: MappedNavigationItem) => (
                item.is_external ? (
                  <a
                    key={item.label}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-1"
                  >
                    <span>{item.label}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    to={item.url}
                    className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive(item.url)
                        ? 'border-b-2 border-blue-600'
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                    style={{
                      color: isActive(item.url) ? (headerContent?.secondary_color || '#2563eb') : undefined,
                      borderBottomColor: isActive(item.url) ? (headerContent?.secondary_color || '#2563eb') : undefined
                    }}
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Emergency Contact */}
            {headerContent?.show_emergency_contact && headerContent?.emergency_number && (
              <a
                href={`tel:${headerContent?.emergency_number}`}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm font-medium"
              >
                <Phone className="w-4 h-4" />
                <span>Emergency: {headerContent?.emergency_number}</span>
              </a>
            )}

            {/* CTA Button */}
            {headerContent?.cta_button && (
              <Link
                to={headerContent?.cta_button.url}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  headerContent?.cta_button.style === 'primary'
                    ? 'text-white hover:opacity-90'
                    : 'border border-current hover:bg-gray-50'
                }`}
                style={{
                  backgroundColor: headerContent?.cta_button.style === 'primary' ? headerContent?.secondary_color : 'transparent',
                  color: headerContent?.cta_button.style === 'primary' ? 'white' : headerContent?.secondary_color
                }}
              >
                {headerContent?.cta_button.text}
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navigationItems.map((item: MappedNavigationItem) => (
                item.is_external ? (
                  <a
                    key={item.label}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      <span>{item.label}</span>
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    to={item.url}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                      isActive(item.url)
                        ? 'bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                    }`}
                    style={{
                      color: isActive(item.url) ? (headerContent?.secondary_color || '#2563eb') : undefined,
                      backgroundColor: isActive(item.url) ? `${headerContent?.secondary_color || '#2563eb'}10` : undefined
                    }}
                  >
                    {item.label}
                  </Link>
                )
              ))}

              {/* Mobile Emergency Contact */}
              {headerContent?.show_emergency_contact && headerContent?.emergency_number && (
                <a
                  href={`tel:${headerContent?.emergency_number}`}
                  className="block px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>Emergency: {headerContent?.emergency_number}</span>
                  </div>
                </a>
              )}

              {/* Mobile CTA Button */}
              {headerContent.cta_button && (
                <div className="px-3 py-2">
                  <Link
                    to={headerContent?.cta_button.url}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block w-full text-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      headerContent.cta_button.style === 'primary'
                        ? 'text-white hover:opacity-90'
                        : 'border border-current hover:bg-gray-50'
                    }`}
                    style={{
                      backgroundColor: headerContent.cta_button.style === 'primary' ? headerContent.secondary_color : 'transparent',
                      color: headerContent.cta_button.style === 'primary' ? 'white' : headerContent.secondary_color
                    }}
                  >
                    {headerContent.cta_button.text}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;