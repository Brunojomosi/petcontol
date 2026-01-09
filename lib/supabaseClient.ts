import { createClient } from '@supabase/supabase-js';

// Extracted from your connection string: db.rdbvsfbidcdsittdaunk.supabase.co
const SUPABASE_URL = 'https://rdbvsfbidcdsittdaunk.supabase.co'; 

const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_24XByIW_uLY1wM7fgK-jOw_oqlRyaPK';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);