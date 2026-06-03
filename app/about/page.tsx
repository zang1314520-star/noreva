import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata = {
  title: "About - NOREVA Backpacks",
  description: "Learn about NOREVA smart backpacks for work, travel, commuting, and organized daily carry.",
};

export default function AboutPage() {
  return (
    <main className="bg-white min-h-screen">
      <Navigation />
      <div className="pt-32 pb-20 px-8 md:px-16">
        <div className="max-w-4xl mx-auto">
          <p className="label text-[#8A8A8A] mb-4">About NOREVA</p>
          <h1 className="font-display text-4xl md:text-5xl font-light text-[#1A1A1A] mb-8">
            Smart backpacks for people who move between work, travel, and everyday life.
          </h1>

          <div className="grid gap-10 md:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6 font-body text-[15px] leading-[1.95] text-[#8A8A8A]">
              <p>
                NOREVA is focused on backpacks: commuter bags, business backpacks, travel packs, and weather-ready everyday carry.
              </p>
              <p>
                The goal is to make choosing a backpack easier. Instead of endless categories, we organize products by capacity, laptop fit, materials, weight, and real use cases.
              </p>
              <p>
                Our shopping experience combines a focused storefront with direct WhatsApp support when you want help choosing the right size or layout.
              </p>
            </div>

            <div className="border border-[#E8E6E2] bg-[#F7F5F1] p-8">
              <h2 className="font-display text-2xl font-light text-[#1A1A1A] mb-5">What defines the range</h2>
              <ul className="space-y-4 font-body text-[14px] leading-[1.8] text-[#8A8A8A]">
                <li>Clear laptop compatibility and capacity information.</li>
                <li>Water-resistant materials for daily movement.</li>
                <li>Travel details such as luggage straps and quick-access pockets.</li>
                <li>30-day easy returns and a 24-month warranty promise.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
