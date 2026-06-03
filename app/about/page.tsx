import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata = {
  title: "About - NOREVA",
  description: "Learn about NOREVA, our approach to curation, and the personal shopping experience behind the brand.",
};

export default function AboutPage() {
  return (
    <main className="bg-white min-h-screen">
      <Navigation />

      <div className="pt-32 pb-20 px-8 md:px-16">
        <div className="max-w-4xl mx-auto">
          <p className="label text-[#8A8A8A] mb-4">About NOREVA</p>
          <h1 className="font-display text-4xl md:text-5xl font-light text-[#1A1A1A] mb-8">
            Curated luxury with a quieter point of view.
          </h1>

          <div className="grid gap-10 md:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6 font-body text-[15px] leading-[1.95] text-[#8A8A8A]">
              <p>
                NOREVA brings together clothing, bags, watches, and accessories
                for clients who want stronger judgment and fewer distractions.
              </p>
              <p>
                We are building a shopping experience that feels more edited
                than conventional e-commerce. The goal is simple: better
                choices, clearer guidance, and pieces worth living with.
              </p>
              <p>
                Our perspective sits between Shanghai and Milan, pairing a
                modern digital storefront with a more personal, private service
                model when clients want help narrowing the field.
              </p>
            </div>

            <div className="border border-[#E8E6E2] bg-[#F7F5F1] p-8">
              <h2 className="font-display text-2xl font-light text-[#1A1A1A] mb-5">
                What defines the edit
              </h2>
              <ul className="space-y-4 font-body text-[14px] leading-[1.8] text-[#8A8A8A]">
                <li>Curated categories instead of endless product sprawl.</li>
                <li>Direct WhatsApp support for sizing, gifting, and sourcing.</li>
                <li>Clear shipping and returns information before checkout.</li>
                <li>A brand experience designed to feel calm, selective, and credible.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
