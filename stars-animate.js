document.addEventListener('DOMContentLoaded', () => {
    const starsContainer = document.getElementById('stars-container');

    function createStar(initialX, initialY) {
        const star = document.createElement('div');
        star.classList.add('star');

        // Position
        // If coordinates provided, use them (for mouse effects), otherwise random
        const x = initialX !== undefined ? initialX : Math.random() * window.innerWidth;
        const y = initialY !== undefined ? initialY : Math.random() * window.innerHeight;

        star.style.left = `${x}px`;
        star.style.top = `${y}px`;

        // Random size
        const size = Math.random() * 2 + 1; // 1px to 3px
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        // Initial opacity 0
        star.style.opacity = '0';

        starsContainer.appendChild(star);

        // Animation parameters
        const duration = Math.random() * 3000 + 2000; // 2s to 5s

        // Movement calculated relative to start
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 60 + 20; // 20px to 80px move
        const xShift = Math.cos(angle) * distance;
        const yShift = Math.sin(angle) * distance;

        // Force reflow to ensure valid starting state
        star.offsetHeight;

        // Apply transitions
        // We transition opacity and transform
        star.style.transition = `opacity ${duration}ms ease-in-out, transform ${duration}ms linear`;

        // Set target styles
        requestAnimationFrame(() => {
            star.style.opacity = (Math.random() * 0.6 + 0.2).toString(); // Fade to 0.2-0.8
            star.style.transform = `translate(${xShift}px, ${yShift}px)`;
        });

        // Start fading out before the movement ends
        setTimeout(() => {
            star.style.opacity = '0';
        }, duration * 0.7); // Fade out at 70% of duration

        // Remove after duration
        setTimeout(() => {
            if (star.parentNode) {
                star.parentNode.removeChild(star);
            }
        }, duration);
    }

    // Create stars on mouse move
    document.addEventListener('mousemove', (e) => {
        // Reduced frequency for performance
        if (Math.random() > 0.9) {
            createStar(e.clientX, e.clientY);
        }
    });

    // Continuous background generation
    // Create a new star every 100ms
    setInterval(() => createStar(), 100);

    // Create an initial batch so it's not empty at load
    for (let i = 0; i < 50; i++) {
        createStar();
    }
});
