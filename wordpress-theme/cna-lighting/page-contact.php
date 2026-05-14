<?php
defined('ABSPATH') || exit;
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
        Contact Us
      </h1>
      <p class="mt-3 text-white/50 text-lg max-w-2xl">
        CNA International Enterprises Inc. — Head Office in Burnaby, BC.
      </p>
    </div>
  </div>

  <!-- Content -->
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
    <div class="prose-cna">

      <!-- Top two-column cards -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.5rem;margin-bottom:2rem;">

        <!-- Head Office -->
        <div class="contact-card">
          <h3 style="display:flex;align-items:center;gap:0.5rem;">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#000080" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            Head Office &amp; Vancouver Warehouse
          </h3>
          <p style="margin:0.5rem 0 0 0;line-height:1.7;">
            CNA International Enterprises Inc.<br>
            #8 – 8980 Fraserwood Court<br>
            Burnaby, BC, Canada V5J 5H7
          </p>
          <div style="margin-top:1rem;display:flex;flex-direction:column;gap:0.3rem;font-size:0.9rem;">
            <span><strong>Tel:</strong> <a href="tel:6044382862">604.438.2862</a></span>
            <span><strong>Toll Free:</strong> <a href="tel:18777722862">877.772.2862</a></span>
            <span><strong>Fax:</strong> 604.438.2972</span>
            <span><strong>Toll Free Fax:</strong> 877.772.2972</span>
          </div>
        </div>

        <!-- Office Hours -->
        <div class="contact-card">
          <h3 style="display:flex;align-items:center;gap:0.5rem;">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#000080" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2"/>
            </svg>
            Office Hours — Burnaby
          </h3>
          <table style="margin-top:0.5rem;margin-bottom:0;font-size:0.875rem;">
            <tbody>
              <tr>
                <td style="padding:0.3rem 0.75rem 0.3rem 0;font-weight:600;white-space:nowrap;border:none;background:none;">Mon – Wed &amp; Fri</td>
                <td style="padding:0.3rem 0;border:none;background:none;">9:00 AM – 4:30 PM</td>
              </tr>
              <tr>
                <td style="padding:0.3rem 0.75rem 0.3rem 0;font-weight:600;border:none;background:none;">Thursday</td>
                <td style="padding:0.3rem 0;border:none;background:none;">10:00 AM – 4:30 PM</td>
              </tr>
              <tr>
                <td style="padding:0.3rem 0.75rem 0.3rem 0;font-weight:600;border:none;background:none;">Sat – Sun</td>
                <td style="padding:0.3rem 0;color:#9ca3af;border:none;background:none;">Closed</td>
              </tr>
            </tbody>
          </table>
          <h3 style="margin-top:1.25rem;display:flex;align-items:center;gap:0.5rem;">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#000080" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
            Warehouse — Pickups &amp; Deliveries
          </h3>
          <table style="margin-top:0.5rem;margin-bottom:0;font-size:0.875rem;">
            <tbody>
              <tr>
                <td style="padding:0.3rem 0.75rem 0.3rem 0;font-weight:600;white-space:nowrap;border:none;background:none;">Mon – Wed &amp; Fri</td>
                <td style="padding:0.3rem 0;border:none;background:none;">9:00 AM – 4:00 PM</td>
              </tr>
              <tr>
                <td style="padding:0.3rem 0.75rem 0.3rem 0;font-weight:600;border:none;background:none;">Thursday</td>
                <td style="padding:0.3rem 0;border:none;background:none;">11:00 AM – 4:00 PM</td>
              </tr>
              <tr>
                <td style="padding:0.3rem 0.75rem 0.3rem 0;font-weight:600;border:none;background:none;">Sat – Sun</td>
                <td style="padding:0.3rem 0;color:#9ca3af;border:none;background:none;">Closed</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      <h2>Additional Warehouse Locations</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1rem;">
        <div class="contact-card">
          <h3 style="margin:0 0 0.5rem 0;font-size:0.95rem;">Bulk Orders — Western Canada</h3>
          <p style="margin:0;font-size:0.9rem;line-height:1.6;">
            AVP Carriers Ltd.<br>
            9445 189 Street<br>
            Surrey, BC V4N 5L8
          </p>
        </div>
        <div class="contact-card">
          <h3 style="margin:0 0 0.5rem 0;font-size:0.95rem;">Central Canada Distribution</h3>
          <p style="margin:0;font-size:0.9rem;line-height:1.6;">
            QRC Logistics<br>
            8020 Fifth Line N<br>
            Halton Hills, ON L7G 0B8
          </p>
        </div>
      </div>

      <div class="info-box" style="margin-top:2rem;">
        <p>
          CNA sells exclusively through authorized distributors and electrical wholesalers.
          If you are an end customer, please <a href="<?php echo esc_url(home_url('/faq')); ?>">see our FAQ</a> to locate your nearest distributor.
        </p>
      </div>

    </div>
  </div>

</div>
<?php get_footer(); ?>
