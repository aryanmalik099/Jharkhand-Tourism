document.addEventListener('DOMContentLoaded', () => {
    // --- Global Elements ---
    const mainHeader = document.getElementById('mainHeader');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const navList = document.querySelector('.main-nav .nav-list');
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    // --- Mobile Navigation Toggle ---
    if (hamburgerMenu && navList) {
        hamburgerMenu.addEventListener('click', () => {
            const isExpanded = hamburgerMenu.getAttribute('aria-expanded') === 'true';
            hamburgerMenu.setAttribute('aria-expanded', !isExpanded);
            navList.classList.toggle('active');
            hamburgerMenu.querySelector('i').classList.toggle('fa-bars');
            hamburgerMenu.querySelector('i').classList.toggle('fa-times'); // Change icon to 'X'
            document.body.classList.toggle('no-scroll'); // Prevent body scroll when menu is open
        });

        // Close nav when a link is clicked (for smooth scroll)
        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navList.classList.contains('active')) {
                    hamburgerMenu.click(); // Simulate click to close and reset icon/aria
                }
            });
        });
    }

    // --- Sticky Header and Scroll-to-Top Logic ---
    const handleScroll = () => {
        const scrollPosition = window.pageYOffset;

        // Sticky Header
        if (scrollPosition > 50) { // Adjust threshold as needed
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }

        // Scroll-to-Top Button
        if (scrollPosition > 300) { // Show button after scrolling 300px
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check in case page is loaded with a scroll position
    handleScroll();

    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Smooth Scroll for Anchor Links (Enhanced) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Skip if just '#'

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = mainHeader.offsetHeight; // Account for sticky header
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset - 20; // -20 for a little extra padding

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Intersection Observer for Scroll Animations ---
    const animateOnScroll = () => {
        const observerOptions = {
            root: null, // viewport
            rootMargin: '0px',
            threshold: 0.1 // Trigger when 10% of the element is visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target); // Stop observing once animated
                }
            });
        }, observerOptions);

        // Observe all elements that need animation
        document.querySelectorAll('.fade-in-up, .reveal-left, .reveal-right, .fade-in-delay, .zoom-in-delay, .reveal-bottom').forEach(el => {
            observer.observe(el);
        });

        // Ensure hero animation plays on load without needing scroll
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.classList.add('animated');
        }
    };

    animateOnScroll(); // Initialize animations

    // --- Image Lightbox Functionality ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const galleryItems = document.querySelectorAll('.gallery-item img');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            lightbox.classList.add('show');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll'); // Prevent body scroll
            lightboxImage.src = item.getAttribute('data-large-src') || item.src;
            lightboxImage.alt = item.alt;
            lightboxCaption.textContent = item.alt; // Use alt text as caption

            // Optional: Focus the close button for accessibility
            lightboxClose.focus();
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('show');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('no-scroll');
    };

    lightboxClose.addEventListener('click', closeLightbox);

    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close lightbox with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('show')) {
            closeLightbox();
        }
    });

    // --- Testimonial Carousel ---
    const testimonialCarousel = document.querySelector('.testimonial-carousel');
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const prevBtn = document.querySelector('.testimonial-carousel .prev');
    const nextBtn = document.querySelector('.testimonial-carousel .next');
    let currentIndex = 0;

    const showTestimonial = (index) => {
        testimonialItems.forEach((item, i) => {
            item.classList.remove('active');
            if (i === index) {
                item.classList.add('active');
            }
        });
    };

    if (testimonialCarousel) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : testimonialItems.length - 1;
            showTestimonial(currentIndex);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex < testimonialItems.length - 1) ? currentIndex + 1 : 0;
            showTestimonial(currentIndex);
        });

        // Auto-advance carousel
        let autoSlideInterval;
        const startAutoSlide = () => {
            autoSlideInterval = setInterval(() => {
                nextBtn.click();
            }, 7000); // Change testimonial every 7 seconds
        };

        const stopAutoSlide = () => {
            clearInterval(autoSlideInterval);
        };

        testimonialCarousel.addEventListener('mouseenter', stopAutoSlide);
        testimonialCarousel.addEventListener('mouseleave', startAutoSlide);

        showTestimonial(currentIndex); // Show initial testimonial
        startAutoSlide(); // Start auto-sliding
    }

    // --- Weather Widget (Mock API Call) ---
    const weatherWidget = document.getElementById('weatherWidget');
    const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your actual API key
    const city = 'Betla'; // Or coordinates for more precision

    const fetchWeather = async () => {
        if (!weatherWidget) return;

        weatherWidget.classList.add('loading');
        // Mock API URL - replace with actual if you have an API key
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        // For demonstration, we'll use a timeout to simulate network delay
        // In a real app, you'd fetch from apiUrl
        
        // Mock data for demonstration
        const mockWeatherData = {
            main: { temp: 23, humidity: 65 },
            weather: [{ description: 'partly cloudy', icon: '03d' }],
            wind: { speed: 10 },
            name: 'Betla',
            sys: { country: 'IN' }
        };

        try {
            // Simulate network request
            await new Promise(resolve => setTimeout(resolve, 1500));

            // In a real application:
            // const response = await fetch(apiUrl);
            // if (!response.ok) {
            //     throw new Error(`HTTP error! status: ${response.status}`);
            // }
            // const data = await response.json();
            const data = mockWeatherData; // Use mock data

            const weatherIconCode = data.weather[0].icon;
            const weatherTemp = Math.round(data.main.temp);
            const weatherDescription = data.weather[0].description;
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;

            weatherWidget.innerHTML = `
                <div class="weather-data">
                    <i class="weather-icon owf owf-${weatherIconCode}"></i>
                    <div class="weather-temp">${weatherTemp}°C</div>
                    <div class="weather-description">${weatherDescription}</div>
                    <div class="weather-details">
                        <div><i class="fas fa-tint"></i> Humidity: ${humidity}%</div>
                        <div><i class="fas fa-wind"></i> Wind: ${windSpeed} km/h</div>
                    </div>
                    <p class="weather-location">${data.name}, ${data.sys.country}</p>
                </div>
            `;
            // Note: 'owf' icons require a separate OpenWeather Icons CSS/font library,
            // or you can map them to Font Awesome icons. For simplicity, I've left
            // the 'owf' class, assuming you might add that library. If not, map to FA.

        } catch (error) {
            console.error("Failed to fetch weather data:", error);
            weatherWidget.innerHTML = `<p>Failed to load weather. Please try again later.</p>`;
        } finally {
            weatherWidget.classList.remove('loading');
        }
    };

    fetchWeather(); // Fetch weather data on page load
});

document.addEventListener('DOMContentLoaded', () => {
    const animationContainer = document.querySelector('.footer-animation-container');
    const particleCount = 50; // Number of animated particles

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
});