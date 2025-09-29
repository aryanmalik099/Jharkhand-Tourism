document.addEventListener('DOMContentLoaded', function() {
    
    // Typing animation for Itinerary
    const itineraryContent = `Day 1: Ranchi - The City of Waterfalls & Temples
    Morning (09:00 - 13:00): Arrival in Ranchi & Local Sightseeing
        - Arrive at Ranchi (Birsa Munda Airport or Hatia Railway Station). Check into your budget hotel/homestay.
        - Start with Rock Garden, a serene landscaped garden with sculptures carved from rocks.
        - Proceed to Pahari Mandir, a temple dedicated to Lord Shiva, offering panoramic views of Ranchi from a hillock.

    Afternoon (13:00 - 18:00): Spiritual & Historical Exploration
        - Visit Jagannath Temple, a replica of the Puri temple, known for its Rath Yatra.
        - Explore the tribal museum (if time permits) to understand local culture.

    Evening (18:00 onwards): Leisure & Local Flavors
        - Stroll around Ranchi Lake and enjoy the evening breeze.
        - Explore local markets for small souvenirs.

Day 2: Waterfalls & Scenic Drives - Nature's Masterpiece
    Morning (08:00 - 13:00): Dassam Falls & Jonha Falls
        - After an early breakfast, depart for Dassam Falls (approx. 40 km from Ranchi).
        - Continue to Jonha Falls (Gautam Dhara), another picturesque waterfall.

    Afternoon (13:00 - 18:00): Patratu Valley & Dam
        - Drive through the scenic Patratu Valley, known for its winding roads and lush green landscapes.
        - Visit Patratu Dam and enjoy the serene lake views.

Day 3: Netarhat - The Queen of Chotanagpur
    Morning (07:00 - 13:00): Journey to Netarhat & Lodh Falls
        - Begin your journey to Netarhat (approx. 150 km).
        - En route, visit Lodh Falls, Jharkhand's highest waterfall.

    Afternoon (13:00 - 18:00): Netarhat Exploration
        - Check into your accommodation in Netarhat.
        - Visit Koel View Point and explore Suga Bandh.

Day 4: Betla National Park - Wildlife & History
    Morning (07:00 - 13:00): Wildlife Safari & Chero Fort
        - Depart for Betla National Park (approx. 100 km).
        - Embark on a thrilling jeep safari and visit the historic Chero Forts.

    Afternoon (13:00 - 18:00): Mirchala Falls & Local Village
        - Visit Mirchala Falls and a nearby tribal village (with permission).

Day 5: Return to Ranchi & Departure
    Morning (08:00 - 13:00): Journey Back to Ranchi
        - After breakfast, begin your journey back to Ranchi (approx. 170 km).

    Afternoon (13:00 - 17:00): Last-Minute Shopping
        - Depending on your schedule, do some souvenir shopping at Firayalal Chowk.

    Evening (17:00 onwards): Departure
        - Head to Ranchi Airport or Railway Station for your departure.`;

    const typingOutput = document.getElementById('typing-output');
    let charIndex = 0;
    const typingSpeed = 10; // Milliseconds per character

    function typeWriter() {
        if (typingOutput && charIndex < itineraryContent.length) {
            typingOutput.innerHTML += itineraryContent.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, typingSpeed);
        } else if (typingOutput) {
            typingOutput.style.borderRight = 'none'; // Remove cursor after typing
        }
    }

    // Placeholder for Map interactivity
    function initMap() {
        const mapContainer = document.getElementById('interactive-map');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <iframe
                    width="100%"
                    height="100%"
                    frameborder="0" style="border:0; border-radius: 12px;"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1872898.153139363!2d84.0158223841075!3d23.63353457193988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398b2f8626c7e3f3%3A0x44211115e3a89b03!2sJharkhand!5e0!3m2!1sen!2sin!4v1678886458215!5m2!1sen!2sin"
                    allowfullscreen>
                </iframe>
            `;
        }
    }

    // Initialize functions
    typeWriter();
    initMap();

    // Event Listeners for buttons
    const downloadPdfButton = document.getElementById('downloadPdf');
    if (downloadPdfButton) {
        downloadPdfButton.addEventListener('click', function(e) {
            e.preventDefault();
            alert('PDF download functionality requires a dedicated library like jsPDF. This is a placeholder.');
        });
    }

    const sharePlanButton = document.getElementById('sharePlan');
    if (sharePlanButton) {
        sharePlanButton.addEventListener('click', function(e) {
            e.preventDefault();
            const url = window.location.href;
            if (navigator.share) {
                navigator.share({
                    title: 'My Jharkhand Trip Plan',
                    text: 'Check out my amazing 5-day trip plan for Jharkhand!',
                    url: url,
                }).catch((error) => console.error('Error sharing:', error));
            } else {
                prompt('Copy this link to share your plan:', url);
            }
        });
    }
});