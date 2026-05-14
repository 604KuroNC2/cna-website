<?php
defined('ABSPATH') || exit;

/* ─────────────────────────────────────────────────────────────
   ADMIN MENU: CNA Lighting top-level menu
───────────────────────────────────────────────────────────── */
add_action('admin_menu', function () {
    add_menu_page(
        'CNA Lighting',
        'CNA Lighting',
        'manage_woocommerce',
        'cna-lighting',
        'cna_csv_import_page',
        'dashicons-lightbulb',
        56
    );
    add_submenu_page('cna-lighting', 'Import Catalog', 'Import Catalog', 'manage_woocommerce', 'cna-lighting',        'cna_csv_import_page');
    add_submenu_page('cna-lighting', 'Spec Visibility', 'Spec Visibility', 'manage_woocommerce', 'cna-spec-visibility', 'cna_spec_visibility_page');
});

/* ─────────────────────────────────────────────────────────────
   IMPORT PAGE
───────────────────────────────────────────────────────────── */
function cna_csv_import_page(): void {
    $result = null;
    $error  = '';

    if (isset($_POST['cna_do_import']) && check_admin_referer('cna_import_nonce')) {
        if (!empty($_FILES['cna_csv']['tmp_name'])) {
            $file      = $_FILES['cna_csv'];
            $ext       = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            $allowed   = ['csv', 'xlsx', 'xls'];

            if (!in_array($ext, $allowed)) {
                $error = 'Invalid file type. Please upload a .csv or .xlsx file.';
            } elseif ($file['size'] > 52428800) { // 50 MB
                $error = 'File too large (max 50 MB).';
            } else {
                // Move to non-public folder
                $import_dir = WP_CONTENT_DIR . '/cna-imports/';
                wp_mkdir_p($import_dir);
                $dest = $import_dir . sanitize_file_name(basename($file['name']));
                if (move_uploaded_file($file['tmp_name'], $dest)) {
                    if ($ext === 'csv') {
                        $result = cna_process_csv($dest, isset($_POST['download_images']));
                    } else {
                        $error = 'XLSX import: please convert your file to CSV first. (PHP XLSX parsing requires a library not bundled with this theme.)';
                    }
                    // Keep file for audit (optionally delete: unlink($dest))
                } else {
                    $error = 'Could not move uploaded file. Check folder permissions on wp-content/cna-imports/.';
                }
            }
        } else {
            $error = 'No file uploaded.';
        }
    }
    ?>
    <div class="wrap">
      <h1 style="font-family:'Barlow Condensed',sans-serif;font-size:2rem;color:#000080;display:flex;align-items:center;gap:10px">
        <span class="dashicons dashicons-upload" style="font-size:2rem;line-height:1.2"></span>
        Import Product Catalog
      </h1>
      <p class="description" style="font-size:14px;margin-top:4px">
        Upload your CNA products CSV to create or update WooCommerce products.
        Products are matched by SKU &mdash; existing products are updated, new SKUs are created.
      </p>

      <?php if ($error): ?>
        <div class="notice notice-error"><p><?php echo esc_html($error); ?></p></div>
      <?php endif; ?>

      <?php if ($result): ?>
        <div class="notice <?php echo $result['imported'] > 0 ? 'notice-success' : 'notice-warning'; ?>">
          <p>
            <strong>Import complete!</strong>
            <?php echo esc_html($result['imported']); ?> products imported/updated.
            <?php if ($result['errors']): ?>
              <?php echo count($result['errors']); ?> error(s).
            <?php endif; ?>
          </p>
          <?php if ($result['errors']): ?>
            <details style="margin-top:8px">
              <summary>View errors</summary>
              <ul style="margin-top:8px">
                <?php foreach (array_slice($result['errors'], 0, 20) as $e): ?>
                  <li><?php echo esc_html($e); ?></li>
                <?php endforeach; ?>
              </ul>
            </details>
          <?php endif; ?>
          <?php if (!empty($result['debug'])): $d = $result['debug']; ?>
            <details style="margin-top:8px">
              <summary style="cursor:pointer;font-weight:600">Diagnostic info</summary>
              <div style="margin-top:8px;font-size:12px;font-family:monospace;background:#f9fafb;padding:10px;border-radius:4px">
                <p><strong>Delimiter detected:</strong> <?php echo esc_html($d['delimiter']); ?></p>
                <p><strong>Rows skipped (blank/no SKU):</strong> <?php echo (int)($d['rows_skipped'] ?? 0); ?></p>
                <p><strong>SKU column index:</strong>
                  <?php echo $d['sku_col_index'] !== false ? (int)$d['sku_col_index'] : '<span style="color:red">NOT FOUND — check column name is exactly "SKU"</span>'; ?>
                </p>
                <p><strong>Headers found (<?php echo count($d['headers_found']); ?>):</strong><br>
                  <?php echo esc_html(implode(', ', array_slice($d['headers_found'], 0, 20))); ?>
                  <?php if (count($d['headers_found']) > 20) echo '…'; ?>
                </p>
              </div>
            </details>
          <?php endif; ?>
        </div>
      <?php endif; ?>

      <div style="background:white;border:1px solid #c3c4c7;border-radius:4px;padding:24px;max-width:640px;margin-top:16px">
        <form method="post" enctype="multipart/form-data">
          <?php wp_nonce_field('cna_import_nonce'); ?>
          <input type="hidden" name="cna_do_import" value="1" />

          <!-- Upload zone -->
          <div id="cna-drop-zone" class="cna-upload-zone" onclick="document.getElementById('cna-file-input').click()"
               style="border:2px dashed #d1d5db;border-radius:4px;padding:40px;text-align:center;cursor:pointer;transition:all 0.2s;margin-bottom:16px">
            <span class="dashicons dashicons-upload" style="font-size:3rem;color:rgba(0,0,128,0.3);display:block;margin-bottom:12px"></span>
            <p style="margin:0 0 4px;font-weight:600;color:#374151">Drop your CSV file here</p>
            <p style="margin:0;font-size:13px;color:#9ca3af">or click to browse</p>
            <p id="cna-file-name" style="margin:12px 0 0;font-size:13px;color:#000080;font-weight:600"></p>
            <input type="file" id="cna-file-input" name="cna_csv" accept=".csv,.xlsx,.xls"
                   style="display:none" onchange="document.getElementById('cna-file-name').textContent = this.files[0]?.name || ''" />
          </div>

          <!-- Options -->
          <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:4px;padding:16px;margin-bottom:20px">
            <h3 style="margin:0 0 12px;font-size:14px;color:#374151">Import Options</h3>

            <label style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;cursor:pointer">
              <input type="checkbox" name="download_images" value="1" checked style="margin-top:3px" />
              <span>
                <strong style="font-size:13px">Download product images</strong><br>
                <span style="font-size:12px;color:#6b7280">Fetch images from the image URL column and attach them to products in WordPress Media Library.
                  Uncheck to skip (faster import, images display from URL directly).</span>
              </span>
            </label>
          </div>

          <!-- Format reference -->
          <details style="margin-bottom:20px">
            <summary style="cursor:pointer;font-size:13px;color:#000080;font-weight:600">Expected CSV column headers</summary>
            <div style="margin-top:8px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:4px;padding:12px;font-size:12px;font-family:monospace;line-height:1.8;color:#374151">
              MainCategory, SubCategory1, SubCategory2, Model, SKU, Price, post_title, post_content, images, specSheetLink, Wattage (W), Voltage (V), Lumens (lm), CRI, Dimmable, Colour Temperature, Base, Beam Angle, L70 Rated Life (Hrs), Warranty, ...
            </div>
          </details>

          <input type="submit" value="Import Products" class="button button-primary button-large"
                 style="background:#000080;border-color:#000060;font-size:14px;height:40px;padding:0 24px" />
        </form>
      </div>

      <div style="margin-top:20px;padding:16px;background:#fffbeb;border:1px solid #fde68a;border-radius:4px;max-width:640px">
        <strong style="color:#92400e">📁 Non-public upload folder:</strong>
        <code style="font-size:12px;margin-left:8px"><?php echo esc_html(WP_CONTENT_DIR . '/cna-imports/'); ?></code><br>
        <span style="font-size:13px;color:#78350f">Uploaded files are stored here and protected by .htaccess (Deny from all). Only PHP can read them.</span>
      </div>
    </div>

    <script>
    (function() {
      var zone  = document.getElementById('cna-drop-zone');
      var input = document.getElementById('cna-file-input');
      var nameEl = document.getElementById('cna-file-name');
      zone.addEventListener('dragover', function(e) { e.preventDefault(); zone.style.borderColor = '#000080'; zone.style.background = 'rgba(0,0,128,0.04)'; });
      zone.addEventListener('dragleave', function() { zone.style.borderColor = '#d1d5db'; zone.style.background = ''; });
      zone.addEventListener('drop', function(e) {
        e.preventDefault(); zone.style.borderColor = '#d1d5db'; zone.style.background = '';
        var file = e.dataTransfer.files[0];
        if (file) {
          var dt = new DataTransfer(); dt.items.add(file);
          input.files = dt.files;
          nameEl.textContent = file.name;
        }
      });
    })();
    </script>
    <?php
}

/* ─────────────────────────────────────────────────────────────
   CSV PROCESSING
───────────────────────────────────────────────────────────── */
function cna_process_csv(string $filepath, bool $download_images = true): array {
    set_time_limit(600);
    ini_set('memory_limit', '512M');

    if (!function_exists('media_sideload_image')) {
        require_once ABSPATH . 'wp-admin/includes/media.php';
        require_once ABSPATH . 'wp-admin/includes/file.php';
        require_once ABSPATH . 'wp-admin/includes/image.php';
    }

    $handle = fopen($filepath, 'r');
    if (!$handle) return ['imported' => 0, 'errors' => ['Cannot open file.'], 'debug' => []];

    // Auto-detect delimiter by sampling first line
    $first_line = fgets($handle);
    rewind($handle);
    $tab_count   = substr_count($first_line, "\t");
    $comma_count = substr_count($first_line, ',');
    $semi_count  = substr_count($first_line, ';');
    $delim = ',';
    if ($tab_count > $comma_count && $tab_count > $semi_count) $delim = "\t";
    elseif ($semi_count > $comma_count) $delim = ';';

    $raw_hdrs = fgetcsv($handle, 0, $delim);
    if (!$raw_hdrs) return ['imported' => 0, 'errors' => ['Empty or unreadable file.'], 'debug' => []];

    // Normalize headers: strip BOM, trim whitespace and quotes
    $headers = array_map(function ($h) {
        $h = str_replace("\xEF\xBB\xBF", '', $h); // UTF-8 BOM
        $h = trim($h, " \t\n\r\0\x0B\"'");
        return $h;
    }, $raw_hdrs);

    $debug = [
        'delimiter'    => $delim === "\t" ? 'TAB' : $delim,
        'headers_found'=> $headers,
        'sku_col_index'=> array_search('SKU', $headers),
    ];

    $imported = 0;
    $errors   = [];
    $skipped  = 0;

    // All spec field names (matches types.ts)
    $spec_fields = [
        'Wattage (W)','Voltage (V)','Lumens (lm)','Efficiency','L70 Rated Life (Hrs)',
        'Bulb Equivalent','Base','Colour Temperature','Beam Angle','CRI','Dimmable',
        'Operating Temperature','Environmental Rating','Certifications','2-HR Fire Rating Compliance',
        'Length (mm)','Length (inches)','Width (mm)','Width (inches)','Height (mm)','Height (inches)',
        'Diameter (mm)','Diameter (inches)','Weight (g)','Weight (lbs)',
        'Inside Diameter','Outside Diameter','Nominal Length',
        'Shape','Finish','Dimmer Compatibility','Mounting',
        'Diffuser Type','Diffuser Material','Hole Size Cutout','Flange Dimensions','Recess Dimensions','Rib-reinforced',
        'Warranty','Direct Replacement For','Use','Surge Protection','Optional Accessory',
        'PIR Sensor','Auto Shut-off','Waterproofing',
        'LED Quantity','LED Type','Input Voltage (VAC)','Current Draw','Output Voltage (VDC)',
        'Maximum Linkable Length','Classification Type','Driver Dimensions (mm)','DriverDimensions (Inches)',
    ];

    while (($row = fgetcsv($handle, 0, $delim)) !== false) {
        // Skip completely blank rows
        if (!array_filter($row)) { $skipped++; continue; }

        $data = [];
        foreach ($headers as $i => $h) {
            $data[$h] = isset($row[$i]) ? trim($row[$i]) : '';
        }

        // Try common SKU column name variants
        $sku = trim(
            $data['SKU'] ?? $data['sku'] ?? $data['Sku'] ??
            $data['Product SKU'] ?? $data['product_sku'] ?? $data['PRODUCT SKU'] ?? ''
        );
        if (!$sku) { $skipped++; continue; }

        // ── Create or update product ──
        $product_id = wc_get_product_id_by_sku($sku);
        if ($product_id) {
            $product = wc_get_product($product_id);
        } else {
            $product = new WC_Product_Simple();
        }

        $product->set_name($data['post_title'] ?: $sku);
        $product->set_sku($sku);
        if ($data['post_content']) $product->set_description($data['post_content']);
        if ($data['post_content']) $product->set_short_description(wp_trim_words($data['post_content'], 30));

        $price = preg_replace('/[^0-9.]/', '', $data['Price'] ?? '');
        if ($price !== '') {
            $product->set_regular_price($price);
            $product->set_price($price);
        }

        $product->set_status('publish');
        $product->set_catalog_visibility('visible');

        // ── Categories ──
        $main_cat_name = trim($data['MainCategory'] ?? '');
        $sub_cat_name  = trim($data['SubCategory1'] ?? '');
        $cat_ids = [];

        if ($main_cat_name) {
            $main_term = get_term_by('name', $main_cat_name, 'product_cat');
            if (!$main_term) {
                $inserted = wp_insert_term($main_cat_name, 'product_cat');
                $main_id  = is_wp_error($inserted) ? 0 : $inserted['term_id'];
            } else {
                $main_id = $main_term->term_id;
            }
            if ($main_id) $cat_ids[] = $main_id;

            if ($sub_cat_name && $main_id) {
                $sub_term = get_term_by('name', $sub_cat_name, 'product_cat');
                if (!$sub_term) {
                    $inserted = wp_insert_term($sub_cat_name, 'product_cat', ['parent' => $main_id]);
                    $sub_id   = is_wp_error($inserted) ? 0 : $inserted['term_id'];
                } else {
                    $sub_id = $sub_term->term_id;
                }
                if ($sub_id) $cat_ids[] = $sub_id;
            }
        }

        if ($cat_ids) $product->set_category_ids($cat_ids);

        $product_id = $product->save();
        if (!$product_id || is_wp_error($product_id)) {
            $msg = is_wp_error($product_id) ? $product_id->get_error_message() : 'unknown error';
            $errors[] = 'Failed to save SKU ' . $sku . ': ' . $msg;
            continue;
        }

        // ── Product image ──
        $image_url = trim($data['images'] ?? $data['image'] ?? $data['Images'] ?? '');
        if ($image_url) {
            update_post_meta($product_id, '_cna_image_url', $image_url);

            if ($download_images && !get_post_thumbnail_id($product_id)) {
                // Only download if no thumbnail yet (avoid re-downloading on re-import)
                $attachment_id = cna_sideload_image($image_url, $product_id, $sku);
                if ($attachment_id && !is_wp_error($attachment_id)) {
                    set_post_thumbnail($product_id, $attachment_id);
                }
            }
        }

        // ── Spec sheet link ──
        $spec_link = trim($data['specSheetLink'] ?? $data['Spec Sheet Link'] ?? $data['spec_sheet_link'] ?? '');
        if ($spec_link) update_post_meta($product_id, '_cna_spec_sheet_link', $spec_link);

        // ── Top-level category meta ──
        update_post_meta($product_id, '_cna_main_category', $main_cat_name);
        update_post_meta($product_id, '_cna_sub_category1', $sub_cat_name);
        update_post_meta($product_id, '_cna_sub_category2', trim($data['SubCategory2'] ?? ''));
        update_post_meta($product_id, '_cna_model',         trim($data['Model'] ?? ''));

        // ── All spec fields ──
        foreach ($spec_fields as $field) {
            $val = trim($data[$field] ?? '');
            update_post_meta($product_id, cna_spec_meta_key($field), $val);
        }

        $imported++;
    }

    fclose($handle);
    $debug['rows_skipped'] = $skipped;
    return ['imported' => $imported, 'errors' => $errors, 'debug' => $debug];
}

/* ─────────────────────────────────────────────────────────────
   IMAGE SIDELOAD HELPER
───────────────────────────────────────────────────────────── */
function cna_sideload_image(string $url, int $post_id, string $desc = ''): int|WP_Error {
    if (empty($url)) return new WP_Error('no_url', 'Empty URL');

    // media_sideload_image returns the attachment ID in WP 5.4+
    $id = media_sideload_image($url, $post_id, $desc, 'id');
    return $id;
}
