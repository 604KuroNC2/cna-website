import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import Papa from "papaparse";
import { buildCategoryTree } from "@/lib/parseProducts";
import { Product } from "@/lib/types";

export const revalidate = 3600;

export async function GET() {
  try {
    const csvPath = join(process.cwd(), "public", "data", "products.csv");
    const csvText = readFileSync(csvPath, "utf-8");

    const result = Papa.parse<Record<string, string>>(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
    });

    const products = result.data
      .map((row) => ({
        MainCategory: (row["MainCategory"] || "").trim(),
        SubCategory1: (row["SubCategory1"] || "").trim(),
        SubCategory2: (row["SubCategory2"] || "").trim(),
        post_title: (row["post_title"] || "").trim(),
      } as Product))
      .filter((p) => p.post_title && p.post_title !== "post_title");

    const categories = buildCategoryTree(products);

    return NextResponse.json({ categories }, {
      headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch (err) {
    console.error("Failed to build category tree:", err);
    return NextResponse.json({ categories: [] }, { status: 500 });
  }
}
