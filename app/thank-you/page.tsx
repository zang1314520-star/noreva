import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF, WHATSAPP_NUMBER } from "@/lib/site";

export const metadata: Metadata = {
  title: "Thank You - Nayo Smart",
  description: "Your Nayo Smart backpack order has been received.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      <section className="px-8 pb-24 pt-36 md:px-16">
        <div className="mx-auto max-w-3xl rounded-[28px] bg-[#F7F5F1] p-8 text-center md:p-14">
          <p className="label mb-4 text-[#8A8A8A]">Order received</p>
          <h1 className="font-display text-4xl font-light leading-tight text-[#1A1A1A] md:text-5xl">
            Thank you for choosing Nayo Smart.
          </h1>
          <p className="mx-auto mt-6 max-w-xl font-body text-[15px] leading-[1.9] text-[#8A8A8A]">
            We are preparing your backpack order. Use your order number and checkout email to follow fulfillment and tracking updates as soon as they are available.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {["Free global shipping", "30-day returns", "24-month warranty"].map((item) => (
              <div key={item} className="rounded-2xl bg-white px-4 py-4">
                <p className="font-body text-[11px] uppercase tracking-[0.16em] text-[#1A1A1A]">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/track"
              className="inline-flex justify-center bg-[#C9A96E] px-7 py-4 font-body text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A] transition-colors hover:bg-[#1A1A1A] hover:text-white"
            >
              Track Order
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center bg-[#1A1A1A] px-7 py-4 font-body text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#C9A96E] hover:text-[#1A1A1A]"
            >
              Contact WhatsApp
            </a>
            <Link href="/products" className="inline-flex justify-center border border-[#1A1A1A] px-7 py-4 font-body text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A] transition-colors hover:border-[#C9A96E] hover:text-[#C9A96E]">
              Continue Shopping
            </Link>
          </div>

          <p className="mt-8 font-body text-xs text-[#8A8A8A]">
            Need help? Email{" "}
            <a href={CONTACT_EMAIL_HREF} className="text-[#C9A96E] hover:underline">
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
