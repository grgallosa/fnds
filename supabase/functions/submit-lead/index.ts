// submit-lead: the only path that can create a row in `leads` from the
// public website. Runs server-side (Deno) so a honeypot check and rate
// limiting can't be bypassed by calling the database REST API directly —
// the direct anon INSERT policy on `leads` has been removed; this function
// uses the service-role key (never exposed to the browser) to insert.
//
// Kept intentionally simple: appropriate for a small ISP (~120+ customers)
// with modest, mostly-legitimate traffic — not a general-purpose API.
//
// Deployed to the shared Supabase project (see ../../../lib/supabaseClient.ts).
// To redeploy after editing this file, use the Supabase MCP/CLI
// `deploy_edge_function` (or `supabase functions deploy submit-lead`).

import { createClient } from 'jsr:@supabase/supabase-js@2';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Generous enough that a genuine household correcting a typo or a couple of
// family members applying back-to-back from the same connection never gets
// blocked, but well below anything a bot script hammering the form would
// stay under.
const MAX_SUBMISSIONS_PER_WINDOW = 3;
const WINDOW_MINUTES = 15;

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ ok: false, reason: 'method_not_allowed', message: 'Method not allowed.' }, 405);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ ok: false, reason: 'invalid_body', message: 'Invalid request.' }, 400);
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
  const email = typeof body.email === 'string' && body.email.trim() ? body.email.trim() : null;
  const address = typeof body.address === 'string' && body.address.trim() ? body.address.trim() : null;
  const interestedPlan =
    typeof body.interested_plan === 'string' && body.interested_plan.trim() ? body.interested_plan.trim() : null;
  const notes = typeof body.notes === 'string' && body.notes.trim() ? body.notes.trim() : null;
  // Honeypot: a field named to look legitimate to a scraper, hidden
  // off-screen (not just visually) on the real form so no human ever fills
  // it. Anything non-empty here means the submitter is a bot.
  const honeypot = typeof body.website === 'string' ? body.website.trim() : '';

  // --- Honeypot check ----------------------------------------------------
  // Pretend success without writing anything, so the bot doesn't learn to
  // look for a different tell.
  if (honeypot !== '') {
    return jsonResponse({ ok: true });
  }

  // --- Minimal required-field validation ----------------------------------
  if (!name) {
    return jsonResponse({ ok: false, reason: 'invalid_input', message: 'Name is required.' }, 400);
  }
  if (!phone) {
    return jsonResponse({ ok: false, reason: 'invalid_input', message: 'Phone number is required.' }, 400);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse(
      { ok: false, reason: 'server_error', message: 'Submission failed. Please try again.' },
      500
    );
  }
  const admin = createClient(supabaseUrl, serviceRoleKey);

  // --- Rate limiting, by requester IP -------------------------------------
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('cf-connecting-ip') ||
    'unknown';

  const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();

  const { count, error: countError } = await admin
    .from('lead_rate_limits')
    .select('id', { count: 'exact', head: true })
    .eq('ip_address', ip)
    .gte('created_at', windowStart);

  if (countError) {
    // Fail safe: if we can't check the rate limit, don't let it through
    // unchecked — ask the person to try again shortly instead.
    return jsonResponse(
      { ok: false, reason: 'server_error', message: 'Something went wrong. Please try again.' },
      500
    );
  }

  if ((count ?? 0) >= MAX_SUBMISSIONS_PER_WINDOW) {
    return jsonResponse({
      ok: false,
      reason: 'rate_limited',
      message:
        "You've already submitted a request recently. Please wait a few minutes and try again, or contact us directly.",
    });
  }

  // Record this attempt before inserting, so a burst of near-simultaneous
  // requests can't all race past the count check above.
  await admin.from('lead_rate_limits').insert({ ip_address: ip });

  const { error: insertError } = await admin.from('leads').insert({
    name,
    phone,
    email,
    address,
    interested_plan: interestedPlan,
    notes,
    status: 'New',
  });

  if (insertError) {
    return jsonResponse(
      { ok: false, reason: 'server_error', message: 'Submission failed. Please try again.' },
      500
    );
  }

  return jsonResponse({ ok: true });
});
