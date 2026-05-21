import { NextRequest, NextResponse } from "next/server";

const ELIGIBLE_COUNTRIES = new Set(["CA", "US"]);

export async function GET(req: NextRequest) {
  const country = req.headers.get("x-vercel-ip-country") ?? "";
  // In local dev the header is absent — treat as eligible so the form is testable
  const eligible = country === "" || ELIGIBLE_COUNTRIES.has(country);
  return NextResponse.json({ eligible }, {
    headers: { "Cache-Control": "no-store" },
  });
}
