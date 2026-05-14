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
        Freight Prepaid Policy
      </h1>
      <p class="mt-3 text-white/50 text-lg max-w-2xl">
        Prepaid freight thresholds and estimated delivery times from our Canadian warehouses.
      </p>
    </div>
  </div>

  <!-- Content -->
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
    <div class="prose-cna">

      <div class="info-box">
        <p>
          Prepaid freight is subject to stock availability. Contact us for details on special orders or orders outside standard coverage areas.
        </p>
      </div>

      <h2>Domestic Shipments — Vancouver Warehouse</h2>
      <p><strong>Minimum Order:</strong> $50.00</p>
      <table>
        <thead>
          <tr><th>Location</th><th>Prepaid Freight Threshold</th><th>Estimated Delivery</th></tr>
        </thead>
        <tbody>
          <tr><td>Greater Vancouver</td><td>$350+</td><td>1–2 business days</td></tr>
          <tr><td>British Columbia</td><td>$500+</td><td>1–2 business days</td></tr>
          <tr><td>Alberta</td><td>$750+</td><td>1–2 business days</td></tr>
          <tr><td>Saskatchewan</td><td>$750+</td><td>2–3 business days</td></tr>
          <tr><td>Manitoba</td><td>$750+</td><td>4–5 business days</td></tr>
          <tr><td>Ontario</td><td>$1,000+</td><td>5 business days</td></tr>
          <tr><td>Quebec</td><td>$1,000+</td><td>5 business days</td></tr>
        </tbody>
      </table>

      <h2>Domestic Shipments — Toronto Warehouse</h2>
      <p><strong>Minimum Order:</strong> $100.00</p>
      <table>
        <thead>
          <tr><th>Location</th><th>Prepaid Freight Threshold</th><th>Estimated Delivery</th></tr>
        </thead>
        <tbody>
          <tr><td>Greater Toronto</td><td>$350+</td><td>1–2 business days</td></tr>
          <tr><td>Ontario</td><td>$500+</td><td>1–2 business days</td></tr>
          <tr><td>Quebec</td><td>$750+</td><td>2 business days</td></tr>
          <tr><td>Atlantic Provinces</td><td>$1,000+</td><td>3 business days</td></tr>
        </tbody>
      </table>

      <h2>International Shipments — Contiguous United States</h2>
      <p><strong>Minimum Order:</strong> $100.00</p>
      <table>
        <thead>
          <tr><th>Location</th><th>Prepaid Freight Threshold</th><th>Estimated Delivery</th></tr>
        </thead>
        <tbody>
          <tr><td>USA (Lower 48 States)</td><td>$1,500+</td><td>Varies by destination</td></tr>
        </tbody>
      </table>

      <h2>Contact Us</h2>
      <div class="contact-card">
        <p style="margin:0;">
          <strong>Tel:</strong> 604.438.2862 &nbsp;|&nbsp;
          <strong>Toll Free:</strong> 877.772.2862<br>
          <strong>Fax:</strong> 604.438.2972 &nbsp;|&nbsp;
          <strong>Toll Free Fax:</strong> 877.772.2972
        </p>
      </div>

    </div>
  </div>

</div>
<?php get_footer(); ?>
