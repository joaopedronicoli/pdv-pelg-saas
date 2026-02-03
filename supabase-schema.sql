-- PDV PELG SaaS - Supabase Database Schema
-- Execute este SQL no Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies Table
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    supabase_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Database Configurations Table
CREATE TABLE IF NOT EXISTS database_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    db_type VARCHAR(20) NOT NULL CHECK (db_type IN ('mysql', 'postgres')),
    host VARCHAR(255) NOT NULL,
    port INTEGER NOT NULL,
    database_name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password_encrypted TEXT NOT NULL,
    is_connected BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id)
);

-- WooCommerce Configurations Table
CREATE TABLE IF NOT EXISTS woocommerce_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    store_url VARCHAR(500) NOT NULL,
    consumer_key_encrypted TEXT NOT NULL,
    consumer_secret_encrypted TEXT NOT NULL,
    auto_sync BOOLEAN DEFAULT false,
    last_sync TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id)
);

-- User Profiles Table (multi-user per company)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    supabase_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'cashier', 'stockist', 'attendant')),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(supabase_user_id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_companies_supabase_user ON companies(supabase_user_id);
CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);
CREATE INDEX IF NOT EXISTS idx_database_configs_company ON database_configs(company_id);
CREATE INDEX IF NOT EXISTS idx_woocommerce_configs_company ON woocommerce_configs(company_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_company ON user_profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_supabase_user ON user_profiles(supabase_user_id);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE database_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE woocommerce_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Companies Policies
CREATE POLICY "Users can view their own company"
    ON companies FOR SELECT
    USING (auth.uid() = supabase_user_id);

CREATE POLICY "Users can insert their own company"
    ON companies FOR INSERT
    WITH CHECK (auth.uid() = supabase_user_id);

CREATE POLICY "Users can update their own company"
    ON companies FOR UPDATE
    USING (auth.uid() = supabase_user_id);

-- Database Configs Policies
CREATE POLICY "Users can view their company's database config"
    ON database_configs FOR SELECT
    USING (
        company_id IN (
            SELECT id FROM companies WHERE supabase_user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their company's database config"
    ON database_configs FOR INSERT
    WITH CHECK (
        company_id IN (
            SELECT id FROM companies WHERE supabase_user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their company's database config"
    ON database_configs FOR UPDATE
    USING (
        company_id IN (
            SELECT id FROM companies WHERE supabase_user_id = auth.uid()
        )
    );

-- WooCommerce Configs Policies
CREATE POLICY "Users can view their company's woocommerce config"
    ON woocommerce_configs FOR SELECT
    USING (
        company_id IN (
            SELECT id FROM companies WHERE supabase_user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their company's woocommerce config"
    ON woocommerce_configs FOR INSERT
    WITH CHECK (
        company_id IN (
            SELECT id FROM companies WHERE supabase_user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their company's woocommerce config"
    ON woocommerce_configs FOR UPDATE
    USING (
        company_id IN (
            SELECT id FROM companies WHERE supabase_user_id = auth.uid()
        )
    );

-- User Profiles Policies
CREATE POLICY "Users can view profiles in their company"
    ON user_profiles FOR SELECT
    USING (
        company_id IN (
            SELECT id FROM companies WHERE supabase_user_id = auth.uid()
        )
        OR supabase_user_id = auth.uid()
    );

CREATE POLICY "Users can insert their own profile"
    ON user_profiles FOR INSERT
    WITH CHECK (auth.uid() = supabase_user_id);

CREATE POLICY "Admins can insert profiles in their company"
    ON user_profiles FOR INSERT
    WITH CHECK (
        company_id IN (
            SELECT company_id FROM user_profiles 
            WHERE supabase_user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can update their own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = supabase_user_id);

CREATE POLICY "Admins can update profiles in their company"
    ON user_profiles FOR UPDATE
    USING (
        company_id IN (
            SELECT company_id FROM user_profiles 
            WHERE supabase_user_id = auth.uid() AND role = 'admin'
        )
    );

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_database_configs_updated_at BEFORE UPDATE ON database_configs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_woocommerce_configs_updated_at BEFORE UPDATE ON woocommerce_configs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE companies IS 'Stores company/tenant information for multi-tenant SaaS';
COMMENT ON TABLE database_configs IS 'Stores encrypted database connection details per company';
COMMENT ON TABLE woocommerce_configs IS 'Stores encrypted WooCommerce API credentials per company';
COMMENT ON TABLE user_profiles IS 'Stores user profiles with company association and roles';
