document.addEventListener('DOMContentLoaded', () => {

    // 1. Loader Logic
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 2000); // Loader stays for 2 seconds

    // 2. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Reveal Elements on Scroll (Intersection Observer)
    const observerOptions = {
        threshold: 0.15, // Trigger when 15% of element is visible
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Target elements to animate
    const elementsToReveal = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-delay, .reveal-delay-2');
    elementsToReveal.forEach(el => observer.observe(el));
});

// Mobile Menu Toggle (Simple)
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    if (navLinks.style.display === 'flex') {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '80px';
        navLinks.style.right = '0';
        navLinks.style.background = '#0a0a0a';
        navLinks.style.width = '100%';
        navLinks.style.padding = '20px';
        navLinks.style.textAlign = 'center';
    }
}