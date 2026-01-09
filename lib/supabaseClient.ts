import { createClient } from '@supabase/supabase-js';

// Extracted from your connection string: db.rdbvsfbidcdsittdaunk.supabase.co
const SUPABASE_URL = 'https://rdbvsfbidcdsittdaunk.supabase.co'; 

// DIRECT KEY USAGE:
// We are using the key directly here to avoid issues with environment variables on Vercel.
// Accessing 'process.env' in a browser environment can cause the app to crash (White Screen) 
// if the bundler does not polyfill it.
const SUPABASE_ANON_KEY = 'sb_publishable_24XByIW_uLY1wM7fgK-jOw_oqlRyaPK';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);