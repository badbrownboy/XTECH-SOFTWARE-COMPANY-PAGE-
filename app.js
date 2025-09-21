
const fadeInObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0 0 -100px 0' });

function initFadeIns() {
  document.querySelectorAll('.fade-in-section, .service-card')
    .forEach((el, i) => {
      fadeInObserver.observe(el);
      el.style.transitionDelay = `${i * 0.1}s`;
    });
}

// --- Testimonial Slider ---
function initTestimonials() {
  const slides = [...document.querySelectorAll('.testimonial-slide')];
  const dots   = [...document.querySelectorAll('.testimonial-dot')];
  const nextBtn = document.querySelector('.testimonial-arrow-btn:not(.testimonial-arrow-btn-back) .testimonial-arrow-content');
  const backBtn = document.querySelector('.testimonial-arrow-btn-back .testimonial-arrow-content-back');
  let idx = 0;
  function show(i) {
    slides.forEach((s,j)=> s.classList.toggle('active', i===j));
    dots.forEach((d,j)=>   d.classList.toggle('active', i===j));
    if (backBtn) backBtn.parentElement.style.display = i === 0 ? 'none' : 'flex';
  }
  if (nextBtn) nextBtn.addEventListener('click', e => { e.preventDefault(); show(idx = (idx+1)%slides.length); });
  if (backBtn) backBtn.addEventListener('click', e => { e.preventDefault(); show(idx = (idx-1+slides.length)%slides.length); });
  dots.forEach((dot, i)=> dot.addEventListener('click', ()=> show(idx=i)));
  show(0);
}

// --- Parallax (requestAnimationFrame) ---
function initParallax() {
  const parallaxEls = [
    ...document.querySelectorAll('.blob-svg, .expertise-circle, .expertise-arc')
  ];
  let lastScroll = 0, ticking = false;
  function updateParallax() {
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.speed) || 0.2;
      el.style.transform = `translateY(${lastScroll * speed}px)`;
    });
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    lastScroll = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });
}

// --- Navigation Scroll (fixed nav style) ---
function handleNavigationScroll() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  if (window.pageYOffset > 100) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}

// --- Smooth Scrolling ---
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const tgt = document.querySelector(anchor.getAttribute('href'));
      tgt && tgt.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// --- Vanta Globe ---
function initVanta() {
  if (window.VANTA) {
    VANTA.GLOBE({
      el: "#vanta-sections-bg",
      mouseControls: true, touchControls: true,
      minHeight:200, minWidth:200,
      scale:1.0, scaleMobile:1.0,
      color:0x8b5cf6, backgroundColor:0x000000
    });
  }
}

// --- DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {
  initFadeIns();
  initTestimonials();
  initParallax();
  initSmoothScroll();
  initVanta();
  handleNavigationScroll();
  window.addEventListener('scroll', handleNavigationScroll);
}); 