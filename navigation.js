// Navigation scroll behavior
let lastScroll = 0;

function handleNavigationScroll() {
    // Function modified to keep navigation appearance consistent
    // No classes are added/removed on scroll
    const nav = document.getElementById('navbar');
    
    // Ensure navbar always has consistent styling
    nav.classList.remove('scrolled');
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize navigation
window.addEventListener('scroll', handleNavigationScroll);
document.addEventListener('DOMContentLoaded', initSmoothScrolling);

