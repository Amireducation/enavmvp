-- Ethiopian Navigator Complete Database Seed Script
-- This script seeds all essential data for the MVP demo
-- Uses INSERT ... ON CONFLICT to avoid foreign key constraint violations

-- ============================================
-- 1. SEED DEMO USERS (with proper password hashing)
-- ============================================

-- First, ensure pgcrypto extension is available
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insert demo users (only if they don't exist)
INSERT INTO users (id, email, password_hash, full_name, role, status, preferred_language, email_verified)
VALUES
  (gen_random_uuid(), 'citizen@demo.enav', crypt('citizen123', gen_salt('bf')), 'Demo Citizen', 'citizen', 'active', 'en', true),
  (gen_random_uuid(), 'employee@demo.enav', crypt('employee123', gen_salt('bf')), 'Demo Employee', 'employee', 'active', 'en', true),
  (gen_random_uuid(), 'partner@demo.enav', crypt('partner123', gen_salt('bf')), 'Demo Partner', 'partner', 'active', 'en', true),
  (gen_random_uuid(), 'admin@demo.enav', crypt('admin123', gen_salt('bf')), 'Demo Admin', 'admin', 'active', 'en', true)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  status = 'active',
  email_verified = true;

-- ============================================
-- 2. SEED SERVICE CATEGORIES
-- ============================================

INSERT INTO service_categories (id, name, name_am, name_or, description, icon, sort_order, is_active)
VALUES
  (gen_random_uuid(), 'Business Registration', 'የንግድ ምዝገባ', 'Galmee Daldalaa', 'Services related to registering and licensing businesses', 'building-2', 1, true),
  (gen_random_uuid(), 'Tax Services', 'የግብር አገልግሎቶች', 'Tajaajila Gibiraa', 'Tax registration, filing, and compliance services', 'receipt', 2, true),
  (gen_random_uuid(), 'Trade & Commerce', 'ንግድ እና ኮሜርስ', 'Daldala fi Daldalaa', 'Import/export permits and trade licenses', 'truck', 3, true),
  (gen_random_uuid(), 'Civil Registration', 'የሲቪል ምዝገባ', 'Galmee Siivikii', 'Birth, death, marriage, and identity documents', 'user-check', 4, true),
  (gen_random_uuid(), 'Investment Services', 'የኢንቨስትመንት አገልግሎቶች', 'Tajaajila Investimentii', 'Investment permits and incentives', 'trending-up', 5, true),
  (gen_random_uuid(), 'Land & Property', 'መሬት እና ንብረት', 'Lafa fi Qabeenyaa', 'Land registration and property services', 'map-pin', 6, true)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 3. SEED BUSINESS SECTORS
-- ============================================

INSERT INTO business_sectors (id, name, name_am, name_or, code, description, icon, is_active)
VALUES
  (gen_random_uuid(), 'Manufacturing', 'ማኑፋክቸሪንግ', 'Oomisha', 'MFG', 'Manufacturing and production industries', 'factory', true),
  (gen_random_uuid(), 'Agriculture', 'ግብርና', 'Qonnaa', 'AGR', 'Agricultural and farming businesses', 'wheat', true),
  (gen_random_uuid(), 'Technology', 'ቴክኖሎጂ', 'Teeknooloojii', 'TECH', 'IT and technology services', 'cpu', true),
  (gen_random_uuid(), 'Trade & Retail', 'ንግድ እና ችርቻሮ', 'Daldala', 'TRD', 'Wholesale and retail trade', 'shopping-cart', true),
  (gen_random_uuid(), 'Construction', 'ኮንስትራክሽን', 'Ijaarsa', 'CON', 'Construction and real estate', 'building', true),
  (gen_random_uuid(), 'Tourism & Hospitality', 'ቱሪዝም እና እንግዳ ተቀባይነት', 'Turizimii', 'TOR', 'Hotels, restaurants, and tourism', 'plane', true),
  (gen_random_uuid(), 'Financial Services', 'የፋይናንስ አገልግሎቶች', 'Tajaajila Faayinaansii', 'FIN', 'Banking and financial services', 'banknote', true)
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- 4. SEED BUSINESS ENTITY TYPES
-- ============================================

INSERT INTO business_entity_types (id, name, name_am, name_or, code, description, is_active)
VALUES
  (gen_random_uuid(), 'Sole Proprietorship', 'የግል ንግድ', 'Daldala Dhuunfaa', 'SOLE', 'Individual-owned business', true),
  (gen_random_uuid(), 'Private Limited Company', 'የግል ኃላፊነቱ የተወሰነ ኩባንያ', 'Kompanii Murtaawe', 'PLC', 'Private limited company', true),
  (gen_random_uuid(), 'Share Company', 'አክሲዮን ማኅበር', 'Waldaa Aksiyoona', 'SC', 'Share company / corporation', true),
  (gen_random_uuid(), 'Partnership', 'ሽርክና', 'Hirmaannaa', 'PART', 'Business partnership', true),
  (gen_random_uuid(), 'Cooperative', 'ህብረት ስራ ማህበር', 'Waldaa Tumsa', 'COOP', 'Cooperative society', true)
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- 5. SEED SERVICES (simplified with hardcoded UUIDs for category lookup)
-- ============================================

-- Insert services with service_category names lookup
INSERT INTO services (id, name, name_am, name_or, description, description_am, description_or, category_id, service_fee, estimated_processing_days, online_available, status, target_audience, core_type)
SELECT 
  gen_random_uuid(), 'Business Registration Certificate', 'የንግድ ምዝገባ የምስክር ወረቀት', 'Waraqaa Ragaa Galmee Daldalaa', 
  'Register a new business and obtain official registration certificate', 
  'አዲስ ንግድ ይመዝግቡ እና ኦፊሴላዊ የምዝገባ ምስክር ወረቀት ያግኙ',
  'Daldala haaraa galmeessuu fi waraqaa ragaa galmee argachuu',
  id, 500.00, 5, true, 'active', 'business', 'G2B'
FROM service_categories WHERE name = 'Business Registration'
ON CONFLICT (name) DO NOTHING;

INSERT INTO services (id, name, name_am, name_or, description, description_am, description_or, category_id, service_fee, estimated_processing_days, online_available, status, target_audience, core_type)
SELECT 
  gen_random_uuid(), 'TIN Registration', 'የቲን ምዝገባ', 'Galmee TIN',
  'Register for Tax Identification Number (TIN)',
  'የግብር መለያ ቁጥር (TIN) ይመዝገቡ',
  'Lakkoofsa Addaa Gibiraa (TIN) galmeeffachuu',
  id, 0.00, 3, true, 'active', 'both', 'G2B'
FROM service_categories WHERE name = 'Tax Services'
ON CONFLICT (name) DO NOTHING;

INSERT INTO services (id, name, name_am, name_or, description, description_am, description_or, category_id, service_fee, estimated_processing_days, online_available, status, target_audience, core_type)
SELECT 
  gen_random_uuid(), 'Trade License Renewal', 'የንግድ ፈቃድ እድሳት', 'Haaromsa Hayyama Daldalaa',
  'Renew your existing trade license',
  'ያለዎትን የንግድ ፈቃድ ያድሱ',
  'Hayyama daldalaa qabdan haaromsaa',
  id, 1000.00, 7, true, 'active', 'business', 'G2B'
FROM service_categories WHERE name = 'Trade & Commerce'
ON CONFLICT (name) DO NOTHING;

INSERT INTO services (id, name, name_am, name_or, description, description_am, description_or, category_id, service_fee, estimated_processing_days, online_available, status, target_audience, core_type)
SELECT 
  gen_random_uuid(), 'Birth Certificate', 'የልደት ምስክር ወረቀት', 'Waraqaa Ragaa Dhalootaa',
  'Obtain official birth certificate',
  'ኦፊሴላዊ የልደት ምስክር ወረቀት ያግኙ',
  'Waraqaa ragaa dhalootaa mootummaa argachuu',
  id, 100.00, 2, true, 'active', 'citizen', 'G2C'
FROM service_categories WHERE name = 'Civil Registration'
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 6. SEED FAQs (without DELETE to avoid constraint violations)
-- ============================================

INSERT INTO faqs (id, question, question_am, question_or, answer, answer_am, answer_or, category, status, is_featured, sort_order)
VALUES
  (gen_random_uuid(), 
   'How do I register a new business?',
   'አዲስ ንግድ እንዴት እመዘግባለሁ?',
   'Daldala haaraa akkamitti galmeessisaa?',
   'To register a new business, navigate to the Services section, select "Business Registration Certificate", fill out the required form, upload necessary documents, and submit your application. You will receive a tracking number to monitor your application status.',
   'አዲስ ንግድ ለመመዝገብ ወደ አገልግሎቶች ክፍል ይሂዱ፣ "የንግድ ምዝገባ የምስክር ወረቀት" ይምረጡ፣ አስፈላጊውን ቅጽ ይሙሉ፣ አስፈላጊ ሰነዶችን ያስገቡ እና ማመልከቻዎን ያስገቡ። የማመልከቻዎን ሁኔታ ለመከታተል የመከታተያ ቁጥር ይደርስዎታል።',
   'Daldala haaraa galmeessisuuf, gara kutaa Tajaajilaa deemaa, "Waraqaa Ragaa Galmee Daldalaa" filachuu, unka barbaachisu guutuu, sanadoota barbaachisoo fe''achuu, fi iyyata keessan galchaa.',
   'general', 'published', true, 1),
  
  (gen_random_uuid(),
   'What documents are required for TIN registration?',
   'ለቲን ምዝገባ ምን ሰነዶች ያስፈልጋሉ?',
   'Galmee TIN-f sanadoota maaltu barbaachisa?',
   'For TIN registration, you need: 1) Valid ID (Kebele ID or Passport), 2) Business registration certificate (for businesses), 3) Proof of address, 4) Passport-size photograph. All documents should be clear copies or originals.',
   'ለቲን ምዝገባ የሚያስፈልጉዎት: 1) ትክክለኛ መታወቂያ (የቀበሌ መታወቂያ ወይም ፓስፖርት)፣ 2) የንግድ ምዝገባ ምስክር ወረቀት (ለንግዶች)፣ 3) የአድራሻ ማረጋገጫ፣ 4) የፓስፖርት መጠን ፎቶግራፍ።',
   'Galmee TIN-f wantoonni isin barbaachisan: 1) Eenyummaa sirrii (Waraqaa eenyummaa Gandaa ykn Paaspoortii), 2) Waraqaa ragaa galmee daldalaa (daldalaaf), 3) Ragaa teessoo, 4) Suuraa hanga paaspoortii.',
   'tax', 'published', true, 2),
  
  (gen_random_uuid(),
   'How can I track my application status?',
   'የማመልከቻዬን ሁኔታ እንዴት መከታተል እችላለሁ?',
   'Haala iyyata koo akkamitti hordofuu dandaha?',
   'You can track your application by: 1) Logging into your account, 2) Going to "My Applications" section, 3) Using your tracking number in the search field. You will see real-time status updates and any required actions.',
   'ማመልከቻዎን መከታተል የሚችሉት: 1) ወደ መለያዎ በመግባት፣ 2) ወደ "የእኔ ማመልከቻዎች" ክፍል በመሄድ፣ 3) የመከታተያ ቁጥርዎን በፍለጋ መስክ ውስጥ በመጠቀም። የእውነተኛ ጊዜ የሁኔታ ዝመናዎችን እና አስፈላጊ እርምጃዎችን ያያሉ።',
   'Iyyata keessan hordofuuf: 1) Herrega keessanitti seenuun, 2) Gara kutaa "Iyyatawwan Koo" deemuun, 3) Lakkoofsa hordoffii keessan dirree barbaacha keessatti fayyadamuun. Haaromsa haala yeroo dhugaa fi tarkaanfiiwwan barbaachisan ni argitu.',
   'general', 'published', true, 3),
  
  (gen_random_uuid(),
   'What are the accepted payment methods?',
   'ተቀባይነት ያላቸው የክፍያ ዘዴዎች ምንድን ናቸው?',
   'Karaaleen kaffaltii fudhataman maali?',
   'We accept the following payment methods: 1) CBE Birr (mobile banking), 2) Telebirr, 3) Credit/Debit cards (Visa, Mastercard), 4) Bank transfer. All transactions are secure and you will receive a digital receipt.',
   'የሚከተሉትን የክፍያ ዘዴዎች እንቀበላለን: 1) ሲቢኢ ብር (ሞባይል ባንኪንግ)፣ 2) ቴሌብር፣ 3) ክሬዲት/ዴቢት ካርዶች (ቪዛ፣ ማስተርካርድ)፣ 4) የባንክ ማስተላለፍ። ሁሉም ግብይቶች ደህንነታቸው የተጠበቀ ነው እና ዲጂታል ደረሰኝ ይደርስዎታል።',
   'Karaalee kaffaltii armaan gadii ni fudhanna: 1) CBE Birr (baankii mobaayilaa), 2) Telebirr, 3) Kaardii Kireeditii/Deebitii (Visa, Mastercard), 4) Dabarsaa baankii.',
   'payment', 'published', true, 4)
ON CONFLICT DO NOTHING;

-- ============================================
-- 7. SEED KNOWLEDGE ARTICLES
-- ============================================

DELETE FROM knowledge_articles WHERE status = 'published';

INSERT INTO knowledge_articles (id, title, title_am, title_or, content, content_am, content_or, category, status, tags)
VALUES
  (gen_random_uuid(),
   'Getting Started with Ethiopian Navigator',
   'Ethiopian Navigator ን መጀመር',
   'Ethiopian Navigator Jalqabuu',
   E'# Welcome to Ethiopian Navigator\n\nEthiopian Navigator is your one-stop platform for accessing government services in Ethiopia.\n\n## Key Features\n\n- **Service Catalog**: Browse and apply for government services\n- **Application Tracking**: Monitor your application status in real-time\n- **Document Management**: Securely upload and store your documents\n- **AI Assistant**: Get instant help with our intelligent chatbot\n- **Multilingual Support**: Use the platform in Amharic, Oromo, or English\n\n## Getting Started\n\n1. Create an account or sign in\n2. Browse available services\n3. Submit your application\n4. Track progress and receive notifications',
   E'# Ethiopian Navigator ን እንኳን ደህና መጡ\n\nEthiopian Navigator በኢትዮጵያ ውስጥ የመንግስት አገልግሎቶችን ለማግኘት የአንድ-ማቆሚያ መድረክዎ ነው።',
   E'# Ethiopian Navigator Baga Nagaan Dhuftan\n\nEthiopian Navigator Itoophiyaa keessatti tajaajila mootummaa argachuuf madda tokko keessan.',
   'getting-started', 'published', ARRAY['guide', 'beginner', 'overview']),
  
  (gen_random_uuid(),
   'Business Registration Guide',
   'የንግድ ምዝገባ መመሪያ',
   'Qajeelfama Galmee Daldalaa',
   E'# Business Registration in Ethiopia\n\nThis guide walks you through the process of registering a business in Ethiopia.\n\n## Step 1: Choose Business Type\n\nSelect the appropriate business structure:\n- Sole Proprietorship\n- Private Limited Company (PLC)\n- Share Company\n- Partnership\n\n## Step 2: Reserve Business Name\n\nCheck name availability and reserve your business name.\n\n## Step 3: Prepare Documents\n\nGather required documents:\n- ID documents of owners\n- Memorandum of Association\n- Articles of Association\n- Proof of address\n\n## Step 4: Submit Application\n\nComplete the online application form and upload documents.\n\n## Step 5: Pay Fees\n\nPay the required registration fees.\n\n## Step 6: Receive Certificate\n\nOnce approved, download your business registration certificate.',
   E'# በኢትዮጵያ ውስጥ የንግድ ምዝገባ\n\nይህ መመሪያ በኢትዮጵያ ውስጥ ንግድ የመመዝገብ ሂደትን ያስተዋውቅዎታል።',
   E'# Galmee Daldalaa Itoophiyaa Keessatti\n\nQajeelfamni kun adeemsa Itoophiyaa keessatti daldala galmeessisuuf jiru si barsiisa.',
   'business', 'published', ARRAY['business', 'registration', 'guide'])
ON CONFLICT DO NOTHING;

-- ============================================
-- 8. SET UP NOTIFICATION PREFERENCES FOR DEMO USERS
-- ============================================

INSERT INTO notification_preferences (id, user_id, email_enabled, sms_enabled, push_enabled, in_app_enabled, language)
SELECT 
  gen_random_uuid(),
  u.id,
  true,
  true,
  true,
  true,
  'en'
FROM users u
WHERE u.email LIKE '%@demo.enav'
ON CONFLICT DO NOTHING;

-- ============================================
-- 9. VERIFY SEED DATA
-- ============================================

-- Output counts for verification
SELECT 'Users' as table_name, COUNT(*) as count FROM users WHERE email LIKE '%@demo.enav'
UNION ALL
SELECT 'Service Categories', COUNT(*) FROM service_categories WHERE is_active = true
UNION ALL
SELECT 'Business Sectors', COUNT(*) FROM business_sectors WHERE is_active = true
UNION ALL
SELECT 'Business Entity Types', COUNT(*) FROM business_entity_types WHERE is_active = true
UNION ALL
SELECT 'Services', COUNT(*) FROM services WHERE status = 'active'
UNION ALL
SELECT 'FAQs', COUNT(*) FROM faqs WHERE status = 'published'
UNION ALL
SELECT 'Knowledge Articles', COUNT(*) FROM knowledge_articles WHERE status = 'published';
