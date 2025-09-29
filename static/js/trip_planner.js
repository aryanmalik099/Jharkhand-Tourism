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