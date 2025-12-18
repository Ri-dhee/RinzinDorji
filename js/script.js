/**
 * Portfolio Website - Main Script
 * Clean, organized JavaScript for animations and interactions
 */

// ============================================
// INITIALIZATION
// ============================================

// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// ============================================
// PRELOADER
// ============================================

window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    preloader.style.opacity = '0';
    preloader.style.pointerEvents = 'none';
    setTimeout(() => {
        preloader.style.display = 'none';
        preloader.remove(); // Remove from DOM completely
        document.body.classList.add('loaded');
        animateHeroText();
    }, 700);
});

// ============================================
// HERO ANIMATIONS
// ============================================

function animateHeroText() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.classList.add('animate-in');
    }
    
    const heroElements = document.querySelectorAll('.hero-stagger');
    heroElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('animate-in');
        }, 200 + (index * 150));
    });
}

// ============================================
// NAVIGATION (throttled for performance)
// ============================================

const nav = document.getElementById('navbar');
const progressBar = document.getElementById('scroll-progress');

let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            // Nav background on scroll
            if (window.scrollY > 20) {
                nav.classList.add('nav-scrolled');
            } else {
                nav.classList.remove('nav-scrolled');
            }

            // Progress bar
            if (progressBar) {
                const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
                progressBar.style.width = scrolled + '%';
            }
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// Mobile menu
const menu = document.getElementById('mobile-menu');
const openBtn = document.getElementById('mobile-menu-btn');
const closeBtn = document.getElementById('close-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (openBtn && menu && closeBtn) {
    openBtn.addEventListener('click', () => {
        menu.classList.remove('hidden');
        menu.classList.add('flex');
        document.body.style.overflow = 'hidden';
    });

    const hideMenu = () => {
        menu.classList.add('hidden');
        menu.classList.remove('flex');
        document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', hideMenu);
    mobileLinks.forEach(link => link.addEventListener('click', hideMenu));
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ============================================
// SCROLL ANIMATIONS (single observer for performance)
// ============================================

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active', 'visible');
        }
    });
}, { threshold: 0.1, rootMargin: '50px' });

// Observe all animated elements at once
document.querySelectorAll('.reveal, .stagger-children, .timeline-item').forEach(el => scrollObserver.observe(el));

// ============================================
// COUNTER ANIMATION
// ============================================

function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const suffix = counter.getAttribute('data-suffix') || '';
        const duration = 2000;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);
            counter.textContent = current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        requestAnimationFrame(updateCounter);
    });
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            animateCounters();
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.counter-section').forEach(el => counterObserver.observe(el));

// ============================================
// TEXT SCRAMBLE EFFECT
// ============================================

class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#';
        this.update = this.update.bind(this);
    }
    
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise(resolve => this.resolve = resolve);
        this.queue = [];
        
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    
    update() {
        let output = '';
        let complete = 0;
        
        for (let i = 0; i < this.queue.length; i++) {
            let { from, to, start, end, char } = this.queue[i];
            
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.chars[Math.floor(Math.random() * this.chars.length)];
                    this.queue[i].char = char;
                }
                output += `<span class="scramble-char">${char}</span>`;
            } else {
                output += from;
            }
        }
        
        this.el.innerHTML = output;
        
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
}

const scrambleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('scrambled')) {
            entry.target.classList.add('scrambled');
            const fx = new TextScramble(entry.target);
            fx.setText(entry.target.textContent);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.scramble-text').forEach(el => scrambleObserver.observe(el));

// ============================================
// MAGNETIC BUTTONS
// ============================================

document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// ============================================
// 3D TILT EFFECT
// ============================================

if (window.matchMedia("(min-width: 768px)").matches) {
    document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.glass-card, .profile-img-container');
        
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            if (
                e.clientX >= rect.left - 50 && 
                e.clientX <= rect.right + 50 && 
                e.clientY >= rect.top - 50 && 
                e.clientY <= rect.bottom + 50
            ) {
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                card.style.transition = 'transform 0.1s ease';
            } else {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
                card.style.transition = 'transform 0.5s ease';
            }
        });
    });
}

// ============================================
// PARALLAX EFFECT
// ============================================

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    // Ambient blobs parallax
    const blobs = document.querySelectorAll('.ambient-blob');
    blobs.forEach((blob, i) => {
        const rotation = scrolled * 0.02 * (i % 2 === 0 ? 1 : -1);
        blob.style.transform = `rotate(${rotation}deg) scale(${1 + Math.sin(scrolled * 0.001) * 0.1})`;
    });
}, { passive: true });

// ============================================
// BACK TO TOP BUTTON
// ============================================

const backToTopBtn = document.getElementById('back-to-top');

if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.remove('opacity-0', 'invisible');
            backToTopBtn.classList.add('opacity-100', 'visible');
        } else {
            backToTopBtn.classList.add('opacity-0', 'invisible');
            backToTopBtn.classList.remove('opacity-100', 'visible');
        }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================
// ANIMATED SKILL BARS
// ============================================

const skillBarObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillBars = entry.target.querySelectorAll('.skill-bar');
            skillBars.forEach((bar, index) => {
                setTimeout(() => {
                    const width = bar.getAttribute('data-width');
                    bar.style.width = width + '%';
                    bar.style.transition = 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1)';
                }, index * 200);
            });
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-bar-item').forEach(el => {
    const parent = el.closest('.reveal');
    if (parent) skillBarObserver.observe(parent);
});

// ============================================
// DARK/LIGHT MODE TOGGLE
// ============================================

const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const html = document.documentElement;

// Check for saved theme preference or default to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Add transition class for smooth change
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    });
}

function updateThemeIcon(theme) {
    if (themeIcon) {
        themeIcon.className = theme === 'dark' ? 'fas fa-sun text-sm' : 'fas fa-moon text-sm';
    }
}

// ============================================
// CV DOWNLOAD
// ============================================

const downloadCVBtn = document.getElementById('download-cv');

if (downloadCVBtn) {
    downloadCVBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Check if CV file exists, otherwise show message
        const cvUrl = 'documents/Rinzin_Dorji_CV.pdf';
        
        // Create temporary link for download
        const link = document.createElement('a');
        link.href = cvUrl;
        link.download = 'Rinzin_Dorji_CV.pdf';
        link.target = '_blank';
        
        // Try to download, fallback to alert if file doesn't exist
        fetch(cvUrl, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    link.click();
                } else {
                    alert('CV is being updated. Please contact me via email for the latest version.');
                }
            })
            .catch(() => {
                alert('CV is being updated. Please contact me via email for the latest version.');
            });
    });
}

// ============================================
// CONTACT FORM (WEB3FORMS)
// ============================================

const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            const formData = new FormData(contactForm);
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.classList.remove('bg-brand-600', 'hover:bg-brand-500');
                submitBtn.classList.add('bg-green-600');
                contactForm.reset();
                
                // Reset button after delay
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('bg-green-600');
                    submitBtn.classList.add('bg-brand-600', 'hover:bg-brand-500');
                }, 3000);
            } else {
                throw new Error(result.message || 'Something went wrong');
            }
        } catch (error) {
            submitBtn.innerHTML = '<i class="fas fa-times"></i> Failed to send';
            submitBtn.classList.remove('bg-brand-600', 'hover:bg-brand-500');
            submitBtn.classList.add('bg-red-600');
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('bg-red-600');
                submitBtn.classList.add('bg-brand-600', 'hover:bg-brand-500');
            }, 3000);
        }
    });
}

// ============================================
// LAZY LOADING FOR IMAGES
// ============================================

if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}
