document.addEventListener('DOMContentLoaded', () => {
    const starsContainer = document.getElementById('stars-container');
    
    // Create stars
    function createStar(x, y) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.left = `${x}px`;
        star.style.top = `${y}px`;
        
        // Random size
        const size = Math.random() * 3 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Random opacity
        star.style.opacity = Math.random() * 0.5 + 0.1;
        
        starsContainer.appendChild(star);
        
        // Animate star
        animateStar(star);
    }
    
    function animateStar(star) {
        const duration = Math.random() * 3000 + 1000;
        const delay = Math.random() * 1000;
        
        // Fade in
        star.style.transition = `opacity ${duration/2}ms ease-out ${delay}ms`;
        star.style.opacity = '0.8';
        
        // Move diagonally
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100 + 50;
        const xEnd = parseFloat(star.style.left) + Math.cos(angle) * distance;
        const yEnd = parseFloat(star.style.top) + Math.sin(angle) * distance;
        
        star.style.transition = `left ${duration}ms ease-out ${delay}ms, top ${duration}ms ease-out ${delay}ms, opacity ${duration/2}ms ease-in ${delay + duration/2}ms`;
        
        setTimeout(() => {
            star.style.left = `${xEnd}px`;
            star.style.top = `${yEnd}px`;
            star.style.opacity = '0';
        }, 50);
        
        // Remove star after animation
        setTimeout(() => {
            if (star.parentNode === starsContainer) {
                star.remove();
            }
        }, delay + duration + 50);
    }
    
    // Create initial stars randomly
    function createInitialStars() {
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            createStar(x, y);
        }
    }
    
    // Create stars on mouse move
    document.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.7) {
            createStar(e.clientX, e.clientY);
        }
    });
    
    // Initialize
    createInitialStars();
    setInterval(createInitialStars, 2000);
});
