import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TrackLookup from "./TrackLookup";

export const metadata: Metadata = {
  title: "Track Order - Nayo Smart",
  description: "Track your Nayo Smart backpack order using your order number and checkout email.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function TrackPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      <section className="px-8 pb-24 pt-36 md:px-16">
        <TrackLookup />
      </section>
      <Footer />
    </main>
  );
}
