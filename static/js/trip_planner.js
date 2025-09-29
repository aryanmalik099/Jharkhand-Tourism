document.addEventListener('DOMContentLoaded', () => {
    const places = [
        { id: 1, name: 'Dassam Falls', district: 'ranchi', category: 'waterfall' },
        { id: 2, name: 'Betla National Park', district: 'palamu', category: 'wildlife' },
        { id: 3, name: 'Netarhat', district: 'latehar', category: 'historical' },
    ];

    const placesGrid = document.getElementById('places-grid');
    const itineraryList = document.getElementById('itinerary-list');

    function renderPlaces(filteredPlaces) {
        placesGrid.innerHTML = '';
        filteredPlaces.forEach(place => {
            const placeCard = document.createElement('div');
            placeCard.className = 'place-card';
            placeCard.textContent = place.name;
            placeCard.dataset.placeId = place.id;
            placeCard.addEventListener('click', () => {
                const li = document.createElement('li');
                li.textContent = place.name;
                itineraryList.appendChild(li);
            });
            placesGrid.appendChild(placeCard);
        });
    }

    renderPlaces(places);
});
document.addEventListener('DOMContentLoaded', () => {
    const placesGrid = document.getElementById('places-grid');
    const itineraryList = document.getElementById('itinerary-list');
    const searchBar = document.getElementById('search-bar');
    const categoryFilter = document.getElementById('category-filter');
    const saveTripBtn = document.getElementById('save-trip-btn');

    let allPlaces = [];
    let itinerary = [];

    // Initialize the map
    const map = L.map('trip-map').setView([23.6393, 85.2489], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Fetch places from the API
    async function fetchPlaces() {
        try {
            const response = await fetch('/api/places');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            allPlaces = await response.json();
            renderPlaces(allPlaces);
        } catch (error) {
            console.error('Failed to fetch places:', error);
            placesGrid.innerHTML = '<p>Could not load destinations. Please try again later.</p>';
        }
    }

    // Render places in the destination panel
    function renderPlaces(places) {
        placesGrid.innerHTML = '';
        if (places.length === 0) {
            placesGrid.innerHTML = '<p>No matching places found.</p>';
            return;
        }
        places.forEach(place => {
            const placeCard = document.createElement('div');
            placeCard.className = 'place-card';
            placeCard.innerHTML = `
                <img src="${place.image_url || 'https://via.placeholder.com/80x60'}" alt="${place.name}">
                <div>
                    <h4>${place.name}</h4>
                    <p>${place.category}</p>
                </div>
            `;
            placeCard.addEventListener('click', () => addPlaceToItinerary(place));
            placesGrid.appendChild(placeCard);
        });
    }

    // Add a place to the itinerary
    function addPlaceToItinerary(place) {
        if (!itinerary.find(p => p.id === place.id)) {
            itinerary.push(place);
            renderItinerary();
        } else {
            alert(`${place.name} is already in your itinerary.`);
        }
    }

    // Render the itinerary list
    function renderItinerary() {
        itineraryList.innerHTML = '';
        if (itinerary.length === 0) {
            itineraryList.innerHTML = '<p class="placeholder">Add places to see them here.</p>';
            return;
        }
        itinerary.forEach((place, index) => {
            const itineraryItem = document.createElement('div');
            itineraryItem.className = 'itinerary-item'; // You'll need to style this
            itineraryItem.innerHTML = `
                <span>${index + 1}. ${place.name}</span>
                <button class="remove-btn" data-id="${place.id}">&times;</button>
            `;
            itineraryList.appendChild(itineraryItem);
        });

        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const placeId = parseInt(e.target.dataset.id, 10);
                itinerary = itinerary.filter(p => p.id !== placeId);
                renderItinerary();
            });
        });
        
        updateMap();
    }
    
    // Update map with itinerary markers
    function updateMap() {
        // Clear existing markers
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        if (itinerary.length > 0) {
            const latLngs = itinerary.map(place => [place.latitude, place.longitude]);
            
            itinerary.forEach(place => {
                 if(place.latitude && place.longitude) {
                    L.marker([place.latitude, place.longitude]).addTo(map)
                        .bindPopup(`<b>${place.name}</b>`);
                 }
            });

            map.fitBounds(latLngs, { padding: [50, 50] });
        } else {
            map.setView([23.6393, 85.2489], 7);
        }
    }


    // Filter and Search functionality
    function filterAndSearch() {
        let filteredPlaces = allPlaces;
        const searchTerm = searchBar.value.toLowerCase();
        const category = categoryFilter.value;

        if (searchTerm) {
            filteredPlaces = filteredPlaces.filter(p => p.name.toLowerCase().includes(searchTerm));
        }

        if (category !== 'all') {
            filteredPlaces = filteredPlaces.filter(p => p.category === category);
        }

        renderPlaces(filteredPlaces);
    }
    
    // Save trip functionality
    async function saveTrip() {
        if(itinerary.length === 0) {
            alert("Your itinerary is empty. Please add some places before saving.");
            return;
        }

        const tripName = prompt("Please enter a name for your trip:", "My Jharkhand Adventure");
        if (tripName) {
            const placeIds = itinerary.map(p => p.id);
            try {
                const response = await fetch('/api/trips', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: tripName, places: placeIds })
                });
                const result = await response.json();
                if(result.success) {
                    alert("Trip saved successfully!");
                    itinerary = [];
                    renderItinerary();
                } else {
                    alert(`Error: ${result.message}`);
                }
            } catch (error) {
                console.error('Failed to save trip:', error);
                alert("An error occurred while saving your trip. Please try again.");
            }
        }
    }


    // Event Listeners
    searchBar.addEventListener('input', filterAndSearch);
    categoryFilter.addEventListener('change', filterAndSearch);
    saveTripBtn.addEventListener('click', saveTrip);
    document.getElementById('clear-trip-btn').addEventListener('click', () => {
        if(confirm("Are you sure you want to clear your entire itinerary?")) {
            itinerary = [];
            renderItinerary();
        }
    });

    // Initial load
    fetchPlaces();
});