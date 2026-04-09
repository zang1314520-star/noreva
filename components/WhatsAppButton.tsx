"use client";

interface WhatsAppButtonProps {
  phoneNumber?: string;
}

export default function WhatsAppButton({ phoneNumber = "YOURNUMBER" }: WhatsAppButtonProps) {
  return (
    <a
      href={`https://wa.me/${phoneNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on WhatsApp"
      className="fixed bottom-8 right-8 z-50 group"
    >
      <div className="relative">
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#C9A96E]/20 scale-100 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500" />
        
        {/* Button */}
        <div className="relative w-12 h-12 rounded-full bg-[#1A1A1A] flex items-center justify-center transition-all duration-300 group-hover:bg-[#C9A96E] group-hover:shadow-lg group-hover:shadow-[#C9A96E]/20">
          {/* Message icon - minimal line style */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white transition-colors duration-300 group-hover:text-[#1A1A1A]"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </div>
      </div>
    </a>
  );
}
