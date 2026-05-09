// ====================
// Reverse Desertification Intro
// ====================

function runDesertAnimation() {
    if (sessionStorage.getItem('introPlayed')) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        sessionStorage.setItem('introPlayed', '1');
        return;
    }
    sessionStorage.setItem('introPlayed', '1');

    // ── DOM setup ──────────────────────────────────────────────

    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:10000;';

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;display:block;';

    const skipBtn = document.createElement('button');
    skipBtn.innerHTML = 'Skip Intro <i class="fas fa-arrow-right" style="font-size:11px"></i>';
    skipBtn.style.cssText = [
        'position:absolute;top:20px;right:20px',
        'min-width:44px;min-height:44px',
        'padding:8px 16px',
        'background:rgba(255,255,255,0.18)',
        'backdrop-filter:blur(4px)',
        'border:2px solid rgba(255,255,255,0.25)',
        'border-radius:50px',
        'color:rgba(255,255,255,0.78)',
        "font-family:'Inter',sans-serif",
        'font-size:13px;font-weight:500',
        'cursor:pointer',
        'opacity:0.88',
        'transition:opacity 0.15s ease',
        'z-index:2',
    ].join(';');
    skipBtn.setAttribute('tabindex', '0');
    skipBtn.setAttribute('aria-label', 'Skip intro animation');
    skipBtn.addEventListener('mouseover', () => { skipBtn.style.opacity = '1'; });
    skipBtn.addEventListener('mouseout',  () => { skipBtn.style.opacity = '0.88'; });

    const controlBar = document.createElement('div');
    controlBar.style.cssText = [
        'position:absolute;bottom:0;left:0;right:0',
        'display:flex;align-items:center;gap:12px',
        'padding:14px 20px 20px',
        'background:linear-gradient(transparent,rgba(0,0,0,0.40))',
        'z-index:2',
    ].join(';');

    const playBtn = document.createElement('button');
    playBtn.setAttribute('aria-label', 'Play or pause animation');
    playBtn.style.cssText = [
        'width:36px;height:36px;min-width:36px',
        'border-radius:50%;border:none',
        'background:rgba(53,94,59,0.88)',
        'color:#fff;font-size:13px',
        'cursor:pointer;flex-shrink:0',
        'display:flex;align-items:center;justify-content:center',
    ].join(';');

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min  = '0';
    slider.max  = '1000';
    slider.value = '0';
    slider.setAttribute('aria-label', 'Scrub animation progress');
    slider.style.cssText = 'flex:1;cursor:pointer;accent-color:#4a7a52;height:4px;';

    controlBar.appendChild(playBtn);
    controlBar.appendChild(slider);
    overlay.appendChild(canvas);
    overlay.appendChild(skipBtn);
    overlay.appendChild(controlBar);
    document.body.insertBefore(overlay, document.body.firstChild);
    document.body.style.overflow = 'hidden';

    const ctx = canvas.getContext('2d');
    const TOTAL_MS = 6500;
    const HOLD_MS  = 900;

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // ── Pre-generate scene data ────────────────────────────────

    // Organic frontier noise: multi-frequency sine field (fixed random phases)
    const ph = Array.from({ length: 4 }, () => Math.random() * Math.PI * 2);

    function frontierY(xf, sweepP) {
        const n = Math.sin(xf * Math.PI * 4  + ph[0]) * 0.50
                + Math.sin(xf * Math.PI * 7  + ph[1]) * 0.30
                + Math.sin(xf * Math.PI * 13 + ph[2]) * 0.15
                + Math.sin(xf * Math.PI * 2  + ph[3]) * 0.45;
        // n ≈ -1.4 .. 1.4; normalize roughly to -1..1
        const nNorm = n / 1.4;
        // Variation narrows as sweep completes, creates tendril-race-ahead effect
        const varScale = 0.13 * (1 - Math.pow(sweepP, 0.55) * 0.82);
        return Math.max(0, Math.min(1, (1 - sweepP) + nNorm * varScale));
    }

    // Grass blades at the frontier
    const blades = Array.from({ length: 65 }, () => ({
        x:     Math.random(),
        len:   12 + Math.random() * 22,
        lean:  (Math.random() - 0.5) * 14,
        thick: 1.5 + Math.random() * 2.5,
        hue:   118 + Math.random() * 28,
        lig:   24  + Math.random() * 16,
    }));

    // Ground texture tiles
    const tiles = [];
    for (let gy = 0; gy < 9; gy++) {
        for (let gx = 0; gx < 13; gx++) {
            const j = 0.009;
            const bx = gx / 13, by = gy / 9;
            tiles.push({
                pts: [
                    [bx + (Math.random()-0.5)*j, by + (Math.random()-0.5)*j],
                    [bx+1/13+(Math.random()-0.5)*j, by + (Math.random()-0.5)*j],
                    [bx+1/13+(Math.random()-0.5)*j, by+1/9+(Math.random()-0.5)*j],
                    [bx + (Math.random()-0.5)*j, by+1/9+(Math.random()-0.5)*j],
                ],
                shade: 0.04 + Math.random() * 0.07,
            });
        }
    }

    // Crack network (quadratic bezier segments: x1,y1, cx,cy, x2,y2 — normalized)
    const cracks = [
        [0.05,0.10, 0.24,0.13, 0.43,0.16],
        [0.39,0.08, 0.59,0.11, 0.78,0.14],
        [0.74,0.07, 0.87,0.09, 0.97,0.08],
        [0.08,0.28, 0.31,0.32, 0.55,0.35],
        [0.51,0.26, 0.72,0.30, 0.94,0.28],
        [0.03,0.47, 0.28,0.51, 0.51,0.54],
        [0.47,0.44, 0.69,0.49, 0.90,0.46],
        [0.12,0.66, 0.40,0.70, 0.63,0.73],
        [0.59,0.63, 0.78,0.68, 0.96,0.65],
        [0.18,0.83, 0.48,0.87, 0.71,0.90],
        [0.66,0.80, 0.84,0.85, 0.96,0.82],
        [0.22,0.14, 0.21,0.31, 0.20,0.48],
        [0.61,0.12, 0.62,0.29, 0.63,0.45],
        [0.84,0.10, 0.83,0.27, 0.84,0.44],
        [0.35,0.35, 0.34,0.50, 0.33,0.67],
        [0.73,0.32, 0.74,0.48, 0.75,0.65],
        [0.48,0.54, 0.47,0.68, 0.46,0.83],
        [0.86,0.47, 0.87,0.63, 0.88,0.81],
    ];

    // Pollen / seed particles
    const pollen = Array.from({ length: 88 }, () => ({
        x:       Math.random(),
        y0:      0.35 + Math.random() * 0.55,
        drift:   (Math.random() - 0.5) * 0.009,
        rise:    0.28 + Math.random() * 0.55,
        r:       1.5  + Math.random() * 2.5,
        spawnAt: 0.63 + Math.random() * 0.18,
        hue:     72   + Math.random() * 38,
        alpha:   0.35 + Math.random() * 0.50,
    }));

    // Phase boundaries (overall progress 0..1)
    const PH = {
        sweepStart:  0.14,
        sweepEnd:    0.53,
        healStart:   0.50,
        healEnd:     0.70,
        pollenStart: 0.62,
        nameStart:   0.86,
    };

    // ── Render ─────────────────────────────────────────────────

    function draw(p) {
        const w = canvas.width, h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        // Desert background
        const dg = ctx.createLinearGradient(0, 0, 0, h);
        dg.addColorStop(0,    '#e8b87a');
        dg.addColorStop(0.45, '#d4935a');
        dg.addColorStop(0.85, '#c07038');
        dg.addColorStop(1,    '#a05828');
        ctx.fillStyle = dg;
        ctx.fillRect(0, 0, w, h);

        // Subtle tile texture
        tiles.forEach(t => {
            ctx.beginPath();
            ctx.moveTo(t.pts[0][0]*w, t.pts[0][1]*h);
            for (let i = 1; i < 4; i++) ctx.lineTo(t.pts[i][0]*w, t.pts[i][1]*h);
            ctx.closePath();
            ctx.fillStyle = `rgba(155,72,22,${t.shade})`;
            ctx.fill();
        });

        // Cracks (fade out during heal phase)
        const crackAlpha = p < PH.healStart ? 0.52
            : p < PH.healEnd ? 0.52 * (1 - (p - PH.healStart) / (PH.healEnd - PH.healStart))
            : 0;
        if (crackAlpha > 0.01) {
            ctx.save();
            ctx.strokeStyle = `rgba(75,25,6,${crackAlpha})`;
            ctx.lineWidth = 1.5;
            cracks.forEach(([x1,y1,cx,cy,x2,y2]) => {
                ctx.beginPath();
                ctx.moveTo(x1*w, y1*h);
                ctx.quadraticCurveTo(cx*w, cy*h, x2*w, y2*h);
                ctx.stroke();
            });
            ctx.restore();
        }

        // Green fill with organic flow-field frontier
        if (p > PH.sweepStart) {
            const sp = Math.min((p - PH.sweepStart) / (PH.sweepEnd - PH.sweepStart), 1);
            const N  = 180;

            const gg = ctx.createLinearGradient(0, 0, 0, h);
            gg.addColorStop(0,    '#1a3020');
            gg.addColorStop(0.35, '#2b4d30');
            gg.addColorStop(0.70, '#355E3B');
            gg.addColorStop(1,    '#4a7a52');
            ctx.fillStyle = gg;

            ctx.beginPath();
            ctx.moveTo(0, h);
            ctx.lineTo(w, h);
            for (let i = N; i >= 0; i--) {
                const xf = i / N;
                ctx.lineTo(xf * w, frontierY(xf, sp) * h);
            }
            ctx.closePath();
            ctx.fill();

            // Frontier edge highlight
            ctx.beginPath();
            for (let i = 0; i <= N; i++) {
                const xf = i / N;
                const y  = frontierY(xf, sp) * h;
                i === 0 ? ctx.moveTo(0, y) : ctx.lineTo(xf * w, y);
            }
            ctx.strokeStyle = 'rgba(120,210,140,0.32)';
            ctx.lineWidth = 2.5;
            ctx.stroke();

            // Grass blades at frontier
            if (sp > 0.03 && sp < 0.97) {
                blades.forEach(b => {
                    const bx = b.x * w;
                    const by = frontierY(b.x, sp) * h;
                    ctx.beginPath();
                    ctx.moveTo(bx, by);
                    ctx.quadraticCurveTo(bx + b.lean*0.4 - b.thick, by - b.len*0.55, bx + b.lean, by - b.len);
                    ctx.quadraticCurveTo(bx + b.lean*0.4 + b.thick, by - b.len*0.55, bx + b.thick*0.5, by);
                    ctx.fillStyle = `hsl(${b.hue},44%,${b.lig}%)`;
                    ctx.fill();
                });
            }
        }

        // Crack healing patches (small green blobs bloom along each crack)
        if (p > PH.healStart && p < PH.healEnd + 0.05) {
            const hp = Math.min((p - PH.healStart) / (PH.healEnd - PH.healStart), 1);
            cracks.forEach(([x1,y1,cx,cy,x2,y2], ci) => {
                const cp = Math.min(Math.max(hp * 1.6 - ci * 0.055, 0), 1);
                if (cp < 0.01) return;
                for (let s = 0; s < 7; s++) {
                    const t  = s / 6;
                    const px = (x1*(1-t)*(1-t) + cx*2*t*(1-t) + x2*t*t) * w;
                    const py = (y1*(1-t)*(1-t) + cy*2*t*(1-t) + y2*t*t) * h;
                    ctx.beginPath();
                    ctx.arc(px, py, 4 + cp * 7, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(53,94,59,${cp * 0.36})`;
                    ctx.fill();
                }
            });
        }

        // Pollen drift
        if (p > PH.pollenStart) {
            pollen.forEach(pl => {
                const lp = Math.max(0, (p - pl.spawnAt) / (0.93 - pl.spawnAt));
                if (lp <= 0 || lp >= 1) return;
                const px = (pl.x + pl.drift * lp * 40) * w;
                const py = (pl.y0 - lp * pl.rise * 0.36) * h;
                const a  = pl.alpha * Math.sin(lp * Math.PI);
                ctx.beginPath();
                ctx.arc(px, py, pl.r, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${pl.hue},55%,72%,${a})`;
                ctx.fill();
                const gr = ctx.createRadialGradient(px, py, 0, px, py, pl.r * 3);
                gr.addColorStop(0, `hsla(${pl.hue},65%,80%,${a * 0.22})`);
                gr.addColorStop(1, 'transparent');
                ctx.beginPath();
                ctx.arc(px, py, pl.r * 3, 0, Math.PI * 2);
                ctx.fillStyle = gr;
                ctx.fill();
            });
        }

        // Name reveal
        if (p > PH.nameStart) {
            const np = Math.min((p - PH.nameStart) / 0.10, 1);
            const en = np < 0.5 ? 2*np*np : -1 + (4 - 2*np)*np;
            ctx.save();
            ctx.globalAlpha = en;
            const fs = Math.min(w * 0.088, 90);
            const cx = w / 2, cy = h / 2 + (1 - en) * 18;
            ctx.textAlign    = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor  = 'rgba(0,0,0,0.45)';
            ctx.shadowBlur   = 28;
            ctx.fillStyle    = '#ffffff';
            ctx.font         = `bold ${fs}px Georgia,"Playfair Display",serif`;
            ctx.fillText('Kaku Jain', cx, cy - fs * 0.05);
            ctx.shadowBlur   = 0;
            ctx.fillStyle    = '#b4e4c6';
            ctx.font         = `${Math.min(w * 0.021, 19)}px Arial,sans-serif`;
            ctx.fillText('B R I N G I N G  G R E E N E R Y  B A C K', cx, cy + fs * 0.75);
            ctx.restore();
        }
    }

    // ── Playback ───────────────────────────────────────────────

    let prog = 0, playing = true, lastTs = null, rafId = null, holdTimer = null, removing = false;

    function setPlayIcon() {
        playBtn.innerHTML = playing
            ? '<i class="fas fa-pause"></i>'
            : '<i class="fas fa-play"></i>';
    }
    setPlayIcon();

    function removeOverlay() {
        if (removing) return;
        removing = true;
        if (rafId)     { cancelAnimationFrame(rafId); rafId = null; }
        if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
        document.body.style.overflow = '';
        window.removeEventListener('resize', resize);
        overlay.style.transition = 'opacity 0.25s ease';
        overlay.style.opacity    = '0';
        setTimeout(() => overlay.remove(), 280);
    }

    function tick(ts) {
        if (removing) return;
        if (playing) {
            if (lastTs !== null) {
                prog = Math.min(prog + (ts - lastTs) / TOTAL_MS, 1);
                if (prog >= 1) {
                    prog    = 1;
                    playing = false;
                    setPlayIcon();
                    holdTimer = setTimeout(removeOverlay, HOLD_MS);
                }
            }
            lastTs = ts;
        } else {
            lastTs = null;
        }
        slider.value = String(Math.round(prog * 1000));
        draw(prog);
        rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    // Scrub slider
    slider.addEventListener('input', () => {
        prog    = parseInt(slider.value, 10) / 1000;
        playing = false;
        lastTs  = null;
        if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
        setPlayIcon();
        draw(prog);
    });

    // Play / pause
    playBtn.addEventListener('click', () => {
        if (prog >= 1) prog = 0;
        playing = !playing;
        if (playing && holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
        setPlayIcon();
    });

    // Skip intro
    function doSkip(e) {
        if (e) e.preventDefault();
        removeOverlay();
    }
    skipBtn.addEventListener('click', doSkip);
    skipBtn.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') doSkip(e);
    });
}

runDesertAnimation();

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
