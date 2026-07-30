-- Simple Seed Script for Ethiopian Navigator MVP
-- Direct inserts without complex conflict handling

-- Ensure pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- 1. SEED DEMO USERS
-- ============================================

INSERT INTO users (id, email, password_hash, full_name, role, status, preferred_language, email_verified, created_at)
SELECT 
  gen_random_uuid(), 
  'citizen@demo.enav', 
  crypt('citizen123', gen_salt('bf')), 
  'Demo Citizen User', 
  'citizen', 
  'active', 
  'en', 
  true,
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'citizen@demo.enav');

INSERT INTO users (id, email, password_hash, full_name, role, status, preferred_language, email_verified, created_at)
SELECT 
  gen_random_uuid(), 
  'employee@demo.enav', 
  crypt('employee123', gen_salt('bf')), 
  'Demo Employee User', 
  'employee', 
  'active', 
  'en', 
  true,
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'employee@demo.enav');

INSERT INTO users (id, email, password_hash, full_name, role, status, preferred_language, email_verified, created_at)
SELECT 
  gen_random_uuid(), 
  'partner@demo.enav', 
  crypt('partner123', gen_salt('bf')), 
  'Demo Partner User', 
  'partner', 
  'active', 
  'en', 
  true,
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'partner@demo.enav');

INSERT INTO users (id, email, password_hash, full_name, role, status, preferred_language, email_verified, created_at)
SELECT 
  gen_random_uuid(), 
  'admin@demo.enav', 
  crypt('admin123', gen_salt('bf')), 
  'Demo Admin User', 
  'admin', 
  'active', 
  'en', 
  true,
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@demo.enav');

-- ============================================
-- 2. SEED SERVICE CATEGORIES (if not exists)
-- ============================================

INSERT INTO service_categories (id, name, name_am, name_or, description, icon, sort_order, is_active, created_at)
SELECT gen_random_uuid(), 'Business Registration', 'የንግድ ምዝገባ', 'Galmee Daldalaa', 'Services related to business registration and licensing', 'building-2', 1, true, NOW()
WHERE NOT EXISTS (SELECT 1 FROM service_categories WHERE name = 'Business Registration');

INSERT INTO service_categories (id, name, name_am, name_or, description, icon, sort_order, is_active, created_at)
SELECT gen_random_uuid(), 'Tax Services', 'የግብር አገልግሎቶች', 'Tajaajila Gibiraa', 'Tax registration, filing, and compliance', 'receipt', 2, true, NOW()
WHERE NOT EXISTS (SELECT 1 FROM service_categories WHERE name = 'Tax Services');

INSERT INTO service_categories (id, name, name_am, name_or, description, icon, sort_order, is_active, created_at)
SELECT gen_random_uuid(), 'Trade & Commerce', 'ንግድ እና ኮሜርስ', 'Daldala fi Daldalaa', 'Import/export permits and trade licenses', 'truck', 3, true, NOW()
WHERE NOT EXISTS (SELECT 1 FROM service_categories WHERE name = 'Trade & Commerce');

INSERT INTO service_categories (id, name, name_am, name_or, description, icon, sort_order, is_active, created_at)
SELECT gen_random_uuid(), 'Civil Registration', 'የሲቪል ምዝገባ', 'Galmee Siivikii', 'Birth, death, marriage documents and identity services', 'user-check', 4, true, NOW()
WHERE NOT EXISTS (SELECT 1 FROM service_categories WHERE name = 'Civil Registration');

-- ============================================
-- 3. SEED BUSINESS SECTORS (if not exists)
-- ============================================

INSERT INTO business_sectors (id, name, name_am, name_or, code, description, icon, is_active, created_at)
SELECT gen_random_uuid(), 'Manufacturing', 'ማኑፋክቸሪንግ', 'Oomisha', 'MFG', 'Manufacturing and production', 'factory', true, NOW()
WHERE NOT EXISTS (SELECT 1 FROM business_sectors WHERE code = 'MFG');

INSERT INTO business_sectors (id, name, name_am, name_or, code, description, icon, is_active, created_at)
SELECT gen_random_uuid(), 'Technology', 'ቴክኖሎጂ', 'Teeknooloojii', 'TECH', 'IT and technology services', 'cpu', true, NOW()
WHERE NOT EXISTS (SELECT 1 FROM business_sectors WHERE code = 'TECH');

INSERT INTO business_sectors (id, name, name_am, name_or, code, description, icon, is_active, created_at)
SELECT gen_random_uuid(), 'Trade & Retail', 'ንግድ እና ችርቻሮ', 'Daldala', 'TRD', 'Wholesale and retail trade', 'shopping-cart', true, NOW()
WHERE NOT EXISTS (SELECT 1 FROM business_sectors WHERE code = 'TRD');

INSERT INTO business_sectors (id, name, name_am, name_or, code, description, icon, is_active, created_at)
SELECT gen_random_uuid(), 'Agriculture', 'ግብርና', 'Qonnaa', 'AGR', 'Agricultural businesses', 'wheat', true, NOW()
WHERE NOT EXISTS (SELECT 1 FROM business_sectors WHERE code = 'AGR');

-- ============================================
-- 4. SEED ENTITY TYPES (if not exists)
-- ============================================

INSERT INTO business_entity_types (id, name, name_am, name_or, code, description, is_active, created_at)
SELECT gen_random_uuid(), 'Sole Proprietorship', 'የግል ንግድ', 'Daldala Dhuunfaa', 'SOLE', 'Individual-owned business', true, NOW()
WHERE NOT EXISTS (SELECT 1 FROM business_entity_types WHERE code = 'SOLE');

INSERT INTO business_entity_types (id, name, name_am, name_or, code, description, is_active, created_at)
SELECT gen_random_uuid(), 'Private Limited Company', 'የግል ኃላፊነት ኩባንያ', 'Kompanii Murtaawe', 'PLC', 'Private company', true, NOW()
WHERE NOT EXISTS (SELECT 1 FROM business_entity_types WHERE code = 'PLC');

INSERT INTO business_entity_types (id, name, name_am, name_or, code, description, is_active, created_at)
SELECT gen_random_uuid(), 'Share Company', 'አክሲዮን ማኅበር', 'Waldaa Aksiyoona', 'SC', 'Share company', true, NOW()
WHERE NOT EXISTS (SELECT 1 FROM business_entity_types WHERE code = 'SC');

-- ============================================
-- 5. SEED NOTIFICATION PREFERENCES
-- ============================================

INSERT INTO notification_preferences (id, user_id, email_enabled, sms_enabled, push_enabled, in_app_enabled, quiet_hours_start, quiet_hours_end, language, created_at)
SELECT gen_random_uuid(), u.id, true, false, true, true, '18:00'::time, '08:00'::time, 'en', NOW()
FROM users u
WHERE NOT EXISTS (SELECT 1 FROM notification_preferences WHERE user_id = u.id);

-- ============================================
-- SEED DATA COMPLETE
-- ============================================
-- Demo Users created: citizen@demo.enav, employee@demo.enav, partner@demo.enav, admin@demo.enav
-- Service Categories: Business Registration, Tax Services, Trade & Commerce, Civil Registration
-- Business Sectors: Manufacturing, Technology, Trade & Retail, Agriculture
-- Entity Types: Sole Proprietorship, Private Limited Company, Share Company
-- Notification Preferences: Enabled for all demo users
