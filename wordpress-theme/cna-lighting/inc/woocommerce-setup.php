<?php
defined('ABSPATH') || exit;

/* ─────────────────────────────────────────────────────────────
   WOOCOMMERCE THEME SUPPORT
───────────────────────────────────────────────────────────── */
add_action('after_setup_theme', function () {
    add_theme_support('woocommerce', [
        'thumbnail_image_width'  => 600,
        'single_image_width'     => 900,
        'product_grid'           => [
            'default_rows'    => 4,
            'min_rows'        => 1,
            'default_columns' => 4,
            'min_columns'     => 1,
            'max_columns'     => 6,
        ],
    ]);
    add_theme_support('wc-product-gallery-zoom');
    add_theme_support('wc-product-gallery-lightbox');
    add_theme_support('wc-product-gallery-slider');
});

/* ─────────────────────────────────────────────────────────────
   REMOVE WC BLOCK STYLES (Gutenberg product blocks we don't use)
───────────────────────────────────────────────────────────── */
// WC stylesheet array is already cleared in functions.php via __return_empty_array
add_action('wp_enqueue_scripts', function () {
    wp_dequeue_style('wc-blocks-style');
    wp_dequeue_style('wc-blocks-vendors-style');
}, 100);

/* ─────────────────────────────────────────────────────────────
   DISABLE WC DEFAULT BREADCRUMBS (theme has its own)
───────────────────────────────────────────────────────────── */
remove_action('woocommerce_before_main_content', 'woocommerce_breadcrumb', 20);

/* ─────────────────────────────────────────────────────────────
   DISABLE WC DEFAULT WRAPPERS (theme controls layout)
───────────────────────────────────────────────────────────── */
remove_action('woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10);
remove_action('woocommerce_after_main_content',  'woocommerce_output_content_wrapper_end', 10);

add_action('woocommerce_before_main_content', function () {
    echo '<div class="cna-wc-main">';
}, 10);
add_action('woocommerce_after_main_content', function () {
    echo '</div>';
}, 10);

/* ─────────────────────────────────────────────────────────────
   DISABLE WC DEFAULT SIDEBAR (theme has its own)
───────────────────────────────────────────────────────────── */
remove_action('woocommerce_sidebar', 'woocommerce_get_sidebar', 10);

/* ─────────────────────────────────────────────────────────────
   PRODUCT IMAGE SIZES
───────────────────────────────────────────────────────────── */
add_action('after_setup_theme', function () {
    // Card thumbnail (catalog grid)
    add_image_size('cna-card', 480, 360, true);
    // Single product main image
    add_image_size('cna-product', 900, 675, false);
    // Single product gallery thumb
    add_image_size('cna-thumb', 120, 90, true);
});

/* ─────────────────────────────────────────────────────────────
   PRODUCT META HELPER (shared between importer & templates)
───────────────────────────────────────────────────────────── */
if (!function_exists('cna_spec_meta_key')) {
    function cna_spec_meta_key(string $field): string {
        return '_cna_spec_' . sanitize_key($field);
    }
}

/* ─────────────────────────────────────────────────────────────
   REMOVE WC NOTICES ON ARCHIVE (we handle empty states in JS)
───────────────────────────────────────────────────────────── */
add_filter('woocommerce_product_loop_start', function ($loop_start) {
    return $loop_start;
});

/* ─────────────────────────────────────────────────────────────
   DISABLE WC STRUCTURED DATA ON ARCHIVE (perf)
───────────────────────────────────────────────────────────── */
add_filter('woocommerce_structured_data_enabled', function ($enabled) {
    return is_product() ? $enabled : false;
});

/* ─────────────────────────────────────────────────────────────
   PREVENT WC FROM REDIRECTING HOMEPAGE → SHOP
   (We use a custom front-page.php, not the WC shop page)
───────────────────────────────────────────────────────────── */
add_filter('woocommerce_prevent_automatic_wizard_redirect', '__return_true');

/* ─────────────────────────────────────────────────────────────
   CLEAN UP WC ADMIN NOTICES (non-essential)
───────────────────────────────────────────────────────────── */
add_filter('woocommerce_helper_suppress_admin_notices', '__return_true');

/* ─────────────────────────────────────────────────────────────
   PRODUCT CATEGORY IMAGE SIZE IN FILTER
───────────────────────────────────────────────────────────── */
add_filter('woocommerce_product_get_image', function ($image, $product, $size, $attr, $placeholder, $image_id) {
    // If WC can't find an image, fall back to _cna_image_url meta
    if ($image === '' || strpos($image, 'woocommerce-placeholder') !== false) {
        $url = get_post_meta($product->get_id(), '_cna_image_url', true);
        if ($url) {
            $alt = esc_attr($product->get_name());
            return '<img src="' . esc_url($url) . '" alt="' . $alt . '" class="woocommerce-product-gallery__image" loading="lazy">';
        }
    }
    return $image;
}, 10, 6);

/* ─────────────────────────────────────────────────────────────
   WOOCOMMERCE AJAX: filter products (catalog page)
   (Registered here so it's available early; logic in functions.php)
───────────────────────────────────────────────────────────── */
// Actions are added in functions.php to avoid duplication.

/* ─────────────────────────────────────────────────────────────
   SET WC PRODUCT PERMALINK BASE TO /products/
───────────────────────────────────────────────────────────── */
add_filter('woocommerce_product_rewrite_slug', function () {
    return 'products';
});

/* ─────────────────────────────────────────────────────────────
   DISABLE WC ACCOUNT / CHECKOUT (B2B catalog only site)
   Comment these out if you add e-commerce later.
───────────────────────────────────────────────────────────── */
// Uncomment to disable: removes My Account and Checkout from WC
// add_filter('woocommerce_is_purchasable', '__return_false');
// remove_action('woocommerce_single_product_summary', 'woocommerce_template_single_add_to_cart', 30);

/* ─────────────────────────────────────────────────────────────
   CATALOG-ONLY: HIDE PRICES & ADD TO CART
   B2B catalog — no public pricing or cart
───────────────────────────────────────────────────────────── */
add_filter('woocommerce_is_purchasable', '__return_false');
remove_action('woocommerce_single_product_summary', 'woocommerce_template_single_add_to_cart', 30);
remove_action('woocommerce_single_product_summary', 'woocommerce_template_single_price', 10);
remove_action('woocommerce_after_shop_loop_item',   'woocommerce_template_loop_add_to_cart', 10);
remove_action('woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_price', 10);

// Also hide price in REST API responses (security)
add_filter('woocommerce_rest_product_object_query', function ($args) {
    return $args;
});
