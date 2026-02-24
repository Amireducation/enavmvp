-- Complete database schema for Ethiopian Navigator MVP

-- Services table
CREATE TABLE IF NOT EXISTS services (
  service_id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  responsible_agency TEXT,
  estimated_processing_time TEXT,
  service_fee NUMERIC,
  requirements TEXT[],
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Service requests table (citizen requests for new services)
CREATE TABLE IF NOT EXISTS service_requests (
  request_id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  service_name TEXT NOT NULL,
  service_description TEXT,
  category_suggestion TEXT,
  justification TEXT,
  status TEXT DEFAULT 'submitted',
  priority TEXT DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Applications table (citizen applications for services)
CREATE TABLE IF NOT EXISTS applications (
  application_id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  service_id TEXT NOT NULL,
  status TEXT DEFAULT 'submitted',
  submitted_data JSONB,
  documents JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (service_id) REFERENCES services(service_id)
);

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback (
  feedback_id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  service_id TEXT,
  application_id TEXT,
  rating INTEGER,
  comments TEXT,
  category TEXT,
  created_at TIMESTAMP DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  notification_id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  type TEXT,
  title TEXT,
  message TEXT,
  related_entity_id TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id INTEGER PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  date_of_birth DATE,
  address TEXT,
  city TEXT,
  region TEXT,
  profile_picture_url TEXT,
  language_preference TEXT DEFAULT 'en',
  notification_preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_feedback_service_id ON feedback(service_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);
