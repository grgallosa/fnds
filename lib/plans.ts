import { supabase } from './supabaseClient';
import { CONTENT } from '../constants';
import { Plan } from '../types';

// The `plans` table (shared with the FNDS admin app — see supabase/schema.sql)
// only stores the operational fields admin staff edit: name, speed, price.
// Marketing-only fields (feature bullets, CTA copy, promo "was" price) aren't
// worth putting in the database, so we keep them here and merge them in by
// plan name. Any DB plan whose name doesn't match one of these falls back to
// sensible defaults, so a brand-new plan added in the admin app still renders
// correctly on the landing page without a code change.
const PLAN_METADATA: Record<string, { features: string[]; cta: string; originalPrice?: string }> = {};
for (const item of CONTENT.plans.items) {
  PLAN_METADATA[item.name.toLowerCase()] = {
    features: item.features,
    cta: item.cta,
    originalPrice: item.originalPrice,
  };
}

const DEFAULT_METADATA = {
  features: ['Unlimited Internet', 'Stable fiber connection'],
  cta: 'Apply Now',
};

interface DbPlanRow {
  id: string;
  name: string;
  speed: string;
  price: number | string;
}

function formatPrice(price: number | string): string {
  const n = typeof price === 'string' ? parseFloat(price) : price;
  return `₱${n.toLocaleString('en-PH', { maximumFractionDigits: 0 })}/mo`;
}

function toDisplaySpeed(speed: string): string {
  // DB values look like "15 Mbps"; the landing UI just wants the number
  // ("15") and renders the "UP TO / MBPS" label itself.
  const match = String(speed).match(/[\d.]+/);
  return match ? match[0] : String(speed);
}

function mapRow(row: DbPlanRow): Plan {
  const meta = PLAN_METADATA[row.name.toLowerCase()] || DEFAULT_METADATA;
  return {
    id: row.id,
    name: row.name,
    speed: toDisplaySpeed(row.speed),
    price: formatPrice(row.price),
    originalPrice: meta.originalPrice,
    features: meta.features,
    cta: meta.cta,
  };
}

/**
 * Fetches the live plan list from Supabase (the same `plans` table the
 * admin app manages), ordered by price. Falls back to the static plans in
 * constants.tsx if Supabase isn't configured, the request fails, or the
 * table is empty — so the page never breaks for visitors.
 */
export async function fetchPlans(): Promise<Plan[]> {
  try {
    const { data, error } = await supabase
      .from('plans')
      .select('id, name, speed, price')
      .order('price', { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) console.warn('Falling back to static plans — Supabase read failed:', error.message);
      return CONTENT.plans.items;
    }

    return (data as DbPlanRow[]).map(mapRow);
  } catch (err) {
    console.warn('Falling back to static plans — Supabase request threw:', err);
    return CONTENT.plans.items;
  }
}
