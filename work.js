// Work page specific animations and effects
document.addEventListener('DOMContentLoaded', function() {
    // Ensure navbar has consistent styling (no scroll effects)
    const navbar = document.getElementById('navbar');
    if (navbar) {
        navbar.classList.remove('scrolled');
    }
    
    // Initialize Hero AI Orbs
    initHeroAiOrbs();
    
    // Initialize Cloud and Thunder effects
    initCloudThunderEffects();
    
    // Initialize general animations
    initSectionAnimations();
});

// Hero AI Orbs with reduced interference
function initHeroAiOrbs() {
    const orbs = document.querySelectorAll('.hero .ai-orb');
    
    // Create inner lights for each orb
    orbs.forEach(orb => {
        // Add inner light
        const innerLight = document.createElement('div');
        innerLight.className = 'orb-inner-light';
        orb.appendChild(innerLight);
        
        // Add particles for each orb
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'orb-particle';
            // Randomize particle animation delay
            particle.style.animationDelay = `${Math.random() * 5}s`;
            orb.appendChild(particle);
        }
    });
    
    // Smooth movement - reduced frequency and amplitude
    let animationFrame;
    let previousScrollY = window.scrollY;
    
    function smoothOrbMovement() {
        const currentScrollY = window.scrollY;
        
        // Only update if scroll position changed significantly (reduces unnecessary updates)
        if (Math.abs(currentScrollY - previousScrollY) > 5) {
            orbs.forEach((orb, index) => {
                // Different movement based on orb index to create varied effect
                const moveX = Math.sin(currentScrollY / 1000 + index) * 15;
                const moveY = Math.cos(currentScrollY / 1000 + index) * 15;
                
                // Apply smooth transform with slow movement
                orb.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
            
            previousScrollY = currentScrollY;
        }
        
        animationFrame = requestAnimationFrame(smoothOrbMovement);
    }
    
    // Start the animation
    smoothOrbMovement();
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        cancelAnimationFrame(animationFrame);
    });
}

// Enhanced Cloud and Thunder effects
function initCloudThunderEffects() {
    const clouds = document.querySelectorAll('.cloud');
    const lightnings = document.querySelectorAll('.lightning');
    const thunderGlow = document.querySelector('.thunder-glow');
    
    // Make cloud movement more dynamic
    clouds.forEach((cloud, index) => {
        // Randomize starting position
        cloud.style.animationDelay = `${index * 2}s`;
        
        // Randomize size slightly
        const baseSize = parseInt(window.getComputedStyle(cloud).width);
        const randomFactor = 0.9 + Math.random() * 0.2; // 0.9 to 1.1
        cloud.style.width = `${baseSize * randomFactor}px`;
        cloud.style.height = `${parseInt(window.getComputedStyle(cloud).height) * randomFactor}px`;
    });
    
    // Make lightning more random and realistic
    function triggerRandomLightning() {
        // Select a random lightning element
        const randomIndex = Math.floor(Math.random() * lightnings.length);
        const lightning = lightnings[randomIndex];
        
        // Create the flash effect
        lightning.style.opacity = '1';
        lightning.style.background = 'rgba(255, 255, 255, 0.9)';
        lightning.style.boxShadow = '0 0 30px rgba(139, 92, 246, 0.9), 0 0 60px rgba(139, 92, 246, 0.7)';
        
        // Also trigger the thunder glow
        thunderGlow.style.opacity = '0.7';
        
        // Reset after a short time to create flash effect
        setTimeout(() => {
            lightning.style.opacity = '0.8';
            lightning.style.background = 'rgba(255, 255, 255, 0.6)';
            thunderGlow.style.opacity = '0.4';
            
            setTimeout(() => {
                lightning.style.opacity = '0';
                lightning.style.background = 'rgba(255, 255, 255, 0)';
                lightning.style.boxShadow = 'none';
                thunderGlow.style.opacity = '0';
            }, 100);
        }, 50);
        
        // Schedule next lightning at random interval (5-15 seconds)
        const nextDelay = 5000 + Math.random() * 10000;
        setTimeout(triggerRandomLightning, nextDelay);
    }
    
    // Start the random lightning effect after a delay
    setTimeout(triggerRandomLightning, 3000);
}

// General section animations
function initSectionAnimations() {
    // Animate in sections when they come into view
    const sections = document.querySelectorAll('section:not(.hero)');
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        section.classList.add('animate-section');
        observer.observe(section);
    });
}
