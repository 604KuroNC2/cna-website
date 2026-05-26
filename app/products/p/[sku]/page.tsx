"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { parseProductsFromCSV } from "@/lib/parseProducts";
import { getProductSpecs, groupSpecsByCategory, getVisibleSpecs } from "@/lib/specConfig";
import { Product, SpecConfig } from "@/lib/types";
import { toBlobShortUrl } from "@/lib/blobUrl";

const GROUP_ORDER = ["Performance", "Ratings", "Dimensions", "Physical", "General", "Technical"];
const GROUP_ICONS: Record<string, string> = {
  Performance: "⚡",
  Ratings: "✅",
  Dimensions: "📐",
  Physical: "🔧",
  General: "ℹ️",
  Technical: "⚙️",
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [specConfig, setSpecConfig] = useState<Record<string, SpecConfig> | undefined>(undefined);
  const imageRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const specsRef = useRef<HTMLDivElement>(null);

  const sku = decodeURIComponent(params?.sku as string || "");

  // Load spec config from localStorage override if present
  useEffect(() => {
    const stored = localStorage.getItem("cna_spec_config");
    if (stored) {
      try { setSpecConfig(JSON.parse(stored) as Record<string, SpecConfig>); } catch {}
    }
  }, []);

  const findProduct = useCallback(async () => {
    try {
      // Check cache first
      const cached = localStorage.getItem("cna_products_cache_v6");
      let csvText = cached;

      if (!csvText) {
        const res = await fetch("/data/products.csv");
        if (!res.ok) throw new Error("CSV not found");
        csvText = await res.text();
        localStorage.setItem("cna_products_cache_v6", csvText);
        localStorage.setItem("cna_products_cache_time_v6", Date.now().toString());
      }

      const products = await parseProductsFromCSV(csvText!);
      const found = products.find(
        (p) => p.SKU === sku || p.SKU.trim() === sku.trim()
      );
      setProduct(found || null);

      if (found) {
        const rel = products
          .filter(
            (p) =>
              p.SKU !== found.SKU &&
              p.SubCategory1 === found.SubCategory1 &&
              p.SubCategory2 !== found.SubCategory2
          )
          .slice(0, 4);
        setRelated(rel);
      }
    } catch (e) {
      console.error("Failed to load product:", e);
    } finally {
      setLoading(false);
    }
  }, [sku]);

  useEffect(() => {
    findProduct();
  }, [findProduct]);

  useEffect(() => {
    if (!product || loading) return;

    const tl = gsap.timeline({ delay: 0.1 });
    tl.fromTo(imageRef.current,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.7, ease: "power3.out", clearProps: "all" }
    );
    tl.fromTo(infoRef.current,
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, duration: 0.7, ease: "power3.out", clearProps: "all" },
      "<"
    );
    tl.fromTo(specsRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", clearProps: "all" },
      "-=0.3"
    );
    tl.fromTo(".spec-group",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: "power2.out", clearProps: "all" },
      "-=0.2"
    );
  }, [product, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f8fc]">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#000080] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f8f8fc]">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="font-display font-bold text-3xl text-[#000080] mb-4">Product Not Found</h2>
            <p className="text-gray-500 mb-6">The product &ldquo;{sku}&rdquo; could not be found.</p>
            <Link href="/products" className="px-6 py-3 bg-[#000080] text-white rounded-sm text-sm font-medium hover:bg-[#0000a0] transition-colors">
              Back to Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const specs = getProductSpecs(product, specConfig);
  const grouped = groupSpecsByCategory(specs);

  return (
    <div className="min-h-screen bg-[#f8f8fc]">
      <Navbar />

      {/* Breadcrumb */}
      <div
        className="pt-36"
        style={{ background: "linear-gradient(135deg, #00002a 0%, #000060 50%, #000080 100%)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs text-white/50">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-white transition-colors">Products</Link>
            <span>/</span>
            {product.SubCategory1 && (
              <>
                <Link href={`/products?sub1=${encodeURIComponent(product.SubCategory1)}`} className="hover:text-white transition-colors">
                  {product.SubCategory1}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-white/80">{product.post_title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Product hero grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Image */}
          <div ref={imageRef} className="bg-white rounded-sm border border-gray-100 p-8 flex items-center justify-center min-h-[360px] relative group">
            {product.image && !imgError ? (
              <img
                src={toBlobShortUrl(product.image)}
                alt={product.post_title}
                className="max-h-80 max-w-full object-contain"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="text-center text-gray-300">
                <svg className="w-24 h-24 mx-auto mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m2-6h10m-2 0h4a2 2 0 012 2v4M9 3v4m0 0H5m4 0h10m-4 0v4m4-4v4m0 0H9m10 0H5m10 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V11m10 10H5" />
                </svg>
                <p className="text-sm">{product.SubCategory2}</p>
              </div>
            )}

            {/* Certifications overlay */}
            {product.Certifications && (
              <div className="absolute bottom-4 left-4 flex gap-2">
                {product.Certifications.split(/[,\s]+/).filter(c => c.trim().length > 2).map((cert, i) => (
                  <span key={i} className="px-2 py-1 bg-[#000080]/08 text-[#000080] text-[10px] font-bold uppercase rounded-sm">
                    {cert.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div ref={infoRef}>
            <div className="mb-2">
              <span className="text-xs text-gray-400 uppercase tracking-widest">SKU: {product.SKU}</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-[#000080] leading-tight mb-2">
              {product.post_title}
            </h1>
            {product.Model && (
              <p className="text-gray-500 text-sm mb-4">Model: {product.Model}</p>
            )}

            {/* Key specs quick view */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {[
                { label: "Wattage", value: product["Wattage (W)"] },
                { label: "Lumens", value: product["Lumens (lm)"] },
                { label: "CCT", value: product["Colour Temperature"] },
                { label: "CRI", value: product["CRI"] },
                { label: "Base", value: product["Base"] },
                { label: "Dimmable", value: product["Dimmable"] },
              ]
                .filter((s) => s.value && s.value.trim())
                .map((s) => (
                  <div key={s.label} className="bg-white border border-gray-100 rounded-sm p-3">
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">{s.label}</div>
                    <div className="font-display font-semibold text-[#000080] text-sm leading-tight">{s.value}</div>
                  </div>
                ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-6">
              {product.specSheetLink && (
                <a
                  href={toBlobShortUrl(product.specSheetLink)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFD700] text-[#000080] font-bold text-sm uppercase tracking-wide rounded-sm hover:bg-[#FFE44D] transition-all duration-200 hover:shadow-[0_4px_20px_rgba(255,215,0,0.4)]"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Spec Sheet
                </a>
              )}
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 border border-[#000080]/20 text-[#000080] font-medium text-sm rounded-sm hover:bg-[#000080] hover:text-white transition-all duration-200"
              >
                ← Back to Catalog
              </Link>
            </div>

            {/* Warranty & certs */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 pt-4 border-t border-gray-100">
              {product.Warranty && (
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#000080]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  {product.Warranty} Warranty
                </span>
              )}
              {product["L70 Rated Life (Hrs)"] && (
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#000080]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {product["L70 Rated Life (Hrs)"]} L70 Life
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Specs table */}
        {specs.length > 0 && (
          <div ref={specsRef} className="mb-16">
            <h2 className="font-display font-black text-3xl text-[#000080] mb-6">
              SPECIFICATIONS
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {GROUP_ORDER.filter((g) => grouped[g]?.length).map((group) => (
                <div key={group} className="spec-group bg-white rounded-sm border border-gray-100 overflow-hidden">
                  <div className="px-5 py-3 bg-[#000080] flex items-center gap-2">
                    <span className="text-base">{GROUP_ICONS[group]}</span>
                    <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider">
                      {group}
                    </h3>
                  </div>
                  <table className="w-full text-sm">
                    <tbody>
                      {grouped[group].map((spec, i) => (
                        <tr key={spec.key} className={`spec-row ${i % 2 === 1 ? "bg-[#000080]/02" : ""}`}>
                          <td className="px-5 py-2.5 text-gray-500 font-medium w-1/2 border-b border-gray-50">
                            {spec.label}
                          </td>
                          <td className="px-5 py-2.5 text-[#000080] font-semibold border-b border-gray-50">
                            {spec.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <h2 className="font-display font-black text-3xl text-[#000080] mb-6">
              RELATED PRODUCTS
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((p, i) => (
                <Link
                  key={p.SKU}
                  href={`/products/p/${encodeURIComponent(p.SKU)}`}
                  className="group bg-white rounded-sm border border-gray-100 hover:border-[#000080]/20 p-4 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,128,0.08)]"
                >
                  {p.image && (
                    <div className="h-32 flex items-center justify-center mb-3">
                      <img
                        src={toBlobShortUrl(p.image)}
                        alt={p.post_title}
                        className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    </div>
                  )}
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">SKU: {p.SKU}</p>
                  <h4 className="font-display font-semibold text-[#000080] text-sm leading-tight line-clamp-2">
                    {p.post_title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
