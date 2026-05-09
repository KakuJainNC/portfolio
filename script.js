// ====================
// Intro Animation
// ====================

function runIntroAnimation() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:10000;';
    document.body.insertBefore(canvas, document.body.firstChild);
    document.body.style.overflow = 'hidden';

    const ctx = canvas.getContext('2d');

    function setSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setSize();

    // Pre-generate grass blades (vertical, pointing upward into desert)
    const blades = Array.from({ length: 55 }, () => ({
        xRatio:    Math.random(),
        length:    14 + Math.random() * 22,
        lean:      (Math.random() - 0.5) * 10,
        thickness: 2 + Math.random() * 3,
        hue:       125 + Math.random() * 20,
        lightness: 28 + Math.random() * 14
    })).sort((a, b) => a.xRatio - b.xRatio);

    // Desert crack lines (fixed positions)
    const cracks = [
        [0.08, 0.14, 0.55, 0.19, 0.92, 0.11],
        [0.04, 0.33, 0.58, 0.38, 0.94, 0.30],
        [0.12, 0.52, 0.68, 0.57, 0.88, 0.50],
        [0.06, 0.68, 0.52, 0.73, 0.91, 0.65],
        [0.18, 0.82, 0.62, 0.87, 0.86, 0.79],
        [0.30, 0.24, 0.72, 0.20, 0.95, 0.26],
        [0.22, 0.45, 0.75, 0.49, 0.90, 0.43],
    ];

    // Wave along the horizontal advancing edge (varies by x, moves in y)
    function waveAt(xNorm, yBase, amp) {
        return yBase
            - Math.sin(xNorm * 11.0 + 0.8) * amp * 0.50
            - Math.sin(xNorm *  6.3 + 2.1) * amp * 0.33
            - Math.sin(xNorm *  3.1 + 0.4) * amp * 0.17;
    }

    function ease(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    const T = {
        sweepStart:  350,
        sweepEnd:   2350,
        nameStart:  1950,
        nameEnd:    2700,
        holdUntil:  3500,
        fadeEnd:    4400
    };

    let start = null;

    function frame(ts) {
        if (!start) start = ts;
        const elapsed = ts - start;
        const w = canvas.width, h = canvas.height;

        // Global fade-out
        let globalAlpha = 1;
        if (elapsed > T.holdUntil) {
            globalAlpha = 1 - Math.min((elapsed - T.holdUntil) / (T.fadeEnd - T.holdUntil), 1);
        }
        if (globalAlpha <= 0) {
            canvas.remove();
            document.body.style.overflow = '';
            return;
        }

        ctx.clearRect(0, 0, w, h);
        ctx.globalAlpha = globalAlpha;

        // Desert background
        const dg = ctx.createLinearGradient(0, 0, w, h);
        dg.addColorStop(0,   '#ddb46e');
        dg.addColorStop(0.4, '#cc9050');
        dg.addColorStop(0.8, '#b07240');
        dg.addColorStop(1,   '#8c5a2e');
        ctx.fillStyle = dg;
        ctx.fillRect(0, 0, w, h);

        // Crack lines
        ctx.save();
        ctx.strokeStyle = 'rgba(80, 44, 12, 0.13)';
        ctx.lineWidth = 1;
        cracks.forEach(([x1, y1, cx, cy, x2, y2]) => {
            ctx.beginPath();
            ctx.moveTo(x1 * w, y1 * h);
            ctx.quadraticCurveTo(cx * w, cy * h, x2 * w, y2 * h);
            ctx.stroke();
        });
        ctx.restore();

        // Green sweep (bottom to top)
        const sweepRaw  = Math.max(elapsed - T.sweepStart, 0) / (T.sweepEnd - T.sweepStart);
        const sweepP    = ease(Math.min(sweepRaw, 1));
        const greenEdge = h - sweepP * h;          // starts at h (bottom), moves to 0 (top)
        const waveAmp   = Math.min((h - greenEdge) * 0.022, 18);

        if (sweepP > 0) {
            // Green fill: covers from the wave edge down to the bottom
            const gg = ctx.createLinearGradient(0, greenEdge, 0, h);
            gg.addColorStop(0,   '#1e3622');
            gg.addColorStop(0.5, '#2b4d30');
            gg.addColorStop(1,   '#3a6640');
            ctx.fillStyle = gg;

            ctx.beginPath();
            ctx.moveTo(0, h);                                          // bottom-left
            ctx.lineTo(w, h);                                          // bottom-right
            // Wave edge from right to left
            for (let i = 120; i >= 0; i--) {
                const xn = i / 120;
                ctx.lineTo(xn * w, waveAt(xn, greenEdge, waveAmp));
            }
            ctx.closePath();
            ctx.fill();

            // Subtle sheen (bottom = lighter, fades up)
            const sheen = ctx.createLinearGradient(0, h, 0, greenEdge);
            sheen.addColorStop(0,   'rgba(255,255,255,0.04)');
            sheen.addColorStop(0.6, 'rgba(255,255,255,0)');
            ctx.fillStyle = sheen;
            ctx.fillRect(0, greenEdge, w, h - greenEdge);

            // Grass blades at leading edge (pointing upward into desert)
            blades.forEach(b => {
                const bx = b.xRatio * w;
                const by = waveAt(b.xRatio, greenEdge, waveAmp);
                ctx.beginPath();
                ctx.moveTo(bx, by);
                ctx.quadraticCurveTo(
                    bx + b.lean * 0.4 - b.thickness, by - b.length * 0.55,
                    bx + b.lean,                      by - b.length
                );
                ctx.quadraticCurveTo(
                    bx + b.lean * 0.4 + b.thickness, by - b.length * 0.55,
                    bx + b.thickness * 0.5,           by
                );
                ctx.fillStyle = `hsl(${b.hue}, 48%, ${b.lightness}%)`;
                ctx.fill();
            });
        }

        // Name reveal
        const nameRaw = Math.max(elapsed - T.nameStart, 0) / (T.nameEnd - T.nameStart);
        const nameP   = ease(Math.min(nameRaw, 1));

        if (nameP > 0) {
            ctx.globalAlpha = globalAlpha * nameP;

            const fontSize = Math.min(w * 0.088, 90);
            const cx = w / 2;
            const cy = h / 2 + (1 - nameP) * 18;

            ctx.textAlign    = 'center';
            ctx.textBaseline = 'middle';

            // Name
            ctx.shadowColor = 'rgba(0,0,0,0.45)';
            ctx.shadowBlur  = 28;
            ctx.fillStyle   = '#ffffff';
            ctx.font        = `bold ${fontSize}px Georgia, "Playfair Display", serif`;
            ctx.fillText('Kaku Jain', cx, cy - fontSize * 0.05);

            // Tagline
            ctx.shadowBlur  = 0;
            ctx.fillStyle   = '#b4e4c6';
            ctx.font        = `${Math.min(w * 0.021, 19)}px Arial, sans-serif`;
            ctx.fillText('B R I N G I N G  G R E E N E R Y  B A C K', cx, cy + fontSize * 0.75);

            ctx.globalAlpha  = globalAlpha;
            ctx.textAlign    = 'start';
            ctx.shadowBlur   = 0;
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
