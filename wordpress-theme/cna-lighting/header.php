<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="profile" href="https://gmpg.org/xfn/11">
  <?php wp_head(); ?>
</head>
<body <?php body_class('font-body antialiased'); ?>>
<?php wp_body_open(); ?>

<nav id="cna-nav" class="fixed top-0 left-0 right-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
     style="background:linear-gradient(135deg,rgba(0,0,42,0.85) 0%,rgba(0,0,96,0.85) 35%,rgba(0,0,128,0.85) 65%,rgba(0,0,160,0.85) 100%);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16 lg:h-20">

      <!-- Logo -->
      <div id="nav-logo">
        <a href="<?php echo esc_url(home_url('/')); ?>" class="flex items-center gap-3 group">
          <?php
          $logo_url = get_template_directory_uri() . '/assets/images/cna-logo-white.png';
          $custom_logo_id = get_theme_mod('custom_logo');
          if ($custom_logo_id) {
            $logo_url = wp_get_attachment_image_url($custom_logo_id, 'full');
          }
          ?>
          <img src="<?php echo esc_url($logo_url); ?>" alt="<?php bloginfo('name'); ?>"
               class="h-10 w-auto object-contain object-left" />
        </a>
      </div>

      <!-- Desktop nav -->
      <div id="nav-links" class="hidden md:flex items-center gap-1">
        <a href="<?php echo esc_url(home_url('/')); ?>"
           class="<?php echo is_front_page() ? 'text-[#FFD700]' : 'text-white/80 hover:text-white'; ?> nav-link relative px-4 py-2 text-sm font-medium tracking-wide uppercase transition-colors duration-200 group">
          Home
          <span class="nav-underline absolute bottom-0 left-4 right-4 h-0.5 bg-[#FFD700] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left <?php echo is_front_page() ? 'scale-x-100' : ''; ?>"></span>
        </a>
        <a href="<?php echo esc_url(get_permalink(wc_get_page_id('shop'))); ?>"
           class="<?php echo is_shop() || is_product_category() || is_product() ? 'text-[#FFD700]' : 'text-white/80 hover:text-white'; ?> nav-link relative px-4 py-2 text-sm font-medium tracking-wide uppercase transition-colors duration-200 group">
          Products
          <span class="nav-underline absolute bottom-0 left-4 right-4 h-0.5 bg-[#FFD700] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left <?php echo is_shop() || is_product_category() || is_product() ? 'scale-x-100' : ''; ?>"></span>
        </a>
        <?php
        $info_pages = [
            ['Company History', 'company-history'],
            ['Contact',         'contact'],
        ];
        foreach ($info_pages as [$label, $slug]):
            $page = get_page_by_path($slug);
            $href = $page ? get_permalink($page->ID) : home_url("/$slug/");
            $active = is_page($slug);
        ?>
        <a href="<?php echo esc_url($href); ?>"
           class="<?php echo $active ? 'text-[#FFD700]' : 'text-white/80 hover:text-white'; ?> nav-link relative px-4 py-2 text-sm font-medium tracking-wide uppercase transition-colors duration-200 group">
          <?php echo esc_html($label); ?>
          <span class="nav-underline absolute bottom-0 left-4 right-4 h-0.5 bg-[#FFD700] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left <?php echo $active ? 'scale-x-100' : ''; ?>"></span>
        </a>
        <?php endforeach; ?>

        <a href="<?php echo esc_url(get_permalink(wc_get_page_id('shop'))); ?>"
           class="ml-4 px-5 py-2.5 bg-[#FFD700] text-[#000080] text-sm font-bold uppercase tracking-wide rounded-sm hover:bg-[#FFE44D] transition-all duration-200 hover:shadow-[0_4px_20px_rgba(255,215,0,0.4)] active:scale-95">
          Browse Catalog
        </a>
      </div>

      <!-- Mobile hamburger -->
      <button id="mobile-menu-btn" class="md:hidden flex flex-col gap-1.5 p-2" aria-label="Toggle menu" aria-expanded="false">
        <span class="burger-line block h-0.5 w-6 bg-white transition-all duration-300"></span>
        <span class="burger-line block h-0.5 w-6 bg-white transition-all duration-300"></span>
        <span class="burger-line block h-0.5 w-6 bg-white transition-all duration-300"></span>
      </button>
    </div>
  </div>

  <!-- Mobile menu -->
  <div id="mobile-menu" class="md:hidden overflow-hidden transition-all duration-400 max-h-0 opacity-0 bg-[#000060]/98 backdrop-blur-md">
    <div class="px-4 py-4 flex flex-col gap-1">
      <a href="<?php echo esc_url(home_url('/')); ?>"
         class="px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-sm transition-colors font-medium uppercase tracking-wide text-sm">Home</a>
      <a href="<?php echo esc_url(get_permalink(wc_get_page_id('shop'))); ?>"
         class="px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-sm transition-colors font-medium uppercase tracking-wide text-sm">Products</a>
      <?php foreach ($info_pages as [$label, $slug]):
        $page = get_page_by_path($slug);
        $href = $page ? get_permalink($page->ID) : home_url("/$slug/");
      ?>
      <a href="<?php echo esc_url($href); ?>"
         class="px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-sm transition-colors font-medium uppercase tracking-wide text-sm">
        <?php echo esc_html($label); ?>
      </a>
      <?php endforeach; ?>
      <a href="<?php echo esc_url(get_permalink(wc_get_page_id('shop'))); ?>"
         class="mt-2 px-4 py-3 bg-[#FFD700] text-[#000080] font-bold text-sm uppercase tracking-wide text-center rounded-sm">
        Browse Catalog
      </a>
    </div>
  </div>
</nav>
