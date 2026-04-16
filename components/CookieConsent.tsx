"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // 检查是否已经同意
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    localStorage.setItem("cookie-consent-date", new Date().toISOString());
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-[#E8E6E2] shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <p className="font-body text-[13px] text-[#8A8A8A] leading-relaxed">
            We use cookies to enhance your browsing experience and analyze site traffic. 
            By clicking "Accept", you consent to our use of cookies.{" "}
            <Link href="/privacy" className="text-[#C9A96E] hover:underline">
              Read our Privacy Policy
            </Link>
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={accept}
            className="px-6 py-2.5 bg-[#1A1A1A] text-white font-body text-[11px] tracking-[0.15em] uppercase hover:bg-[#C9A96E] transition-colors duration-300"
          >
            Accept
          </button>
          <button
            onClick={accept}
            className="px-6 py-2.5 border border-[#E8E6E2] text-[#8A8A8A] font-body text-[11px] tracking-[0.15em] uppercase hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-colors duration-300"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
