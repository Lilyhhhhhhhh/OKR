// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.https://ppboxkzqkdizdhitjsrj.supabase.co;
const supabaseAnonKey = process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwYm94a3pxa2RpemRoaXRqc3JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyODU3MDcsImV4cCI6MjA3MTg2MTcwN30.ZUtEN518KcEeTJzY4gMshun17pdoOw2SzWR5unYIk-w;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      `Missing Supabase environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local. Found: URL=${supabaseUrl}, AnonKey=${supabaseAnonKey}`
    );
  }
  
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);