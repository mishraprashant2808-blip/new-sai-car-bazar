-- ==============================================================================
-- New Sai Car Bazar - Seed Data Migration
-- ==============================================================================

-- 1. Insert Site Settings
INSERT INTO public.site_settings (id, dealership_name, phone, whatsapp, email, address, business_hours, default_interest_rate, default_down_payment_pct)
VALUES (
    'default',
    'New Sai Car Bazar',
    '+91 8858982362',
    '+91 8172946630',
    'mishraprashant2808@gmail.com',
    'Near Railway Crossing, Lucknow-Ayodhya National Highway, Barabanki, Uttar Pradesh 225001',
    'Monday - Sunday: 9:30 AM - 8:30 PM',
    9.50,
    20.00
) ON CONFLICT (id) DO UPDATE SET
    dealership_name = EXCLUDED.dealership_name,
    phone = EXCLUDED.phone,
    whatsapp = EXCLUDED.whatsapp,
    email = EXCLUDED.email,
    address = EXCLUDED.address;

-- 2. Insert Makes
INSERT INTO public.makes (id, name, slug, sort_order) VALUES
('b0000001-0000-0000-0000-000000000001', 'Toyota', 'toyota', 1),
('b0000001-0000-0000-0000-000000000002', 'Ford', 'ford', 2),
('b0000001-0000-0000-0000-000000000003', 'Honda', 'honda', 3),
('b0000001-0000-0000-0000-000000000004', 'BMW', 'bmw', 4),
('b0000001-0000-0000-0000-000000000005', 'Mercedes', 'mercedes', 5),
('b0000001-0000-0000-0000-000000000006', 'Audi', 'audi', 6),
('b0000001-0000-0000-0000-000000000007', 'Nissan', 'nissan', 7),
('b0000001-0000-0000-0000-000000000008', 'Jeep', 'jeep', 8),
('b0000001-0000-0000-0000-000000000009', 'Chevrolet', 'chevrolet', 9),
('b0000001-0000-0000-0000-000000000010', 'Volkswagen', 'volkswagen', 10),
('b0000001-0000-0000-0000-000000000011', 'Hyundai', 'hyundai', 11),
('b0000001-0000-0000-0000-000000000012', 'Mahindra', 'mahindra', 12),
('b0000001-0000-0000-0000-000000000013', 'Tata', 'tata', 13),
('b0000001-0000-0000-0000-000000000014', 'Maruti Suzuki', 'maruti-suzuki', 14)
ON CONFLICT (slug) DO NOTHING;

-- 3. Insert Models
INSERT INTO public.models (id, make_id, name, slug) VALUES
('c0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', 'Fortuner', 'fortuner'),
('c0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000001', 'Innova Crysta', 'innova-crysta'),
('c0000001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000002', 'EcoSport', 'ecosport'),
('c0000001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000002', 'Endeavour', 'endeavour'),
('c0000001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000003', 'City', 'city'),
('c0000001-0000-0000-0000-000000000006', 'b0000001-0000-0000-0000-000000000004', '3 Series', '3-series'),
('c0000001-0000-0000-0000-000000000007', 'b0000001-0000-0000-0000-000000000005', 'C-Class', 'c-class'),
('c0000001-0000-0000-0000-000000000008', 'b0000001-0000-0000-0000-000000000006', 'A4', 'a4'),
('c0000001-0000-0000-0000-000000000009', 'b0000001-0000-0000-0000-000000000008', 'Compass', 'compass'),
('c0000001-0000-0000-0000-000000000010', 'b0000001-0000-0000-0000-000000000011', 'Creta', 'creta'),
('c0000001-0000-0000-0000-000000000011', 'b0000001-0000-0000-0000-000000000012', 'Scorpio-N', 'scorpio-n'),
('c0000001-0000-0000-0000-000000000012', 'b0000001-0000-0000-0000-000000000013', 'Harrier', 'harrier'),
('c0000001-0000-0000-0000-000000000013', 'b0000001-0000-0000-0000-000000000014', 'Swift', 'swift')
ON CONFLICT (make_id, slug) DO NOTHING;

-- 4. Insert Vehicles
INSERT INTO public.vehicles (
    id, stock_number, slug, make_id, model_id, variant, year, price, mileage,
    fuel_type, transmission, body_type, color, registration_year, registration_number,
    rto_state, ownership, insurance_validity, description, features,
    status, is_featured, is_new_arrival, is_hot_deal
) VALUES
(
    'd0000001-0000-0000-0000-000000000001',
    'NSCB-2024-001',
    'toyota-fortuner-2-8-4x2-at-2023',
    'b0000001-0000-0000-0000-000000000001',
    'c0000001-0000-0000-0000-000000000001',
    '2.8 4x2 AT',
    2023,
    3450000.00,
    28500,
    'DIESEL',
    'AUTOMATIC',
    'SUV',
    'Super White',
    2023,
    'UP 32 NX 8899',
    'UP',
    '1st Owner',
    'Comprehensive until Nov 2026',
    'Pristine condition Toyota Fortuner 2.8 Diesel AT. Meticulously maintained with full Toyota authorized service records. Non-accidental, certified 150-point inspection cleared. Loaded with leather interiors, Apple CarPlay, power tailgate, and 7 airbags.',
    '["Leather Seats", "Sunroof", "Ventilated Seats", "Apple CarPlay & Android Auto", "360 Camera", "Cruise Control", "Power Tailgate", "7 Airbags", "Alloy Wheels", "LED Projector Headlamps"]'::jsonb,
    'AVAILABLE',
    true,
    false,
    false
),
(
    'd0000001-0000-0000-0000-000000000002',
    'NSCB-2024-002',
    'hyundai-creta-sx-o-diesel-at-2024',
    'b0000001-0000-0000-0000-000000000011',
    'c0000001-0000-0000-0000-000000000010',
    'SX (O) Diesel AT',
    2024,
    1820000.00,
    12400,
    'DIESEL',
    'AUTOMATIC',
    'SUV',
    'Titan Grey',
    2024,
    'UP 41 BF 1234',
    'UP',
    '1st Owner',
    'Zero Depreciation until March 2027',
    'Practically brand new Creta Facelift Top Model SX (O). Features Level 2 ADAS, panoramic sunroof, Bose sound system, twin 10.25-inch screens. Single owner corporate vehicle.',
    '["Panoramic Sunroof", "ADAS Level 2", "Bose 8-Speaker Audio", "Ventilated Front Seats", "Dual Zone Climate Control", "Electronic Parking Brake", "Wireless Charger", "Connected Car Tech"]'::jsonb,
    'AVAILABLE',
    true,
    true,
    false
),
(
    'd0000001-0000-0000-0000-000000000003',
    'NSCB-2024-003',
    'bmw-3-series-320d-luxury-line-2022',
    'b0000001-0000-0000-0000-000000000004',
    'c0000001-0000-0000-0000-000000000006',
    '320d Luxury Line',
    2022,
    3890000.00,
    34000,
    'DIESEL',
    'AUTOMATIC',
    'SEDAN',
    'Mineral White Metallic',
    2022,
    'UP 32 LK 0007',
    'UP',
    '1st Owner',
    'Comprehensive until Aug 2026',
    'Executive driven BMW 320d Luxury Line. Seamless 8-speed Steptronic transmission, exhilarating rear-wheel drive dynamics, Cognac Vernasca leather seats, BMW Live Cockpit Professional.',
    '["Vernasca Leather", "BMW Live Cockpit Pro", "Ambient Lighting 64 Colors", "Harman Kardon Sound", "Sunroof", "Reverse Assistant", "Wireless Apple CarPlay", "Sport Seats"]'::jsonb,
    'AVAILABLE',
    true,
    false,
    true
),
(
    'd0000001-0000-0000-0000-000000000004',
    'NSCB-2024-004',
    'mahindra-scorpio-n-z8l-4wd-diesel-at-2023',
    'b0000001-0000-0000-0000-000000000012',
    'c0000001-0000-0000-0000-000000000011',
    'Z8L 4WD Diesel AT',
    2023,
    2350000.00,
    21000,
    'DIESEL',
    'AUTOMATIC',
    'SUV',
    'Napoli Black',
    2023,
    'UP 41 AK 9988',
    'UP',
    '1st Owner',
    'Valid until Oct 2026',
    'Top variant Scorpio-N 4Xplor with intelligent 4WD terrain modes. Sony 12-speaker audio system, rich coffee-black leatherette seats, dual-zone AC, wireless charging, commanding road presence.',
    '["4Xplor 4WD Modes", "Sony 12-Speaker 3D Audio", "Sunroof", "Captain Seats 6-Seater", "Front Camera", "Driver Drowsiness Alert", "Push Button Start", "Hill Descent Control"]'::jsonb,
    'AVAILABLE',
    false,
    true,
    false
),
(
    'd0000001-0000-0000-0000-000000000005',
    'NSCB-2024-005',
    'honda-city-zx-cvt-petrol-2023',
    'b0000001-0000-0000-0000-000000000003',
    'c0000001-0000-0000-0000-000000000005',
    'ZX CVT i-VTEC',
    2023,
    1380000.00,
    19500,
    'PETROL',
    'AUTOMATIC',
    'SEDAN',
    'Golden Brown Metallic',
    2023,
    'UP 32 PK 4512',
    'UP',
    '1st Owner',
    'Valid until Jan 2027',
    'The king of mid-size sedans. Honda City 5th Gen top-tier ZX trim with buttery-smooth CVT gearbox, Honda Sensing ADAS, lane watch camera, electric sunroof, unmatched rear-seat lounge comfort.',
    '["Honda Sensing ADAS", "LaneWatch Camera", "Electric Sunroof", "Full LED Headlamps", "8-inch Touchscreen", "Leather Upholstery", "Remote Engine Start", "Paddle Shifters"]'::jsonb,
    'AVAILABLE',
    false,
    false,
    true
),
(
    'd0000001-0000-0000-0000-000000000006',
    'NSCB-2024-006',
    'tata-harrier-fearless-plus-dark-at-2023',
    'b0000001-0000-0000-0000-000000000013',
    'c0000001-0000-0000-0000-000000000012',
    'Fearless+ Dark Edition AT',
    2023,
    2280000.00,
    18700,
    'DIESEL',
    'AUTOMATIC',
    'SUV',
    'Oberon Black',
    2023,
    'UP 32 MQ 1111',
    'UP',
    '1st Owner',
    'Comprehensive until Dec 2026',
    'Stunning #DARK Edition Tata Harrier Facelift. Equipped with 12.3-inch Harman touchscreen, JBL 10-speaker system, Level 2 ADAS, memory driver seat, paddle shifters, voice-assisted panoramic sunroof.',
    '["#DARK Theme Styling", "12.3-inch Harman Display", "JBL 10-Speaker Audio", "ADAS Suite", "Memory Driver Seat", "360 Surround View", "Air Purifier", "Wireless Apple CarPlay"]'::jsonb,
    'AVAILABLE',
    true,
    false,
    false
)
ON CONFLICT (slug) DO NOTHING;

-- 5. Insert Images for the vehicles
INSERT INTO public.vehicle_images (vehicle_id, storage_path, image_url, alt_text, sort_order, is_primary) VALUES
('d0000001-0000-0000-0000-000000000001', 'toyota/fortuner-1.webp', 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1200&q=80', 'Toyota Fortuner Front Exterior', 0, true),
('d0000001-0000-0000-0000-000000000001', 'toyota/fortuner-2.webp', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80', 'Toyota Fortuner Rear Side Angle', 1, false),
('d0000001-0000-0000-0000-000000000001', 'toyota/fortuner-3.webp', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80', 'Toyota Fortuner Interior Cabin', 2, false),

('d0000001-0000-0000-0000-000000000002', 'hyundai/creta-1.webp', 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80', 'Hyundai Creta Front View', 0, true),
('d0000001-0000-0000-0000-000000000002', 'hyundai/creta-2.webp', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80', 'Hyundai Creta Side Profile', 1, false),

('d0000001-0000-0000-0000-000000000003', 'bmw/320d-1.webp', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80', 'BMW 3 Series Luxury Line Front', 0, true),
('d0000001-0000-0000-0000-000000000003', 'bmw/320d-2.webp', 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80', 'BMW 3 Series Dashboard and Steering', 1, false),

('d0000001-0000-0000-0000-000000000004', 'mahindra/scorpio-1.webp', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80', 'Mahindra Scorpio-N Black Front Angle', 0, true),

('d0000001-0000-0000-0000-000000000005', 'honda/city-1.webp', 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80', 'Honda City Sedan Front', 0, true),

('d0000001-0000-0000-0000-000000000006', 'tata/harrier-1.webp', 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80', 'Tata Harrier Dark Edition', 0, true);
