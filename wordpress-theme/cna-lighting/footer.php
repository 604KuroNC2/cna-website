<?php
$sub_links = [
  ['Dimmer Compatibility',    'dimmer-compatibility'],
  ['Freight Prepaid Policy',  'freight-prepaid-policy'],
  ['Warranty / Return Policy','warranty-return-policy'],
  ['FAQ',                     'faq'],
  ['Company History',         'company-history'],
  ['Contact',                 'contact'],
];
?>
<footer id="cna-footer" class="relative overflow-hidden"
        style="background:linear-gradient(135deg,#00002a 0%,#000060 50%,#000080 100%)">

  <!-- Grid overlay -->
  <div class="absolute inset-0 pointer-events-none opacity-30"
       style="background-image:linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px);background-size:60px 60px;"></div>

  <!-- Gold top line -->
  <div class="h-0.5 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent"></div>

  <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

      <!-- Brand -->
      <div class="footer-col lg:col-span-2">
        <?php
        $logo_url = get_template_directory_uri() . '/assets/images/cna-logo-white.png';
        $custom_logo_id = get_theme_mod('custom_logo');
        if ($custom_logo_id) $logo_url = wp_get_attachment_image_url($custom_logo_id, 'full');
        ?>
        <img src="<?php echo esc_url($logo_url); ?>" alt="<?php bloginfo('name'); ?>"
             class="h-12 w-auto object-contain object-left mb-6" />
        <p class="text-white/50 text-sm leading-relaxed max-w-xs mb-6">
          Premium LED lighting solutions for residential, commercial, and industrial applications.
          Trusted by professionals across Canada.
        </p>
        <div class="flex items-center gap-3">
          <?php foreach (['cUL Listed','cETLus','cTUVus'] as $cert): ?>
            <div class="px-3 py-1.5 border border-white/20 rounded-sm text-white/60 text-xs uppercase tracking-widest">
              <?php echo esc_html($cert); ?>
            </div>
          <?php endforeach; ?>
        </div>
      </div>

      <!-- SubMenu -->
      <div class="footer-col">
        <h4 class="text-white font-display font-bold text-lg uppercase tracking-wide mb-4">SubMenu</h4>
        <ul class="space-y-2">
          <?php foreach ($sub_links as [$label, $slug]):
            $page = get_page_by_path($slug);
            $href = $page ? get_permalink($page->ID) : home_url("/$slug/");
          ?>
            <li>
              <a href="<?php echo esc_url($href); ?>"
                 class="text-white/50 hover:text-[#FFD700] text-sm transition-colors duration-200">
                <?php echo esc_html($label); ?>
              </a>
            </li>
          <?php endforeach; ?>
        </ul>
      </div>

      <!-- Contact -->
      <div class="footer-col">
        <h4 class="text-white font-display font-bold text-lg uppercase tracking-wide mb-4">Contact</h4>
        <div class="space-y-3 text-sm text-white/50">
          <div class="flex items-start gap-3">
            <svg class="w-4 h-4 mt-0.5 text-[#FFD700] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span>Canada</span>
          </div>
          <div class="flex items-start gap-3">
            <svg class="w-4 h-4 mt-0.5 text-[#FFD700] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            <a href="mailto:info@cnalighting.com" class="hover:text-[#FFD700] transition-colors">info@cnalighting.com</a>
          </div>
          <div class="flex items-start gap-3">
            <svg class="w-4 h-4 mt-0.5 text-[#FFD700] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
            </svg>
            <a href="https://www.cnalighting.com" target="_blank" rel="noopener noreferrer"
               class="hover:text-[#FFD700] transition-colors">www.cnalighting.com</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p class="text-white/30 text-xs">
        &copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. All rights reserved.
      </p>
      <p class="text-white/20 text-xs">Premium LED Solutions &middot; Made in Canada</p>
    </div>
  </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
