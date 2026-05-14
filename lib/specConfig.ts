import specVisibilityData from "@/spec-visibility.json";
import { Product, SpecConfig } from "./types";

export function getVisibleSpecs(): Record<string, SpecConfig> {
  return specVisibilityData.specs as Record<string, SpecConfig>;
}

export function getProductSpecs(
  product: Product,
  specs?: Record<string, SpecConfig>
): Array<{ key: string; label: string; value: string; group: string }> {
  const config = specs || getVisibleSpecs();
  const result: Array<{ key: string; label: string; value: string; group: string }> = [];

  for (const [key, spec] of Object.entries(config)) {
    if (!spec.visible) continue;
    const value = (product[key] || "").trim();
    // Skip blank values
    if (!value || value === "0" || value === "  " || value.match(/^\s*$/)) continue;
    result.push({ key, label: spec.label, value, group: spec.group });
  }

  return result;
}

export function groupSpecsByCategory(
  specs: Array<{ key: string; label: string; value: string; group: string }>
): Record<string, Array<{ key: string; label: string; value: string }>> {
  const grouped: Record<string, Array<{ key: string; label: string; value: string }>> = {};
  for (const spec of specs) {
    if (!grouped[spec.group]) grouped[spec.group] = [];
    grouped[spec.group].push({ key: spec.key, label: spec.label, value: spec.value });
  }
  return grouped;
}
