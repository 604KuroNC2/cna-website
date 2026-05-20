export interface Product {
  MainCategory: string;
  SubCategory1: string;
  SubCategory2: string;
  category: string;
  menu_order: string;
  Model: string;
  SKU: string;
  post_title: string;
  post_content: string;
  image: string;
  specSheet: string;
  specSheetLink: string;
  // Performance specs
  "Wattage (W)": string;
  "Voltage (V)": string;
  "Lumens (lm)": string;
  Efficiency: string;
  "L70 Rated Life (Hrs)": string;
  "Bulb Equivalent": string;
  Base: string;
  "Colour Temperature": string;
  "Beam Angle": string;
  CRI: string;
  Dimmable: string;
  "Operating Temperature": string;
  "Environmental Rating": string;
  Certifications: string;
  "2-HR Fire Rating Compliance": string;
  // Dimensions
  "Nominal Length": string;
  "Length (mm)": string;
  "Length (inches)": string;
  Length: string;
  "Width (mm)": string;
  "Width (inches)": string;
  Height: string;
  "Height (mm)": string;
  "Height (inches)": string;
  "Diameter (mm)": string;
  "Diameter (inches)": string;
  Diameter: string;
  "Weight (g)": string;
  "Weight (lbs)": string;
  "Inside Diameter": string;
  "Outside Diameter": string;
  Shape: string;
  // General
  Warranty: string;
  "Inner Carton Qty": string;
  "Outer Carton Qty": string;
  Finish: string;
  "Direct Replacement For": string;
  Use: string;
  "Surge Protection": string;
  "Diffuser Type": string;
  "Diffuser Material": string;
  "Optional Accessory": string;
  Mounting: string;
  "Flange Dimensions": string;
  "Recess Dimensions": string;
  "Rib-reinforced": string;
  "PIR Sensor": string;
  "Auto Shut-off": string;
  Waterproofing: string;
  "LED Quantity": string;
  "LED Type": string;
  "Input Voltage (VAC)": string;
  "Current Draw": string;
  "Output Voltage (VDC)": string;
  "Hole Size Cutout": string;
  "Dimmer Compatibility": string;
  "Dimensions (without tabs)": string;
  "Maximum Linkable Length": string;
  "Classification Type": string;
  "Driver Dimensions (mm)": string;
  "DriverDimensions (Inches)": string;
  [key: string]: string;
}

export interface SpecConfig {
  label: string;
  visible: boolean;
  group: string;
}

export interface SpecVisibilityConfig {
  _comment: string;
  specs: Record<string, SpecConfig>;
}

export interface CategoryTree {
  name: string;
  subcategories: {
    name: string;
    subcategories: string[];
    count: number;
  }[];
  count: number;
}
