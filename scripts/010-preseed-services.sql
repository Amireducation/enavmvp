-- Ethiopian Navigator MVP - Services Preseed Data
-- Organized government services with details from ENav Database
-- Date: 2026-02-26

-- ============================================================================
-- PRESEED SERVICES DATA
-- ============================================================================

-- Insert Land & Housing Category Services
INSERT INTO services (name, description, category, requirements, processing_time, price, is_active, featured, icon_url) 
VALUES
-- Land & Housing Services
('Title Deed Certificate Authenticity Verification', 'Verify the authenticity of your title deed certificate with government authorities', 'Land & Housing', 'Valid title deed, National ID, Office address proof', '5-7 business days', 150.00, true, true, 'https://api.iconify.design/mdi:document-check.svg'),
('Merge Bordering Plots Service', 'Merge two or more bordering plots managed under freehold ownership', 'Land & Housing', 'Both title deeds, Land surveyor report, Property maps, Ownership proof', '10-15 business days', 500.00, true, false, 'https://api.iconify.design/mdi:home-group.svg'),
('Apartment/Condominium Title Deed Transfer', 'Transfer apartment or condominium title deed to new owner', 'Land & Housing', 'Current title deed, Sale agreement, Both parties ID, Transfer fee payment', '7-10 business days', 800.00, true, true, 'https://api.iconify.design/mdi:home-switch.svg'),
('Property Title Evidence Documentation', 'Obtain evidence documentation related to various property possessions', 'Land & Housing', 'Property title deed, Ownership proof, Office address verification', '3-5 business days', 100.00, true, false, 'https://api.iconify.design/mdi:file-document.svg'),
('Building Tax Estimation Service', 'Get professional estimation of building tax for your property', 'Land & Housing', 'Property deed, Building specifications, Recent photographs', '5 business days', 200.00, true, false, 'https://api.iconify.design/mdi:calculator.svg'),
('Title Deed Format Update Service', 'Update your title deed to the new government format', 'Land & Housing', 'Current title deed, National ID, Recent address proof', '7 business days', 250.00, true, false, 'https://api.iconify.design/mdi:refresh.svg'),
('Lost/Damaged Title Deed Replacement', 'Replace lost or damaged title deed certificate', 'Land & Housing', 'Police report (for lost), National ID, Address proof, Affidavit', '10-14 business days', 300.00, true, false, 'https://api.iconify.design/mdi:file-restore.svg'),
('Plot Split Service', 'Split a plot into multiple smaller plots', 'Land & Housing', 'Original title deed, Land surveyor report, Plot maps, Ownership proof', '15-20 business days', 1000.00, true, false, 'https://api.iconify.design/mdi:content-cut.svg'),
('Property Registration Guarantees', 'Register guarantees and restrictions on your property', 'Land & Housing', 'Title deed, Guarantee agreement, Lender identification, Registration fee', '5-7 business days', 400.00, true, false, 'https://api.iconify.design/mdi:lock-check.svg'),
('Boundary Demarcation Service', 'Official boundary demarcation and marking of your property', 'Land & Housing', 'Title deed, Land survey request, Neighboring property details', '10-14 business days', 600.00, true, false, 'https://api.iconify.design/mdi:border-all.svg'),

-- Legal & Justice Services
('Legal Document Notarization', 'Official notarization of legal documents', 'Legal & Justice', 'Original documents, National ID, Signature verification', '1-2 business days', 50.00, true, true, 'https://api.iconify.design/mdi:scale-balance.svg'),
('Power of Attorney Registration', 'Register a power of attorney document', 'Legal & Justice', 'Power of attorney form, National IDs of both parties, Witness signatures', '3-5 business days', 200.00, true, false, 'https://api.iconify.design/mdi:file-account.svg'),
('Contract Registration Service', 'Official registration of contracts', 'Legal & Justice', 'Signed contract, National IDs, Contract fee payment', '5 business days', 300.00, true, false, 'https://api.iconify.design/mdi:file-check.svg'),

-- Citizenship & Immigration Services
('Ethiopian Passport Application', 'Apply for a new Ethiopian passport', 'Citizenship & Immigration', 'Birth certificate, National ID, 4 passport photos, Medical form', '15-30 business days', 1500.00, true, true, 'https://api.iconify.design/mdi:passport.svg'),
('Passport Renewal Service', 'Renew your Ethiopian passport', 'Citizenship & Immigration', 'Current passport, 2 photos, Renewal fee', '10-15 business days', 1200.00, true, true, 'https://api.iconify.design/mdi:passport-check.svg'),
('Lost Passport Replacement', 'Replace a lost or stolen passport', 'Citizenship & Immigration', 'Police report, Birth certificate, 4 photos, Police reference', '20-30 business days', 1800.00, true, false, 'https://api.iconify.design/mdi:passport-alert.svg'),
('Visa Application Assistance', 'Official assistance for visa applications abroad', 'Citizenship & Immigration', 'Completed visa form, Passport, Travel documents, Sponsor letter', '5-10 business days', 500.00, true, true, 'https://api.iconify.design/mdi:document-text.svg'),
('Birth Certificate Registration', 'Register a new birth with vital events office', 'Citizenship & Immigration', 'Hospital birth record, Parents IDs, Marriage certificate if applicable', '3-5 business days', 50.00, true, true, 'https://api.iconify.design/mdi:baby-carriage.svg'),
('Death Certificate Issuance', 'Obtain official death certificate', 'Citizenship & Immigration', 'Medical certificate of death, Identity of deceased, Witness statements', '2-3 business days', 100.00, true, false, 'https://api.iconify.design/mdi:hospital-box.svg'),
('National ID Card Application', 'Apply for Ethiopian National ID card', 'Citizenship & Immigration', 'Birth certificate, 2 photos, Residence proof, Application fee', '5-7 business days', 150.00, true, true, 'https://api.iconify.design/mdi:card-account-details.svg'),
('National ID Renewal', 'Renew your National ID card', 'Citizenship & Immigration', 'Current ID, 1 photo, Renewal fee, Address verification', '3-5 business days', 100.00, true, false, 'https://api.iconify.design/mdi:card-renew.svg'),

-- Business & Investment Services
('Business License Registration', 'Register a new business and obtain license', 'Business & Investment', 'Business plan, Owner ID, Office lease, Tax ID number', '10-15 business days', 500.00, true, true, 'https://api.iconify.design/mdi:briefcase-check.svg'),
('Business License Renewal', 'Renew your business license', 'Business & Investment', 'Current license, Business registration, Annual report', '5-7 business days', 300.00, true, false, 'https://api.iconify.design/mdi:briefcase-refresh.svg'),
('Trade License Application', 'Apply for trade license to conduct business', 'Business & Investment', 'Business location proof, Owner identification, Business plan', '7-10 business days', 400.00, true, true, 'https://api.iconify.design/mdi:store-check.svg'),
('Import/Export License', 'Obtain import/export license for international trade', 'Business & Investment', 'Company registration, Tax clearance, Business plan, Warehouse location', '15-20 business days', 2000.00, true, false, 'https://api.iconify.design/mdi:truck-check.svg'),
('Investment License Application', 'Apply for investment license with government', 'Business & Investment', 'Business proposal, Financial documents, Owner ID, Sector plan', '20-30 business days', 3000.00, true, true, 'https://api.iconify.design/mdi:chart-line-stacked.svg'),

-- Employment & Labor Services
('Work Permit Application', 'Apply for work permit to legally work in Ethiopia', 'Employment & Labor', 'Job offer, Employer letter, National ID/Passport, Medical form', '10-15 business days', 800.00, true, true, 'https://api.iconify.design/mdi:briefcase-account.svg'),
('Work Permit Renewal', 'Renew your work permit', 'Employment & Labor', 'Current permit, Employer verification, Renewal fee', '5-7 business days', 500.00, true, false, 'https://api.iconify.design/mdi:briefcase-check.svg'),
('Employment Verification Letter', 'Obtain official employment verification', 'Employment & Labor', 'Employee ID, Employer request, Work history', '1-2 business days', 50.00, true, false, 'https://api.iconify.design/mdi:file-check.svg'),
('Professional License Application', 'Apply for professional license in your field', 'Employment & Labor', 'Educational credentials, Work experience proof, Application fee', '15-20 business days', 1000.00, true, true, 'https://api.iconify.design/mdi:school-outline.svg'),

-- Transportation & Logistics Services
('Driver License Application', 'Apply for Ethiopian driver license', 'Transportation & Logistics', 'National ID, Medical fitness certificate, Driving school certificate, 2 photos', '7-10 business days', 300.00, true, true, 'https://api.iconify.design/mdi:car-door.svg'),
('Driver License Renewal', 'Renew your driver license', 'Transportation & Logistics', 'Current license, Medical form, Renewal fee, 1 photo', '3-5 business days', 150.00, true, false, 'https://api.iconify.design/mdi:car-key.svg'),
('Vehicle Registration', 'Register a new vehicle', 'Transportation & Logistics', 'Bill of sale, Owner ID, Insurance proof, Vehicle inspection', '10-15 business days', 500.00, true, true, 'https://api.iconify.design/mdi:car-info.svg'),
('Vehicle License Plate Issuance', 'Obtain license plates for registered vehicle', 'Transportation & Logistics', 'Vehicle registration, Owner ID, Plate fee', '3-5 business days', 200.00, true, false, 'https://api.iconify.design/mdi:license.svg'),
('Freight License Application', 'Apply for freight transport license', 'Transportation & Logistics', 'Vehicle ownership, Insurance, Safety certificates, Application fee', '15-20 business days', 2000.00, true, true, 'https://api.iconify.design/mdi:truck.svg'),

-- Finance Services
('Tax Registration Certificate', 'Register for tax and obtain tax ID', 'Finance', 'Business registration, Owner ID, Business address, Financial documents', '5-7 business days', 50.00, true, true, 'https://api.iconify.design/mdi:calculator-variant.svg'),
('Business Tax Clearance', 'Obtain tax clearance for business', 'Finance', 'Tax ID, Annual tax returns, Compliance verification', '7-10 business days', 100.00, true, false, 'https://api.iconify.design/mdi:check-circle.svg'),
('Loan Application Assistance', 'Official assistance for government loan applications', 'Finance', 'Business plan, Tax clearance, Collateral documentation, ID verification', '20-30 business days', 500.00, true, true, 'https://api.iconify.design/mdi:bank.svg'),
('Grant Application Support', 'Apply for government grants and subsidies', 'Finance', 'Business proposal, Financial statements, Eligibility documentation', '30-60 business days', 1000.00, true, true, 'https://api.iconify.design/mdi:gift-outline.svg'),
('Business Insurance Application', 'Apply for mandatory business insurance', 'Finance', 'Business registration, Risk assessment, Insurable value', '5-7 business days', 800.00, true, false, 'https://api.iconify.design/mdi:shield-check.svg');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_is_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_featured ON services(featured);

-- Update service count statistics
UPDATE services SET featured = true WHERE name IN (
  'Title Deed Certificate Authenticity Verification',
  'Apartment/Condominium Title Deed Transfer',
  'Ethiopian Passport Application',
  'Passport Renewal Service',
  'National ID Card Application',
  'Business License Registration',
  'Work Permit Application',
  'Driver License Application',
  'Vehicle Registration',
  'Tax Registration Certificate'
);
