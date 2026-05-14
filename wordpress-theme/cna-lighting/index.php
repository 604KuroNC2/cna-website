<?php
/**
 * Fallback template — WordPress requires this file to exist.
 * In practice it is never reached: front-page.php handles the homepage,
 * page.php handles static pages, and WooCommerce templates handle the catalog.
 */
defined('ABSPATH') || exit;

get_header();
?>
<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-screen">
  <?php if (have_posts()): while (have_posts()): the_post(); ?>
    <article class="prose max-w-none">
      <h1 class="font-display font-bold text-3xl text-[#000080] mb-6"><?php the_title(); ?></h1>
      <?php the_content(); ?>
    </article>
  <?php endwhile; else: ?>
    <div class="text-center py-20">
      <h1 class="font-display font-bold text-3xl text-[#000080] mb-4">Nothing here yet.</h1>
      <a href="<?php echo esc_url(home_url('/')); ?>"
         class="inline-block mt-6 px-6 py-3 bg-[#000080] text-white font-semibold rounded hover:bg-[#000060] transition-colors">
        Back to Home
      </a>
    </div>
  <?php endif; ?>
</main>
<?php
get_footer();
