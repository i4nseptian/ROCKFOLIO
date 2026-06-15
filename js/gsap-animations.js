gsap.registerPlugin(ScrollTrigger);

const _GP = (el) => el.dataset.gsapDone = '1';

function waitPreloader(cb) {
  const id = setInterval(() => {
    const p = document.getElementById('preloader');
    if (!p || p.classList.contains('hidden')) {
      clearInterval(id);
      cb();
    }
  }, 100);
}

// ==========================================
// MOUSE SPOTLIGHT
// ==========================================
function initSpotlight() {
  const spot = document.getElementById('heroSpotlight');
  if (!spot) return;
  const hero = document.querySelector('.hero-landing');

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    spot.style.background = `radial-gradient(500px circle at ${x}px ${y}px, rgba(255,0,60,0.06), transparent 60%)`;
  });

  hero.addEventListener('mouseenter', () => { spot.style.opacity = '1'; });
  hero.addEventListener('mouseleave', () => { spot.style.opacity = '0'; });

  if ('ontouchstart' in window) spot.style.display = 'none';
}

// ==========================================
// 3D INTERACTIVE PARTICLES
// ==========================================
function initParticles3D() {
  const container = document.getElementById('particles-container');
  if (!container) return;
  container.innerHTML = '';
  const isTouch = 'ontouchstart' in window;

  const count = isTouch ? 40 : 80;
  const particles = [];
  let mouseX = 0.5, mouseY = 0.6;

  if (!isTouch) {
    container.parentElement.addEventListener('mousemove', (e) => {
      const rect = container.parentElement.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width;
      mouseY = (e.clientY - rect.top) / rect.height;
    });
  }

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = gsap.utils.random(2, 6);
    const x = gsap.utils.random(0, 100);
    const y = gsap.utils.random(0, 100);
    const speed = gsap.utils.random(20, 60);
    const depth = gsap.utils.random(0.5, 1.5);
    p.style.cssText = `left:${x}%;top:${y}%;width:${size}px;height:${size}px;opacity:${gsap.utils.random(0.15, 0.5)}`;
    container.appendChild(p);
    particles.push({ el: p, baseX: x, baseY: y, speed, depth, size });
  }

  function animateParticles() {
    const now = Date.now() / 1000;
    particles.forEach((p) => {
      const dx = (mouseX - 0.5) * 30 * p.depth;
      const dy = (mouseY - 0.5) * 30 * p.depth;
      const floatX = Math.sin(now * 0.5 + p.speed) * 15;
      const floatY = Math.cos(now * 0.4 + p.speed * 0.7) * 15;
      const tx = p.baseX + dx + floatX;
      const ty = p.baseY + dy + floatY;
      p.el.style.transform = `translate(${tx - p.baseX}px, ${ty - p.baseY}px)`;
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

// ==========================================
// GEOMETRIC SHAPES AMBIENT
// ==========================================
function initGeoShapes() {
  const shapes = document.querySelectorAll('.geo-shape');
  if (!shapes.length) return;

  shapes.forEach((s) => {
    gsap.to(s, {
      x: () => gsap.utils.random(-30, 30),
      y: () => gsap.utils.random(-30, 30),
      rotation: () => gsap.utils.random(-15, 15),
      opacity: 0.12,
      duration: () => gsap.utils.random(4, 7),
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: () => gsap.utils.random(0, 3)
    });
  });
}

// ==========================================
// TIME-BASED GREETING
// ==========================================
function setGreeting() {
  const el = document.getElementById('heroGreeting');
  if (!el) return;
  const h = new Date().getHours();
  let text = 'Hello, I\'m';
  if (h < 12) text = 'Good Morning, I\'m';
  else if (h < 17) text = 'Good Afternoon, I\'m';
  else text = 'Good Evening, I\'m';
  el.textContent = text;
}

// ==========================================
// HERO ENTRANCE TIMELINE
// ==========================================
window.addEventListener('load', () => {
  gsap.set('.float-badge', { scale: 0, opacity: 0 });
  gsap.set('.viz-bar', { scaleY: 0, transformOrigin: 'bottom center', opacity: 0 });
  gsap.set('.hero-card-wrapper', { scale: 0.85, opacity: 0, y: 30 });
  gsap.set('.hero-status-badge, .hero-greeting, .hero-name, .hero-rotating-wrapper, .hero-buttons, .hero-social-row', { opacity: 0, y: 25 });
  gsap.set('.scroll-indicator', { opacity: 0 });
  gsap.set('.hero-spotlight', { opacity: 0 });
  gsap.set('[data-animate]', { opacity: 0, willChange: 'transform, opacity' });

  setGreeting();
  initSpotlight();
  initParticles3D();
  initGeoShapes();

  waitPreloader(startHero);
  setTimeout(sectionReveals, 500);
  setTimeout(initParallax, 1000);
});

function startHero() {
  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    onComplete: () => {
      ambientLoop();
      document.querySelectorAll('.hero-landing [data-animate]').forEach(_GP);
    }
  });

  tl.to('.viz-bar', {
    scaleY: 1, opacity: 0.25, duration: 0.9, stagger: 0.02, ease: 'power2.out'
  })
  .to('.float-badge', {
    scale: 1, opacity: 1, duration: 0.6, stagger: 0.07, ease: 'back.out(2)'
  }, '-=0.5')
  .to('.hero-card-wrapper', {
    scale: 1, opacity: 1, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.5)'
  }, '-=0.3')
  .to('.hero-status-badge', { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')
  .to('.hero-greeting', { opacity: 1, y: 0, duration: 0.5 }, '-=0.1')
  .to('.hero-name', { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.2')
  .to('.hero-rotating-wrapper', {
    opacity: 1, y: 0, duration: 0.5,
    onStart: () => initRotatingTextGSAP()
  }, '-=0.3')
  .to('.hero-buttons', { opacity: 1, y: 0, duration: 0.5 }, '-=0.2')
  .to('.hero-social-row', { opacity: 1, y: 0, duration: 0.5 }, '-=0.2')
  .to('.hero-spotlight', { opacity: 1, duration: 0.8 }, '-=0.3')
  .to('.scroll-indicator', { opacity: 0.5, duration: 0.6 }, '-=0.1');
}

// ==========================================
// GSAP ROTATING TEXT
// ==========================================
function initRotatingTextGSAP() {
  const el = document.getElementById('rotatingWord');
  if (!el) return;

  const words = [
    'Web Applications',
    'E-Commerce Platforms',
    'POS Systems',
    'Data Dashboards',
    'Business Websites',
    'Rock & Code'
  ];
  let idx = 0;

  function rotate() {
    gsap.to(el, {
      y: -32, opacity: 0, duration: 0.35, ease: 'power2.in',
      onComplete: () => {
        idx = (idx + 1) % words.length;
        el.textContent = words[idx];
        gsap.set(el, { y: 32 });
        gsap.to(el, { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' });
      }
    });
  }

  gsap.delayedCall(3.5, function repeat() {
    rotate();
    gsap.delayedCall(3, repeat);
  });
}

// ==========================================
// CONTINUOUS AMBIENT LOOP
// ==========================================
function ambientLoop() {
  gsap.to('.hero-card-border', {
    rotation: 2, duration: 4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.5
  });

  gsap.to('.hero-name', {
    textShadow: '0 0 20px rgba(255,0,60,0.2), 0 0 40px rgba(255,0,60,0.08)',
    duration: 2.5, ease: 'sine.inOut', yoyo: true, repeat: -1
  });

  gsap.to('.viz-bar', {
    height: () => gsap.utils.random(8, 65),
    duration: () => gsap.utils.random(0.4, 1.2),
    ease: 'sine.inOut', yoyo: true, repeat: -1,
    stagger: { each: 0.03, from: 'random' }
  });

  gsap.to('.float-badge', {
    y: () => gsap.utils.random(-22, -8), rotation: '+=4',
    duration: () => gsap.utils.random(3, 5),
    ease: 'sine.inOut', yoyo: true, repeat: -1,
    stagger: { each: 0.25, from: 'random' }
  });

  gsap.to('.hero-social-row > a', {
    y: -3, duration: 2, ease: 'sine.inOut', yoyo: true, repeat: -1,
    stagger: { each: 0.15, from: 'start' }
  });

  gsap.to('.scroll-indicator', {
    opacity: 0.3, duration: 1.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1
  });
}

// ==========================================
// PARALLAX ON SCROLL
// ==========================================
function initParallax() {
  const hero = document.querySelector('.hero-landing');
  if (!hero) return;

  gsap.to('.hero-card-wrapper', {
    y: 40,
    ease: 'none',
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5
    }
  });

  gsap.to('.hero-name', {
    y: 20, scale: 0.98,
    ease: 'none',
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    }
  });

  gsap.to('.floating-badges', {
    y: 60, opacity: 0.4,
    ease: 'none',
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: 2
    }
  });

  gsap.to('.scroll-indicator', {
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: hero,
      start: 'top 80%',
      end: 'top 40%',
      scrub: 1
    }
  });
}

// ==========================================
// SCROLLTRIGGER SECTION REVEALS
// ==========================================
function sectionReveals() {
  gsap.utils.toArray('[data-animate]').forEach(el => {
    if (el.dataset.gsapDone) return;

    const type = el.getAttribute('data-animate') || '';
    const delay = parseFloat(el.getAttribute('data-delay')) || 0;

    let from = { opacity: 0, y: 30 };
    if (type.includes('Left')) from.x = -40;
    else if (type.includes('Right')) from.x = 40;
    else if (type.includes('zoomIn')) from.scale = 0.9;
    else if (type.includes('Up')) from.y = 40;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      onEnter: () => {
        el.style.transition = 'none';
        gsap.fromTo(el, from, {
          opacity: 1, x: 0, y: 0, scale: 1,
          duration: 0.9, delay, ease: 'power3.out',
          clearProps: 'transform',
          onComplete: () => {
            el.classList.add('animate-active');
            _GP(el);
          }
        });
      },
      once: true
    });
  });
}
