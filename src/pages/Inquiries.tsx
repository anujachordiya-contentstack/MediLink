import React from 'react';
import { Phone, Mail, Clock } from 'lucide-react';
import InquiryForm from '../components/InquiryForm';
import { usePatientInquiriesPageContent } from '../hooks/useContentstack';

const Inquiries: React.FC = () => {
  const { data: pageContent, loading, error } = usePatientInquiriesPageContent();

  if (loading) {
    return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-300 rounded mb-4 mx-auto w-64 animate-pulse"></div>
            <div className="h-6 bg-gray-300 rounded mx-auto w-96 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error loading patient inquiries page:', error);
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Now using real CMS content structure */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {pageContent?.header || 'Patient Inquiries'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {pageContent?.sub_header || 'Have a question or need medical guidance? We\'re here to help you.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inquiry Form */}
          <div className="lg:col-span-2">
            <InquiryForm />
          </div>

          {/* Support Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-blue-900 text-white rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6">
                {pageContent?.contact_details?.contact_support || 'Contact Support'}
              </h2>
              
              {/* Phone Support - Now using real CMS content */}
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-500 rounded-full">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">
                    {pageContent?.contact_details?.phone_support?.phone_header || 'Phone Support'}
                  </h3>
                </div>
                <p className="text-blue-200 mb-1">
                  {pageContent?.contact_details?.phone_support?.sub_header || 'Call us for immediate assistance'}
                </p>
                <p className="text-white font-medium">
                  {pageContent?.contact_details?.phone_support?.phone_no || '+91 9920537723'}
                </p>
              </div>

              {/* Email Support - Now using real CMS content */}
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-500 rounded-full">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">
                    {pageContent?.contact_details?.email_support?.header || 'Email Support'}
                  </h3>
                </div>
                <p className="text-blue-200 mb-1">
                  {pageContent?.contact_details?.email_support?.sub_header || 'Send us your questions'}
                </p>
                <p className="text-white font-medium">
                  {pageContent?.contact_details?.email_support?.email || 'support@medilink.com'}
                </p>
              </div>

              {/* Operating Hours - Now using real CMS content */}
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-500 rounded-full">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">
                    {pageContent?.contact_details?.operating_hours?.header || 'Operating Hours'}
                  </h3>
                </div>
                <p className="text-blue-200 mb-2">
                  {pageContent?.contact_details?.operating_hours?.sub_header || 'We\'re here to help'}
                </p>
                <div className="space-y-1 text-white">
                  {pageContent?.contact_details?.operating_hours?.timings ? (
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: pageContent.contact_details.operating_hours.timings 
                      }}
                    />
                  ) : (
                    <>
                      <p>Mon - Fri: 8:00 AM - 8:00 PM</p>
                      <p>Sat - Sun: 9:00 AM - 5:00 PM</p>
                    </>
                  )}
                </div>
              </div>

              {/* Emergency Help - Now using real CMS content */}
              <div className="bg-red-600 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Emergency?</h3>
                <p className="text-red-100 text-sm mb-3">
                  {pageContent?.contact_details?.emergency?.emergency_header || 'For medical emergencies, please call 911 or visit your nearest emergency room immediately.'}
                </p>
                {/* <button className="flex items-center space-x-2 bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors duration-200">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-medium">Emergency Help</span>
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inquiries;