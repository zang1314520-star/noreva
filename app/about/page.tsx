import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata = {
  title: "About - Nayo Smart",
  description: "Learn about Nayo Smart backpacks for work, travel, commuting, and organized daily carry.",
};

export default function AboutPage() {
  return (
    <main className="bg-white min-h-screen">
      <Navigation />
      <div className="pt-32 pb-20 px-8 md:px-16">
        <div className="max-w-4xl mx-auto">
          <p className="label text-[#8A8A8A] mb-4">About Nayo Smart</p>
          <h1 className="font-display text-4xl md:text-5xl font-light text-[#1A1A1A] mb-8">
            Smart backpacks designed around how modern people actually move.
          </h1>

          <div className="grid gap-10 md:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6 font-body text-[15px] leading-[1.95] text-[#8A8A8A]">
              <p>
                Nayo Smart focuses on laptop backpacks for commuting, business trips, travel, and organized everyday carry.
              </p>
              <p>
                Instead of selling generic silhouettes, we design around capacity, tech protection, weather resistance, storage logic, and how a bag feels across a full day of movement.
              </p>
              <p>
                This new storefront keeps the official product range clear and easier to compare, while still offering direct WhatsApp support when a customer wants help choosing the right model.
              </p>
            </div>

            <div className="border border-[#E8E6E2] bg-[#F7F5F1] p-8">
              <h2 className="font-display text-2xl font-light text-[#1A1A1A] mb-5">What defines the range</h2>
              <ul className="space-y-4 font-body text-[14px] leading-[1.8] text-[#8A8A8A]">
                <li>Clear laptop compatibility and capacity information.</li>
                <li>Water-resistant fabrics and durable hardware.</li>
                <li>Travel-ready details like luggage straps, RFID pockets and quick-access organization.</li>
                <li>Official Nayo Smart support, 30-day returns and 24-month warranty.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
