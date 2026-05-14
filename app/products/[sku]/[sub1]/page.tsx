"use client";

import { useParams } from "next/navigation";
import { Suspense } from "react";
import ProductsPageContent from "@/app/products/_content";

export default function SubCategoryPage() {
  const params = useParams();
  const mainSlug = decodeURIComponent(params?.sku as string || "");
  const sub1Slug = decodeURIComponent(params?.sub1 as string || "");

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8fc]">
        <div className="w-10 h-10 border-4 border-[#000080] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ProductsPageContent mainSlug={mainSlug} sub1Slug={sub1Slug} />
    </Suspense>
  );
}
