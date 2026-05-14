"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import ProductsPageContent from "@/app/products/_content";

export default function CategoryOrProductPage() {
  const params = useParams();
  const router = useRouter();
  const slug = decodeURIComponent(params?.sku as string || "");

  // Numeric-only slug = old SKU URL → redirect to permanent /products/p/[sku]
  useEffect(() => {
    if (/^\d+$/.test(slug)) {
      router.replace(`/products/p/${encodeURIComponent(slug)}`);
    }
  }, [slug, router]);

  if (/^\d+$/.test(slug)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8fc]">
        <div className="w-10 h-10 border-4 border-[#000080] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8fc]">
        <div className="w-10 h-10 border-4 border-[#000080] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ProductsPageContent mainSlug={slug} />
    </Suspense>
  );
}
