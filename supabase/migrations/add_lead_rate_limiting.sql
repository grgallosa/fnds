-- Spam protection for the public "Apply for Service" lead form.
--
-- Leads are no longer inserted directly by the anon key from the browser —
-- the public form now calls the `submit-lead` Edge Function, which checks a
-- honeypot field and enforces rate limiting before inserting with the
-- service role (which bypasses RLS). This table backs that rate limiting.
--
-- Already applied to the live project. Kept here so the schema change is
-- reproducible (e.g. on a fresh project) and reviewable alongside the code.
create table if not exists lead_rate_limits (
  id uuid primary key default uuid_generate_v4(),
  ip_address text not null,
  created_at timestamptz not null default now()
);

create index if not exists lead_rate_limits_ip_created_idx
  on lead_rate_limits (ip_address, created_at);

-- RLS is on with no policies at all: nobody using the anon or authenticated
-- role can read or write this table directly. Only the Edge Function's
-- service-role client (which bypasses RLS entirely) touches it.
alter table lead_rate_limits enable row level security;

-- Close the direct-insert path that let anyone (or any bot) write straight
-- to `leads` with the public anon key, bypassing any client-side checks.
-- All public lead submissions now go through the `submit-lead` Edge
-- Function instead, which is the only thing that can insert here now
-- (via its service-role client).
drop policy if exists "public can submit leads" on leads;
