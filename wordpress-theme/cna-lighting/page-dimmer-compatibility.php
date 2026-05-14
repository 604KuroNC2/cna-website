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
        Dimmer Compatibility
      </h1>
      <p class="mt-3 text-white/50 text-lg max-w-2xl">
        Recommended dimmers for use with CNA dimmable LED products.
      </p>
    </div>
  </div>

  <!-- Content -->
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
    <div class="prose-cna">

      <div class="info-box">
        <p>
          CNA's dimmable LED products are designed to work with <strong>FORWARD PHASE / LEADING EDGE</strong> load type dimmers.
          If using a programmable dimmer, configure it to Forward Phase / Leading Edge mode — many dimmers ship preset to Reverse Phase / Trailing Edge by default.
        </p>
      </div>

      <h2>Setup Instructions</h2>
      <ul>
        <li>Adjust the <strong>Low End Trim</strong> on your dimmer to prevent flickering at minimum brightness levels.</li>
        <li>Prefer dimmers with a <strong>Neutral Wire</strong> connection to eliminate ghosting (faint glow) when the light is switched off.</li>
        <li>Consult your dimmer's operating manual for adjustment procedures.</li>
      </ul>

      <h2>Recommended Lutron Wired Dimmers</h2>
      <table>
        <thead>
          <tr><th>Rating</th><th>Model</th><th>Notes</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><span class="badge badge-gold">Best</span></td>
            <td><strong>DVELV-300P</strong></td>
            <td>Top-rated performance with CNA LED products</td>
          </tr>
          <tr>
            <td><span class="badge badge-blue">Good</span></td>
            <td><strong>DVCL-153P</strong></td>
            <td>Reliable CFL/LED compatible dimmer</td>
          </tr>
          <tr>
            <td><span class="badge badge-gray">Average</span></td>
            <td><strong>DV-600P</strong></td>
            <td>Works with proper Low End Trim adjustment</td>
          </tr>
        </tbody>
      </table>

      <h2>Recommended Wireless Dimmers</h2>
      <table>
        <thead>
          <tr><th>Rating</th><th>Model</th><th>Notes</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><span class="badge badge-gold">Best</span></td>
            <td><strong>Lutron Caséta PRO</strong></td>
            <td>Includes Neutral wire connection — eliminates ghosting. Must change default setting from Reverse Phase to <strong>Forward Phase</strong>.</td>
          </tr>
          <tr>
            <td><span class="badge badge-blue">Good</span></td>
            <td><strong>Lutron Caséta</strong></td>
            <td>Must change default setting from Reverse Phase to <strong>Forward Phase</strong>. No Neutral connection — some ghosting may occur.</td>
          </tr>
        </tbody>
      </table>

      <div class="info-box">
        <p>
          <strong>Caséta Note:</strong> Both Caséta models ship preset to Reverse Phase. You must manually change to Forward Phase mode. Refer to the Lutron app or dimmer manual for instructions.
        </p>
      </div>

      <h2>Other Dimmers</h2>
      <p>
        CNA LED products may work with other Forward Phase / Leading Edge load type dimmers with proper Low End Trim adjustment.
        Performance can vary depending on the specific fixture and load. We recommend testing before large installations.
      </p>

      <h2>Compatible Product Categories</h2>
      <p>Dimmer compatibility applies to CNA dimmable products across the following categories:</p>
      <ul>
        <li>LED Filament Bulbs (A19, ST19, G25, T30, and more)</li>
        <li>General Purpose LED Bulbs</li>
        <li>Reflectors &amp; Spotlights (MR16, GU10, PAR lamps)</li>
        <li>Downlights &amp; Potlights</li>
        <li>LED Drivers (where applicable)</li>
        <li>Commercial LED Fixtures (where specified)</li>
      </ul>
      <p>
        Always verify the product's spec sheet to confirm dimmability before selecting a dimmer.
      </p>

    </div>
  </div>

</div>
<?php get_footer(); ?>
