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
const texts = ["machine learning models", "data-driven insights", "web applications", "complex algorithms"];
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

// Greeting Sequence
const greetings = [
    { main: "Hello", sub: "English" },
    { main: "Bonjour", sub: "French" },
    { main: "Kédu", sub: "Igbo" }
];

async function playGreetingSequence() {
    const mainEl = document.getElementById('greeting-main');
    const subEl = document.getElementById('greeting-sub');
    const preloader = document.getElementById('preloader');

    // Wait for fonts/styles
    await new Promise(r => setTimeout(r, 100));

    for (const greet of greetings) {
        // Set text
        mainEl.textContent = greet.main;
        subEl.textContent = greet.sub;

        // Fade In
        mainEl.classList.remove('opacity-0');
        subEl.classList.remove('opacity-0');

        // Wait 0.75s
        await new Promise(r => setTimeout(r, 750));

        // Fade Out
        mainEl.classList.add('opacity-0');
        subEl.classList.add('opacity-0');

        // Wait for fade out transition (300ms)
        await new Promise(r => setTimeout(r, 300));
    }

    // Hide Preloader
    preloader.classList.add('opacity-0');
    preloader.style.pointerEvents = 'none'; // Prevent blocking clicks

    // Initialize Background
    if (window.initBackground) {
        window.initBackground();
    }

    // Remove preloader from DOM after fade out to clean up
    setTimeout(() => {
        preloader.remove();
        document.body.classList.remove('overflow-hidden');
        // Start typing animation after greeting
        type();
    }, 700);
}

// Modern Project Slideshow Functionality
let currentSlide = 0;

function initializeSlideshow() {
    const slides = document.querySelectorAll('.project-slide');
    const totalSlides = slides.length;

    // Create dots
    const dotsContainer = document.getElementById('slideDots');
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = 'slide-dot';
            if (i === 0) dot.classList.add('active');
            dot.onclick = () => goToSlide(i);
            dotsContainer.appendChild(dot);
        }
    }

    // Update counter
    updateCounter();

    // Show first slide
    showSlide(0);
}

// Make functions global so HTML onclick can access them
window.changeSlide = function (direction) {
    const slides = document.querySelectorAll('.project-slide');
    const totalSlides = slides.length;

    currentSlide += direction;

    if (currentSlide < 0) currentSlide = totalSlides - 1;
    if (currentSlide >= totalSlides) currentSlide = 0;

    showSlide(currentSlide);
}

window.goToSlide = function (slideIndex) {
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
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

function updateCounter() {
    const slides = document.querySelectorAll('.project-slide');
    const counter = document.getElementById('slideCounter');
    if (counter) {
        counter.textContent = `${currentSlide + 1} / ${slides.length}`;
    }
}

// Start sequence on load
document.addEventListener('DOMContentLoaded', () => {
    // Only run if we haven't visited recently (optional, currently runs always as requested)
    playGreetingSequence();
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
    initializeSlideshow();
});

// Theme Toggle Functionality
function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark') || html.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';

    // Update DOM
    if (newTheme === 'dark') {
        html.classList.add('dark');
        html.setAttribute('data-theme', 'dark');
    } else {
        html.classList.remove('dark');
        html.setAttribute('data-theme', 'light');
    }

    localStorage.setItem('theme', newTheme);
    if (window.updateBackgroundTheme) window.updateBackgroundTheme(newTheme === 'dark');

    // Update Icons
    document.querySelectorAll('#theme-toggle').forEach(btn => {
        // Toggle icon visual
        // We use feather.icons[name].toSvg() to generate the new SVG
        const iconName = newTheme === 'dark' ? 'moon' : 'sun';
        if (typeof feather !== 'undefined' && feather.icons[iconName]) {
            btn.innerHTML = feather.icons[iconName].toSvg();
        }
    });
}

// Initialize theme on load
const savedTheme = localStorage.getItem('theme');
const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = savedTheme || (systemDark ? 'dark' : 'light');

if (initialTheme === 'dark') {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
} else {
    document.documentElement.classList.remove('dark');
    document.documentElement.setAttribute('data-theme', 'light');
}

// Set initial icon state (since feather.replace() runs on DOMContentLoaded, we might need to override it or let it run then update)
// However, feather.replace() reads the data-feather attribute. 
// A better way for init is to set the correct data-feather attribute before replace() calls, OR update it after.

document.addEventListener('DOMContentLoaded', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.querySelectorAll('#theme-toggle').forEach(btn => {
        const iconName = isDark ? 'moon' : 'sun';
        // If feather check runs before this, we might need to update innerHTML directly
        // But since this is inside the same event loop or after, let's just force the SVG update if feather is ready
        if (typeof feather !== 'undefined' && feather.icons[iconName]) {
            btn.innerHTML = feather.icons[iconName].toSvg();
        } else {
            // If feather hasn't run or we want to rely on it
            btn.querySelector('i')?.setAttribute('data-feather', iconName);
        }
    });
});

document.querySelectorAll('#theme-toggle').forEach(btn => btn.addEventListener('click', toggleTheme));
