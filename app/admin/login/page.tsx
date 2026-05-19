"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
        credentials: "same-origin",
      });

      if (res.ok) {
        const from = searchParams.get("from") || "/admin";
        router.push(from);
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Invalid code. Please try again.");
        setCode("");
        inputRef.current?.focus();
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(val);
    setError("");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(135deg, #00002a 0%, #000060 50%, #000080 100%)",
      }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative h-12 w-40">
            <Image
              src="/brand_assets/CNA Logo - White with Alpha Background.png"
              alt="CNA Lighting"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-sm shadow-[0_25px_80px_rgba(0,0,0,0.4)] p-8">
          <div className="mb-6">
            <h1 className="font-display font-black text-2xl text-[#000080] tracking-tight mb-1">
              Admin Access
            </h1>
            <p className="text-gray-400 text-sm">Enter the 6-digit code from Google Authenticator.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label htmlFor="code" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                Authenticator Code
              </label>
              <input
                ref={inputRef}
                id="code"
                type="text"
                inputMode="numeric"
                value={code}
                onChange={handleCodeChange}
                autoComplete="one-time-code"
                autoFocus
                required
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-sm text-2xl font-mono tracking-[0.5em] text-center focus:outline-none focus:border-[#000080] focus:ring-1 focus:ring-[#000080] transition-all"
                placeholder="000000"
              />
              <p className="text-xs text-gray-400 mt-1.5 text-center">Refreshes every 30 seconds</p>
            </div>

            {error && (
              <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-sm flex items-start gap-2">
                <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.07 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-red-600 text-xs">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full py-3 bg-[#000080] text-white font-bold text-sm uppercase tracking-wide rounded-sm hover:bg-[#0000a0] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-[0_4px_20px_rgba(0,0,128,0.4)]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying…
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          CNA Lighting Admin · Authorized access only
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
