"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const testimonials = [
  {
    id: 1,
    message: "The linen jacket arrived today. It is even better than the photos.",
    response: "So happy to hear that! The linen we use is from Belgium.",
    customer: "Sofia M.",
    location: "Milan",
    date: "March 2026",
  },
  {
    id: 2,
    message: "Is this watch still available?",
    response: "Yes, we have one left in stock.",
    customer: "Thomas L.",
    location: "Berlin",
    date: "February 2026",
  },
  {
    id: 3,
    message: "Shipping to Switzerland - how long?",
    response: "Typically 3-5 business days via DHL Express.",
    customer: "Emma K.",
    location: "Zurich",
    date: "January 2026",
  },
];

export default function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section ref={ref} className="py-24 md:py-32 px-8 md:px-16 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="label block mb-4">Testimonials</span>
          <h2 className="font-display text-[clamp(1.8rem,3vw,2.5rem)] font-light text-[#1A1A1A]">
            Words from our clients
          </h2>
          <div className="flex justify-center mt-6">
            <span className="gold-rule" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.15 }}
            >
              <div className="bg-[#F7F5F1] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-500">
                <div className="bg-[#1A1A1A] px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#C9A96E] flex items-center justify-center">
                    <span className="text-[10px] text-white font-medium">
                      {item.customer.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-white text-xs font-medium">{item.customer}</p>
                    <p className="text-[#8A8A8A] text-[9px]">{item.location}</p>
                  </div>
                  <div className="ml-auto">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#C9A96E">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.211l4.287-1.399A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.487 0-4.807-.803-6.715-2.151l-.481-.318-2.982.974.961-2.918-.331-.482A9.935 9.935 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                    </svg>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm max-w-[85%]">
                    <p className="text-[12px] text-[#1A1A1A] leading-[1.6]">{item.message}</p>
                    <p className="text-[9px] text-[#A8A8A8] mt-1 text-right">{item.date}</p>
                  </div>
                  <div className="bg-[#DCF8C6] rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-sm ml-auto max-w-[85%]">
                    <p className="text-[12px] text-[#1A1A1A] leading-[1.6]">{item.response}</p>
                  </div>
                </div>

                <div className="px-4 pb-4 flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill="#C9A96E">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-[9px] text-[#8A8A8A]">5.0</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 
