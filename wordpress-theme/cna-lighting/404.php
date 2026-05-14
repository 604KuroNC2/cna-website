<?php get_header(); ?>
<div class="min-h-screen bg-[#f8f8fc] flex items-center justify-center pt-20">
  <div class="text-center px-4 py-20">
    <div class="font-display font-black text-[10rem] leading-none text-[#000080]/10 mb-4">404</div>
    <h1 class="font-display font-black text-4xl text-[#000080] mb-4">Page Not Found</h1>
    <p class="text-gray-500 text-lg mb-8 max-w-md mx-auto">The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.</p>
    <div class="flex flex-wrap gap-4 justify-center">
      <a href="<?php echo esc_url(home_url('/')); ?>"
         class="px-6 py-3 bg-[#000080] text-white font-bold text-sm uppercase tracking-wide rounded-sm hover:bg-[#0000a0] transition-colors">
        Go Home
      </a>
      <a href="<?php echo esc_url(get_permalink(wc_get_page_id('shop'))); ?>"
         class="px-6 py-3 border border-[#000080]/20 text-[#000080] font-bold text-sm uppercase tracking-wide rounded-sm hover:border-[#000080]/40 transition-colors">
        Browse Products
      </a>
    </div>
  </div>
</div>
<?php get_footer(); ?>
