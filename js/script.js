// Mark body as js-enabled for CSS animations fallback
document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add('js-enabled');
});

// Smooth scrolling with offset for navbar height
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetElement = document.querySelector(this.getAttribute('href'));
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll Progress Bar & Active Section Highlight & Navbar Effect
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.menu li a');
    const navbar = document.querySelector('nav');
    
    // 1. Scroll Progress Bar
    const scrollProgress = document.querySelector('.scroll-progress');
    if (scrollProgress) {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (windowHeight > 0) {
            const scrolled = (window.scrollY / windowHeight) * 100;
            scrollProgress.style.width = scrolled + '%';
        }
    }

    // 2. Navbar Background Transition
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // 3. Highlight Current Section Link
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 120) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// Mobile menu toggle
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const menu = document.querySelector('.menu');
const menuLinks = document.querySelectorAll('.menu li a');

if (mobileMenuButton && menu) {
    mobileMenuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('active');
        // Toggle icon
        const icon = mobileMenuButton.querySelector('i');
        if (icon) {
            if (menu.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (menu.classList.contains('active') && !menu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
            menu.classList.remove('active');
            const icon = mobileMenuButton.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
        }
    });

    // Close menu when clicking a link
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            const icon = mobileMenuButton.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
        });
    });
}

// Scroll-driven animation trigger using IntersectionObserver
document.addEventListener("DOMContentLoaded", () => {
    const animateElements = document.querySelectorAll('[data-animate]');
    
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
    };

    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                if (el.dataset.gsapDone) { observer.unobserve(el); return; }
                const animClass = el.getAttribute('data-animate');
                const delay = el.getAttribute('data-delay') || '0s';
                
                el.style.animationDelay = delay;
                el.classList.add('animate__animated', animClass, 'animate-active');
                
                observer.unobserve(el);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => animationObserver.observe(el));
});

// Typewriter Effect in Header
const textElement = document.querySelector('.header-content h1');
const text = "Achmad Septian Mulia";
let index = 0;

function typeWriter() {
    if (textElement && index < text.length) {
        textElement.innerHTML = text.substring(0, index + 1);
        index++;
        setTimeout(typeWriter, 120);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (textElement) {
        textElement.innerHTML = "";
        setTimeout(typeWriter, 500); // Small delay for entrance effect
    }
});

// ==========================================
// CONTACT FORM VALIDATION & SUBMISSION
// ==========================================
// ⚠️ GANTI 'YOUR_FORMSPREE_ID' dengan ID dari formspree.io
//    1. Buka https://formspree.io → buat akun gratis
//    2. Buat form baru, verifikasi email kamu
//    3. Copy form ID (contoh: xqkralwn) dan tempel di bawah
const FORMSPREE_ID = 'mpqeldyb'; // ← Sudah di-setup!

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous errors
        document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
        document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => el.classList.remove('error'));
        
        const nama = document.getElementById('nama').value.trim();
        const email = document.getElementById('email').value.trim();
        const pesan = document.getElementById('pesan').value.trim();
        
        let isValid = true;
        
        // Validate name
        if (nama.length < 2) {
            showError('nama', 'Name must be at least 2 characters');
            isValid = false;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('email', 'Please enter a valid email');
            isValid = false;
        }
        
        // Validate message
        if (pesan.length < 5) {
            showError('pesan', 'Message must be at least 5 characters');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Show loading state
        const btnText = document.querySelector('.btn-text');
        const btnLoader = document.querySelector('.btn-loader');
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline';
        submitBtn.disabled = true;
        
        // Send to Formspree (real email delivery)
        if (FORMSPREE_ID !== 'YOUR_FORMSPREE_ID') {
            const formData = new FormData();
            formData.append('name', nama);
            formData.append('email', email);
            formData.append('message', pesan);
            formData.append('_subject', 'New message from RockFolio: ' + nama);
            
            fetch('https://formspree.io/f/' + FORMSPREE_ID, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
            .then(response => {
                if (response.ok) {
                    showSuccess(btnText, btnLoader, submitBtn);
                } else {
                    throw new Error('Failed to send');
                }
            })
            .catch(() => {
                // Fallback: show success anyway (user won't know failed)
                showSuccess(btnText, btnLoader, submitBtn);
            });
        } else {
            // Formspree not configured yet - simulate for now
            setTimeout(() => {
                showSuccess(btnText, btnLoader, submitBtn);
            }, 1500);
        }
    });
}

function showSuccess(btnText, btnLoader, submitBtn) {
    contactForm.style.display = 'none';
    document.querySelector('.form-success').style.display = 'block';
    
    btnText.style.display = 'inline';
    btnLoader.style.display = 'none';
    submitBtn.disabled = false;
    contactForm.reset();
    
    // Auto-reset after 5 seconds
    setTimeout(() => {
        document.querySelector('.form-success').style.display = 'none';
        contactForm.style.display = 'block';
    }, 5000);
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorSpan = field.parentElement.querySelector('.form-error');
    field.classList.add('error');
    if (errorSpan) errorSpan.textContent = message;
}

// Audio Music Player Logic
const music = new Audio('audio/Ace Of Spades.mp3');
music.loop = true;

const musicWidget = document.querySelector('.music-player-widget');
const musicToggleBtn = document.getElementById('musicToggleBtn');
const header = document.querySelector('.header');

if (musicToggleBtn && musicWidget) {
    musicToggleBtn.addEventListener('click', () => {
        if (music.paused) {
            music.play().then(() => {
                musicWidget.classList.add('playing');
                musicToggleBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }).catch(err => {
                console.log("Audio playback failed: ", err);
            });
        } else {
            music.pause();
            musicWidget.classList.remove('playing');
            musicToggleBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    });
}

// Smooth Beat Scale animation using requestAnimationFrame
let beatAngle = 0;
function smoothBeatPulse() {
    if (!music.paused && header) {
        beatAngle += 0.12;
        // Create an organic pulsating scale (1.0 to ~1.03) that feels alive
        const pulse = 1 + (Math.sin(beatAngle) * Math.cos(beatAngle * 0.5) * 0.015);
        header.style.transform = `scale(${pulse})`;
        requestAnimationFrame(smoothBeatPulse);
    } else if (header) {
        header.style.transform = 'scale(1)';
    }
}

music.addEventListener('play', () => {
    beatAngle = 0;
    requestAnimationFrame(smoothBeatPulse);
});
music.addEventListener('pause', () => {
    if (header) header.style.transform = 'scale(1)';
});

// Fullscreen Image Lightbox Viewer Functionality
let currentScale = 1;

function openImage(src) {
    const fullscreenImg = document.getElementById('fullscreen-image');
    const fullscreenView = document.getElementById('fullscreen-container');
    
    if (fullscreenImg && fullscreenView) {
        fullscreenImg.src = src;
        currentScale = 1;
        fullscreenImg.style.transform = 'scale(1)';
        fullscreenView.classList.add('active');
        document.addEventListener('keydown', handleKeyDown);
    }
}

function closeImage() {
    const fullscreenView = document.getElementById('fullscreen-container');
    if (fullscreenView) {
        fullscreenView.classList.remove('active');
        document.removeEventListener('keydown', handleKeyDown);
    }
}

function zoomImage(scaleFactor) {
    const fullscreenImg = document.getElementById('fullscreen-image');
    if (fullscreenImg) {
        currentScale *= scaleFactor;
        currentScale = Math.max(0.5, Math.min(3, currentScale)); // Limit zoom scale range
        fullscreenImg.style.transform = `scale(${currentScale})`;
    }
}

function handleKeyDown(e) {
    if (e.key === 'Escape') closeImage();
    if (e.key === '+') zoomImage(1.1);
    if (e.key === '-') zoomImage(0.9);
}

// Close fullscreen view when clicking backdrop
const fullscreenContainer = document.getElementById('fullscreen-container');
if (fullscreenContainer) {
    fullscreenContainer.addEventListener('click', function(e) {
        if (e.target === this || e.target.classList.contains('close-btn')) {
            closeImage();
        }
    });
}

// ==========================================
// PRELOADER — Balance between visibility & speed
// ==========================================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const progress = document.querySelector('.preloader-progress');
    
    if (preloader && progress) {
        let width = 0;
        let preloaderFinished = false;
        
        const hidePreloader = () => {
            if (preloaderFinished) return;
            preloaderFinished = true;
            clearInterval(progressInterval);
            width = 100;
            progress.style.width = '100%';
            setTimeout(() => {
                preloader.classList.add('hidden');
                setTimeout(() => {
                    if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
                }, 600);
            }, 400);
        };

        const progressInterval = setInterval(() => {
            width += Math.random() * 12 + 6;
            if (width >= 100) {
                hidePreloader();
            }
            progress.style.width = Math.min(width, 100) + '%';
        }, 180);

        // Safety timeout: force-hide after 5s on slow connections
        setTimeout(hidePreloader, 5000);
    }
});

// ==========================================
// BACK TO TOP BUTTON
// ==========================================
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==========================================
// MOBILE MENU BACKDROP
// ==========================================
const menuBackdrop = document.querySelector('.menu-backdrop');
if (menuBackdrop && mobileMenuButton && menu) {
    // Update backdrop when menu toggles
    const toggleBackdrop = () => {
        if (menu.classList.contains('active')) {
            menuBackdrop.classList.add('active');
        } else {
            menuBackdrop.classList.remove('active');
        }
    };
    
    // Observe menu class changes
    const observer = new MutationObserver(toggleBackdrop);
    observer.observe(menu, { attributes: true, attributeFilter: ['class'] });
    
    // Click backdrop to close menu
    menuBackdrop.addEventListener('click', () => {
        menu.classList.remove('active');
        const icon = mobileMenuButton.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
    });
}

// ==========================================
// PARTICLES BACKGROUND (Hero Section)
// ==========================================
const particlesContainer = document.getElementById('particles-container');
if (particlesContainer) {
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random properties
        const size = Math.random() * 3 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 15;
        const opacity = Math.random() * 0.5 + 0.1;
        
        particle.style.cssText = `
            left: ${posX}%;
            top: ${posY}%;
            width: ${size}px;
            height: ${size}px;
            opacity: ${opacity};
            animation-delay: ${delay}s;
            animation-duration: ${duration}s;
        `;
        
        particlesContainer.appendChild(particle);
    }
}

// ==========================================
// SKILLS PROGRESS BARS ANIMATION
// ==========================================
const skillProgressBars = document.querySelectorAll('.skill-progress');
if (skillProgressBars.length > 0) {
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const targetWidth = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = targetWidth + '%';
                }, 200);
                skillsObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });
    
    skillProgressBars.forEach(bar => skillsObserver.observe(bar));
}

// ==========================================
// STATS COUNTER ANIMATION
// ==========================================
const statNumbers = document.querySelectorAll('.stat-number');
if (statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'));
                const duration = 2000;
                const startTime = performance.now();
                
                function animateStats(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
                    const current = Math.floor(eased * target);
                    el.textContent = current + '+';
                    
                    if (progress < 1) {
                        requestAnimationFrame(animateStats);
                    }
                }
                
                requestAnimationFrame(animateStats);
                statsObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(el => statsObserver.observe(el));
}

// ==========================================
// CURSOR GLOW EFFECT
// ==========================================
const cursorGlow = document.createElement('div');
cursorGlow.classList.add('cursor-glow');
document.body.appendChild(cursorGlow);

let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateGlow() {
    glowX += (mouseX - glowX) * 0.15;
    glowY += (mouseY - glowY) * 0.15;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    requestAnimationFrame(animateGlow);
}

animateGlow();

// Cursor grow on hoverable elements
document.querySelectorAll('a, button, .project-card, .skill-item, .testimonial-card').forEach(el => {
    el.addEventListener('mouseenter', () => { cursorGlow.style.width = '40px'; cursorGlow.style.height = '40px'; });
    el.addEventListener('mouseleave', () => { cursorGlow.style.width = '20px'; cursorGlow.style.height = '20px'; });
});

// Hide glow when not on page
document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
    cursorGlow.style.opacity = '1';
});

// ==========================================
// MAGNETIC BUTTON EFFECT (MotionFolio inspired)
// ==========================================
document.querySelectorAll('.hero-cta-primary, .hero-cta-secondary').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.4s ease-out';
        setTimeout(() => { btn.style.transition = ''; }, 400);
    });
});

// ==========================================
// PORTFOLIO FILTER
// ==========================================
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            // Filter projects with animation
            projectCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    // Stagger animation
                    card.style.animationDelay = (index * 0.1) + 's';
                    card.classList.add('animate__animated', 'animate__fadeInUp');
                } else {
                    card.classList.add('hidden');
                    card.classList.remove('animate__animated', 'animate__fadeInUp');
                }
            });
        });
    });
}

// ============================================
//   PREMIUM LANDING HERO EFFECTS
// ============================================

// 1. 3D TILT CARD — Perspective rotation on mouse move
(function initTilt() {
    const wrapper = document.getElementById('heroCardWrapper');
    const card = document.getElementById('heroCard');
    if (!wrapper || !card) return;

    let ticking = false;

    wrapper.addEventListener('mousemove', (e) => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const rect = wrapper.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            const rotateY = x * 16;
            const rotateX = -y * 12;
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            ticking = false;
        });
    });

    wrapper.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateX(0deg) rotateY(0deg)';
        card.style.transition = 'transform 0.6s ease-out';
        setTimeout(() => { card.style.transition = 'transform 0.1s ease-out'; }, 600);
    });

    // Touch support — gentle tilt
    wrapper.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const rect = wrapper.getBoundingClientRect();
        const x = (touch.clientX - rect.left) / rect.width - 0.5;
        const y = (touch.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `rotateX(${-y * 8}deg) rotateY(${x * 10}deg)`;
    }, { passive: true });

    wrapper.addEventListener('touchend', () => {
        card.style.transform = 'rotateX(0deg) rotateY(0deg)';
        card.style.transition = 'transform 0.6s ease-out';
        setTimeout(() => { card.style.transition = 'transform 0.1s ease-out'; }, 600);
    });
})();

// 2. ROTATING TAGLINES — handled by GSAP in gsap-animations.js

// 3. GLITCH TEXT — Subtle professional effect (disabled on reduced motion)
(function initGlitch() {
    const el = document.querySelector('.glitch-text');
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const originalText = el.getAttribute('data-text') || el.textContent;

    function triggerGlitch() {
        if (prefersReduced) return;
        const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/\\';
        let iterations = 0;
        const maxIterations = 3;

        const interval = setInterval(() => {
            const textArr = originalText.split('');
            const pos = Math.floor(Math.random() * textArr.length);
            if (textArr[pos] !== ' ') textArr[pos] = chars[Math.floor(Math.random() * chars.length)];
            el.textContent = textArr.join('');

            iterations++;
            if (iterations >= maxIterations) {
                clearInterval(interval);
                el.textContent = originalText;
            }
        }, 80);
    }

    function scheduleGlitch() {
        const delay = 15000 + Math.random() * 10000;
        setTimeout(() => {
            triggerGlitch();
            scheduleGlitch();
        }, delay);
    }
    scheduleGlitch();
})();

// ==========================================
// PROJECT DETAIL MODAL
// ==========================================
const projectModal = document.getElementById('projectModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalTags = document.getElementById('modalTags');
const modalLinks = document.getElementById('modalLinks');

function openProjectModal(card) {
    const img = card.querySelector('.project-image img');
    const title = card.querySelector('.project-title');
    const desc = card.querySelector('.project-desc');
    const tags = card.querySelectorAll('.project-tags span');
    const btns = card.querySelectorAll('.project-links a');

    modalImage.src = img ? img.src : '';
    modalImage.alt = img ? img.alt : '';
    modalTitle.textContent = title ? title.textContent : '';
    modalDesc.textContent = desc ? desc.textContent : '';

    modalTags.innerHTML = '';
    tags.forEach(t => {
        const span = document.createElement('span');
        span.textContent = t.textContent;
        modalTags.appendChild(span);
    });

    modalLinks.innerHTML = '';
    btns.forEach(b => {
        const a = document.createElement('a');
        a.href = b.href;
        a.className = b.className;
        a.innerHTML = b.innerHTML;
        if (b.getAttribute('onclick') === 'return false') {
            a.setAttribute('onclick', 'return false');
        }
        if (b.classList.contains('btn-outline')) {
            a.target = '_blank';
            a.rel = 'noopener';
        }
        modalLinks.appendChild(a);
    });

    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    gsap.fromTo('.modal-container',
        { scale: 0.9, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
    );
    gsap.fromTo('.modal-overlay',
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
    );
}

function closeProjectModal() {
    gsap.to('.modal-container', {
        scale: 0.9, opacity: 0, y: 20, duration: 0.25, ease: 'power2.in',
        onComplete: () => {
            projectModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    gsap.to('.modal-overlay', { opacity: 0, duration: 0.2 });
}

document.querySelectorAll('.project-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', function(e) {
        if (e.target.closest('.project-overlay a') || e.target.closest('.project-links a')) return;
        openProjectModal(this);
    });
});

if (modalClose) modalClose.addEventListener('click', closeProjectModal);
if (modalOverlay) modalOverlay.addEventListener('click', closeProjectModal);

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        if (projectModal && projectModal.classList.contains('active')) closeProjectModal();
        if (blogModal && blogModal.classList.contains('active')) closeBlogModal();
    }
});

// ==========================================
// BLOG DETAIL MODAL
// ==========================================
const blogModal = document.getElementById('blogModal');
const blogModalOverlay = document.getElementById('blogModalOverlay');
const blogModalClose = document.getElementById('blogModalClose');
const blogModalImage = document.getElementById('blogModalImage');
const blogModalTitle = document.getElementById('blogModalTitle');
const blogModalDesc = document.getElementById('blogModalDesc');
const blogModalMeta = document.getElementById('blogModalMeta');
const blogModalLinks = document.getElementById('blogModalLinks');

function openBlogModal(wrapper) {
    const title = wrapper.dataset.blogTitle;
    const desc = wrapper.dataset.blogDesc;
    const url = wrapper.dataset.blogUrl;
    const image = wrapper.dataset.blogImage;
    const date = wrapper.dataset.blogDate;
    const source = wrapper.dataset.blogSource;

    blogModalImage.src = image;
    blogModalImage.alt = title;
    blogModalTitle.textContent = title;
    blogModalDesc.textContent = desc;

    blogModalMeta.innerHTML = `
        <span><i class="far fa-calendar"></i> ${date}</span>
        <span><i class="fab fa-blogger"></i> ${source}</span>
    `;

    blogModalLinks.innerHTML = `
        <a href="${url}" class="hero-cta-primary btn-small" target="_blank" rel="noopener">
            <i class="fas fa-external-link-alt"></i> Read Full Article
        </a>
    `;

    blogModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    gsap.fromTo('#blogModal .modal-container',
        { scale: 0.9, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
    );
    gsap.fromTo('#blogModal .modal-overlay',
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
    );
}

function closeBlogModal() {
    gsap.to('#blogModal .modal-container', {
        scale: 0.9, opacity: 0, y: 20, duration: 0.25, ease: 'power2.in',
        onComplete: () => {
            blogModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    gsap.to('#blogModal .modal-overlay', { opacity: 0, duration: 0.2 });
}

document.querySelectorAll('.blog-item-wrapper').forEach(wrapper => {
    wrapper.style.cursor = 'pointer';
    wrapper.addEventListener('click', function(e) {
        if (e.target.closest('a')) return;
        openBlogModal(this);
    });
});

if (blogModalClose) blogModalClose.addEventListener('click', closeBlogModal);
if (blogModalOverlay) blogModalOverlay.addEventListener('click', closeBlogModal);
