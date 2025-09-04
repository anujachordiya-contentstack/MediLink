import React, { useState } from 'react';
import { 
  X, Calendar, Clock, User, Mail, Phone, FileText, MessageSquare, 
  CheckCircle, AlertCircle, Loader2, Info 
} from 'lucide-react';
import { appointmentService, type AppointmentData } from '../services/appointmentService';
import { AvailabilitySchedule } from '../types';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorName: string;
  doctorSpecialty: string;
  doctorAddress: string;
  consultationFee: number;
  availabilitySchedule: AvailabilitySchedule[];
}

interface FormData {
  date: string;
  time: string;
  fullName: string;
  email: string;
  phone: string;
  issue: string;
  additionalComments: string;
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  doctorName,
  doctorSpecialty,
  doctorAddress,
  consultationFee,
  availabilitySchedule
}) => {
  const [formData, setFormData] = useState<FormData>({
    date: '',
    time: '',
    fullName: '',
    email: '',
    phone: '',
    issue: '',
    additionalComments: ''
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');



  // Ensure availabilitySchedule is always an array
  const safeAvailabilitySchedule = Array.isArray(availabilitySchedule) ? availabilitySchedule : [];

  // Helper function to convert 12-hour time to 24-hour format for calculations
  const convertTo24Hour = (time12h: string): number => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (modifier === 'PM' && hours !== 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }
    
    return hours * 60 + (minutes || 0); // Return total minutes
  };

  // Helper function to convert minutes back to 12-hour format
  const convertTo12Hour = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${suffix}`;
  };

  // Get available days from doctor's schedule
  const getAvailableDays = (): string[] => {
    return safeAvailabilitySchedule
      .filter(schedule => schedule.is_available)
      .map(schedule => schedule.day.toLowerCase());
  };

  // Generate time slots for a specific day based on doctor's schedule
  const getTimeSlotsForDay = (dayName: string): string[] => {
    const daySchedule = safeAvailabilitySchedule.find(
      schedule => schedule.day.toLowerCase() === dayName.toLowerCase() && schedule.is_available
    );

    if (!daySchedule || daySchedule.hours === 'Closed' || daySchedule.hours.includes('Not Available')) {
      return [];
    }

    // More flexible parsing for different time formats
    // Handles: "10:00 am - 7:00 pm", "10:00 AM - 7:00 PM", "10 am - 7 pm", etc.
    const hoursMatch = daySchedule.hours.match(/(\d{1,2}(?::\d{2})?)\s*(am|pm)\s*[-–]\s*(\d{1,2}(?::\d{2})?)\s*(am|pm)/i);
    
    if (!hoursMatch) {
      // Fallback: try to extract just numbers and assume reasonable times
      const timeNumbers = daySchedule.hours.match(/\d{1,2}/g);
      if (timeNumbers && timeNumbers.length >= 2) {
        const startHour = parseInt(timeNumbers[0]);
        const endHour = parseInt(timeNumbers[1]);
        const startTime = startHour < 12 ? `${startHour}:00 AM` : `${startHour}:00 PM`;
        const endTime = endHour < 12 ? `${endHour}:00 PM` : `${endHour}:00 PM`; // Assume end time is PM
        
        const startMinutes = convertTo24Hour(startTime);
        const endMinutes = convertTo24Hour(endTime);
        
        const slots: string[] = [];
        for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
          slots.push(convertTo12Hour(minutes));
        }
        return slots;
      }
      return [];
    }

    // Add :00 if minutes are missing
    let startTimeStr = hoursMatch[1];
    let endTimeStr = hoursMatch[3];
    
    if (!startTimeStr.includes(':')) startTimeStr += ':00';
    if (!endTimeStr.includes(':')) endTimeStr += ':00';

    const startTime = `${startTimeStr} ${hoursMatch[2].toUpperCase()}`;
    const endTime = `${endTimeStr} ${hoursMatch[4].toUpperCase()}`;

    const startMinutes = convertTo24Hour(startTime);
    const endMinutes = convertTo24Hour(endTime);

    const slots: string[] = [];
    const slotDuration = 30; // 30-minute slots

    for (let minutes = startMinutes; minutes < endMinutes; minutes += slotDuration) {
      slots.push(convertTo12Hour(minutes));
    }

    return slots;
  };

  // Generate available dates (next 30 days when doctor is available)
  const getAvailableDates = (): string[] => {
    const dates: string[] = [];
    const today = new Date();
    const availableDays = getAvailableDays();
    
    // If no availability schedule, default to weekdays
    const daysToCheck = availableDays.length > 0 ? availableDays : ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      
      // Only include dates when doctor is available (or weekdays if no schedule)
      if (daysToCheck.includes(dayName)) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    
    return dates;
  };

  // Get time slots for selected date
  const getTimeSlots = (): string[] => {
    if (!formData.date) {
      return [];
    }

    const selectedDate = new Date(formData.date);
    const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
    
    // Always try to get slots from doctor's schedule first
    if (safeAvailabilitySchedule && safeAvailabilitySchedule.length > 0) {
      const slots = getTimeSlotsForDay(dayName);
      if (slots.length > 0) {
        return slots;
      }
    }
    
    // Always fall back to default time slots if doctor's schedule doesn't work
    return getDefaultTimeSlots();
  };

  // Default time slots for business hours (9 AM - 5 PM)
  const getDefaultTimeSlots = (): string[] => {
    const slots: string[] = [];
    const startMinutes = 9 * 60; // 9 AM
    const endMinutes = 17 * 60; // 5 PM
    
    for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
      slots.push(convertTo12Hour(minutes));
    }
    
    // If conversion fails, use hardcoded slots
    if (slots.length === 0) {
      return [
        '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
        '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
        '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
      ];
    }
    
    return slots;
  };

  const availableDates = getAvailableDates();
  
  // Emergency fallback: If no dates are available, create some
  const safeDates = availableDates.length > 0 ? availableDates : (() => {
    const dates: string[] = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Skip weekends for fallback
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    return dates;
  })();
  
  const timeSlots = getTimeSlots();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      // Clear time selection when date changes (since available times will change)
      if (name === 'date') {
        newData.time = '';
      }
      
      return newData;
    });
    
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    // Required field validation
    if (!formData.date) newErrors.date = 'Please select an appointment date';
    if (!formData.time) newErrors.time = 'Please select an appointment time';
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.issue.trim()) newErrors.issue = 'Please describe your health concern';

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[\d\s\-\(\)]{10,}$/.test(formData.phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number (min 10 digits)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      date: '',
      time: '',
      fullName: '',
      email: '',
      phone: '',
      issue: '',
      additionalComments: ''
    });
    setErrors({});
    setSubmitStatus('idle');
    setStatusMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitStatus('submitting');
    setStatusMessage('Creating your appointment...');

    try {
      // Check if service is configured
      if (!appointmentService.isConfigured()) {
        throw new Error('Appointment system is not configured. Please contact support.');
      }

      // Prepare appointment data
      const appointmentData: AppointmentData = {
        date: formData.date,
        time: formData.time,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        issue: formData.issue,
        additionalComments: formData.additionalComments,
        doctorName: doctorName,
        doctorSpecialty: doctorSpecialty,
        doctorAddress: doctorAddress,
        consultationFee: consultationFee
      };

      // Create appointment via automation (handles creation + publishing automatically)
      await appointmentService.createAppointment(appointmentData);

      // Success - automation handles both creation and publishing
      setSubmitStatus('success');
      setStatusMessage('Appointment booked successfully! You will receive a confirmation email shortly.');
      
      // Auto-close after 3 seconds
      setTimeout(() => {
        resetForm();
        onClose();
      }, 3000);

    } catch (error) {
      console.error('Failed to book appointment:', error);
      
      setSubmitStatus('error');
      
      // User-friendly error messages
      if (error instanceof Error) {
        setStatusMessage(error.message);
      } else {
        setStatusMessage('Failed to book appointment. Please try again or contact support.');
      }
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  // Check if Contentstack is configured
  const configStatus = appointmentService.getConfigStatus();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Book Appointment</h2>
            <p className="text-gray-600 mt-1">
              with {doctorName} • {doctorSpecialty}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={submitStatus === 'submitting'}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Configuration Warning */}
        {!configStatus.configured && (
          <div className="mx-6 mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-amber-600 mr-2 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-amber-800">System Configuration Required</h3>
                <p className="text-sm text-amber-700 mt-1">
                  The appointment system needs to be configured. Missing: {configStatus.missingVars.join(', ')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Preferred Date *
              </label>

              <select
                name="date"
                value={formData.date}
                onChange={(e) => {
                  const selectedDate = e.target.value;
                  
                  // Update form data
                  setFormData(prev => ({
                    ...prev,
                    date: selectedDate,
                    time: ''
                  }));
                  
                  // Clear errors
                  if (errors.date) {
                    setErrors(prev => ({ ...prev, date: '' }));
                  }
                }}
                disabled={submitStatus === 'submitting'}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select an available date</option>
                {safeDates.map(date => (
                  <option key={date} value={date}>
                    {formatDate(date)}
                  </option>
                ))}
              </select>

              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>

            {/* Time Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Preferred Time *
              </label>
              <select
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                disabled={submitStatus === 'submitting' || !formData.date}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 ${
                  errors.time ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">
                  {!formData.date 
                    ? 'Select a date first' 
                    : timeSlots.length === 0 
                    ? 'No available time slots' 
                    : 'Select a time'
                  }
                </option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
              {formData.date && timeSlots.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Available times based on doctor's schedule (30-minute slots)
                </p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                disabled={submitStatus === 'submitting'}
                placeholder="Enter your full name"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={submitStatus === 'submitting'}
                placeholder="your.email@example.com"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={submitStatus === 'submitting'}
                placeholder="+1 (555) 123-4567"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Health Issue */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Health Concern / Reason for Visit *
              </label>
              <textarea
                name="issue"
                value={formData.issue}
                onChange={handleInputChange}
                disabled={submitStatus === 'submitting'}
                placeholder="Please describe your health concern or reason for the appointment..."
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-100 ${
                  errors.issue ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.issue && <p className="text-red-500 text-sm mt-1">{errors.issue}</p>}
            </div>

            {/* Additional Comments */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Additional Comments (Optional)
              </label>
              <textarea
                name="additionalComments"
                value={formData.additionalComments}
                onChange={handleInputChange}
                disabled={submitStatus === 'submitting'}
                placeholder="Any additional information you'd like to share..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className={`mt-6 p-4 rounded-lg border ${
              submitStatus === 'success' 
                ? 'bg-green-50 border-green-200' 
                : submitStatus === 'error'
                ? 'bg-red-50 border-red-200'
                : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-center">
                {submitStatus === 'success' && <CheckCircle className="w-5 h-5 text-green-600 mr-2" />}
                {submitStatus === 'error' && <AlertCircle className="w-5 h-5 text-red-600 mr-2" />}
                {submitStatus === 'submitting' && <Loader2 className="w-5 h-5 text-blue-600 mr-2 animate-spin" />}
                <p className={`text-sm font-medium ${
                  submitStatus === 'success' ? 'text-green-800' : 
                  submitStatus === 'error' ? 'text-red-800' : 'text-blue-800'
                }`}>
                  {statusMessage}
                </p>
              </div>
            </div>
          )}



          {/* Doctor's Availability Info */}
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-green-600" />
              Doctor's Availability
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {safeAvailabilitySchedule.length > 0 ? (
                safeAvailabilitySchedule.map((schedule, index) => (
                  <div key={index} className="flex justify-between">
                    <span className={`font-medium ${schedule.is_available ? 'text-gray-700' : 'text-gray-400'}`}>
                      {schedule.day}:
                    </span>
                    <span className={`${schedule.is_available ? 'text-green-600' : 'text-gray-400'}`}>
                      {schedule.hours}
                    </span>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-gray-500 text-center py-2">
                  Standard business hours (Mon-Fri, 9 AM - 5 PM)
                </div>
              )}
            </div>
          </div>

          {/* Consultation Fee Info */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Consultation Fee</h3>
                <p className="text-sm text-gray-600">
                  Includes initial consultation and follow-up within 7 days
                </p>
              </div>
              <div className="text-2xl font-bold text-blue-600">
              ₹{consultationFee}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitStatus === 'submitting'}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitStatus === 'submitting' || !configStatus.configured}
              className="flex-1 px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitStatus === 'submitting' ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Booking...
                </div>
              ) : (
                `Book Appointment - ₹${consultationFee}`
              )}
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            By booking this appointment, you agree to our terms of service and privacy policy.
            You will receive a confirmation email with appointment details.
          </p>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;