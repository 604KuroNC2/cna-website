"use client";

import { useEffect, useRef, useState } from "react";
import { CategoryTree } from "@/lib/types";

interface Filters {
  mainCategory: string;
  subCategory1: string;
  subCategory2: string;
}

interface CategorySidebarProps {
  categories: CategoryTree[];
  filters: Filters;
  onFilterChange: (filters: Partial<Filters>) => void;
  onClearAll: () => void;
  totalCount: number;
  filteredCount: number;
}

export default function CategorySidebar({
  categories,
  filters,
  onFilterChange,
  onClearAll,
  totalCount,
  filteredCount,
}: CategorySidebarProps) {
  const [expandedMain, setExpandedMain] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sync expanded state with active filters (e.g. when navigating from a permalink)
  useEffect(() => {
    if (filters.mainCategory) {
      setExpandedMain(filters.mainCategory);
    }
  }, [filters.mainCategory]);

  const handleMainClick = (name: string) => {
    const isExpanding = expandedMain !== name;
    setExpandedMain(isExpanding ? name : null);
    onClearAll();
    if (isExpanding) {
      onFilterChange({ mainCategory: name, subCategory1: "", subCategory2: "" });
    }
  };

  const handleSub1Click = (mainName: string, sub1Name: string) => {
    const isSelecting = !(filters.subCategory1 === sub1Name && filters.mainCategory === mainName);
    onClearAll();
    if (isSelecting) {
      onFilterChange({ mainCategory: mainName, subCategory1: sub1Name, subCategory2: "" });
    } else {
      onFilterChange({ mainCategory: mainName, subCategory1: "", subCategory2: "" });
    }
  };

  return (
    <aside className="w-full">
      {/* Results count */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Results</div>
        <div className="font-display font-bold text-2xl text-[#000080]">
          {filteredCount.toLocaleString()}
          <span className="text-sm font-normal text-gray-400 ml-1">/ {totalCount}</span>
        </div>
      </div>

      {/* All products */}
      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          setExpandedMain(null);
          setExpandedSub(null);
          onClearAll();
        }}
        className={`w-full text-left px-3 py-2 rounded-sm text-sm font-medium mb-2 transition-colors ${
          !filters.mainCategory && !filters.subCategory1
            ? "bg-[#000080] text-white"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        All Products
      </button>

      {/* Scrollable category tree */}
      <div
        ref={scrollRef}
        className="space-y-1 overflow-y-hidden hover:overflow-y-auto transition-all"
        style={{ maxHeight: "calc(100vh - 18rem)" }}
        onMouseEnter={() => { if (scrollRef.current) scrollRef.current.style.overflowY = "auto"; }}
        onMouseLeave={() => { if (scrollRef.current) scrollRef.current.style.overflowY = "hidden"; }}
      >
        {categories.map((main) => (
          <div key={main.name}>
            {/* Main category */}
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleMainClick(main.name)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-sm text-sm font-semibold transition-colors ${
                filters.mainCategory === main.name
                  ? "text-[#000080] bg-[#000080]/08"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="flex items-center gap-2 text-left">
                <svg
                  className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${
                    expandedMain === main.name ? "rotate-90" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                {main.name}
              </span>
            </button>

            {/* Subcategory 1 */}
            {expandedMain === main.name && (
              <div className="ml-4 mt-1 space-y-0.5 border-l border-gray-200 pl-3">
                {main.subcategories.map((sub1) => (
                    <div key={sub1.name}>
                      <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSub1Click(main.name, sub1.name)}
                        className={`w-full text-left px-2 py-1.5 rounded-sm text-xs font-medium transition-colors leading-tight ${
                          filters.subCategory1 === sub1.name && filters.mainCategory === main.name
                            ? "text-[#000080] bg-[#000080]/08"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {sub1.name}
                      </button>
                    </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
