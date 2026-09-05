import { createClient } from '@supabase/supabase-js';

// This client is used to submit leads from the "Apply for Service" form
// (via the `submit-lead` Edge Function — see supabase/functions/submit-lead)
// and to read the public plan list. It talks to the same Supabase project
// as FNDS (the separate admin app), so submissions show up there
// automatically. See the shared supabase/schema.sql for the leads table.
// The anon key can no longer insert into `leads` directly — that RLS policy
// was removed in favor of the Edge Function, which enforces a honeypot
// check and rate limiting before inserting with the service-role key
// (never exposed here or anywhere in the frontend).
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn(
    'Supabase is not configured — the application form will not be able to submit leads. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
