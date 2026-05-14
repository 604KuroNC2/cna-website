document.addEventListener('DOMContentLoaded', function () {
  // ── Particle canvas ──────────────────────────────────────────
  var canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var animFrame;
  var particles = [];
  var colors = ['rgba(255,215,0,', 'rgba(255,255,255,', 'rgba(180,200,255,'];

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (var i = 0; i < 120; i++) {
    particles.push({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4 - 0.1,
      size:    Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.6 + 0.1,
      color:   colors[Math.floor(Math.random() * colors.length)],
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.opacity + ')';
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      p.opacity += (Math.random() - 0.5) * 0.02;
      p.opacity = Math.max(0.05, Math.min(0.8, p.opacity));
      if (p.x < 0) p.x = canvas.width;  if (p.x > canvas.width)  p.x = 0;
      if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
    }
    animFrame = requestAnimationFrame(draw);
  }
  draw();

  // ── GSAP hero entrance ───────────────────────────────────────
  if (typeof gsap === 'undefined') return;

  var beam1 = document.getElementById('beam1');
  var beam2 = document.getElementById('beam2');
  var headline = document.getElementById('hero-headline');
  var subtitle = document.getElementById('hero-subtitle');
  var cta      = document.getElementById('hero-cta');

  var tl = gsap.timeline({ delay: 0.3 });

  if (beam1 && beam2) {
    tl.fromTo([beam1, beam2],
      { opacity: 0, scaleY: 0 },
      { opacity: 1, scaleY: 1, duration: 1.5, stagger: 0.3, ease: 'power2.out', clearProps: 'all' }
    );
  }

  if (headline) {
    var lines = headline.querySelectorAll('.hero-line');
    tl.fromTo(lines,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, stagger: 0.15, duration: 0.9, ease: 'power4.out', clearProps: 'all' },
      '-=1'
    );
  }

  if (subtitle) {
    tl.fromTo(subtitle,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', clearProps: 'all' }, '-=0.4'
    );
  }

  if (cta) {
    tl.fromTo(cta,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', clearProps: 'all' }, '-=0.3'
    );
  }

  // Continuous beam sweep
  if (beam1) gsap.to(beam1, { x: '150%', duration: 12, repeat: -1, ease: 'none', delay: 2 });
  if (beam2) gsap.to(beam2, { x: '150%', duration: 16, repeat: -1, ease: 'none', delay: 6 });
});
