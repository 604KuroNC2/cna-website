"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: "North American Certified",
    desc: "All products carry cUL, cETLus, or cTUVus certification — meeting the highest North American electrical safety standards.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "High Efficiency",
    desc: "Up to 130+ lm/W efficacy across our product lines. Replace incandescent and halogen fixtures and cut energy costs by up to 80%.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Long Rated Life",
    desc: "15,000–25,000+ hour rated life (L70) on most products. Fewer replacements, lower maintenance costs.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Detailed Spec Sheets",
    desc: "Every product includes a downloadable spec sheet with full photometric data, dimensions, and installation guidance.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    title: "Dimmable Options",
    desc: "Most CNA products are dimmable and compatible with standard TRIAC dimmers. Check product spec for Lutron compatibility.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    title: "Wide Product Range",
    desc: "500+ SKUs across residential, hospitality, commercial, and industrial applications — all in one trusted brand.",
  },
];

export default function WhyCNA() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".why-item",
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0, stagger: 0.1, duration: 0.6, ease: "power3.out", clearProps: "all",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%", once: true },
        }
      );
      gsap.fromTo(".why-heading",
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out", clearProps: "all",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-24 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #f8f8fc 0%, #eef0f8 100%)",
      }}
    >
      {/* Decorative element */}
      <div
        className="absolute right-0 top-0 bottom-0 w-1/3 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, transparent, rgba(0,0,128,0.03))",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="why-heading max-w-2xl mb-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-10 bg-[#FFD700]" />
            <span className="text-[#000080] text-xs font-medium uppercase tracking-[0.25em]">
              Why CNA
            </span>
          </div>
          <h2 className="font-display font-black text-5xl sm:text-6xl text-[#000080] tracking-tight leading-none">
            ENGINEERED FOR
            <br />
            <span className="text-[#FFD700]" style={{ WebkitTextStroke: "2px #000080" }}>
              PERFORMANCE.
            </span>
          </h2>
          <p className="mt-6 text-gray-500 text-lg leading-relaxed">
            CNA Lighting has been supplying high-quality LED solutions across Canada for over two decades.
            Every product is rigorously tested and certified before it reaches your hands.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="why-item group bg-white rounded-sm p-6 border border-gray-100 hover:border-[#000080]/20 hover:shadow-[0_8px_30px_rgba(0,0,128,0.08)] transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-sm bg-[#000080]/06 flex items-center justify-center text-[#000080] mb-4 group-hover:bg-[#000080] group-hover:text-white transition-all duration-300">
                {f.icon}
              </div>
              <h3 className="font-display font-bold text-xl text-[#000080] mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
