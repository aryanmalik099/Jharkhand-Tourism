document.addEventListener('DOMContentLoaded', () => {
    const vendors = [
        { id: 1, name: 'Jharkhand Handloom', category: 'handloom', lat: 23.3441, lon: 85.3096, image: 'https://via.placeholder.com/300' },
        { id: 2, name: 'Paitkar Paintings', category: 'handicrafts', lat: 22.7041, lon: 86.1957, image: 'https://via.placeholder.com/300' },
        { id: 3, name: 'Ranchi Street Food Corner', category: 'street-food', lat: 23.3441, lon: 85.3096, image: 'https://via.placeholder.com/300' },
    ];

    const map = L.map('map-view').setView([23.6393, 85.2489], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const vendorGrid = document.getElementById('vendor-grid');
    const categoryFilter = document.getElementById('category-filter');

    function displayVendors(filteredVendors) {
        vendorGrid.innerHTML = '';
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        filteredVendors.forEach(vendor => {
            // Add to grid
            const card = document.createElement('div');
            card.className = 'vendor-card';
            card.innerHTML = `
                <img src="${vendor.image}" alt="${vendor.name}">
                <div class="vendor-card-content">
                    <h3>${vendor.name}</h3>
                    <a href="/vendor/${vendor.id}">View Details</a>
                </div>
            `;
            vendorGrid.appendChild(card);

            // Add to map
            L.marker([vendor.lat, vendor.lon]).addTo(map)
                .bindPopup(`<b>${vendor.name}</b><br><a href="/vendor/${vendor.id}">View Details</a>`);
        });
    }

    categoryFilter.addEventListener('change', () => {
        const selectedCategory = categoryFilter.value;
        const filteredVendors = selectedCategory === 'all'
            ? vendors
            : vendors.filter(vendor => vendor.category === selectedCategory);
        displayVendors(filteredVendors);
    });

    displayVendors(vendors);
});