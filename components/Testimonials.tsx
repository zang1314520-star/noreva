"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const testimonials = [
  {
    id: 1,
    message: "Will the 20L business backpack fit a 16-inch MacBook and charger without looking bulky?",
    response: "Yes. Choose the Business 20L if you want a cleaner office profile with a padded 16-inch laptop sleeve and separate tech pockets.",
    customer: "Daniel R.",
    location: "Singapore",
    date: "March 2026",
    tag: "Business 20L",
  },
  {
    id: 2,
    message: "I commute by train and get caught in rain a lot. Which pack should I choose?",
    response: "The Roll-Top 22L is the safest pick for wet commutes. It has a weather-resistant shell, expandable top, and quick side access.",
    customer: "Maya K.",
    location: "London",
    date: "February 2026",
    tag: "Rain commute",
  },
  {
    id: 3,
    message: "Can I use one backpack for a two-day work trip and daily office carry?",
    response: "Go with the Travel 25L. It opens wider for packing, has a luggage pass-through, and still keeps the front profile sharp.",
    customer: "Alex C.",
    location: "Toronto",
    date: "January 2026",
    tag: "Travel 25L",
  },
];

export default function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section ref={ref} id="testimonials" className="py-24 md:py-32 px-8 md:px-16 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="label block mb-4">Customer Questions</span>
          <h2 className="font-display text-[clamp(1.8rem,3vw,2.5rem)] font-light text-[#1A1A1A]">
            Real carry needs, answered clearly.
          </h2>
          <p className="mt-5 mx-auto max-w-xl font-body text-[13px] leading-[1.8] text-[#8A8A8A]">
            Reviews should not just say "nice bag." They should remove doubt around fit, capacity, laptop protection, weather, and travel.
          </p>
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
              <div className="bg-[#F7F5F1] rounded-[20px] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-500">
                <div className="bg-[#1A1A1A] px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#C9A96E] flex items-center justify-center">
                    <span className="text-[10px] text-white font-medium">
                      {item.customer.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-white text-xs font-medium">{item.customer}</p>
                    <p className="text-[#A8A8A8] text-[9px]">{item.location}</p>
                  </div>
                  <span className="ml-auto rounded-full border border-white/20 px-2.5 py-1 text-[8px] uppercase tracking-[0.18em] text-[#F7F5F1]">
                    {item.tag}
                  </span>
                </div>

                <div className="p-4 space-y-3">
                  <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm max-w-[90%]">
                    <p className="text-[12px] text-[#1A1A1A] leading-[1.6]">{item.message}</p>
                    <p className="text-[9px] text-[#A8A8A8] mt-1 text-right">{item.date}</p>
                  </div>
                  <div className="bg-[#E7F0DD] rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-sm ml-auto max-w-[90%]">
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
                  <span className="text-[9px] text-[#8A8A8A]">5.0 verified fit guidance</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
