# CNA Lighting WordPress Theme

A custom WooCommerce-compatible WordPress theme for CNA Lighting's product catalog.
Built for staging.cnalighting.com.

---

## Requirements

- WordPress 6.4+
- WooCommerce 8.0+
- PHP 8.1+
- WPS Hide Login (optional but recommended)

---

## Installation

### 1. Upload the Theme

**Option A — WordPress Admin (recommended for staging)**
1. Zip the `cna-lighting` folder → `cna-lighting.zip`
2. In WP Admin: **Appearance → Themes → Add New → Upload Theme**
3. Upload `cna-lighting.zip` → Install Now → Activate

**Option B — FTP / File Manager**
1. Upload the entire `cna-lighting/` folder to `/wp-content/themes/`
2. In WP Admin: **Appearance → Themes** → Activate *CNA Lighting*

> **On activation**, the theme automatically:
> - Creates all required pages (Home, Products, About, Contact, FAQ, etc.)
> - Sets the front page to the Homepage
> - Creates the non-public upload folder `wp-content/cna-imports/` with `.htaccess` protection
> - Sets the WooCommerce shop page to the Products page

---

### 2. Install WooCommerce

1. **Plugins → Add New** → search "WooCommerce" → Install & Activate
2. Skip the WooCommerce setup wizard (all configuration is handled by the theme)
3. Go to **WooCommerce → Settings → Products → General**
   - Enable "Use the WordPress image crop" if not already on
4. Go to **WooCommerce → Settings → Advanced → Page setup**
   - Set **Shop page** to "Products" (should already be set by theme activation)

---

### 3. Import Your Product Catalog

1. In WP Admin: **CNA Lighting → Import Catalog**
2. Upload your `.csv` file (drag-and-drop or click to browse)
3. Check **"Download product images"** to fetch images into the Media Library
   - Uncheck for faster imports if you'll manage images separately
4. Click **Import Products**

**CSV Column Reference:**

| Column | Required | Notes |
|--------|----------|-------|
| `SKU` | ✓ | Unique product identifier; used to match on re-import |
| `post_title` | ✓ | Product display name |
| `post_content` | | Full product description (HTML ok) |
| `Price` | | Stored but not shown publicly (B2B catalog) |
| `MainCategory` | | Creates WC product category if missing |
| `SubCategory1` | | Child category under MainCategory |
| `SubCategory2` | | Stored as meta only (not shown in sidebar) |
| `Model` | | Stored as `_cna_model` meta |
| `images` | | External image URL — downloaded if option checked |
| `specSheetLink` | | URL to spec sheet PDF |
| `Wattage (W)` | | All spec fields follow this pattern |
| *(see full list below)* | | |

**All recognized spec columns:**
```
Wattage (W), Voltage (V), Lumens (lm), Efficiency, L70 Rated Life (Hrs),
Bulb Equivalent, Base, Colour Temperature, Beam Angle, CRI, Dimmable,
Operating Temperature, Environmental Rating, Certifications, 2-HR Fire Rating Compliance,
Length (mm), Length (inches), Width (mm), Width (inches), Height (mm), Height (inches),
Diameter (mm), Diameter (inches), Weight (g), Weight (lbs),
Inside Diameter, Outside Diameter, Nominal Length,
Shape, Finish, Dimmer Compatibility, Mounting,
Diffuser Type, Diffuser Material, Hole Size Cutout, Flange Dimensions, Recess Dimensions, Rib-reinforced,
Warranty, Direct Replacement For, Use, Surge Protection, Optional Accessory,
PIR Sensor, Auto Shut-off, Waterproofing,
LED Quantity, LED Type, Input Voltage (VAC), Current Draw, Output Voltage (VDC),
Maximum Linkable Length, Classification Type, Driver Dimensions (mm), DriverDimensions (Inches)
```

> Re-importing is safe — products are matched by SKU and updated in place.

---

### 4. Configure Spec Visibility

**CNA Lighting → Spec Visibility**

Toggle which specification fields appear on product detail pages.
Organized by group: Performance, Ratings, Dimensions, Physical, General, Technical.

Changes apply immediately without re-importing products.

---

### 5. Configure Product Images

**Per-product image upload (after import):**
1. Go to any product page on the front end while logged in as admin
2. Click the **"Upload Image"** button below the product image
3. Select a file from your computer — uploads immediately via AJAX

**Bulk image download during import:**
- Check "Download product images" on the Import page
- Only downloads if the product has no featured image yet (safe to re-import)

---

### 6. Install WPS Hide Login (Recommended)

1. **Plugins → Add New** → search "WPS Hide Login" → Install & Activate
2. **Settings → WPS Hide Login**
   - Change the login URL slug to something custom (e.g., `cna-admin-access`)
   - Save — your login URL is now `staging.cnalighting.com/cna-admin-access`
3. The theme uses `wp_login_url()` and `admin_url()` everywhere — fully compatible.

---

### 7. Permalink Settings

After installing WooCommerce, flush permalinks:
**Settings → Permalinks** → select **"Post name"** → Save Changes

This ensures `/products/your-product-sku/` URLs work correctly.

---

## Theme File Structure

```
cna-lighting/
├── style.css                          # Theme declaration + CSS variables
├── functions.php                      # Core: enqueues, AJAX handlers, activation hook
├── header.php                         # Navigation bar
├── footer.php                         # Site footer
├── front-page.php                     # Homepage (hero, categories, why CNA)
├── page.php                           # Generic page template
├── page-company-history.php           # About / Company History
├── page-contact.php                   # Contact Us
├── page-faq.php                       # FAQ
├── page-warranty-return-policy.php    # Warranty & Returns
├── page-freight-prepaid-policy.php    # Freight Policy
├── page-dimmer-compatibility.php      # Dimmer Compatibility
├── 404.php                            # 404 error page
├── woocommerce/
│   ├── archive-product.php            # Products catalog with AJAX filtering
│   └── single-product.php             # Product detail page
├── assets/
│   ├── css/
│   │   └── cna-theme.css              # Custom styles
│   └── js/
│       ├── cna-nav.js                 # Mobile navigation
│       ├── cna-hero.js                # Hero animations + particle canvas
│       ├── cna-catalog.js             # AJAX catalog filtering
│       └── cna-animations.js          # Scroll-triggered animations
└── inc/
    ├── csv-importer.php               # Admin import page + CSV processor
    ├── spec-visibility.php            # Spec visibility admin page
    └── woocommerce-setup.php          # WC hooks, image sizes, cleanup
```

---

## Admin Pages

| URL | Purpose |
|-----|---------|
| `/wp-admin/admin.php?page=cna-lighting` | Import product catalog (CSV) |
| `/wp-admin/admin.php?page=cna-spec-visibility` | Toggle spec visibility |

Both require `manage_woocommerce` capability (Shop Manager or Administrator).

---

## Non-Public File Storage

Uploaded CSV files are stored at:
```
wp-content/cna-imports/
```

This folder is created on theme activation and protected by:
```apache
# .htaccess
Order deny,allow
Deny from all
```

PHP can still read files for processing, but they are not web-accessible.

---

## Staging Checklist

- [ ] WordPress installed at staging.cnalighting.com
- [ ] WooCommerce installed and activated
- [ ] Theme uploaded and activated
- [ ] Permalinks flushed (Settings → Permalinks → Save)
- [ ] Product CSV imported (CNA Lighting → Import Catalog)
- [ ] Spec visibility reviewed (CNA Lighting → Spec Visibility)
- [ ] WPS Hide Login installed and configured
- [ ] Logo uploaded: Appearance → Customize → Site Identity → Logo
- [ ] Contact page email verified (page-contact.php line ~45)
- [ ] Test on mobile viewport

---

## Notes

- **No e-commerce:** Prices and Add to Cart are hidden — this is a B2B catalog site. To enable purchasing, comment out the relevant lines at the bottom of `inc/woocommerce-setup.php`.
- **Image fallback:** If a product has no WP featured image, the theme falls back to the `_cna_image_url` meta (the raw URL from the CSV). This means products display correctly even without downloading images.
- **Re-importing is safe:** The importer matches on SKU and updates existing products. Images are only downloaded once (skipped if a featured image already exists).
- **Fonts:** Loaded from Google Fonts (Barlow Condensed + Barlow). Ensure the server can reach fonts.googleapis.com, or self-host the fonts for stricter environments.
