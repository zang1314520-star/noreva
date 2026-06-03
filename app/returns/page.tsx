import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF } from "@/lib/site";

export const metadata = {
  title: "Shipping and Returns - Nayo Smart",
  description: "Nayo Smart backpack shipping, returns, and warranty policy. Worldwide shipping, 30-day returns, and 24-month warranty.",
};

export default function ReturnsPage() {
  return (
    <main className="bg-white min-h-screen">
      <Navigation />

      <div className="pt-32 pb-20 px-8 md:px-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-light text-[#1A1A1A] mb-4">
            Shipping & Returns
          </h1>
          <p className="font-body text-[#8A8A8A] mb-12">
            Worldwide shipping, 30-day easy returns, and a 24-month backpack warranty.
          </p>

          <div className="space-y-12">
            <section>
              <h2 className="font-display text-xl text-[#1A1A1A] mb-4">Shipping</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-start border-b border-[#E8E6E2] pb-4">
                  <div>
                    <p className="font-body text-[#1A1A1A]">Singapore, Japan, Korea, Hong Kong</p>
                    <p className="font-body text-[#8A8A8A] text-sm">Usually 5-6 business days</p>
                  </div>
                  <p className="font-body text-[#1A1A1A]">Tracked</p>
                </div>
                <div className="flex justify-between items-start border-b border-[#E8E6E2] pb-4">
                  <div>
                    <p className="font-body text-[#1A1A1A]">Europe, USA, Canada, Australia</p>
                    <p className="font-body text-[#8A8A8A] text-sm">Usually 7-15 business days</p>
                  </div>
                  <p className="font-body text-[#1A1A1A]">Tracked</p>
                </div>
                <div className="flex justify-between items-start border-b border-[#E8E6E2] pb-4">
                  <div>
                    <p className="font-body text-[#1A1A1A]">Southeast Asia selected regions</p>
                    <p className="font-body text-[#8A8A8A] text-sm">Usually 8-10 business days</p>
                  </div>
                  <p className="font-body text-[#1A1A1A]">Tracked</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl text-[#1A1A1A] mb-4">Returns</h2>
              <div className="space-y-4 font-body text-[#8A8A8A] leading-relaxed">
                <p>
                  We offer returns within 30 days of delivery. Items must be in original condition with all tags and original packaging where applicable.
                </p>
                <p>
                  To initiate a return, contact us via WhatsApp or email with your order number and reason for return.
                </p>
                <p>
                  Refunds are typically processed within 5-7 business days after the returned item is received and inspected.
                </p>
                <p>
                  Nayo Smart backpacks include a 24-month warranty against manufacturing defects in zippers, stitching, buckles, handles, and structural seams.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl text-[#1A1A1A] mb-4">Exceptions</h2>
              <ul className="space-y-2 font-body text-[#8A8A8A] list-disc list-inside">
                <li>Customized or personalized items are non-returnable.</li>
                <li>Sale items may be subject to different terms.</li>
                <li>Shipping costs are non-refundable unless the return is due to our error.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl text-[#1A1A1A] mb-4">Contact</h2>
              <p className="font-body text-[#8A8A8A]">
                For any questions about shipping or returns, please contact us at{" "}
                <a href={CONTACT_EMAIL_HREF} className="text-[#C9A96E] hover:underline">
                  {CONTACT_EMAIL}
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
