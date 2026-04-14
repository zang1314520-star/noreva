import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = {
  title: "Shipping & Returns — NOREVA",
  description: "NOREVA shipping and returns policy. Complimentary worldwide shipping, 14-day returns.",
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
            Complimentary worldwide shipping on all orders.
          </p>
          
          <div className="space-y-12">
            <section>
              <h2 className="font-display text-xl text-[#1A1A1A] mb-4">Shipping</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-start border-b border-[#E8E6E2] pb-4">
                  <div>
                    <p className="font-body text-[#1A1A1A]">Standard Delivery</p>
                    <p className="font-body text-[#8A8A8A] text-sm">Europe: 3-5 business days</p>
                  </div>
                  <p className="font-body text-[#1A1A1A]">Complimentary</p>
                </div>
                <div className="flex justify-between items-start border-b border-[#E8E6E2] pb-4">
                  <div>
                    <p className="font-body text-[#1A1A1A]">Express Delivery</p>
                    <p className="font-body text-[#8A8A8A] text-sm">Europe: 1-2 business days</p>
                  </div>
                  <p className="font-body text-[#1A1A1A]">Complimentary</p>
                </div>
                <div className="flex justify-between items-start border-b border-[#E8E6E2] pb-4">
                  <div>
                    <p className="font-body text-[#1A1A1A]">International</p>
                    <p className="font-body text-[#8A8A8A] text-sm">Worldwide: 5-10 business days</p>
                  </div>
                  <p className="font-body text-[#1A1A1A]">Complimentary</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl text-[#1A1A1A] mb-4">Returns</h2>
              <div className="space-y-4 font-body text-[#8A8A8A] leading-relaxed">
                <p>
                  We offer complimentary returns within 14 days of delivery. Items must be in 
                  original condition with all tags attached.
                </p>
                <p>
                  To initiate a return, please contact us via WhatsApp or email with your 
                  order number and reason for return.
                </p>
                <p>
                  Refunds will be processed within 5-7 business days after we receive the returned item.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl text-[#1A1A1A] mb-4">Exceptions</h2>
              <ul className="space-y-2 font-body text-[#8A8A8A] list-disc list-inside">
                <li>Customized or personalized items are non-returnable</li>
                <li>Sale items may be subject to different terms</li>
                <li>Shipping costs are non-refundable unless the return is due to our error</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl text-[#1A1A1A] mb-4">Contact</h2>
              <p className="font-body text-[#8A8A8A]">
                For any questions about shipping or returns, please contact us at{" "}
                <a href="mailto:contact@noreva.com" className="text-[#C9A96E] hover:underline">
                  contact@noreva.cc
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
      <CookieConsent />
      <WhatsAppButton phoneNumber="8618508036618" />
    </main>
  );
}
