document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENT SELECTORS ---
    const placesGrid = document.getElementById('places-grid');
    const searchBar = document.getElementById('search-bar');
    const categoryFilter = document.getElementById('category-filter');
    const itineraryDaysContainer = document.getElementById('itinerary-days-container');
    const addDayBtn = document.getElementById('add-day-btn');
    const saveTripBtn = document.getElementById('save-trip-btn');
    const tabs = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    // --- STATE MANAGEMENT ---
    let allPlaces = [];
    let itinerary = []; // Structure: [{ day: 1, places: [placeObj1, placeObj2] }]

    // --- INITIALIZATION ---
    fetchPlaces();
    initTabbedInterface();

    // --- API & DATA FETCHING ---
    async function fetchPlaces() {
        try {
            const response = await fetch('/api/places');
            if (!response.ok) throw new Error('Failed to fetch places');
            allPlaces = await response.json();
            renderPlaces(allPlaces);
            initSortable(); // Initialize drag-and-drop after places are loaded
        } catch (error) {
            console.error('Error fetching places:', error);
            placesGrid.innerHTML = '<p>Could not load destinations.</p>';
        }
    }

    // --- RENDERING FUNCTIONS ---
    function renderPlaces(places) {
        placesGrid.innerHTML = '';
        if (places.length === 0) {
            placesGrid.innerHTML = '<p>No matching places found.</p>';
            return;
        }
        places.forEach(place => {
            const placeCard = document.createElement('div');
            placeCard.className = 'place-card';
            placeCard.dataset.placeId = place.id; // Store ID for drag-and-drop
            placeCard.innerHTML = `
                <img src="${place.image_url || 'https://via.placeholder.com/100x75'}" alt="${place.name}">
                <div class="place-card-info">
                    <h4>${place.name}</h4>
                    <p>${place.category}</p>
                </div>`;
            placesGrid.appendChild(placeCard);
        });
    }

    function renderItinerary() {
        if (itinerary.length === 0) {
            itineraryDaysContainer.innerHTML = '<p class="placeholder">Add a day to start building your itinerary!</p>';
            return;
        }

        itineraryDaysContainer.innerHTML = '';
        itinerary.forEach((dayData, index) => {
            const dayBlock = document.createElement('div');
            dayBlock.className = 'day-block';
            dayBlock.innerHTML = `
                <div class="day-header">
                    <h4>Day ${dayData.day}</h4>
                    <button class="remove-day-btn" data-day-index="${index}"><i class="fas fa-times"></i></button>
                </div>
                <div class="day-content" data-day-index="${index}">
                    ${dayData.places.map(p => createItineraryItemHTML(p)).join('') || '<p class="day-placeholder">Drag a destination here</p>'}
                </div>`;
            itineraryDaysContainer.appendChild(dayBlock);
        });
        initSortable(); // Re-initialize Sortable for the new day blocks
    }

    function createItineraryItemHTML(place) {
        return `
            <div class="itinerary-item" data-place-id="${place.id}">
                <span>${place.name}</span>
                <button class="remove-item-btn"><i class="fas fa-trash-alt"></i></button>
            </div>`;
    }

    // --- DRAG-AND-DROP (SORTABLE.JS) ---
    function initSortable() {
        // Makes the list of places draggable (but they can't be dropped here)
        new Sortable(placesGrid, {
            group: {
                name: 'shared',
                pull: 'clone', // Clone items to the other list
                put: false // Don't allow items to be dropped here
            },
            animation: 150,
            sort: false // To prevent sorting of the master list
        });

        // Makes each day's content area a drop zone and sortable
        document.querySelectorAll('.day-content').forEach(dayContent => {
            new Sortable(dayContent, {
                group: 'shared',
                animation: 150,
                onAdd: (evt) => {
                    const placeId = evt.item.dataset.placeId;
                    const dayIndex = evt.to.dataset.dayIndex;
                    const place = allPlaces.find(p => p.id == placeId);

                    // Add to state and re-render to ensure data consistency
                    itinerary[dayIndex].places.push(place);
                    evt.item.remove(); // Remove the cloned item
                    renderItinerary();
                },
                onEnd: (evt) => {
                    // Handle reordering within or between days
                    const oldDayIndex = evt.from.dataset.dayIndex;
                    const newDayIndex = evt.to.dataset.dayIndex;
                    const oldIndex = evt.oldDraggableIndex;
                    const newIndex = evt.newDraggableIndex;

                    // Move the item in the state array
                    const [movedItem] = itinerary[oldDayIndex].places.splice(oldIndex, 1);
                    itinerary[newDayIndex].places.splice(newIndex, 0, movedItem);
                    
                    renderItinerary(); // Re-render to reflect the new order
                }
            });
        });
    }

    // --- EVENT HANDLERS ---
    function handleFilterAndSearch() {
        let filteredPlaces = [...allPlaces];
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

    function addDay() {
        const nextDay = itinerary.length > 0 ? Math.max(...itinerary.map(d => d.day)) + 1 : 1;
        itinerary.push({ day: nextDay, places: [] });
        renderItinerary();
    }

    async function saveTripToProfile() {
        // Flatten the itinerary to a simple list of place IDs for the current API
        const placeIds = itinerary.flatMap(day => day.places.map(place => place.id));

        if (placeIds.length === 0) {
            alert("Your itinerary is empty. Please add some places before saving.");
            return;
        }

        const tripName = prompt("Please enter a name for your trip:", "My Awesome Jharkhand Trip");
        if (tripName) {
            try {
                const response = await fetch('/api/trips', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: tripName, places: placeIds })
                });
                const result = await response.json();
                if (result.success) {
                    alert("Trip saved successfully to your profile!");
                    itinerary = [];
                    renderItinerary();
                } else {
                    // Handle user not logged in or other errors
                    alert(`Error: ${result.message}. You might need to log in.`);
                }
            } catch (error) {
                console.error('Failed to save trip:', error);
                alert("An error occurred while saving. Please try again.");
            }
        }
    }

    function initTabbedInterface() {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                tabContents.forEach(content => content.classList.remove('active'));
                document.getElementById(tab.dataset.tab).classList.add('active');
            });
        });
    }
    
    // --- EVENT LISTENERS ---
    searchBar.addEventListener('input', handleFilterAndSearch);
    categoryFilter.addEventListener('change', handleFilterAndSearch);
    addDayBtn.addEventListener('click', addDay);
    saveTripBtn.addEventListener('click', saveTripToProfile);

    // Delegated event listener for removing items and days
    itineraryDaysContainer.addEventListener('click', (e) => {
        // Remove an item from a day
        if (e.target.closest('.remove-item-btn')) {
            const itemElement = e.target.closest('.itinerary-item');
            const dayElement = e.target.closest('.day-content');
            const placeId = itemElement.dataset.placeId;
            const dayIndex = dayElement.dataset.dayIndex;
            
            itinerary[dayIndex].places = itinerary[dayIndex].places.filter(p => p.id != placeId);
            renderItinerary();
        }
        // Remove a whole day
        if (e.target.closest('.remove-day-btn')) {
            const dayIndex = e.target.closest('.remove-day-btn').dataset.dayIndex;
            itinerary.splice(dayIndex, 1);
            // Re-number subsequent days
            itinerary.forEach((dayData, i) => dayData.day = i + 1);
            renderItinerary();
        }
    });
});