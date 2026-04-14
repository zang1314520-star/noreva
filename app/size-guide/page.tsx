import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = {
  title: "Size Guide — NOREVA",
  description: "NOREVA size guide. Find your perfect fit.",
};

export default function SizeGuidePage() {
  return (
    <main className="bg-white min-h-screen">
      <Navigation />
      
      <div className="pt-32 pb-20 px-8 md:px-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-light text-[#1A1A1A] mb-4">
            Size Guide
          </h1>
          <p className="font-body text-[#8A8A8A] mb-12 max-w-xl">
            All measurements are in centimeters. If between sizes, we recommend sizing up 
            for a relaxed fit or sizing down for a more tailored look.
          </p>
          
          <div className="space-y-16">
            <section>
              <h2 className="font-display text-2xl text-[#1A1A1A] mb-6">Women</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-[#E8E6E2]">
                      <th className="text-left py-3 font-body text-[11px] tracking-[0.15em] uppercase text-[#8A8A8A]">Size</th>
                      <th className="text-left py-3 font-body text-[11px] tracking-[0.15em] uppercase text-[#8A8A8A]">FR</th>
                      <th className="text-left py-3 font-body text-[11px] tracking-[0.15em] uppercase text-[#8A8A8A]">IT</th>
                      <th className="text-left py-3 font-body text-[11px] tracking-[0.15em] uppercase text-[#8A8A8A]">UK</th>
                      <th className="text-left py-3 font-body text-[11px] tracking-[0.15em] uppercase text-[#8A8A8A]">US</th>
                      <th className="text-left py-3 font-body text-[11px] tracking-[0.15em] uppercase text-[#8A8A8A]">Bust</th>
                      <th className="text-left py-3 font-body text-[11px] tracking-[0.15em] uppercase text-[#8A8A8A]">Waist</th>
                    </tr>
                  </thead>
                  <tbody className="font-body text-[14px] text-[#8A8A8A]">
                    <tr className="border-b border-[#E8E6E2]">
                      <td className="py-3 text-[#1A1A1A]">XS</td>
                      <td className="py-3">34</td>
                      <td className="py-3">38</td>
                      <td className="py-3">6</td>
                      <td className="py-3">2</td>
                      <td className="py-3">82-85</td>
                      <td className="py-3">62-65</td>
                    </tr>
                    <tr className="border-b border-[#E8E6E2]">
                      <td className="py-3 text-[#1A1A1A]">S</td>
                      <td className="py-3">36</td>
                      <td className="py-3">40</td>
                      <td className="py-3">8</td>
                      <td className="py-3">4</td>
                      <td className="py-3">86-89</td>
                      <td className="py-3">66-69</td>
                    </tr>
                    <tr className="border-b border-[#E8E6E2]">
                      <td className="py-3 text-[#1A1A1A]">M</td>
                      <td className="py-3">38</td>
                      <td className="py-3">42</td>
                      <td className="py-3">10</td>
                      <td className="py-3">6</td>
                      <td className="py-3">90-93</td>
                      <td className="py-3">70-73</td>
                    </tr>
                    <tr className="border-b border-[#E8E6E2]">
                      <td className="py-3 text-[#1A1A1A]">L</td>
                      <td className="py-3">40</td>
                      <td className="py-3">44</td>
                      <td className="py-3">12</td>
                      <td className="py-3">8</td>
                      <td className="py-3">94-97</td>
                      <td className="py-3">74-77</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl text-[#1A1A1A] mb-6">Men</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-[#E8E6E2]">
                      <th className="text-left py-3 font-body text-[11px] tracking-[0.15em] uppercase text-[#8A8A8A]">Size</th>
                      <th className="text-left py-3 font-body text-[11px] tracking-[0.15em] uppercase text-[#8A8A8A]">FR</th>
                      <th className="text-left py-3 font-body text-[11px] tracking-[0.15em] uppercase text-[#8A8A8A]">IT</th>
                      <th className="text-left py-3 font-body text-[11px] tracking-[0.15em] uppercase text-[#8A8A8A]">UK</th>
                      <th className="text-left py-3 font-body text-[11px] tracking-[0.15em] uppercase text-[#8A8A8A]">US</th>
                      <th className="text-left py-3 font-body text-[11px] tracking-[0.15em] uppercase text-[#8A8A8A]">Chest</th>
                      <th className="text-left py-3 font-body text-[11px] tracking-[0.15em] uppercase text-[#8A8A8A]">Waist</th>
                    </tr>
                  </thead>
                  <tbody className="font-body text-[14px] text-[#8A8A8A]">
                    <tr className="border-b border-[#E8E6E2]">
                      <td className="py-3 text-[#1A1A1A]">S</td>
                      <td className="py-3">46</td>
                      <td className="py-3">46</td>
                      <td className="py-3">36</td>
                      <td className="py-3">36</td>
                      <td className="py-3">92-95</td>
                      <td className="py-3">76-79</td>
                    </tr>
                    <tr className="border-b border-[#E8E6E2]">
                      <td className="py-3 text-[#1A1A1A]">M</td>
                      <td className="py-3">48</td>
                      <td className="py-3">48</td>
                      <td className="py-3">38</td>
                      <td className="py-3">38</td>
                      <td className="py-3">96-99</td>
                      <td className="py-3">80-83</td>
                    </tr>
                    <tr className="border-b border-[#E8E6E2]">
                      <td className="py-3 text-[#1A1A1A]">L</td>
                      <td className="py-3">50</td>
                      <td className="py-3">50</td>
                      <td className="py-3">40</td>
                      <td className="py-3">40</td>
                      <td className="py-3">100-103</td>
                      <td className="py-3">84-87</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mt-12">
              <h3 className="font-display text-xl text-[#1A1A1A] mb-4">How to Measure</h3>
              <div className="space-y-4 font-body text-[14px] text-[#8A8A8A]">
                <p><strong className="text-[#1A1A1A]">Bust/Chest:</strong> Measure around the fullest part of your bust or chest.</p>
                <p><strong className="text-[#1A1A1A]">Waist:</strong> Measure around the narrowest part of your waist.</p>
                <p><strong className="text-[#1A1A1A]">Hips:</strong> Measure around the fullest part of your hips.</p>
              </div>
              <p className="mt-6 font-body text-[13px] text-[#A8A4A0] italic">
                Need help? Contact us via WhatsApp for personal styling advice.
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