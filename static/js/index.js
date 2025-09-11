document.addEventListener('DOMContentLoaded', () => {
    // --- Hamburger Menu Functionality ---
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.main-nav .nav-list'); // Target the ul element

    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            hamburger.classList.toggle('toggle');
            document.body.classList.toggle('no-scroll'); // Optional: prevent scrolling when nav is open
        });

        // Close nav when a link is clicked (for single-page navigation)
        nav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('nav-active');
                hamburger.classList.remove('toggle');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // --- Destination Carousel Functionality ---
    const carousel = document.querySelector('.destination-carousel');
    const prevBtn = document.querySelector('.carousel-nav .prev');
    const nextBtn = document.querySelector('.carousel-nav .next');
    let currentIndex = 0;
    let itemWidth = 0;
    let gap = 30; // Defined in CSS, make sure it matches

    function updateItemWidth() {
        if (carousel && carousel.children.length > 0) {
            const firstItem = carousel.children[0];
            itemWidth = firstItem.offsetWidth; // Get actual item width
        }
    }

    function updateCarousel() {
        if (!carousel || carousel.children.length === 0) return;

        // Calculate total scroll amount, including the gap
        const scrollAmount = currentIndex * (itemWidth + gap);
        carousel.style.transform = `translateX(-${scrollAmount}px)`;

        // Update button visibility
        prevBtn.disabled = (currentIndex === 0);
        
        // Calculate how many items fit in the current carousel view
        const visibleItemsCount = Math.floor(carousel.offsetWidth / (itemWidth + gap));
        nextBtn.disabled = (currentIndex >= carousel.children.length - visibleItemsCount);
    }

    // Initialize carousel
    if (carousel) {
        updateItemWidth(); // Get initial item width
        updateCarousel(); // Set initial position and button states

        window.addEventListener('resize', () => {
            updateItemWidth(); // Recalculate on resize
            updateCarousel(); // Adjust carousel position
        });

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });

        nextBtn.addEventListener('click', () => {
            // Ensure we don't scroll past the last visible item
            const visibleItemsCount = Math.floor(carousel.offsetWidth / (itemWidth + gap));
            if (currentIndex < carousel.children.length - visibleItemsCount) {
                currentIndex++;
                updateCarousel();
            }
        });
    }

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = document.querySelector('.main-header').offsetHeight; // Height of fixed header
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset - 20; // -20 for a little extra padding

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // --- Animate On Scroll (Intersection Observer) ---
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, observerOptions);

    animateElements.forEach(element => {
        observer.observe(element);
    });

    // --- Footer Particle Animation ---
    const animationContainer = document.querySelector('.footer-animation-container');
    const particleCount = 50; // Number of animated particles

    if (animationContainer) {
        for (let i = 0; i < particleCount; i++) {
            createParticle();
        }

        function createParticle() {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            animationContainer.appendChild(particle);

            // Random size
            const size = Math.random() * 10 + 5; // 5px to 15px
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            // Random starting position
            const startX = Math.random() * 100; // % of width
            const startY = Math.random() * 100; // % of height
            particle.style.left = `${startX}%`;
            particle.style.top = `${startY}%`;

            // Random ending position (for the CSS custom properties)
            const endX = (Math.random() - 0.5) * 500; // -250px to 250px relative movement
            const endY = (Math.random() - 0.5) * 500;
            particle.style.setProperty('--end-x', endX);
            particle.style.setProperty('--end-y', endY);

            // Random animation duration and delay
            const duration = Math.random() * 10 + 10; // 10s to 20s
            const delay = Math.random() * 10; // 0s to 10s delay
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;

            // Random initial opacity
            particle.style.opacity = Math.random() * 0.4; // Slightly visible

            // Remove particle after animation and create a new one to keep it continuous
            particle.addEventListener('animationend', () => {
                particle.remove();
                createParticle();
            });
        }
    }

    // --- Scroll to Top Button (New Addition) ---
    // Add a scroll-to-top button element to your HTML, for example, just before the closing </body> tag:
    // <button class="scroll-to-top" aria-label="Scroll to top"><i class="fas fa-chevron-up"></i></button>
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.classList.add('scroll-to-top');
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    document.body.appendChild(scrollToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) { // Show button after scrolling 300px
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
            scrollToTopBtn.style.transform = 'translateY(0)';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
            scrollToTopBtn.style.transform = 'translateY(10px)';
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- Dynamic Year in Footer (Ensure this is in your HTML) ---
    // <span id="current-year"></span> in your footer
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});