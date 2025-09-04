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
  private readonly automationUrl = 'https://app.contentstack.com/automations-api/run/50df0b6c8f8b4a0eb7a3589283adfd90';
  private readonly automationKey = 'T5)nvosfymsfx';
  
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
      throw new Error('Service not configured. Please contact support.');
    }

    // Keep the same payload format as before
    const payload = this.buildPayload(appointmentData);

    try {
      const response = await fetch(this.automationUrl, {
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
          throw new Error('Automation endpoint not found. Please check the automation URL.');
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

  // Note: Publishing is handled automatically by Contentstack Automation
  // No manual publish method needed when using automation endpoint

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

  // Test connection method
  async testConnection(): Promise<boolean> {
    if (!this.isConfigured()) {
      return false;
    }

    try {
      // Test with a minimal payload to check if automation is accessible
      const testPayload = { entry: { title: "connection-test" } };
      const response = await fetch(this.automationUrl, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(testPayload)
      });
      
      // Even if automation fails due to invalid data, 200/400 means it's accessible
      return response.status !== 401 && response.status !== 404;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const appointmentService = new AppointmentService();

// Export for testing
export { AppointmentService };
