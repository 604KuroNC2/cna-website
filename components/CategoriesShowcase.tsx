"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    name: "Filament Bulbs",
    desc: "Vintage style, modern efficiency. A19, ST19, G25, T30 and more.",
    slug: "filament-bulbs",
    image: "https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  },
  {
    name: "General Purpose",
    desc: "Everyday LED A-series bulbs in single pack and multi-pack options.",
    slug: "general-purpose",
    image: "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  },
  {
    name: "Reflectors & Spotlights",
    desc: "MR16, GU10, PAR lamps for accent and directional lighting.",
    slug: "reflectors-spotlights",
    image: "https://images.pexels.com/photos/2079246/pexels-photo-2079246.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  },
  {
    name: "Miniature Bulbs",
    desc: "G4, G9, E11, J-Type specialty bulbs for fixtures and appliances.",
    slug: "miniature-bulbs",
    image: "https://images.pexels.com/photos/1123262/pexels-photo-1123262.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  },
  {
    name: "Downlights",
    desc: "Recessed LED potlights for residential and commercial ceilings.",
    slug: "downlights",
    image: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  },
  {
    name: "Strip Lights",
    desc: "Flexible LED strips for under-cabinet, cove, and accent lighting.",
    slug: "strip-lights",
    image: "https://images.pexels.com/photos/2062431/pexels-photo-2062431.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  },
];

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/products/${cat.slug}`}
              className="category-card group relative overflow-hidden rounded-sm border border-gray-100 hover:border-[#000080]/30 transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,0,128,0.15)]"
              style={{ minHeight: "260px" }}
            >
              {/* Background image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />

              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#000060]/90 via-[#000080]/50 to-black/20 group-hover:from-[#000080]/95 transition-all duration-300" />

              {/* Gold top accent line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#FFD700] scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />

              {/* Content */}
              <div className="relative p-7 flex flex-col justify-end h-full" style={{ minHeight: "260px" }}>
                <div className="mt-auto">
                  <h3 className="font-display font-black text-2xl text-white mb-2 group-hover:text-[#FFD700] transition-colors duration-300 leading-tight">
                    {cat.name}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-4">{cat.desc}</p>

                  <div className="flex items-center gap-2 text-[#FFD700] text-xs font-bold uppercase tracking-widest">
                    Shop Now
                    <svg
                      className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

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
