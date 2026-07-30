-- Seed script for Ethiopian Navigator demo data
-- This script populates demo users, services, categories, and related data

-- 1. Clear existing demo data (optional - comment out for production)
-- DELETE FROM users WHERE email LIKE '%@demo.enav%' OR email LIKE '%@test.enav%';

-- 2. Insert Demo Users with hashed passwords using pgcrypto
-- Passwords: citizen123, employee123, partner123, admin123
INSERT INTO users (id, email, full_name, password_hash, role, status, preferred_language, email_verified, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'citizen@demo.enav', 'Demo Citizen', crypt('citizen123', gen_salt('bf')), 'citizen', 'active', 'en', true, NOW(), NOW()),
  (gen_random_uuid(), 'employee@demo.enav', 'Demo Employee', crypt('employee123', gen_salt('bf')), 'employee', 'active', 'en', true, NOW(), NOW()),
  (gen_random_uuid(), 'partner@demo.enav', 'Demo Partner', crypt('partner123', gen_salt('bf')), 'partner', 'active', 'en', true, NOW(), NOW()),
  (gen_random_uuid(), 'admin@demo.enav', 'Demo Admin', crypt('admin123', gen_salt('bf')), 'admin', 'active', 'en', true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 3. Insert Service Categories
INSERT INTO service_categories (id, name, name_am, name_or, description, icon, sort_order, is_active, created_at)
VALUES 
  (gen_random_uuid(), 'Business Registration', 'ንግድ ምዝገባ', 'Qaamota Galii', 'Business and enterprise registration services', 'briefcase', 1, true, NOW()),
  (gen_random_uuid(), 'Licensing & Permits', 'ፈቃድ እና ሌሴንስ', 'Digama iyo Laysensa', 'Licenses and permits for businesses', 'scroll', 2, true, NOW()),
  (gen_random_uuid(), 'Tax Services', 'ግብር አገልግሎቶች', 'Alaabta Kabaajiyada', 'Tax filing and payment services', 'calculator', 3, true, NOW()),
  (gen_random_uuid(), 'Identity Services', 'ማንነት አገልግሎቶች', 'Alaabta Aqoonsiga', 'ID and documentation services', 'card', 4, true, NOW()),
  (gen_random_uuid(), 'Education Services', 'ትምህርት አገልግሎቶች', 'Alaabta Waxbarashada', 'Education enrollment and certificates', 'book', 5, true, NOW()),
  (gen_random_uuid(), 'Health Services', 'ጤና አገልግሎቶች', 'Alaabta Caafimaadka', 'Healthcare and medical services', 'heart', 6, true, NOW())
ON CONFLICT DO NOTHING;

-- 4. Insert Business Sectors
INSERT INTO business_sectors (id, name, name_am, name_or, code, description, is_active, created_at)
VALUES 
  (gen_random_uuid(), 'Technology', 'ቴክኖሎጂ', 'Teknolojiya', 'TECH', 'Information technology sector', true, NOW()),
  (gen_random_uuid(), 'Retail & Commerce', 'ንግድ', 'Ganacsi', 'RETAIL', 'Retail and commerce sector', true, NOW()),
  (gen_random_uuid(), 'Manufacturing', 'ማኑፋክቸር', 'Ururinta', 'MFG', 'Manufacturing sector', true, NOW()),
  (gen_random_uuid(), 'Services', 'አገልግሎቶች', 'Alaabta', 'SRV', 'Professional services sector', true, NOW()),
  (gen_random_uuid(), 'Agriculture', 'ግብርና', 'Waaxbarashada', 'AGR', 'Agriculture and farming sector', true, NOW())
ON CONFLICT DO NOTHING;

-- 5. Insert Business Entity Types
INSERT INTO business_entity_types (id, code, name, name_am, name_or, description, is_active, created_at)
VALUES 
  (gen_random_uuid(), 'SOLE', 'Sole Proprietorship', 'ነጠላ ሥራ', 'Iskaashi Midkood', 'Individual business owner', true, NOW()),
  (gen_random_uuid(), 'PART', 'Partnership', 'ባልደረባ', 'Iskaashi Wadaag', 'Business partnership', true, NOW()),
  (gen_random_uuid(), 'LLC', 'Limited Liability Company', 'ዝቅተኛ ተጠያቂነት', 'Kampuni Xaddiga Dhamaadka', 'LLC structure', true, NOW()),
  (gen_random_uuid(), 'CORP', 'Corporation', 'ኮርፖሬሽን', 'Kampaaniga', 'Corporate business', true, NOW()),
  (gen_random_uuid(), 'NGO', 'Non-Governmental Organization', 'ፀረ-መንግስታዊ ድርጅት', 'Ururka Halka Joog', 'NGO organization', true, NOW())
ON CONFLICT DO NOTHING;

-- 6. Insert Demo Services (most commonly used)
INSERT INTO services (id, name, name_am, name_or, description, description_am, category_id, agency, status, online_available, estimated_processing_days, service_fee, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'Business Registration', 'ንግድ ምዝገባ', 'Qaamota Galii', 'Register a new business', 'ሥራ ወይም ንግድ ወደ ስኩአር ምዝገባ', (SELECT id FROM service_categories WHERE name = 'Business Registration' LIMIT 1), 'Trade Office', 'active', true, 7, 500, NOW(), NOW()),
  (gen_random_uuid(), 'Tax Identification Number', 'ግብር መታወቂያ ቁጥር', 'Lambarka Aqoonsiga Kabaajiyada', 'Get a TIN for tax purposes', 'ግብር መታወቂያ ቁጥር ለማግኘት', (SELECT id FROM service_categories WHERE name = 'Tax Services' LIMIT 1), 'Tax Authority', 'active', true, 3, 0, NOW(), NOW()),
  (gen_random_uuid(), 'Trade License', 'የንግድ ፍቃድ', 'Digama Ganacsi', 'Apply for a trade license', 'የንግድ ፍቃድ ለማግኘት', (SELECT id FROM service_categories WHERE name = 'Licensing & Permits' LIMIT 1), 'Trade Office', 'active', true, 10, 1000, NOW(), NOW()),
  (gen_random_uuid(), 'Birth Certificate', 'የወለደ ሰርቲፍኬት', 'Shahaadada Dhalka', 'Obtain a birth certificate', 'የወለደ ሰርቲፍኬት ለማግኘት', (SELECT id FROM service_categories WHERE name = 'Identity Services' LIMIT 1), 'Civil Registry', 'active', true, 5, 50, NOW(), NOW()),
  (gen_random_uuid(), 'School Enrollment', 'የትምህርት ቤት ምዝገባ', 'Qeybinta Dugsi', 'Enroll in school', 'በትምህርት ቤት ውስጥ ምዝገባ', (SELECT id FROM service_categories WHERE name = 'Education Services' LIMIT 1), 'Ministry of Education', 'active', true, 2, 0, NOW(), NOW()),
  (gen_random_uuid(), 'Health Insurance', 'የጤና 보험', 'Caasimada Caafimaadka', 'Register for health insurance', 'ለጤና 保険 ምዝገባ', (SELECT id FROM service_categories WHERE name = 'Health Services' LIMIT 1), 'Ministry of Health', 'active', true, 7, 200, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 7. Insert Notification Preferences for demo users
INSERT INTO notification_preferences (id, user_id, email_enabled, sms_enabled, push_enabled, in_app_enabled, language, created_at, updated_at)
SELECT gen_random_uuid(), id, true, true, true, true, 'en', NOW(), NOW()
FROM users 
WHERE email LIKE '%@demo.enav%'
ON CONFLICT DO NOTHING;

-- 8. Insert Service Categories Localization (already done in step 3)
-- 9. Insert FAQ entries for common questions
INSERT INTO faqs (id, question, question_am, question_or, answer, answer_am, answer_or, category, status, is_featured, sort_order, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'How do I register a business?', 'ንግድ እንዴት እሞወጅ?', 'Sidee baan ganacsi uga qeybsan kara?', 'Visit the Trade Office with required documents and ID.', 'ከሚያስፈልገዎ 类据 ጋር ንግድ ሥራ ቢሮ ጎብኙ።', 'Booqo Xarumta Ganacsi oo qaadi xog-tareen loo baahan.', 'Business', 'published', true, 1, NOW(), NOW()),
  (gen_random_uuid(), 'What is a TIN number?', 'TIN ቁጥር ምንድነው?', 'Lambarka TIN waa maxay?', 'A Taxpayer Identification Number issued by tax authorities.', 'በግብር ባለሥልጣን የሚሰጠው የግብር ተከታይ መታወቂያ ቁጥር ነው።', 'Waa lambarka aqoonsiga kabaajiyada ee lagu soo saara mashaakiilka.', 'Taxes', 'published', true, 2, NOW(), NOW()),
  (gen_random_uuid(), 'How long does processing take?', 'ሂደቱ ምን ያህል ጊዜ ይወስዳል?', 'Habka maxaa sagal bixiya?', 'Processing times vary by service. Check the service details.', 'ሂደቱ በአገልግሎት ይለያያል። አገልግሎት ዝርዝር ይመልከቱ።', 'Waqtigu kala duwan yahay ee aadka gudaha. Eeg faafinta alaabta.', 'General', 'published', true, 3, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 10. Insert Knowledge Articles
INSERT INTO knowledge_articles (id, title, title_am, title_or, content, content_am, category, status, author_id, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'Business Registration Guide', 'ንግድ ምዝገባ መምሪያ', 'Qaamuus Qaamota Galii', 'A comprehensive guide to registering your business...', 'ንግድዎን ለመመዝገብ ሙሉ መመሪያ...', 'Business', 'published', (SELECT id FROM users WHERE role = 'admin' AND email LIKE '%@demo.enav%' LIMIT 1), NOW(), NOW()),
  (gen_random_uuid(), 'Tax Filing Requirements', 'ግብር ማስገቢያ መፍቀጃ', 'Talooyin Kabaajiya Jajabista', 'Understanding tax filing requirements...', 'ግብር ማስገቢያ መፍቀጃዎችን መረዳት...', 'Tax', 'published', (SELECT id FROM users WHERE role = 'admin' AND email LIKE '%@demo.enav%' LIMIT 1), NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Display confirmation
SELECT 'Seed data inserted successfully!' as status,
       (SELECT COUNT(*) FROM users WHERE email LIKE '%@demo.enav%') as demo_users,
       (SELECT COUNT(*) FROM service_categories) as service_categories,
       (SELECT COUNT(*) FROM services) as services,
       (SELECT COUNT(*) FROM faqs) as faqs;
