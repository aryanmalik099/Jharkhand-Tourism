document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Navigation Toggle ---
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');

    navToggle.addEventListener('click', () => {
        mainNav.classList.toggle('open');
    });

    // --- Photo Gallery Data (for demonstration) ---
    const galleryImages = [
        { src: 'https://picsum.photos/id/1018/600/400', caption: 'Lush Green Valley', category: 'waterfalls' },
        { src: 'https://picsum.photos/id/1020/600/400', caption: 'Tiger in the Wild', category: 'wildlife' },
        { src: 'https://picsum.photos/id/1012/600/400', caption: 'Ancient Temple Carvings', category: 'temples' },
        { src: 'https://picsum.photos/id/1025/600/400', caption: 'Traditional Dance Performance', category: 'culture' },
        { src: 'https://picsum.photos/id/1016/600/400', caption: 'River Rafting Adventure', category: 'adventure' },
        { src: 'https://picsum.photos/id/1080/600/400', caption: 'Delicious Local Meal', category: 'food' },
        { src: 'https://picsum.photos/id/1019/600/400', caption: 'Misty Waterfall Morning', category: 'waterfalls' },
        { src: 'https://picsum.photos/id/1024/600/400', caption: 'Elephant Herd in Forest', category: 'wildlife' },
        { src: 'https://picsum.photos/id/1028/600/400', caption: 'Serene River Sunset', category: 'waterfalls' },
        { src: 'https://picsum.photos/id/1036/600/400', caption: 'Old Fort Ruins', category: 'historic' }, // Added a new category for variety
        { src: 'https://picsum.photos/id/1039/600/400', caption: 'Mountain Biking Trail', category: 'adventure' },
        { src: 'https://picsum.photos/id/1042/600/400', caption: 'Vibrant Village Market', category: 'culture' },
        { src: 'https://picsum.photos/id/1043/600/400', caption: 'Spotted Deer Grazing', category: 'wildlife' },
        { src: 'https://picsum.photos/id/1047/600/400', caption: 'Traditional Handicrafts', category: 'culture' },
        { src: 'https://picsum.photos/id/1050/600/400', caption: 'Rock Climbing Challenge', category: 'adventure' },
        { src: 'https://picsum.photos/id/1053/600/400', caption: 'Spicy Street Food', category: 'food' },
    ];

    const photoGrid = document.getElementById('photoGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Function to render gallery images
    const renderGallery = (filter = 'all') => {
        photoGrid.innerHTML = ''; // Clear current grid
        const filteredImages = filter === 'all' 
            ? galleryImages 
            : galleryImages.filter(img => img.category === filter);

        filteredImages.forEach((image, index) => {
            const photoItem = document.createElement('div');
            photoItem.classList.add('photo-item');
            photoItem.setAttribute('data-category', image.category);
            photoItem.style.animationDelay = `${index * 0.1}s`; // Staggered fade-in

            photoItem.innerHTML = `
                <img src="${image.src}" alt="${image.caption}">
                <div class="photo-overlay">
                    <span>${image.caption}</span>
                </div>
            `;
            photoGrid.appendChild(photoItem);

            // Attach lightbox event listener
            photoItem.addEventListener('click', () => openLightbox(image.src, image.caption));
        });
    };

    // Initial render
    renderGallery();

    // --- Gallery Filtering ---
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove 'active' from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add 'active' to the clicked button
            button.classList.add('active');

            const filter = button.dataset.filter;
            renderGallery(filter);
        });
    });

    // --- Lightbox Functionality ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const captionText = document.getElementById('caption');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    let currentImageIndex;

    const openLightbox = (imgSrc, imgCaption) => {
        lightbox.classList.add('open'); // Use a class for showing/hiding
        lightboxImg.src = imgSrc;
        captionText.innerHTML = imgCaption;
        currentImageIndex = galleryImages.findIndex(img => img.src === imgSrc);
    };

    closeBtn.addEventListener('click', () => {
        lightbox.classList.remove('open');
    });

    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('open');
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('open')) {
            if (e.key === 'Escape') {
                lightbox.classList.remove('open');
            } else if (e.key === 'ArrowLeft') {
                navigateLightbox(-1);
            } else if (e.key === 'ArrowRight') {
                navigateLightbox(1);
            }
        }
    });

    prevBtn.addEventListener('click', () => navigateLightbox(-1));
    nextBtn.addEventListener('click', () => navigateLightbox(1));

    function navigateLightbox(direction) {
        currentImageIndex += direction;

        if (currentImageIndex < 0) {
            currentImageIndex = galleryImages.length - 1; // Loop to end
        } else if (currentImageIndex >= galleryImages.length) {
            currentImageIndex = 0; // Loop to beginning
        }

        const newImage = galleryImages[currentImageIndex];
        lightboxImg.src = newImage.src;
        captionText.innerHTML = newImage.caption;
    }
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