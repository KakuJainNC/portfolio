// ====================
// Intro Animation
// ====================

function runIntroAnimation() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:10000;';
    document.body.insertBefore(canvas, document.body.firstChild);
    document.body.style.overflow = 'hidden';

    const ctx = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    // ── Deterministic pseudo-random (no flicker) ──────────────────────────
    let _seed = 137;
    function rng() {
        _seed = (_seed * 1664525 + 1013904223) & 0x7fffffff;
        return _seed / 0x7fffffff;
    }

    // ── Cracked-earth crack network ───────────────────────────────────────
    // Main vertical cracks [x0,y0, cx,cy, x1,y1, width]
    const mainCracks = [
        [0.07, 0.00,  0.05, 0.40,  0.08, 1.00,  2.2],
        [0.20, 0.00,  0.22, 0.38,  0.18, 1.00,  2.0],
        [0.34, 0.00,  0.32, 0.42,  0.35, 1.00,  1.8],
        [0.48, 0.00,  0.50, 0.45,  0.47, 1.00,  2.1],
        [0.63, 0.00,  0.61, 0.38,  0.64, 1.00,  1.9],
        [0.78, 0.00,  0.80, 0.42,  0.77, 1.00,  2.0],
        [0.91, 0.00,  0.93, 0.35,  0.90, 1.00,  1.7],
    ];
    // Cross / branch cracks [x0,y0, cx,cy, x1,y1, width]
    const branchCracks = [
        [0.07,0.18,  0.13,0.19,  0.20,0.18,  1.2],
        [0.07,0.52,  0.13,0.54,  0.20,0.52,  1.0],
        [0.07,0.80,  0.13,0.78,  0.20,0.80,  0.9],
        [0.20,0.12,  0.27,0.13,  0.34,0.12,  1.1],
        [0.20,0.38,  0.27,0.40,  0.34,0.38,  1.3],
        [0.20,0.68,  0.27,0.66,  0.34,0.68,  1.0],
        [0.34,0.22,  0.41,0.23,  0.48,0.22,  1.2],
        [0.34,0.55,  0.41,0.57,  0.48,0.55,  1.1],
        [0.34,0.82,  0.41,0.80,  0.48,0.82,  0.9],
        [0.48,0.15,  0.55,0.16,  0.63,0.15,  1.0],
        [0.48,0.44,  0.55,0.46,  0.63,0.44,  1.2],
        [0.48,0.74,  0.55,0.72,  0.63,0.74,  1.0],
        [0.63,0.28,  0.70,0.29,  0.78,0.28,  1.1],
        [0.63,0.58,  0.70,0.60,  0.78,0.58,  1.3],
        [0.63,0.88,  0.70,0.86,  0.78,0.88,  0.9],
        [0.78,0.18,  0.84,0.19,  0.91,0.18,  1.0],
        [0.78,0.52,  0.84,0.54,  0.91,0.52,  1.2],
        [0.78,0.78,  0.84,0.76,  0.91,0.78,  1.0],
        // short stubs
        [0.07,0.32,  0.11,0.34,  0.15,0.33,  0.8],
        [0.20,0.55,  0.24,0.56,  0.28,0.55,  0.7],
        [0.34,0.70,  0.30,0.72,  0.26,0.71,  0.7],
        [0.48,0.30,  0.52,0.31,  0.56,0.30,  0.8],
        [0.63,0.72,  0.67,0.70,  0.71,0.71,  0.7],
        [0.78,0.40,  0.82,0.41,  0.86,0.40,  0.8],
    ];

    // ── Background jungle trees ───────────────────────────────────────────
    const bgTrees = Array.from({length: 14}, (_, i) => ({
        xRatio:   0.02 + rng() * 0.88,
        trunkH:   0.25 + rng() * 0.25,   // fraction of screen height
        trunkW:   5    + rng() * 7,
        canopyR:  35   + rng() * 55,
        layers:   2    + Math.round(rng()),
        hue:      120  + rng() * 18,
        li:       14   + rng() * 8
    }));

    // ── Vegetation fringe profile (canopy lumps extending into drought zone)
    // Each entry: [yRatio, xOffset beyond green edge]
    // Lumps = tree canopies, valleys = gaps between trees
    const fringeProfile = [
        [0.00,  4],
        [0.03, 38], [0.06, 78], [0.09, 98], [0.12, 88], [0.15, 60],  // canopy 1
        [0.17, 28], [0.19, 22],                                         // gap
        [0.21, 42], [0.24, 80], [0.27, 100],[0.31, 90], [0.34, 62],   // canopy 2
        [0.36, 26], [0.38, 20],                                         // gap
        [0.40, 50], [0.43, 88], [0.47, 108],[0.50, 95], [0.53, 65],   // canopy 3 (largest)
        [0.55, 30], [0.57, 24],                                         // gap
        [0.59, 45], [0.62, 82], [0.66, 97], [0.69, 85], [0.72, 55],   // canopy 4
        [0.74, 28], [0.76, 22],                                         // gap
        [0.78, 40], [0.81, 75], [0.85, 92], [0.88, 80], [0.91, 52],   // canopy 5
        [0.93, 28], [0.96, 14], [0.99,  5], [1.00,  4],
    ];

    // ── Grass blades (point right into drought zone) ──────────────────────
    const blades = Array.from({length: 75}, () => ({
        yr:   rng(),
        len:  10 + rng() * 22,
        lean: (rng() - 0.5) * 14,
        th:   1.5 + rng() * 2.5,
        hue:  118 + rng() * 28,
        li:   26  + rng() * 18
    })).sort((a, b) => a.yr - b.yr);

    // ── Helpers ───────────────────────────────────────────────────────────
    function waveAt(yn, xBase, amp) {
        return xBase
            + Math.sin(yn * 11.0 + 0.8) * amp * 0.50
            + Math.sin(yn *  6.3 + 2.1) * amp * 0.33
            + Math.sin(yn *  3.1 + 0.4) * amp * 0.17;
    }
    function ease(t) { return t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t; }

    const T = {
        sweepStart:  350,
        sweepEnd:   2700,
        nameStart:  2200,
        nameEnd:    3000,
        holdUntil:  3900,
        fadeEnd:    4900
    };

    let start = null;

    function frame(ts) {
        if (!start) start = ts;
        const elapsed = ts - start;
        const w = canvas.width, h = canvas.height;

        // Global fade-out
        let ga = 1;
        if (elapsed > T.holdUntil)
            ga = 1 - Math.min((elapsed - T.holdUntil) / (T.fadeEnd - T.holdUntil), 1);
        if (ga <= 0) { canvas.remove(); document.body.style.overflow = ''; return; }

        ctx.clearRect(0, 0, w, h);
        ctx.globalAlpha = ga;

        // ── 1. Cracked drought earth (full background) ────────────────────
        const eg = ctx.createLinearGradient(0, 0, 0, h);
        eg.addColorStop(0,    '#4a3420');
        eg.addColorStop(0.35, '#3c2818');
        eg.addColorStop(0.75, '#2e1e10');
        eg.addColorStop(1,    '#1e1208');
        ctx.fillStyle = eg;
        ctx.fillRect(0, 0, w, h);

        // Subtle polygon cell tint between cracks (raised earth pieces)
        const cellTint = ctx.createRadialGradient(w*0.5, h*0.5, 0, w*0.5, h*0.5, w*0.6);
        cellTint.addColorStop(0,   'rgba(90, 60, 30, 0.12)');
        cellTint.addColorStop(1,   'rgba(30, 15, 5,  0.0)');
        ctx.fillStyle = cellTint;
        ctx.fillRect(0, 0, w, h);

        // Draw crack network
        function drawCrack(x0, y0, cx, cy, x1, y1, lw, alpha) {
            // Raised-edge highlight (slightly lighter glow around crack)
            ctx.beginPath();
            ctx.moveTo(x0*w, y0*h);
            ctx.quadraticCurveTo(cx*w, cy*h, x1*w, y1*h);
            ctx.strokeStyle = `rgba(95, 65, 32, ${alpha * 0.55})`;
            ctx.lineWidth   = lw + 2;
            ctx.stroke();
            // Dark crack depth
            ctx.beginPath();
            ctx.moveTo(x0*w, y0*h);
            ctx.quadraticCurveTo(cx*w, cy*h, x1*w, y1*h);
            ctx.strokeStyle = `rgba(8, 3, 1, ${alpha * 0.92})`;
            ctx.lineWidth   = lw;
            ctx.stroke();
        }

        ctx.save();
        ctx.lineCap = 'round';
        mainCracks.forEach(([x0,y0,cx,cy,x1,y1,lw]) => drawCrack(x0,y0,cx,cy,x1,y1,lw,1));
        branchCracks.forEach(([x0,y0,cx,cy,x1,y1,lw]) => drawCrack(x0,y0,cx,cy,x1,y1,lw,0.85));
        ctx.restore();

        // ── 2. Jungle sweep ───────────────────────────────────────────────
        const sweepRaw = Math.max(elapsed - T.sweepStart, 0) / (T.sweepEnd - T.sweepStart);
        const sweepP   = ease(Math.min(sweepRaw, 1));
        const gx       = sweepP * w;                          // green edge x
        const wAmp     = Math.min(gx * 0.018, 16);

        if (gx > 1) {
            // Jungle fill
            const jg = ctx.createLinearGradient(0, 0, 0, h);
            jg.addColorStop(0,    '#0a1a0d');
            jg.addColorStop(0.25, '#0f2212');
            jg.addColorStop(0.65, '#152a18');
            jg.addColorStop(1,    '#0c1a0e');
            ctx.fillStyle = jg;

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(waveAt(0, gx, wAmp), 0);
            for (let i = 1; i <= 160; i++) {
                const yn = i / 160;
                ctx.lineTo(waveAt(yn, gx, wAmp), yn * h);
            }
            ctx.lineTo(0, h);
            ctx.closePath();
            ctx.fill();

            // Dappled canopy light (subtle green shimmer inside jungle)
            const shimmer = ctx.createLinearGradient(0, 0, gx * 0.7, h);
            shimmer.addColorStop(0,   'rgba(30, 80, 35, 0.10)');
            shimmer.addColorStop(0.5, 'rgba(20, 60, 25, 0.04)');
            shimmer.addColorStop(1,   'rgba(10, 40, 15, 0.0)');
            ctx.fillStyle = shimmer;
            ctx.fillRect(0, 0, gx, h);

            // Background trees (clipped inside jungle)
            ctx.save();
            ctx.beginPath();
            ctx.rect(0, 0, gx - wAmp - 15, h);
            ctx.clip();
            bgTrees.forEach(t => {
                const tx    = t.xRatio * gx;
                if (tx < 20 || tx > gx - 35) return;
                const trkH  = t.trunkH * h;
                const trkY  = h - trkH;
                // Trunk
                ctx.fillStyle = '#070f08';
                ctx.fillRect(tx - t.trunkW/2, trkY, t.trunkW, trkH + 2);
                // Canopy layers (bottom to top)
                for (let l = 0; l <= t.layers; l++) {
                    const cy = trkY - t.canopyR * 0.3 - l * t.canopyR * 0.58;
                    const cr = t.canopyR * (1 - l * 0.16);
                    ctx.beginPath();
                    ctx.ellipse(tx, cy, cr, cr * 0.72, 0, 0, Math.PI*2);
                    ctx.fillStyle = `hsl(${t.hue}, 40%, ${t.li + l * 4}%)`;
                    ctx.fill();
                }
            });
            ctx.restore();

            // ── 3. Vegetation fringe (continuous canopy invading drought zone) ──

            // Outer fringe path: follows the canopy profile into the drought zone
            ctx.beginPath();
            ctx.moveTo(waveAt(0, gx, wAmp), 0);
            fringeProfile.forEach(([yn, xOff]) => {
                ctx.lineTo(waveAt(yn, gx, wAmp) + xOff, yn * h);
            });
            // Return along the inner edge back to top
            for (let i = 160; i >= 0; i--) {
                const yn = i / 160;
                ctx.lineTo(waveAt(yn, gx, wAmp) - 8, yn * h);
            }
            ctx.closePath();

            // Gradient: darker at base (root/shadow), lighter at tips (sunlit canopy)
            const fg = ctx.createLinearGradient(gx, 0, gx + 115, 0);
            fg.addColorStop(0,   'hsl(127, 44%, 14%)');
            fg.addColorStop(0.3, 'hsl(128, 46%, 19%)');
            fg.addColorStop(0.7, 'hsl(129, 48%, 24%)');
            fg.addColorStop(1,   'hsl(130, 50%, 28%)');
            ctx.fillStyle = fg;
            ctx.fill();

            // Sunlit highlight on the right-facing canopy tips
            const tipGlow = ctx.createLinearGradient(gx + 60, 0, gx + 115, 0);
            tipGlow.addColorStop(0,   'rgba(120, 210, 130, 0.0)');
            tipGlow.addColorStop(0.6, 'rgba(120, 210, 130, 0.07)');
            tipGlow.addColorStop(1,   'rgba(160, 230, 150, 0.12)');
            ctx.fillStyle = tipGlow;
            ctx.fill();

            // Grass blades
            blades.forEach(b => {
                const by = b.yr * h;
                const bx = waveAt(b.yr, gx, wAmp);
                ctx.beginPath();
                ctx.moveTo(bx, by);
                ctx.quadraticCurveTo(
                    bx + b.len * 0.55, by + b.lean * 0.4 - b.th,
                    bx + b.len,        by + b.lean
                );
                ctx.quadraticCurveTo(
                    bx + b.len * 0.55, by + b.lean * 0.4 + b.th,
                    bx,                by + b.th * 0.5
                );
                ctx.fillStyle = `hsl(${b.hue}, 50%, ${b.li}%)`;
                ctx.fill();
            });
        }

        // ── 4. Name reveal ────────────────────────────────────────────────
        const nameRaw = Math.max(elapsed - T.nameStart, 0) / (T.nameEnd - T.nameStart);
        const nameP   = ease(Math.min(nameRaw, 1));

        if (nameP > 0) {
            ctx.globalAlpha = ga * nameP;

            const fs  = Math.min(w * 0.088, 90);
            const cx  = w / 2;
            const cy  = h / 2 + (1 - nameP) * 20;

            ctx.textAlign    = 'center';
            ctx.textBaseline = 'middle';

            // Name
            ctx.shadowColor = 'rgba(0,0,0,0.55)';
            ctx.shadowBlur  = 32;
            ctx.fillStyle   = '#ffffff';
            ctx.font        = `bold ${fs}px Georgia, "Playfair Display", serif`;
            ctx.fillText('Kaku Jain', cx, cy - fs * 0.08);

            // Tagline
            ctx.shadowBlur  = 0;
            ctx.fillStyle   = '#9de0b8';
            ctx.font        = `${Math.min(w * 0.020, 18)}px Arial, sans-serif`;
            ctx.fillText('BRINGING LIFE TO EVERY DIGITAL EXPERIENCE', cx, cy + fs * 0.74);

            ctx.globalAlpha = ga;
            ctx.textAlign   = 'start';
            ctx.shadowBlur  = 0;
        }

        requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
}

// Run on every page load
runIntroAnimation();

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
