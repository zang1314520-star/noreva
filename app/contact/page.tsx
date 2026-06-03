import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF, WHATSAPP_NUMBER } from "@/lib/site";

const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hello, I would like help from the Nayo Smart team."
)}`;

export const metadata = {
  title: "Contact - Nayo Smart",
  description: "Contact Nayo Smart for backpack recommendations, shipping questions, order support, or returns help.",
};

export default function ContactPage() {
  return (
    <main className="bg-white min-h-screen">
      <Navigation />

      <div className="pt-32 pb-20 px-8 md:px-16">
        <div className="max-w-4xl mx-auto">
          <p className="label text-[#8A8A8A] mb-4">Contact</p>
          <h1 className="font-display text-4xl md:text-5xl font-light text-[#1A1A1A] mb-6">
            Start with a message. We will help from there.
          </h1>
          <p className="max-w-2xl font-body text-[15px] leading-[1.9] text-[#8A8A8A] mb-12">
            Reach out for model recommendations, laptop-fit questions, shipping support, returns help, or product details.
          </p>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="border border-[#E8E6E2] p-8">
              <h2 className="font-display text-2xl font-light text-[#1A1A1A] mb-5">
                WhatsApp
              </h2>
              <p className="font-body text-[14px] leading-[1.8] text-[#8A8A8A] mb-6">
                Best for quick questions, product recommendations, and direct shopping support.
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#1A1A1A] px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-white transition-colors duration-200 hover:bg-[#C9A96E]"
              >
                Message on WhatsApp
              </a>
            </div>

            <div className="border border-[#E8E6E2] p-8 bg-[#F7F5F1]">
              <h2 className="font-display text-2xl font-light text-[#1A1A1A] mb-5">
                Email
              </h2>
              <p className="font-body text-[14px] leading-[1.8] text-[#8A8A8A] mb-4">
                Best for order support, returns, and detailed product or wholesale requests.
              </p>
              <a
                href={CONTACT_EMAIL_HREF}
                className="font-body text-[15px] text-[#1A1A1A] underline underline-offset-4"
              >
                {CONTACT_EMAIL}
              </a>
              <p className="font-body text-[13px] leading-[1.8] text-[#8A8A8A] mt-6">
                Typical response time: within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
