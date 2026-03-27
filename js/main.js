// ========================================
// NOVLO - Main JavaScript with HTML Includes
// ========================================

// HTML Include Function
async function includeHTML() {
    const elements = document.querySelectorAll('[data-include]');
    
    for (const el of elements) {
        const file = el.getAttribute('data-include');
        try {
            const response = await fetch(file);
            if (response.ok) {
                const html = await response.text();
                el.innerHTML = html;
                // Re-initialize any scripts that depend on included content
                initIncludedScripts();
            } else {
                console.error(`Failed to load ${file}`);
            }
        } catch (error) {
            console.error(`Error loading ${file}:`, error);
        }
    }
}

// Initialize scripts for dynamically included content
function initIncludedScripts() {
    // Re-attach event listeners for included elements if needed
    // Currently empty as footer/CTA don't need JS, but ready for future
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    
    initNavigation();
    highlightCurrentPage();
    initProcessAccordion();
    initScrollEffects();
    initFormHandling();
    initLightbox();
    initContactForm();
    setProtectedEmails();
    initHeroThree();

    if (document.querySelector('.style-gallery')) {
        initStylesPage();
    }
    
});

// Navigation
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('open');
            navToggle.classList.toggle('open');
            document.body.classList.toggle('nav-open');
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                navToggle.classList.remove('open');
                document.body.classList.remove('nav-open');
            });
        });
    }
}
// Highlight current page in nav
function highlightCurrentPage() {
  console.log('highlightCurrentPage called');
    console.log('nav links found:', document.querySelectorAll('[data-nav]').length);

    const path = window.location.pathname;
    const currentPage = path === '/' ? 'home' : path.replace('/', '').replace('.html', '');
    
    // Handle blog pages
    const isBlogPage = path.includes('/blog/');
    
    document.querySelectorAll('[data-nav]').forEach(link => {
        const navValue = link.getAttribute('data-nav');
        let isActive = false;
        
        if (currentPage === '' && navValue === 'home') isActive = true;
        else if (currentPage === navValue) isActive = true;
        // Blog pages highlight Insights
        else if (isBlogPage && navValue === 'insights') isActive = true;
        
        if (isActive) {
            link.classList.add('active');
            if (!link.classList.contains('nav-cta')) {

                link.style.color = 'var(--accent)';  // ← 액센트 색으로 변경
                link.style.fontWeight = '600';
            }
        } else {

            link.classList.remove('active');
            link.style.color = '';
            link.style.fontWeight = '';
        }
    });
}

// Scroll Effects
function initScrollEffects() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 100) {
            nav.style.background = 'rgba(17, 17, 17, 0.98)';
        } else {
            nav.style.background = 'rgba(17, 17, 17, 0.95)';
        }
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements
    setTimeout(() => {
        document.querySelectorAll('.pstep, .diff-card, .service-card, .blog-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }, 100); // Small delay to ensure includes are loaded
}

// Process Accordion
function initProcessAccordion() {
    const cards = document.querySelectorAll('.pstep');
    
    if (cards.length > 0) {
        cards[0].classList.add('active');
    }
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
        
        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });
}

// contact.html - Style field toggle
const projectType = document.getElementById('project-type');
const styleGroup = document.getElementById('style-group');

if (projectType && styleGroup) {
    projectType.addEventListener('change', function() {
        if (this.value === 'web-design') {
            styleGroup.style.display = 'block';
            document.getElementById('style').setAttribute('required', 'required');
        } else {
            styleGroup.style.display = 'none';
            document.getElementById('style').removeAttribute('required');
        }
    });
}

// Form Handling
function initFormHandling() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 3000);
        });
    }
    
    // URL params for pre-selecting form options
    const urlParams = new URLSearchParams(window.location.search);
    const projectType = urlParams.get('type');
    
    if (projectType && contactForm) {
        const select = document.getElementById('project-type');
        if (select) {
            const options = Array.from(select.options);
            const matchingOption = options.find(opt => 
                opt.value.toLowerCase().includes(projectType.toLowerCase())
            );
            if (matchingOption) {
                select.value = matchingOption.value;
            }
        }
    }
}

// contact.html form submit handler
const contactFormEl = document.getElementById('contactForm');

if (contactFormEl) {
    contactFormEl.addEventListener('submit', function(e) {
        const formData = {
            name: document.getElementById('name')?.value || '',
            projectType: document.getElementById('project-type')?.value || '',
            style: document.getElementById('style')?.value || '',
            budget: document.getElementById('budget')?.value || '',
            timeline: document.getElementById('timeline')?.value || '',
            message: document.getElementById('message')?.value || ''
        };
        sessionStorage.setItem('novloFormData', JSON.stringify(formData));
    });
}

// Gallery hover effects
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Smooth scroll for "View Details" buttons
function initStyleSmoothScroll() {
    document.querySelectorAll('.style-card .btn-outline').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const navHeight = document.getElementById('nav')?.offsetHeight || 70;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Highlight the detail section briefly
                target.style.transition = 'background-color 0.3s ease';
                target.style.backgroundColor = 'rgba(90, 140, 255, 0.05)';
                setTimeout(() => {
                    target.style.backgroundColor = '';
                }, 1000);
            }
        });
    });
}

// Style card hover effects with image parallax
function initStyleCardEffects() {
    const cards = document.querySelectorAll('.style-card');
    
    cards.forEach(card => {
        const img = card.querySelector('.style-image img');
        
        card.addEventListener('mouseenter', () => {
            if (img) {
                img.style.transform = 'scale(1.08)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (img) {
                img.style.transform = 'scale(1)';
            }
        });
    });
}

// Intersection Observer for detail sections animation
function initDetailAnimations() {
    const details = document.querySelectorAll('.style-detail');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    details.forEach((detail, index) => {
        detail.style.opacity = '0';
        detail.style.transform = 'translateY(30px)';
        detail.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(detail);
    });
}

// Initialize all styles page features
function initStylesPage() {
    initStyleSmoothScroll();
    initStyleCardEffects();
    initDetailAnimations();
}

// Run when DOM is ready
if (document.querySelector('.style-gallery')) {
    initStylesPage();
}


// Share functions
function shareTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(document.title);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
}

function shareLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?mini=true&url=${url}`, '_blank', 'width=600,height=400');
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('Link copied to clipboard!');
    }).catch(() => {
        // Fallback for older browsers
        const input = document.createElement('input');
        input.value = window.location.href;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        showToast('Link copied to clipboard!');
    });
}

function showToast(message) {
    // Remove existing toast
    const existing = document.querySelector('.copy-toast');
    if (existing) existing.remove();
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'copy-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Show
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Hide after 2 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}


// Lightbox functionality
function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxBackdrop = document.querySelector('.lightbox-backdrop');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const currentSpan = document.getElementById('lightbox-current');
    const totalSpan = document.getElementById('lightbox-total');
    
    if (!lightbox || galleryItems.length === 0) return;
    
    let currentIndex = 0;
    const totalImages = galleryItems.length;
    
    // 총 이미지 수 표시
    if (totalSpan) totalSpan.textContent = totalImages;
    
    // 이미지 데이터 수집
    const images = Array.from(galleryItems).map(item => ({
        src: item.querySelector('img')?.src || '',
        alt: item.querySelector('img')?.alt || '',
        caption: item.querySelector('.gallery-tag')?.textContent || ''
    }));
    
    // 라이트박스 열기
    function openLightbox(index) {
        currentIndex = index;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // 스크롤 방지
    }
    
    // 라이트박스 닫기
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // 이미지 업데이트
    function updateLightbox() {
        const img = images[currentIndex];
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = img.caption;
        if (currentSpan) currentSpan.textContent = currentIndex + 1;
    }
    
    // 이전/다음
    function prevImage() {
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        updateLightbox();
    }
    
    function nextImage() {
        currentIndex = (currentIndex + 1) % totalImages;
        updateLightbox();
    }
    
    // 이벤트 리스너
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });
    
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxBackdrop.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', prevImage);
    lightboxNext.addEventListener('click', nextImage);
    
    // 키보드 네비게이션
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
    });
    
    // 터치 스와이프 (모바일)
    let touchStartX = 0;
    let touchEndX = 0;
    
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) nextImage();
            else prevImage();
        }
    }
}

//    ========================================
//    CONTACT FORM - AJAX SUBMIT WITH REDIRECT
//    ========================================

function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn?.querySelector('.btn-text');
    const btnLoading = submitBtn?.querySelector('.btn-loading');
    
    if (!form) return;

    document.querySelectorAll('.form-group select[required]').forEach(select => {
    select.addEventListener('change', function() {
        if (this.value !== '') {
        this.classList.add('is-valid');
        } else {
        this.classList.remove('is-valid');
        }
    });
    });

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');

    function resetFieldError(input, errorEl) {
        if (input) input.classList.remove('is-invalid');
        if (errorEl) errorEl.textContent = '';
    }

    function setFieldError(input, errorEl, message) {
        if (input) input.classList.add('is-invalid');
        if (errorEl) errorEl.textContent = message;
    }

    function validateName() {
        if (!nameInput) return true;

        const value = nameInput.value.trim();

        if (value.length < 2) {
            setFieldError(nameInput, nameError, 'Please enter at least 2 characters for your name.');
            return false;
        }

        resetFieldError(nameInput, nameError);
        return true;
    }

    function validateEmail() {
        if (!emailInput) return true;

        const value = emailInput.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(value)) {
            setFieldError(emailInput, emailError, 'Please enter a valid email address.');
            return false;
        }

        resetFieldError(emailInput, emailError);
        return true;
    }

    nameInput?.addEventListener('input', validateName);
    emailInput?.addEventListener('input', validateEmail);
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (submitBtn) {
            submitBtn.disabled = true;
            if (btnText) btnText.style.display = 'none';
            if (btnLoading) btnLoading.style.display = 'inline';
        }
        
        const honeypot = document.getElementById('company');
        if (honeypot && honeypot.value) {
            console.log('Spam detected');

            if (submitBtn) {
                submitBtn.disabled = false;
                if (btnText) btnText.style.display = 'inline';
                if (btnLoading) btnLoading.style.display = 'none';
            }
            return;
        }

        const formData = new FormData(form);
        formData.delete('company');
        
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                form.reset();
                window.location.href = '/thank-you.html';
            } else {
                const data = await response.json();
                alert('Oops! Something went wrong. Please try again or email directly at hello@novlo.studio');
                console.error('Form error:', data);
                
                if (submitBtn) {
                    submitBtn.disabled = false;
                    if (btnText) btnText.style.display = 'inline';
                    if (btnLoading) btnLoading.style.display = 'none';
                }
            }
        } catch (error) {
            console.error('Submit error:', error);
            alert('Network error. Please check your connection and try again.');
            
            if (submitBtn) {
                submitBtn.disabled = false;
                if (btnText) btnText.style.display = 'inline';
                if (btnLoading) btnLoading.style.display = 'none';
            }
        }
    });
}


//Bot free Email 
function setProtectedEmails() {
  const user = "hello";
  const domain = "novlo.studio";
  const email = `${user}@${domain}`;

  const contactEmail = document.getElementById("email-contact");
  if (contactEmail) {
    contactEmail.href = `mailto:${email}`;
    contactEmail.textContent = email;
  }
  const contactFormEmail = document.getElementById("email-form-contact");
  if(contactFormEmail){
    contactFormEmail.href = `mailto:${email}`;
    contactFormEmail.textContent = email;
  }
  const urgentEmail = document.getElementById("urgent-email");
  if(urgentEmail){
    urgentEmail.href = `mailto:${email}`;
    urgentEmail.textContent = email;
  }
  const footerEmail = document.getElementById("email-footer");
  if (footerEmail) {
    footerEmail.href = `mailto:${email}`;
    // footerEmail.textContent = email;
  }
}

/* ==========================================
   HERO THREE - NOVLO BURST / BUILD / IDLE
========================================== */

function initHeroThree() {
    const IS_MOBILE = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || innerWidth < 768;
    const DPR       = Math.min(devicePixelRatio, IS_MOBILE ? 1.5 : 2);

    // ── Renderer ─────────────────────────────────────────────
    const canvas   = document.getElementById('hero-canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: !IS_MOBILE, alpha: true });
    renderer.setPixelRatio(DPR);
    renderer.setSize(innerWidth, innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, innerWidth / innerHeight, 0.1, 300);
    camera.position.set(0, 0, 28);

    // ── Pointer ───────────────────────────────────────────────
    const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (cx, cy) => {
    ptr.tx = (cx / innerWidth)  * 2 - 1;
    ptr.ty = -(cy / innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', e => onMove(e.clientX, e.clientY));
    window.addEventListener('touchmove', e => onMove(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    if (IS_MOBILE && window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', e => {
        if (e.gamma != null) {
        ptr.tx = Math.max(-1, Math.min(1, e.gamma / 20));
        ptr.ty = Math.max(-1, Math.min(1, (e.beta - 30) / -25));
        }
    });
    }

    // ── Easing helpers ───────────────────────────────────────
    const easeOutExpo  = x => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x);
    const easeInExpo   = x => x <= 0 ? 0 : Math.pow(2, 10 * x - 10);
    const easeOutCubic = x => 1 - Math.pow(1 - x, 3);
    const easeInOutQuad= x => x < .5 ? 2*x*x : 1 - Math.pow(-2*x+2,2)/2;
    const lerp = (a, b, t) => a + (b - a) * t;

    // ── Particle counts ───────────────────────────────────────
    const TEXT_P   = IS_MOBILE ? 2800 : 6000;   // converge to text
    const ORBIT_P  = IS_MOBILE ?  300 :  700;   // orbit the sphere
    const TOTAL_P  = TEXT_P + ORBIT_P;

    // ── Sample NOVLO text pixels ─────────────────────────────
    function sampleTextPositions(count) {
    // Draw NOVLO onto offscreen canvas, sample filled pixels
    const oc  = document.createElement('canvas');
    const vw  = Math.min(innerWidth, 1400);
    const fs  = Math.floor(vw * 0.16);          // font size
    oc.width  = Math.floor(vw * 0.95);
    oc.height = Math.floor(fs * 1.6);
    const ctx = oc.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.font      = `900 ${fs}px Inter, Arial Black, sans-serif`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('NOVLO', oc.width / 2, oc.height / 2);

    const data   = ctx.getImageData(0, 0, oc.width, oc.height).data;
    const pixels = [];
    const step   = IS_MOBILE ? 4 : 3;   // sample every N pixels for density
    for (let y = 0; y < oc.height; y += step) {
        for (let x = 0; x < oc.width; x += step) {
        if (data[(y * oc.width + x) * 4 + 3] > 128) {
            pixels.push([x, y]);
        }
        }
    }

    // Map to Three.js world coordinates (centred)
    const scaleX = (oc.width  / oc.height) * 22;  // world width
    const scaleY = 22;
    const pts = [];
    for (let i = 0; i < count; i++) {
        const [px, py] = pixels[Math.floor(Math.random() * pixels.length)];
        pts.push(
        (px / oc.width  - 0.5) * scaleX,
        -(py / oc.height - 0.5) * scaleY,
        (Math.random() - .5) * 0.3           // tiny Z jitter
        );
    }
    return pts;
    }

    const textTargets = sampleTextPositions(TEXT_P);  // [x,y,z, x,y,z …]

    // ── Build particle positions array ───────────────────────
    // Layout: [0 … TEXT_P-1] = text particles, [TEXT_P … TOTAL_P-1] = orbit particles
    const positions  = new Float32Array(TOTAL_P * 3);
    const velocities = new Float32Array(TOTAL_P * 3);  // for explosion phase
    const phases     = new Float32Array(TOTAL_P);       // random offset for wobble

    // ─ Initial state: all particles packed on small sphere (radius 1.5) ─
    const INIT_R = 1.5;
    for (let i = 0; i < TOTAL_P; i++) {
    const θ = Math.random() * Math.PI * 2;
    const φ = Math.acos(2 * Math.random() - 1);
    positions[i*3]   = INIT_R * Math.sin(φ) * Math.cos(θ);
    positions[i*3+1] = INIT_R * Math.sin(φ) * Math.sin(θ);
    positions[i*3+2] = INIT_R * Math.cos(φ);
    // explosion velocity — radially outward + random
    const speed = 0.18 + Math.random() * 0.28;
    velocities[i*3]   = positions[i*3]   / INIT_R * speed + (Math.random()-.5)*.08;
    velocities[i*3+1] = positions[i*3+1] / INIT_R * speed + (Math.random()-.5)*.08;
    velocities[i*3+2] = positions[i*3+2] / INIT_R * speed * .4;
    phases[i] = Math.random() * Math.PI * 2;
    }

    // Orbit particles: build their sphere targets (radius ~9 around text)
    const ORBIT_R  = 9.5;
    const orbitTargets = new Float32Array(ORBIT_P * 3);
    for (let i = 0; i < ORBIT_P; i++) {
    const θ = Math.random() * Math.PI * 2;
    const φ = Math.acos(2 * Math.random() - 1);
    orbitTargets[i*3]   = ORBIT_R * Math.sin(φ) * Math.cos(θ);
    orbitTargets[i*3+1] = ORBIT_R * Math.sin(φ) * Math.sin(θ);
    orbitTargets[i*3+2] = ORBIT_R * Math.cos(φ) * .45;   // flatten Z
    }

    // ── Per-particle colors ───────────────────────────────────
    // Palette: white → icy white-blue → light blue → mid blue → deep blue
    const PALETTE = [
    new THREE.Color(1.00, 1.00, 1.00),   // pure white
    new THREE.Color(0.88, 0.94, 1.00),   // icy white-blue
    new THREE.Color(0.72, 0.88, 1.00),   // light blue
    new THREE.Color(0.45, 0.68, 1.00),   // bright accent blue
    new THREE.Color(0.25, 0.48, 0.95),   // mid blue
    new THREE.Color(0.18, 0.35, 0.85),   // deeper blue
    ];
    const colorArr = new Float32Array(TOTAL_P * 3);
    for (let i = 0; i < TOTAL_P; i++) {
    const isOrbit = i >= TEXT_P;
    const roll    = Math.random();
    let c;
    if (!isOrbit) {
        // text particles: weight toward whites & light blues
        c = roll < .30 ? PALETTE[0]
        : roll < .58 ? PALETTE[1]
        : roll < .82 ? PALETTE[2]
        :               PALETTE[3];
    } else {
        // orbit particles: more saturated blues
        c = roll < .20 ? PALETTE[2]
        : roll < .55 ? PALETTE[3]
        : roll < .80 ? PALETTE[4]
        :               PALETTE[5];
    }
    colorArr[i*3]   = c.r;
    colorArr[i*3+1] = c.g;
    colorArr[i*3+2] = c.b;
    }

    // ── Geometry & material ───────────────────────────────────
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(colorArr,  3));

    const mat = new THREE.PointsMaterial({
    size: IS_MOBILE ? .18 : .15,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // ── Glass sphere (wireframe icosahedron) ─────────────────
    // Made from TWO meshes: outer glow ring + inner lines
    const sphereDetail  = IS_MOBILE ? 2 : 3;
    const sphereGeoBase = new THREE.IcosahedronGeometry(INIT_R * 1.02, sphereDetail);

    // Outer glow: slightly larger, very faint
    const sphereOuter = new THREE.Mesh(
    new THREE.IcosahedronGeometry(INIT_R * 1.12, sphereDetail),
    new THREE.MeshBasicMaterial({
        color: 0x6699ff,
        wireframe: true,
        transparent: true,
        opacity: 0,
    })
    );
    scene.add(sphereOuter);

    // Inner lines: glass-blue
    const sphereInner = new THREE.Mesh(
    sphereGeoBase,
    new THREE.MeshBasicMaterial({
        color: 0x88bbff,
        wireframe: true,
        transparent: true,
        opacity: 0,
    })
    );
    scene.add(sphereInner);

    // Big orbit sphere (visible in Act 4 around NOVLO)
    const ORBIT_SPHERE_R = ORBIT_R * 1.03;
    const orbitSphereGeo = new THREE.IcosahedronGeometry(ORBIT_SPHERE_R, IS_MOBILE ? 2 : 3);
    const orbitSphereOuter = new THREE.Mesh(
    new THREE.IcosahedronGeometry(ORBIT_SPHERE_R * 1.04, IS_MOBILE ? 2 : 3),
    new THREE.MeshBasicMaterial({ color: 0x3355cc, wireframe: true, transparent: true, opacity: 0 })
    );
    const orbitSphereInner = new THREE.Mesh(
    orbitSphereGeo,
    new THREE.MeshBasicMaterial({ color: 0x5577ff, wireframe: true, transparent: true, opacity: 0 })
    );
    scene.add(orbitSphereOuter);
    scene.add(orbitSphereInner);

    // ── Lighting (subtle, for any opaque meshes) ─────────────
    scene.add(new THREE.AmbientLight(0x080818, 1));

    // ── Timings (seconds) ─────────────────────────────────────
    const T_ACT1_START    = 0.0;
    const T_EXPLODE       = 0.35;  // explosion moment
    const T_EXPLODE_END   = 0.65;  // particles start converging
    const T_CONVERGE_END  = 1.7;   // particles fully at text positions
    const T_TEXT_REVEAL   = 1.5;   // CSS text starts fading in
    const T_SUB_REVEAL    = 1.9;   // subtitle / CTA appear
    const T_ORBIT_APPEAR  = 1.75;  // orbit sphere fades in

    // ── State ─────────────────────────────────────────────────
    let phase = 'ACT1';  // ACT1 | EXPLODE | CONVERGE | LOOP
    const clock = new THREE.Clock();

    // Explosion positions — captured at explosion moment
    const explodePos = new Float32Array(TOTAL_P * 3);

    // CSS element refs
    const titleEl = document.getElementById('hero-title');
    const subEl   = document.getElementById('heroSub');

    // ── Animate ───────────────────────────────────────────────
    function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Smooth pointer
    ptr.x += (ptr.tx - ptr.x) * .06;
    ptr.y += (ptr.ty - ptr.y) * .06;

    const pos = geo.attributes.position.array;

    // ════════════════════════════════════════════════════
    //  ACT 1 — sphere floats, particles tight on surface
    // ════════════════════════════════════════════════════
    if (t < T_EXPLODE) {
        // Fade in particles
        mat.opacity = Math.min(1, t / 0.5);

        // Small sphere breathes
        const breathe = 1 + Math.sin(t * 2.2) * 0.04;
        const wobble  = Math.sin(t * 1.1) * 0.15;

        // Sphere wireframe opacity
        const sOp = Math.min(0.55, t / 0.6 * 0.55);
        sphereInner.material.opacity = sOp;
        sphereOuter.material.opacity = sOp * 0.35;
        sphereInner.scale.setScalar(breathe);
        sphereOuter.scale.setScalar(breathe * 1.05);
        sphereInner.rotation.y = t * 0.3;
        sphereOuter.rotation.y = -t * 0.2;
        sphereOuter.rotation.x = t * 0.15;

        // Particles hug sphere surface with gentle drift
        for (let i = 0; i < TOTAL_P; i++) {
        const b = i * 3;
        const θ = phases[i] * 6.28 + t * (0.12 + (i % 7) * 0.01);
        const φ = phases[i] * 3.14 + t * (0.08 + (i % 5) * 0.007);
        const r = INIT_R * breathe * (0.95 + Math.sin(t * 2 + phases[i]) * 0.05);
        pos[b]   = r * Math.sin(φ) * Math.cos(θ);
        pos[b+1] = r * Math.sin(φ) * Math.sin(θ) + wobble;
        pos[b+2] = r * Math.cos(φ);
        }

    // ════════════════════════════════════════════════════
    //  ACT 2 — EXPLODE
    // ════════════════════════════════════════════════════
    } else if (t < T_EXPLODE_END) {

        if (phase !== 'EXPLODE') {
        phase = 'EXPLODE';
        // Snapshot current positions as explosion origin
        for (let i = 0; i < TOTAL_P * 3; i++) explodePos[i] = pos[i];
        // Fade sphere out
        }

        const prog = (t - T_EXPLODE) / (T_EXPLODE_END - T_EXPLODE);
        const ease = easeOutExpo(prog);

        // Sphere vanishes
        sphereInner.material.opacity = Math.max(0, 0.55 * (1 - prog * 3));
        sphereOuter.material.opacity = Math.max(0, 0.2  * (1 - prog * 3));

        // Particles fly outward
        for (let i = 0; i < TOTAL_P; i++) {
        const b = i * 3;
        pos[b]   = explodePos[b]   + velocities[b]   * ease * 14;
        pos[b+1] = explodePos[b+1] + velocities[b+1] * ease * 14;
        pos[b+2] = explodePos[b+2] + velocities[b+2] * ease * 8;
        }

        // Flash brightness at explosion peak
        mat.opacity = 1.0;
        mat.size    = IS_MOBILE ? (.18 + ease * .12) : (.15 + ease * .10);

    // ════════════════════════════════════════════════════
    //  ACT 3 — CONVERGE to text
    // ════════════════════════════════════════════════════
    } else if (t < T_CONVERGE_END + 0.5) {

        if (phase !== 'CONVERGE') {
        phase = 'CONVERGE';
        for (let i = 0; i < TOTAL_P * 3; i++) explodePos[i] = pos[i];
        }

        const rawProg = Math.min(1, (t - T_EXPLODE_END) / (T_CONVERGE_END - T_EXPLODE_END));
        const ease    = easeOutCubic(rawProg);

        // Text particles → text positions
        for (let i = 0; i < TEXT_P; i++) {
        const b  = i * 3;
        const tx = textTargets[b],   ty = textTargets[b+1], tz = textTargets[b+2];
        const ex = explodePos[b],    ey = explodePos[b+1],  ez = explodePos[b+2];
        // stagger: particles closer to centre arrive first
        const delay = Math.min(.35, (Math.abs(ex) + Math.abs(ey)) / 30);
        const p2    = Math.max(0, Math.min(1, (rawProg - delay * .4) / (1 - delay * .4)));
        const e2    = easeOutCubic(p2);
        pos[b]   = lerp(ex, tx, e2) + Math.sin(phases[i] * 12 + t * 3) * (1-e2) * .5;
        pos[b+1] = lerp(ey, ty, e2) + Math.cos(phases[i] * 9  + t * 2) * (1-e2) * .5;
        pos[b+2] = lerp(ez, tz, e2);
        }

        // Orbit particles → sphere positions
        for (let i = 0; i < ORBIT_P; i++) {
        const b  = (TEXT_P + i) * 3;
        const ob = i * 3;
        const tx = orbitTargets[ob],   ty = orbitTargets[ob+1], tz = orbitTargets[ob+2];
        const ex = explodePos[b],      ey = explodePos[b+1],    ez = explodePos[b+2];
        const p2 = Math.max(0, Math.min(1, (rawProg - .15) / .85));
        const e2 = easeOutCubic(p2);
        pos[b]   = lerp(ex, tx, e2);
        pos[b+1] = lerp(ey, ty, e2);
        pos[b+2] = lerp(ez, tz, e2);
        }

        // Particle size shrinks back to normal as they land
        mat.size = IS_MOBILE ? lerp(.28, .12, ease) : lerp(.23, .10, ease);

        // CSS text reveal
        if (t >= T_TEXT_REVEAL && !titleEl.classList.contains('revealed')) {
        titleEl.classList.add('revealed');
        }
        if (t >= T_SUB_REVEAL && !subEl.classList.contains('visible')) {
        subEl.classList.add('visible');
        }

        // Orbit sphere fades in
        if (t >= T_ORBIT_APPEAR) {
        const op = Math.min(1, (t - T_ORBIT_APPEAR) / 1.2);
        orbitSphereInner.material.opacity = op * 0.18;
        orbitSphereOuter.material.opacity = op * 0.07;
        }

    // ════════════════════════════════════════════════════
    //  ACT 4 — LOOP state
    // ════════════════════════════════════════════════════
    } else {

        if (phase !== 'LOOP') {
        phase = 'LOOP';
        // Ensure CSS elements revealed
        titleEl.classList.add('revealed');
        subEl.classList.add('visible');
        }

        // ── Text particles: hold formation + mouse repulsion ──
        const mouseWorldX = ptr.x * 12;
        const mouseWorldY = ptr.y * 7;
        const REPEL_R   = 2.8;
        const REPEL_STR = 2.2;

        for (let i = 0; i < TEXT_P; i++) {
        const b  = i * 3;
        const tx = textTargets[b],   ty = textTargets[b+1];

        // Gentle drift while at rest
        const drift = 0.018;
        pos[b]   += (tx - pos[b])   * 0.055 + Math.sin(t * .9 + phases[i] * 4) * drift;
        pos[b+1] += (ty - pos[b+1]) * 0.055 + Math.cos(t * .7 + phases[i] * 3) * drift;
        pos[b+2] += (textTargets[b+2] - pos[b+2]) * 0.06;

        // Mouse / touch repulsion
        const dx = pos[b]   - mouseWorldX;
        const dy = pos[b+1] - mouseWorldY;
        const d2 = dx*dx + dy*dy;
        if (d2 < REPEL_R * REPEL_R && d2 > 0.001) {
            const d    = Math.sqrt(d2);
            const str  = (REPEL_R - d) / REPEL_R * REPEL_STR;
            pos[b]   += (dx / d) * str * 0.1;
            pos[b+1] += (dy / d) * str * 0.1;
        }
        }

        // ── Orbit particles: float around the large sphere ──
        for (let i = 0; i < ORBIT_P; i++) {
        const b  = (TEXT_P + i) * 3;
        const ob = i * 3;
        // Slowly rotate their target position
        const angle = t * (0.08 + (i % 5) * 0.006) + phases[TEXT_P + i] * Math.PI * 2;
        const baseX = orbitTargets[ob],   baseY = orbitTargets[ob+1];
        const r     = Math.sqrt(baseX*baseX + baseY*baseY);
        const tgtX  = r * Math.cos(angle + Math.atan2(baseY, baseX));
        const tgtY  = r * Math.sin(angle + Math.atan2(baseY, baseX));
        pos[b]   += (tgtX - pos[b])   * 0.018;
        pos[b+1] += (tgtY - pos[b+1]) * 0.018;
        pos[b+2] += (orbitTargets[ob+2] + Math.sin(t * .4 + phases[i] * 6) * 0.4 - pos[b+2]) * 0.02;

        // Mouse repulsion (weaker for orbit)
        const mx = ptr.x * 12, my = ptr.y * 7;
        const dx = pos[b] - mx, dy = pos[b+1] - my;
        const d2 = dx*dx + dy*dy;
        if (d2 < 16 && d2 > .01) {
            const d = Math.sqrt(d2);
            pos[b]   += (dx/d) * (4-d)/4 * 0.15;
            pos[b+1] += (dy/d) * (4-d)/4 * 0.15;
        }
        }

        // Orbit sphere slow rotation
        orbitSphereInner.rotation.y = t * 0.06;
        orbitSphereInner.rotation.x = t * 0.04;
        orbitSphereOuter.rotation.y = -t * 0.04;
        orbitSphereOuter.rotation.z = t * 0.03;
        orbitSphereInner.material.opacity = 0.18;
        orbitSphereOuter.material.opacity = 0.07;

        // Camera subtle parallax
        camera.position.x += (ptr.x * 2.5 - camera.position.x) * .025;
        camera.position.y += (ptr.y * 1.5 - camera.position.y) * .025;
        camera.lookAt(0, 0, 0);
    }

    geo.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
    }

    // ── Resize ────────────────────────────────────────────────
    window.addEventListener('resize', () => {
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    });

    animate();
}