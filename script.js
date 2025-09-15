// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeSlideshow();
    initializeScrollAnimations();
    initializeMobileMenu();
    initializeNavbarScrollEffect();
    initializeFormAnimations();
    
    // Handle smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                const nav = document.getElementById('nav');
                const toggle = document.getElementById('mobile-toggle');
                nav.classList.remove('active');
                toggle.classList.remove('active');
            }
        });
    });
});

// Slideshow functionality
function initializeSlideshow() {
    const slides = document.querySelectorAll('.slide');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const indicators = document.querySelectorAll('.indicator');
    let currentSlide = 0;
    let slideInterval;

    // Initialize first slide background
    if (slides.length > 0) {
        updateSlideBackground(slides[currentSlide]);
    }

    function updateSlideBackground(slide) {
        const bgUrl = slide.dataset.bg;
        if (bgUrl) {
            slide.style.backgroundImage = `url(${bgUrl})`;
        }
    }

    function showSlide(index) {
        // Remove active class from all slides and indicators
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Add active class to current slide and indicator
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        
        // Update background image
        updateSlideBackground(slides[index]);
        
        currentSlide = index;
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        clearInterval(slideInterval);
    }

    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoSlide();
        startAutoSlide();
    });
    
    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoSlide();
        startAutoSlide();
    });

    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            stopAutoSlide();
            startAutoSlide();
        });
    });

    // Pause auto-slide on hover
    const slideshowContainer = document.querySelector('.hero-slideshow');
    if (slideshowContainer) {
        slideshowContainer.addEventListener('mouseenter', stopAutoSlide);
        slideshowContainer.addEventListener('mouseleave', startAutoSlide);
    }

    // Start auto slideshow
    startAutoSlide();
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation for grid items
                if (entry.target.classList.contains('stat-item') || 
                    entry.target.classList.contains('service-card') ||
                    entry.target.classList.contains('blog-card')) {
                    const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);

    // Observe all fade-up elements
    document.querySelectorAll('.fade-up').forEach(el => {
        observer.observe(el);
    });

    // Counter animation for stats
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/\D/g, ''));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                const suffix = counter.textContent.includes('+') ? '+' : '';
                counter.textContent = Math.floor(current) + suffix;
            }, 16);
        });
    }

    // Trigger counter animation when stats section is visible
    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }
}

// Mobile menu functionality
function initializeMobileMenu() {
    const toggle = document.getElementById('mobile-toggle');
    const nav = document.getElementById('nav');
    
    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            toggle.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !toggle.contains(e.target)) {
                nav.classList.remove('active');
                toggle.classList.remove('active');
            }
        });
    }
}

// Navbar scroll effect
function initializeNavbarScrollEffect() {
    const header = document.getElementById('header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (header) {
            if (currentScrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.backdropFilter = 'blur(20px)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            }
        }
        
        lastScrollY = currentScrollY;
    });
}

// Form animations and validation
function initializeFormAnimations() {
    const formInputs = document.querySelectorAll('.form-input');
    const contactForm = document.querySelector('.contact-form');
    
    // Add focus animations
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
            this.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', function() {
            this.parentNode.classList.remove('focused');
            this.style.transform = 'translateY(0)';
            
            // Validation feedback
            if (this.hasAttribute('required') && !this.value) {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = '#10b981';
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value) {
                this.style.borderColor = '#10b981';
            }
        });
    });
    
    // Form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.form-submit');
            const originalText = submitBtn.textContent;
            
            // Animate button
            submitBtn.textContent = 'Sending...';
            submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            
            // Simulate form submission
            setTimeout(() => {
                submitBtn.textContent = 'Message Sent! ✓';
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    this.reset();
                }, 2000);
            }, 1500);
        });
    }
}

// Service card interactions
document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-10px) scale(1)';
        });
    });
});

// Blog card interactions
document.addEventListener('DOMContentLoaded', () => {
    const blogCards = document.querySelectorAll('.blog-card');
    
    blogCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const image = this.querySelector('.blog-image');
            if (image) {
                image.style.transform = 'scale(1.08)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const image = this.querySelector('.blog-image');
            if (image) {
                image.style.transform = 'scale(1)';
            }
        });
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroSlideshow = document.querySelector('.hero-slideshow');
    
    if (heroSlideshow) {
        const rate = scrolled * -0.5;
        heroSlideshow.style.transform = `translateY(${rate}px)`;
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Blog category filtering
document.addEventListener('DOMContentLoaded', () => {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const blogCards = document.querySelectorAll('.blog-card');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            
            blogCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease-in-out';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});

// Newsletter form submission
document.addEventListener('DOMContentLoaded', () => {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.btn');
            const originalText = submitBtn.textContent;
            
            // Animate button
            submitBtn.textContent = 'Subscribing...';
            submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            
            // Simulate subscription
            setTimeout(() => {
                submitBtn.textContent = 'Subscribed! ✓';
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    this.reset();
                }, 2000);
            }, 1500);
        });
    }
});