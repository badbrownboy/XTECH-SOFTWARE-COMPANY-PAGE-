// Service cards scroll animation
function initServiceCardAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all service cards
    document.querySelectorAll('.service-card').forEach((card, index) => {
        // Set transition for smooth animation
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// Animated SVG Blob morphing and parallax for expertise section
function animateBlob() {
    const blobPath = document.getElementById('blobPath');
    if (!blobPath) return;
    // Keyframes for morphing
    const keyframes = [
        "M421.5,320Q410,390,340,410Q270,430,210,390Q150,350,170,280Q190,210,250,170Q310,130,370,170Q430,210,421.5,320Z",
        "M400,320Q420,400,340,420Q260,440,200,390Q140,340,180,270Q220,200,280,160Q340,120,400,170Q460,220,400,320Z",
        "M421.5,320Q410,390,340,410Q270,430,210,390Q150,350,170,280Q190,210,250,170Q310,130,370,170Q430,210,421.5,320Z"
    ];
    let frame = 0;
    let direction = 1;
    setInterval(() => {
        frame += direction;
        if (frame === keyframes.length - 1 || frame === 0) direction *= -1;
        blobPath.setAttribute('d', keyframes[frame]);
    }, 2200);
}

function parallaxBlob() {
    const blob = document.querySelector('.blob-svg');
    if (!blob) return;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        blob.style.transform = `translateY(${scrollY * 0.15}px)`;
    });
}

function initSectionFadeIn() {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -80px 0px'
    };
  
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // stop observing once it's visible
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);
  
    document.querySelectorAll('.fade-in-section').forEach((section, i) => {
      section.style.transitionDelay = `${i * 0.05}s`;
      observer.observe(section);
    });
}

function createExpertiseCircles() {
    const container = document.querySelector('.expertise-circles');
    if (!container) return;
    const circles = [];
    const circleData = [
        { size: 90, top: 10, left: 8, speed: 0.18 },
        { size: 60, top: 60, left: 18, speed: 0.12 },
        { size: 120, top: 30, left: 80, speed: 0.22 },
        { size: 70, top: 75, left: 70, speed: 0.15 },
        { size: 50, top: 40, left: 50, speed: 0.2 },
        { size: 80, top: 15, left: 60, speed: 0.13 },
        { size: 55, top: 80, left: 30, speed: 0.19 },
        { size: 100, top: 55, left: 90, speed: 0.17 },
        { size: 65, top: 25, left: 40, speed: 0.16 },
        { size: 45, top: 70, left: 55, speed: 0.21 },
    ];
    circleData.forEach((data, i) => {
        const circle = document.createElement('div');
        circle.className = 'expertise-circle';
        circle.style.width = `${data.size}px`;
        circle.style.height = `${data.size}px`;
        circle.style.top = `${data.top}%`;
        circle.style.left = `${data.left}%`;
        circle.dataset.speed = data.speed;
        container.appendChild(circle);
        circles.push(circle);
    });
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        circles.forEach(circle => {
            const speed = parseFloat(circle.dataset.speed);
            circle.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });
}

function parallaxExpertiseArc() {
    const arc = document.querySelector('.expertise-arc');
    if (!arc) return;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        arc.style.transform = `translateY(${scrollY * 0.18}px)`;
    });
}

function initTestimonialSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dot');
    const nextBtn = document.querySelector('.testimonial-arrow-btn:not(.testimonial-arrow-btn-back) .testimonial-arrow-content');
    const backBtn = document.querySelector('.testimonial-arrow-btn-back .testimonial-arrow-content-back');
    let current = 0;

    function showSlide(idx) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === idx);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === idx);
        });
        // Show/hide back button
        if (backBtn) {
            backBtn.parentElement.style.display = idx === 0 ? 'none' : 'flex';
        }
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            current = (current + 1) % slides.length;
            showSlide(current);
        });
    }
    if (backBtn) {
        backBtn.addEventListener('click', function(e) {
            e.preventDefault();
            current = (current - 1 + slides.length) % slides.length;
            showSlide(current);
        });
    }
    // Dots click
    dots.forEach((dot, i) => {
        dot.addEventListener('click', function() {
            current = i;
            showSlide(current);
        });
    });
    showSlide(current);
}

// Initialize Vanta.js Globe background
function initVantaGlobe() {
    if (window.VANTA) {
        VANTA.GLOBE({
            el: "#vanta-sections-bg",
            mouseControls: true,
            touchControls: true,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.0,
            scaleMobile: 1.0,
            color: 0x8b5cf6,
            color2: 0x8b5cf6,
            backgroundColor: 0x000000
        });
    }
}

// Partners section animation
function initPartnersAnimation() {
    const partnersSection = document.querySelector('.partners');
    if (!partnersSection) return;

    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const partnerLogos = entry.target.querySelectorAll('.partner-logo');
                partnerLogos.forEach((logo, index) => {
                    // Remove any existing animation classes
                    logo.classList.remove('animate-in');
                    // Add animation class with delay
                    setTimeout(() => {
                        logo.classList.add('animate-in');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    observer.observe(partnersSection);
}

// Initialize all animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initServiceCardAnimations();
    initSectionFadeIn();
    initTestimonialSlider();
    
    // Initialize Vanta.js Globe
    initVantaGlobe();
    
    // ONLY handle internal anchor links for smooth scrolling (do NOT catch external links)
    document.querySelectorAll('nav a').forEach(link => {
        const href = link.getAttribute('href');
        // Only add smooth scroll for links that start with "#" and are NOT just "#"
        if (href && href.startsWith('#') && href.length > 1) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    const navHeight = 100; // Account for fixed nav
                    const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navHeight;
                    
                    // Use requestAnimationFrame for smoother scrolling
                    const startPosition = window.pageYOffset;
                    const distance = targetPosition - startPosition;
                    const duration = 800; // Smooth duration
                    let startTime = null;
                    
                    function smoothScroll(currentTime) {
                        if (startTime === null) startTime = currentTime;
                        const timeElapsed = currentTime - startTime;
                        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
                        window.scrollTo(0, run);
                        if (timeElapsed < duration) requestAnimationFrame(smoothScroll);
                    }
                    
                    function easeInOutQuad(t, b, c, d) {
                        t /= d / 2;
                        if (t < 1) return c / 2 * t * t + b;
                        t--;
                        return -c / 2 * (t * (t - 2) - 1) + b;
                    }
                    
                    requestAnimationFrame(smoothScroll);
                }
            });
        }
        // For all other links (like app.html), do NOT prevent default!
    });
    
    // Initialize other animations
    animateBlob();
    parallaxBlob();
    createExpertiseCircles();
    parallaxExpertiseArc();
    initPartnersAnimation();
});

// Optional: Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});