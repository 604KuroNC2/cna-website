"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const beam1Ref = useRef<HTMLDivElement>(null);
  const beam2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Particle system
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    let particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; color: string;
    }> = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = ["rgba(255,215,0,", "rgba(255,255,255,", "rgba(180,200,255,"];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4 - 0.1,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.6 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        p.opacity += (Math.random() - 0.5) * 0.02;
        p.opacity = Math.max(0.05, Math.min(0.8, p.opacity));
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      }
      animFrame = requestAnimationFrame(draw);
    };
    draw();

    // GSAP timeline for hero reveal
    const tl = gsap.timeline({ delay: 0.3 });

    tl.fromTo([beam1Ref.current, beam2Ref.current],
      { opacity: 0, scaleY: 0 },
      { opacity: 1, scaleY: 1, duration: 1.5, stagger: 0.3, ease: "power2.out", clearProps: "all" }
    );

    if (headlineRef.current) {
      const lines = headlineRef.current.querySelectorAll(".hero-line");
      tl.fromTo(lines,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.9, ease: "power4.out", clearProps: "all" },
        "-=1"
      );
    }

    tl.fromTo(subtitleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", clearProps: "all" },
      "-=0.4"
    );

    tl.fromTo(ctaRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", clearProps: "all" },
      "-=0.3"
    );

    // Continuous beam sweep
    const beamAnim1 = gsap.to(beam1Ref.current, {
      x: "150%", duration: 12, repeat: -1, ease: "none", delay: 2,
    });
    const beamAnim2 = gsap.to(beam2Ref.current, {
      x: "150%", duration: 16, repeat: -1, ease: "none", delay: 6,
    });

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
      tl.kill();
      beamAnim1.kill();
      beamAnim2.kill();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden noise-overlay"
      style={{
        background: "linear-gradient(135deg, #00002a 0%, #000060 35%, #000080 65%, #0000a0 100%)",
      }}
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        id="particle-canvas"
        className="absolute inset-0 w-full h-full"
      />

      {/* Radial glow orbs */}
      <div
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,215,0,0.08) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,0,200,0.2) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Light beams */}
      <div
        ref={beam1Ref}
        className="absolute inset-y-0 pointer-events-none"
        style={{
          width: "30%",
          left: "-30%",
          background: "linear-gradient(90deg, transparent, rgba(255,215,0,0.04), transparent)",
          transform: "skewX(-20deg)",
        }}
      />
      <div
        ref={beam2Ref}
        className="absolute inset-y-0 pointer-events-none"
        style={{
          width: "20%",
          left: "-20%",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)",
          transform: "skewX(-15deg)",
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Hero content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-[#FFD700]" />
            <span className="text-[#FFD700] text-sm font-medium uppercase tracking-[0.25em] font-body">
              Premium LED Solutions
            </span>
          </div>

          {/* Headline */}
          <div ref={headlineRef} className="mb-6">
            <h1 className="font-display font-black leading-none tracking-tight text-white">
              <span
                className="hero-line block text-6xl sm:text-7xl lg:text-8xl xl:text-9xl"
                style={{ letterSpacing: "-0.03em" }}
              >
                ILLUMINATE
              </span>
              <span
                className="hero-line block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl gold-shimmer"
                style={{ letterSpacing: "-0.02em" }}
              >
                EVERY SPACE.
              </span>
              <span
                className="hero-line block text-3xl sm:text-4xl lg:text-5xl text-white/60 font-light"
                style={{ letterSpacing: "0.02em" }}
              >
                PERFECTLY.
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="font-body text-white/60 text-lg sm:text-xl max-w-2xl mb-10 leading-relaxed"
          >
            Canada&rsquo;s trusted source for high-efficiency LED lighting. From filament
            bulbs to commercial fixtures — engineered for performance, built to last.
          </p>

          {/* CTAs */}
          <div ref={ctaRef} className="flex flex-wrap gap-4 items-center">
            <Link
              href="/products"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#FFD700] text-[#000080] font-bold text-sm uppercase tracking-[0.12em] rounded-sm overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(255,215,0,0.5)] active:scale-95"
            >
              <span className="relative z-10">Browse Products</span>
              <svg
                className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            </Link>

            <a
              href="#about"
              className="inline-flex items-center gap-2 px-6 py-4 border border-white/20 text-white/80 hover:text-white hover:border-white/40 text-sm font-medium uppercase tracking-wide rounded-sm transition-all duration-200"
            >
              Learn More
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-20 pt-12 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "500+", label: "LED Products" },
            { value: `${Math.floor((Date.now() - new Date("1988-03-01").getTime()) / (365.25 * 24 * 60 * 60 * 1000))}+`, label: "Years Experience" },
            { value: "cUL / cETLus / cTUVus", label: "Certified" },
            { value: "2–5yr", label: "Warranty" },
          ].map((stat) => (
            <div key={stat.label} className="text-center md:text-left">
              <div className="font-display font-black text-3xl sm:text-4xl text-[#FFD700] mb-1 leading-tight">
                {stat.value}
              </div>
              <div className="text-white/50 text-sm uppercase tracking-widest font-body">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(248,248,252,0.3))",
        }}
      />
    </section>
  );
}
