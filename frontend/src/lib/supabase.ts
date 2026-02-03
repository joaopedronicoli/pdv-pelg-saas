import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cmkbwtanvuwdfkdxtnuc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNta2J3dGFudnV3ZGZrZHh0bnVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5MDIyNDAsImV4cCI6MjA4NTQ3ODI0MH0.WgNun1KvlCM1cBlmPcI5ov8AaS2uZC0WbjY4MyTeWdg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface Company {
    id: string;
    name: string;
    slug: string;
    supabase_user_id: string;
    active: boolean;
    created_at: string;
}

export interface DatabaseConfig {
    id: string;
    company_id: string;
    db_type: 'mysql' | 'postgres';
    host: string;
    port: number;
    database_name: string;
    username: string;
    password_encrypted: string;
    is_connected: boolean;
}

export interface WooCommerceConfig {
    id: string;
    company_id: string;
    store_url: string;
    consumer_key_encrypted: string;
    consumer_secret_encrypted: string;
    auto_sync: boolean;
    last_sync: string | null;
}

export interface UserProfile {
    id: string;
    company_id: string;
    supabase_user_id: string;
    email: string;
    name: string;
    role: 'admin' | 'cashier' | 'stockist' | 'attendant';
    active: boolean;
}
