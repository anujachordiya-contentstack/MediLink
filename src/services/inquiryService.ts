/**
 * Contentstack Management API Service for Inquiry Submissions
 * Handles creating and managing user inquiries in Contentstack CMS
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
  private readonly baseUrl = 'https://api.contentstack.io/v3';
  private readonly contentTypeUid = 'inquiry_form';
  
  private apiKey: string;
  private managementToken: string;
  private environment: string;

  constructor() {
    // Load environment variables
    this.apiKey = import.meta.env.VITE_CONTENTSTACK_API_KEY || '';
    this.managementToken = import.meta.env.VITE_CONTENTSTACK_MANAGEMENT_TOKEN || '';
    this.environment = import.meta.env.VITE_CONTENTSTACK_ENVIRONMENT || 'development';
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'api_key': this.apiKey,
      'authorization': this.managementToken
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
      throw new Error('Contentstack not configured. Please set up environment variables.');
    }

    const payload = this.buildPayload(inquiryData);
    const url = `${this.baseUrl}/content_types/${this.contentTypeUid}/entries?environment=${this.environment}`;

    // Creating inquiry entry

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });

      const responseData = await response.json();

      if (!response.ok) {
              // Contentstack API Error

        // Provide specific error messages based on the Contentstack documentation
        if (response.status === 401) {
          throw new Error('Authentication failed. Please check your API key and management token.');
        } else if (response.status === 422) {
          throw new Error('Invalid data format. Please check the content type structure in Contentstack.');
        } else if (response.status === 404) {
          throw new Error(`Content type '${this.contentTypeUid}' not found. Please create it in Contentstack.`);
        } else {
          throw new Error(`API Error: ${response.status} - ${responseData.error_message || 'Unknown error'}`);
        }
      }

      // Inquiry created successfully

      return responseData;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection.');
      }
      throw error;
    }
  }

  async publishInquiry(entryUid: string): Promise<void> {
    if (!this.isConfigured()) {
      throw new Error('Contentstack not configured.');
    }

    const url = `${this.baseUrl}/content_types/${this.contentTypeUid}/entries/${entryUid}/publish`;
    const payload = {
      entry: {
        environments: [this.environment]
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to publish inquiry: ${response.status} ${errorData.error_message || ''}`);
      }

      // Inquiry published successfully
    } catch (error) {
      // Failed to publish inquiry (entry was still created)
      throw error;
    }
  }

  isConfigured(): boolean {
    return !!(this.apiKey && this.managementToken);
  }

  getConfigStatus() {
    return {
      configured: this.isConfigured(),
      apiKey: !!this.apiKey,
      managementToken: !!this.managementToken,
      environment: this.environment,
      contentType: this.contentTypeUid,
      missingVars: [
        ...(!this.apiKey ? ['VITE_CONTENTSTACK_API_KEY'] : []),
        ...(!this.managementToken ? ['VITE_CONTENTSTACK_MANAGEMENT_TOKEN'] : [])
      ]
    };
  }

  // Test connection method
  async testConnection(): Promise<boolean> {
    if (!this.isConfigured()) {
      return false;
    }

    try {
      const response = await fetch(`${this.baseUrl}/content_types/${this.contentTypeUid}?environment=${this.environment}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const inquiryService = new InquiryService();

// Export for testing
export { InquiryService };
