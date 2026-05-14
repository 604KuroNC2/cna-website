"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface InfoPageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function InfoPageLayout({ title, subtitle, children }: InfoPageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f8f8fc]">
      <Navbar />

      {/* Page header */}
      <div
        className="pt-20"
        style={{
          background: "linear-gradient(135deg, #00002a 0%, #000060 50%, #000080 100%)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#FFD700]" />
            <Link href="/" className="text-[#FFD700] text-xs font-medium uppercase tracking-[0.25em] hover:text-white transition-colors">
              CNA Lighting
            </Link>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 text-white/50 text-lg max-w-2xl">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="prose-cna">
          {children}
        </div>
      </div>

      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        .prose-cna h2 {
          font-family: var(--font-display, 'Barlow Condensed', sans-serif);
          font-weight: 800;
          font-size: 1.6rem;
          color: #000080;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #FFD700;
        }
        .prose-cna h3 {
          font-family: var(--font-display, 'Barlow Condensed', sans-serif);
          font-weight: 700;
          font-size: 1.2rem;
          color: #000080;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        .prose-cna p {
          color: #374151;
          line-height: 1.75;
          margin-bottom: 1rem;
        }
        .prose-cna ul, .prose-cna ol {
          color: #374151;
          line-height: 1.75;
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }
        .prose-cna li {
          margin-bottom: 0.4rem;
        }
        .prose-cna a {
          color: #000080;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .prose-cna a:hover {
          color: #0000c0;
        }
        .prose-cna table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }
        .prose-cna th {
          background: #000080;
          color: white;
          padding: 0.6rem 1rem;
          text-align: left;
          font-weight: 600;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .prose-cna td {
          padding: 0.6rem 1rem;
          border-bottom: 1px solid #e5e7eb;
          color: #374151;
          vertical-align: top;
        }
        .prose-cna tr:nth-child(even) td {
          background: #f9fafb;
        }
        .prose-cna .badge {
          display: inline-block;
          padding: 0.2rem 0.6rem;
          border-radius: 2px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .prose-cna .badge-gold {
          background: #FFD700;
          color: #000080;
        }
        .prose-cna .badge-blue {
          background: #000080;
          color: white;
        }
        .prose-cna .badge-gray {
          background: #e5e7eb;
          color: #374151;
        }
        .prose-cna .info-box {
          background: #eff6ff;
          border-left: 3px solid #000080;
          padding: 1rem 1.25rem;
          margin: 1.5rem 0;
          border-radius: 0 4px 4px 0;
        }
        .prose-cna .info-box p {
          margin: 0;
          font-size: 0.9rem;
          color: #1e3a8a;
        }
        .prose-cna .contact-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          padding: 1.5rem;
          margin-bottom: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .prose-cna .contact-card h3 {
          margin-top: 0;
          font-size: 1rem;
        }
        .prose-cna hr {
          border: none;
          border-top: 1px solid #e5e7eb;
          margin: 2rem 0;
        }
      `}} />
    </div>
  );
}
