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
    });
    
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

// // Hero 3D Tilt - Performance Optimized
// function initHeroTilt() {
//     const heroTitle = document.querySelector('.hero-title');
//     const hero = document.querySelector('.hero');
    
//     if (!heroTitle || !hero) return;
    
//     // 부유 애니메이션 클래스 추가
//     heroTitle.classList.add('floating');
    
//     let rafId = null;
//     let targetRotateX = 0;
//     let targetRotateY = 0;
//     let currentRotateX = 0;
//     let currentRotateY = 0;
    
//     // 부드러운 보간 (lerp)
//     function lerp(start, end, factor) {
//         return start + (end - start) * factor;
//     }
    
//     function updateTransform() {
//         // 부드럽게 따라가기 (0.1 = 느린 따라가기, 0.2 = 빠른 따라가기)
//         currentRotateX = lerp(currentRotateX, targetRotateX, 0.1);
//         currentRotateY = lerp(currentRotateY, targetRotateY, 0.1);
        
//         // GPU 가속된 transform
//         heroTitle.style.transform = `
//             translate3d(0, ${Math.sin(Date.now() / 800) * 10}px, 0)
//             rotateX(${currentRotateX}deg)
//             rotateY(${currentRotateY}deg)
//             scale3d(1, 1, 1)
//         `;
        
//         rafId = requestAnimationFrame(updateTransform);
//     }
    
//     // 마우스 이벤트 (throttle 없이, RAF가 알아서 처리)
//     hero.addEventListener('mousemove', (e) => {
//         const rect = hero.getBoundingClientRect();
//         const centerX = rect.width / 2;
//         const centerY = rect.height / 2;
        
//         // -1 ~ 1 범위
//         const percentX = (e.clientX - rect.left - centerX) / centerX;
//         const percentY = (e.clientY - rect.top - centerY) / centerY;
        
//         // 목표 각도 (최대 10도)
//         targetRotateY = percentX * 10;
//         targetRotateX = -percentY * 10;
//     });
    
//     hero.addEventListener('mouseleave', () => {
//         targetRotateX = 0;
//         targetRotateY = 0;
//     });
    
//     // 애니메이션 시작
//     updateTransform();
    
//     // 페이지 언로드시 정리
//     window.addEventListener('beforeunload', () => {
//         if (rafId) cancelAnimationFrame(rafId);
//     });
// }

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

// Console greeting
// console.log('%c NOVLO ', 'background: #5a8cff; color: #111; font-size: 24px; font-weight: bold;');
// console.log('%c Crafted by TH ', 'color: #5a8cff; font-size: 14px;');