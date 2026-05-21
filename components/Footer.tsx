import Image from "next/image";
import Link from "next/link";
import ContactModal from "@/components/ContactModal";

export default function Footer() {
  return (
    <footer
      id="contact"
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

          {/* Brand col */}
          <div className="lg:col-span-2">
            <div className="relative h-10 w-36 mb-4">
              <Image
                src="/brand_assets/CNA Logo - White with Alpha Background.png"
                alt="CNA Lighting"
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs mb-4">
              Premium LED lighting solutions for residential, commercial, and industrial
              applications. Trusted by professionals across Canada.
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="px-2.5 py-1 border border-white/20 rounded-sm text-white/60 text-xs uppercase tracking-widest">
                cUL Listed
              </div>
              <div className="px-2.5 py-1 border border-white/20 rounded-sm text-white/60 text-xs uppercase tracking-widest">
                cETLus
              </div>
              <div className="px-2.5 py-1 border border-white/20 rounded-sm text-white/60 text-xs uppercase tracking-widest">
                cTUVus
              </div>
            </div>
          </div>

          {/* CNA col */}
          <div>
            <h4 className="text-white text-lg uppercase tracking-wide mb-3" style={{ fontFamily: "var(--font-roboto, 'Roboto', sans-serif)", fontWeight: 600 }}>
              CNA
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Dimmer Compatibility", href: "/dimmer-compatibility" },
                { label: "Freight Prepaid Policy", href: "/freight-prepaid-policy" },
                { label: "FAQ", href: "/faq" },
                { label: "Company History", href: "/company-history" },
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

          {/* Support col */}
          <div>
            <h4 className="text-white text-lg uppercase tracking-wide mb-3" style={{ fontFamily: "var(--font-roboto, 'Roboto', sans-serif)", fontWeight: 600 }}>
              Support
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Warranty / Return Policy", href: "/warranty-return-policy" },
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
          <div>
            <h4 className="text-white text-lg uppercase tracking-wide mb-3" style={{ fontFamily: "var(--font-roboto, 'Roboto', sans-serif)", fontWeight: 600 }}>
              Contact
            </h4>
            <div className="space-y-2.5 text-sm text-white/50">
              <div className="flex items-start gap-2.5">
                <svg className="w-4 h-4 mt-0.5 text-[#FFD700] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Canada</span>
              </div>
              <div className="flex items-start gap-2.5">
                <ContactModal />
              </div>
              <div className="flex items-start gap-2.5">
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
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
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
