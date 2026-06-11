import pool from "@/lib/db";

let schemaPromise: Promise<void> | null = null;

export function trackingUrlFor(carrier?: string | null, trackingNumber?: string | null, customUrl?: string | null) {
  const number = String(trackingNumber || "").trim();
  if (customUrl) return customUrl.trim();
  if (!number) return "";

  const normalizedCarrier = String(carrier || "").toLowerCase();
  if (normalizedCarrier.includes("dhl")) return `https://www.dhl.com/global-en/home/tracking/tracking-express.html?submit=1&tracking-id=${encodeURIComponent(number)}`;
  if (normalizedCarrier.includes("fedex")) return `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(number)}`;
  if (normalizedCarrier.includes("ups")) return `https://www.ups.com/track?tracknum=${encodeURIComponent(number)}`;
  if (normalizedCarrier.includes("usps")) return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodeURIComponent(number)}`;
  if (normalizedCarrier.includes("sf") || normalizedCarrier.includes("shunfeng")) return `https://www.sf-express.com/we/ow/chn/sc/waybill/waybill-detail/${encodeURIComponent(number)}`;

  return `https://t.17track.net/en#nums=${encodeURIComponent(number)}`;
}

export async function ensureOrderSchema() {
  if (!schemaPromise) {
    schemaPromise = (async () => {
      await pool.query(`
        ALTER TABLE orders
          ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'paid',
          ADD COLUMN IF NOT EXISTS fulfillment_status TEXT DEFAULT 'unfulfilled',
          ADD COLUMN IF NOT EXISTS customer_phone TEXT,
          ADD COLUMN IF NOT EXISTS shipping_name TEXT,
          ADD COLUMN IF NOT EXISTS tracking_carrier TEXT,
          ADD COLUMN IF NOT EXISTS tracking_number TEXT,
          ADD COLUMN IF NOT EXISTS tracking_url TEXT,
          ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMPTZ,
          ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ,
          ADD COLUMN IF NOT EXISTS admin_note TEXT,
          ADD COLUMN IF NOT EXISTS stripe_payment_intent TEXT
      `);
    })();
  }

  return schemaPromise;
}
