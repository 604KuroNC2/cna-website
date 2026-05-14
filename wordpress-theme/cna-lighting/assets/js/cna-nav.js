document.addEventListener('DOMContentLoaded', function () {
  // Mobile menu toggle
  var btn  = document.getElementById('mobile-menu-btn');
  var menu = document.getElementById('mobile-menu');
  var lines = document.querySelectorAll('.burger-line');

  if (btn && menu) {
    btn.addEventListener('click', function () {
      var open = menu.style.maxHeight && menu.style.maxHeight !== '0px';
      if (open) {
        menu.style.maxHeight = '0px';
        menu.style.opacity   = '0';
        btn.setAttribute('aria-expanded', 'false');
        lines[0].style.transform = '';
        lines[1].style.opacity   = '';
        lines[2].style.transform = '';
      } else {
        menu.style.maxHeight = '400px';
        menu.style.opacity   = '1';
        btn.setAttribute('aria-expanded', 'true');
        lines[0].style.transform = 'rotate(45deg) translateY(8px)';
        lines[1].style.opacity   = '0';
        lines[2].style.transform = 'rotate(-45deg) translateY(-8px)';
      }
    });
  }

  // Nav entrance animation (GSAP loaded separately)
  if (typeof gsap !== 'undefined') {
    var logo  = document.getElementById('nav-logo');
    var links = document.querySelectorAll('#nav-links > *');

    gsap.fromTo(logo,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', delay: 0.1, clearProps: 'all' }
    );
    gsap.fromTo(links,
      { opacity: 0, y: -12 },
      { opacity: 1, y: 0, stagger: 0.07, duration: 0.5, ease: 'power2.out', delay: 0.2, clearProps: 'all' }
    );
  }
});
