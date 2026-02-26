-- Ethiopian Navigator MVP - Services Preseed Data
-- Organized government services with details from ENav Database

-- Land & Housing Services
INSERT INTO services (name, name_am, name_or, description, description_am, description_or, category_id, agency, contact_email, contact_phone, status, service_fee, estimated_processing_days, online_available, requirements) VALUES
('Title Deed Certificate Authenticity Verification', 'ስብowner ደብ ማረጋገጫ', 'Mirkaneessa Saartii Warsituu', 'Verify the authenticity of your title deed certificate', 'ስብowner ደብ ማረጋገጫ', 'Mirkaneessa Saartii Warsituu', (SELECT id FROM service_categories WHERE name = 'Land & Housing' LIMIT 1), 'MOUD', 'landtitle@moud.gov.et', '+251-11-123-4567', 'active', 150.00, 5, true, '["Valid title deed", "National ID", "Office address proof"]'),

('Apartment/Condominium Title Deed Transfer', 'አፓርታማ ስብowner ድብ ምሊክ ልውውጥ', 'Gurgursa Saartii Mana', 'Transfer apartment title deed to new owner', 'አፓርታማ ስብowner ድብ ምሊክ ልውውጥ', 'Gurgursa Saartii Mana', (SELECT id FROM service_categories WHERE name = 'Land & Housing' LIMIT 1), 'MOUD', 'property.transfer@moud.gov.et', '+251-11-123-4569', 'active', 800.00, 7, true, '["Current title deed", "Sale agreement", "Both parties ID", "Transfer fee"]'),

-- Legal & Justice Services
('Legal Document Notarization', 'ሕጋዊ ሰነድ ማረጋገጫ', 'Mirkaneessa Yaada Seeraa', 'Official notarization of legal documents', 'ሕጋዊ ሰነድ ማረጋገጫ', 'Mirkaneessa Yaada Seeraa', (SELECT id FROM service_categories WHERE name = 'Legal & Justice' LIMIT 1), 'Ministry of Justice', 'notary@justice.gov.et', '+251-11-234-5678', 'active', 50.00, 1, true, '["Original documents", "National ID", "Signature verification"]'),

('Power of Attorney Registration', 'የባለስልጣን ስልጣን ምዝገባ', 'Galmee Handhura Raajii', 'Register a power of attorney document', 'የባለስልጣን ስልጣን ምዝገባ', 'Galmee Handhura Raajii', (SELECT id FROM service_categories WHERE name = 'Legal & Justice' LIMIT 1), 'Ministry of Justice', 'poa@justice.gov.et', '+251-11-234-5679', 'active', 200.00, 3, true, '["POA form", "National IDs", "Witness signatures"]'),

-- Citizenship & Immigration Services
('Ethiopian Passport Application', 'ኢትዮጲያዊ ፓስፖርት ማመልከቻ', 'Addisa Pasipoorta', 'Apply for a new Ethiopian passport', 'ኢትዮጲያዊ ፓስፖርት ማመልከቻ', 'Addisa Pasipoorta', (SELECT id FROM service_categories WHERE name = 'Citizenship & Immigration' LIMIT 1), 'Immigration Office', 'passport@immigration.gov.et', '+251-11-345-6789', 'active', 1500.00, 20, true, '["Birth certificate", "National ID", "4 photos", "Medical form"]'),

('Passport Renewal Service', 'ፓስፖርት ሪኒዋል', 'Cuqaasuu Pasipoorta', 'Renew your Ethiopian passport', 'ፓስፖርት ሪኒዋል', 'Cuqaasuu Pasipoorta', (SELECT id FROM service_categories WHERE name = 'Citizenship & Immigration' LIMIT 1), 'Immigration Office', 'passport.renewal@immigration.gov.et', '+251-11-345-6790', 'active', 1200.00, 10, true, '["Current passport", "2 photos", "Renewal fee"]'),

('National ID Card Application', 'ብሔራዊ መታወቂያ ጉባ ማመልከቻ', 'Addisa Kaardii Ummata', 'Apply for Ethiopian National ID card', 'ብሔራዊ መታወቂያ ጉባ ማመልከቻ', 'Addisa Kaardii Ummata', (SELECT id FROM service_categories WHERE name = 'Citizenship & Immigration' LIMIT 1), 'Immigration Office', 'natid@immigration.gov.et', '+251-11-345-6791', 'active', 150.00, 5, true, '["Birth certificate", "2 photos", "Residence proof", "Application fee"]'),

('Birth Certificate Registration', 'ልደት ሰነድ ምዝገባ', 'Galmee Ilmaa Dhalaanuu', 'Register a new birth with vital events office', 'ልደት ሰነድ ምዝገባ', 'Galmee Ilmaa Dhalaanuu', (SELECT id FROM service_categories WHERE name = 'Citizenship & Immigration' LIMIT 1), 'Vital Events Office', 'birth@vital.gov.et', '+251-11-345-6792', 'active', 50.00, 3, true, '["Hospital birth record", "Parents IDs", "Marriage certificate"]'),

-- Business & Investment Services
('Business License Registration', 'የንግድ ፈቃድ ምዝገባ', 'Galmee Lisensi Daldala', 'Register a new business and obtain license', 'የንግድ ፈቃድ ምዝገባ', 'Galmee Lisensi Daldala', (SELECT id FROM service_categories WHERE name = 'Business & Investment' LIMIT 1), 'Trade Ministry', 'biz.license@trade.gov.et', '+251-11-456-7890', 'active', 500.00, 10, true, '["Business plan", "Owner ID", "Office lease", "Tax ID"]'),

('Trade License Application', 'ሌንስ ንግድ ማመልከቻ', 'Omishsha Daldalaa Galmee', 'Apply for trade license to conduct business', 'ሌንስ ንግድ ማመልከቻ', 'Omishsha Daldalaa Galmee', (SELECT id FROM service_categories WHERE name = 'Business & Investment' LIMIT 1), 'Trade Ministry', 'trade.license@trade.gov.et', '+251-11-456-7891', 'active', 400.00, 7, true, '["Location proof", "Owner ID", "Business plan"]'),

('Investment License Application', 'የኢንቨስትመንት ፈቃድ ማመልከቻ', 'Galmee Lisensi Invastiminti', 'Apply for investment license with government', 'የኢንቨስትመንት ፈቃድ ማመልከቻ', 'Galmee Lisensi Invastiminti', (SELECT id FROM service_categories WHERE name = 'Business & Investment' LIMIT 1), 'Investment Commission', 'invest@investment.gov.et', '+251-11-456-7892', 'active', 3000.00, 25, false, '["Business proposal", "Financial documents", "Owner ID", "Sector plan"]'),

-- Employment & Labor Services
('Work Permit Application', 'የስራ ፈቃድ ማመልከቻ', 'Galmee Lisensi Hojii', 'Apply for work permit to legally work in Ethiopia', 'የስራ ፈቃድ ማመልከቻ', 'Galmee Lisensi Hojii', (SELECT id FROM service_categories WHERE name = 'Employment & Labor' LIMIT 1), 'Ministry of Labor', 'workpermit@labor.gov.et', '+251-11-567-8901', 'active', 800.00, 10, true, '["Job offer", "Employer letter", "National ID", "Medical form"]'),

('Professional License Application', 'ሙያዊ ፈቃድ ማመልከቻ', 'Galmee Lisensi Odeeffannoo', 'Apply for professional license in your field', 'ሙያዊ ፈቃድ ማመልከቻ', 'Galmee Lisensi Odeeffannoo', (SELECT id FROM service_categories WHERE name = 'Employment & Labor' LIMIT 1), 'Ministry of Labor', 'professional@labor.gov.et', '+251-11-567-8902', 'active', 1000.00, 15, true, '["Educational credentials", "Work experience", "Application fee"]'),

-- Transportation & Logistics Services
('Driver License Application', 'የመኪናው ኪያ ማመልከቻ', 'Galmee Lisensi Konkokaachaa', 'Apply for Ethiopian driver license', 'የመኪናው ኪያ ማመልከቻ', 'Galmee Lisensi Konkokaachaa', (SELECT id FROM service_categories WHERE name = 'Transportation & Logistics' LIMIT 1), 'Transport Ministry', 'driver@transport.gov.et', '+251-11-678-9012', 'active', 300.00, 7, true, '["National ID", "Medical certificate", "Driving school cert", "2 photos"]'),

('Vehicle Registration', 'መኪናው ምዝገባ', 'Galmee Konkokaachaa', 'Register a new vehicle', 'መኪናው ምዝገባ', 'Galmee Konkokaachaa', (SELECT id FROM service_categories WHERE name = 'Transportation & Logistics' LIMIT 1), 'Transport Ministry', 'vehicle@transport.gov.et', '+251-11-678-9013', 'active', 500.00, 10, true, '["Bill of sale", "Owner ID", "Insurance proof", "Inspection"]'),

('Freight License Application', 'የሸማ ወጋቢ ፈቃድ ማመልከቻ', 'Galmee Lisensi Gad-jaruu', 'Apply for freight transport license', 'የሸማ ወጋቢ ፈቃድ ማመልከቻ', 'Galmee Lisensi Gad-jaruu', (SELECT id FROM service_categories WHERE name = 'Transportation & Logistics' LIMIT 1), 'Transport Ministry', 'freight@transport.gov.et', '+251-11-678-9014', 'active', 2000.00, 15, false, '["Vehicle ownership", "Insurance", "Safety certs", "Application fee"]'),

-- Finance & Taxation Services
('Tax Registration Certificate', 'ግብር ምዝገባ ሰነድ', 'Galmee Kaffaltii Muummee', 'Register for tax and obtain tax ID', 'ግብር ምዝገባ ሰነድ', 'Galmee Kaffaltii Muummee', (SELECT id FROM service_categories WHERE name = 'Finance & Taxation' LIMIT 1), 'Revenue Ministry', 'tax@revenue.gov.et', '+251-11-789-0123', 'active', 50.00, 5, true, '["Business registration", "Owner ID", "Business address", "Financial docs"]'),

('Business Tax Clearance', 'የንግድ ግብር ንጅ ሰነድ', 'Galmee Qara Kaffaltii Daldala', 'Obtain tax clearance for business', 'የንግድ ግብር ንጅ ሰነድ', 'Galmee Qara Kaffaltii Daldala', (SELECT id FROM service_categories WHERE name = 'Finance & Taxation' LIMIT 1), 'Revenue Ministry', 'tax.clearance@revenue.gov.et', '+251-11-789-0124', 'active', 100.00, 7, true, '["Tax ID", "Annual tax returns", "Compliance verification"]'),

('Loan Application Assistance', 'የብድር ማመልከቻ ረዳታ', 'Gargaarsa Galmee Liqii', 'Official assistance for government loan applications', 'የብድር ማመልከቻ ረዳታ', 'Gargaarsa Galmee Liqii', (SELECT id FROM service_categories WHERE name = 'Finance & Taxation' LIMIT 1), 'Development Bank', 'loan@dbe.gov.et', '+251-11-789-0125', 'active', 500.00, 25, false, '["Business plan", "Tax clearance", "Collateral docs", "ID verification"]'),

('Grant Application Support', 'ፊተወሰደ ማመልከቻ ድጋፍ', 'Deeggarsi Galmee Handhura', 'Apply for government grants and subsidies', 'ፊተወሰደ ማመልከቻ ድጋፍ', 'Deeggarsi Galmee Handhura', (SELECT id FROM service_categories WHERE name = 'Finance & Taxation' LIMIT 1), 'Ministry of Finance', 'grants@finance.gov.et', '+251-11-789-0126', 'active', 1000.00, 45, false, '["Business proposal", "Financial statements", "Eligibility docs"]');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_services_category_id ON services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
CREATE INDEX IF NOT EXISTS idx_services_online ON services(online_available);
