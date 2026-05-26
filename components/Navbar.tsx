"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { CategoryTree } from "@/lib/types";
import { toSlug } from "@/lib/slugs";

export default function Navbar() {
  const [categories, setCategories] = useState<CategoryTree[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const logo = logoRef.current;
    const links = linksRef.current ? Array.from(linksRef.current.children) : [];
    const anim1 = gsap.fromTo(logo,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.1, clearProps: "all" }
    );
    const anim2 = gsap.fromTo(links,
      { opacity: 0, y: -12 },
      { opacity: 1, y: 0, stagger: 0.05, duration: 0.5, ease: "power2.out", delay: 0.3, clearProps: "all" }
    );
    return () => { anim1.kill(); anim2.kill(); };
  }, [categories]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMouseEnter = useCallback((name: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveDropdown(name);
  }, []);

  const handleMouseLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 120);
  }, []);

  const navigateTo = useCallback((path: string) => {
    setActiveDropdown(null);
    setMobileOpen(false);
    router.push(path);
  }, [router]);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
      style={{
        background: "linear-gradient(135deg, rgba(0,0,42,0.92) 0%, rgba(0,0,96,0.92) 35%, rgba(0,0,128,0.92) 65%, rgba(0,0,160,0.92) 100%)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Row 1: centered logo */}
        <div className="hidden md:flex justify-center items-center relative">
          {/* Mobile hamburger anchor — hidden on desktop, kept for layout parity */}
          <div ref={logoRef} className="flex justify-center py-2">
            <Link href="/" className="flex items-center">
              <div
                className="relative overflow-hidden"
                style={{
                  width: scrolled ? "128px" : "256px",
                  height: scrolled ? "40px"  : "80px",
                  transition: "width 0.35s ease, height 0.35s ease",
                }}
              >
                <Image
                  src="/brand_assets/CNA Logo - White with Alpha Background.png"
                  alt="CNA Lighting"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>
        </div>

        {/* Row 2: category menus — desktop */}
        <div
          ref={linksRef}
          className="hidden md:flex flex-wrap items-center justify-center gap-0.5 border-t border-white/10"
          style={{ paddingTop: "2px", paddingBottom: "2px" }}
        >
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="relative"
              onMouseEnter={() => handleMouseEnter(cat.name)}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => navigateTo(`/products/${toSlug(cat.name)}`)}
                className="relative px-3 py-2 text-xs font-medium tracking-wide uppercase text-white/80 hover:text-white transition-colors duration-200 flex items-center gap-1 group"
              >
                {cat.name}
                <svg
                  className={`w-3 h-3 opacity-50 transition-transform duration-200 ${activeDropdown === cat.name ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#FFD700] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </button>

              {/* Dropdown */}
              {activeDropdown === cat.name && cat.subcategories.length > 0 && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-1 z-50"
                  onMouseEnter={() => handleMouseEnter(cat.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div
                    className="min-w-[200px] rounded-sm overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, #00002a 0%, #000060 100%)",
                      border: "1px solid rgba(255,215,0,0.15)",
                      boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                    }}
                  >
                    <div className="h-0.5 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />
                    <div className="py-1.5">
                      {cat.subcategories.map((sub) => (
                        <button
                          key={sub.name}
                          onClick={() => navigateTo(`/products/${toSlug(cat.name)}/${toSlug(sub.name)}`)}
                          className="w-full text-left px-4 py-2 text-xs text-white/70 hover:text-[#FFD700] hover:bg-white/5 transition-colors duration-150"
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile row: logo left + hamburger right */}
        <div className="md:hidden flex items-center justify-between min-h-16 py-2">
          <Link href="/" className="flex items-center">
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
          <button
            className="flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"} bg-[#000050]/98 backdrop-blur-md overflow-y-auto`}
      >
        <div className="px-4 py-3 flex flex-col gap-0.5">
          {categories.map((cat) => (
            <div key={cat.name}>
              <div className="flex items-center">
                <button
                  onClick={() => navigateTo(`/products/${toSlug(cat.name)}`)}
                  className="flex-1 text-left px-4 py-3 text-white/80 hover:text-white font-medium uppercase tracking-wide text-sm transition-colors"
                >
                  {cat.name}
                </button>
                {cat.subcategories.length > 0 && (
                  <button
                    onClick={() => setExpandedMobile(expandedMobile === cat.name ? null : cat.name)}
                    className="px-3 py-3 text-white/50 hover:text-[#FFD700] transition-colors"
                    aria-label={`Expand ${cat.name}`}
                  >
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${expandedMobile === cat.name ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}
              </div>

              {expandedMobile === cat.name && (
                <div className="ml-4 border-l border-white/10 pl-3 pb-1">
                  {cat.subcategories.map((sub) => (
                    <button
                      key={sub.name}
                      onClick={() => navigateTo(`/products/${toSlug(cat.name)}/${toSlug(sub.name)}`)}
                      className="w-full text-left px-3 py-2 text-white/60 hover:text-[#FFD700] text-xs uppercase tracking-wide transition-colors"
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
