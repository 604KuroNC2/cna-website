<?php
defined('ABSPATH') || exit;
$years = (int) floor((time() - mktime(0,0,0,3,1,1988)) / (365.25 * 24 * 60 * 60));
get_header();
?>
<div class="min-h-screen bg-[#f8f8fc]">

  <!-- Page header -->
  <div class="pt-20" style="background:linear-gradient(135deg,#00002a 0%,#000060 50%,#000080 100%)">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div class="flex items-center gap-3 mb-4">
        <div class="h-px w-8 bg-[#FFD700]"></div>
        <a href="<?php echo esc_url(home_url('/')); ?>"
           class="text-[#FFD700] text-xs font-medium uppercase tracking-[0.25em] hover:text-white transition-colors">
          CNA Lighting
        </a>
      </div>
      <h1 class="font-display font-black text-4xl sm:text-5xl text-white tracking-tight leading-tight">
        Company History
      </h1>
      <p class="mt-3 text-white/50 text-lg max-w-2xl">
        <?php echo $years; ?>+ years of lighting excellence — trusted by distributors across Canada.
      </p>
    </div>
  </div>

  <!-- Content -->
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
    <div class="prose-cna">

      <h2>About CNA Lighting</h2>
      <p>
        CNA Lighting is a division of <strong>CNA International Enterprises Inc.</strong>, a privately held Canadian company
        established in <strong>March 1988</strong>. For over <?php echo $years; ?> years, CNA has been dedicated to delivering
        high-quality lighting products and excellent prompt service to customers across Canada.
      </p>

      <h2>Our Beginning</h2>
      <p>
        CNA began its journey with the introduction of its first halogen light bulb in 1988. What started as a focused
        specialty product line grew steadily as demand for reliable, quality lighting solutions expanded throughout Canada.
        From the outset, CNA committed to standing behind every product it sells — a philosophy that continues to define
        the company today.
      </p>

      <h2>The Shift to LED</h2>
      <p>
        As the lighting industry evolved, CNA adapted and invested heavily in LED technology. Today, the company's
        catalog is anchored by a wide range of high-performance LED light bulbs and fixtures. While limited halogen, CFL,
        and HID product lines remain available for specific applications, LED products are now the cornerstone of the CNA
        offering — reflecting the industry-wide shift toward energy efficiency and longevity.
      </p>

      <h2>Serving the Trade</h2>
      <p>
        CNA sells exclusively through the trade — lighting distributors, electrical wholesalers, and lighting showrooms
        throughout Canada. This focused distribution model allows CNA to maintain strong relationships with its partners
        and ensure consistent product availability and support.
      </p>
      <p>
        To serve customers across the country, CNA operates well-stocked inventory across <strong>three Canadian warehouses</strong>:
      </p>
      <ul>
        <li><strong>Burnaby, BC</strong> — Head Office &amp; West Coast distribution</li>
        <li><strong>Surrey, BC</strong> — Bulk order facility (AVP Carriers Ltd.)</li>
        <li><strong>Halton Hills, ON</strong> — Central Canada distribution (QRC Logistics)</li>
      </ul>

      <h2>Innovation &amp; Product Development</h2>
      <p>
        Year after year, CNA introduces new and innovative lighting products to the Canadian market. The company
        continuously monitors industry developments and customer needs to expand and refine its product lineup.
        Subscribers to CNA's email list receive monthly updates on new product introductions.
      </p>

      <h2>Quality &amp; Certifications</h2>
      <p>
        CNA puts its brand name on everything it sells — a statement of accountability and confidence in product quality.
        CNA products are certified to <strong>cUL</strong>, <strong>cETLus</strong>, and <strong>cTUVus</strong> standards,
        meeting the safety and performance requirements for the Canadian and North American markets.
      </p>

      <!-- Stats block -->
      <div style="background:linear-gradient(135deg,#00002a 0%,#000060 100%);border-radius:4px;padding:2rem;margin-top:2.5rem;display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:1.5rem;text-align:center;">
        <?php
        foreach ([
          [$years . '+', 'Years in Business'],
          ['500+',        'LED Products'],
          ['3',           'Canadian Warehouses'],
          ['2–5yr',       'LED Warranty'],
        ] as [$val, $label]):
        ?>
          <div>
            <div style="font-size:2.2rem;font-weight:900;color:#FFD700;line-height:1.1;"><?php echo esc_html($val); ?></div>
            <div style="font-size:0.75rem;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.1em;margin-top:0.3rem;"><?php echo esc_html($label); ?></div>
          </div>
        <?php endforeach; ?>
      </div>

    </div>
  </div>

</div>
<?php get_footer(); ?>
