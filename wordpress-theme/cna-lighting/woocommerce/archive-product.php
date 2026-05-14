<?php defined('ABSPATH') || exit; ?>
<?php get_header(); ?>

<?php
$category_tree   = cna_get_category_tree();
$current_main    = sanitize_text_field($_GET['main_cat'] ?? '');
$current_sub     = sanitize_text_field($_GET['sub_cat']  ?? '');
$current_search  = sanitize_text_field($_GET['search']   ?? '');
$total_products  = wp_count_posts('product')->publish ?? 0;

// Initial query
$init_args = [
    'post_type'      => 'product',
    'post_status'    => 'publish',
    'posts_per_page' => 24,
    'paged'          => 1,
];
if ($current_sub) {
    $init_args['tax_query'] = [['taxonomy' => 'product_cat', 'field' => 'slug', 'terms' => $current_sub]];
} elseif ($current_main) {
    $init_args['tax_query'] = [['taxonomy' => 'product_cat', 'field' => 'slug', 'terms' => $current_main, 'include_children' => true]];
}
if ($current_search) $init_args['s'] = $current_search;

$init_query = new WP_Query($init_args);
$filtered_total = $init_query->found_posts;
?>

<div class="min-h-screen bg-[#f8f8fc]">

  <!-- Page header -->
  <div id="catalog-header" class="pt-20 pb-0"
       style="background:linear-gradient(135deg,#00002a 0%,#000060 50%,#000080 100%)">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="flex items-center gap-3 mb-3">
        <div class="h-px w-8 bg-[#FFD700]"></div>
        <span class="text-[#FFD700] text-xs font-medium uppercase tracking-[0.25em]">Product Catalog</span>
      </div>
      <div class="flex flex-wrap items-end justify-between gap-6">
        <h1 class="font-display font-black text-4xl sm:text-5xl text-white tracking-tight">LED PRODUCT CATALOG</h1>
      </div>

      <!-- Search row -->
      <div class="mt-6 flex flex-wrap gap-3 items-center">
        <div class="relative flex-1 min-w-[260px] max-w-xl">
          <input id="cna-search" type="text"
                 value="<?php echo esc_attr($current_search); ?>"
                 placeholder="Search products, specs, SKUs, base type..."
                 class="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/40 text-sm rounded-sm focus:outline-none focus:border-[#FFD700] focus:bg-white/15 transition-all" />
          <svg class="absolute left-3 top-3.5 w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <button id="cna-search-clear" class="absolute right-3 top-3 text-white/40 hover:text-white transition-colors hidden">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>

  <div id="results-anchor"></div>

  <!-- Main content -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex flex-col lg:flex-row gap-8">

      <!-- Sidebar -->
      <aside class="lg:w-60 xl:w-64 flex-shrink-0">
        <div class="sticky top-24">
          <!-- Results count -->
          <div class="mb-4 pb-4 border-b border-gray-200">
            <div class="text-xs text-gray-500 uppercase tracking-widest mb-1">Results</div>
            <div class="font-display font-bold text-2xl text-[#000080]">
              <span id="filtered-count"><?php echo esc_html($filtered_total); ?></span>
              <span class="text-sm font-normal text-gray-400 ml-1">/ <?php echo esc_html($total_products); ?></span>
            </div>
          </div>

          <!-- All products -->
          <button id="btn-all"
                  class="w-full text-left px-3 py-2 rounded-sm text-sm font-medium mb-2 transition-colors <?php echo (!$current_main && !$current_sub) ? 'bg-[#000080] text-white' : 'text-gray-600 hover:bg-gray-100'; ?>"
                  data-main="" data-sub="">
            All Products
          </button>

          <!-- Category tree -->
          <div class="space-y-1 overflow-y-hidden hover:overflow-y-auto transition-all cna-sidebar-scroll"
               style="max-height:calc(100vh - 18rem)">
            <?php foreach ($category_tree as $main): ?>
              <div class="cat-group">
                <button class="cat-main-btn w-full flex items-center justify-between px-3 py-2 rounded-sm text-sm font-semibold transition-colors <?php echo $current_main === $main['slug'] ? 'text-[#000080] bg-[#000080]/08' : 'text-gray-700 hover:bg-gray-100'; ?>"
                        data-slug="<?php echo esc_attr($main['slug']); ?>"
                        data-name="<?php echo esc_attr($main['name']); ?>">
                  <span class="flex items-center gap-2 text-left">
                    <svg class="cat-chevron w-3 h-3 flex-shrink-0 transition-transform duration-200 <?php echo $current_main === $main['slug'] ? 'rotate-90' : ''; ?>"
                         fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                    </svg>
                    <?php echo esc_html($main['name']); ?>
                  </span>
                </button>

                <?php if ($main['children']): ?>
                  <div class="cat-children ml-4 mt-1 space-y-0.5 border-l border-gray-200 pl-3 <?php echo $current_main === $main['slug'] ? '' : 'hidden'; ?>">
                    <?php foreach ($main['children'] as $child): ?>
                      <button class="cat-sub-btn w-full text-left px-2 py-1.5 rounded-sm text-xs font-medium transition-colors leading-tight <?php echo $current_sub === $child['slug'] ? 'text-[#000080] bg-[#000080]/08' : 'text-gray-600 hover:bg-gray-100'; ?>"
                              data-slug="<?php echo esc_attr($child['slug']); ?>"
                              data-name="<?php echo esc_attr($child['name']); ?>"
                              data-parent="<?php echo esc_attr($main['slug']); ?>">
                        <?php echo esc_html($child['name']); ?>
                      </button>
                    <?php endforeach; ?>
                  </div>
                <?php endif; ?>
              </div>
            <?php endforeach; ?>
          </div>

          <!-- Clear all -->
          <button id="btn-clear-all"
                  class="mt-4 w-full text-center text-xs text-[#000080] hover:text-[#0000c0] font-medium py-2 border border-[#000080]/20 rounded-sm hover:border-[#000080]/40 transition-all <?php echo (!$current_main && !$current_sub && !$current_search) ? 'hidden' : ''; ?>">
            Clear all filters
          </button>
        </div>
      </aside>

      <!-- Product grid -->
      <div class="flex-1 min-w-0">
        <!-- Breadcrumb -->
        <div id="cna-breadcrumb" class="flex items-center gap-2 mb-4 text-xs text-gray-500 <?php echo (!$current_main && !$current_sub) ? 'hidden' : ''; ?>">
          <button class="hover:text-[#000080]" data-action="clear-all">All</button>
          <?php if ($current_main): ?>
            <span class="text-gray-300">/</span>
            <span class="text-[#000080] font-medium" id="breadcrumb-main"><?php echo esc_html(get_term_by('slug', $current_main, 'product_cat')->name ?? $current_main); ?></span>
          <?php endif; ?>
          <?php if ($current_sub): ?>
            <span class="text-gray-300">/</span>
            <span class="text-[#000080] font-medium" id="breadcrumb-sub"><?php echo esc_html(get_term_by('slug', $current_sub, 'product_cat')->name ?? $current_sub); ?></span>
          <?php endif; ?>
        </div>

        <!-- Loading spinner (hidden initially) -->
        <div id="cna-loading" class="hidden">
          <div class="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            <?php for ($i = 0; $i < 8; $i++): ?>
              <div class="bg-white rounded-sm h-72 animate-pulse border border-gray-100">
                <div class="h-48 bg-gray-100 rounded-t-sm"></div>
                <div class="p-4 space-y-2"><div class="h-3 bg-gray-100 rounded w-1/3"></div><div class="h-4 bg-gray-100 rounded w-3/4"></div></div>
              </div>
            <?php endfor; ?>
          </div>
        </div>

        <!-- Product grid -->
        <div id="cna-grid" class="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          <?php
          if ($init_query->have_posts()) {
              while ($init_query->have_posts()) {
                  $init_query->the_post();
                  $product = wc_get_product(get_the_ID());
                  if ($product) {
                      echo '<div class="product-card-wrap">';
                      cna_product_card($product);
                      echo '</div>';
                  }
              }
              wp_reset_postdata();
          } else {
              echo '<div class="col-span-full text-center py-20">
                <div class="text-6xl mb-4">💡</div>
                <h3 class="font-display font-bold text-2xl text-[#000080] mb-2">No products found</h3>
                <p class="text-gray-500 mb-6">Try adjusting your search or filters.</p>
              </div>';
          }
          ?>
        </div>

        <!-- Load more -->
        <?php if ($init_query->max_num_pages > 1): ?>
          <div id="load-more-wrap" class="mt-10 text-center">
            <button id="btn-load-more"
                    data-page="1"
                    data-has-more="<?php echo esc_attr($init_query->max_num_pages > 1 ? '1' : '0'); ?>"
                    class="px-10 py-4 bg-[#000080] text-white font-bold text-sm uppercase tracking-wide rounded-sm hover:bg-[#0000a0] transition-all duration-200 hover:shadow-[0_8px_30px_rgba(0,0,128,0.3)]">
              Load More
              <span id="load-more-count" class="ml-2 text-white/60">(<?php echo $filtered_total - 24; ?> remaining)</span>
            </button>
          </div>
        <?php else: ?>
          <div id="load-more-wrap" class="hidden"></div>
        <?php endif; ?>

        <p id="showing-count" class="text-center text-xs text-gray-400 mt-6">
          Showing <?php echo min(24, $filtered_total); ?> of <?php echo $filtered_total; ?> products
        </p>
      </div>
    </div>
  </div>
</div>

<?php get_footer(); ?>
