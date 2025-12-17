document.getElementById('year').textContent = new Date().getFullYear();

// Preloader
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    preloader.style.opacity = '0';
    setTimeout(() => {
        preloader.style.display = 'none';
    }, 700);
});

// Custom Cursor
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');

if (window.matchMedia("(min-width: 768px)").matches) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
    });

    document.querySelectorAll('a, button, .glass-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.backgroundColor = 'rgba(34, 197, 94, 0.1)';
            cursor.style.borderColor = 'transparent';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.backgroundColor = 'transparent';
            cursor.style.borderColor = 'rgba(34, 197, 94, 0.5)';
        });
    });
}

// Scroll Progress Bar & Nav Background
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    const progressBar = document.getElementById('scroll-progress');
    
    // Nav background
    if (window.scrollY > 20) nav.classList.add('nav-scrolled');
    else nav.classList.remove('nav-scrolled');

    // Progress Bar
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (progressBar) {
        progressBar.style.width = scrolled + "%";
    }
});

const menu = document.getElementById('mobile-menu');
const openBtn = document.getElementById('mobile-menu-btn');
const closeBtn = document.getElementById('close-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

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

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// 3D Tilt Effect
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.glass-card, .profile-img-container');
    
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Only apply if mouse is near the card to save performance
        if (
            e.clientX >= rect.left - 50 && 
            e.clientX <= rect.right + 50 && 
            e.clientY >= rect.top - 50 && 
            e.clientY <= rect.bottom + 50
        ) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5; // Max rotation deg
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = 'transform 0.1s ease';
        } else {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            card.style.transition = 'transform 0.5s ease';
        }
    });
});
