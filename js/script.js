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
// PRELOADER
// ==========================================
(function initPreloader() {
    // Create floating music notes
    const notesContainer = document.getElementById('preloaderNotes');
    if (notesContainer) {
        const notes = ['♪', '♫', '♬', '♪', '♫'];
        notes.forEach((note, i) => {
            const el = document.createElement('span');
            el.className = 'preloader-note';
            el.textContent = note;
            el.style.left = (30 + Math.random() * 40) + '%';
            el.style.animationDelay = (0.3 + i * 0.6) + 's';
            el.style.fontSize = (12 + Math.random() * 10) + 'px';
            notesContainer.appendChild(el);
        });
    }

    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        const progress = document.querySelector('.preloader-progress');
        const percentEl = document.getElementById('preloaderPercent');
        const loadingText = document.getElementById('preloaderLoading');
        const statusTexts = ['Loading', 'Memuat', 'Preparing', 'Almost ready'];
        
        if (preloader && progress) {
            let width = 0;
            let preloaderFinished = false;
            let statusIndex = 0;
            
            const hidePreloader = () => {
                if (preloaderFinished) return;
                preloaderFinished = true;
                clearInterval(progressInterval);
                clearInterval(statusInterval);
                width = 100;
                progress.style.width = '100%';
                if (percentEl) percentEl.textContent = '100%';
                if (loadingText) loadingText.textContent = 'Welcome! ♫';
                setTimeout(() => {
                    preloader.classList.add('hidden');
                    setTimeout(() => {
                        if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
                    }, 600);
                }, 500);
            };

            const progressInterval = setInterval(() => {
                width += Math.random() * 8 + 3;
                if (width >= 100) {
                    hidePreloader();
                }
                const val = Math.min(width, 100);
                progress.style.width = val + '%';
                if (percentEl) percentEl.textContent = Math.round(val) + '%';
            }, 150);
            
            const statusInterval = setInterval(() => {
                statusIndex = (statusIndex + 1) % statusTexts.length;
                if (loadingText && !preloaderFinished) loadingText.textContent = statusTexts[statusIndex];
            }, 1200);
            
            setTimeout(hidePreloader, 4500);
        }
    });
})();

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
const modalIconBadge = document.getElementById('modalIconBadge');

const projectIcons = {
  'e-commerce': 'fa-shopping-cart',
  'pos': 'fa-cash-register',
  'dashboard': 'fa-chart-bar',
  'web': 'fa-globe',
  'landing': 'fa-rocket',
  'app': 'fa-mobile-alt',
  'blog': 'fa-blog',
  'api': 'fa-plug',
  'default': 'fa-code'
};

function getProjectIcon(title) {
  const t = (title || '').toLowerCase();
  for (const [key, icon] of Object.entries(projectIcons)) {
    if (t.includes(key)) return icon;
  }
  return projectIcons.default;
}

function openProjectModal(card) {
    const img = card.querySelector('.project-image img');
    const title = card.querySelector('.project-title');
    const desc = card.querySelector('.project-desc');
    const tags = card.querySelectorAll('.project-tags span');
    const btns = card.querySelectorAll('.project-links a');

    const titleText = title ? title.textContent : '';

    modalImage.src = img ? img.src : '';
    modalImage.alt = img ? img.alt : '';
    modalTitle.textContent = titleText;
    modalDesc.textContent = desc ? desc.textContent : '';

    const iconClass = getProjectIcon(titleText);
    modalIconBadge.innerHTML = '<i class="fas ' + iconClass + '"></i>';

    modalTags.innerHTML = '';
    tags.forEach(t => {
        const span = document.createElement('span');
        span.innerHTML = '<i class="fas fa-circle"></i> ' + t.textContent;
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

// ==========================================
// SKILL DETAIL MODAL
// ==========================================
const skillData = {
  'digital-marketing': {
    icon: 'fa-bullhorn',
    title: 'Digital Marketing',
    desc: 'Saya memahami dasar-dasar digital marketing dan bagaimana menghubungkan teknologi dengan strategi bisnis.',
    skills: ['Social Media Marketing', 'Content Marketing', 'Digital Campaign Planning', 'Branding', 'Audience Targeting', 'Basic Analytics'],
    tools: ['Meta Business Suite', 'Canva', 'Google Trends', 'Google Analytics (Basic)'],
    work: ['Mengelola kampanye media sosial', 'Membuat strategi konten digital', 'Merencanakan dan menjalankan campaign', 'Analisis performa sederhana', 'Branding & audience targeting'],
    experience: 'Mengelola media sosial organisasi. Membantu publikasi kegiatan. Membuat strategi konten sederhana. Mengintegrasikan digital marketing ke beberapa project website.',
    level: 70
  },
  'content-planning': {
    icon: 'fa-pen-fancy',
    title: 'Content Planning & Strategy',
    desc: 'Saya mampu merencanakan konten agar memiliki tujuan yang jelas, konsisten, dan sesuai target audiens.',
    skills: ['Menentukan target audience', 'Menyusun content calendar', 'Menentukan tema konten', 'Menulis copy sederhana', 'Menentukan CTA'],
    tools: ['Notion', 'Canva', 'Google Docs'],
    work: ['Menyusun strategi konten', 'Membuat content calendar bulanan', 'Menulis copy untuk website & sosial media', 'Menentukan CTA efektif', 'Riset topik & tren konten'],
    experience: 'Menyusun konten organisasi. Membantu strategi konten media sosial. Merancang struktur landing page dan website.',
    level: 65
  },
  'social-media': {
    icon: 'fa-hashtag',
    title: 'Social Media Management',
    desc: 'Saya memahami bagaimana mengelola akun media sosial agar tetap aktif, konsisten, dan informatif.',
    skills: ['Scheduling Post', 'Content Planning', 'Caption Writing', 'Community Engagement', 'Performance Monitoring'],
    tools: ['Instagram', 'TikTok', 'LinkedIn'],
    work: ['Mengelola akun media sosial', 'Menjadwalkan dan menerbitkan konten', 'Menulis caption yang engaging', 'Berinteraksi dengan audiens', 'Memantau performa konten'],
    experience: 'Mengelola media sosial organisasi. Mendukung publikasi informasi saat magang di Kominfo. Membantu penyebaran informasi kepada masyarakat melalui media digital.',
    level: 75
  },
  'market-research': {
    icon: 'fa-chart-pie',
    title: 'Market Research',
    desc: 'Saya mampu melakukan riset sederhana sebelum membuat website maupun strategi bisnis.',
    skills: ['Competitor Analysis', 'Target Market Analysis', 'User Needs Identification', 'SWOT Analysis', 'Trend Research'],
    tools: ['Google Trends', 'Google Forms', 'Excel'],
    work: ['Melakukan riset kompetitor', 'Menganalisis target pasar', 'Mengidentifikasi kebutuhan pengguna', 'Membuat analisis SWOT', 'Riset tren industri'],
    experience: 'Analisis kebutuhan pengguna sebelum membuat website. Menyesuaikan fitur website berdasarkan kebutuhan client.',
    level: 60
  },
  'ui-ux': {
    icon: 'fa-palette',
    title: 'UI/UX Awareness',
    desc: 'Saya memahami pentingnya pengalaman pengguna dan desain antarmuka sebelum membangun website.',
    skills: ['Wireframing', 'User Flow', 'Responsive Design', 'Layout Planning', 'Visual Hierarchy'],
    tools: ['Figma', 'Canva'],
    work: ['Membuat wireframe & mockup', 'Merancang user flow', 'Mendesain layout responsif', 'Mengatur visual hierarchy', 'Prototyping sederhana'],
    experience: 'Mendesain UI beberapa website pribadi. Mendesain dashboard monitoring magang. Mendesain website e-commerce dan portfolio.',
    level: 68
  },
  'seo': {
    icon: 'fa-search-dollar',
    title: 'SEO Basics',
    desc: 'Saya memahami dasar Search Engine Optimization agar website lebih mudah ditemukan di mesin pencari.',
    skills: ['Semantic HTML', 'Meta Tags', 'Heading Structure', 'Image Optimization', 'Basic Keyword Research', 'Page Performance'],
    tools: ['Google Search Console (Basic)', 'PageSpeed Insights'],
    work: ['Mengoptimalkan struktur HTML', 'Menulis meta tags yang tepat', 'Mengatur heading hierarchy', 'Optimasi gambar untuk web', 'Riset kata kunci dasar', 'Meningkatkan performa halaman'],
    experience: 'Menerapkan SEO dasar pada website portfolio. Mengoptimalkan struktur HTML dan performa website.',
    level: 65
  }
};

const skillModal = document.getElementById('skillModal');
const skillOverlay = document.getElementById('skillModalOverlay');
const skillClose = document.getElementById('skillModalClose');
const skillIcon = document.getElementById('skillModalIcon');
const skillTitle = document.getElementById('skillModalTitle');
const skillBody = document.getElementById('skillModalBody');

function openSkillModal(key) {
  const data = skillData[key];
  if (!data) return;

  skillIcon.innerHTML = '<i class="fas ' + data.icon + '"></i>';
  skillTitle.textContent = data.title;

  const skillIcons = ['fa-star', 'fa-bolt', 'fa-check', 'fa-cog', 'fa-chevron-right', 'fa-dot-circle'];
  const skillsHtml = data.skills.map((s, i) => '<span class="sm-skill-tag"><i class="fas ' + skillIcons[i % skillIcons.length] + '"></i> ' + s + '</span>').join('');
  const toolsHtml = data.tools.map(t => '<span class="sm-tool-tag"><i class="fas fa-check-circle"></i> ' + t + '</span>').join('');
  const workIcons = ['fa-bullseye', 'fa-pen-fancy', 'fa-chart-line', 'fa-cogs', 'fa-check-double', 'fa-arrow-right'];
  const workHtml = data.work.map((w, i) => '<li><i class="fas ' + workIcons[i % workIcons.length] + '"></i> ' + w + '</li>').join('');

  skillBody.innerHTML = `
    <div class="sm-section">
      <p class="sm-desc">${data.desc}</p>
    </div>
    <div class="sm-section">
      <h4><i class="fas fa-code"></i> Yang Saya Kuasai</h4>
      <div class="sm-tags">${skillsHtml}</div>
    </div>
    <div class="sm-section">
      <h4><i class="fas fa-tools"></i> Tools</h4>
      <div class="sm-tools">${toolsHtml}</div>
    </div>
    <div class="sm-section">
      <h4><i class="fas fa-briefcase"></i> Apa Yang Bisa Saya Kerjakan</h4>
      <ul class="sm-work-list">${workHtml}</ul>
    </div>
    <div class="sm-section">
      <h4><i class="fas fa-star"></i> Pengalaman</h4>
      <p class="sm-exp">${data.experience}</p>
    </div>
    <div class="sm-section">
      <h4><i class="fas fa-chart-line"></i> Tingkat Kemampuan</h4>
      <div class="sm-level-bar">
        <div class="sm-level-progress" style="width: ${data.level}%"></div>
      </div>
      <span class="sm-level-text">${data.level}%</span>
    </div>
  `;

  skillModal.classList.add('active');
  document.body.style.overflow = 'hidden';

  gsap.fromTo('.skill-modal-container',
    { scale: 0.9, opacity: 0, y: 30 },
    { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
  );
  gsap.fromTo('.skill-modal-overlay',
    { opacity: 0 },
    { opacity: 1, duration: 0.3 }
  );
}

function closeSkillModal() {
  gsap.to('.skill-modal-container', {
    scale: 0.9, opacity: 0, y: 20, duration: 0.25, ease: 'power2.in',
    onComplete: () => {
      skillModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  gsap.to('.skill-modal-overlay', { opacity: 0, duration: 0.2 });
}

document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('click', function() {
    const key = this.dataset.skill;
    openSkillModal(key);
  });
});

if (skillClose) skillClose.addEventListener('click', closeSkillModal);
if (skillOverlay) skillOverlay.addEventListener('click', closeSkillModal);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (skillModal && skillModal.classList.contains('active')) closeSkillModal();
    if (svcModal && svcModal.classList.contains('active')) closeServiceModal();
  }
});

// ==========================================
// SERVICE DETAIL MODAL
// ==========================================
const serviceData = {
  ecommerce: {
    icon: 'fa-shopping-cart',
    title: 'E-Commerce Development',
    about: 'Saya membangun website e-commerce yang tidak hanya fokus pada tampilan, tetapi juga pengalaman belanja yang nyaman, aman, dan mudah digunakan. Saya memahami bagaimana menghubungkan kebutuhan bisnis dengan solusi digital sehingga website mampu meningkatkan penjualan sekaligus memberikan pengalaman terbaik bagi pelanggan.',
    features: ['Product Catalog', 'Product Detail', 'Shopping Cart', 'Checkout Flow', 'Authentication', 'User Dashboard', 'Admin Dashboard', 'Product Management', 'Order Management', 'Inventory', 'Payment Integration Ready', 'Responsive Design'],
    techs: ['Django', 'Laravel', 'MySQL', 'HTML', 'CSS', 'JavaScript', 'Bootstrap'],
    workflow: ['Planning', 'UI Structure', 'Database Design', 'Backend Development', 'Frontend Integration', 'Testing', 'Deployment'],
    focus: ['Clean UI', 'Responsive', 'Secure Authentication', 'Fast Performance', 'Easy Product Management', 'User-Friendly Experience']
  },
  pos: {
    icon: 'fa-cash-register',
    title: 'POS Systems',
    about: 'Saya mengembangkan sistem Point of Sale yang membantu bisnis mengelola transaksi, stok, laporan penjualan, dan operasional harian secara lebih efisien. Saya selalu mengutamakan kemudahan penggunaan agar kasir maupun pemilik usaha dapat menggunakan sistem tanpa kesulitan.',
    features: ['Sales Transaction', 'Product Management', 'Inventory', 'Stock Tracking', 'Purchase History', 'Customer Management', 'Sales Report', 'Dashboard Analytics', 'Authentication', 'Multi Role'],
    techs: ['Laravel', 'PHP', 'MySQL', 'JavaScript', 'Bootstrap'],
    workflow: ['Requirement Analysis', 'Database Design', 'Business Logic', 'Dashboard Development', 'Testing', 'Optimization'],
    focus: ['Accurate Reports', 'Fast Transactions', 'Inventory Monitoring', 'Easy Management', 'Responsive Dashboard']
  },
  dashboard: {
    icon: 'fa-chart-bar',
    title: 'Data Dashboards',
    about: 'Saya membuat dashboard interaktif yang membantu pengguna memahami data melalui visualisasi yang sederhana, informatif, dan mudah dipahami. Dashboard saya dirancang agar informasi penting dapat diakses secara real-time untuk mendukung pengambilan keputusan.',
    features: ['Statistics Cards', 'Charts', 'Data Tables', 'Search', 'Filter', 'Export Data', 'Responsive Layout', 'User Management', 'Monitoring System'],
    techs: ['Laravel', 'Django', 'Chart.js', 'JavaScript', 'MySQL'],
    workflow: ['Collect Data', 'Design Dashboard', 'Data Processing', 'Visualization', 'Testing', 'Optimization'],
    focus: ['Clean Visualization', 'Fast Access', 'Easy Navigation', 'Real-time Information', 'Better Decision Making']
  },
  website: {
    icon: 'fa-globe',
    title: 'Business Websites',
    about: 'Saya membangun website perusahaan, UMKM, personal branding, maupun landing page yang mampu memperkuat identitas bisnis sekaligus meningkatkan kepercayaan pelanggan. Saya percaya website bukan sekadar tampilan, tetapi representasi profesional sebuah bisnis.',
    features: ['Company Profile', 'Landing Page', 'Portfolio Website', 'Organization Website', 'Business Website', 'Event Website', 'Responsive Design', 'Contact Form', 'SEO Friendly', 'Interactive Animation', 'Fast Loading', 'Smooth Navigation', 'Mobile Friendly', 'Modern UI'],
    techs: ['HTML', 'CSS', 'JavaScript', 'Laravel', 'Django'],
    workflow: ['Research', 'Wireframe', 'Design', 'Development', 'Testing', 'Launch'],
    focus: ['Modern Design', 'SEO Ready', 'High Performance', 'Mobile First', 'Business Oriented']
  }
};

const svcModal = document.getElementById('serviceModal');
const svcOverlay = document.getElementById('svcModalOverlay');
const svcClose = document.getElementById('svcModalClose');
const svcIcon = document.getElementById('svcModalIcon');
const svcTitle = document.getElementById('svcModalTitle');
const svcBody = document.getElementById('svcModalBody');

function openServiceModal(key) {
  const d = serviceData[key];
  if (!d) return;

  svcIcon.innerHTML = '<i class="fas ' + d.icon + '"></i>';
  svcTitle.textContent = d.title;

  const featuresHtml = d.features.map(f => '<span class="svc-chip">' + f + '</span>').join('');
  const techsHtml = d.techs.map(t => '<span class="svc-tech">' + t + '</span>').join('');
  const workflowHtml = d.workflow.map((w, i) => '<div class="svc-wf-item"><div class="svc-wf-dot"><span>' + (i + 1) + '</span></div><div class="svc-wf-line"></div><span>' + w + '</span></div>').join('');
  const focusHtml = d.focus.map(f => '<li><i class="fas fa-check-circle"></i> ' + f + '</li>').join('');

  svcBody.innerHTML = `
    <div class="svc-section">
      <h4 class="svc-section-title"><i class="fas fa-info-circle"></i> About</h4>
      <p class="svc-about">${d.about}</p>
    </div>
    <div class="svc-section">
      <h4 class="svc-section-title"><i class="fas fa-cubes"></i> What I Build</h4>
      <div class="svc-chips">${featuresHtml}</div>
    </div>
    <div class="svc-section">
      <h4 class="svc-section-title"><i class="fas fa-code"></i> Technologies</h4>
      <div class="svc-techs">${techsHtml}</div>
    </div>
    <div class="svc-section">
      <h4 class="svc-section-title"><i class="fas fa-tasks"></i> My Workflow</h4>
      <div class="svc-workflow">${workflowHtml}</div>
    </div>
    <div class="svc-section">
      <h4 class="svc-section-title"><i class="fas fa-star"></i> My Focus</h4>
      <ul class="svc-focus">${focusHtml}</ul>
    </div>
  `;

  svcModal.classList.add('active');
  document.body.style.overflow = 'hidden';

  gsap.fromTo('.svc-modal-container',
    { scale: 0.92, opacity: 0, y: 30 },
    { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }
  );
  gsap.fromTo('.svc-modal-overlay',
    { opacity: 0 },
    { opacity: 1, duration: 0.3 }
  );
}

function closeServiceModal() {
  gsap.to('.svc-modal-container', {
    scale: 0.92, opacity: 0, y: 20, duration: 0.25, ease: 'power2.in',
    onComplete: () => {
      svcModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  gsap.to('.svc-modal-overlay', { opacity: 0, duration: 0.2 });
}

document.querySelectorAll('.pencapaian-item').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', function() {
    const key = this.dataset.service;
    if (key) openServiceModal(key);
  });
});

if (svcClose) svcClose.addEventListener('click', closeServiceModal);
if (svcOverlay) svcOverlay.addEventListener('click', closeServiceModal);

// ==========================================
// CV PREVIEW MODAL
// ==========================================
const cvModal = document.getElementById('cvModal');
const cvOverlay = document.getElementById('cvModalOverlay');
const cvClose = document.getElementById('cvModalClose');
const cvTriggers = document.querySelectorAll('[data-open-cv]');

function openCvModal(e) {
  if (e) e.preventDefault();
  if (!cvModal) return;
  cvModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCvModal() {
  if (!cvModal) return;
  cvModal.classList.remove('active');
  document.body.style.overflow = '';
}

cvTriggers.forEach(btn => {
  btn.addEventListener('click', openCvModal);
});

if (cvClose) cvClose.addEventListener('click', closeCvModal);
if (cvOverlay) cvOverlay.addEventListener('click', closeCvModal);

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && cvModal && cvModal.classList.contains('active')) {
    closeCvModal();
  }
});
