import { createClient } from '@supabase/supabase-js';

const supabaseConfig = {
    url: import.meta.env.VITE_SUPABASE_PROJECT_URL,
    key: import.meta.env.VITE_SUPABASE_API_KEY,
};

export const supabase = createClient(supabaseConfig.url, supabaseConfig.key);
console.log("Initialized Supabase connection");