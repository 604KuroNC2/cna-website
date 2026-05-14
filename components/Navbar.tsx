"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import gsap from "gsap";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/company-history", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const logo = logoRef.current;
    const links = linksRef.current ? Array.from(linksRef.current.children) : [];
    const anim1 = gsap.fromTo(logo,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.7, ease: "power3.out", delay: 0.1, clearProps: "all" }
    );
    const anim2 = gsap.fromTo(links,
      { opacity: 0, y: -12 },
      { opacity: 1, y: 0, stagger: 0.07, duration: 0.5, ease: "power2.out", delay: 0.2, clearProps: "all" }
    );
    return () => { anim1.kill(); anim2.kill(); };
  }, []);


  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
      style={{
        background: "linear-gradient(135deg, rgba(0,0,42,0.85) 0%, rgba(0,0,96,0.85) 35%, rgba(0,0,128,0.85) 65%, rgba(0,0,160,0.85) 100%)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div ref={logoRef}>
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-10 w-32">
                <Image
                  src="/brand_assets/CNA Logo - White with Alpha Background.png"
                  alt="CNA Lighting"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop nav */}
          <div ref={linksRef} className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium tracking-wide uppercase transition-colors duration-200 group ${
                  pathname === link.href
                    ? "text-[#FFD700]"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-4 right-4 h-0.5 bg-[#FFD700] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${
                    pathname === link.href ? "scale-x-100" : ""
                  }`}
                />
              </Link>
            ))}

            <Link
              href="/products"
              className="ml-4 px-5 py-2.5 bg-[#FFD700] text-[#000080] text-sm font-bold uppercase tracking-wide rounded-sm hover:bg-[#FFE44D] transition-all duration-200 hover:shadow-[0_4px_20px_rgba(255,215,0,0.4)] active:scale-95"
            >
              Browse Catalog
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 group"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
                mobileOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
                mobileOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } bg-[#000060]/98 backdrop-blur-md`}
      >
        <div className="px-4 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-sm transition-colors font-medium uppercase tracking-wide text-sm"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/products"
            onClick={() => setMobileOpen(false)}
            className="mt-2 px-4 py-3 bg-[#FFD700] text-[#000080] font-bold text-sm uppercase tracking-wide text-center rounded-sm"
          >
            Browse Catalog
          </Link>
        </div>
      </div>
    </nav>
  );
}
