<?php
defined('ABSPATH') || exit;
get_header();

$faqs = [
  ["I'm an end-customer. Can I purchase products directly from CNA?",
   "No, CNA only deals with distributors. Please contact us and we can help you locate your nearest authorized distributor."],
  ["How do I become a customer and start purchasing?",
   "Contact us to request a credit application. Please note that your first purchase must be paid in advance before an account can be established."],
  ["Do you sell to electrical contractors and electricians?",
   "No — CNA sells exclusively through distributors. Please contact your local lighting distributor or electrical wholesaler to purchase CNA products."],
  ["Do you sell other brands besides CNA?",
   "We primarily sell CNA brand products. We do carry other brands in limited, special cases. The vast majority of our catalog is CNA-branded."],
  ["How do I become an agent?",
   "Most areas in Canada already have agents handling their respective territories. If you represent a region that currently has no CNA representation, agency opportunities may be available. Please contact us to discuss."],
  ["What types of products does CNA carry?",
   "CNA offers a wide range of LED lighting products including filament bulbs, general purpose LED A-series bulbs, reflectors and spotlights (MR16, GU10, PAR), miniature specialty bulbs (G4, G9, E11, J-Type), LED downlights and potlights, LED strip lights, LED drivers, and commercial fixtures. We also carry a limited selection of halogen, CFL, and HID products."],
  ["Where are your warehouses located?",
   "CNA maintains warehouses in Burnaby (Vancouver), BC and Halton Hills (Toronto), ON. We also have a bulk order facility in Surrey, BC through AVP Carriers Ltd."],
  ["What certifications do CNA products carry?",
   "CNA products are certified to cUL, cETLus, and cTUVus standards, ensuring compliance with Canadian and North American safety requirements."],
  ["What is the warranty on CNA LED products?",
   "LED products carry a 2–5 year warranty from the date of sale. LED Exit Signs are covered for 10 years. CFL products carry a 1-year warranty. See our Warranty & Return Policy page for full details."],
  ["What dimmers are compatible with CNA dimmable LEDs?",
   "CNA dimmable LED products work with Forward Phase / Leading Edge load type dimmers. Recommended options include Lutron DVELV-300P (best), DVCL-153P (good), and Lutron Caséta PRO (best wireless). See our Dimmer Compatibility page for the full list."],
];
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
        Frequently Asked Questions
      </h1>
      <p class="mt-3 text-white/50 text-lg max-w-2xl">
        Common questions about purchasing, products, and working with CNA Lighting.
      </p>
    </div>
  </div>

  <!-- Content -->
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
    <div class="prose-cna">

      <div style="display:flex;flex-direction:column;gap:1.5rem;">
        <?php foreach ($faqs as [$q, $a]): ?>
          <div style="background:white;border:1px solid #e5e7eb;border-radius:4px;padding:1.5rem;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
            <h3 style="margin:0 0 0.75rem 0;font-size:1rem;font-weight:700;color:#000080;display:flex;align-items:flex-start;gap:0.75rem;">
              <span style="display:inline-flex;align-items:center;justify-content:center;width:1.5rem;height:1.5rem;min-width:1.5rem;background:#FFD700;color:#000080;border-radius:2px;font-size:0.75rem;font-weight:900;margin-top:0.05rem;">Q</span>
              <?php echo esc_html($q); ?>
            </h3>
            <p style="margin:0;padding-left:2.25rem;color:#374151;line-height:1.7;">
              <?php echo esc_html($a); ?>
            </p>
          </div>
        <?php endforeach; ?>
      </div>

      <div class="info-box" style="margin-top:2.5rem;">
        <p>
          Have a question that's not answered here?
          <a href="<?php echo esc_url(home_url('/contact')); ?>">Contact us</a>
          and our team will be happy to help.
        </p>
      </div>

    </div>
  </div>

</div>
<?php get_footer(); ?>
