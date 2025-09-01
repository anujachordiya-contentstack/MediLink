// Base Contentstack types
export interface ContentstackEntry {
  uid: string;
  title: string;
  url?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  locale: string;
  tags: string[];
}

export interface ContentstackAsset {
  uid: string;
  title: string;
  description?: string;
  filename: string;
  url: string;
  content_type: string;
  file_size: number;
  dimension?: {
    height: number;
    width: number;
  };
}

// Doctor Card content type (matches actual CMS structure)
export interface DoctorCardCMS extends ContentstackEntry {
  title: string; // Doctor name like "Dr. Michael Johnson"
  speciality: string; // Note: "speciality" not "specialty"
  image?: ContentstackAsset;
  experience: string; // String like "10 years"
  language: string; // String like "English, French"
  ratings: {
    value: number; // Nested rating value
  };
  reviews: string; // String like "16 reviews"
  slug?: string; // URL slug for the doctor
  doctor_bio?: string; // Doctor's biography
  
  // Consultation fee structure
  consultation_fee: {
    fee: string; // Fee amount like "600"
    fee_info: string; // Additional fee information
  };
  
  // Contact information
  contact_info: {
    address: string;
    contact_no: string;
    email_id: string;
  };
  
  // Education qualifications
  qualifications_education?: Array<{
    education: {
      degree: string;
      institution: string;
      year: number;
      _metadata: { uid: string };
    };
  }>;
  
  // Availability slots
  availability_slots?: Array<{
    availability: {
      days: string;
      start_time: string;
      end_time: string;
      _metadata: { uid: string };
    };
  }>;
  
  // References to other content types
  button_reference?: Array<{
    uid: string;
    _content_type_uid: string;
  }>;
  
  specialization_reference?: Array<{
    uid: string;
    _content_type_uid: string;
  }>;
  
  reference?: Array<{
    uid: string;
    _content_type_uid: string;
  }>;
  
  // Legacy fields for backward compatibility
  location?: string;
  availability_status?: string;
  about_description?: string;
  qualifications?: any[];
  specializations?: string[];
  contact_phone?: string;
  contact_email?: string;
  clinic_address?: string;
  is_featured?: boolean;
  display_order?: number;
}

// Normalized Doctor Card interface (for component usage)
export interface DoctorCard extends ContentstackEntry {
  reviews: number;
  fee: number;
  experience: number;
  doctor_name: string;
  specialty: string;
  profile_image?: ContentstackAsset;
  experience_years: number;
  consultation_fee: number;
  consultation_fee_object?: {
    fee: string;
    fee_info: string;
  };
  languages: string[];
  rating: number;
  total_reviews: number;
  location: string;
  availability_status: string;
  about_description: string;
  qualifications?: any[];
  specializations?: string[];
  contact_phone: string;
  contact_email: string;
  clinic_address: string;
  is_featured?: boolean;
  display_order?: number;
}

// Normalized Featured Doctors Section interface (for component usage)
export interface NormalizedFeaturedDoctorsSection {
  uid: string;
  title: string;
  description: string;
  reference: DoctorCardCMS[]; // Raw CMS doctor cards
  display_limit?: number;
}

// Featured Doctors Section (for home page)
export interface FeaturedDoctorsSection extends ContentstackEntry {
  title: string; // Section title (e.g., "Featured Doctors")
  description: string; // Section description
  reference: DoctorCardCMS[]; // Referenced doctor cards from CMS
  display_limit?: number; // Maximum number of doctors to display
}

// Legacy Doctor interface (keeping for compatibility)
export interface Doctor extends ContentstackEntry {
  name: string;
  specialty: string;
  profile_image: ContentstackAsset;
  experience_years: number;
  consultation_fee: number;
  languages: string[];
  rating: number;
  total_reviews: number;
  location: string;
  availability_status: string;
  about_description: string;
  qualifications: Qualification[];
  qualifications_education?: any[]; // Raw CMS education data
  specializations: Specialization[];
  contact_phone: string;
  contact_email: string;
  clinic_address: string;
  availability_schedule: AvailabilitySchedule[];
}

// Featured Doctors Section
export interface FeaturedDoctorsSection extends ContentstackEntry {
  section_title: string;
  section_subtitle: string;
  featured_doctors: DoctorCard[];
}

export interface Qualification extends ContentstackEntry {
  degree_name: string;
  institution: string;
  completion_year: string;
  qualification_type: 'degree' | 'fellowship' | 'certification';
}

export interface Specialization extends ContentstackEntry {
  name: string;
  description?: string;
  icon_name?: string;
}

export interface Article extends ContentstackEntry {
  article_title: string;
  description: string;
  featured_image: ContentstackAsset;
  published_date: string;
  author: Doctor;
  content: string;
  excerpt: string;
  reading_time?: number;
  tags: string[];
  category: string;
}

export interface MedicalSpecialty extends ContentstackEntry {
  title: string; // This is the specialty name
  description: string; // This is the specialty description
  image_icon?: ContentstackAsset;
  link?: {
    title: string;
    href: string;
  };
  slug?: string;
  display_order?: number; // May not exist in your setup
}

export interface MedicalSpecialtiesSection extends ContentstackEntry {
  title: string; // This is the section title
  description: string; // This is the section subtitle  
  reference: MedicalSpecialty[]; // Referenced specialties
}

export interface Testimonial extends ContentstackEntry {
  patient_name: string;
  patient_image?: ContentstackAsset;
  testimonial_text: string;
  rating: number;
  doctor: Doctor;
  date: string;
}

export interface HomePageContent extends ContentstackEntry {
  hero_title: string;
  hero_subtitle: string;
  hero_image: ContentstackAsset;
  hero_cta_primary: string;
  hero_cta_secondary: string;
  featured_specialties: MedicalSpecialty[];
  featured_doctors: Doctor[];
  featured_articles: Article[];
  testimonials: Testimonial[];
}

export interface GlobalSettings extends ContentstackEntry {
  site_name: string;
  site_logo: ContentstackAsset;
  contact_phone: string;
  contact_email: string;
  address: string;
  social_media: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  footer_text: string;
  emergency_number: string;
}

export interface NavigationMenuItem {
  label: string;
  _metadata: {
    uid: string;
  };
  link?: {
    title: string;
    href: string;
  };
}

export interface HeaderContent extends ContentstackEntry {
  title: string; // This is the site name
  logo?: ContentstackAsset;
  navigation_menu: NavigationMenuItem[];
  // Optional fields that may not exist in your current setup
  tagline?: string;
  primary_color?: string;
  secondary_color?: string;
  show_emergency_contact?: boolean;
  emergency_number?: string;
  cta_button?: {
    text: string;
    url: string;
    style: 'primary' | 'secondary';
  };
}

export interface AvailabilitySchedule {
  day: string;
  hours: string;
  is_available: boolean;
}

export interface Button extends ContentstackEntry {
  label: string;
  link: {
    href: string;
    title: string;
    url: string;
  };
  button_style?: 'primary' | 'secondary';
  button_type?: 'link' | 'external';
}

export interface HeroSection extends ContentstackEntry {
  banner_image: any;
  title: string; // This is the hero title
  description: string; // This is the hero subtitle
  hero_image?: ContentstackAsset;
  reference?: Button[]; // Referenced button content types
  background_color?: string;
  text_color?: string;
}

export interface FindDoctorsPageContent extends ContentstackEntry {
  page_title: string; // Main page title
  page_subtitle: string; // Page description
  search_placeholder: string; // Search input placeholder text
  specialty_filter_label: string; // Specialty filter label
  results_text: string; // Results count text template
  no_results_title: string; // No results message title
  no_results_message: string; // No results message description
  load_more_button_text: string; // Load more button text
  clear_filters_text: string; // Clear filters button text
  featured_badge_text?: string; // Text for featured doctor badges
  meta_title?: string; // SEO meta title
  meta_description?: string; // SEO meta description
}

// About Us Page Content Types (matching actual Contentstack structure)

// Vision and Values content type
export interface VisionAndValues extends ContentstackEntry {
  title: string;
  description: string;
  icon_name?: string;
  display_order?: number;
}

// Our Team content type  
export interface OurTeam extends ContentstackEntry {
  name: string;
  title: string; // Role/position
  bio: string;
  profile_image?: ContentstackAsset;
  display_order?: number;
  social_links?: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

// How It Works content type
export interface HowItWorks extends ContentstackEntry {
  step_number: number;
  title: string;
  description: string;
  icon_name?: string;
  display_order?: number;
}

export interface AboutUsPageContent extends ContentstackEntry {
  // Hero Section
  banner_heading: string;
  
  // Mission Section
  mission_title: string;
  mission_statment: string; // Note: typo in CMS field name
  
  // Vision & Values Section
  vision_values: {
    vision_value_title: string;
    vision_and_values: VisionAndValues[];
  };
  
  // Team Section
  our_team: {
    team_title: string;
    team_description: string;
    team_members: OurTeam[];
  };
  
  // How It Works Section
  how_it_works: {
    how_it_works_title: string;
    how_it_works_description: string;
    how_it_works_steps: HowItWorks[];
  };
  
  // Call to Action Section
  ready_to_connect: {
    ready_to_connect_title: string;
    description: string;
    button_reference: Button[];
  };
}

// Footer Content Types (matching actual Contentstack structure)

export interface FooterLink {
  name: string;
  _metadata: {
    uid: string;
  };
  link: {
    title: string;
    href: string;
  };
}

export interface FooterQuickLinks {
  title: string;
  links: FooterLink[];
}

export interface FooterSupport {
  title: string;
  support_links: FooterLink[];
}

export interface FooterContactInfo {
  email: string;
  address: string;
  contact_number: string;
}

export interface FooterCopyright {
  type: string;
  attrs: any;
  uid: string;
  children: Array<{
    type: string;
    attrs: any;
    uid: string;
    children: Array<{
      text: string;
    }>;
  }>;
  _version: number;
}

export interface FooterContent extends ContentstackEntry {
  // Brand section (from actual JSON)
  title: string; // Brand name
  footer_banner: string; // Brand description
  
  // Contact information
  contact_info: FooterContactInfo;
  
  // Copyright (rich text)
  copyright: FooterCopyright;
  
  // Quick links section
  footer_quick_links: FooterQuickLinks;
  
  // Support section
  support: FooterSupport;
}

// Legacy interfaces for fallback compatibility
export interface FooterSocialLink extends ContentstackEntry {
  platform: string;
  url: string;
  icon_name?: string;
  display_order?: number;
}

export interface FooterNavigationLink extends ContentstackEntry {
  label: string;
  url: string;
  link_type?: 'internal' | 'external';
  display_order?: number;
}

// Health Advice Section Interfaces
export interface HealthAdviceArticle extends ContentstackEntry {
  article_name: string; // Article title (matches actual API field name)
  short_description: string; // Short description for cards (matches actual API field name)
  article_description?: string; // Full rich text content (matches actual API field name)
  image?: ContentstackAsset; // Article image (matches actual API field name)
  doctor_reference?: DoctorCardCMS[]; // Reference to doctor who wrote the article (matches actual API field name)
  buttons?: Button[]; // Call-to-action buttons (matches actual API field name)
  
  // Additional computed fields for backward compatibility
  publish_date?: string;
  category?: string;
  read_time?: string;
  featured?: boolean;
}

export interface HealthAdviceSection extends ContentstackEntry {
  title: string; // Section title
  sub_header: string; // Section description (matches actual API field name)
  health_advices: HealthAdviceArticle[]; // Referenced health advice articles (matches actual API field name)
  featured_articles?: HealthAdviceArticle[]; // Optional featured articles
  cta_buttons?: Button[]; // Section-level call-to-action buttons
}

// Patient Inquiries Page Content Types (matches actual Contentstack structure)
export interface PatientInquiriesContactDetails {
  contact_support: string;
  phone_support: {
    phone_no: string;
    phone_header: string;
    sub_header: string;
  };
  email_support: {
    header: string;
    email: string;
    sub_header: string;
  };
  operating_hours: {
    header: string;
    sub_header: string;
    timings: string; // HTML string with operating hours
  };
  emergency: {
    emergency_header: string;
  };
}

export interface PatientInquiriesPageContent extends ContentstackEntry {
  header: string; // Main page title (matches actual API field)
  sub_header: string; // Page description/subtitle (matches actual API field)  
  contact_details: PatientInquiriesContactDetails; // Contact information section (matches actual API structure)
  meta_title?: string; // SEO meta title
  meta_description?: string; // SEO meta description
}
