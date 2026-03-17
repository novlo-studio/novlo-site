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
    
    // Load includes first
    includeHTML().then(() => {
        // Initialize other features after includes are loaded
        initNavigation();
        highlightCurrentPage();
        initProcessAccordion();
        initScrollEffects();
        initFormHandling();
        initHeroTilt();
        initLightbox();
        initContactForm()
        setProtectedEmails();
    }, 100);
    
});

// Navigation
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
        
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
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

// Hero 3D Tilt Effect - Aggressive tilt like the reference
function initHeroTilt() {
    const heroTitle = document.querySelector('.hero-title-3d');
    const hero = document.querySelector('.hero');
    
    if (!heroTitle || !hero) return;
    
    let rafId = null;
    let targetRotateX = 15;   // 기본값
    let targetRotateY = -10;  // 기본값
    let targetRotateZ = -5;   // 기본값
    let currentRotateX = 15;
    let currentRotateY = -10;
    let currentRotateZ = -5;
    
    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }
    
    function updateTransform() {
        currentRotateX = lerp(currentRotateX, targetRotateX, 0.08);
        currentRotateY = lerp(currentRotateY, targetRotateY, 0.08);
        currentRotateZ = lerp(currentRotateZ, targetRotateZ, 0.08);
        
        // 부유 애니메이션과 합치기
        const floatY = Math.sin(Date.now() / 1000) * 15;
        
        heroTitle.style.transform = `
            rotateX(${currentRotateX}deg)
            rotateY(${currentRotateY}deg)
            rotateZ(${currentRotateZ}deg)
            translateY(${floatY}px)
        `;
        
        rafId = requestAnimationFrame(updateTransform);
    }
    
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const percentX = (e.clientX - rect.left - centerX) / centerX;
        const percentY = (e.clientY - rect.top - centerY) / centerY;
        
        // 더 극적인 틸트 (±20도)
        targetRotateY = -10 + (percentX * 20);
        targetRotateX = 15 + (percentY * -20);
        targetRotateZ = -5 + (percentX * 10);
    });
    
    hero.addEventListener('mouseleave', () => {
        targetRotateX = 15;
        targetRotateY = -10;
        targetRotateZ = -5;
    });
    
    updateTransform();
}

// Scroll Effects
function initScrollEffects() {
    const nav = document.getElementById('nav');
    
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
        document.querySelectorAll('.process-card, .diff-card, .service-card, .blog-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }, 100); // Small delay to ensure includes are loaded
}

// Process Accordion
function initProcessAccordion() {
    const cards = document.querySelectorAll('.process-card');
    
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
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault(); // 기본 제출 막기
        
        // 버튼 로딩 상태
        if (submitBtn) {
            submitBtn.disabled = true;
            if (btnText) btnText.style.display = 'none';
            if (btnLoading) btnLoading.style.display = 'inline';
        }
        
        // Honeypot 체크 (스팸 방지)
        const honeypot = document.getElementById('company');
        if (honeypot && honeypot.value) {
            console.log('Spam detected');
            return;
        }
        
        // FormData 준비
        const formData = new FormData(form);
        
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // 성공! thank-you 페이지로 이동
                const redirectUrl = form.querySelector('input[name="_redirect"]')?.value 
                                 || form.querySelector('input[name="_next"]')?.value 
                                 || '/thank-you.html';
                window.location.href = redirectUrl;
            } else {
                // 에러 처리
                const data = await response.json();
                alert('Oops! Something went wrong. Please try again or email directly at hello@novlo.studio');
                console.error('Form error:', data);
                
                // 버튼 복원
                if (submitBtn) {
                    submitBtn.disabled = false;
                    if (btnText) btnText.style.display = 'inline';
                    if (btnLoading) btnLoading.style.display = 'none';
                }
            }
        } catch (error) {
            console.error('Submit error:', error);
            alert('Network error. Please check your connection and try again.');
            
            // 버튼 복원
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