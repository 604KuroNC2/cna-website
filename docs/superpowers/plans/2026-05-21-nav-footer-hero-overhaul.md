# Nav / Footer / Hero Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the flat navbar with category dropdowns, add a geo-gated reCAPTCHA contact form in the footer, remove two hero stats, and remove the product page sidebar.

**Architecture:** Four independent changes to existing components, plus three new API routes (`/api/geo`, `/api/categories`, `/api/contact`) and one new component (`ContactModal`). The Navbar fetches `/api/categories` on mount to populate dropdowns. The Footer's `ContactButton` fetches `/api/geo` on mount; only renders when visitor is in CA or US.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, GSAP, Resend (email), Google reCAPTCHA v3, papaparse (CSV parsing, already installed)

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `app/api/geo/route.ts` | Create | Return `{ eligible: boolean }` from Vercel IP header |
| `app/api/categories/route.ts` | Create | Read CSV, return `CategoryTree[]` JSON |
| `app/api/contact/route.ts` | Create | Verify reCAPTCHA + send email via Resend |
| `components/ContactModal.tsx` | Create | Geo-gated contact icon + modal form with reCAPTCHA |
| `components/Hero.tsx` | Modify | Remove 2 stats from the bottom strip |
| `components/Footer.tsx` | Modify | Replace email link with `<ContactModal />` |
| `components/Navbar.tsx` | Modify | Replace flat links with category dropdowns |
| `app/products/_content.tsx` | Modify | Remove sidebar, make grid full-width |
| `.env.local` | Modify | Add `RECAPTCHA_SECRET_KEY` and `RESEND_API_KEY` |

---

## Task 1: Install Resend + add env vars

**Files:**
- Modify: `.env.local`

- [ ] **Step 1: Install resend package**

```bash
cd /Users/allan/cna-website && npm install resend
```

Expected output: `added 1 package` (or similar)

- [ ] **Step 2: Add env vars to `.env.local`**

Open `.env.local` and append these two lines (existing vars stay untouched):

```
RECAPTCHA_SECRET_KEY="6LekQvUsAAAAABlAY6rxvQ0ZtVGXF4yk0TThMWxi"
RESEND_API_KEY="re_2FPFxP2b_JmrX3u6TRv6rjWhnxWpY8icG"
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install resend for transactional email"
```

---

## Task 2: Hero — remove two stats

**Files:**
- Modify: `components/Hero.tsx:258-273`

The stats array on lines 258-273 has four items. Remove the last two.

- [ ] **Step 1: Edit Hero.tsx stats array**

Find this block in `components/Hero.tsx`:

```tsx
          {[
            { value: "500+", label: "LED Products" },
            { value: `${Math.floor((Date.now() - new Date("1988-03-01").getTime()) / (365.25 * 24 * 60 * 60 * 1000))}+`, label: "Years Experience" },
            { value: "cUL / cETLus / cTUVus", label: "Certified" },
            { value: "2–5yr", label: "Warranty" },
          ].map((stat) => (
```

Replace with:

```tsx
          {[
            { value: "500+", label: "LED Products" },
            { value: `${Math.floor((Date.now() - new Date("1988-03-01").getTime()) / (365.25 * 24 * 60 * 60 * 1000))}+`, label: "Years Experience" },
          ].map((stat) => (
```

Also update the grid columns class from `grid-cols-2 md:grid-cols-4` to `grid-cols-2` on the containing div (line ~257):

Find:
```tsx
        <div className="mt-20 pt-12 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8">
```

Replace with:
```tsx
        <div className="mt-20 pt-12 border-t border-white/10 grid grid-cols-2 gap-8 max-w-sm">
```

- [ ] **Step 2: Verify build compiles**

```bash
cd /Users/allan/cna-website && npm run build 2>&1 | tail -20
```

Expected: no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat: remove certification and warranty stats from hero"
```

---

## Task 3: `/api/geo` route

**Files:**
- Create: `app/api/geo/route.ts`

- [ ] **Step 1: Create the route**

```typescript
// app/api/geo/route.ts
import { NextRequest, NextResponse } from "next/server";

const ELIGIBLE_COUNTRIES = new Set(["CA", "US"]);

export async function GET(req: NextRequest) {
  const country = req.headers.get("x-vercel-ip-country") ?? "";
  // In local dev the header is absent — treat as eligible
  const eligible = country === "" || ELIGIBLE_COUNTRIES.has(country);
  return NextResponse.json({ eligible }, {
    headers: { "Cache-Control": "no-store" },
  });
}
```

- [ ] **Step 2: Verify build compiles**

```bash
cd /Users/allan/cna-website && npm run build 2>&1 | tail -20
```

Expected: no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add app/api/geo/route.ts
git commit -m "feat: add /api/geo route for CA/US eligibility check"
```

---

## Task 4: `/api/categories` route

**Files:**
- Create: `app/api/categories/route.ts`

This route reads the CSV from disk (server-side) and returns the category tree. It uses papaparse (already installed) to parse the CSV, then `buildCategoryTree` from `lib/parseProducts`.

- [ ] **Step 1: Create the route**

```typescript
// app/api/categories/route.ts
import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import Papa from "papaparse";
import { buildCategoryTree } from "@/lib/parseProducts";
import { Product } from "@/lib/types";

export const revalidate = 3600; // ISR-style: re-read CSV at most once per hour

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
```

- [ ] **Step 2: Verify build compiles**

```bash
cd /Users/allan/cna-website && npm run build 2>&1 | tail -20
```

Expected: no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add app/api/categories/route.ts
git commit -m "feat: add /api/categories route for server-side category tree"
```

---

## Task 5: `/api/contact` route

**Files:**
- Create: `app/api/contact/route.ts`

This route:
1. Validates required fields (name, subject, message, token)
2. Verifies the reCAPTCHA v3 token with Google (score ≥ 0.5)
3. Sends the message via Resend to `orders@cnalighting.com`

The destination email (`orders@cnalighting.com`) is **never sent to the client**.

- [ ] **Step 1: Create the route**

```typescript
// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY!;
const TO_EMAIL = "orders@cnalighting.com";
const FROM_EMAIL = "CNA Lighting Website <noreply@cnalighting.com>";

async function verifyRecaptcha(token: string): Promise<boolean> {
  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${RECAPTCHA_SECRET}&response=${token}`,
  });
  const data = await res.json();
  return data.success === true && (data.score ?? 0) >= 0.5;
}

export async function POST(req: NextRequest) {
  let body: { name?: string; company?: string; subject?: string; message?: string; token?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, company, subject, message, token } = body;

  if (!name?.trim() || !subject?.trim() || !message?.trim() || !token?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const isHuman = await verifyRecaptcha(token);
  if (!isHuman) {
    return NextResponse.json({ error: "reCAPTCHA verification failed" }, { status: 403 });
  }

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    subject: `Website Contact: ${subject}`,
    text: [
      `Name: ${name}`,
      company ? `Company: ${company}` : "",
      `Subject: ${subject}`,
      "",
      message,
    ].filter(Boolean).join("\n"),
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 2: Verify build compiles**

```bash
cd /Users/allan/cna-website && npm run build 2>&1 | tail -20
```

Expected: no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add app/api/contact/route.ts
git commit -m "feat: add /api/contact route with reCAPTCHA v3 + Resend email"
```

---

## Task 6: ContactModal component + Footer update

**Files:**
- Create: `components/ContactModal.tsx`
- Modify: `components/Footer.tsx`

The `ContactModal` component:
- Calls `/api/geo` on mount; renders nothing until eligible is confirmed
- Renders an envelope icon + "Contact Us" label when eligible
- Clicking opens a dark-overlay modal with the contact form
- On submit: loads reCAPTCHA v3 script (if not already loaded), executes `grecaptcha.execute(siteKey, { action: 'contact_form' })`, POSTs to `/api/contact`
- Shows success/error states inside the modal

In `Footer.tsx`: remove the `<a href="mailto:info@cnalighting.com">` block and replace with `<ContactModal />`.

- [ ] **Step 1: Create `components/ContactModal.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

const RECAPTCHA_SITE_KEY = "6LekQvUsAAAAALli4977KhIWo3hWC27T800_pfHO";

function loadRecaptcha(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve();
    if ((window as any).grecaptcha) return resolve();
    const existing = document.getElementById("recaptcha-script");
    if (existing) {
      existing.addEventListener("load", () => resolve());
      return;
    }
    const script = document.createElement("script");
    script.id = "recaptcha-script";
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

async function getRecaptchaToken(action: string): Promise<string> {
  await loadRecaptcha();
  return new Promise((resolve, reject) => {
    (window as any).grecaptcha.ready(() => {
      (window as any).grecaptcha.execute(RECAPTCHA_SITE_KEY, { action }).then(resolve).catch(reject);
    });
  });
}

interface FormState {
  name: string;
  company: string;
  subject: string;
  message: string;
}

export default function ContactModal() {
  const [eligible, setEligible] = useState<boolean | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>({ name: "", company: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/geo")
      .then((r) => r.json())
      .then((d) => setEligible(d.eligible === true))
      .catch(() => setEligible(false));
  }, []);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    try {
      const token = await getRecaptchaToken("contact_form");
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, token }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Failed to send");
      }
      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setStatus("idle");
    setErrorMsg("");
    setForm({ name: "", company: "", subject: "", message: "" });
  };

  if (eligible === null || eligible === false) return null;

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-white/50 hover:text-[#FFD700] transition-colors duration-200 group"
        aria-label="Open contact form"
      >
        <svg className="w-4 h-4 flex-shrink-0 text-[#FFD700]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span className="text-sm">Contact Us</span>
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,20,0.85)", backdropFilter: "blur(6px)" }}
          onClick={(e) => { if (e.target === overlayRef.current) handleClose(); }}
        >
          <div
            className="relative w-full max-w-lg rounded-sm overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #00002a 0%, #000060 100%)",
              border: "1px solid rgba(255,215,0,0.2)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
            }}
          >
            {/* Gold top bar */}
            <div className="h-0.5 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />

            <div className="p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="font-display font-black text-2xl text-white tracking-tight">Contact Us</h2>
                  <p className="text-white/40 text-sm mt-1">We&rsquo;ll get back to you within one business day.</p>
                </div>
                <button
                  onClick={handleClose}
                  className="text-white/40 hover:text-white transition-colors p-1 -mt-1 -mr-1"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {status === "success" ? (
                <div className="text-center py-10">
                  <div className="w-14 h-14 rounded-full bg-[#FFD700]/10 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-[#FFD700]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-white font-semibold text-lg mb-2">Message Sent</p>
                  <p className="text-white/50 text-sm">Thank you for reaching out. We&rsquo;ll be in touch soon.</p>
                  <button
                    onClick={handleClose}
                    className="mt-6 px-6 py-2.5 bg-[#FFD700] text-[#000080] font-bold text-sm uppercase tracking-wide rounded-sm hover:bg-[#FFE44D] transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/60 text-xs uppercase tracking-widest mb-1.5">Name *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        className="w-full px-3 py-2.5 bg-white/08 border border-white/15 text-white text-sm rounded-sm focus:outline-none focus:border-[#FFD700] transition-colors placeholder-white/25"
                        placeholder="Your name"
                        style={{ background: "rgba(255,255,255,0.06)" }}
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 text-xs uppercase tracking-widest mb-1.5">Company</label>
                      <input
                        type="text"
                        value={form.company}
                        onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                        className="w-full px-3 py-2.5 bg-white/08 border border-white/15 text-white text-sm rounded-sm focus:outline-none focus:border-[#FFD700] transition-colors placeholder-white/25"
                        placeholder="Optional"
                        style={{ background: "rgba(255,255,255,0.06)" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/60 text-xs uppercase tracking-widest mb-1.5">Subject *</label>
                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-white/08 border border-white/15 text-white text-sm rounded-sm focus:outline-none focus:border-[#FFD700] transition-colors placeholder-white/25"
                      placeholder="What is this about?"
                      style={{ background: "rgba(255,255,255,0.06)" }}
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 text-xs uppercase tracking-widest mb-1.5">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-white/08 border border-white/15 text-white text-sm rounded-sm focus:outline-none focus:border-[#FFD700] transition-colors placeholder-white/25 resize-none"
                      placeholder="Your message..."
                      style={{ background: "rgba(255,255,255,0.06)" }}
                    />
                  </div>

                  {status === "error" && (
                    <p className="text-red-400 text-xs">{errorMsg}</p>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-white/25 text-xs">Protected by reCAPTCHA</p>
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="px-6 py-2.5 bg-[#FFD700] text-[#000080] font-bold text-sm uppercase tracking-wide rounded-sm hover:bg-[#FFE44D] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {status === "submitting" ? "Sending…" : "Send Message"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: Update `components/Footer.tsx`**

Add the import at the top (after existing imports):
```tsx
import ContactModal from "@/components/ContactModal";
```

Find and remove the entire email `<div>` block:
```tsx
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 mt-0.5 text-[#FFD700] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@cnalighting.com" className="hover:text-[#FFD700] transition-colors">
                  info@cnalighting.com
                </a>
              </div>
```

Replace with:
```tsx
              <div className="flex items-start gap-3">
                <ContactModal />
              </div>
```

- [ ] **Step 3: Verify build compiles**

```bash
cd /Users/allan/cna-website && npm run build 2>&1 | tail -20
```

Expected: no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add components/ContactModal.tsx components/Footer.tsx
git commit -m "feat: add geo-gated contact form with reCAPTCHA v3 to footer"
```

---

## Task 7: Navbar — category dropdowns

**Files:**
- Modify: `components/Navbar.tsx`

Replace the 4 flat nav links and "Browse Catalog" button with category dropdowns. The Navbar fetches `/api/categories` on mount. Each main category is a desktop dropdown trigger (hover to open); click navigates to `/products/[slug]`. Subcategory items navigate to `/products/[main-slug]/[sub1-slug]`. Mobile uses an accordion within the hamburger panel.

- [ ] **Step 1: Replace `components/Navbar.tsx` entirely**

```tsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { CategoryTree } from "@/lib/types";
import { toSlug } from "@/lib/slugs";

export default function Navbar() {
  const [categories, setCategories] = useState<CategoryTree[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const logo = logoRef.current;
    const links = linksRef.current ? Array.from(linksRef.current.children) : [];
    const anim1 = gsap.fromTo(logo,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.7, ease: "power3.out", delay: 0.1, clearProps: "all" }
    );
    const anim2 = gsap.fromTo(links,
      { opacity: 0, y: -12 },
      { opacity: 1, y: 0, stagger: 0.05, duration: 0.5, ease: "power2.out", delay: 0.2, clearProps: "all" }
    );
    return () => { anim1.kill(); anim2.kill(); };
  }, [categories]);

  const handleMouseEnter = useCallback((name: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveDropdown(name);
  }, []);

  const handleMouseLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 120);
  }, []);

  const navigateTo = useCallback((path: string) => {
    setActiveDropdown(null);
    setMobileOpen(false);
    router.push(path);
  }, [router]);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
      style={{
        background: "linear-gradient(135deg, rgba(0,0,42,0.92) 0%, rgba(0,0,96,0.92) 35%, rgba(0,0,128,0.92) 65%, rgba(0,0,160,0.92) 100%)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div ref={logoRef}>
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-10 w-32">
                <Image
                  src="/brand_assets/CNA Logo - White with Alpha Background.png"
                  alt="CNA Lighting"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop nav */}
          <div ref={linksRef} className="hidden md:flex items-center gap-0.5">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="relative"
                onMouseEnter={() => handleMouseEnter(cat.name)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => navigateTo(`/products/${toSlug(cat.name)}`)}
                  className="relative px-3 py-2 text-xs font-medium tracking-wide uppercase text-white/80 hover:text-white transition-colors duration-200 flex items-center gap-1 group"
                >
                  {cat.name}
                  <svg
                    className={`w-3 h-3 opacity-50 transition-transform duration-200 ${activeDropdown === cat.name ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#FFD700] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </button>

                {/* Dropdown */}
                {activeDropdown === cat.name && cat.subcategories.length > 0 && (
                  <div
                    className="absolute top-full left-0 pt-1 z-50"
                    onMouseEnter={() => handleMouseEnter(cat.name)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div
                      className="min-w-[200px] rounded-sm overflow-hidden"
                      style={{
                        background: "linear-gradient(135deg, #00002a 0%, #000060 100%)",
                        border: "1px solid rgba(255,215,0,0.15)",
                        boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                      }}
                    >
                      <div className="h-0.5 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />
                      <div className="py-1.5">
                        {cat.subcategories.map((sub) => (
                          <button
                            key={sub.name}
                            onClick={() => navigateTo(`/products/${toSlug(cat.name)}/${toSlug(sub.name)}`)}
                            className="w-full text-left px-4 py-2 text-xs text-white/70 hover:text-[#FFD700] hover:bg-white/05 transition-colors duration-150"
                          >
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"} bg-[#000050]/98 backdrop-blur-md overflow-y-auto`}
      >
        <div className="px-4 py-3 flex flex-col gap-0.5">
          {categories.map((cat) => (
            <div key={cat.name}>
              <div className="flex items-center">
                <button
                  onClick={() => navigateTo(`/products/${toSlug(cat.name)}`)}
                  className="flex-1 text-left px-4 py-3 text-white/80 hover:text-white font-medium uppercase tracking-wide text-sm transition-colors"
                >
                  {cat.name}
                </button>
                {cat.subcategories.length > 0 && (
                  <button
                    onClick={() => setExpandedMobile(expandedMobile === cat.name ? null : cat.name)}
                    className="px-3 py-3 text-white/50 hover:text-[#FFD700] transition-colors"
                    aria-label={`Expand ${cat.name}`}
                  >
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${expandedMobile === cat.name ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}
              </div>

              {expandedMobile === cat.name && (
                <div className="ml-4 border-l border-white/10 pl-3 pb-1">
                  {cat.subcategories.map((sub) => (
                    <button
                      key={sub.name}
                      onClick={() => navigateTo(`/products/${toSlug(cat.name)}/${toSlug(sub.name)}`)}
                      className="w-full text-left px-3 py-2 text-white/60 hover:text-[#FFD700] text-xs uppercase tracking-wide transition-colors"
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Verify build compiles**

```bash
cd /Users/allan/cna-website && npm run build 2>&1 | tail -20
```

Expected: no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add components/Navbar.tsx
git commit -m "feat: replace nav links with category dropdowns"
```

---

## Task 8: Product page — remove sidebar

**Files:**
- Modify: `app/products/_content.tsx`

Remove `CategorySidebar`, its container div, and the "Clear all filters" button below it. Keep the breadcrumb. Add a lightweight "Clear filters" chip inline above the grid when filters are active. Move results count next to the breadcrumb. The grid container changes from `flex-col lg:flex-row gap-8` to just `w-full`.

- [ ] **Step 1: Remove sidebar import and component from `_content.tsx`**

Remove this import line (around line 10):
```tsx
import CategorySidebar from "@/components/CategorySidebar";
```

Find the entire sidebar container block and replace the layout. Replace:
```tsx
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-60 xl:w-64 flex-shrink-0">
            <div className="sticky top-24">
              {!loading && (
                <CategorySidebar
                  categories={categories}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearAll={handleClearAll}
                  totalCount={products.length}
                  filteredCount={filtered.length}
                />
              )}

              {activeFiltersCount > 0 && (
                <button
                  onClick={handleClearAll}
                  className="mt-4 w-full text-center text-xs text-[#000080] hover:text-[#0000c0] font-medium py-2 border border-[#000080]/20 rounded-sm hover:border-[#000080]/40 transition-all"
                >
                  Clear all filters ({activeFiltersCount})
                </button>
              )}
            </div>
          </div>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
```

With:
```tsx
        <div>
          {/* Product grid */}
          <div className="w-full">
```

- [ ] **Step 2: Add inline clear-filters chip to the breadcrumb area**

Find the existing breadcrumb block (starts around "Breadcrumb" comment). Replace the entire breadcrumb section:

```tsx
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
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#000080] border border-[#000080]/20 rounded-sm hover:border-[#000080]/40 hover:bg-[#000080]/05 transition-all font-medium"
                  >
                    Clear filters ({activeFiltersCount})
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            )}
```

- [ ] **Step 3: Close the removed outer div**

The outer `flex flex-col lg:flex-row` div had two children (sidebar + grid). The grid's closing `</div>` was for `flex-1 min-w-0`. Now find the end of the component's main content area and ensure the two removed `</div>` tags (sidebar container + flex row) are collapsed into the single `<div>` and `</div>` from step 1.

The structure after the edit should be:
```tsx
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
          {/* Product grid */}
          <div className="w-full">
            {/* breadcrumb ... */}
            {/* loading / empty / grid ... */}
          </div>
        </div>
      </div>
```

- [ ] **Step 4: Verify build compiles**

```bash
cd /Users/allan/cna-website && npm run build 2>&1 | tail -20
```

Expected: no TypeScript errors. You may also see a warning that `CategorySidebar` is no longer imported anywhere — that's fine, the file can stay.

- [ ] **Step 5: Commit**

```bash
git add app/products/_content.tsx
git commit -m "feat: remove product page sidebar, nav handles category filtering"
```

---

## Task 9: Final verification

- [ ] **Step 1: Run dev server and smoke-test all changes**

```bash
cd /Users/allan/cna-website && npm run dev
```

Check:
1. **Home page**: stats bar shows only "500+" and "X+ Years Experience"
2. **Navbar**: category dropdowns appear on desktop (hover to open); hamburger accordion on mobile
3. **Products page**: no sidebar; grid is full-width; breadcrumb + "Clear filters" chip appear when a category is active
4. **Footer**: `info@cnalighting.com` is gone; "Contact Us" icon/button appears (in dev it defaults to eligible)
5. **Contact modal**: opens on click, form submits (reCAPTCHA fires), success message appears

- [ ] **Step 2: Push to remote**

```bash
git push
```

---

## Notes

- **Resend domain verification:** The FROM address `noreply@cnalighting.com` requires `cnalighting.com` to be a verified domain in your Resend account (Resend → Domains). Until verified, Resend will reject sends from that address. Temporary workaround: change `FROM_EMAIL` in `app/api/contact/route.ts` to `"CNA Lighting <onboarding@resend.dev>"` — this works without domain verification but will show Resend's domain in the sender.
- **reCAPTCHA badge:** Google's reCAPTCHA v3 renders a floating badge in the bottom-right corner. If you want to hide it, add `.grecaptcha-badge { visibility: hidden; }` to `globals.css` and add the required reCAPTCHA disclosure text to the form (already included as "Protected by reCAPTCHA").
- **Geo header in dev:** `x-vercel-ip-country` is only set by Vercel's edge network — it won't be present in `npm run dev`. The `/api/geo` route treats an absent header as eligible, so the contact button will always be visible locally.
