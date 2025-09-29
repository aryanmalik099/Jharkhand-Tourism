document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENT SELECTORS (Self Plan) ---
    const placesGrid = document.getElementById('places-grid');
    const searchBar = document.getElementById('search-bar');
    const categoryFilter = document.getElementById('category-filter');
    const selectedFiltersDisplay = document.getElementById('selected-filters-display');
    const itineraryDaysContainer = document.getElementById('itinerary-days-container');
    const addDayBtn = document.getElementById('add-day-btn');
    const saveTripBtn = document.getElementById('save-trip-btn');
    const summaryTotalDays = document.getElementById('summary-total-days');
    const summaryTotalPlaces = document.getElementById('summary-total-places');
    const summaryDistance = document.getElementById('summary-distance');
    const summaryActivities = document.getElementById('summary-activities');
    const tripMapElement = document.getElementById('trip-map');
    
    // --- DOM ELEMENT SELECTORS (Smart Plan) ---
    const smartDurationInput = document.getElementById('smart-duration');
    const smartTravelersInput = document.getElementById('smart-travelers');
    const smartBudgetSelect = document.getElementById('smart-budget');
    const smartTravelStyleSelect = document.getElementById('smart-travel-style');
    const smartAccommodationSelect = document.getElementById('smart-accommodation');
    const smartFoodPreferenceSelect = document.getElementById('smart-food-preference');
    const smartInterestTagsContainer = document.getElementById('smart-interest-tags');
    const generateSmartPlanBtn = document.getElementById('generate-smart-plan-btn');
    const smartPlanResults = document.getElementById('smart-plan-results');
    const smartItineraryContainer = document.getElementById('smart-itinerary-container');
    const editSmartPlanBtn = document.getElementById('edit-smart-plan-btn');
    const saveSmartPlanBtn = document.getElementById('save-smart-plan-btn');
    const smartSummaryDuration = document.getElementById('smart-summary-duration');
    const smartSummaryTravelers = document.getElementById('smart-summary-travelers');
    const smartSummaryBudget = document.getElementById('smart-summary-budget');
    const smartSummaryStyle = document.getElementById('smart-summary-style');
    const smartSummaryInterests = document.getElementById('smart-summary-interests');

    // --- DOM ELEMENT SELECTORS (General) ---
    const tabs = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    // --- STATE MANAGEMENT ---
    let allPlaces = []; // All available destinations fetched from API
    // Itinerary structure: [{ id: uniqueId, day: 1, places: [placeObj1, placeObj2] }]
    let itinerary = []; 
    let map = null; // Leaflet map instance
    let markers = L.featureGroup(); // Layer group for markers
    let polyline = L.polyline([], {color: 'var(--primary-color)', weight: 4, opacity: 0.8}); // Layer for route line

    // --- INITIALIZATION ---
    fetchPlaces();
    initTabbedInterface();
    initDarkMode();
    initMap(); 
    
    // Set up Sortable for reordering itinerary days
    new Sortable(itineraryDaysContainer, {
        animation: 150,
        handle: '.day-header', // Drag days by their header
        onEnd: (evt) => {
            // Reorder itinerary array based on new DOM order
            const movedDay = itinerary.splice(evt.oldIndex, 1)[0];
            itinerary.splice(evt.newIndex, 0, movedDay);
            renderItinerary(); // Re-render to update day numbers, summary, and map
        }
    });

    // --- API & DATA FETCHING ---
    async function fetchPlaces() {
        placesGrid.classList.add('loading');
        try {
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
            // Mock data for demonstration purposes
            const mockPlaces = [
                { id: '1', name: 'Ranchi Hill', category: 'Scenic', image_url: 'https://via.placeholder.com/100x75/00B289/ffffff?text=RanchiHill', latitude: 23.3611, longitude: 85.3134, description: 'Panoramic views of Ranchi city.' },
                { id: '2', name: 'Hundru Falls', category: 'Waterfall', image_url: 'https://via.placeholder.com/100x75/FF6B6B/ffffff?text=HundruFalls', latitude: 23.4357, longitude: 85.5786, description: 'One of the highest waterfalls in Jharkhand.' },
                { id: '3', name: 'Betla National Park', category: 'Wildlife', image_url: 'https://via.placeholder.com/100x75/FFD166/ffffff?text=BetlaNP', latitude: 23.8979, longitude: 84.1802, description: 'Home to tigers, elephants, and various deer species.' },
                { id: '4', name: 'Jagannath Temple', category: 'Religious', image_url: 'https://via.placeholder.com/100x75/1F456E/ffffff?text=Jaganath', latitude: 23.3150, longitude: 85.3090, description: 'Ancient temple similar to Puri Jagannath.' },
                { id: '5', name: 'Jonha Falls', category: 'Waterfall', image_url: 'https://via.placeholder.com/100x75/00B289/ffffff?text=JonhaFalls', latitude: 23.3175, longitude: 85.5398, description: 'Known as Gautamdhara, a beautiful cascade.' },
                { id: '6', name: 'Dassam Falls', category: 'Waterfall', image_url: 'https://via.placeholder.com/100x75/FF6B6B/ffffff?text=DassamFalls', latitude: 23.1678, longitude: 85.5895, description: 'Kanchi River falling from 144 feet.' },
                { id: '7', name: 'Palamu Forts', category: 'Historical', image_url: 'https://via.placeholder.com/100x75/FFD166/ffffff?text=PalamuForts', latitude: 23.9570, longitude: 84.2280, description: 'Ruins of two large forts in the dense forest.' },
                { id: '8', name: 'Netarhat', category: 'Scenic', image_url: 'https://via.placeholder.com/100x75/1F456E/ffffff?text=Netarhat', latitude: 23.4796, longitude: 84.2804, description: 'Queen of Chotanagpur, famous for sunrise/sunset.' },
            ];
            allPlaces = mockPlaces;
            renderPlaces(allPlaces);
            initSortablePlaces();
        } catch (error) {
            console.error('Error fetching places:', error);
            placesGrid.innerHTML = '<p class="placeholder">Could not load destinations.</p>';
        } finally {
            placesGrid.classList.remove('loading');
        }
    }

    // --- RENDERING FUNCTIONS ---
    function renderPlaces(places) {
        placesGrid.innerHTML = ''; // Clear previous results
        const loader = document.querySelector('#places-grid .loader');
        if(loader) loader.style.display = 'none';

        if (places.length === 0) {
            placesGrid.innerHTML = '<p class="placeholder">No matching places found.</p>';
            return;
        }
        places.forEach(place => {
            const placeCard = document.createElement('div');
            placeCard.className = 'place-card';
            placeCard.dataset.placeData = JSON.stringify(place); // Store entire place object
            placeCard.innerHTML = `
                <img src="${place.image_url}" alt="${place.name}">
                <div class="place-card-info">
                    <h4>${place.name}</h4>
                    <p>${place.category}</p>
                </div>`;
            placesGrid.appendChild(placeCard);
        });
    }

    function renderItinerary() {
        if (itinerary.length === 0) {
            itineraryDaysContainer.innerHTML = '<p class="placeholder">Add a day or drag a destination here to start!</p>';
        } else {
            itineraryDaysContainer.innerHTML = '';
            itinerary.forEach((dayData, index) => {
                const dayBlock = document.createElement('div');
                dayBlock.className = 'day-block';
                dayBlock.dataset.dayId = dayData.id;
                dayBlock.innerHTML = `
                    <div class="day-header">
                        <h4>Day ${index + 1}</h4>
                        <div class="day-actions">
                            <button class="remove-day-btn" title="Remove Day"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    </div>
                    <div class="day-content" data-day-id="${dayData.id}">
                        ${dayData.places.map(p => createItineraryItemHTML(p)).join('') || '<p class="day-placeholder">Drag destinations here</p>'}
                    </div>`;
                itineraryDaysContainer.appendChild(dayBlock);
            });
        }
        initSortableDayContents(); // Re-initialize Sortable for the day content areas
        updateTripSummary();
        updateMap();
    }

    function createItineraryItemHTML(place) {
        return `
            <div class="itinerary-item" data-place-data='${JSON.stringify(place)}'>
                <span><i class="fas fa-grip-vertical"></i> ${place.name}</span>
                <button class="remove-item-btn" title="Remove Place"><i class="fas fa-times"></i></button>
            </div>`;
    }

    function updateTripSummary() {
        const totalDays = itinerary.length;
        const allItineraryPlaces = itinerary.flatMap(day => day.places);
        const totalPlaces = allItineraryPlaces.length;
        
        const uniqueCategories = [...new Set(allItineraryPlaces.map(p => p.category))];
        const activitiesSummary = uniqueCategories.length > 0 ? uniqueCategories.join(', ') : 'None';

        summaryTotalDays.textContent = totalDays;
        summaryTotalPlaces.textContent = totalPlaces;
        summaryActivities.textContent = activitiesSummary;

        let estimatedDistance = 0;
        if (allItineraryPlaces.length > 1) {
            for (let i = 0; i < allItineraryPlaces.length - 1; i++) {
                const placeA = allItineraryPlaces[i];
                const placeB = allItineraryPlaces[i + 1];
                if (placeA.latitude && placeB.latitude) {
                    estimatedDistance += calculateDistance(placeA.latitude, placeA.longitude, placeB.latitude, placeB.longitude);
                }
            }
        }
        summaryDistance.textContent = `${estimatedDistance.toFixed(0)} km`;
    }

    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of Earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    // --- MAP FUNCTIONS (Leaflet.js) ---
    function initMap() {
        if (tripMapElement) {
            map = L.map(tripMapElement).setView([23.6, 85.3], 8); // Center on Jharkhand
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);
            markers.addTo(map);
            polyline.addTo(map);
        }
    }

    function updateMap() {
        if (!map) return;
        markers.clearLayers();
        
        const allItineraryPlaces = itinerary.flatMap(day => day.places);
        const latLngs = allItineraryPlaces
            .filter(p => p.latitude && p.longitude)
            .map(p => [p.latitude, p.longitude]);

        latLngs.forEach((latLng, index) => {
            const place = allItineraryPlaces[index];
            const customIcon = L.divIcon({
                html: `<i class="fas fa-map-marker-alt" style="color: var(--primary-color); font-size: 2rem; text-shadow: var(--shadow-sm);"></i>`,
                className: 'leaflet-div-icon-transparent', // Use a class to remove default bg/border
                iconSize: [24, 40],
                iconAnchor: [12, 40]
            });
            L.marker(latLng, { icon: customIcon })
              .bindPopup(`<b>${place.name}</b><br>${place.description || ''}`)
              .addTo(markers);
        });

        polyline.setLatLngs(latLngs);

        if (latLngs.length > 0) {
            map.fitBounds(markers.getBounds().pad(0.5), { maxZoom: 12 });
        } else {
            map.setView([23.6, 85.3], 8);
        }
    }

    // --- DRAG-AND-DROP (SORTABLE.JS) ---
    function initSortablePlaces() {
        new Sortable(placesGrid, {
            group: { name: 'shared', pull: 'clone', put: false },
            animation: 150,
            sort: false, // Do not sort the master list
        });
    }

    function initSortableDayContents() {
        document.querySelectorAll('.day-content').forEach(dayContent => {
            new Sortable(dayContent, {
                group: 'shared',
                animation: 150,
                ghostClass: 'itinerary-item-ghost',
                onEnd: (evt) => {
                    const { from, to, oldIndex, newIndex, item } = evt;
                    const placeData = JSON.parse(item.dataset.placeData);

                    // Case 1: Moving from the main places list to a day
                    if (from.id === 'places-grid') {
                        const targetDayId = to.dataset.dayId;
                        const targetDay = itinerary.find(d => d.id === targetDayId);
                        if (targetDay) {
                            targetDay.places.splice(newIndex, 0, placeData);
                        }
                        item.remove(); // Remove the clone from the DOM
                    } 
                    // Case 2: Moving between or within day lists
                    else {
                        const sourceDayId = from.dataset.dayId;
                        const targetDayId = to.dataset.dayId;
                        const sourceDay = itinerary.find(d => d.id === sourceDayId);
                        const targetDay = itinerary.find(d => d.id === targetDayId);

                        if (sourceDay && targetDay) {
                            // Remove from the source day's array
                            const [movedItem] = sourceDay.places.splice(oldIndex, 1);
                            // Add to the target day's array
                            targetDay.places.splice(newIndex, 0, movedItem);
                        }
                    }
                    // Re-render the entire itinerary to ensure UI is in sync with the state
                    renderItinerary();
                }
            });
        });
    }

    // --- EVENT HANDLERS (Self Plan) ---
    function handleFilterAndSearch() {
        const searchTerm = searchBar.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        let filteredPlaces = allPlaces.filter(p => 
            p.name.toLowerCase().includes(searchTerm) &&
            (selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory)
        );
        renderPlaces(filteredPlaces);
    }
    
    function addDay() {
        if (itinerary.length === 0) {
            itineraryDaysContainer.innerHTML = ''; // Clear placeholder
        }
        const newDayId = `day-${Date.now()}`;
        itinerary.push({ id: newDayId, day: itinerary.length + 1, places: [] });
        renderItinerary();
    }

    // --- EVENT HANDLERS (Smart Plan) ---
    smartInterestTagsContainer.addEventListener('click', (e) => {
        const tag = e.target.closest('.tag');
        if (tag) {
            tag.classList.toggle('selected');
        }
    });
    
    // (Other smart plan functions would go here, the provided ones were fine)
    
    // --- GENERAL FUNCTIONS & EVENT LISTENERS ---
    function initTabbedInterface() {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => switchTab(tab.dataset.tab));
        });
    }

    function switchTab(tabId) {
        tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
        tabContents.forEach(c => c.classList.toggle('active', c.id === tabId));

        if (tabId === 'self-plan' && map) {
            setTimeout(() => map.invalidateSize(true), 10); // Ensure map renders correctly
        }
    }

    function initDarkMode() {
        // Dark mode logic is correct as provided
        const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
        const currentTheme = localStorage.getItem("theme");
        if (currentTheme === "dark" || (!currentTheme && prefersDarkScheme.matches)) {
            document.body.dataset.theme = "dark";
            darkModeToggle.checked = true;
        }
        darkModeToggle.addEventListener('change', () => {
            const theme = darkModeToggle.checked ? "dark" : "light";
            document.body.dataset.theme = theme;
            localStorage.setItem("theme", theme);
        });
    }
    
    searchBar.addEventListener('input', handleFilterAndSearch);
    categoryFilter.addEventListener('change', handleFilterAndSearch);
    addDayBtn.addEventListener('click', addDay);
    // saveTripBtn.addEventListener('click', saveTripToProfile); // The save function logic was fine

    // **FIXED**: Use event delegation for removing items AND days
    itineraryDaysContainer.addEventListener('click', (e) => {
        // Remove an item from a day
        const removeItemBtn = e.target.closest('.remove-item-btn');
        if (removeItemBtn) {
            const itemElement = removeItemBtn.closest('.itinerary-item');
            const dayElement = removeItemBtn.closest('.day-content');
            const dayId = dayElement.dataset.dayId;
            const placeData = JSON.parse(itemElement.dataset.placeData);

            const day = itinerary.find(d => d.id === dayId);
            if (day) {
                day.places = day.places.filter(p => p.id !== placeData.id);
                renderItinerary();
            }
        }

        // **NEW**: Remove a whole day
        const removeDayBtn = e.target.closest('.remove-day-btn');
        if (removeDayBtn) {
            const dayBlock = removeDayBtn.closest('.day-block');
            const dayIdToRemove = dayBlock.dataset.dayId;
            itinerary = itinerary.filter(d => d.id !== dayIdToRemove);
            renderItinerary();
        }
    });

    // Initialize the page state on first load
    renderItinerary(); // To show the initial placeholder text
});