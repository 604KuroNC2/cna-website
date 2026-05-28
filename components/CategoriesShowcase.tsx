"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BLOB = "https://6dywl8dmjehpqrx0.public.blob.vercel-storage.com";

const categories = [
  {
    name: "Bulbs",
    desc: "A-series, filament, GU10, G9, and specialty bulbs for every residential socket.",
    slug: "bulbs",
    image: `${BLOB}/2026/05/Bulbs%201.png`,
  },
  {
    name: "Recessed Lighting",
    desc: "Slim and standard LED pot lights built for Canadian residential and commercial ceilings.",
    slug: "recessed",
    image: `${BLOB}/2026/05/Recessed%201.png`,
  },
  {
    name: "Flush Mounts",
    desc: "Surface-mounted LED ceiling fixtures for kitchens, hallways, and living spaces.",
    slug: "flush-mounts",
    image: `${BLOB}/2026/05/Flush%20Mount%201.png`,
  },
  {
    name: "Vanity Lights",
    desc: "Bathroom bar and mirror lighting with clean, shadow-free illumination.",
    slug: "vanity-lights",
    image: `${BLOB}/2026/05/Vanity%201.png`,
  },
  {
    name: "Under Cabinet",
    desc: "LED bars and puck lights for kitchen counters, display cases, and task areas.",
    slug: "under-cabinet",
    image: `${BLOB}/2026/05/Under%20Cabinet%201.png`,
  },
  {
    name: "Commercial Fixtures",
    desc: "Industrial-grade LED solutions engineered for retail, warehouse, and office environments.",
    slug: "commercial-fixtures",
    filters: ["Commercial Fixtures", "PL & PLC", "Tubes"],
    image: `${BLOB}/2026/05/Commercial%201.png`,
  },
];

const featuredCategory = {
  name: "Emergency & Exit",
  desc: "Code-compliant emergency lighting and illuminated exit signs trusted in facilities across Canada.",
  slug: "emergency-exit",
  image: `${BLOB}/2026/05/Emergency%201.png`,
};

export default function CategoriesShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".category-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, stagger: 0.08, duration: 0.7, ease: "power3.out", clearProps: "all",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
        }
      );
      gsap.fromTo(".section-header",
        { opacity: 0, y: 25 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out", clearProps: "all",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="section-header text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-[#FFD700]" />
            <span className="text-[#000080] text-xs font-medium uppercase tracking-[0.25em]">
              Product Lines
            </span>
            <div className="h-px w-10 bg-[#FFD700]" />
          </div>
          <h2 className="font-display font-black text-5xl sm:text-6xl text-[#000080] tracking-tight">
            EXPLORE BY CATEGORY
          </h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">
            From everyday replacements to specialized commercial fixtures — every CNA product delivers
            exceptional performance and longevity.
          </p>
        </div>

        {/* Main 6-category grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/products/${cat.slug}`}
              className="category-card group relative overflow-hidden rounded-sm border border-gray-100 hover:border-[#000080]/30 transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,0,128,0.15)]"
              style={{ minHeight: "260px" }}
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 480px) calc(100vw - 2rem), (max-width: 640px) calc(100vw - 2rem), (max-width: 1024px) calc(50vw - 2rem), 420px"
                quality={65}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                style={{ objectPosition: "center 25%" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#000060]/92 via-[#000080]/55 to-black/30 group-hover:from-[#000080]/96 transition-all duration-300" />
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#FFD700] scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />

              <div className="relative p-7 flex flex-col justify-end h-full" style={{ minHeight: "260px" }}>
                <div className="mt-auto">
                  <h3
                    className="font-display font-black text-2xl text-white mb-2 group-hover:text-[#FFD700] transition-colors duration-300 leading-tight"
                    style={{ textShadow: "0 1px 3px rgba(0,0,0,0.9), 0 0 16px rgba(0,0,0,0.7)" }}
                  >
                    {cat.name}
                  </h3>
                  <p
                    className="text-white/70 text-sm leading-relaxed mb-3"
                    style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
                  >{cat.desc}</p>

                  {cat.filters && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {cat.filters.map((f) => (
                        <span
                          key={f}
                          className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded-sm border border-[#FFD700]/30 text-[#FFD700]/70 bg-[#FFD700]/05"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  )}

                  <div
                    className="flex items-center gap-2 text-[#FFD700] text-xs font-bold uppercase tracking-widest"
                    style={{ textShadow: "0 1px 3px rgba(0,0,0,0.9)" }}
                  >
                    Shop Now
                    <svg
                      className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-2"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Emergency & Exit — full-width featured card */}
        <Link
          href={`/products/${featuredCategory.slug}`}
          className="category-card group relative overflow-hidden rounded-sm border border-gray-100 hover:border-[#000080]/30 transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,0,128,0.15)] block"
          style={{ minHeight: "180px" }}
        >
          <Image
            src={featuredCategory.image}
            alt={featuredCategory.name}
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            quality={65}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ objectPosition: "center 25%" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#000060]/95 via-[#000080]/70 to-black/30 group-hover:from-[#000080]/98 transition-all duration-300" />
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#FFD700] scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />

          <div className="relative p-7 flex items-center justify-between h-full" style={{ minHeight: "180px" }}>
            <div>
              <h3
                className="font-display font-black text-2xl text-white mb-2 group-hover:text-[#FFD700] transition-colors duration-300 leading-tight"
                style={{ textShadow: "0 1px 3px rgba(0,0,0,0.9), 0 0 16px rgba(0,0,0,0.7)" }}
              >
                {featuredCategory.name}
              </h3>
              <p
                className="text-white/70 text-sm leading-relaxed max-w-xl"
                style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
              >{featuredCategory.desc}</p>
            </div>
            <div
              className="flex-shrink-0 ml-8 flex items-center gap-2 text-[#FFD700] text-xs font-bold uppercase tracking-widest"
              style={{ textShadow: "0 1px 3px rgba(0,0,0,0.9)" }}
            >
              Shop Now
              <svg
                className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-2"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </Link>

        <div className="mt-10 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#000080] text-white font-bold text-sm uppercase tracking-wide rounded-sm hover:bg-[#0000a0] transition-all duration-200 hover:shadow-[0_8px_30px_rgba(0,0,128,0.3)]"
          >
            View All Products
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
