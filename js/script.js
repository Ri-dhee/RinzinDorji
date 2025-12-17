// ============================================
// Personal Portfolio - Interactive Features
// ============================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('%c👋 Welcome to Rinzin Dorji\'s Portfolio!', 'font-size: 20px; color: #3498db; font-weight: bold;');
    console.log('%c🚀 Exploring the code? Feel free to reach out!', 'font-size: 14px; color: #2ecc71;');
    
    // Initialize all features
    initMobileMenu();
    initNavbarScroll();
    initSmoothScrolling();
    initScrollReveal();
    initDynamicYear();
    initAccessibilityFeatures();
});

// ============================================
// Mobile Menu Toggle
// ============================================
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');
    
    if (!menuToggle || !navLinks) return;
    
    // Toggle menu on button click
    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        
        // Animate hamburger icon
        animateMenuIcon(menuToggle, !isExpanded);
    });
    
    // Close menu when clicking nav links
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            animateMenuIcon(menuToggle, false);
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                animateMenuIcon(menuToggle, false);
            }
        }
    });
}

// Animate hamburger menu icon
function animateMenuIcon(menuToggle, isOpen) {
    const spans = menuToggle.querySelectorAll('span');
    if (spans.length === 0) return;
    
    if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translateY(8px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

// ============================================
// Navbar Scroll Effects
// ============================================
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let lastScroll = 0;
    const scrollThreshold = 100;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add shadow and background on scroll
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll (optional)
        if (currentScroll > scrollThreshold) {
            if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
                // Scrolling down
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                navbar.style.transform = 'translateY(0)';
            }
        }
        
        lastScroll = currentScroll;
        
        // Update active nav link based on scroll position
        updateActiveNavLink();
    });
}

// Update active navigation link based on current section
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    const scrollPosition = window.pageYOffset + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ============================================
// Smooth Scrolling
// ============================================
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Skip empty anchors
            if (href === '#' || href === '#!') return;
            
            const target = document.querySelector(href);
            if (!target) return;
            
            e.preventDefault();
            
            const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
            const targetPosition = target.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Update URL without jumping
            history.pushState(null, '', href);
        });
    });
}

// ============================================
// Scroll Reveal Animations
// ============================================
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.reveal, .skill-card, .project-card, .timeline-item, .contact-card'
    );
    
    if (revealElements.length === 0) return;
    
    // Intersection Observer for performance
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay for multiple elements
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * 100);
                
                // Stop observing after reveal
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Add reveal class and observe elements
    revealElements.forEach(element => {
        element.classList.add('reveal-element');
        observer.observe(element);
    });
    
    // Add CSS for reveal animation if not exists
    addRevealStyles();
}

// Add reveal animation styles dynamically
function addRevealStyles() {
    const styleId = 'reveal-animation-styles';
    
    // Check if styles already exist
    if (document.getElementById(styleId)) return;
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
        .reveal-element {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        
        .reveal-element.revealed {
            opacity: 1;
            transform: translateY(0);
        }
        
        @media (prefers-reduced-motion: reduce) {
            .reveal-element {
                opacity: 1;
                transform: none;
                transition: none;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// ============================================
// Dynamic Year in Footer
// ============================================
function initDynamicYear() {
    const yearElements = document.querySelectorAll('.current-year, #current-year');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
}

// ============================================
// Accessibility Features
// ============================================
function initAccessibilityFeatures() {
    // ESC key to close mobile menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const navLinks = document.querySelector('.nav-links');
            const menuToggle = document.querySelector('.menu-toggle');
            
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                animateMenuIcon(menuToggle, false);
                
                // Return focus to menu toggle
                menuToggle.focus();
            }
            
            // Close any open modals
            closeModals();
        }
    });
    
    // Trap focus in mobile menu when open
    trapFocusInMenu();
    
    // Add keyboard navigation for custom elements
    addKeyboardNavigation();
    
    // Skip to content link
    addSkipToContent();
}

// Trap focus within mobile menu
function trapFocusInMenu() {
    const navLinks = document.querySelector('.nav-links');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (!navLinks || !menuToggle) return;
    
    document.addEventListener('keydown', (e) => {
        if (!navLinks.classList.contains('active')) return;
        if (e.key !== 'Tab') return;
        
        const focusableElements = navLinks.querySelectorAll(
            'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });
}

// Add keyboard navigation support
function addKeyboardNavigation() {
    const cards = document.querySelectorAll('.project-card, .skill-card');
    
    cards.forEach(card => {
        // Make cards keyboard accessible if they contain links
        const link = card.querySelector('a');
        if (link && card.tabIndex === -1) {
            card.tabIndex = 0;
            
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    link.click();
                }
            });
        }
    });
}

// Add skip to content link for accessibility
function addSkipToContent() {
    const main = document.querySelector('main, #main, .main-content');
    if (!main) return;
    
    // Check if skip link already exists
    if (document.querySelector('.skip-to-content')) return;
    
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-to-content';
    skipLink.textContent = 'Skip to main content';
    
    // Add styles for skip link
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: #3498db;
        color: white;
        padding: 8px 16px;
        text-decoration: none;
        z-index: 10000;
        border-radius: 0 0 4px 0;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    // Set ID on main content
    main.id = 'main-content';
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// ============================================
// Modal/Dialog Functions
// ============================================
function closeModals() {
    const modals = document.querySelectorAll('.modal, .dialog, [role="dialog"]');
    
    modals.forEach(modal => {
        if (modal.classList.contains('active') || modal.classList.contains('open')) {
            modal.classList.remove('active', 'open');
            
            // Restore focus to trigger element if stored
            if (modal.dataset.returnFocus) {
                const returnElement = document.querySelector(modal.dataset.returnFocus);
                if (returnElement) returnElement.focus();
            }
        }
    });
}

// ============================================
// Form Enhancement (if contact form exists)
// ============================================
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Basic validation
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                    showError(input, 'This field is required');
                } else {
                    input.classList.remove('error');
                    removeError(input);
                }
            });
            
            if (isValid) {
                // Form is valid, proceed with submission
                console.log('Form submitted successfully!');
                // Add your form submission logic here
            }
        });
    });
}

function showError(input, message) {
    const errorElement = input.nextElementSibling;
    
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.textContent = message;
    } else {
        const error = document.createElement('span');
        error.className = 'error-message';
        error.textContent = message;
        error.style.color = '#e74c3c';
        error.style.fontSize = '0.875rem';
        error.style.marginTop = '0.25rem';
        input.parentNode.insertBefore(error, input.nextSibling);
    }
}

function removeError(input) {
    const errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.remove();
    }
}

// ============================================
// Performance Monitoring
// ============================================
if (window.performance && window.performance.navigation) {
    window.addEventListener('load', () => {
        const loadTime = window.performance.timing.domContentLoadedEventEnd - 
                        window.performance.timing.navigationStart;
        
        console.log(`%c⚡ Page loaded in ${loadTime}ms`, 'color: #f39c12; font-weight: bold;');
    });
}

// ============================================
// Utility Functions
// ============================================

// Debounce function for performance optimization
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function executedFunction(...args) {
        const context = this;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Throttle function for scroll events
function throttle(func, limit = 100) {
    let inThrottle;
    return function(...args) {
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ============================================
// Console Art & Credits
// ============================================
console.log('%c', 'font-size: 1px; padding: 50px 100px; background: url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ctext y=\'.9em\' font-size=\'90\'%3E💻%3C/text%3E%3C/svg%3E") no-repeat;');
console.log('%c📧 Contact: rinzindorji@example.com', 'color: #95a5a6;');
console.log('%c🔗 GitHub: github.com/Ri-dhee', 'color: #95a5a6;');
console.log('%c✨ Built with passion and dedication', 'color: #e74c3c; font-style: italic;');

// Export functions for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        debounce,
        throttle,
        isInViewport
    };
}
