<?php get_header(); ?>

<!-- ═══════════════════════════════════════════════════════
  HERO SECTION
════════════════════════════════════════════════════════ -->
<?php
$years = (int)floor((time() - strtotime('1988-03-01')) / (365.25 * 24 * 3600));
$shop_url = get_permalink(wc_get_page_id('shop'));
?>
<section id="hero" class="relative min-h-screen flex items-center overflow-hidden"
         style="background:linear-gradient(135deg,#00002a 0%,#000060 35%,#000080 65%,#0000a0 100%)">
  <canvas id="particle-canvas" class="absolute inset-0 w-full h-full"></canvas>

  <!-- Glow orbs -->
  <div class="absolute top-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none"
       style="background:radial-gradient(circle,rgba(255,215,0,0.08) 0%,transparent 70%);filter:blur(40px)"></div>
  <div class="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full pointer-events-none"
       style="background:radial-gradient(circle,rgba(0,0,200,0.2) 0%,transparent 70%);filter:blur(60px)"></div>

  <!-- Light beams -->
  <div id="beam1" class="absolute inset-y-0 pointer-events-none"
       style="width:30%;left:-30%;background:linear-gradient(90deg,transparent,rgba(255,215,0,0.04),transparent);transform:skewX(-20deg)"></div>
  <div id="beam2" class="absolute inset-y-0 pointer-events-none"
       style="width:20%;left:-20%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.03),transparent);transform:skewX(-15deg)"></div>

  <!-- Grid overlay -->
  <div class="absolute inset-0 pointer-events-none"
       style="background-image:linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px);background-size:80px 80px"></div>

  <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
    <div class="max-w-4xl">
      <div class="flex items-center gap-3 mb-6">
        <div class="h-px w-12 bg-[#FFD700]"></div>
        <span class="text-[#FFD700] text-sm font-medium uppercase tracking-[0.25em] font-body">Premium LED Solutions</span>
      </div>

      <div id="hero-headline" class="mb-6">
        <h1 class="font-display font-black leading-none tracking-tight text-white">
          <span class="hero-line block text-6xl sm:text-7xl lg:text-8xl xl:text-9xl" style="letter-spacing:-0.03em">ILLUMINATE</span>
          <span class="hero-line block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl gold-shimmer" style="letter-spacing:-0.02em">EVERY SPACE.</span>
          <span class="hero-line block text-3xl sm:text-4xl lg:text-5xl text-white/60 font-light" style="letter-spacing:0.02em">PERFECTLY.</span>
        </h1>
      </div>

      <p id="hero-subtitle" class="font-body text-white/60 text-lg sm:text-xl max-w-2xl mb-10 leading-relaxed">
        Canada&rsquo;s trusted source for high-efficiency LED lighting. From filament
        bulbs to commercial fixtures &mdash; engineered for performance, built to last.
      </p>

      <div id="hero-cta" class="flex flex-wrap gap-4 items-center">
        <a href="<?php echo esc_url($shop_url); ?>"
           class="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#FFD700] text-[#000080] font-bold text-sm uppercase tracking-[0.12em] rounded-sm overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(255,215,0,0.5)] active:scale-95">
          <span class="relative z-10">Browse Products</span>
          <svg class="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
          <div class="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
        </a>
        <a href="#about" class="inline-flex items-center gap-2 px-6 py-4 border border-white/20 text-white/80 hover:text-white hover:border-white/40 text-sm font-medium uppercase tracking-wide rounded-sm transition-all duration-200">
          Learn More
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
        </a>
      </div>
    </div>

    <!-- Stats bar -->
    <div class="mt-20 pt-12 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8">
      <?php
      $stats = [
        ['500+',                    'LED Products'],
        [$years . '+',              'Years Experience'],
        ['cUL / cETLus / cTUVus',   'Certified'],
        ['2–5yr',                   'Warranty'],
      ];
      foreach ($stats as [$val, $label]):
      ?>
        <div class="text-center md:text-left">
          <div class="font-display font-black text-3xl sm:text-4xl text-[#FFD700] mb-1 leading-tight"><?php echo esc_html($val); ?></div>
          <div class="text-white/50 text-sm uppercase tracking-widest font-body"><?php echo esc_html($label); ?></div>
        </div>
      <?php endforeach; ?>
    </div>
  </div>

  <div class="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
       style="background:linear-gradient(to bottom,transparent,rgba(248,248,252,0.3))"></div>
</section>

<!-- ═══════════════════════════════════════════════════════
  CATEGORIES SHOWCASE
════════════════════════════════════════════════════════ -->
<section id="categories" class="py-24 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="section-header text-center mb-14">
      <div class="flex items-center justify-center gap-3 mb-4">
        <div class="h-px w-10 bg-[#FFD700]"></div>
        <span class="text-[#000080] text-xs font-medium uppercase tracking-[0.25em]">Product Lines</span>
        <div class="h-px w-10 bg-[#FFD700]"></div>
      </div>
      <h2 class="font-display font-black text-5xl sm:text-6xl text-[#000080] tracking-tight">EXPLORE BY CATEGORY</h2>
      <p class="mt-4 text-gray-500 max-w-xl mx-auto">
        From everyday replacements to specialized commercial fixtures — every CNA product delivers exceptional performance and longevity.
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <?php
      $showcase_cats = [
        ['Filament Bulbs',        'Vintage style, modern efficiency. A19, ST19, G25, T30 and more.',          'filament-bulbs',        'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'],
        ['General Purpose',       'Everyday LED A-series bulbs in single pack and multi-pack options.',        'general-purpose',        'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'],
        ['Reflectors & Spotlights','MR16, GU10, PAR lamps for accent and directional lighting.',              'reflectors-spotlights',  'https://images.pexels.com/photos/2079246/pexels-photo-2079246.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'],
        ['Miniature Bulbs',       'G4, G9, E11, J-Type specialty bulbs for fixtures and appliances.',         'miniature-bulbs',        'https://images.pexels.com/photos/1123262/pexels-photo-1123262.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'],
        ['Downlights',            'Recessed LED potlights for residential and commercial ceilings.',           'downlights',             'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'],
        ['Strip Lights',          'Flexible LED strips for under-cabinet, cove, and accent lighting.',         'strip-lights',           'https://images.pexels.com/photos/2062431/pexels-photo-2062431.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'],
      ];
      foreach ($showcase_cats as [$name, $desc, $slug, $img]):
        $term = get_term_by('slug', $slug, 'product_cat');
        $href = $term ? get_term_link($term) : add_query_arg('cat', $slug, $shop_url);
      ?>
        <a href="<?php echo esc_url($href); ?>"
           class="category-card group relative overflow-hidden rounded-sm border border-gray-100 hover:border-[#000080]/30 transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,0,128,0.15)]"
           style="min-height:260px">
          <img src="<?php echo esc_url($img); ?>" alt="<?php echo esc_attr($name); ?>"
               class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div class="absolute inset-0 bg-gradient-to-t from-[#000060]/90 via-[#000080]/50 to-black/20 group-hover:from-[#000080]/95 transition-all duration-300"></div>
          <div class="absolute top-0 left-0 right-0 h-0.5 bg-[#FFD700] scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left"></div>
          <div class="relative p-7 flex flex-col justify-end h-full" style="min-height:260px">
            <div class="mt-auto">
              <h3 class="font-display font-black text-2xl text-white mb-2 group-hover:text-[#FFD700] transition-colors duration-300 leading-tight"><?php echo esc_html($name); ?></h3>
              <p class="text-white/70 text-sm leading-relaxed mb-4"><?php echo esc_html($desc); ?></p>
              <div class="flex items-center gap-2 text-[#FFD700] text-xs font-bold uppercase tracking-widest">
                Shop Now
                <svg class="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </div>
            </div>
          </div>
        </a>
      <?php endforeach; ?>
    </div>

    <div class="mt-10 text-center">
      <a href="<?php echo esc_url($shop_url); ?>"
         class="inline-flex items-center gap-3 px-8 py-4 bg-[#000080] text-white font-bold text-sm uppercase tracking-wide rounded-sm hover:bg-[#0000a0] transition-all duration-200 hover:shadow-[0_8px_30px_rgba(0,0,128,0.3)]">
        View All Products
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
        </svg>
      </a>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════
  WHY CNA
════════════════════════════════════════════════════════ -->
<section id="about" class="py-24 relative overflow-hidden"
         style="background:linear-gradient(135deg,#f8f8fc 0%,#eef0f8 100%)">
  <div class="absolute right-0 top-0 bottom-0 w-1/3 pointer-events-none"
       style="background:linear-gradient(135deg,transparent,rgba(0,0,128,0.03))"></div>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="why-heading max-w-2xl mb-14">
      <div class="flex items-center gap-3 mb-4">
        <div class="h-px w-10 bg-[#FFD700]"></div>
        <span class="text-[#000080] text-xs font-medium uppercase tracking-[0.25em]">Why CNA</span>
      </div>
      <h2 class="font-display font-black text-5xl sm:text-6xl text-[#000080] tracking-tight leading-none">
        ENGINEERED FOR<br>
        <span class="text-[#FFD700]" style="-webkit-text-stroke:2px #000080">PERFORMANCE.</span>
      </h2>
      <p class="mt-6 text-gray-500 text-lg leading-relaxed">
        CNA Lighting has been supplying high-quality LED solutions across Canada for over two decades.
        Every product is rigorously tested and certified before it reaches your hands.
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <?php
      $features = [
        ['North American Certified',  'All products carry cUL, cETLus, or cTUVus certification — meeting the highest North American electrical safety standards.',
         '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>'],
        ['High Efficiency',           'Up to 130+ lm/W efficacy across our product lines. Replace incandescent and halogen fixtures and cut energy costs by up to 80%.',
         '<path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>'],
        ['Long Rated Life',           '15,000–25,000+ hour rated life (L70) on most products. Fewer replacements, lower maintenance costs.',
         '<path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>'],
        ['Detailed Spec Sheets',      'Every product includes a downloadable spec sheet with full photometric data, dimensions, and installation guidance.',
         '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>'],
        ['Dimmable Options',          'Most CNA products are dimmable and compatible with standard TRIAC dimmers. Check product spec for Lutron compatibility.',
         '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>'],
        ['Wide Product Range',        '500+ SKUs across residential, hospitality, commercial, and industrial applications — all in one trusted brand.',
         '<path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>'],
      ];
      foreach ($features as [$title, $desc, $path]):
      ?>
        <div class="why-item group bg-white rounded-sm p-6 border border-gray-100 hover:border-[#000080]/20 hover:shadow-[0_8px_30px_rgba(0,0,128,0.08)] transition-all duration-300">
          <div class="w-12 h-12 rounded-sm bg-[#000080]/06 flex items-center justify-center text-[#000080] mb-4 group-hover:bg-[#000080] group-hover:text-white transition-all duration-300">
            <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <?php echo $path; ?>
            </svg>
          </div>
          <h3 class="font-display font-bold text-xl text-[#000080] mb-2"><?php echo esc_html($title); ?></h3>
          <p class="text-gray-500 text-sm leading-relaxed"><?php echo esc_html($desc); ?></p>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<?php get_footer(); ?>
