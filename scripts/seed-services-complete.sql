-- Ethiopian Navigator - Complete Services Seed Data
-- This script populates all service-related data for a complete demo

-- ============================================
-- 1. ENSURE SERVICE CATEGORIES EXIST
-- ============================================

INSERT INTO service_categories (id, name, name_am, name_or, description, icon, sort_order, is_active)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Business Registration', 'የንግድ ምዝገባ', 'Galmee Daldalaa', 'Services for registering and licensing businesses', 'building-2', 1, true),
  ('c1000000-0000-0000-0000-000000000002', 'Tax Services', 'የግብር አገልግሎቶች', 'Tajaajila Gibiraa', 'Tax registration, filing, and compliance services', 'receipt', 2, true),
  ('c1000000-0000-0000-0000-000000000003', 'Trade & Commerce', 'ንግድ እና ኮሜርስ', 'Daldala fi Daldalaa', 'Import/export permits and trade licenses', 'truck', 3, true),
  ('c1000000-0000-0000-0000-000000000004', 'Civil Registration', 'የሲቪል ምዝገባ', 'Galmee Siivikii', 'Birth, death, marriage, and identity documents', 'user-check', 4, true),
  ('c1000000-0000-0000-0000-000000000005', 'Investment Services', 'የኢንቨስትመንት አገልግሎቶች', 'Tajaajila Investimentii', 'Investment permits and incentives', 'trending-up', 5, true),
  ('c1000000-0000-0000-0000-000000000006', 'Land & Property', 'መሬት እና ንብረት', 'Lafa fi Qabeenyaa', 'Land registration and property services', 'map-pin', 6, true),
  ('c1000000-0000-0000-0000-000000000007', 'Employment & Labor', 'ስራ እና ሰራተኛ', 'Hojii fi Hojjataa', 'Work permits and labor-related services', 'briefcase', 7, true),
  ('c1000000-0000-0000-0000-000000000008', 'Health & Safety', 'ጤና እና ደህንነት', 'Fayyaa fi Nageenya', 'Health permits and safety certifications', 'heart-pulse', 8, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_am = EXCLUDED.name_am,
  name_or = EXCLUDED.name_or,
  description = EXCLUDED.description,
  is_active = true;

-- ============================================
-- 2. SEED COMPREHENSIVE SERVICES
-- ============================================

INSERT INTO services (id, name, name_am, name_or, description, description_am, description_or, category_id, service_fee, estimated_processing_days, online_available, status, target_audience, core_type, agency, contact_email, contact_phone, requirements)
VALUES
  -- Business Registration Services
  ('s1000000-0000-0000-0000-000000000001', 'New Business Registration', 'አዲስ የንግድ ምዝገባ', 'Galmee Daldalaa Haaraa', 
   'Register a new business entity and obtain official registration certificate. Required for all business operations in Ethiopia.',
   'አዲስ ንግድ ይመዝግቡ እና ኦፊሴላዊ የምዝገባ ምስክር ወረቀት ያግኙ። በኢትዮጵያ ውስጥ ለሚካሄዱ ሁሉም የንግድ ስራዎች ያስፈልጋል።',
   'Daldala haaraa galmeessuu fi waraqaa ragaa galmee argachuu. Hojiiwwan daldalaa hundaaf Itoophiyaa keessatti barbaachisaa dha.',
   'c1000000-0000-0000-0000-000000000001', 500.00, 5, true, 'active', 'business', 'G2B', 
   'Ministry of Trade and Regional Integration', 'businessreg@motr.gov.et', '+251-11-551-8025',
   '["Valid ID (Kebele or Passport)", "Proof of Address", "Business Plan", "Capital Proof (Bank Statement)", "Two Passport Photos"]'),

  ('s1000000-0000-0000-0000-000000000002', 'Trade License Renewal', 'የንግድ ፈቃድ እድሳት', 'Haaromsa Hayyama Daldalaa',
   'Renew your existing trade license before expiration. Must be renewed annually.',
   'ጊዜው ከማለቁ በፊት ያለዎትን የንግድ ፈቃድ ያድሱ። በየዓመቱ መታደስ አለበት።',
   'Hayyama daldalaa qabdan osoo yeroon isaa hin dhumin haaromsaa. Waggaa waggaan haaromsamuu qaba.',
   'c1000000-0000-0000-0000-000000000001', 350.00, 3, true, 'active', 'business', 'G2B',
   'Ministry of Trade and Regional Integration', 'license@motr.gov.et', '+251-11-551-8026',
   '["Current Trade License", "Tax Clearance Certificate", "Annual Report", "Renewal Fee Receipt"]'),

  ('s1000000-0000-0000-0000-000000000003', 'Business Name Registration', 'የንግድ ስም ምዝገባ', 'Galmee Maqaa Daldalaa',
   'Register and reserve a unique business name. Valid for 60 days before full registration.',
   'ልዩ የንግድ ስም ይመዝገቡ እና ያስቀምጡ። ከሙሉ ምዝገባ በፊት ለ60 ቀናት ያገለግላል።',
   'Maqaa daldalaa addaa galmeessuu fi kuusuu. Galmee guutuu dura guyyaa 60 hojiirra oola.',
   'c1000000-0000-0000-0000-000000000001', 150.00, 2, true, 'active', 'business', 'G2B',
   'Ministry of Trade and Regional Integration', 'names@motr.gov.et', '+251-11-551-8027',
   '["Three Proposed Business Names", "Business Type Declaration", "Owner ID"]'),

  -- Tax Services
  ('s1000000-0000-0000-0000-000000000004', 'TIN Registration', 'የቲን ምዝገባ', 'Galmee TIN',
   'Register for Tax Identification Number (TIN). Required for all tax obligations and business transactions.',
   'ለግብር መለያ ቁጥር (TIN) ይመዝገቡ። ለሁሉም የግብር ግዴታዎች እና የንግድ ግብይቶች ያስፈልጋል።',
   'Lakkoofsa Addaa Gibiraa (TIN) galmeeffachuu. Dirqama gibiraa hundaa fi daldalootaaf barbaachisaa dha.',
   'c1000000-0000-0000-0000-000000000002', 0.00, 1, true, 'active', 'both', 'G2B',
   'Ethiopian Revenue and Customs Authority', 'tin@erca.gov.et', '+251-11-662-9000',
   '["Valid ID", "Business Registration Certificate", "Proof of Address"]'),

  ('s1000000-0000-0000-0000-000000000005', 'Tax Clearance Certificate', 'የግብር ማጽዳት ምስክር ወረቀት', 'Waraqaa Ragaa Qulqullina Gibiraa',
   'Obtain tax clearance certificate showing no outstanding tax obligations. Required for license renewals and government contracts.',
   'ያልተከፈሉ የግብር ግዴታዎች እንደሌሉ የሚያሳይ የግብር ማጽዳት ምስክር ወረቀት ያግኙ።',
   'Waraqaa ragaa qulqullina gibiraa dirqama gibiraa hin kaffalamne akka hin jirre agarsiisu argachuu.',
   'c1000000-0000-0000-0000-000000000002', 100.00, 5, true, 'active', 'both', 'G2B',
   'Ethiopian Revenue and Customs Authority', 'clearance@erca.gov.et', '+251-11-662-9001',
   '["TIN Certificate", "Tax Payment Receipts", "Business License"]'),

  ('s1000000-0000-0000-0000-000000000006', 'VAT Registration', 'የቫት ምዝገባ', 'Galmee VAT',
   'Register for Value Added Tax. Mandatory for businesses with annual turnover exceeding 1 million ETB.',
   'ለተጨማሪ እሴት ግብር ይመዝገቡ። ዓመታዊ ሽያጫቸው ከ1 ሚሊዮን ብር በላይ ለሆኑ ንግዶች ግዴታ ነው።',
   'Gibira Gatii Dabalataa galmeeffachuu. Daldaltoonni gurgurtaan waggaa isaanii miliyoona ETB 1 ol ta\'an dirqama.',
   'c1000000-0000-0000-0000-000000000002', 0.00, 3, true, 'active', 'business', 'G2B',
   'Ethiopian Revenue and Customs Authority', 'vat@erca.gov.et', '+251-11-662-9002',
   '["TIN Certificate", "Business Registration", "Bank Statement (Last 12 Months)", "Annual Revenue Declaration"]'),

  -- Trade & Commerce Services
  ('s1000000-0000-0000-0000-000000000007', 'Import License', 'የማስገባት ፈቃድ', 'Hayyama Galchuu',
   'Apply for import license to bring goods into Ethiopia. Different categories for commercial and industrial imports.',
   'ዕቃዎችን ወደ ኢትዮጵያ ለማስገባት የማስገባት ፈቃድ ያመልክቱ። ለንግድ እና ለኢንዱስትሪ ግዥዎች የተለያዩ ምድቦች።',
   'Meeshaalee gara Itoophiyaa galchuuf hayyama galchuu gaafachuu. Ramaddii adda addaa galchii daldalaa fi industiriif.',
   'c1000000-0000-0000-0000-000000000003', 2500.00, 14, true, 'active', 'business', 'G2B',
   'Ministry of Trade and Regional Integration', 'import@motr.gov.et', '+251-11-551-8030',
   '["Business Registration", "TIN Certificate", "Bank Statement", "Import Goods List", "Pro-forma Invoice", "Company Profile"]'),

  ('s1000000-0000-0000-0000-000000000008', 'Export License', 'የመላክ ፈቃድ', 'Hayyama Erguu',
   'Apply for export license to ship goods from Ethiopia. Required for all commercial exports.',
   'ዕቃዎችን ከኢትዮጵያ ለመላክ የመላክ ፈቃድ ያመልክቱ። ለሁሉም የንግድ ልኬቶች ያስፈልጋል።',
   'Meeshaalee Itoophiyaa irraa erguuf hayyama erguu gaafachuu. Ergaa daldalaa hundaaf barbaachisaa dha.',
   'c1000000-0000-0000-0000-000000000003', 2000.00, 10, true, 'active', 'business', 'G2B',
   'Ministry of Trade and Regional Integration', 'export@motr.gov.et', '+251-11-551-8031',
   '["Business Registration", "TIN Certificate", "Export Goods Details", "Quality Certificate", "Company Profile"]'),

  -- Civil Registration Services
  ('s1000000-0000-0000-0000-000000000009', 'Birth Certificate', 'የልደት ምስክር ወረቀት', 'Waraqaa Ragaa Dhalootaa',
   'Obtain official birth certificate. Required for school enrollment, passport, and legal purposes.',
   'ኦፊሴላዊ የልደት ምስክር ወረቀት ያግኙ። ለትምህርት ቤት ምዝገባ፣ ፓስፖርት እና ህጋዊ ዓላማዎች ያስፈልጋል።',
   'Waraqaa ragaa dhalootaa mootummaa argachuu. Galmee mana barnootaa, paaspoortii, fi kaayyoo seeraa qabuuf barbaachisaa dha.',
   'c1000000-0000-0000-0000-000000000004', 100.00, 3, true, 'active', 'citizen', 'G2C',
   'Vital Events Registration Agency', 'birth@vera.gov.et', '+251-11-550-1100',
   '["Parent ID Cards", "Hospital Birth Record", "Witnesses (2 persons)", "Application Form"]'),

  ('s1000000-0000-0000-0000-000000000010', 'National ID Card', 'ብሔራዊ መታወቂያ ካርድ', 'Kaardii Eenyummaa Biyyaalessaa',
   'Apply for Ethiopian National ID Card. Digital biometric identification for all citizens above 18.',
   'የኢትዮጵያ ብሔራዊ መታወቂያ ካርድ ያመልክቱ። ከ18 ዓመት በላይ ለሆኑ ሁሉም ዜጎች ዲጂታል ባዮሜትሪክ መለያ።',
   'Kaardii Eenyummaa Biyyaalessaa Itoophiyaa gaafachuu. Eenyummaa baayoometirikii dijitaalaa lammiileen umurii 18 olii hundaaf.',
   'c1000000-0000-0000-0000-000000000004', 50.00, 14, true, 'active', 'citizen', 'G2C',
   'Immigration and Citizenship Service', 'nationalid@ics.gov.et', '+251-11-551-5500',
   '["Birth Certificate", "Kebele ID", "Two Passport Photos", "Proof of Residence"]'),

  ('s1000000-0000-0000-0000-000000000011', 'Marriage Certificate', 'የጋብቻ ምስክር ወረቀት', 'Waraqaa Ragaa Fuudhaa',
   'Register marriage and obtain official marriage certificate.',
   'ጋብቻ ይመዝገቡ እና ኦፊሴላዊ የጋብቻ ምስክር ወረቀት ያግኙ።',
   'Fuudhaa galmeessuu fi waraqaa ragaa fuudhaa mootummaa argachuu.',
   'c1000000-0000-0000-0000-000000000004', 200.00, 7, true, 'active', 'citizen', 'G2C',
   'Vital Events Registration Agency', 'marriage@vera.gov.et', '+251-11-550-1101',
   '["Both Partners ID", "Birth Certificates", "Witnesses (2 persons)", "Declaration of Single Status"]'),

  -- Investment Services
  ('s1000000-0000-0000-0000-000000000012', 'Investment Permit', 'የኢንቨስትመንት ፈቃድ', 'Hayyama Investimentii',
   'Apply for domestic or foreign investment permit. Includes tax incentives and investment guarantees.',
   'ለአገር ውስጥ ወይም ለውጭ ኢንቨስትመንት ፈቃድ ያመልክቱ። የግብር ማበረታቻዎች እና የኢንቨስትመንት ዋስትናዎችን ያካትታል።',
   'Hayyama investimentii biyya keessaa yookaan alaa gaafachuu. Jajjabee gibiraa fi waadaa investimentii of keessaa qaba.',
   'c1000000-0000-0000-0000-000000000005', 5000.00, 21, true, 'active', 'business', 'G2B',
   'Ethiopian Investment Commission', 'invest@eic.gov.et', '+251-11-551-0033',
   '["Business Plan", "Capital Proof", "Feasibility Study", "Company Profile", "Board Resolution"]'),

  ('s1000000-0000-0000-0000-000000000013', 'Investment Incentive Application', 'የኢንቨስትመንት ማበረታቻ ማመልከቻ', 'Gaaffii Jajjabee Investimentii',
   'Apply for investment incentives including tax holidays, duty-free imports, and land allocation.',
   'የግብር እረፍት፣ ከቀረጥ ነጻ ግዥ እና የመሬት ድልድል ያካተቱ የኢንቨስትመንት ማበረታቻዎችን ያመልክቱ።',
   'Jajjabees investimentii kan boqonnaa gibiraa, galchii ashuuraa irraa bilisaa fi ramaddii lafaa dabalatu gaafachuu.',
   'c1000000-0000-0000-0000-000000000005', 1000.00, 30, true, 'active', 'business', 'G2B',
   'Ethiopian Investment Commission', 'incentives@eic.gov.et', '+251-11-551-0034',
   '["Investment Permit", "Investment Plan", "Employment Projection", "Environmental Assessment"]'),

  -- Land & Property Services
  ('s1000000-0000-0000-0000-000000000014', 'Land Use Certificate', 'የመሬት አጠቃቀም ምስክር ወረቀት', 'Waraqaa Ragaa Fayyadama Lafaa',
   'Obtain land use rights certificate for urban or rural land.',
   'ለከተማ ወይም ለገጠር መሬት የመሬት አጠቃቀም መብት ምስክር ወረቀት ያግኙ።',
   'Waraqaa ragaa mirga fayyadama lafaa magaalaa yookaan baadiyyaa argachuu.',
   'c1000000-0000-0000-0000-000000000006', 3000.00, 30, true, 'active', 'both', 'G2B',
   'Urban Land Development and Management Bureau', 'land@uldmb.gov.et', '+251-11-551-5000',
   '["ID Card", "Land Survey Document", "Proof of Payment", "Application Form", "Witnesses"]'),

  ('s1000000-0000-0000-0000-000000000015', 'Construction Permit', 'የግንባታ ፈቃድ', 'Hayyama Ijaarsa',
   'Apply for construction permit for new buildings or renovations.',
   'ለአዲስ ሕንፃዎች ወይም ለማሻሻያ የግንባታ ፈቃድ ያመልክቱ።',
   'Hayyama ijaarsa gamoo haaraa yookaan haaromsaaf gaafachuu.',
   'c1000000-0000-0000-0000-000000000006', 5000.00, 45, true, 'active', 'both', 'G2B',
   'Construction Permit and Control Authority', 'construction@cpca.gov.et', '+251-11-551-5001',
   '["Land Use Certificate", "Architectural Plan", "Structural Design", "Environmental Clearance", "Contractor License"]'),

  -- Employment & Labor Services
  ('s1000000-0000-0000-0000-000000000016', 'Work Permit (Foreign Workers)', 'የስራ ፈቃድ (የውጭ ሰራተኞች)', 'Hayyama Hojii (Hojjattoota Biyya Alaa)',
   'Apply for work permit for foreign nationals working in Ethiopia.',
   'በኢትዮጵያ ለሚሰሩ የውጭ ዜጎች የስራ ፈቃድ ያመልክቱ።',
   'Hayyama hojii lammiileen biyya alaa Itoophiyaa keessatti hojjataniif gaafachuu.',
   'c1000000-0000-0000-0000-000000000007', 3500.00, 21, true, 'active', 'business', 'G2B',
   'Ministry of Labor and Social Affairs', 'workpermit@molsa.gov.et', '+251-11-551-7000',
   '["Passport Copy", "Employment Contract", "Company Registration", "Justification Letter", "Photos"]'),

  -- Health & Safety Services
  ('s1000000-0000-0000-0000-000000000017', 'Health Certificate (Business)', 'የጤና ምስክር ወረቀት (ንግድ)', 'Waraqaa Ragaa Fayyaa (Daldalaa)',
   'Obtain health certificate for food and beverage businesses.',
   'ለምግብ እና መጠጥ ንግዶች የጤና ምስክር ወረቀት ያግኙ።',
   'Waraqaa ragaa fayyaa daldala nyaataa fi dhugaatiif argachuu.',
   'c1000000-0000-0000-0000-000000000008', 500.00, 7, true, 'active', 'business', 'G2B',
   'Ethiopian Food and Drug Authority', 'health@efda.gov.et', '+251-11-551-8000',
   '["Business License", "Premises Inspection Report", "Staff Health Cards", "Food Safety Plan"]'),

  ('s1000000-0000-0000-0000-000000000018', 'Environmental Clearance', 'የአካባቢ ምስክር ወረቀት', 'Ragaa Naannoo',
   'Obtain environmental impact clearance for industrial and construction projects.',
   'ለኢንዱስትሪ እና የግንባታ ፕሮጀክቶች የአካባቢ ተፅእኖ ፍቃድ ያግኙ።',
   'Ragaa dhiibbaa naannoo piroojektii industirii fi ijaarsaaf argachuu.',
   'c1000000-0000-0000-0000-000000000008', 2000.00, 45, true, 'active', 'business', 'G2B',
   'Environment, Forest and Climate Change Commission', 'eia@efccc.gov.et', '+251-11-551-9000',
   '["Project Description", "Environmental Impact Assessment", "Site Map", "Mitigation Plan"]')

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_am = EXCLUDED.name_am,
  name_or = EXCLUDED.name_or,
  description = EXCLUDED.description,
  description_am = EXCLUDED.description_am,
  description_or = EXCLUDED.description_or,
  service_fee = EXCLUDED.service_fee,
  estimated_processing_days = EXCLUDED.estimated_processing_days,
  requirements = EXCLUDED.requirements,
  status = 'active';

-- ============================================
-- 3. SEED SERVICE REQUIREMENTS
-- ============================================

-- For Business Registration
INSERT INTO service_requirements (id, service_id, requirement_name, requirement_name_am, requirement_name_or, requirement_type, description, is_mandatory, display_order, accepted_formats, is_active)
VALUES
  (gen_random_uuid(), 's1000000-0000-0000-0000-000000000001', 'Valid ID', 'ብቁ መታወቂያ', 'Eenyummaa Sirrii', 'document', 'Kebele ID, Passport, or National ID', true, 1, '["pdf", "jpg", "png"]', true),
  (gen_random_uuid(), 's1000000-0000-0000-0000-000000000001', 'Proof of Address', 'የአድራሻ ማረጋገጫ', 'Ragaa Teessoo', 'document', 'Utility bill or lease agreement', true, 2, '["pdf", "jpg", "png"]', true),
  (gen_random_uuid(), 's1000000-0000-0000-0000-000000000001', 'Business Plan', 'የንግድ ዕቅድ', 'Karoora Daldalaa', 'document', 'Detailed business plan document', true, 3, '["pdf", "docx"]', true),
  (gen_random_uuid(), 's1000000-0000-0000-0000-000000000001', 'Capital Proof', 'የካፒታል ማረጋገጫ', 'Ragaa Kaappitaalaa', 'document', 'Bank statement showing minimum capital', true, 4, '["pdf"]', true),
  (gen_random_uuid(), 's1000000-0000-0000-0000-000000000001', 'Passport Photos', 'የፓስፖርት ፎቶዎች', 'Suuraalee Paaspoortii', 'photo', 'Two recent passport-size photos', true, 5, '["jpg", "png"]', true)
ON CONFLICT DO NOTHING;

-- ============================================
-- 4. SEED SERVICE FEES
-- ============================================

INSERT INTO service_fees (id, service_id, fee_name, fee_name_am, fee_type, amount, currency, is_active)
VALUES
  (gen_random_uuid(), 's1000000-0000-0000-0000-000000000001', 'Registration Fee', 'የምዝገባ ክፍያ', 'fixed', 500.00, 'ETB', true),
  (gen_random_uuid(), 's1000000-0000-0000-0000-000000000001', 'Certificate Fee', 'የምስክር ወረቀት ክፍያ', 'fixed', 100.00, 'ETB', true),
  (gen_random_uuid(), 's1000000-0000-0000-0000-000000000004', 'TIN Registration', 'የቲን ምዝገባ', 'fixed', 0.00, 'ETB', true),
  (gen_random_uuid(), 's1000000-0000-0000-0000-000000000007', 'Import License Fee', 'የማስገባት ፈቃድ ክፍያ', 'fixed', 2500.00, 'ETB', true),
  (gen_random_uuid(), 's1000000-0000-0000-0000-000000000009', 'Birth Certificate Fee', 'የልደት ምስክር ወረቀት ክፍያ', 'fixed', 100.00, 'ETB', true)
ON CONFLICT DO NOTHING;

-- ============================================
-- 5. SEED SERVICE DELIVERY OPTIONS
-- ============================================

INSERT INTO service_delivery_options (id, service_id, delivery_name, delivery_name_am, delivery_method, processing_days, is_active, display_order)
VALUES
  (gen_random_uuid(), 's1000000-0000-0000-0000-000000000001', 'Standard Processing', 'መደበኛ ሂደት', 'in_person', 5, true, 1),
  (gen_random_uuid(), 's1000000-0000-0000-0000-000000000001', 'Express Processing', 'ፈጣን ሂደት', 'in_person', 2, true, 2),
  (gen_random_uuid(), 's1000000-0000-0000-0000-000000000004', 'Online Application', 'የመስመር ላይ ማመልከቻ', 'online', 1, true, 1),
  (gen_random_uuid(), 's1000000-0000-0000-0000-000000000009', 'Standard', 'መደበኛ', 'in_person', 3, true, 1),
  (gen_random_uuid(), 's1000000-0000-0000-0000-000000000009', 'Express', 'ፈጣን', 'in_person', 1, true, 2)
ON CONFLICT DO NOTHING;

-- ============================================
-- 6. SEED SERVICE WORKFLOWS
-- ============================================

INSERT INTO service_workflows (id, service_id, workflow_name, workflow_name_am, initial_state, states, transitions, is_active)
VALUES
  (gen_random_uuid(), 's1000000-0000-0000-0000-000000000001', 'Business Registration Workflow', 'የንግድ ምዝገባ የስራ ሂደት', 'submitted',
   '{"submitted": {"name": "Submitted", "description": "Application submitted"}, "under_review": {"name": "Under Review", "description": "Being reviewed by officer"}, "documents_requested": {"name": "Documents Requested", "description": "Additional documents needed"}, "approved": {"name": "Approved", "description": "Application approved"}, "rejected": {"name": "Rejected", "description": "Application rejected"}, "completed": {"name": "Completed", "description": "Certificate issued"}}',
   '[{"from": "submitted", "to": "under_review", "action": "start_review"}, {"from": "under_review", "to": "documents_requested", "action": "request_documents"}, {"from": "under_review", "to": "approved", "action": "approve"}, {"from": "under_review", "to": "rejected", "action": "reject"}, {"from": "documents_requested", "to": "under_review", "action": "documents_submitted"}, {"from": "approved", "to": "completed", "action": "issue_certificate"}]',
   true)
ON CONFLICT DO NOTHING;

-- ============================================
-- 7. SEED FAQs FOR SERVICES
-- ============================================

INSERT INTO faqs (id, question, question_am, question_or, answer, answer_am, answer_or, category, status, is_featured, sort_order)
VALUES
  (gen_random_uuid(), 'How long does business registration take?', 'የንግድ ምዝገባ ምን ያህል ጊዜ ይወስዳል?', 'Galmeen daldalaa hangam fudhata?',
   'Standard business registration takes 5 business days. Express processing is available for an additional fee and takes 2 business days.',
   'መደበኛ የንግድ ምዝገባ 5 የስራ ቀናት ይወስዳል። ፈጣን ሂደት ተጨማሪ ክፍያ ያስፈልጋል እና 2 የስራ ቀናት ይወስዳል።',
   'Galmeen daldalaa idilee guyyaa hojii 5 fudhata. Adeemsii ariifataa kaffaltii dabalataatiin argamuu fi guyyaa hojii 2 fudhata.',
   'Business Registration', 'published', true, 1),
   
  (gen_random_uuid(), 'What documents are required for TIN registration?', 'ለቲን ምዝገባ ምን ሰነዶች ያስፈልጋሉ?', 'Galmee TIN tiif sanadoonni maaltu barbaachisa?',
   'TIN registration requires: Valid ID (Kebele or Passport), Business Registration Certificate (for businesses), and Proof of Address.',
   'ለቲን ምዝገባ: ብቁ መታወቂያ (ቀበሌ ወይም ፓስፖርት)፣ የንግድ ምዝገባ ምስክር ወረቀት (ለንግዶች)፣ እና የአድራሻ ማረጋገጫ ያስፈልጋል።',
   'Galmee TIN tiif: Eenyummaa sirrii (Kebele yookaan Paaspoortii), Waraqaa ragaa galmee daldalaa (daldaltoota tiif), fi ragaa teessoo barbaachisa.',
   'Tax Services', 'published', true, 2),
   
  (gen_random_uuid(), 'Can I apply for services online?', 'አገልግሎቶችን በመስመር ላይ ማመልከት እችላለሁ?', 'Tajaajila onlaayiniin gaafachuu nan danda\'aa?',
   'Yes, many services are available online through the Ethiopian Navigator portal. Services marked as "Online Available" can be applied for and tracked online.',
   'አዎ፣ ብዙ አገልግሎቶች በኢትዮጵያ ናቪጌተር ፖርታል በመስመር ላይ ይገኛሉ። "በመስመር ላይ ይገኛል" ተብለው የተመለከቱ አገልግሎቶች በመስመር ላይ ማመልከት እና መከታተል ይቻላል።',
   'Eeyyee, tajaajiloonni hedduun poortaalii Ethiopian Navigator irratti onlaayiniin ni argamu. Tajaajiloonni "Onlaayiniin Argamuu Danda\'u" jedhamanii ibsaman onlaayiniin gaafatamuu fi hordofamuu danda\'u.',
   'General', 'published', true, 3),

  (gen_random_uuid(), 'What if the service I need is not listed?', 'ያስፈልገኝ አገልግሎት ካልተዘረዘረ ምን ልሁን?', 'Tajaajilli na barbaachisu tarreeffamuu baannaan maal godhuu?',
   'If you cannot find the service you need, you can submit a Service Request through our portal. Our team will review your request and either direct you to the correct service or escalate to human support for assistance.',
   'የሚፈልጉትን አገልግሎት ማግኘት ካልቻሉ በፖርታላችን በኩል የአገልግሎት ጥያቄ ማቅረብ ይችላሉ። ቡድናችን ጥያቄዎን ይገመግማል እና ወደ ትክክለኛው አገልግሎት ይመራዎታል ወይም ለሰው ድጋፍ ያስተላልፋል።',
   'Tajaajila barbaaddu argachuu yoo hin dandeenye, Gaaffii Tajaajilaa poortaalii keenya irraan dhiyeessuu dandeessa. Gareen keenya gaaffii kee ni sakatta\'u, tajaajila sirrii sitti agarsiisu yookaan gargaarsa namaatiif dabarsuu.',
   'General', 'published', true, 4)
ON CONFLICT DO NOTHING;

-- ============================================
-- 8. SEED KNOWLEDGE ARTICLES
-- ============================================

INSERT INTO knowledge_articles (id, title, title_am, title_or, content, content_am, content_or, category, status, tags)
VALUES
  (gen_random_uuid(), 'Complete Guide to Business Registration in Ethiopia', 'በኢትዮጵያ የንግድ ምዝገባ ሙሉ መመሪያ', 'Qajeelfama Guutuu Galmee Daldalaa Itoophiyaa',
   'Starting a business in Ethiopia requires proper registration with the Ministry of Trade. This guide covers all steps from name reservation to obtaining your trade license.\n\n**Step 1: Reserve Business Name**\nFirst, you need to reserve a unique business name. Submit 3 name choices to the registrar.\n\n**Step 2: Prepare Documents**\nGather all required documents including ID, business plan, and capital proof.\n\n**Step 3: Submit Application**\nSubmit your complete application either online or in person.\n\n**Step 4: Pay Fees**\nPay the registration and certificate fees.\n\n**Step 5: Collect Certificate**\nOnce approved, collect your business registration certificate.',
   'በኢትዮጵያ ንግድ መጀመር ከንግድ ሚኒስቴር ጋር ትክክለኛ ምዝገባ ይጠይቃል።',
   'Itoophiyaa keessatti daldala jalqabuuf Ministeera Daldalaa waliin galmee sirrii barbaachisa.',
   'Business Registration', 'published', ARRAY['registration', 'business', 'guide', 'trade license']),

  (gen_random_uuid(), 'Understanding TIN and VAT Registration', 'ቲን እና ቫት ምዝገባን መረዳት', 'Galmee TIN fi VAT Hubachuu',
   'Tax registration is essential for all businesses and many individuals in Ethiopia.\n\n**TIN Registration**\nTax Identification Number (TIN) is required for:\n- All registered businesses\n- Individuals with taxable income\n- Property owners\n\n**VAT Registration**\nValue Added Tax registration is mandatory when:\n- Annual turnover exceeds 1 million ETB\n- You import goods for commercial purposes\n- You provide certain professional services',
   'የግብር ምዝገባ ለሁሉም ንግዶች እና ለብዙ ግለሰቦች በኢትዮጵያ አስፈላጊ ነው።',
   'Galmeen gibiraa daldala hundaa fi namoota hedduuf Itoophiyaa keessatti barbaachisaa dha.',
   'Tax Services', 'published', ARRAY['tin', 'vat', 'tax', 'registration'])
ON CONFLICT DO NOTHING;

-- Seed complete!
-- Services: 18 comprehensive services across 8 categories
-- Requirements: 5 document requirements for key services
-- Fees: 5 fee structures
-- Delivery Options: 5 delivery methods
-- Workflows: 1 complete workflow
-- FAQs: 4 service-related FAQs
-- Knowledge Articles: 2 detailed guides
