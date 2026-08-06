// backend/lib/supabase.js
// Initialize Supabase client using the SERVICE ROLE KEY (bypasses RLS)
// This should ONLY be used on the backend — never expose to frontend

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.warn('⚠️  SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing from .env — database features will be disabled.');
}

// Create a single Supabase client instance for the backend
// Using the service role key to bypass Row Level Security (RLS)
const supabase = supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey)
    : null;

module.exports = { supabase };
