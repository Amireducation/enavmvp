-- Ethiopian Navigator - Complete Services Seed Data
-- This script populates all service-related data for a complete demo

-- ============================================
-- 1. INSERT SERVICES WITH COMPLETE DATA
-- ============================================

INSERT INTO services (id, name, name_am, name_or, description, description_am, description_or, category_id, service_fee, estimated_processing_days, online_available, status, target_audience, core_type, agency, contact_email, contact_phone)
SELECT 
  gen_random_uuid(),
  'New Business Registration', 
  'አዲስ የንግድ ምዝገባ', 
  'Galmee Daldalaa Haaraa',
  'Register a new business entity and obtain official registration certificate',
  'አዲስ ንግድ ይመዝግቡ እና ኦፊሴላዊ የምዝገባ ምስክር ወረቀት ያግኙ',
  'Daldala haaraa galmeessuu fi waraqaa ragaa galmee argachuu',
  c.id, 500.00, 5, true, 'active', 'business', 'G2B',
  'Ministry of Trade', 'business@motr.gov.et', '+251-11-551-8025'
FROM service_categories c WHERE c.name = 'Business Registration'
ON CONFLICT DO NOTHING;

INSERT INTO services (id, name, name_am, name_or, description, description_am, description_or, category_id, service_fee, estimated_processing_days, online_available, status, target_audience, core_type, agency, contact_email, contact_phone)
SELECT 
  gen_random_uuid(),
  'Trade License Renewal',
  'የንግድ ፈቃድ እድሳት',
  'Haaromsa Hayyama Daldalaa',
  'Renew your existing trade license before expiration. Must be renewed annually.',
  'ጊዜው ከማለቁ በፊት ያለዎትን የንግድ ፈቃድ ያድሱ',
  'Hayyama daldalaa qabdan osoo yeroon isaa hin dhumin haaromsaa',
  c.id, 350.00, 3, true, 'active', 'business', 'G2B',
  'Ministry of Trade', 'license@motr.gov.et', '+251-11-551-8026'
FROM service_categories c WHERE c.name = 'Business Registration'
ON CONFLICT DO NOTHING;

INSERT INTO services (id, name, name_am, name_or, description, description_am, description_or, category_id, service_fee, estimated_processing_days, online_available, status, target_audience, core_type, agency, contact_email, contact_phone)
SELECT 
  gen_random_uuid(),
  'TIN Registration',
  'የቲን ምዝገባ',
  'Galmee TIN',
  'Register for Tax Identification Number (TIN). Required for all tax obligations.',
  'ለግብር መለያ ቁጥር (TIN) ይመዝገቡ',
  'Lakkoofsa Addaa Gibiraa (TIN) galmeeffachuu',
  c.id, 0.00, 1, true, 'active', 'both', 'G2B',
  'Revenue Authority', 'tin@erca.gov.et', '+251-11-662-9000'
FROM service_categories c WHERE c.name = 'Tax Services'
ON CONFLICT DO NOTHING;

INSERT INTO services (id, name, name_am, name_or, description, description_am, description_or, category_id, service_fee, estimated_processing_days, online_available, status, target_audience, core_type, agency, contact_email, contact_phone)
SELECT 
  gen_random_uuid(),
  'Import License',
  'የማስገባት ፈቃድ',
  'Hayyama Galchuu',
  'Apply for import license to bring goods into Ethiopia',
  'ዕቃዎችን ወደ ኢትዮጵያ ለማስገባት ፈቃድ ያመልክቱ',
  'Meeshaalee gara Itoophiyaa galchuuf hayyama gaafachuu',
  c.id, 2500.00, 14, true, 'active', 'business', 'G2B',
  'Ministry of Trade', 'import@motr.gov.et', '+251-11-551-8030'
FROM service_categories c WHERE c.name = 'Trade & Commerce'
ON CONFLICT DO NOTHING;

INSERT INTO services (id, name, name_am, name_or, description, description_am, description_or, category_id, service_fee, estimated_processing_days, online_available, status, target_audience, core_type, agency, contact_email, contact_phone)
SELECT 
  gen_random_uuid(),
  'Export License',
  'የመላክ ፈቃድ',
  'Hayyama Erguu',
  'Apply for export license to ship goods from Ethiopia',
  'ዕቃዎችን ከኢትዮጵያ ለመላክ ፈቃድ ያመልክቱ',
  'Meeshaalee Itoophiyaa irraa erguuf hayyama gaafachuu',
  c.id, 2000.00, 10, true, 'active', 'business', 'G2B',
  'Ministry of Trade', 'export@motr.gov.et', '+251-11-551-8031'
FROM service_categories c WHERE c.name = 'Trade & Commerce'
ON CONFLICT DO NOTHING;

INSERT INTO services (id, name, name_am, name_or, description, description_am, description_or, category_id, service_fee, estimated_processing_days, online_available, status, target_audience, core_type, agency, contact_email, contact_phone)
SELECT 
  gen_random_uuid(),
  'Birth Certificate',
  'የልደት ምስክር ወረቀት',
  'Waraqaa Ragaa Dhalootaa',
  'Obtain official birth certificate for vital record purposes',
  'ኦፊሴላዊ የልደት ምስክር ወረቀት ያግኙ',
  'Waraqaa ragaa dhalootaa mootummaa argachuu',
  c.id, 100.00, 5, true, 'active', 'citizen', 'G2C',
  'Vital Events Registry', 'births@mohealth.gov.et', '+251-11-551-8050'
FROM service_categories c WHERE c.name = 'Civil Registration'
ON CONFLICT DO NOTHING;

INSERT INTO services (id, name, name_am, name_or, description, description_am, description_or, category_id, service_fee, estimated_processing_days, online_available, status, target_audience, core_type, agency, contact_email, contact_phone)
SELECT 
  gen_random_uuid(),
  'Marriage Certificate',
  'የ婚ሚስተር ምስክር ወረቀት',
  'Waraqaa Ragaa Heerumaa',
  'Register and obtain marriage certificate',
  'ሚስተር ምስክር ወረቀት ይመዝገቡ እና ያግኙ',
  'Waraqaa ragaa heerumaa galmeessuu fi argachuu',
  c.id, 150.00, 7, true, 'active', 'citizen', 'G2C',
  'Vital Events Registry', 'marriages@mohealth.gov.et', '+251-11-551-8051'
FROM service_categories c WHERE c.name = 'Civil Registration'
ON CONFLICT DO NOTHING;

INSERT INTO services (id, name, name_am, name_or, description, description_am, description_or, category_id, service_fee, estimated_processing_days, online_available, status, target_audience, core_type, agency, contact_email, contact_phone)
SELECT 
  gen_random_uuid(),
  'Investment Permit',
  'የኢንቨስትመንት ፈቃድ',
  'Hayyama Investimentii',
  'Apply for domestic or foreign investment permit with incentives',
  'ለአገር ውስጥ ወይም ለውጭ ኢንቨስትመንት ፈቃድ ከሰአሚ ጋር ያመልክቱ',
  'Hayyama investimentii biyya keessaa yookaan alaa gaafachuu',
  c.id, 5000.00, 30, false, 'active', 'business', 'G2B',
  'Investment Commission', 'invest@ethioembassy.gov.et', '+251-11-662-4900'
FROM service_categories c WHERE c.name = 'Investment Services'
ON CONFLICT DO NOTHING;

INSERT INTO services (id, name, name_am, name_or, description, description_am, description_or, category_id, service_fee, estimated_processing_days, online_available, status, target_audience, core_type, agency, contact_email, contact_phone)
SELECT 
  gen_random_uuid(),
  'Land Use Certificate',
  'የመሬት አጠቃቀም ምስክር ወረቀት',
  'Waraqaa Ragaa Fayyadama Lafaa',
  'Register and obtain land use rights certificate',
  'የመሬት አጠቃቀም መብት ምስክር ወረቀት ይመዝገቡ',
  'Waraqaa ragaa mirga fayyadama lafaa galmeessuu',
  c.id, 3000.00, 30, false, 'active', 'both', 'G2B',
  'Land Authority', 'land@moua.gov.et', '+251-11-551-8060'
FROM service_categories c WHERE c.name = 'Land & Property'
ON CONFLICT DO NOTHING;

INSERT INTO services (id, name, name_am, name_or, description, description_am, description_or, category_id, service_fee, estimated_processing_days, online_available, status, target_audience, core_type, agency, contact_email, contact_phone)
SELECT 
  gen_random_uuid(),
  'Work Permit',
  'የስራ ፈቃድ',
  'Hayyama Hojii',
  'Apply for work permit for foreign nationals',
  'ለውጪ ሀገር ዜጋዎች የስራ ፈቃድ ያመልክቱ',
  'Ummataas alaa jiraniif hayyama hojii gaafachuu',
  c.id, 1500.00, 21, false, 'active', 'both', 'G2B',
  'Labor & Social Affairs', 'workpermit@molsa.gov.et', '+251-11-662-8900'
FROM service_categories c WHERE c.name = 'Employment & Labor'
ON CONFLICT DO NOTHING;

INSERT INTO services (id, name, name_am, name_or, description, description_am, description_or, category_id, service_fee, estimated_processing_days, online_available, status, target_audience, core_type, agency, contact_email, contact_phone)
SELECT 
  gen_random_uuid(),
  'Health Permit',
  'የጤና ፈቃድ',
  'Hayyama Fayyaa',
  'Apply for health facility operation permit',
  'የጤና ተቋም ሥራ ፈቃድ ያመልክቱ',
  'Hayyama hirannoo midhagii fayyaa gaafachuu',
  c.id, 2000.00, 15, false, 'active', 'business', 'G2B',
  'Ministry of Health', 'health@mohealth.gov.et', '+251-11-662-8800'
FROM service_categories c WHERE c.name = 'Health & Safety'
ON CONFLICT DO NOTHING;
