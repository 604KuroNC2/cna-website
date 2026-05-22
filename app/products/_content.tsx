"use client";

import { useEffect, useRef, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { parseProductsFromCSV, buildCategoryTree, filterProducts, getUniqueCCTs } from "@/lib/parseProducts";
import { Product, CategoryTree } from "@/lib/types";
import { toSlug } from "@/lib/slugs";

gsap.registerPlugin(ScrollTrigger);

const PAGE_SIZE = 24;

type ViewMode = "desktop" | "mobile";

interface ProductsPageContentProps {
  mainSlug?: string;
  sub1Slug?: string;
}

function ProductsContent({ mainSlug, sub1Slug }: ProductsPageContentProps) {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryTree[]>([]);
  const [cctOptions, setCctOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [slugResolved, setSlugResolved] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");
  const [filters, setFilters] = useState({
    mainCategory: searchParams.get("main") || searchParams.get("cat") || "",
    subCategory1: searchParams.get("sub1") || "",
    subCategory2: searchParams.get("sub2") || "",
    cct: searchParams.get("cct") || "",
  });
  const gridRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const lastAnimatedCountRef = useRef(0);

  // Detect initial view mode from screen width
  useEffect(() => {
    const detect = () => {
      setViewMode(window.innerWidth < 768 ? "mobile" : "desktop");
    };
    detect();
    window.addEventListener("resize", detect);
    return () => window.removeEventListener("resize", detect);
  }, []);

  // Update URL bar when category filters change
  useEffect(() => {
    if (typeof window === "undefined") return;
    let url = "/products";
    if (filters.mainCategory) {
      url += "/" + toSlug(filters.mainCategory);
      if (filters.subCategory1) {
        url += "/" + toSlug(filters.subCategory1);
      }
    }
    window.history.replaceState(null, "", url);
  }, [filters.mainCategory, filters.subCategory1]);

  // Load products from CSV
  const loadProducts = useCallback(async (csvText: string) => {
    try {
      const parsed = await parseProductsFromCSV(csvText);
      setProducts(parsed);
      setCategories(buildCategoryTree(parsed));
      setCctOptions(getUniqueCCTs(parsed));
      localStorage.setItem("cna_products_cache_v6", csvText);
      localStorage.setItem("cna_products_cache_time_v6", Date.now().toString());
    } catch (e) {
      console.error("Failed to parse products:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const cached = localStorage.getItem("cna_products_cache_v6");
    const cacheTime = localStorage.getItem("cna_products_cache_time_v6");
    const ONE_HOUR = 60 * 60 * 1000;

    if (cached && cacheTime && Date.now() - parseInt(cacheTime) < ONE_HOUR) {
      loadProducts(cached);
      return;
    }

    fetch("/data/products.csv")
      .then((r) => {
        if (!r.ok) throw new Error("CSV not found");
        return r.text();
      })
      .then(loadProducts)
      .catch((err) => {
        console.error("Failed to load products CSV:", err);
        setLoading(false);
      });
  }, [loadProducts]);

  // Resolve URL slugs to actual category names once products are loaded
  useEffect(() => {
    if (slugResolved) return;
    if (!mainSlug && !sub1Slug) { setSlugResolved(true); return; }
    if (products.length === 0) return;

    const allMains = [...new Set(products.map((p) => p.MainCategory))];
    const matchedMain = mainSlug ? allMains.find((m) => toSlug(m) === mainSlug) : undefined;

    if (matchedMain) {
      const allSubs = [...new Set(
        products.filter((p) => p.MainCategory === matchedMain).map((p) => p.SubCategory1)
      )];
      const matchedSub = sub1Slug ? allSubs.find((s) => toSlug(s) === sub1Slug) : undefined;
      setFilters((prev) => ({
        ...prev,
        mainCategory: matchedMain,
        subCategory1: matchedSub || "",
      }));
    } else if (mainSlug) {
      const allSubs = [...new Set(products.map((p) => p.SubCategory1))];
      const matchedSub = allSubs.find((s) => toSlug(s) === mainSlug);
      if (matchedSub) {
        setFilters((prev) => ({ ...prev, subCategory1: matchedSub }));
      }
    }

    setSlugResolved(true);
  }, [products, mainSlug, sub1Slug, slugResolved]);

  // Apply filters
  useEffect(() => {
    const result = filterProducts(products, { ...filters, search });
    setFiltered(result);
    setPage(1);
  }, [products, filters, search]);

  // GSAP card animations — only animate newly added cards
  useEffect(() => {
    if (!gridRef.current || loading) return;
    const cards = Array.from(gridRef.current.querySelectorAll<HTMLDivElement>(".product-card-wrap"));
    // When filter/search resets page to 1, reset animation counter
    if (page === 1) lastAnimatedCountRef.current = 0;
    const newCards = cards.slice(lastAnimatedCountRef.current);
    if (newCards.length === 0) return;
    gsap.fromTo(
      newCards,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.04, duration: 0.5, ease: "power3.out", clearProps: "all" }
    );
    lastAnimatedCountRef.current = cards.length;
  }, [filtered, page, loading]);

  const paged = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paged.length < filtered.length;

  // Infinite scroll — load next page when sentinel enters viewport
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect(); // prevent double-firing before next render
          setPage((p) => p + 1);
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, paged.length]);

  // Page header entrance
  useEffect(() => {
    const anim = gsap.fromTo(headerRef.current,
      { y: -10 },
      { y: 0, duration: 0.6, ease: "power3.out", clearProps: "transform" }
    );
    return () => { anim.kill(); };
  }, []);

  // Clear all filters and search, scroll to top
  const handleClearAll = useCallback(() => {
    setSearch("");
    setFilters({ mainCategory: "", subCategory1: "", subCategory2: "", cct: "" });
    mainRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleFilterChange = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    // Scroll product area to top
    mainRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // When search changes, clear all category filters so search starts fresh
  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (value.trim()) {
      setFilters({ mainCategory: "", subCategory1: "", subCategory2: "", cct: "" });
    }
  };

  const activeFiltersCount = [
    filters.mainCategory,
    filters.subCategory1,
    filters.subCategory2,
    filters.cct,
    search,
  ].filter(Boolean).length;

  // Grid columns based on view mode
  const gridClass = viewMode === "mobile"
    ? "grid-cols-1 sm:grid-cols-2"
    : "grid-cols-2 md:grid-cols-3 xl:grid-cols-4";

  return (
    <div className="min-h-screen bg-[#f8f8fc]">
      <Navbar />

      {/* Page header */}
      <div
        ref={headerRef}
        className="pt-20 pb-0"
        style={{
          background: "linear-gradient(135deg, #00002a 0%, #000060 50%, #000080 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-[#FFD700]" />
            <span className="text-[#FFD700] text-xs font-medium uppercase tracking-[0.25em]">
              Product Catalog
            </span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h1 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight">
              LED PRODUCT CATALOG
            </h1>

            <div className="flex items-center gap-3">
              {/* Desktop/Mobile toggle */}
              <div className="flex items-center gap-1 border border-white/20 rounded-sm p-0.5">
                <button
                  onClick={() => setViewMode("desktop")}
                  title="Desktop view (4 columns)"
                  className={`p-2 rounded-sm transition-all duration-200 ${
                    viewMode === "desktop"
                      ? "bg-[#FFD700] text-[#000080]"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <rect x="2" y="3" width="20" height="14" rx="1" strokeLinecap="round" strokeLinejoin="round" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8M12 17v4" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("mobile")}
                  title="Mobile view (2 columns)"
                  className={`p-2 rounded-sm transition-all duration-200 ${
                    viewMode === "mobile"
                      ? "bg-[#FFD700] text-[#000080]"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <rect x="7" y="2" width="10" height="20" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01" />
                  </svg>
                </button>
              </div>

            </div>
          </div>

          {/* Search + CCT filter row */}
          <div className="mt-6 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[260px] max-w-xl">
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search products, specs, SKUs, base type..."
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/40 text-sm rounded-sm focus:outline-none focus:border-[#FFD700] focus:bg-white/15 transition-all"
              />
              <svg
                className="absolute left-3 top-3.5 w-4 h-4 text-white/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-3 text-white/40 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* CCT filter */}
            {cctOptions.length > 0 && (
              <div className="relative">
                <select
                  value={filters.cct}
                  onChange={(e) => setFilters((prev) => ({ ...prev, cct: e.target.value }))}
                  className="appearance-none pl-4 pr-9 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm rounded-sm focus:outline-none focus:border-[#FFD700] transition-all cursor-pointer min-w-[140px]"
                  style={{ colorScheme: "dark" }}
                >
                  <option value="" style={{ background: "#000060" }}>All CCT</option>
                  {cctOptions.map((cct) => (
                    <option key={cct} value={cct} style={{ background: "#000060" }}>{cct}</option>
                  ))}
                </select>
                <svg className="absolute right-2.5 top-3.5 w-4 h-4 text-white/50 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            )}

            {filters.cct && (
              <button
                onClick={() => setFilters((prev) => ({ ...prev, cct: "" }))}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#FFD700] text-[#000080] text-xs font-bold rounded-sm"
              >
                {filters.cct}
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Scroll anchor for "back to top of results" */}
      <div ref={mainRef} />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
          {/* Product grid */}
          <div className="w-full">
            {/* Breadcrumb + clear filters */}
            {(filters.mainCategory || filters.subCategory1 || filters.subCategory2 || activeFiltersCount > 0) && (
              <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <button onMouseDown={(e) => e.preventDefault()} onClick={handleClearAll} className="hover:text-[#000080]">
                    All
                  </button>
                  {filters.mainCategory && (
                    <>
                      <span className="text-gray-300">/</span>
                      <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleFilterChange({ subCategory1: "", subCategory2: "" })}
                        className="hover:text-[#000080]"
                      >
                        {filters.mainCategory}
                      </button>
                    </>
                  )}
                  {filters.subCategory1 && (
                    <>
                      <span className="text-gray-300">/</span>
                      <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleFilterChange({ subCategory2: "" })}
                        className="hover:text-[#000080]"
                      >
                        {filters.subCategory1}
                      </button>
                    </>
                  )}
                  {filters.subCategory2 && (
                    <>
                      <span className="text-gray-300">/</span>
                      <span className="text-[#000080] font-medium">{filters.subCategory2}</span>
                    </>
                  )}
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#000080] border border-[#000080]/20 rounded-sm hover:border-[#000080]/40 hover:bg-[#000080]/5 transition-all font-medium"
                  >
                    Clear filters ({activeFiltersCount})
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            )}

            {loading ? (
              <div className={`grid gap-4 ${gridClass}`}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-sm h-72 animate-pulse border border-gray-100">
                    <div className="h-48 bg-gray-100 rounded-t-sm" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-gray-100 rounded w-1/3" />
                      <div className="h-4 bg-gray-100 rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">💡</div>
                <h3 className="font-display font-bold text-2xl text-[#000080] mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search or filters.</p>
                <button
                  onClick={handleClearAll}
                  className="px-6 py-3 bg-[#000080] text-white text-sm font-medium rounded-sm hover:bg-[#0000a0] transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div ref={gridRef} className={`grid gap-4 ${gridClass}`}>
                  {paged.map((product, i) => (
                    <div key={`${product.SKU}-${i}`} className="product-card-wrap">
                      <ProductCard product={product} index={i} />
                    </div>
                  ))}
                </div>

                {/* Infinite scroll sentinel */}
                <div ref={sentinelRef} className="h-4 mt-6" />
                {hasMore && (
                  <div className="flex justify-center py-4">
                    <div className="w-7 h-7 border-2 border-[#000080]/30 border-t-[#000080] rounded-full animate-spin" />
                  </div>
                )}

                <p className="text-center text-xs text-gray-400 mt-2 pb-2">
                  {filtered.length} products
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function ProductsPageContent({ mainSlug, sub1Slug }: ProductsPageContentProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8f8fc] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#000080] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading products...</p>
        </div>
      </div>
    }>
      <ProductsContent mainSlug={mainSlug} sub1Slug={sub1Slug} />
    </Suspense>
  );
}
