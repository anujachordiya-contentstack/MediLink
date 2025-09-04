/**
 * Contentstack Automation Service for Inquiry Submissions
 * Handles creating user inquiries via Contentstack automation
 */

export interface InquiryData {
  fullName: string;
  email: string;
  phone: string;
  specialty: string;
  urgency: string;
  message: string;
}

export interface ContentstackInquiryEntry {
  title: string;
  email: string;
  phone_no: string;
  medical_speciality: string;
  other_message: string;
  urgency_level: string;
  name: string;
  tags: string[];
}

export interface ContentstackInquiryResponse {
  entry: ContentstackInquiryEntry & {
    uid: string;
    created_at: string;
    updated_at: string;
    title: string;
  };
  notice?: string;
}

class InquiryService {
  private readonly automationUrl = 'https://app.contentstack.com/automations-api/run/2124a55253c04d899b0b114785a11b1a';
  private readonly automationKey = 'O7$ozrvpfsjmxx';
  
  private environment: string;

  constructor() {
    // Load environment variables - no management token needed for automation
    this.environment = import.meta.env.VITE_CONTENTSTACK_ENVIRONMENT || 'development';
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'ah-http-key': this.automationKey
    };
  }

  private buildPayload(inquiryData: InquiryData): { entry: ContentstackInquiryEntry } {
    return {
      entry: {
        title: inquiryData.fullName,
        email: inquiryData.email,
        phone_no: inquiryData.phone,
        medical_speciality: inquiryData.specialty,
        other_message: inquiryData.message,
        urgency_level: inquiryData.urgency,
        name: inquiryData.fullName,
        tags: []
      }
    };
  }

  async createInquiry(inquiryData: InquiryData): Promise<ContentstackInquiryResponse> {
    if (!this.isConfigured()) {
      throw new Error('Service not configured. Please contact support.');
    }

    const payload = this.buildPayload(inquiryData);

    try {
      const response = await fetch(this.automationUrl, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Contentstack Automation Error
        if (response.status === 401) {
          throw new Error('Authentication failed. Please check your automation key.');
        } else if (response.status === 422) {
          throw new Error('Invalid data format. Please check the content type structure in Contentstack.');
        } else if (response.status === 404) {
          throw new Error('Automation endpoint not found. Please check the automation URL.');
        } else {
          throw new Error(`API Error: ${response.status} - ${responseData.error_message || 'Unknown error'}`);
        }
      }

      // Inquiry created successfully via automation
      return responseData;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection.');
      }
      throw error;
    }
  }


  isConfigured(): boolean {
    return !!(this.automationKey && this.automationUrl);
  }

  getConfigStatus() {
    return {
      configured: this.isConfigured(),
      automationUrl: !!this.automationUrl,
      automationKey: !!this.automationKey,
      environment: this.environment,
      security: 'HIGH - Using Contentstack Automation (no management token)',
      missingVars: []
    };
  }

  // Test connection method for automation endpoint
  async testConnection(): Promise<boolean> {
    if (!this.isConfigured()) {
      return false;
    }

    try {
      // Simple HEAD request to check if automation endpoint is accessible
      const response = await fetch(this.automationUrl, {
        method: 'HEAD',
        headers: { 'ah-http-key': this.automationKey }
      });
      
      // Automation is accessible if we don't get 401/404
      return response.status !== 401 && response.status !== 404;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const inquiryService = new InquiryService();

// Export for testing
export { InquiryService };
