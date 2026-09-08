// TypeScript definitions for Résidence NOEMA Web Platform & CRM

export type ApartmentStatus = 'available' | 'option' | 'reserved' | 'sold';

export type ApartmentType = 't2' | 't3';

export interface Apartment {
  id: string;
  ref: string;
  name: string;
  type: ApartmentType;
  commercial_segment?: 'standard' | 'premium' | 'prestige' | 'penthouse';
  is_public?: boolean;
  rooms_count: number;
  bedrooms_count: number;
  bathrooms_count: number;
  surface_sqm: number;
  balcony_surface_sqm: number;
  floor: string;
  price_fcfa: number;
  price_launch_fcfa?: number | null;
  price_structure_fcfa?: number | null;
  price_closed_fcfa?: number | null;
  status: ApartmentStatus;
  description: string;
  key_features: string[];
  composition?: string[];
  parking_notes?: string;
  orientation_notes?: string;
  view_notes?: string;
  photos: string[];
  floor_plan_image?: string;
  display_order: number;
  is_featured: boolean;
}

export interface ResidenceInfo {
  id: string;
  name: string;
  tagline: string;
  city: string;
  district: string;
  country: string;
  description: string;
  architectural_concept: string;
  total_units: number;
  floors: string;
  delivery_date_estimated: string;
  status: string;
  hero_image: string;
  whatsapp_number: string;
  phone_number: string;
  email_contact: string;
  financing_partners?: string;
  financing_notes?: string;
  indicative_interest_rate: number;
  indicative_debt_ratio_limit: number;
  address_details: string;
  gps_coordinates: {
    lat: number;
    lng: number;
  };
}

export type ConstructionStatus = 'completed' | 'in_progress' | 'upcoming';

export interface ConstructionMilestone {
  id: string;
  stage_number: number;
  title: string;
  description: string;
  status: ConstructionStatus;
  progress_percent: number;
  date_display: string;
  photo?: string;
  is_3d_render: boolean;
  video_url?: string;
}

export interface FAQItem {
  id: string;
  category: 'projet' | 'financement' | 'diaspora' | 'reservation' | 'chantier';
  question: string;
  answer: string;
  display_order: number;
  is_published: boolean;
}

export type PipelineStage = 
  | 'new' 
  | 'qualified' 
  | 'contacted' 
  | 'meeting_scheduled' 
  | 'file_review' 
  | 'reserved' 
  | 'sold';

export interface SimulationResult {
  apartment_id?: string;
  apartment_ref?: string;
  apartment_price: number;
  down_payment: number;
  loan_amount: number;
  duration_years: number;
  interest_rate: number;
  monthly_payment: number;
  monthly_income: number;
  existing_loans: number;
  available_monthly_income: number;
  recommended_monthly_budget: number;
  loan_to_value_percent: number;
  debt_ratio_percent: number;
  is_debt_ratio_healthy: boolean;
}

export interface LeadSubmission {
  first_name: string;
  last_name: string;
  phone_whatsapp: string;
  email: string;
  residence_country: string;
  age?: number;
  employment_status?: string;
  professional_seniority_years?: number;
  has_co_borrower?: boolean;
  co_borrower_monthly_income?: number;
  additional_monthly_income?: number;
  project_purpose?: string;
  funds_availability?: string;
  monthly_net_income?: number;
  down_payment?: number;
  existing_monthly_loans?: number;
  desired_duration_years?: number;
  interested_apartment_id?: string;
  interested_apartment_ref?: string;
  interested_apartment_price?: number;
  simulation?: SimulationResult;
  notes?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  consent_marketing: boolean;
  consent_data_processing: boolean;
  ai_conversation_summary?: string;
}

export interface LeadRecord extends LeadSubmission {
  id: string;
  pipeline_stage: PipelineStage;
  created_at: string;
  updated_at: string;
  follow_up_count: number;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggested_actions?: Array<{
    label: string;
    actionType: 'select_apartment' | 'open_simulator' | 'open_whatsapp' | 'book_call' | 'query';
    payload?: string;
  }>;
  related_apartment_id?: string;
}
