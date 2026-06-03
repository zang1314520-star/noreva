import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://noreva.cc";

const ALLOWED_COUNTRIES = [
  "CN",
  "HK",
  "TW",
  "JP",
  "KR",
  "SG",
  "US",
  "CA",
  "GB",
  "AU",
  "NZ",
  "FR",
  "IT",
  "DE",
  "ES",
  "NL",
] as const;

export async function POST(request: Request) {
  try {
    const { items, customer_email, customer_name } = await request.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items" }, { status: 400 });
    }

    const firstCurrency = String(items[0]?.currency || "USD").toLowerCase();
    const line_items = items.map((item: any) => {
      const price = Number(item.price);
      const quantity = Math.max(1, Number(item.quantity) || 1);

      if (!Number.isFinite(price) || price <= 0) {
        throw new Error(`Invalid price for ${item.name || "item"}`);
      }

      return {
        price_data: {
          currency: String(item.currency || firstCurrency).toLowerCase(),
          product_data: {
            name: `${item.brand ? `${item.brand} - ` : ""}${item.name}`,
            images: item.image
              ? [item.image.startsWith("http") ? item.image : `${siteUrl}${item.image}`]
              : [],
            metadata: {
              product_id: item.id || "",
            },
          },
          unit_amount: Math.round(price * 100),
        },
        quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "alipay"],
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      phone_number_collection: { enabled: true },
      success_url: `${siteUrl}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/products`,
      customer_email,
      line_items,
      shipping_address_collection: {
        allowed_countries: [...ALLOWED_COUNTRIES] as any,
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 0, currency: firstCurrency },
            display_name: "Free Global Shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 5 },
              maximum: { unit: "business_day", value: 12 },
            },
          },
        },
      ],
      metadata: {
        customer_name: customer_name || "",
        channel: "noreva_site",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: error.message || "Checkout failed" }, { status: 500 });
  }
}
