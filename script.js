/**
 * LUXURY WEDDING INVITATION — SCRIPT.JS
 * Arjun & Priya · 14 February 2026
 * ==============================================
 * Features:
 *  - Loading screen
 *  - Custom cursor
 *  - Scroll progress bar
 *  - Petal canvas animation
 *  - AOS initialization
 *  - Countdown timer
 *  - Lightbox gallery
 *  - RSVP form handling
 *  - Music play/pause
 *  - Smooth image load
 */

'use strict';

/* ─────────────────────────────────────────────
   1. LOADING SCREEN
───────────────────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.add('loaded');
      // Kick off petal animation after load
      initPetals();
    }, 2800);
  });
})();

/* ─────────────────────────────────────────────
   2. AOS — Animate On Scroll
───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 900,
    easing:   'ease-out-cubic',
    once:     true,
    offset:   80,
  });
});

/* ─────────────────────────────────────────────
   3. CUSTOM CURSOR (desktop only)
───────────────────────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform  = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
  });

  // Smooth lag for ring
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effect on interactive elements
  const hoverEls = document.querySelectorAll(
    'a, button, .gallery-item, .timeline-card, .event-card, .family-card'
  );
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();

/* ─────────────────────────────────────────────
   4. SCROLL PROGRESS BAR
───────────────────────────────────────────── */
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ─────────────────────────────────────────────
   5. PARALLAX ON HERO (subtle)
───────────────────────────────────────────── */
(function initParallax() {
  const hero = document.querySelector('.section-hero');
  if (!hero) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    hero.style.backgroundPositionY = `calc(50% + ${y * 0.3}px)`;
  }, { passive: true });
})();

/* ─────────────────────────────────────────────
   6. COUNTDOWN TIMER
   Target: 14 Feb 2026 07:30 IST (UTC+5:30)
───────────────────────────────────────────── */
(function initCountdown() {
  const target = new Date('2026-07-02T05:00:00Z').getTime();

  const elDays  = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMins  = document.getElementById('cd-mins');
  const elSecs  = document.getElementById('cd-secs');

  if (!elDays) return;

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const now  = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      elDays.textContent  = '00';
      elHours.textContent = '00';
      elMins.textContent  = '00';
      elSecs.textContent  = '00';
      return;
    }

    elDays.textContent  = pad(Math.floor(diff / (1000 * 60 * 60 * 24)));
    elHours.textContent = pad(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    elMins.textContent  = pad(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
    elSecs.textContent  = pad(Math.floor((diff % (1000 * 60)) / 1000));
  }

  tick();
  setInterval(tick, 1000);

})();
/* ─────────────────────────────────────────────
   7. GALLERY LIGHTBOX
───────────────────────────────────────────── */
(function initGallery() {
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lightbox-img');
  const lbClose  = document.getElementById('lb-close');
  const lbPrev   = document.getElementById('lb-prev');
  const lbNext   = document.getElementById('lb-next');
  const items    = Array.from(document.querySelectorAll('.gallery-item'));

  if (!lightbox || items.length === 0) return;

  let current = 0;

  function open(index) {
    current = index;
    const src = items[current].getAttribute('data-src');
    lbImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function prev() { open((current - 1 + items.length) % items.length); }
  function next() { open((current + 1) % items.length); }

  items.forEach((item, i) => item.addEventListener('click', () => open(i)));
  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click', prev);
  lbNext.addEventListener('click', next);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')      close();
    if (e.key === 'ArrowLeft')   prev();
    if (e.key === 'ArrowRight')  next();
  });

  // Touch swipe
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend',   (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) { dx > 0 ? prev() : next(); }
  }, { passive: true });
})();

/* ─────────────────────────────────────────────
   8. RSVP FORM
───────────────────────────────────────────── */
(function initRSVP() {
  const form    = document.getElementById('rsvp-form');
  const success = document.getElementById('rsvp-success');
  if (!form || !success) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Simulate submission (replace with real API call)
    const btn = form.querySelector('.btn-rsvp');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      success.classList.add('visible');
    }, 1200);
  });
})();

/* ─────────────────────────────────────────────
   9. BACKGROUND MUSIC
───────────────────────────────────────────── */
(function initMusic() {
  const btn   = document.getElementById('music-btn');
  const audio = document.getElementById('bg-music');
  if (!btn || !audio) return;

  let playing = false;
  audio.volume = 0.35;

  // Try autoplay on first user interaction
  const startOnInteraction = () => {
    if (!playing) {
      audio.play().then(() => {
        playing = true;
        btn.classList.add('playing');
        btn.querySelector('.music-icon').textContent = '♬';
      }).catch(() => {});
    }
    document.removeEventListener('click', startOnInteraction, true);
    document.removeEventListener('touchstart', startOnInteraction, true);
  };
  document.addEventListener('click',      startOnInteraction, { once: true, capture: true });
  document.addEventListener('touchstart', startOnInteraction, { once: true, capture: true });

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (playing) {
      audio.pause();
      playing = false;
      btn.classList.remove('playing');
      btn.querySelector('.music-icon').textContent = '♪';
    } else {
      audio.play().then(() => {
        playing = true;
        btn.classList.add('playing');
        btn.querySelector('.music-icon').textContent = '♬';
      }).catch(() => {});
    }
  });
})();

/* ─────────────────────────────────────────────
   10. FLOATING PETAL CANVAS
───────────────────────────────────────────── */
function initPetals() {
  const canvas = document.getElementById('petal-canvas');
  if (!canvas) return;

  const ctx    = canvas.getContext('2d');
  let petals   = [];
  const COUNT  = window.innerWidth < 600 ? 18 : 32;

  // Petal colors — soft golds and blush
  const COLORS = ['#f5d6b8','#e8c49a','#c9a84c','#f2e6d2','#e8d5a3','#f7ead6'];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createPetal() {
    const size = Math.random() * 12 + 6;
    return {
      x:     Math.random() * canvas.width,
      y:     Math.random() * -canvas.height,
      size,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      speed: Math.random() * 1.2 + 0.4,
      drift: Math.random() * 1.2 - 0.6,
      spin:  Math.random() * 0.04 - 0.02,
      angle: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.4 + 0.15,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.02 + 0.005,
    };
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    // Leaf/petal shape
    ctx.moveTo(0, -p.size);
    ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.6, p.size * 0.8, p.size * 0.4, 0, p.size);
    ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.4, -p.size * 0.8, -p.size * 0.6, 0, -p.size);
    ctx.fill();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    petals.forEach((p, i) => {
      p.wobble   += p.wobbleSpeed;
      p.x        += p.drift + Math.sin(p.wobble) * 0.5;
      p.y        += p.speed;
      p.angle    += p.spin;

      drawPetal(p);

      // Reset if off screen
      if (p.y > canvas.height + 20) {
        petals[i] = createPetal();
        petals[i].y = -20;
      }
    });

    requestAnimationFrame(animate);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  for (let i = 0; i < COUNT; i++) {
    const p = createPetal();
    p.y = Math.random() * canvas.height; // spread initial positions
    petals.push(p);
  }

  animate();
}

/* ─────────────────────────────────────────────
   11. SMOOTH IMAGE LOADING
───────────────────────────────────────────── */
(function initImgLoad() {
  const imgs = document.querySelectorAll('img');
  imgs.forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('loaded'));
    }
  });
})();

/* ─────────────────────────────────────────────
   12. SMOOTH SCROLL FOR ANCHOR LINKS
───────────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ─────────────────────────────────────────────
   13. SECTION REVEAL FALLBACK
   (ensures sections not caught by AOS still appear)
───────────────────────────────────────────── */
(function initRevealFallback() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('section').forEach(sec => observer.observe(sec));
})();

/* ─────────────────────────────────────────────
   14. CSS KEYFRAME INJECTION for countdown flip
───────────────────────────────────────────── */
(function injectKeyframes() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes countFlip {
      0%   { transform: translateY(-6px); opacity: .4; }
      100% { transform: translateY(0);    opacity: 1; }
    }
  `;
  document.head.appendChild(style);
})();

/* ─────────────────────────────────────────────
   15. MOBILE TOUCH RIPPLE on buttons
───────────────────────────────────────────── */
(function initRipple() {
  const rippleBtns = document.querySelectorAll('.btn-open-invitation, .btn-rsvp, .btn-directions');
  rippleBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute;left:${x}px;top:${y}px;
        width:0;height:0;
        background:rgba(255,255,255,0.25);
        border-radius:50%;
        transform:translate(-50%,-50%);
        animation:rippleAnim .6s ease forwards;
        pointer-events:none;z-index:0;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleAnim {
      to { width: 200px; height: 200px; opacity: 0; }
    }
  `;
  document.head.appendChild(style);
})();
