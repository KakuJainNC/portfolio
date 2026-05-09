// ====================
// Matrix Rain Background
// ====================

function initMatrixRain() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const CHARS = '0123456789/|\\<>{}[];:.,!?=+-*#@$%^&~';
    const FADE  = 0.055;
    const BG    = 'rgba(5,14,8,';

    // ── DOM setup ──────────────────────────────────────────────────

    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-bg';
    canvas.style.cssText = [
        'position:fixed;top:0;left:0;width:100%;height:100%',
        'z-index:-1;opacity:0.28',
        'pointer-events:none;display:block',
    ].join(';');

    const veil = document.createElement('div');
    veil.id = 'matrix-veil';
    veil.style.cssText = [
        'position:fixed;top:0;left:0;width:100%;height:100%',
        'z-index:-1;opacity:0.30',
        'background:#030905',
        'pointer-events:none',
        'transition:opacity 0.8s ease',
    ].join(';');

    document.body.insertBefore(canvas, document.body.firstChild);
    document.body.insertBefore(veil, canvas.nextSibling);

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    // ── Column state ───────────────────────────────────────────────

    let FS, cols, heads, speeds, colChars;

    function resize() {
        const W = window.innerWidth, H = window.innerHeight;
        FS = W < 600 ? 14 : 16;
        canvas.width  = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        cols     = Math.floor(W / FS) + 1;
        heads    = new Float32Array(cols);
        speeds   = new Float32Array(cols);
        colChars = [];
        for (let c = 0; c < cols; c++) {
            heads[c]    = -Math.random() * H;
            speeds[c]   = FS * (20 + Math.random() * 22);
            colChars[c] = CHARS[Math.floor(Math.random() * CHARS.length)];
        }
        ctx.fillStyle = BG + '1)';
        ctx.fillRect(0, 0, W, H);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // ── Static draw for reduced-motion ────────────────────────────

    if (prefersReduced) {
        const W = window.innerWidth, H = window.innerHeight;
        ctx.font = `${FS}px monospace`;
        for (let c = 0; c < cols; c++) {
            for (let row = 0; row < Math.floor(H / FS); row++) {
                if (Math.random() > 0.82) {
                    ctx.fillStyle = `rgba(53,94,59,${0.10 + Math.random() * 0.25})`;
                    ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], c * FS, row * FS);
                }
            }
        }
        canvas.style.opacity = '0.07';
        veil.style.opacity   = '0.33';
        return;
    }

    // ── Intro overlay ──────────────────────────────────────────────

    const introDiv = document.createElement('div');
    introDiv.style.cssText = [
        'position:fixed;top:0;left:0;width:100%;height:100%',
        'z-index:10000',
        'display:flex;flex-direction:column;align-items:center;justify-content:center',
        'pointer-events:none',
        'opacity:0;transition:opacity 0.4s ease',
    ].join(';');
    introDiv.innerHTML =
        '<div style="text-align:center;padding:0 1rem">' +
        '<div style="font-family:\'Playfair Display\',Georgia,serif;' +
            'font-size:clamp(2.5rem,8vw,90px);font-weight:700;color:#ffffff;' +
            'text-shadow:0 0 40px rgba(53,94,59,0.9),0 4px 24px rgba(0,0,0,0.7);">' +
            'Kaku Jain' +
        '</div>' +
        '<div style="font-family:\'Inter\',Arial,sans-serif;' +
            'font-size:clamp(0.7rem,1.8vw,1.05rem);' +
            'color:rgba(180,228,198,0.88);' +
            'letter-spacing:0.35em;margin-top:1.4rem;' +
            'text-shadow:0 0 18px rgba(53,94,59,0.7);">' +
            'WELCOME TO THE FUTURE' +
        '</div>' +
        '</div>';
    document.body.appendChild(introDiv);

    requestAnimationFrame(() => requestAnimationFrame(() => {
        introDiv.style.opacity = '1';
    }));

    // ── Animation loop ─────────────────────────────────────────────

    const INTRO_MS   = 3000;
    const TRANS_MS   = 800;
    const SPEED_FULL = 1.0;
    const SPEED_BG   = 0.3;

    let prevTs     = null;
    let startTs    = null;
    let rafId      = null;
    let speedMult  = SPEED_FULL;
    let phase      = 'intro';
    let transStart = 0;

    function beginTransition(ts) {
        phase = 'transition';
        transStart = ts;
        canvas.style.transition = 'opacity 0.8s ease';
        canvas.style.opacity    = '0.07';
        veil.style.opacity      = '0.33';
        introDiv.style.opacity  = '0';
        setTimeout(() => introDiv.remove(), 450);
    }

    function tick(ts) {
        if (startTs === null) startTs = ts;
        const elapsed = ts - startTs;
        const dt      = prevTs === null ? 0 : Math.min((ts - prevTs) / 1000, 0.05);
        prevTs = ts;

        if (phase === 'intro' && elapsed >= INTRO_MS) {
            beginTransition(ts);
        }
        if (phase === 'transition') {
            const tp = Math.min((ts - transStart) / TRANS_MS, 1);
            speedMult = SPEED_FULL + (SPEED_BG - SPEED_FULL) * tp;
            if (tp >= 1) phase = 'bg';
        }

        const W = window.innerWidth, H = window.innerHeight;

        ctx.fillStyle = BG + FADE + ')';
        ctx.fillRect(0, 0, W, H);

        ctx.font = `${FS}px monospace`;
        for (let c = 0; c < cols; c++) {
            heads[c] += speeds[c] * speedMult * dt;

            if (Math.random() < 0.015) {
                colChars[c] = CHARS[Math.floor(Math.random() * CHARS.length)];
            }

            const x = c * FS;
            const y = heads[c];

            if (y > -FS && y < H + FS) {
                ctx.fillStyle = 'rgba(220,255,222,0.92)';
                ctx.fillText(colChars[c], x, y);
            }

            if (heads[c] > H + FS * 2) {
                heads[c]    = -(FS * (2 + Math.random() * 15));
                speeds[c]   = FS * (20 + Math.random() * 22);
                colChars[c] = CHARS[Math.floor(Math.random() * CHARS.length)];
            }
        }

        rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
            prevTs = null;
        } else if (!rafId) {
            rafId = requestAnimationFrame(tick);
        }
    });
}

initMatrixRain();

// ====================
// Language Switcher
// ====================

let currentLanguage = localStorage.getItem('language') || 'en';

// Helper function to get translation
function getNestedTranslation(obj, key) {
    // Translations are stored as flat keys with dots (e.g., 'nav.home')
    return obj[key];
}

// Translation function
function translatePage(lang) {
    // Check if translations are loaded
    if (typeof translations === 'undefined') {
        console.error('Translations not loaded!');
        setTimeout(() => translatePage(lang), 100); // Retry after 100ms
        return;
    }
    
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    console.log(`Translating to ${lang}...`);
    
    let translatedCount = 0;
    
    // Update all elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        const translation = getNestedTranslation(translations[lang], key);
        
        if (translation) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                // Check if translation contains line breaks
                if (translation.includes('\n')) {
                    element.innerHTML = translation.replace(/\n/g, '<br>');
                } else {
                    element.textContent = translation;
                }
            }
            translatedCount++;
        } else {
            console.warn(`Missing translation for key: ${key}`);
        }
    });
    
    // Update button states
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    console.log(`Translation complete: ${translatedCount} elements translated to ${lang}`);
}

// Initialize language switcher when DOM is ready
function initLanguageSwitcher() {
    const langEnBtn = document.getElementById('langEn');
    const langEsBtn = document.getElementById('langEs');
    
    if (langEnBtn && langEsBtn) {
        langEnBtn.addEventListener('click', () => {
            console.log('Switching to English...');
            translatePage('en');
        });
        langEsBtn.addEventListener('click', () => {
            console.log('Switching to Spanish...');
            translatePage('es');
        });
        
        // Set initial language
        console.log('Initializing language:', currentLanguage);
        translatePage(currentLanguage);
    } else {
        console.error('Language buttons not found!');
    }
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing language switcher...');
    initLanguageSwitcher();
});

// ==================== 
// Smooth Scrolling & Navigation
// ==================== 

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Active navigation links on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// ==================== 
// Portfolio Filter
// ==================== 

const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        
        portfolioItems.forEach(item => {
            if (filterValue === 'all') {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                if (item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            }
        });
    });
});

// ==================== 
// Testimonials Slider
// ==================== 

const testimonialsSlider = document.querySelector('.testimonials-slider');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const sliderDots = document.getElementById('sliderDots');

let currentSlide = 0;
const totalSlides = testimonialCards.length;

// Create dots
for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    sliderDots.appendChild(dot);
}

const dots = document.querySelectorAll('.dot');

function updateSlider() {
    const cardWidth = testimonialCards[0].offsetWidth + 32; // Card width + gap
    testimonialsSlider.scrollTo({
        left: cardWidth * currentSlide,
        behavior: 'smooth'
    });
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function goToSlide(index) {
    currentSlide = index;
    updateSlider();
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
}

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Auto-play slider
let autoPlayInterval = setInterval(nextSlide, 5000);

// Pause auto-play on hover
testimonialsSlider.addEventListener('mouseenter', () => {
    clearInterval(autoPlayInterval);
});

testimonialsSlider.addEventListener('mouseleave', () => {
    autoPlayInterval = setInterval(nextSlide, 5000);
});

// ==================== 
// Contact Form
// ==================== 

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    console.log('Form submitted:', data);
    
    // Show success message
    alert('Thank you for your message! I will get back to you soon.');
    
    // Reset form
    contactForm.reset();
    
    // In a real application, you would send this data to a server
    // Example: 
    // fetch('/api/contact', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(data)
    // });
});

// ==================== 
// Scroll to Top Button
// ==================== 

const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ==================== 
// Intersection Observer for Animations
// ==================== 

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all portfolio items
portfolioItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'all 0.6s ease';
    observer.observe(item);
});

// Observe testimonial cards
testimonialCards.forEach(card => {
    observer.observe(card);
});

// ==================== 
// Form Input Animations
// ==================== 

const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');

formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.style.transform = 'translateY(-2px)';
    });
    
    input.addEventListener('blur', () => {
        input.parentElement.style.transform = 'translateY(0)';
    });
});

// ==================== 
// Cursor Effect (Optional Enhancement)
// ==================== 

// Create custom cursor elements (optional - can be removed if too much)
const cursor = document.createElement('div');
const cursorFollower = document.createElement('div');

cursor.classList.add('custom-cursor');
cursorFollower.classList.add('custom-cursor-follower');

// Only add on desktop
if (window.innerWidth > 768) {
    document.body.appendChild(cursor);
    document.body.appendChild(cursorFollower);
    
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });
    
    // Smooth follower animation
    function animateFollower() {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;
        
        requestAnimationFrame(animateFollower);
    }
    
    animateFollower();
    
    // Add hover effects on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .portfolio-item, input, textarea');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform += ' scale(1.5)';
            cursorFollower.style.transform += ' scale(1.5)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = cursor.style.transform.replace(' scale(1.5)', '');
            cursorFollower.style.transform = cursorFollower.style.transform.replace(' scale(1.5)', '');
        });
    });
}

// ==================== 
// Loading Animation
// ==================== 

window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ==================== 
// Parallax Effect on Hero
// ==================== 

const heroSection = document.querySelector('.hero');
const heroContent = document.querySelector('.hero-content');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.5;
    
    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }
});

// ==================== 
// Stats Counter Animation
// ==================== 

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const duration = 2000;
    const stepTime = duration / 100;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, stepTime);
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const stats = document.querySelectorAll('.stat-item h3');
            stats.forEach(stat => {
                const target = parseInt(stat.textContent);
                animateCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ==================== 
// Prevent animations on page load
// ==================== 

document.addEventListener('DOMContentLoaded', () => {
    // Remove any initial animation classes
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-right');
    
    setTimeout(() => {
        animatedElements.forEach(el => {
            el.style.opacity = '1';
        });
    }, 100);
});

// ==================== 
// Console Message
// ==================== 

console.log('%c👋 Welcome to Kaku Jain\'s Portfolio!', 'color: #355E3B; font-size: 20px; font-weight: bold;');
console.log('%cLooking for a talented designer? Let\'s connect!', 'color: #4a7a52; font-size: 14px;');
