document.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash;
    if (hash) {
        const element = document.querySelector(hash);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.querySelector('.slide-prev');
    const nextButton = document.querySelector('.slide-next');
    let currentSlide = 0;

    // Function to show a specific slide
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            slide.style.opacity = '0';
            if (i === index) {
                slide.classList.add('active');
                slide.style.opacity = '1';
            }
        });
    }

    // Function to go to the next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length; // Loop to first slide
        showSlide(currentSlide);
    }

    // Function to go to the previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length; // Loop to last slide
        showSlide(currentSlide);
    }

    // Event listeners for navigation buttons
    nextButton.addEventListener('click', nextSlide);
    prevButton.addEventListener('click', prevSlide);

    // Initialize the first slide
    showSlide(currentSlide);
});