// backend/config/database.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Environment variables:
 * - For server (recommended): set SUPABASE_URL and SUPABASE_KEY (service_role key if you need admin privileges).
 * - If you only have VITE_* keys in your .env, this file falls back to them:
 *    VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
 */

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn(
    '⚠️ Supabase config missing. Make sure SUPABASE_URL and SUPABASE_KEY (or VITE_SUPABASE_*) are set in your .env'
  );
}

const supabase = createClient(SUPABASE_URL || '', SUPABASE_KEY || '', {
  // Server-side usage: don't persist sessions in this client
  auth: { persistSession: false }
});

// Optional quick health log (non-destructive)
// This won't crash the app if tables are missing; it only logs connection status.
(async () => {
  try {
    const version = await supabase.rpc('version').then(r => r).catch(() => null);
    // Many Supabase projects don't have an RPC 'version' — so keep fallback simple:
    console.log('🔌 Supabase client initialized.');
  } catch (e) {
    console.log('🔌 Supabase client initialized (health check skipped).');
  }
})();

export default supabase;
