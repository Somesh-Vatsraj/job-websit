-- worker/schema.sql
-- D1 Database Schema for WFH Platform

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Posts table (unified for jobs and news)
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL CHECK (type IN ('job', 'news', 'work_from_home')),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  company_name TEXT,
  category TEXT,
  description TEXT,
  content TEXT,
  image_url TEXT,
  salary_min REAL,
  salary_max REAL,
  currency TEXT DEFAULT '$',
  work_mode TEXT CHECK (work_mode IN ('Remote', 'Hybrid', 'On-site', NULL)),
  location TEXT,
  experience TEXT,
  skills TEXT,
  requirements TEXT,
  benefits TEXT,
  apply_url TEXT,
  application_instructions TEXT,
  source_name TEXT,
  source_url TEXT,
  tags TEXT,
  featured BOOLEAN DEFAULT 0,
  trending BOOLEAN DEFAULT 0,
  published BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  active BOOLEAN DEFAULT 1
);

-- Categories table (for reference)
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed default categories
INSERT OR IGNORE INTO categories (name, slug) VALUES
  ('Technology', 'technology'),
  ('Career', 'career'),
  ('Work From Home', 'work-from-home'),
  ('AI', 'ai'),
  ('Education', 'education'),
  ('Business', 'business'),
  ('Freelancing', 'freelancing'),
  ('Government Jobs', 'government-jobs'),
  ('Trending', 'trending');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(type);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_featured ON posts(featured);
CREATE INDEX IF NOT EXISTS idx_posts_trending ON posts(trending);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

-- Insert default admin (password: admin123)
-- Password hash is bcrypt of "admin123" with salt rounds 10
INSERT OR IGNORE INTO admins (email, password_hash) VALUES (
  'admin@example.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
);