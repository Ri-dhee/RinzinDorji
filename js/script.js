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
    setTimeout(() => {
        preloader.style.display = 'none';
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
// CUSTOM CURSOR
// ============================================

const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

if (window.matchMedia("(min-width: 768px)").matches && cursor && cursorDot) {
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
        cursor.style.opacity = '1';
        cursorDot.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorDot.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorDot.style.opacity = '1';
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor hover effects
    document.querySelectorAll('a, button, .glass-card, .glass-card-premium').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(2)';
            cursor.style.backgroundColor = 'rgba(34, 197, 94, 0.15)';
            cursor.style.borderColor = 'rgba(34, 197, 94, 0.8)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.backgroundColor = 'transparent';
            cursor.style.borderColor = 'rgba(34, 197, 94, 0.5)';
        });
    });
}

// ============================================
// NAVIGATION
// ============================================

const nav = document.getElementById('navbar');
const progressBar = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
    // Nav background on scroll
    if (window.scrollY > 20) {
        nav.classList.add('nav-scrolled');
    } else {
        nav.classList.remove('nav-scrolled');
    }

    // Progress bar
    if (progressBar) {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    }
});

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
// SCROLL ANIMATIONS
// ============================================

// Reveal elements on scroll
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Stagger children animation
const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.stagger-children').forEach(el => staggerObserver.observe(el));

// Timeline items animation
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.timeline-item').forEach(el => timelineObserver.observe(el));

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
