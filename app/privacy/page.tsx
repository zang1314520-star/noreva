import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF } from "@/lib/site";

export const metadata = {
  title: "Privacy Policy - NOREVA",
  description: "NOREVA Privacy Policy. Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <main className="bg-white min-h-screen">
      <Navigation />

      <div className="pt-32 pb-20 px-8 md:px-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-light text-[#1A1A1A] mb-8">
            Privacy Policy
          </h1>

          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="font-display text-xl text-[#1A1A1A] mb-4">Information We Collect</h2>
              <p className="font-body text-[#8A8A8A] leading-relaxed">
                We collect information you provide directly to us, such as when you make an inquiry,
                subscribe to our newsletter, or contact us via WhatsApp or email. This may include
                your name, email address, phone number, and any other information you choose to provide.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-[#1A1A1A] mb-4">How We Use Your Information</h2>
              <p className="font-body text-[#8A8A8A] leading-relaxed">
                We use the information we collect to respond to your inquiries, process orders,
                send you marketing communications with your consent, and improve our services.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-[#1A1A1A] mb-4">Cookies</h2>
              <p className="font-body text-[#8A8A8A] leading-relaxed">
                Our website uses cookies to enhance your browsing experience. Cookies are small
                files stored on your device that help us analyze web traffic and customize content.
                You may choose to decline cookies through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-[#1A1A1A] mb-4">Data Security</h2>
              <p className="font-body text-[#8A8A8A] leading-relaxed">
                We implement appropriate security measures to protect your personal information.
                However, no method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-[#1A1A1A] mb-4">Your Rights</h2>
              <p className="font-body text-[#8A8A8A] leading-relaxed">
                Under GDPR, you have the right to access, correct, or delete your personal data.
                To exercise these rights, please contact us via WhatsApp or email.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-[#1A1A1A] mb-4">Contact Us</h2>
              <p className="font-body text-[#8A8A8A] leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at{" "}
                <a href={CONTACT_EMAIL_HREF} className="text-[#C9A96E] hover:underline">
                  {CONTACT_EMAIL}
                </a>
              </p>
            </section>

            <section>
              <p className="font-body text-[13px] text-[#A8A4A0] italic">
                Last updated: June 2026
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
