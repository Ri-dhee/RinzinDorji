/**
 * Portfolio Website - Main Script
 * Clean, organized JavaScript for animations and interactions
 */

// ============================================
// INITIALIZATION
// ============================================

const HAS_INTERSECTION_OBSERVER = 'IntersectionObserver' in window;

// Set current year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ============================================
// PRELOADER
// ============================================

window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (!preloader) {
        document.body.classList.add('loaded');
        animateHeroText();
        return;
    }
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

class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => {
            this.resolve = resolve;
        });
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        if (this.frameRequest) cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
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
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

function animateHeroText() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.classList.add('animate-in');

        // Scramble effect for the subtitle or specific words
        const scrambleEl = document.querySelector('.gradient-text');
        if (scrambleEl) {
            const fx = new TextScramble(scrambleEl);
            setTimeout(() => {
                fx.setText(scrambleEl.innerText);
            }, 1000);
        }
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
const scrollCircle = document.getElementById('scroll-circle');
const backToTop = document.getElementById('back-to-top');
const ambientBlobs = document.querySelectorAll('.ambient-blob');

let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            const scrollY = window.scrollY;

            // Nav background on scroll
            if (nav) {
                if (scrollY > 20) {
                    nav.classList.add('nav-scrolled');
                } else {
                    nav.classList.remove('nav-scrolled');
                }
            }

            // Progress bar & Circle
            const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = scrollTotal > 0 ? (scrollY / scrollTotal) * 100 : 0;

            if (progressBar) {
                progressBar.style.width = scrolled + '%';
            }

            if (scrollCircle) {
                const circumference = 2 * Math.PI * 45;
                const offset = circumference - (scrolled / 100) * circumference;
                scrollCircle.style.strokeDashoffset = offset;
            }

            // Ambient blobs parallax
            if (ambientBlobs.length) {
                ambientBlobs.forEach((blob, i) => {
                    const rotation = scrollY * 0.02 * (i % 2 === 0 ? 1 : -1);
                    blob.style.transform = `rotate(${rotation}deg) scale(${1 + Math.sin(scrollY * 0.001) * 0.1})`;
                });
            }

            // Back to top visibility
            if (backToTop) {
                if (scrollY > 500) {
                    backToTop.classList.remove('opacity-0', 'invisible');
                    backToTop.classList.add('opacity-100', 'visible');
                } else {
                    backToTop.classList.add('opacity-0', 'invisible');
                    backToTop.classList.remove('opacity-100', 'visible');
                }
            }

            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// Back to top click handler (visibility handled in scroll rAF above)
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

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
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Ignore links that are just '#' to prevent SyntaxError
        if (href === '#') return;

        e.preventDefault();
        try {
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } catch (err) {
            console.error('Invalid selector:', href);
        }
    });
});

// ============================================
// SCROLL ANIMATIONS (single observer for performance)
// ============================================

if (HAS_INTERSECTION_OBSERVER) {
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active', 'visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '50px' });

    // Observe all animated elements at once
    document.querySelectorAll('.reveal, .stagger-children, .timeline-item').forEach(el => scrollObserver.observe(el));
} else {
    document.querySelectorAll('.reveal, .stagger-children, .timeline-item').forEach(el => {
        el.classList.add('active', 'visible');
    });
}

// ============================================
// COUNTER ANIMATION
// ============================================

function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = Number.parseInt(counter.getAttribute('data-target') || '0', 10);
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

if (HAS_INTERSECTION_OBSERVER) {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounters();
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.counter-section').forEach(el => counterObserver.observe(el));
} else {
    animateCounters();
}

// ============================================
// TEXT SCRAMBLE EFFECT
// ============================================

if (HAS_INTERSECTION_OBSERVER) {
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
}

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
// PARALLAX EFFECT
// ============================================
// (Handled in the rAF-throttled scroll listener above for performance)

// ============================================
// ANIMATED SKILL BARS
// ============================================

if (HAS_INTERSECTION_OBSERVER) {
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
} else {
    document.querySelectorAll('.skill-bar').forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = width + '%';
        bar.style.transition = 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });
}

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
        if (!submitBtn) return;
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

if (HAS_INTERSECTION_OBSERVER) {
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

// ============================================
// CUSTOM CURSOR
// ============================================

const cursorDot = document.querySelector("[data-cursor-dot]");
const cursorOutline = document.querySelector("[data-cursor-outline]");

if (cursorDot && cursorOutline) {
    let cursorEnabled = false;
    const enableCursor = () => {
        if (cursorEnabled) return;
        cursorEnabled = true;
        document.body.classList.add('cursor-enabled');
    };

    window.addEventListener('touchstart', () => {
        cursorEnabled = false;
        document.body.classList.remove('cursor-enabled');
    }, { passive: true });

    window.addEventListener("mousemove", (e) => {
        enableCursor();
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });

        // Parallax effect for ambient blobs
        ambientBlobs.forEach((blob, index) => {
            const speed = (index + 1) * 0.02;
            const x = (window.innerWidth - e.pageX * speed) / 100;
            const y = (window.innerHeight - e.pageY * speed) / 100;
            blob.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    // Add hover effect to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .magnetic-btn, input, textarea');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });
}

// ============================================
// PARTICLE BACKGROUND
// ============================================

const canvas = document.getElementById('particle-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 50;

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.fillStyle = `rgba(34, 197, 94, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', initParticles);
    initParticles();
    animateParticles();
}

// ============================================
// 3D TILT EFFECT
// ============================================

const tiltElements = document.querySelectorAll('.profile-img-container, .glass-card, .research-card');

tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    el.addEventListener('mouseleave', () => {
        el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
    
    el.style.transition = 'transform 0.1s ease-out';
});
