// Smooth scrolling with improved easing effect
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

// Add active class to navbar items on scroll + navbar background effect
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.menu li a');
    const navbar = document.querySelector('nav');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
    
    // Change navbar background on scroll
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle with sliding effect
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const menu = document.querySelector('.menu');

if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', () => {
        menu.classList.toggle('active');
        menu.style.transition = 'transform 0.4s ease-in-out';
    });
}

// Fade-in effect for sections on scroll
const fadeElements = document.querySelectorAll('.fade-in');
const fadeInOnScroll = () => {
    fadeElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < window.innerHeight - 100) {
            el.classList.add('visible');
        }
    });
};

window.addEventListener('scroll', fadeInOnScroll);
fadeInOnScroll();
// 1. Efek Mesin Ketik di Header
const textElement = document.querySelector('.header h1');
const text = "Achmad Septian Mulia";
let index = 0;

function typeWriter() {
    if (index < text.length) {
        textElement.innerHTML = text.substring(0, index + 1); // Ganti seluruh isi, bukan menambah
        index++;
        setTimeout(typeWriter, 150);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    textElement.innerHTML = ""; // Pastikan teks kosong sebelum mengetik
    typeWriter();
});


document.addEventListener("DOMContentLoaded", typeWriter);

// 1. Tambahkan elemen audio ke dalam HTML melalui JavaScript
const music = new Audio('Welcome To The Jungle.mp3'); // Ganti dengan file musik rock-mu
music.id = "musicPlayer"; // Memberi ID untuk mempermudah kontrol
music.loop = true; // Musik akan diputar terus-menerus

// 2. Buat tombol untuk mengontrol musik
const musicButton = document.createElement('button');
musicButton.innerText = "Play Music 🎵";
musicButton.style.position = "fixed";
musicButton.style.bottom = "20px";
musicButton.style.right = "20px";
musicButton.style.padding = "10px 20px";
musicButton.style.background = "#ff0000";
musicButton.style.color = "#fff";
musicButton.style.border = "none";
musicButton.style.borderRadius = "10px";
musicButton.style.cursor = "pointer";
musicButton.style.fontSize = "16px";

// 3. Tambahkan efek animasi yang mengikuti musik
const header = document.querySelector(".header"); // Elemen header yang akan dianimasikan

musicButton.addEventListener("click", function () {
    if (music.paused) {
        music.play();
        musicButton.innerText = "Pause Music ⏸";
    } else {
        music.pause();
        musicButton.innerText = "Play Music 🎵";
    }
});

// 4. Buat efek animasi mengikuti beat musik
music.addEventListener("timeupdate", () => {
    let randomScale = 1 + Math.random() * 0.05; // Efek kecil agar lebih smooth
    header.style.transform = `scale(${randomScale})`;
});

// 5. Masukkan tombol musik ke dalam halaman
document.body.appendChild(musicButton);


document.body.appendChild(musicButton);

// 3. Efek Hover Glitch di Portfolio
const portfolioItems = document.querySelectorAll('.portofolio-item img');

portfolioItems.forEach(img => {
    img.addEventListener('mouseover', () => {
        img.style.transform = "rotate(5deg) scale(1.1)";
        img.style.transition = "0.3s ease-in-out";
    });

    img.addEventListener('mouseleave', () => {
        img.style.transform = "rotate(0deg) scale(1)";
    });
});

