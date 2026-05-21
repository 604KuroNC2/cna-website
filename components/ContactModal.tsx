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
  email: string;
  subject: string;
  message: string;
}

export default function ContactModal() {
  const [eligible, setEligible] = useState<boolean | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>({ name: "", company: "", email: "", subject: "", message: "" });
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
    setForm({ name: "", company: "", email: "", subject: "", message: "" });
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
                        className="w-full px-3 py-2.5 border border-white/15 text-white text-sm rounded-sm focus:outline-none focus:border-[#FFD700] transition-colors placeholder-white/25"
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
                        className="w-full px-3 py-2.5 border border-white/15 text-white text-sm rounded-sm focus:outline-none focus:border-[#FFD700] transition-colors placeholder-white/25"
                        placeholder="Optional"
                        style={{ background: "rgba(255,255,255,0.06)" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/60 text-xs uppercase tracking-widest mb-1.5">Email *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-white/15 text-white text-sm rounded-sm focus:outline-none focus:border-[#FFD700] transition-colors placeholder-white/25"
                      placeholder="your@email.com"
                      style={{ background: "rgba(255,255,255,0.06)" }}
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 text-xs uppercase tracking-widest mb-1.5">Subject *</label>
                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-white/15 text-white text-sm rounded-sm focus:outline-none focus:border-[#FFD700] transition-colors placeholder-white/25"
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
                      className="w-full px-3 py-2.5 border border-white/15 text-white text-sm rounded-sm focus:outline-none focus:border-[#FFD700] transition-colors placeholder-white/25 resize-none"
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
