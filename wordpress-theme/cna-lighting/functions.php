<?php
defined('ABSPATH') || exit;

/* ─────────────────────────────────────────────────────────────
   1. THEME SETUP
───────────────────────────────────────────────────────────── */
add_action('after_setup_theme', function () {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', ['search-form','comment-form','comment-list','gallery','caption']);
    add_theme_support('woocommerce');
    add_theme_support('wc-product-gallery-zoom');
    add_theme_support('wc-product-gallery-lightbox');
    add_theme_support('wc-product-gallery-slider');

    register_nav_menus([
        'primary' => __('Primary Menu', 'cna-lighting'),
    ]);

    // Remove WooCommerce default styles (we handle them ourselves)
    add_filter('woocommerce_enqueue_styles', '__return_empty_array');
});

/* ─────────────────────────────────────────────────────────────
   2. ENQUEUE SCRIPTS & STYLES
───────────────────────────────────────────────────────────── */
add_action('wp_enqueue_scripts', function () {
    $v = '1.0.0';
    $uri = get_template_directory_uri();

    // Google Fonts
    wp_enqueue_style('cna-fonts',
        'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap',
        [], null
    );

    // Theme CSS
    wp_enqueue_style('cna-theme', $uri . '/assets/css/cna-theme.css', ['cna-fonts'], $v);

    // GSAP
    wp_enqueue_script('gsap', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js', [], '3.12.5', true);
    wp_enqueue_script('gsap-st', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js', ['gsap'], '3.12.5', true);

    // Theme JS
    wp_enqueue_script('cna-nav', $uri . '/assets/js/cna-nav.js', [], $v, true);
    wp_enqueue_script('cna-animations', $uri . '/assets/js/cna-animations.js', ['gsap-st'], $v, true);

    if (is_front_page()) {
        wp_enqueue_script('cna-hero', $uri . '/assets/js/cna-hero.js', ['gsap'], $v, true);
    }

    if (is_shop() || is_product_category()) {
        wp_enqueue_script('cna-catalog', $uri . '/assets/js/cna-catalog.js', ['gsap'], $v, true);
        wp_localize_script('cna-catalog', 'cnaCatalog', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce'   => wp_create_nonce('cna_catalog_nonce'),
            'perPage' => 24,
        ]);
    }
});

// Favicon
add_action('wp_head', function () {
    $icon = get_template_directory_uri() . '/assets/images/favicon.png';
    echo '<link rel="icon" type="image/png" href="' . esc_url($icon) . '">' . "\n";
    echo '<link rel="apple-touch-icon" href="' . esc_url($icon) . '">' . "\n";
}, 1);

// Tailwind Play CDN in <head>
add_action('wp_head', function () {
    echo '<script src="https://cdn.tailwindcss.com"></script>' . "\n";
    echo '<script>
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        display: ["Barlow Condensed", "sans-serif"],
        body:    ["Inter", "sans-serif"],
      },
    }
  }
}
</script>' . "\n";
}, 1);

/* ─────────────────────────────────────────────────────────────
   3. INCLUDE MODULES
───────────────────────────────────────────────────────────── */
require_once get_template_directory() . '/inc/woocommerce-setup.php';
require_once get_template_directory() . '/inc/csv-importer.php';
require_once get_template_directory() . '/inc/spec-visibility.php';

/* ─────────────────────────────────────────────────────────────
   4. THEME ACTIVATION: AUTO-CREATE PAGES & FOLDERS
───────────────────────────────────────────────────────────── */
add_action('after_switch_theme', 'cna_theme_activate');
function cna_theme_activate() {
    // Create the non-public imports folder
    $import_dir = WP_CONTENT_DIR . '/cna-imports';
    if (!is_dir($import_dir)) {
        wp_mkdir_p($import_dir);
        file_put_contents($import_dir . '/.htaccess', "Order deny,allow\nDeny from all\n");
        file_put_contents($import_dir . '/index.php', '<?php // silence');
    }

    // Pages to create: [ title, slug, content ]
    $pages = [
        ['Company History',        'company-history',        ''],
        ['Contact',                'contact',                ''],
        ['FAQ',                    'faq',                    ''],
        ['Warranty / Return Policy','warranty-return-policy', ''],
        ['Freight Prepaid Policy', 'freight-prepaid-policy', ''],
        ['Dimmer Compatibility',   'dimmer-compatibility',   ''],
        ['Products',               'products',               ''],
    ];

    foreach ($pages as [$title, $slug, $content]) {
        if (!get_page_by_path($slug)) {
            wp_insert_post([
                'post_title'   => $title,
                'post_name'    => $slug,
                'post_content' => $content,
                'post_status'  => 'publish',
                'post_type'    => 'page',
            ]);
        }
    }

    // Set front page to "home" (this theme uses front-page.php directly)
    update_option('show_on_front', 'page');
    $home = get_page_by_path('home') ?: get_posts(['post_type'=>'page','posts_per_page'=>1])[0] ?? null;
    if ($home) update_option('page_on_front', $home->ID);

    // Set WooCommerce shop page to "Products" page
    $products_page = get_page_by_path('products');
    if ($products_page) {
        update_option('woocommerce_shop_page_id', $products_page->ID);
    }

    flush_rewrite_rules();
}

/* ─────────────────────────────────────────────────────────────
   5. HELPER: PRODUCT CARD HTML
───────────────────────────────────────────────────────────── */
function cna_product_card(WC_Product $product): void {
    $id         = $product->get_id();
    $name       = $product->get_name();
    $sku        = $product->get_sku();
    $url        = get_permalink($id);
    $price      = $product->get_price();
    $image_url  = get_post_meta($id, '_cna_image_url', true);
    $thumb_id   = get_post_thumbnail_id($id);
    $sub_cat    = get_post_meta($id, '_cna_sub_category1', true);
    $dimmable   = get_post_meta($id, '_cna_spec_dimmable', true);
    $wattage    = get_post_meta($id, '_cna_spec_wattage-w-', true);
    $lumens     = get_post_meta($id, '_cna_spec_lumens-lm-', true);
    $cct        = get_post_meta($id, '_cna_spec_colour-temperature', true);
    $spec_link  = get_post_meta($id, '_cna_spec_sheet_link', true);

    // Prefer WP media image (set manually or imported), fall back to URL meta
    if ($thumb_id) {
        $img_src = wp_get_attachment_image_url($thumb_id, 'medium');
    } elseif ($image_url) {
        $img_src = esc_url($image_url);
    } else {
        $img_src = '';
    }

    $key_specs = array_filter([$wattage, $lumens, $cct]);
    ?>
    <div class="product-card group bg-white rounded-sm overflow-hidden border border-gray-100 hover:border-[#000080]/20 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,128,0.08)]">
      <a href="<?php echo esc_url($url); ?>" class="block">
        <div class="relative h-48 sm:h-52 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          <?php if ($img_src): ?>
            <img src="<?php echo esc_url($img_src); ?>"
                 alt="<?php echo esc_attr($name); ?>"
                 class="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                 loading="lazy" />
          <?php else: ?>
            <div class="w-full h-full flex items-center justify-center">
              <span class="text-xs text-gray-400"><?php echo esc_html($sub_cat ?: 'LED Product'); ?></span>
            </div>
          <?php endif; ?>

          <?php if ($sub_cat): ?>
            <div class="absolute top-3 left-3">
              <span class="px-2 py-0.5 bg-[#000080]/90 text-white text-[10px] font-medium uppercase tracking-wide rounded-sm">
                <?php echo esc_html($sub_cat); ?>
              </span>
            </div>
          <?php endif; ?>

          <?php if (strtolower($dimmable) === 'yes'): ?>
            <div class="absolute top-3 right-3">
              <span class="px-2 py-0.5 bg-[#FFD700] text-[#000080] text-[10px] font-bold uppercase tracking-wide rounded-sm">Dim</span>
            </div>
          <?php endif; ?>

          <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FFD700] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </div>

        <div class="p-4">
          <p class="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-medium">SKU: <?php echo esc_html($sku); ?></p>
          <h3 class="font-display font-semibold text-[#000080] text-base leading-tight mb-3 line-clamp-2 group-hover:text-[#0000a0] transition-colors">
            <?php echo esc_html($name); ?>
          </h3>

          <?php if ($key_specs): ?>
            <div class="flex flex-wrap gap-1.5 mb-4">
              <?php foreach ($key_specs as $spec): ?>
                <span class="px-2 py-0.5 bg-[#000080]/06 text-[#000080] text-[11px] rounded-sm font-medium">
                  <?php echo esc_html($spec); ?>
                </span>
              <?php endforeach; ?>
            </div>
          <?php endif; ?>

          <div class="flex items-center justify-between pt-3 border-t border-gray-100">
            <div>
              <?php if ($price): ?>
                <span class="text-[10px] text-gray-400 uppercase tracking-wide">From</span>
                <div class="font-display font-bold text-xl text-[#000080]">$<?php echo esc_html(number_format((float)$price, 2)); ?></div>
              <?php endif; ?>
            </div>
            <div class="flex items-center gap-2">
              <?php if ($spec_link): ?>
                <a href="<?php echo esc_url($spec_link); ?>" target="_blank" rel="noopener noreferrer"
                   onclick="event.stopPropagation()"
                   class="p-2 text-gray-400 hover:text-[#000080] transition-colors" title="Download Spec Sheet">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </a>
              <?php endif; ?>
              <span class="inline-flex items-center gap-1 text-xs font-medium text-[#000080] group-hover:text-[#0000c0] transition-colors">
                Details
                <svg class="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </span>
            </div>
          </div>
        </div>
      </a>
    </div>
    <?php
}

/* ─────────────────────────────────────────────────────────────
   6. AJAX: FILTER PRODUCTS
───────────────────────────────────────────────────────────── */
add_action('wp_ajax_cna_filter_products',        'cna_ajax_filter_products');
add_action('wp_ajax_nopriv_cna_filter_products', 'cna_ajax_filter_products');

function cna_ajax_filter_products(): void {
    check_ajax_referer('cna_catalog_nonce', 'nonce');

    $main_cat = sanitize_text_field($_POST['main_cat'] ?? '');
    $sub_cat  = sanitize_text_field($_POST['sub_cat']  ?? '');
    $search   = sanitize_text_field($_POST['search']   ?? '');
    $paged    = max(1, intval($_POST['paged'] ?? 1));
    $per_page = 24;

    $args = [
        'post_type'      => 'product',
        'post_status'    => 'publish',
        'posts_per_page' => $per_page,
        'paged'          => $paged,
    ];

    $tax_query = [];
    if ($sub_cat) {
        $tax_query[] = ['taxonomy' => 'product_cat', 'field' => 'slug', 'terms' => $sub_cat, 'include_children' => false];
    } elseif ($main_cat) {
        $tax_query[] = ['taxonomy' => 'product_cat', 'field' => 'slug', 'terms' => $main_cat, 'include_children' => true];
    }
    if ($tax_query) $args['tax_query'] = $tax_query;
    if ($search)    $args['s'] = $search;

    $query = new WP_Query($args);

    ob_start();
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $product = wc_get_product(get_the_ID());
            if ($product) {
                echo '<div class="product-card-wrap">';
                cna_product_card($product);
                echo '</div>';
            }
        }
        wp_reset_postdata();
    }
    $html = ob_get_clean();

    wp_send_json_success([
        'html'         => $html,
        'total'        => $query->found_posts,
        'pages'        => $query->max_num_pages,
        'current_page' => $paged,
        'has_more'     => $paged < $query->max_num_pages,
    ]);
}

/* ─────────────────────────────────────────────────────────────
   7. AJAX: UPLOAD PRODUCT IMAGE (admin only)
───────────────────────────────────────────────────────────── */
add_action('wp_ajax_cna_upload_product_image', 'cna_ajax_upload_product_image');
function cna_ajax_upload_product_image(): void {
    check_ajax_referer('cna_product_image_nonce', 'nonce');
    if (!current_user_can('manage_woocommerce')) wp_die('Unauthorized');

    $product_id = intval($_POST['product_id'] ?? 0);
    if (!$product_id) wp_send_json_error('Invalid product ID');

    if (!function_exists('media_handle_upload')) {
        require_once ABSPATH . 'wp-admin/includes/image.php';
        require_once ABSPATH . 'wp-admin/includes/file.php';
        require_once ABSPATH . 'wp-admin/includes/media.php';
    }

    $attachment_id = media_handle_upload('image', $product_id);
    if (is_wp_error($attachment_id)) {
        wp_send_json_error($attachment_id->get_error_message());
    }

    set_post_thumbnail($product_id, $attachment_id);
    $thumb_url = wp_get_attachment_image_url($attachment_id, 'medium');
    wp_send_json_success(['thumb_url' => $thumb_url, 'attachment_id' => $attachment_id]);
}

/* ─────────────────────────────────────────────────────────────
   8. SIDEBAR: CATEGORY WIDGET DATA
───────────────────────────────────────────────────────────── */
function cna_get_category_tree(): array {
    $top_cats = get_terms([
        'taxonomy'   => 'product_cat',
        'hide_empty' => true,
        'parent'     => 0,
        'orderby'    => 'name',
        'order'      => 'ASC',
        'exclude'    => get_option('default_product_cat'),
    ]);

    $tree = [];
    foreach ($top_cats as $cat) {
        $children = get_terms([
            'taxonomy'   => 'product_cat',
            'hide_empty' => true,
            'parent'     => $cat->term_id,
            'orderby'    => 'name',
        ]);
        $tree[] = [
            'name'     => $cat->name,
            'slug'     => $cat->slug,
            'count'    => $cat->count,
            'children' => array_map(fn($c) => ['name' => $c->name, 'slug' => $c->slug, 'count' => $c->count], $children),
        ];
    }
    return $tree;
}

/* ─────────────────────────────────────────────────────────────
   9. META KEY HELPER (consistent with importer)
───────────────────────────────────────────────────────────── */
function cna_spec_meta_key(string $field): string {
    return '_cna_spec_' . sanitize_key($field);
}
