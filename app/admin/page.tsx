"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { parseProductsFromCSV, parseProductsFromXLSX } from "@/lib/parseProducts";
import { validateCatalogFile } from "@/lib/validateUpload";

const DEFAULT_SPECS = {
  "Wattage (W)": { label: "Wattage", visible: true, group: "Performance" },
  "Voltage (V)": { label: "Voltage", visible: true, group: "Performance" },
  "Lumens (lm)": { label: "Lumens", visible: true, group: "Performance" },
  Efficiency: { label: "Efficacy (lm/W)", visible: true, group: "Performance" },
  "L70 Rated Life (Hrs)": { label: "Rated Life (L70)", visible: true, group: "Performance" },
  "Bulb Equivalent": { label: "Replaces", visible: true, group: "Performance" },
  Base: { label: "Base Type", visible: true, group: "Performance" },
  "Colour Temperature": { label: "Colour Temperature", visible: true, group: "Performance" },
  "Beam Angle": { label: "Beam Angle", visible: true, group: "Performance" },
  CRI: { label: "CRI", visible: true, group: "Performance" },
  Dimmable: { label: "Dimmable", visible: true, group: "Performance" },
  "Operating Temperature": { label: "Operating Temperature", visible: true, group: "Ratings" },
  "Environmental Rating": { label: "Environmental Rating", visible: true, group: "Ratings" },
  Certifications: { label: "Certifications", visible: true, group: "Ratings" },
  "2-HR Fire Rating Compliance": { label: "2-HR Fire Rating", visible: true, group: "Ratings" },
  "Length (mm)": { label: "Length (mm)", visible: false, group: "Dimensions" },
  "Length (inches)": { label: "Length", visible: true, group: "Dimensions" },
  "Width (mm)": { label: "Width (mm)", visible: false, group: "Dimensions" },
  "Width (inches)": { label: "Width", visible: true, group: "Dimensions" },
  "Height (mm)": { label: "Height (mm)", visible: false, group: "Dimensions" },
  "Height (inches)": { label: "Height", visible: true, group: "Dimensions" },
  "Diameter (mm)": { label: "Diameter (mm)", visible: false, group: "Dimensions" },
  "Diameter (inches)": { label: "Diameter", visible: true, group: "Dimensions" },
  "Weight (g)": { label: "Weight (g)", visible: false, group: "Dimensions" },
  "Weight (lbs)": { label: "Weight (lbs)", visible: true, group: "Dimensions" },
  "Inside Diameter": { label: "Inside Diameter", visible: false, group: "Dimensions" },
  "Outside Diameter": { label: "Outside Diameter", visible: false, group: "Dimensions" },
  "Nominal Length": { label: "Nominal Length", visible: false, group: "Dimensions" },
  Shape: { label: "Shape / Type", visible: true, group: "Physical" },
  Finish: { label: "Finish", visible: true, group: "Physical" },
  "Dimmer Compatibility": { label: "Dimmer Compatibility", visible: true, group: "Physical" },
  Mounting: { label: "Mounting", visible: true, group: "Physical" },
  "Diffuser Type": { label: "Diffuser Type", visible: true, group: "Physical" },
  "Diffuser Material": { label: "Diffuser Material", visible: false, group: "Physical" },
  "Hole Size Cutout": { label: "Cutout Size", visible: true, group: "Physical" },
  "Flange Dimensions": { label: "Flange Dimensions", visible: false, group: "Physical" },
  "Recess Dimensions": { label: "Recess Depth", visible: false, group: "Physical" },
  "Rib-reinforced": { label: "Rib-Reinforced", visible: false, group: "Physical" },
  Warranty: { label: "Warranty", visible: true, group: "General" },
  "Direct Replacement For": { label: "Replaces (Direct)", visible: false, group: "General" },
  Use: { label: "Application", visible: true, group: "General" },
  "Surge Protection": { label: "Surge Protection", visible: false, group: "General" },
  "Optional Accessory": { label: "Optional Accessories", visible: false, group: "General" },
  "PIR Sensor": { label: "PIR Sensor", visible: false, group: "General" },
  "Auto Shut-off": { label: "Auto Shut-off", visible: false, group: "General" },
  Waterproofing: { label: "Waterproofing", visible: false, group: "General" },
  "LED Quantity": { label: "LED Quantity", visible: false, group: "Technical" },
  "LED Type": { label: "LED Type", visible: false, group: "Technical" },
  "Input Voltage (VAC)": { label: "Input Voltage", visible: false, group: "Technical" },
  "Current Draw": { label: "Current Draw", visible: false, group: "Technical" },
  "Output Voltage (VDC)": { label: "Output Voltage", visible: false, group: "Technical" },
  "Maximum Linkable Length": { label: "Max Linkable Length", visible: false, group: "Technical" },
  "Classification Type": { label: "Classification", visible: false, group: "Technical" },
  "Driver Dimensions (mm)": { label: "Driver Dimensions (mm)", visible: false, group: "Technical" },
  "DriverDimensions (Inches)": { label: "Driver Dimensions", visible: false, group: "Technical" },
};

const GROUP_ORDER = ["Performance", "Ratings", "Dimensions", "Physical", "General", "Technical"];
const GROUP_COLORS: Record<string, string> = {
  Performance: "bg-blue-50 border-blue-200",
  Ratings: "bg-green-50 border-green-200",
  Dimensions: "bg-purple-50 border-purple-200",
  Physical: "bg-orange-50 border-orange-200",
  General: "bg-gray-50 border-gray-200",
  Technical: "bg-red-50 border-red-200",
};
const GROUP_HEADER_COLORS: Record<string, string> = {
  Performance: "bg-blue-600",
  Ratings: "bg-green-600",
  Dimensions: "bg-purple-600",
  Physical: "bg-orange-600",
  General: "bg-gray-600",
  Technical: "bg-red-600",
};

type SpecEntry = { label: string; visible: boolean; group: string };
type SpecsConfig = Record<string, SpecEntry>;

export default function AdminPage() {
  const router = useRouter();
  const [specs, setSpecs] = useState<SpecsConfig>({});
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST", credentials: "same-origin" });
    router.push("/admin/login");
  };

  useEffect(() => {
    // Try to load from localStorage override first, then fall back to defaults
    const stored = localStorage.getItem("cna_spec_config");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSpecs(parsed);
        return;
      } catch {}
    }
    setSpecs(DEFAULT_SPECS as SpecsConfig);
  }, []);

  const toggle = (key: string) => {
    setSpecs((prev) => ({
      ...prev,
      [key]: { ...prev[key], visible: !prev[key].visible },
    }));
    setSaved(false);
  };

  const setGroupVisibility = (group: string, visible: boolean) => {
    setSpecs((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(next)) {
        if (next[key].group === group) {
          next[key] = { ...next[key], visible };
        }
      }
      return next;
    });
    setSaved(false);
  };

  const saveToLocalStorage = () => {
    localStorage.setItem("cna_spec_config", JSON.stringify(specs));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const resetToDefaults = () => {
    setSpecs(DEFAULT_SPECS as SpecsConfig);
    localStorage.removeItem("cna_spec_config");
    setSaved(false);
  };

  const exportJSON = () => {
    const config = {
      _comment:
        "Set 'visible' to true/false to control which specs appear on product pages. 'label' is the display name shown to users.",
      specs,
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spec-visibility.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyJSON = () => {
    const config = { _comment: "CNA spec visibility config", specs };
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = async (file: File) => {
    setUploadError("");
    setUploadSuccess(false);
    const validation = await validateCatalogFile(file);
    if (!validation.ok) {
      setUploadError(validation.error ?? "Invalid file.");
      return;
    }
    setUploadLoading(true);
    try {
      const nameLower = file.name.toLowerCase();
      if (nameLower.endsWith(".csv")) {
        const text = await file.text();
        const parsed = await parseProductsFromCSV(text);
        localStorage.setItem("cna_products_cache", text);
        localStorage.setItem("cna_products_cache_time", Date.now().toString());
        setUploadSuccess(true);
        setTimeout(() => { setUploadSuccess(false); setShowUpload(false); }, 2500);
        void parsed;
      } else if (nameLower.endsWith(".xlsx") || nameLower.endsWith(".xls")) {
        const parsed = await parseProductsFromXLSX(file);
        localStorage.setItem("cna_products_cache_time", "0");
        setUploadSuccess(true);
        setTimeout(() => { setUploadSuccess(false); setShowUpload(false); }, 2500);
        void parsed;
      }
    } catch (e) {
      console.error("Upload failed:", e);
      setUploadError("Failed to process file. Please check the format.");
    } finally {
      setUploadLoading(false);
    }
  };

  const grouped: Record<string, Array<[string, SpecEntry]>> = {};
  for (const [key, val] of Object.entries(specs)) {
    if (!grouped[val.group]) grouped[val.group] = [];
    grouped[val.group].push([key, val]);
  }

  const visibleCount = Object.values(specs).filter((s) => s.visible).length;
  const totalCount = Object.keys(specs).length;

  return (
    <div className="min-h-screen bg-[#f8f8fc]">
      <Navbar />

      <div
        className="pt-20"
        style={{ background: "linear-gradient(135deg, #00002a 0%, #000060 50%, #000080 100%)" }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-[#FFD700]" />
            <span className="text-[#FFD700] text-xs font-medium uppercase tracking-[0.25em]">
              Admin
            </span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight">
                SPEC VISIBILITY
              </h1>
              <p className="text-white/50 text-sm mt-2">
                Toggle which specifications appear on product pages.{" "}
                <span className="text-[#FFD700]">
                  {visibleCount} of {totalCount} specs visible
                </span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowUpload(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#FFD700] text-[#000080] text-xs font-bold uppercase tracking-wide rounded-sm hover:bg-[#FFE44D] transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Update Catalog
              </button>
              <Link
                href="/products"
                className="text-white/50 hover:text-white text-sm transition-colors flex items-center gap-1"
              >
                ← Back to catalog
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 border border-white/20 text-white/60 hover:text-white hover:border-white/40 text-xs font-medium uppercase tracking-wide rounded-sm transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action bar */}
        <div className="flex flex-wrap items-center gap-3 mb-8 p-4 bg-white rounded-sm border border-gray-100">
          <button
            onClick={saveToLocalStorage}
            className={`px-5 py-2.5 font-bold text-sm uppercase tracking-wide rounded-sm transition-all duration-200 ${
              saved
                ? "bg-green-600 text-white"
                : "bg-[#000080] text-white hover:bg-[#0000a0] hover:shadow-[0_4px_20px_rgba(0,0,128,0.3)]"
            }`}
          >
            {saved ? "✓ Saved" : "Save Changes"}
          </button>

          <button
            onClick={exportJSON}
            className="px-5 py-2.5 bg-[#FFD700] text-[#000080] font-bold text-sm uppercase tracking-wide rounded-sm hover:bg-[#FFE44D] transition-all"
          >
            Export JSON
          </button>

          <button
            onClick={copyJSON}
            className="px-5 py-2.5 border border-gray-200 text-gray-600 hover:border-[#000080]/30 hover:text-[#000080] font-medium text-sm rounded-sm transition-all"
          >
            {copied ? "✓ Copied!" : "Copy JSON"}
          </button>

          <button
            onClick={resetToDefaults}
            className="px-5 py-2.5 border border-gray-200 text-gray-400 hover:text-gray-600 font-medium text-sm rounded-sm transition-all ml-auto"
          >
            Reset to Defaults
          </button>
        </div>

        <div className="bg-[#000080]/06 rounded-sm p-4 mb-8 text-sm text-[#000080]">
          <strong>How this works:</strong> Changes are saved in your browser (localStorage) and
          applied immediately when browsing products. To make changes permanent across all
          browsers/devices, click <strong>Export JSON</strong> and replace the{" "}
          <code className="bg-[#000080]/10 px-1 rounded text-xs">spec-visibility.json</code> file
          in the project root, then restart the dev server.
        </div>

        {/* Spec groups */}
        <div className="space-y-6">
          {GROUP_ORDER.filter((g) => grouped[g]?.length).map((group) => {
            const groupSpecs = grouped[group];
            const allVisible = groupSpecs.every(([, v]) => v.visible);
            const noneVisible = groupSpecs.every(([, v]) => !v.visible);
            const visCount = groupSpecs.filter(([, v]) => v.visible).length;

            return (
              <div
                key={group}
                className={`rounded-sm border ${GROUP_COLORS[group]} overflow-hidden`}
              >
                {/* Group header */}
                <div className={`${GROUP_HEADER_COLORS[group]} px-5 py-3 flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <h2 className="font-display font-bold text-white text-lg uppercase tracking-wide">
                      {group}
                    </h2>
                    <span className="text-white/60 text-sm">
                      {visCount}/{groupSpecs.length} visible
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setGroupVisibility(group, true)}
                      disabled={allVisible}
                      className="px-3 py-1 bg-white/20 hover:bg-white/30 disabled:opacity-40 text-white text-xs font-medium rounded-sm transition-colors"
                    >
                      All On
                    </button>
                    <button
                      onClick={() => setGroupVisibility(group, false)}
                      disabled={noneVisible}
                      className="px-3 py-1 bg-white/20 hover:bg-white/30 disabled:opacity-40 text-white text-xs font-medium rounded-sm transition-colors"
                    >
                      All Off
                    </button>
                  </div>
                </div>

                {/* Spec rows */}
                <div className="divide-y divide-white/50 bg-white/50">
                  {groupSpecs.map(([key, spec]) => (
                    <label
                      key={key}
                      className="flex items-center justify-between px-5 py-3 cursor-pointer hover:bg-white/60 transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-gray-800 text-sm group-hover:text-[#000080] transition-colors">
                          {spec.label}
                        </span>
                        <span className="ml-2 text-gray-400 text-xs">({key})</span>
                      </div>

                      {/* Toggle switch */}
                      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                        <span className={`text-xs font-medium ${spec.visible ? "text-green-600" : "text-gray-400"}`}>
                          {spec.visible ? "Visible" : "Hidden"}
                        </span>
                        <div
                          onClick={() => toggle(key)}
                          className={`relative w-10 h-5 rounded-full transition-colors duration-200 cursor-pointer ${
                            spec.visible ? "bg-[#000080]" : "bg-gray-200"
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                              spec.visible ? "translate-x-5" : "translate-x-0.5"
                            }`}
                          />
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom instructions */}
        <div className="mt-10 p-6 bg-white rounded-sm border border-gray-100">
          <h3 className="font-display font-bold text-lg text-[#000080] mb-3">
            Making Changes Permanent
          </h3>
          <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
            <li>Toggle the specs you want visible/hidden above</li>
            <li>
              Click <strong>Export JSON</strong> to download the updated{" "}
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">spec-visibility.json</code>
            </li>
            <li>
              Replace the existing{" "}
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">spec-visibility.json</code> in
              the project root folder with the downloaded file
            </li>
            <li>Restart the dev server — changes apply immediately</li>
          </ol>
          <p className="mt-4 text-xs text-gray-400">
            Note: The <strong>Save Changes</strong> button saves to your browser only. Use{" "}
            <strong>Export JSON</strong> for permanent changes that work for all users.
          </p>
        </div>
      </div>

      {/* Upload Catalog modal */}
      {showUpload && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && setShowUpload(false)}
        >
          <div className="bg-white rounded-sm w-full max-w-md shadow-[0_25px_80px_rgba(0,0,0,0.3)] p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-2xl text-[#000080]">Update Product Catalog</h2>
              <button onClick={() => setShowUpload(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {uploadSuccess ? (
              <div className="py-10 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-bold text-[#000080] text-lg">Catalog Updated!</p>
                <p className="text-gray-500 text-sm mt-1">Reload the products page to see changes.</p>
              </div>
            ) : (
              <>
                <div
                  className={`border-2 border-dashed rounded-sm p-10 text-center cursor-pointer transition-colors duration-200 ${
                    dragOver ? "border-[#000080] bg-[#000080]/05" : "border-gray-200 hover:border-[#000080]/40"
                  } ${uploadLoading ? "opacity-50 pointer-events-none" : ""}`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    const file = e.dataTransfer.files[0];
                    if (file) handleFileUpload(file);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploadLoading ? (
                    <div className="w-10 h-10 border-4 border-[#000080] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  ) : (
                    <svg className="w-12 h-12 mx-auto mb-4 text-[#000080]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  )}
                  <p className="text-gray-600 font-medium mb-1">
                    {uploadLoading ? "Processing..." : "Drop your file here"}
                  </p>
                  {!uploadLoading && <p className="text-gray-400 text-sm">or click to browse</p>}
                  <p className="text-gray-300 text-xs mt-3">Supports .csv and .xlsx files</p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />

                {uploadError && (
                  <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-sm flex items-start gap-2">
                    <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.07 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <p className="text-red-600 text-xs">{uploadError}</p>
                  </div>
                )}

                <div className="mt-6 p-4 bg-[#000080]/[0.04] rounded-sm">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    <strong className="text-[#000080]">CSV format:</strong> Must match the CNA product catalog column headers.
                    Upload a new file to replace the current product database. The catalog will reload automatically.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
