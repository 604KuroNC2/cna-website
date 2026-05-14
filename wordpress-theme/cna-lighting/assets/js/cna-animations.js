document.addEventListener('DOMContentLoaded', function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Category cards
  var catCards = document.querySelectorAll('.category-card');
  if (catCards.length) {
    gsap.fromTo(catCards,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, stagger: 0.08, duration: 0.7, ease: 'power3.out', clearProps: 'all',
        scrollTrigger: { trigger: '#categories', start: 'top 75%', once: true } }
    );
  }

  // Section headers
  var sectionHeaders = document.querySelectorAll('.section-header');
  if (sectionHeaders.length) {
    gsap.fromTo(sectionHeaders,
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', clearProps: 'all',
        scrollTrigger: { trigger: '#categories', start: 'top 85%', once: true } }
    );
  }

  // Why CNA heading
  var whyHeading = document.querySelector('.why-heading');
  if (whyHeading) {
    gsap.fromTo(whyHeading,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', clearProps: 'all',
        scrollTrigger: { trigger: '#about', start: 'top 80%', once: true } }
    );
  }

  // Why CNA feature cards
  var whyItems = document.querySelectorAll('.why-item');
  if (whyItems.length) {
    gsap.fromTo(whyItems,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out', clearProps: 'all',
        scrollTrigger: { trigger: '#about', start: 'top 70%', once: true } }
    );
  }

  // Footer columns
  var footerCols = document.querySelectorAll('.footer-col');
  if (footerCols.length) {
    gsap.fromTo(footerCols,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out', clearProps: 'all',
        scrollTrigger: { trigger: '#cna-footer', start: 'top 90%', once: true } }
    );
  }

  // Catalog header entrance
  var catHeader = document.getElementById('catalog-header');
  if (catHeader) {
    gsap.fromTo(catHeader,
      { y: -10 },
      { y: 0, duration: 0.6, ease: 'power3.out', clearProps: 'transform' }
    );
  }
});
