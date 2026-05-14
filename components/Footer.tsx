"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".footer-col",
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: "power3.out", clearProps: "all",
          scrollTrigger: { trigger: footerRef.current, start: "top 90%", once: true },
        }
      );
    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer
      id="contact"
      ref={footerRef}
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #00002a 0%, #000060 50%, #000080 100%)",
      }}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Gold top line */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand col */}
          <div className="footer-col lg:col-span-2">
            <div className="relative h-12 w-40 mb-6">
              <Image
                src="/brand_assets/CNA Logo - White with Alpha Background.png"
                alt="CNA Lighting"
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs mb-6">
              Premium LED lighting solutions for residential, commercial, and industrial
              applications. Trusted by professionals across Canada.
            </p>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 border border-white/20 rounded-sm text-white/60 text-xs uppercase tracking-widest">
                cUL Listed
              </div>
              <div className="px-3 py-1.5 border border-white/20 rounded-sm text-white/60 text-xs uppercase tracking-widest">
                cETLus
              </div>
              <div className="px-3 py-1.5 border border-white/20 rounded-sm text-white/60 text-xs uppercase tracking-widest">
                cTUVus
              </div>
            </div>
          </div>

          {/* SubMenu col */}
          <div className="footer-col">
            <h4 className="text-white font-display font-bold text-lg uppercase tracking-wide mb-4">
              SubMenu
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Dimmer Compatibility", href: "/dimmer-compatibility" },
                { label: "Freight Prepaid Policy", href: "/freight-prepaid-policy" },
                { label: "Warranty / Return Policy", href: "/warranty-return-policy" },
                { label: "FAQ", href: "/faq" },
                { label: "Company History", href: "/company-history" },
                { label: "Contact", href: "/contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-white/50 hover:text-[#FFD700] text-sm transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact col */}
          <div className="footer-col">
            <h4 className="text-white font-display font-bold text-lg uppercase tracking-wide mb-4">
              Contact
            </h4>
            <div className="space-y-3 text-sm text-white/50">
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 mt-0.5 text-[#FFD700] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Canada</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 mt-0.5 text-[#FFD700] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@cnalighting.com" className="hover:text-[#FFD700] transition-colors">
                  info@cnalighting.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 mt-0.5 text-[#FFD700] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <a
                  href="https://www.cnalighting.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FFD700] transition-colors"
                >
                  www.cnalighting.com
                </a>
              </div>
            </div>

            {/* Upload section */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <Link
                href="/products?upload=true"
                className="inline-flex items-center gap-2 text-[#FFD700] text-xs hover:text-[#FFE44D] transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Update Product Catalog
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} CNA Lighting. All rights reserved.
          </p>
          <p className="text-white/20 text-xs">
            Premium LED Solutions · Made in Canada
          </p>
        </div>
      </div>
    </footer>
  );
}
