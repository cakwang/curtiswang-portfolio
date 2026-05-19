document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-content');
    
    projectCards.forEach(card => {
        // Pre-compile a paused GSAP animation for each card
        const hoverAnim = gsap.to(card, {
            y: -6,                                           // Subtle lift upwards
            scale: 1.01,                                     // Barely perceptible growth
            borderColor: "var(--color-accent)",              // Pop the border to accent color
            boxShadow: "0 16px 40px rgba(60, 0, 255, 0.12)", // Faint accent-colored glow
            duration: 0.25,                                  // Extremely brief & snappy
            ease: "power2.out",                              // Smooth deceleration
            paused: true
        });

        // Play the animation on hover, and smoothly reverse it when the mouse leaves
        card.addEventListener('mouseenter', () => hoverAnim.play());
        card.addEventListener('mouseleave', () => hoverAnim.reverse());
    });
});
