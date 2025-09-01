/**
 * Contentstack Management API Service for Appointment Booking
 * Handles creating and managing doctor appointments in Contentstack CMS
 */

export interface AppointmentData {
  date: string;
  time: string;
  fullName: string;
  email: string;
  phone: string;
  issue: string;
  additionalComments?: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAddress: string;
  consultationFee: number;
}

export interface ContentstackAppointmentEntry {
  title: string;
  name: string;
  email: string;
  contact_no: string;
  reason_for_visit: string;
  additional_comments: string;
  date: string;
  time: string;
  doctor_name: string;
  doctor_specialty: string;
  doctor_address: string;
  consultation_fee: number;
  tags: string[];
}

export interface ContentstackResponse {
  entry: ContentstackAppointmentEntry & {
    uid: string;
    created_at: string;
    updated_at: string;
    title: string;
  };
  notice?: string;
}

class AppointmentService {
  private readonly baseUrl = 'https://api.contentstack.io/v3';
  private readonly contentTypeUid = 'doctor_appointment';
  
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

  private buildPayload(appointmentData: AppointmentData): { entry: ContentstackAppointmentEntry } {
    return {
      entry: {
        title: `Appointment - ${appointmentData.fullName} with ${appointmentData.doctorName}`,
        name: appointmentData.fullName,
        email: appointmentData.email,
        contact_no: appointmentData.phone,
        reason_for_visit: appointmentData.issue,
        additional_comments: appointmentData.additionalComments || '',
        date: appointmentData.date,
        time: appointmentData.time,
        doctor_name: appointmentData.doctorName,
        doctor_specialty: appointmentData.doctorSpecialty,
        doctor_address: appointmentData.doctorAddress,
        consultation_fee: appointmentData.consultationFee,
        tags: []
      }
    };
  }

  async createAppointment(appointmentData: AppointmentData): Promise<ContentstackResponse> {
    if (!this.isConfigured()) {
      throw new Error('Contentstack not configured. Please set up environment variables.');
    }

    const payload = this.buildPayload(appointmentData);
    const url = `${this.baseUrl}/content_types/${this.contentTypeUid}/entries?environment=${this.environment}`;

    // Creating appointment entry

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Contentstack API Error

        // Provide specific error messages
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

      // Appointment created successfully

      return responseData;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection.');
      }
      throw error;
    }
  }

  async publishAppointment(entryUid: string): Promise<void> {
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
        throw new Error(`Failed to publish appointment: ${response.status} ${errorData.error_message || ''}`);
      }

      // Appointment published successfully
    } catch (error) {
      // Failed to publish appointment (entry was still created)
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
export const appointmentService = new AppointmentService();

// Export for testing
export { AppointmentService };
