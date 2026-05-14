<?php defined('ABSPATH') || exit; ?>
<?php get_header(); ?>

<?php
while (have_posts()) : the_post();
    $product    = wc_get_product(get_the_ID());
    $id         = get_the_ID();
    $sku        = $product->get_sku();
    $name       = $product->get_name();
    $desc       = $product->get_description() ?: $product->get_short_description();
    $price      = $product->get_price();
    $image_url  = get_post_meta($id, '_cna_image_url', true);
    $thumb_id   = get_post_thumbnail_id($id);
    $spec_link  = get_post_meta($id, '_cna_spec_sheet_link', true);
    $main_cat   = get_post_meta($id, '_cna_main_category', true);
    $sub_cat1   = get_post_meta($id, '_cna_sub_category1', true);
    $shop_url   = get_permalink(wc_get_page_id('shop'));

    if ($thumb_id) {
        $img_src = wp_get_attachment_image_url($thumb_id, 'large');
        $img_full = wp_get_attachment_image_url($thumb_id, 'full');
    } elseif ($image_url) {
        $img_src = esc_url($image_url);
        $img_full = $img_src;
    } else {
        $img_src = '';
        $img_full = '';
    }

    // Additional images (gallery)
    $gallery_ids = $product->get_gallery_image_ids();

    // Get spec visibility config
    $spec_config = cna_get_spec_visibility();
?>

<div class="min-h-screen bg-[#f8f8fc]">

  <!-- Breadcrumb header -->
  <div class="pt-20" style="background:linear-gradient(135deg,#00002a 0%,#000060 50%,#000080 100%)">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center gap-2 text-xs text-white/40">
        <a href="<?php echo esc_url($shop_url); ?>" class="hover:text-white transition-colors">&larr; Products</a>
        <?php if ($main_cat): ?>
          <span>/</span>
          <a href="<?php echo esc_url(add_query_arg('main_cat', sanitize_title($main_cat), $shop_url)); ?>"
             class="hover:text-white transition-colors"><?php echo esc_html($main_cat); ?></a>
        <?php endif; ?>
        <?php if ($sub_cat1): ?>
          <span>/</span>
          <a href="<?php echo esc_url(add_query_arg(['main_cat' => sanitize_title($main_cat), 'sub_cat' => sanitize_title($sub_cat1)], $shop_url)); ?>"
             class="hover:text-white transition-colors"><?php echo esc_html($sub_cat1); ?></a>
        <?php endif; ?>
        <span>/</span>
        <span class="text-white/70 truncate max-w-xs"><?php echo esc_html($name); ?></span>
      </div>
    </div>
  </div>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

    <!-- Top: image + summary -->
    <div class="flex flex-col lg:flex-row gap-10 mb-12">

      <!-- Image panel -->
      <div class="lg:w-1/2">
        <div class="bg-white rounded-sm border border-gray-100 overflow-hidden">
          <!-- Main image -->
          <div class="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
            <?php if ($img_src): ?>
              <a href="<?php echo esc_url($img_full ?: $img_src); ?>" target="_blank" rel="noopener">
                <img src="<?php echo esc_url($img_src); ?>"
                     alt="<?php echo esc_attr($name); ?>"
                     id="main-product-image"
                     class="max-h-80 max-w-full object-contain transition-transform duration-500 hover:scale-105" />
              </a>
            <?php else: ?>
              <div class="flex items-center justify-center w-full h-64 text-gray-300">
                <svg class="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="0.5">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="M21 15l-5-5L5 21"/>
                </svg>
              </div>
            <?php endif; ?>

            <!-- Admin: change image button (admins only) -->
            <?php if (current_user_can('manage_woocommerce')): ?>
              <div class="absolute top-3 right-3">
                <label class="cursor-pointer px-3 py-1.5 bg-[#000080] text-white text-xs font-medium rounded-sm hover:bg-[#0000a0] transition-colors">
                  <svg class="w-3.5 h-3.5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                  </svg>
                  Upload Image
                  <input type="file" accept="image/*" class="hidden"
                         onchange="cnaUploadProductImage(this, <?php echo esc_js($id); ?>)" />
                </label>
              </div>
            <?php endif; ?>
          </div>

          <!-- Gallery thumbnails -->
          <?php if ($gallery_ids): ?>
            <div class="flex gap-2 p-3 border-t border-gray-100 overflow-x-auto">
              <?php if ($img_src): ?>
                <button onclick="document.getElementById('main-product-image').src='<?php echo esc_js($img_src); ?>'"
                        class="flex-shrink-0 w-16 h-16 rounded-sm border-2 border-[#000080] overflow-hidden">
                  <img src="<?php echo esc_url($img_src); ?>" class="w-full h-full object-contain p-1" />
                </button>
              <?php endif; ?>
              <?php foreach ($gallery_ids as $gid):
                $gsrc = wp_get_attachment_image_url($gid, 'thumbnail');
                $gfull = wp_get_attachment_image_url($gid, 'large');
              ?>
                <button onclick="document.getElementById('main-product-image').src='<?php echo esc_js($gfull); ?>'"
                        class="flex-shrink-0 w-16 h-16 rounded-sm border-2 border-gray-200 hover:border-[#000080] overflow-hidden transition-colors">
                  <img src="<?php echo esc_url($gsrc); ?>" class="w-full h-full object-contain p-1" />
                </button>
              <?php endforeach; ?>
            </div>
          <?php endif; ?>
        </div>
      </div>

      <!-- Product summary -->
      <div class="lg:w-1/2">
        <p class="text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-medium">SKU: <?php echo esc_html($sku); ?></p>
        <h1 class="font-display font-black text-3xl sm:text-4xl text-[#000080] leading-tight mb-4 tracking-tight">
          <?php echo esc_html($name); ?>
        </h1>

        <?php if ($sub_cat1): ?>
          <div class="mb-4">
            <span class="px-3 py-1 bg-[#000080]/08 text-[#000080] text-xs font-semibold uppercase tracking-wide rounded-sm">
              <?php echo esc_html($sub_cat1); ?>
            </span>
          </div>
        <?php endif; ?>

        <?php if ($price): ?>
          <div class="mb-6 pb-6 border-b border-gray-100">
            <span class="text-xs text-gray-400 uppercase tracking-wide block mb-1">From</span>
            <span class="font-display font-black text-4xl text-[#000080]">$<?php echo esc_html(number_format((float)$price, 2)); ?></span>
          </div>
        <?php endif; ?>

        <!-- Quick spec summary -->
        <?php
        $quick_specs = [
            'Wattage (W)' => 'Wattage',
            'Lumens (lm)' => 'Lumens',
            'Colour Temperature' => 'CCT',
            'CRI' => 'CRI',
            'Dimmable' => 'Dimmable',
            'Base' => 'Base',
        ];
        $any_quick = false;
        foreach ($quick_specs as $key => $_) {
            if (get_post_meta($id, cna_spec_meta_key($key), true)) { $any_quick = true; break; }
        }
        if ($any_quick):
        ?>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            <?php foreach ($quick_specs as $field => $label):
              $val = get_post_meta($id, cna_spec_meta_key($field), true);
              if (!$val) continue;
            ?>
              <div class="bg-white rounded-sm border border-gray-100 px-3 py-2.5">
                <div class="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5"><?php echo esc_html($label); ?></div>
                <div class="font-semibold text-[#000080] text-sm"><?php echo esc_html($val); ?></div>
              </div>
            <?php endforeach; ?>
          </div>
        <?php endif; ?>

        <!-- CTA buttons -->
        <div class="flex flex-wrap gap-3">
          <?php if ($spec_link): ?>
            <a href="<?php echo esc_url($spec_link); ?>" target="_blank" rel="noopener noreferrer"
               class="inline-flex items-center gap-2 px-6 py-3 bg-[#FFD700] text-[#000080] font-bold text-sm uppercase tracking-wide rounded-sm hover:bg-[#FFE44D] transition-all hover:shadow-[0_4px_20px_rgba(255,215,0,0.4)]">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Download Spec Sheet
            </a>
          <?php endif; ?>
          <a href="<?php echo esc_url(get_permalink(get_page_by_path('contact'))); ?>"
             class="inline-flex items-center gap-2 px-6 py-3 border border-[#000080]/20 text-[#000080] font-bold text-sm uppercase tracking-wide rounded-sm hover:border-[#000080]/40 transition-colors">
            Contact for Pricing
          </a>
        </div>
      </div>
    </div>

    <!-- Full spec table -->
    <?php
    $groups = ['Performance','Ratings','Dimensions','Physical','General','Technical'];
    $group_colors = [
        'Performance' => ['bg' => '#eff6ff', 'header' => '#2563eb'],
        'Ratings'     => ['bg' => '#f0fdf4', 'header' => '#16a34a'],
        'Dimensions'  => ['bg' => '#faf5ff', 'header' => '#9333ea'],
        'Physical'    => ['bg' => '#fff7ed', 'header' => '#ea580c'],
        'General'     => ['bg' => '#f9fafb', 'header' => '#4b5563'],
        'Technical'   => ['bg' => '#fef2f2', 'header' => '#dc2626'],
    ];

    $has_any_spec = false;
    foreach ($spec_config as $field => $cfg) {
        if ($cfg['visible'] && get_post_meta($id, cna_spec_meta_key($field), true)) {
            $has_any_spec = true; break;
        }
    }

    if ($has_any_spec):
    ?>
      <div class="mb-12">
        <h2 class="font-display font-bold text-2xl text-[#000080] mb-6 pb-3 border-b-2 border-[#FFD700]">Specifications</h2>
        <div class="space-y-4">
          <?php foreach ($groups as $group):
            $rows = [];
            foreach ($spec_config as $field => $cfg) {
                if ($cfg['group'] !== $group || !$cfg['visible']) continue;
                $val = get_post_meta($id, cna_spec_meta_key($field), true);
                if ($val) $rows[] = ['label' => $cfg['label'], 'value' => $val];
            }
            if (!$rows) continue;
            $gc = $group_colors[$group] ?? ['bg' => '#f9fafb', 'header' => '#374151'];
          ?>
            <div style="border-radius:4px;overflow:hidden;border:1px solid rgba(0,0,0,0.07)">
              <div style="background:<?php echo esc_attr($gc['header']); ?>;padding:0.6rem 1.25rem">
                <span style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:1rem;color:white;text-transform:uppercase;letter-spacing:0.05em">
                  <?php echo esc_html($group); ?>
                </span>
              </div>
              <table style="width:100%;border-collapse:collapse;background:<?php echo esc_attr($gc['bg']); ?>">
                <tbody>
                  <?php foreach ($rows as $i => $row): ?>
                    <tr style="<?php echo $i % 2 === 1 ? 'background:rgba(255,255,255,0.7)' : ''; ?>">
                      <td style="padding:0.55rem 1.25rem;font-size:0.82rem;font-weight:600;color:#374151;width:45%;border-bottom:1px solid rgba(0,0,0,0.05)">
                        <?php echo esc_html($row['label']); ?>
                      </td>
                      <td style="padding:0.55rem 1.25rem;font-size:0.82rem;color:#111827;border-bottom:1px solid rgba(0,0,0,0.05)">
                        <?php echo esc_html($row['value']); ?>
                      </td>
                    </tr>
                  <?php endforeach; ?>
                </tbody>
              </table>
            </div>
          <?php endforeach; ?>
        </div>
      </div>
    <?php endif; ?>

    <!-- Description -->
    <?php if ($desc): ?>
      <div class="prose-cna max-w-3xl mb-12">
        <h2 class="font-display font-bold text-2xl text-[#000080] mb-4 pb-3 border-b-2 border-[#FFD700]">Product Description</h2>
        <?php echo wp_kses_post(wpautop($desc)); ?>
      </div>
    <?php endif; ?>

    <a href="<?php echo esc_url($shop_url); ?>"
       class="inline-flex items-center gap-2 text-[#000080] text-sm font-medium hover:text-[#0000c0] transition-colors">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
      </svg>
      Back to Catalog
    </a>
  </div>
</div>

<?php if (current_user_can('manage_woocommerce')): ?>
<script>
function cnaUploadProductImage(input, productId) {
  if (!input.files || !input.files[0]) return;
  var formData = new FormData();
  formData.append('action', 'cna_upload_product_image');
  formData.append('nonce', '<?php echo wp_create_nonce('cna_product_image_nonce'); ?>');
  formData.append('product_id', productId);
  formData.append('image', input.files[0]);
  fetch('<?php echo esc_js(admin_url('admin-ajax.php')); ?>', { method: 'POST', body: formData })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        document.getElementById('main-product-image').src = data.data.thumb_url;
      } else {
        alert('Upload failed: ' + data.data);
      }
    });
}
</script>
<?php endif; ?>

<?php endwhile; ?>
<?php get_footer(); ?>
