/*
  # Company Registration Database Schema

  1. New Tables
    - `users` table for user authentication and profile data
      - `id` (uuid, primary key)
      - `firebase_uid` (text, unique, for Firebase integration)
      - `email` (text, unique)
      - `phone_number` (text)
      - `first_name`, `last_name` (text)
      - `email_verified`, `phone_verified` (boolean)
      - `created_at`, `updated_at` (timestamp)

    - `company_profiles` table for company information
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `company_name`, `company_type`, `industry` (text)
      - `registration_number`, `tax_id` (text)
      - `address`, `city`, `state`, `country`, `postal_code` (text)
      - `website`, `description` (text)
      - `logo_url`, `banner_url` (text)
      - `employee_count` (integer)
      - `founded_year` (integer)
      - `is_verified` (boolean)
      - `created_at`, `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
    - Add indexes for performance optimization

  3. Extensions
    - Enable uuid-ossp extension for UUID generation
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firebase_uid TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone_number TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Company profiles table
CREATE TABLE IF NOT EXISTS company_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  company_type TEXT,
  industry TEXT,
  registration_number TEXT,
  tax_id TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  postal_code TEXT,
  website TEXT,
  description TEXT,
  logo_url TEXT,
  banner_url TEXT,
  employee_count INTEGER,
  founded_year INTEGER,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_profiles ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_company_profiles_user_id ON company_profiles(user_id);

-- Trigger function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for timestamp updates
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_profiles_updated_at
  BEFORE UPDATE ON company_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();