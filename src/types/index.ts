export type VehicleStatus = 'DRAFT' | 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'ARCHIVED';
export type FuelType = 'PETROL' | 'DIESEL' | 'CNG' | 'ELECTRIC' | 'HYBRID';
export type TransmissionType = 'MANUAL' | 'AUTOMATIC';
export type BodyType = 'SUV' | 'SEDAN' | 'HATCHBACK' | 'MUV' | 'COUPE' | 'CONVERTIBLE' | 'LUXURY';
export type LeadStatus = 'NEW' | 'CONTACTED' | 'FOLLOW_UP' | 'CONVERTED' | 'CLOSED';

export interface Make {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  is_active: boolean;
  sort_order: number;
}

export interface Model {
  id: string;
  make_id: string;
  name: string;
  slug: string;
  is_active: boolean;
}

export interface VehicleImage {
  id: string;
  vehicle_id: string;
  storage_path: string;
  image_url: string;
  alt_text?: string;
  sort_order: number;
  is_primary: boolean;
}

export interface Vehicle {
  id: string;
  stock_number: string;
  slug: string;
  make_id: string;
  model_id: string;
  make?: Make;
  model?: Model;
  variant?: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: FuelType;
  transmission: TransmissionType;
  body_type: BodyType;
  color?: string;
  registration_year?: number;
  registration_number?: string;
  rto_state?: string;
  ownership?: string;
  insurance_validity?: string;
  vin?: string;
  description?: string;
  features: string[];
  specifications?: Record<string, string>;
  status: VehicleStatus;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_hot_deal: boolean;
  views_count?: number;
  images: VehicleImage[];
  created_at?: string;
  updated_at?: string;
}

export interface Lead {
  id: string;
  vehicle_id?: string;
  vehicle_name?: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  source: string;
  status: LeadStatus;
  created_at: string;
}

export interface FinanceLead {
  id: string;
  vehicle_id?: string;
  vehicle_name?: string;
  name: string;
  phone: string;
  email?: string;
  vehicle_price: number;
  loan_amount: number;
  down_payment: number;
  interest_rate: number;
  tenure: number;
  estimated_emi: number;
  employment_type?: string;
  monthly_income?: number;
  message?: string;
  status: LeadStatus;
  created_at: string;
}

export interface SellCarRequest {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  fuel_type?: string;
  transmission?: string;
  registration?: string;
  expected_price?: number;
  name: string;
  phone: string;
  email?: string;
  city: string;
  description?: string;
  photo_urls?: string[];
  status: LeadStatus;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  dealership_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  business_hours: string;
  default_interest_rate: number;
  default_down_payment_pct: number;
}

export type DeedType = 'PURCHASE' | 'SALE';
export type RCTransferStatus = 'PENDING' | 'AT_RTO' | 'COMPLETED';

export interface Agreement {
  id: string;
  deed_type: DeedType;
  deed_number: string;
  deed_date: string;
  party_name: string;
  party_relation_type?: string;
  party_relation_name?: string;
  party_address: string;
  party_mobile: string;
  party_id_type?: string;
  party_id_number?: string;
  vehicle_id?: string;
  make_model: string;
  variant?: string;
  color?: string;
  mfg_year?: number;
  reg_year?: number;
  reg_number: string;
  fuel_type?: string;
  chassis_number?: string;
  engine_number?: string;
  odometer_reading?: number;
  reg_rto?: string;
  insurance_policy_no?: string;
  insurance_validity?: string;
  puc_number?: string;
  puc_validity?: string;
  total_price: number;
  total_price_words: string;
  advance_amount: number;
  advance_receipt_no?: string;
  balance_amount: number;
  payment_mode_1?: string;
  payment_ref_1?: string;
  payment_date_1?: string;
  payment_place_1?: string;
  rc_transfer_status: RCTransferStatus;
  form29_received?: boolean;
  form30_received?: boolean;
  rc_transfer_date?: string;
  rto_receipt_no?: string;
  notes?: string;
  witness1_name?: string;
  witness1_address?: string;
  witness1_mobile?: string;
  witness2_name?: string;
  witness2_address?: string;
  witness2_mobile?: string;
  created_at: string;
  updated_at?: string;
}

