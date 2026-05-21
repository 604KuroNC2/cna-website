"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { toBlobShortUrl } from "@/lib/blobUrl";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const keySpecs = [
    product["Wattage (W)"],
    product["Lumens (lm)"],
    product["Colour Temperature"],
  ].filter(Boolean);

  const encodedSku = encodeURIComponent(product.SKU);

  return (
    <div ref={cardRef} className="product-card group bg-white rounded-sm overflow-hidden border border-gray-100 hover:border-[#000080]/20">
      {/* Image area */}
      <Link href={`/products/p/${encodedSku}`} className="block">
        <div className="relative h-48 sm:h-52 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          {product.image ? (
            <img
              src={toBlobShortUrl(product.image)}
              alt={product.post_title}
              className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
              loading={index < 8 ? "eager" : "lazy"}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://placehold.co/400x300/f8f8fc/000080?text=${encodeURIComponent(product.SubCategory2 || "LED")}`;
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 opacity-20">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
                    <path d="M9 18V5l12-2v13" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="6" cy="18" r="3"/>
                    <circle cx="18" cy="16" r="3"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-400">{product.SubCategory2 || "LED Product"}</span>
              </div>
            </div>
          )}

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2 py-0.5 bg-[#000080]/90 text-white text-[10px] font-medium uppercase tracking-wide rounded-sm">
              {product.SubCategory1}
            </span>
          </div>

          {/* Dimmable badge */}
          {product.Dimmable?.toLowerCase() === "yes" && (
            <div className="absolute top-3 right-3">
              <span className="px-2 py-0.5 bg-[#FFD700] text-[#000080] text-[10px] font-bold uppercase tracking-wide rounded-sm">
                Dim
              </span>
            </div>
          )}

          {/* Gold accent line on hover */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FFD700] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        </div>

        {/* Card body */}
        <div className="p-4">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-medium">
            SKU: {product.SKU}
          </p>
          <h3 className="font-display font-semibold text-[#000080] text-base leading-tight mb-3 line-clamp-2 group-hover:text-[#0000a0] transition-colors">
            {product.post_title}
          </h3>

          {/* Key specs row */}
          {keySpecs.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {keySpecs.map((spec, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-[#000080]/06 text-[#000080] text-[11px] rounded-sm font-medium"
                >
                  {spec}
                </span>
              ))}
            </div>
          )}

          {/* CTA row */}
          <div className="flex items-center justify-end pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              {product.specSheetLink && (
                <a
                  href={toBlobShortUrl(product.specSheetLink)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 text-gray-400 hover:text-[#000080] transition-colors"
                  title="Download Spec Sheet"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </a>
              )}
              <span className="inline-flex items-center gap-1 text-xs font-medium text-[#000080] group-hover:text-[#0000c0] transition-colors">
                Details
                <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
