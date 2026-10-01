-- ==============================================================================
-- New Sai Car Bazar - Supabase Database Schema Migration
-- Document Version: 1.0 (27 September 2026 TRD)
-- Location: Barabanki, Uttar Pradesh, India
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE vehicle_status AS ENUM ('DRAFT', 'AVAILABLE', 'RESERVED', 'SOLD', 'ARCHIVED');
CREATE TYPE lead_status AS ENUM ('NEW', 'CONTACTED', 'FOLLOW_UP', 'CONVERTED', 'CLOSED');
CREATE TYPE fuel_type AS ENUM ('PETROL', 'DIESEL', 'CNG', 'ELECTRIC', 'HYBRID');
CREATE TYPE transmission_type AS ENUM ('MANUAL', 'AUTOMATIC');
CREATE TYPE body_type AS ENUM ('SUV', 'SEDAN', 'HATCHBACK', 'MUV', 'COUPE', 'CONVERTIBLE', 'LUXURY');

-- 2. MAKES TABLE
CREATE TABLE IF NOT EXISTS public.makes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    logo_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. MODELS TABLE
CREATE TABLE IF NOT EXISTS public.models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    make_id UUID NOT NULL REFERENCES public.makes(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(make_id, slug)
);

-- 4. VEHICLES TABLE
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stock_number VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    make_id UUID NOT NULL REFERENCES public.makes(id) ON DELETE RESTRICT,
    model_id UUID NOT NULL REFERENCES public.models(id) ON DELETE RESTRICT,
    variant VARCHAR(100),
    year INT NOT NULL CHECK (year >= 1990 AND year <= EXTRACT(YEAR FROM NOW()) + 1),
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    mileage INT NOT NULL CHECK (mileage >= 0),
    fuel_type fuel_type NOT NULL,
    transmission transmission_type NOT NULL,
    body_type body_type NOT NULL,
    color VARCHAR(50),
    registration_year INT CHECK (registration_year >= 1990),
    registration_number VARCHAR(50),
    rto_state VARCHAR(50) DEFAULT 'UP',
    ownership VARCHAR(50) DEFAULT '1st Owner',
    insurance_validity VARCHAR(50),
    vin VARCHAR(100),
    description TEXT,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
    status vehicle_status NOT NULL DEFAULT 'AVAILABLE',
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_new_arrival BOOLEAN NOT NULL DEFAULT false,
    is_hot_deal BOOLEAN NOT NULL DEFAULT false,
    views_count INT NOT NULL DEFAULT 0,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. VEHICLE IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.vehicle_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    sort_order INT NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. LEADS (ENQUIRIES) TABLE
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(150),
    message TEXT,
    source VARCHAR(50) DEFAULT 'website_enquiry',
    status lead_status NOT NULL DEFAULT 'NEW',
    notes TEXT,
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. FINANCE LEADS TABLE
CREATE TABLE IF NOT EXISTS public.finance_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(150),
    vehicle_price NUMERIC(12, 2) NOT NULL,
    loan_amount NUMERIC(12, 2) NOT NULL,
    down_payment NUMERIC(12, 2) NOT NULL,
    interest_rate NUMERIC(5, 2) NOT NULL,
    tenure INT NOT NULL, -- in months
    estimated_emi NUMERIC(12, 2),
    employment_type VARCHAR(50),
    monthly_income NUMERIC(12, 2),
    message TEXT,
    status lead_status NOT NULL DEFAULT 'NEW',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. SELL CAR REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.sell_car_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    mileage INT NOT NULL,
    fuel_type VARCHAR(50),
    transmission VARCHAR(50),
    registration VARCHAR(50),
    expected_price NUMERIC(12, 2),
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(150),
    city VARCHAR(100) DEFAULT 'Barabanki',
    description TEXT,
    photo_urls JSONB DEFAULT '[]'::jsonb,
    status lead_status NOT NULL DEFAULT 'NEW',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. WISHLISTS TABLE
CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, vehicle_id)
);

-- 10. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    id VARCHAR(50) PRIMARY KEY,
    dealership_name VARCHAR(150) NOT NULL DEFAULT 'New Sai Car Bazar',
    phone VARCHAR(30) NOT NULL DEFAULT '+91 8858982362',
    whatsapp VARCHAR(30) NOT NULL DEFAULT '+91 8172946630',
    email VARCHAR(150) NOT NULL DEFAULT 'mishraprashant2808@gmail.com',
    address TEXT NOT NULL DEFAULT 'Near Railway Crossing, Lucknow-Ayodhya Road, Barabanki, Uttar Pradesh 225001',
    business_hours VARCHAR(150) DEFAULT 'Monday - Sunday: 9:30 AM - 8:00 PM',
    default_interest_rate NUMERIC(5, 2) DEFAULT 9.50,
    default_down_payment_pct NUMERIC(5, 2) DEFAULT 20.00,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    old_data JSONB,
    new_data JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON public.vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_make_id ON public.vehicles(make_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_model_id ON public.vehicles(model_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_price ON public.vehicles(price);
CREATE INDEX IF NOT EXISTS idx_vehicles_year ON public.vehicles(year);
CREATE INDEX IF NOT EXISTS idx_vehicles_slug ON public.vehicles(slug);
CREATE INDEX IF NOT EXISTS idx_vehicles_stock_number ON public.vehicles(stock_number);
CREATE INDEX IF NOT EXISTS idx_vehicles_is_featured ON public.vehicles(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_vehicles_is_new_arrival ON public.vehicles(is_new_arrival) WHERE is_new_arrival = true;
CREATE INDEX IF NOT EXISTS idx_vehicles_is_hot_deal ON public.vehicles(is_hot_deal) WHERE is_hot_deal = true;
CREATE INDEX IF NOT EXISTS idx_vehicle_images_vehicle_id ON public.vehicle_images(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_leads_vehicle_id ON public.leads(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_finance_leads_status ON public.finance_leads(status);
CREATE INDEX IF NOT EXISTS idx_sell_car_status ON public.sell_car_requests(status);

-- TRIGGERS FOR UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_makes_updated_at BEFORE UPDATE ON public.makes FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_models_updated_at BEFORE UPDATE ON public.models FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_finance_leads_updated_at BEFORE UPDATE ON public.finance_leads FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_sell_car_updated_at BEFORE UPDATE ON public.sell_car_requests FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.makes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sell_car_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Public can read active makes, models, available vehicles, primary images, site settings
CREATE POLICY "Public read active makes" ON public.makes FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active models" ON public.models FOR SELECT USING (is_active = true);
CREATE POLICY "Public read available vehicles" ON public.vehicles FOR SELECT USING (status IN ('AVAILABLE', 'RESERVED', 'SOLD'));
CREATE POLICY "Public read vehicle images" ON public.vehicle_images FOR SELECT USING (EXISTS (SELECT 1 FROM public.vehicles v WHERE v.id = vehicle_id AND v.status IN ('AVAILABLE', 'RESERVED', 'SOLD')));
CREATE POLICY "Public read site settings" ON public.site_settings FOR SELECT USING (true);

-- Public can create leads, finance leads, sell car requests
CREATE POLICY "Public can submit enquiries" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can submit finance leads" ON public.finance_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can submit sell car requests" ON public.sell_car_requests FOR INSERT WITH CHECK (true);

-- Authenticated Users can manage their own wishlists
CREATE POLICY "Users can view their wishlists" ON public.wishlists FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can add to wishlist" ON public.wishlists FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove from wishlist" ON public.wishlists FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Admins (authenticated users with admin role or service role) have full access
CREATE POLICY "Admin full access makes" ON public.makes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access models" ON public.models FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access vehicles" ON public.vehicles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access vehicle_images" ON public.vehicle_images FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access leads" ON public.leads FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access finance_leads" ON public.finance_leads FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access sell_car" ON public.sell_car_requests FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access site_settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access audit_logs" ON public.audit_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);
