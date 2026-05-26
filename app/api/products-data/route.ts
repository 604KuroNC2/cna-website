import { NextResponse } from "next/server";
import { fetchCatalogText } from "@/lib/catalogBlob";
import { parseProductsFromCSV } from "@/lib/parseProducts";

export const revalidate = 60;

export async function GET() {
  try {
    const csvText = await fetchCatalogText();
    const products = await parseProductsFromCSV(csvText);
    return NextResponse.json({ products }, {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (err) {
    console.error("Failed to load products:", err);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
