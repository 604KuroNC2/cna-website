import Papa from "papaparse";
import { Product } from "./types";

const CSV_HEADERS = [
  "MainCategory", "SubCategory1", "SubCategory2", "category", "menu_order",
  "Model", "SKU:sku", "post_title", "post_content",
  "Images/Gallery", "Spec Sheet", "Spec Sheet Link", "product_type",
  "product_visibility", "Inventory: stock",
  "Wattage (W)", "Voltage (V)", "Lumens (lm)", "Efficiency",
  "L70 Rated Life (Hrs)", "Bulb Equivalent", "Base", "Colour Temperature",
  "Beam Angle", "CRI", "Dimmable", "Operating Temperature",
  "Environmental Rating", "Certifications", "2-HR Fire Rating Compliance",
  "Nominal Length", "Length (mm)", "Length (inches)", "Length",
  "Width (mm)", "Width (inches)", "Height", "Height (mm)", "Height (inches)",
  "Diameter (mm)", "Diameter (inches)", "Diameter",
  "Weight (g)", "Weight (lbs)", "Inside Diameter", "Outside Diameter",
  "Shape", "Warranty", "Inner Carton Qty", "Outer Carton Qty",
  "Box Length (cm)", "Box Width (cm)", "Box Height (cm)", "Box CBM", "Box CFT",
  "Carton Weight (lbs)", "Carton Length (inches)", "Carton Width (inches)",
  "Carton Height (inches)", "Carton CFT", "CARTON CBM",
  "Driver Dimensions (mm)", "DriverDimensions (Inches)",
  "Hole Size Cutout", "Dimmer Compatibility", "Finish", "Direct Replacement For",
  "Use", "Surge Protection", "Diffuser Type", "Diffuser Material",
  "Optional Accessory", "Mounting", "Flange Dimensions", "Recess Dimensions",
  "Rib-reinforced", "PIR Sensor", "Auto Shut-off", "Waterproofing",
  "LED Quantity", "LED Type", "Input Voltage (VAC)", "Current Draw",
  "Output Voltage (VDC)", "Dimensions (without tabs)", "Maximum Linkable Length",
  "Classification Type",
];

function cleanDegree(val: string): string {
  return val.trim().replace(/�/g, "°");
}

function cleanValue(val: string): string {
  return val
    .trim()
    .replace(/\?\s*(?=\d)/g, "≥ "); // literal "?" before digits (corrupted ≥)
}

function normalizeRow(row: Record<string, string>): Product {
  return {
    MainCategory: (row["MainCategory"] || "").trim(),
    SubCategory1: (row["SubCategory1"] || "").trim(),
    SubCategory2: (row["SubCategory2"] || "").trim(),
    category: (row["category"] || "").trim(),
    menu_order: (row["menu_order"] || "").trim(),
    Model: (row["Model"] || "").trim(),
    SKU: (row["SKU:sku"] || "").trim(),
    post_title: (row["post_title"] || "").trim(),
    post_content: (row["post_content"] || "").trim(),
    image: (row["Images/Gallery"] || "").trim(),
    specSheet: (row["Spec Sheet"] || "").trim(),
    specSheetLink: (row["Spec Sheet Link"] || "").trim(),
    "Wattage (W)": (row["Wattage (W)"] || "").trim(),
    "Voltage (V)": (row["Voltage (V)"] || "").trim(),
    "Lumens (lm)": (row["Lumens (lm)"] || "").trim(),
    Efficiency: (row["Efficiency"] || "").trim(),
    "L70 Rated Life (Hrs)": (row["L70 Rated Life (Hrs)"] || "").trim(),
    "Bulb Equivalent": (row["Bulb Equivalent"] || "").trim(),
    Base: (row["Base"] || "").trim(),
    "Colour Temperature": (row["Colour Temperature"] || "").trim(),
    "Beam Angle": cleanDegree(row["Beam Angle"] || ""),
    CRI: cleanValue(row["CRI"] || ""),
    Dimmable: (row["Dimmable"] || "").trim(),
    "Operating Temperature": cleanDegree(row["Operating Temperature"] || ""),
    "Environmental Rating": (row["Environmental Rating"] || "").trim(),
    Certifications: (row["Certifications"] || "").trim(),
    "2-HR Fire Rating Compliance": (row["2-HR Fire Rating Compliance"] || "").trim(),
    "Nominal Length": (row["Nominal Length"] || "").trim(),
    "Length (mm)": (row["Length (mm)"] || "").trim(),
    "Length (inches)": (row["Length (inches)"] || "").trim(),
    Length: (row["Length"] || "").trim(),
    "Width (mm)": (row["Width (mm)"] || "").trim(),
    "Width (inches)": (row["Width (inches)"] || "").trim(),
    Height: (row["Height"] || "").trim(),
    "Height (mm)": (row["Height (mm)"] || "").trim(),
    "Height (inches)": (row["Height (inches)"] || "").trim(),
    "Diameter (mm)": (row["Diameter (mm)"] || "").trim(),
    "Diameter (inches)": (row["Diameter (inches)"] || "").trim(),
    Diameter: (row["Diameter"] || "").trim(),
    "Weight (g)": (row["Weight (g)"] || "").trim(),
    "Weight (lbs)": (row["Weight (lbs)"] || "").trim(),
    "Inside Diameter": (row["Inside Diameter"] || "").trim(),
    "Outside Diameter": (row["Outside Diameter"] || "").trim(),
    Shape: (row["Shape"] || "").trim(),
    Warranty: (row["Warranty"] || "").trim(),
    "Inner Carton Qty": (row["Inner Carton Qty"] || "").trim(),
    "Outer Carton Qty": (row["Outer Carton Qty"] || "").trim(),
    Finish: (row["Finish"] || "").trim(),
    "Direct Replacement For": (row["Direct Replacement For"] || "").trim(),
    Use: (row["Use"] || "").trim(),
    "Surge Protection": (row["Surge Protection"] || "").trim(),
    "Diffuser Type": (row["Diffuser Type"] || "").trim(),
    "Diffuser Material": (row["Diffuser Material"] || "").trim(),
    "Optional Accessory": (row["Optional Accessory"] || "").trim(),
    Mounting: (row["Mounting"] || "").trim(),
    "Flange Dimensions": (row["Flange Dimensions"] || "").trim(),
    "Recess Dimensions": (row["Recess Dimensions"] || "").trim(),
    "Rib-reinforced": (row["Rib-reinforced"] || "").trim(),
    "PIR Sensor": (row["PIR Sensor"] || "").trim(),
    "Auto Shut-off": (row["Auto Shut-off"] || "").trim(),
    Waterproofing: (row["Waterproofing"] || "").trim(),
    "LED Quantity": (row["LED Quantity"] || "").trim(),
    "LED Type": (row["LED Type"] || "").trim(),
    "Input Voltage (VAC)": (row["Input Voltage (VAC)"] || "").trim(),
    "Current Draw": (row["Current Draw"] || "").trim(),
    "Output Voltage (VDC)": (row["Output Voltage (VDC)"] || "").trim(),
    "Hole Size Cutout": (row["Hole Size Cutout"] || "").trim(),
    "Dimmer Compatibility": (row["Dimmer Compatibility"] || "").trim(),
    "Dimensions (without tabs)": (row["Dimensions (without tabs)"] || "").trim(),
    "Maximum Linkable Length": (row["Maximum Linkable Length"] || "").trim(),
    "Classification Type": (row["Classification Type"] || "").trim(),
    "Driver Dimensions (mm)": (row["Driver Dimensions (mm)"] || "").trim(),
    "DriverDimensions (Inches)": (row["DriverDimensions (Inches)"] || "").trim(),
  };
}

export async function parseProductsFromCSV(csvText: string): Promise<Product[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        const products = results.data
          .map(normalizeRow)
          .filter((p) => p.post_title && p.post_title !== "post_title");
        resolve(products);
      },
      error: reject,
    });
  });
}

export async function parseProductsFromXLSX(file: File): Promise<Product[]> {
  const XLSX = await import("xlsx");
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, {
    defval: "",
    raw: false,
  });
  return rows.map(normalizeRow).filter((p) => p.post_title);
}

export function buildCategoryTree(products: Product[]) {
  const tree: Record<string, Record<string, Set<string>>> = {};
  const counts: Record<string, Record<string, number>> = {};

  for (const p of products) {
    const main = p.MainCategory || "Other";
    const sub1 = p.SubCategory1 || "General";
    const sub2 = p.SubCategory2 || "";

    if (!tree[main]) tree[main] = {};
    if (!tree[main][sub1]) tree[main][sub1] = new Set();
    if (!counts[main]) counts[main] = {};
    if (!counts[main][sub1]) counts[main][sub1] = 0;
    counts[main][sub1]++;
    if (sub2) tree[main][sub1].add(sub2);
  }

  return Object.entries(tree).map(([mainCat, subs]) => ({
    name: mainCat,
    count: Object.values(counts[mainCat] || {}).reduce((a, b) => a + b, 0),
    subcategories: Object.entries(subs).map(([sub1, sub2set]) => ({
      name: sub1,
      count: counts[mainCat]?.[sub1] || 0,
      subcategories: Array.from(sub2set),
    })),
  }));
}

const SPEC_SEARCH_FIELDS: (keyof Product)[] = [
  "post_title", "Model", "SKU", "SubCategory2", "SubCategory1",
  "Wattage (W)", "Voltage (V)", "Lumens (lm)", "Efficiency",
  "L70 Rated Life (Hrs)", "Base", "Colour Temperature", "Beam Angle",
  "CRI", "Dimmable", "Operating Temperature", "Environmental Rating",
  "Certifications", "Shape", "Finish", "Mounting", "Use",
  "Dimmer Compatibility", "Diffuser Type", "Warranty",
];

export function filterProducts(
  products: Product[],
  filters: {
    search?: string;
    mainCategory?: string;
    subCategory1?: string;
    subCategory2?: string;
    cct?: string;
  }
): Product[] {
  return products.filter((p) => {
    if (filters.mainCategory && p.MainCategory !== filters.mainCategory) return false;
    if (filters.subCategory1 && p.SubCategory1 !== filters.subCategory1) return false;
    if (filters.subCategory2 && p.SubCategory2 !== filters.subCategory2) return false;
    if (filters.cct && normalizeCCT(p["Colour Temperature"] || "") !== normalizeCCT(filters.cct)) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      return SPEC_SEARCH_FIELDS.some((field) =>
        (p[field] as string || "").toLowerCase().includes(q)
      );
    }
    return true;
  });
}

const CCT_EXCLUDE = new Set(["2000K", "2900K", "4200K"]);

function normalizeCCT(val: string): string {
  return val.trim().replace(/\s+/g, " ");
}

export function getUniqueCCTs(products: Product[]): string[] {
  const ccts = new Set<string>();
  for (const p of products) {
    const val = normalizeCCT(p["Colour Temperature"] || "");
    if (val && !CCT_EXCLUDE.has(val)) ccts.add(val);
  }
  return Array.from(ccts).sort((a, b) => {
    const numA = parseInt(a) || 0;
    const numB = parseInt(b) || 0;
    return numA - numB;
  });
}
