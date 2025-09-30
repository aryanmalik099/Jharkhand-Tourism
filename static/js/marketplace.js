document.addEventListener('DOMContentLoaded', () => {
    // --- Vendor Data (Expanded) ---
    const vendors = [
        {
            id: 'v1',
            name: 'Jharkhand Handloom Emporium',
            category: 'handloom',
            subCategory: 'textiles',
            description: 'A vibrant hub for traditional handwoven sarees, dhurries, and tribal attire. Supports local weavers and promotes sustainable practices. Discover exquisite Tussar silk products, intricate tribal prints, and comfortable cotton weaves. Each piece tells a story of Jharkhand\'s rich cultural heritage.',
            lat: 23.3441, lon: 85.3096, // Ranchi
            image: 'https://images.unsplash.com/photo-1596707323145-812037985472?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NjU2NTZ8MHwxfHNlYXJjaHwxfHxaYWRhcmklMjBhbmQlMjBjaGlrYW4lMjBoYW5kY3JhZnRzfGVufDB8fHx8MTcwODY0MzU4Mnww&ixlib=rb-4.0.3&q=80&w=1080',
            address: 'Main Road, Near Firayalal Chowk, Ranchi, Jharkhand 834001',
            contact: '+91-9876543210',
            rating: 4.8,
            isFeatured: true,
            locationName: 'Ranchi',
            products: ['Tussar Silk Sarees', 'Dhurries', 'Tribal Prints', 'Cotton Handlooms']
        },
        {
            id: 'v2',
            name: 'Paitkar Art & Crafts Gallery',
            category: 'handicrafts',
            subCategory: 'paintings',
            description: 'Showcasing the ancient scroll painting art of Paitkar from Amadubi. Meet the artists and purchase unique, mythological artworks. These vivid paintings on natural canvases depict folklore, myths, and social customs, preserved by generations of local artists.',
            lat: 22.7041, lon: 86.1957, // Jamshedpur (near Amadubi)
            image: 'https://images.unsplash.com/photo-1589182390196-857501a4e1b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NjU2NTZ8MHwxfHxQYWl0a2FyJTIwcGFpbnRpbmdzfGVufDB8fHx8MTcwODY0Mzc0NXww&ixlib=rb-4.0.3&q=80&w=1080',
            address: 'Amadubi Village, Potka Block, East Singhbhum, Jamshedpur, Jharkhand 833220',
            contact: '+91-9123456789',
            rating: 4.5,
            isFeatured: true,
            locationName: 'Jamshedpur',
            products: ['Paitkar Paintings', 'Folk Art', 'Mythological Scrolls']
        },
        {
            id: 'v3',
            name: 'Ranchi Food Fiesta',
            category: 'food',
            subCategory: 'street-food',
            description: 'A bustling street food hub offering local delicacies like Dhuska, Litti Chokha, and bamboo shoot dishes. A must-visit for foodies! Experience the authentic taste of Jharkhand with freshly prepared snacks, sweets, and traditional meals in a lively atmosphere.',
            lat: 23.3500, lon: 85.3200, // Slightly different Ranchi location
            image: 'https://images.unsplash.com/photo-1563829443588-e87f10b7a4cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NjU2NTZ8MHwxfHxJbmRpYW4lMjBzdHJlZXQlMjBmb29kfGVufDB8fHx8MTcwODY0MzY3Mnww&ixlib=rb-4.0.3&q=80&w=1080',
            address: 'Harmu Road, Near Argora Chowk, Ranchi, Jharkhand 834002',
            contact: '+91-8765432109',
            rating: 4.7,
            isFeatured: true,
            locationName: 'Ranchi',
            products: ['Dhuska', 'Litti Chokha', 'Pua', 'Chana Ghugni', 'Bamboo Shoot Delicacies']
        },
        {
            id: 'v4',
            name: 'JD Hi-Street Mall',
            category: 'malls',
            subCategory: 'shopping',
            description: 'A modern shopping mall with international and national brands, multiplex cinema, and a food court. Perfect for a day out. Enjoy a wide range of fashion, electronics, lifestyle products, and entertainment options under one roof.',
            lat: 23.3600, lon: 85.3000, // Ranchi
            image: '/static/images/jd.png',
            address: 'Kanke Road, Ranchi, Jharkhand 834008',
            contact: '+91-7654321098',
            rating: 4.2,
            isFeatured: false,
            locationName: 'Ranchi',
            products: ['Fashion Apparel', 'Electronics', 'Footwear', 'Multiplex', 'Food Court']
        },
        {
            id: 'v5',
            name: 'Bokaro Steel City Market',
            category: 'markets',
            subCategory: 'traditional-market',
            description: 'A bustling local market in Bokaro, offering fresh produce, local spices, traditional utensils, and clothing. Experience the lively atmosphere of a true Indian bazaar.',
            lat: 23.6600, lon: 86.1500, // Bokaro
            image: 'https://images.unsplash.com/photo-1517457375-a223409152a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NjU2NTZ8MHwxfHxJbmRpYW4lMjBsb2NhbCUyMG1hcmtldHxlbnwwfHx8fDE3MDg2NDM5MTd8MA&ixlib=rb-4.0.3&q=80&w=1080',
            address: 'Sector 4, Bokaro Steel City, Jharkhand 827004',
            contact: '+91-9012345678',
            rating: 3.9,
            isFeatured: false,
            locationName: 'Bokaro',
            products: ['Fresh Produce', 'Spices', 'Handicrafts', 'Clothing', 'Utensils']
        },
        {
            id: 'v6',
            name: 'Saraikela Chhau Mask Makers',
            category: 'handicrafts',
            subCategory: 'masks',
            description: 'Visit the workshops of traditional Chhau mask makers in Saraikela. Witness the intricate process and buy authentic dance masks. These artistic masks are integral to the Chhau dance form, a UNESCO recognized cultural heritage.',
            lat: 22.7933, lon: 85.9576, // Saraikela
            image: 'https://images.unsplash.com/photo-1628191060932-a5676773383a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NjU2NTZ8MHwxfHxJbmRpYW4lMjB0cmliYWwlMjBtYXNrcyUyMGNyYWZ0c3xlbnwwfHx8fDE3MDg2NDQwMTJ8MA&ixlib=rb-4.0.3&q=80&w=1080',
            address: 'Near Rajbari, Saraikela Kharsawan, Jharkhand 833219',
            contact: '+91-8877665544',
            rating: 4.9,
            isFeatured: true,
            locationName: 'Saraikela',
            products: ['Chhau Masks', 'Folk Masks', 'Decorative Masks']
        },
        {
            id: 'v7',
            name: 'Deoghar Peda & Sweets',
            category: 'food',
            subCategory: 'sweets',
            description: 'Famous for the delectable Deoghar Peda, this sweet shop offers a variety of traditional Indian sweets. A pilgrimage without this sweet is incomplete!',
            lat: 24.4842, lon: 86.6976, // Deoghar
            image: 'https://images.unsplash.com/photo-1626082414702-c9a9d7b420f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NjU2NTZ8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBzd2VldHN8ZW58MHx8fHwxNzA4NjQ0MjAwfDA&ixlib=rb-4.0.3&q=80&w=1080',
            address: 'Shiv Ganga Enclave, Deoghar, Jharkhand 814112',
            contact: '+91-7000112233',
            rating: 4.6,
            isFeatured: false,
            locationName: 'Deoghar',
            products: ['Deoghar Peda', 'Laddu', 'Barfi', 'Ghewar']
        },
        {
            id: 'v8',
            name: 'Hazaribagh Traditional Bazaar',
            category: 'markets',
            subCategory: 'local-produce',
            description: 'Explore the vibrant local market of Hazaribagh, known for its tribal jewelry, organic produce, and unique local crafts.',
            lat: 23.9944, lon: 85.3412, // Hazaribagh
            image: 'https://images.unsplash.com/photo-1549488344-96426305a2e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NjU2NTZ8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjB0cmliYWwlMjBqZXdlbHJ5JTIwbWFya2V0fGVufDB8fHx8MTcwODY0NDMwN3ww&ixlib=rb-4.0.3&q=80&w=1080',
            address: 'Guru Gobind Singh Road, Hazaribagh, Jharkhand 825301',
            contact: '+91-9988776655',
            rating: 4.1,
            isFeatured: false,
            locationName: 'Hazaribagh',
            products: ['Tribal Jewelry', 'Organic Vegetables', 'Handmade Baskets', 'Local Spices']
        },
        {
            id: 'v9',
            name: 'Dhanbad Urban Market',
            category: 'malls',
            subCategory: 'boutiques',
            description: 'A mix of modern boutiques and small shops offering fashion, accessories, and gifts in the heart of Dhanbad.',
            lat: 23.7957, lon: 86.4304, // Dhanbad
            image: 'https://images.unsplash.com/photo-1550995642-83561cd085f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NjU2NTZ8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBib3V0aXF1ZSUyMGZhc2hpb258ZW58MHx8fHwxNzA4NjQ0NDEzfDA&ixlib=rb-4.0.3&q=80&w=1080',
            address: 'Bank More, Dhanbad, Jharkhand 826001',
            contact: '+91-9432109876',
            rating: 3.8,
            isFeatured: false,
            locationName: 'Dhanbad',
            products: ['Modern Apparel', 'Fashion Accessories', 'Gift Items', 'Footwear']
        },
        {
            id: 'v10',
            name: 'Gamharia Crafts Village',
            category: 'handicrafts',
            subCategory: 'pottery-metalcraft',
            description: 'Home to skilled artisans specializing in traditional pottery and exquisite Dokra metal crafts. Perfect for unique souvenirs.',
            lat: 22.7500, lon: 86.1300, // Near Jamshedpur
            image: 'https://images.unsplash.com/photo-1610486981881-28564a2f8d83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NjU2NTZ8MHwxfHNlYXJjaHwxfHxkb2tyYSUyMG1ldGFsJTIwY3JhZnRzfGVufDB8fHx8MTcwODY0NDQ2NHww&ixlib=rb-4.0.3&q=80&w=1080',
            address: 'Gamharia, Seraikela Kharsawan, Jharkhand 832108',
            contact: '+91-7890123456',
            rating: 4.7,
            isFeatured: true,
            locationName: 'Gamharia',
            products: ['Dokra Art', 'Terracotta Pottery', 'Tribal Figurines', 'Metal Crafts']
        },
        {
            id: 'v11',
            name: 'Netarhat Local Honey & Herbs',
            category: 'food',
            subCategory: 'organic-produce',
            description: 'Discover organic honey, medicinal herbs, and forest produce directly from local tribal communities in Netarhat.',
            lat: 23.4833, lon: 84.2667, // Netarhat
            image: 'https://images.unsplash.com/photo-1596207123992-0b2a7e7d6b3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NjU2NTZ8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwaG9uZXklMjBhbmQlMjBoZXJic3xlbnwwfHx8fDE3MDg2NDQ1NTJ8MA&ixlib=rb-4.0.3&q=80&w=1080',
            address: 'Near Viewpoint, Netarhat, Latehar, Jharkhand 829202',
            contact: '+91-9009988776',
            rating: 4.5,
            isFeatured: false,
            locationName: 'Netarhat',
            products: ['Forest Honey', 'Medicinal Herbs', 'Organic Grains', 'Tribal Handicrafts']
        },
        {
            id: 'v12',
            name: 'Jamshedpur Fashion Street',
            category: 'boutiques',
            subCategory: 'fashion',
            description: 'A street lined with small boutiques offering trendy fashion, accessories, and tailor-made ethnic wear.',
            lat: 22.7981, lon: 86.2167, // Jamshedpur
            image: 'https://images.unsplash.com/photo-1587397753696-9818f9720448?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NjU2NTZ8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmYXNoaW9uJTIwc3RyZWV0fGVufDB8fHx8MTcwODY0NDY1M3ww&ixlib=rb-4.0.3&q=80&w=1080',
            address: 'Sakchi Market Area, Jamshedpur, Jharkhand 831001',
            contact: '+91-9234567890',
            rating: 4.3,
            isFeatured: false,
            locationName: 'Jamshedpur',
            products: ['Ethnic Wear', 'Western Outfits', 'Jewelry', 'Fashion Accessories']
        }
    ];

    // --- DOM Elements ---
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const categoryFilter = document.getElementById('category-filter');
    const ratingFilter = document.getElementById('rating-filter');
    const sortBy = document.getElementById('sort-by');
    const resetFiltersButton = document.getElementById('reset-filters');
    const vendorGrid = document.getElementById('vendor-grid');
    const featuredVendorsGrid = document.getElementById('featured-vendors');
    const noResultsMessage = document.getElementById('no-results');

    // Modal elements
    const vendorModal = document.getElementById('vendor-modal');
    const closeModalButton = document.querySelector('.modal .close-button');
    const modalImage = document.getElementById('modal-image');
    const modalName = document.getElementById('modal-name');
    const modalCategory = document.getElementById('modal-category');
    const modalAddress = document.getElementById('modal-address');
    const modalRating = document.getElementById('modal-rating');
    const modalContact = document.getElementById('modal-contact');
    const modalDescription = document.getElementById('modal-description');
    const modalDirections = document.getElementById('modal-directions');


    // --- Map Initialization ---
    let map = null;
    let markers = L.markerClusterGroup(); // Use marker clustering

    function initializeMap() {
        if (map) map.remove(); // Remove existing map if any

        map = L.map('map-view').setView([23.6, 85.3], 8); // Centered on Jharkhand
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        markers = L.markerClusterGroup(); // Reset marker cluster group
        map.addLayer(markers); // Add it to the map
    }

    // --- Helper Function to Create Star Rating HTML ---
    function getStarRatingHTML(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        let starsHtml = '';
        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<i class="fas fa-star"></i>';
        }
        if (halfStar) {
            starsHtml += '<i class="fas fa-star-half-alt"></i>';
        }
        for (let i = 0; i < (5 - fullStars - (halfStar ? 1 : 0)); i++) {
            starsHtml += '<i class="far fa-star"></i>'; // Empty star
        }
        return `<span class="rating">${starsHtml} (${rating})</span>`;
    }

    // --- Render Vendor Card ---
    function createVendorCard(vendor) {
        const card = document.createElement('div');
        card.className = 'vendor-card';
        card.dataset.id = vendor.id; // Store ID for modal

        card.innerHTML = `
            <img src="${vendor.image}" alt="${vendor.name}">
            <div class="vendor-card-content">
                <h3>${vendor.name}</h3>
                <p><i class="fas fa-map-marker-alt"></i> ${vendor.address.split(',')[0]}, ${vendor.locationName}</p>
                <p>${getStarRatingHTML(vendor.rating)}</p>
                <span class="category-tag">${vendor.category.replace('-', ' ')}</span>
            </div>
        `;
        card.addEventListener('click', () => openVendorModal(vendor.id));
        return card;
    }

    // --- Render Vendors to Grids and Map ---
    function renderVendors(filteredVendors) {
        vendorGrid.innerHTML = '';
        featuredVendorsGrid.innerHTML = '';
        markers.clearLayers(); // Clear existing markers

        const featured = filteredVendors.filter(v => v.isFeatured);
        const regular = filteredVendors.filter(v => !v.isFeatured);

        if (featured.length > 0) {
            featured.forEach(vendor => featuredVendorsGrid.appendChild(createVendorCard(vendor)));
        } else {
            // Optionally hide featured section if no featured items match filters
            // document.querySelector('.section-heading:nth-of-type(2)').style.display = 'none';
        }

        if (regular.length > 0) {
            regular.forEach(vendor => vendorGrid.appendChild(createVendorCard(vendor)));
        }

        // Handle no results
        if (filteredVendors.length === 0) {
            noResultsMessage.style.display = 'block';
        } else {
            noResultsMessage.style.display = 'none';
        }

        // Add markers to map
        filteredVendors.forEach(vendor => {
            const customIcon = L.divIcon({
                className: 'custom-div-icon',
                html: `<div style="background-color:${getCategoryColor(vendor.category)};" class="marker-pin"></div><i class="fa-solid ${getCategoryIcon(vendor.category)} fa-lg marker-icon"></i>`,
                iconSize: [30, 42],
                iconAnchor: [15, 42]
            });

            const marker = L.marker([vendor.lat, vendor.lon], { icon: customIcon })
                .bindPopup(`<b>${vendor.name}</b><br>${vendor.address.split(',')[0]}<br>Rating: ${vendor.rating}`)
                .on('click', () => openVendorModal(vendor.id)); // Click marker opens modal

            markers.addLayer(marker);
        });

        // If markers exist, fit map to their bounds
        if (filteredVendors.length > 0) {
            map.fitBounds(markers.getBounds(), { padding: [50, 50] });
        } else {
            // If no markers, reset view to Jharkhand center
            map.setView([23.6, 85.3], 8);
        }
    }

    // --- Category Colors & Icons (for map markers and UI) ---
    function getCategoryColor(category) {
        switch (category) {
            case 'handloom': return '#FF7043'; // Primary Orange
            case 'handicrafts': return '#FBC02D'; // Amber
            case 'food': return '#E53935'; // Red
            case 'malls': return '#1976D2'; // Blue
            case 'markets': return '#388E3C'; // Dark Green
            case 'boutiques': return '#8E24AA'; // Purple
            default: return '#757575'; // Grey
        }
    }

    function getCategoryIcon(category) {
        switch (category) {
            case 'handloom': return 'fa-shirt';
            case 'handicrafts': return 'fa-paint-brush';
            case 'food': return 'fa-utensils';
            case 'malls': return 'fa-store-alt';
            case 'markets': return 'fa-shop';
            case 'boutiques': return 'fa-gem';
            default: return 'fa-info-circle';
        }
    }

    // --- Filtering and Sorting Logic ---
    function applyFiltersAndSort() {
        let currentVendors = [...vendors];

        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedCategory = categoryFilter.value;
        const minRating = parseFloat(ratingFilter.value);
        const sortOption = sortBy.value;

        // 1. Search
        if (searchTerm) {
            currentVendors = currentVendors.filter(vendor =>
                vendor.name.toLowerCase().includes(searchTerm) ||
                vendor.description.toLowerCase().includes(searchTerm) ||
                vendor.category.toLowerCase().includes(searchTerm) ||
                (vendor.products && vendor.products.some(p => p.toLowerCase().includes(searchTerm)))
            );
        }

        // 2. Category Filter
        if (selectedCategory !== 'all') {
            currentVendors = currentVendors.filter(vendor => vendor.category === selectedCategory);
        }

        // 3. Rating Filter
        if (minRating > 0) {
            currentVendors = currentVendors.filter(vendor => vendor.rating >= minRating);
        }

        // 4. Sort
        currentVendors.sort((a, b) => {
            if (sortOption === 'name-asc') {
                return a.name.localeCompare(b.name);
            } else if (sortOption === 'name-desc') {
                return b.name.localeCompare(a.name);
            } else if (sortOption === 'rating-desc') {
                return b.rating - a.rating;
            } else if (sortOption === 'rating-asc') {
                return a.rating - b.rating;
            }
            return 0;
        });

        renderVendors(currentVendors);
    }

    // --- Modal Functions ---
    function openVendorModal(vendorId) {
        const vendor = vendors.find(v => v.id === vendorId);
        if (!vendor) return;

        modalImage.src = vendor.image;
        modalImage.alt = vendor.name;
        modalName.textContent = vendor.name;
        modalCategory.textContent = `${vendor.category.replace('-', ' ')}${vendor.subCategory ? ` (${vendor.subCategory.replace('-', ' ')})` : ''}`;
        modalAddress.textContent = vendor.address;
        modalRating.innerHTML = getStarRatingHTML(vendor.rating);
        modalContact.textContent = vendor.contact;
        modalDescription.textContent = vendor.description;

        // Generate Google Maps directions link
        const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${vendor.lat},${vendor.lon}`;
        modalDirections.href = directionsUrl;

        vendorModal.style.display = 'flex';
        // Add class to body to prevent scrolling
        document.body.classList.add('modal-open');
    }

    function closeVendorModal() {
        vendorModal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }

    // --- Event Listeners ---
    searchButton.addEventListener('click', applyFiltersAndSort);
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            applyFiltersAndSort();
        }
    });
    categoryFilter.addEventListener('change', applyFiltersAndSort);
    ratingFilter.addEventListener('change', applyFiltersAndSort);
    sortBy.addEventListener('change', applyFiltersAndSort);
    resetFiltersButton.addEventListener('click', () => {
        searchInput.value = '';
        categoryFilter.value = 'all';
        ratingFilter.value = '0';
        sortBy.value = 'name-asc';
        applyFiltersAndSort();
    });

    // Close modal listeners
    closeModalButton.addEventListener('click', closeVendorModal);
    window.addEventListener('click', (event) => {
        if (event.target === vendorModal) {
            closeVendorModal();
        }
    });
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && vendorModal.style.display === 'flex') {
            closeVendorModal();
        }
    });

    // --- Initial Load ---
    initializeMap();
    applyFiltersAndSort(); // Render all vendors initially
});