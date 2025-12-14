// Portfolio JavaScript

// Initialize Feather Icons
feather.replace();

// Mobile Menu Toggle
const menuButton = document.getElementById('menu-button');
const closeMenu = document.getElementById('close-menu');
const mobileMenu = document.getElementById('mobile-menu');

menuButton.addEventListener('click', () => {
    mobileMenu.classList.remove('hidden');
});

closeMenu.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
});

// Close menu when clicking on links
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// Vanta.js Background
// Vanta.js background removed


// Typing Animation
const texts = ["machine learning models", "data-driven insights", "web applications"];
let count = 0;
let index = 0;
let currentText = '';
let letter = '';

function type() {
    if (count === texts.length) {
        count = 0;
    }
    currentText = texts[count];
    letter = currentText.slice(0, ++index);

    document.getElementById('typed-text').textContent = letter;
    if (letter.length === currentText.length) {
        count++;
        index = 0;
        setTimeout(type, 2000);
    } else {
        setTimeout(type, 100);
    }
}

document.addEventListener('DOMContentLoaded', type);

// Modern Project Slideshow Functionality
let currentSlide = 0;

function initializeSlideshow() {
    const slides = document.querySelectorAll('.project-slide');
    const totalSlides = slides.length;

    // Create dots
    const dotsContainer = document.getElementById('slideDots');
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'slide-dot';
        if (i === 0) dot.classList.add('active');
        dot.onclick = () => goToSlide(i);
        dotsContainer.appendChild(dot);
    }

    // Update counter
    updateCounter();

    // Show first slide
    showSlide(0);
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.project-slide');
    const totalSlides = slides.length;

    currentSlide += direction;

    if (currentSlide < 0) currentSlide = totalSlides - 1;
    if (currentSlide >= totalSlides) currentSlide = 0;

    showSlide(currentSlide);
}

function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    showSlide(currentSlide);
}

function showSlide(slideIndex) {
    const slides = document.querySelectorAll('.project-slide');

    // Remove active class from all slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });

    // Add active class to current slide
    slides[slideIndex].classList.add('active');

    // Update dots
    document.querySelectorAll('.slide-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === slideIndex);
    });

    // Update counter
    updateCounter();

    // Re-render feather icons
    feather.replace();
}

function updateCounter() {
    const slides = document.querySelectorAll('.project-slide');
    const counter = document.getElementById('slideCounter');
    if (counter) {
        counter.textContent = `${currentSlide + 1} / ${slides.length}`;
    }
}

// Initialize slideshow on page load
document.addEventListener('DOMContentLoaded', initializeSlideshow);

// Theme Toggle Functionality
function toggleTheme() {
    const html = document.documentElement;
    const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

document.querySelectorAll('.theme-toggle').forEach(btn => btn.addEventListener('click', toggleTheme));

// Re-run Feather after load
document.addEventListener('DOMContentLoaded', feather.replace);
