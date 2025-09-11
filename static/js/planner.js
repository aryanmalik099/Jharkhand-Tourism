// Helper Constants & Function
const CURRENT_ITINERARY_STORAGE_KEY = 'currentItinerary';
const SAVED_PLANS_STORAGE_KEY = 'savedTripPlans';
const ITINERARY_PLACEHOLDER_HTML = '<p class="placeholder-text">Drag destinations here</p>';

function getElementByIdSafe(id) {
    return document.getElementById(id);
}

// Preloader Removal + Start Animations
window.addEventListener('load', () => {
    const preloader = getElementByIdSafe('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        preloader.style.transition = 'opacity 0.5s ease';
        preloader.addEventListener('transitionend', () => preloader.remove());
    }

    // Start observing animated elements after preloader hides
    animateSectionsOnScroll();
});

const animatedElements = document.querySelectorAll('.animate-fade-in, .animate-slide-up, section:not(.hero-section)');

const observerOptions = {
    root: null, // relative to the viewport
    rootMargin: '0px',
    threshold: 0.1 // Trigger when 10% of the element is visible
};

const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            obs.unobserve(entry.target); // Stop observing once animated
        }
    });
}, observerOptions);

function animateSectionsOnScroll() {
    animatedElements.forEach(el => observer.observe(el));
}
// This function is now called either after the preloader hides or directly if no preloader.


// --- Tooltip Functionality ---
const tooltipContainer = getElementByIdSafe('tooltip-container');
const tooltipTriggers = document.querySelectorAll('.tooltip-trigger');

if (tooltipContainer) {
    tooltipTriggers.forEach(trigger => {
        let currentTooltip = null; // To manage a single tooltip per trigger

        const showTooltip = (e) => {
            const tooltipText = e.target.dataset.tooltip;
            if (tooltipText) {
                // Remove any existing tooltip before creating a new one
                if (currentTooltip) {
                    currentTooltip.remove();
                }

                const tooltip = document.createElement('div');
                tooltip.classList.add('custom-tooltip');
                tooltip.textContent = tooltipText;
                tooltipContainer.appendChild(tooltip);
                currentTooltip = tooltip; // Store reference to the new tooltip

                // Force reflow to ensure width is calculated before positioning
                tooltip.offsetWidth;

                // Position the tooltip accurately
                const rect = e.target.getBoundingClientRect();
                let leftPos = rect.left + window.scrollX + (rect.width / 2) - (tooltip.offsetWidth / 2);
                let topPos = rect.top + window.scrollY - tooltip.offsetHeight - 10; // 10px above the trigger

                // Basic boundary checks
                if (leftPos < 10) leftPos = 10;
                if (leftPos + tooltip.offsetWidth > window.innerWidth - 10) {
                    leftPos = window.innerWidth - tooltip.offsetWidth - 10;
                }

                tooltip.style.left = `${leftPos}px`;
                tooltip.style.top = `${topPos}px`;
                tooltip.style.opacity = '1';
                tooltip.style.transform = 'translateY(0)'; // Remove slide-up effect
            }
        };

        const hideTooltip = () => {
            if (currentTooltip) {
                currentTooltip.style.opacity = '0';
                currentTooltip.style.transform = 'translateY(-5px)'; // Re-apply slide-up for exit
                currentTooltip.addEventListener('transitionend', () => {
                    currentTooltip.remove();
                    currentTooltip = null;
                }, { once: true });
            }
        };

        trigger.addEventListener('mouseenter', showTooltip);
        trigger.addEventListener('mouseleave', hideTooltip);
        trigger.addEventListener('focus', showTooltip); // For keyboard accessibility
        trigger.addEventListener('blur', hideTooltip);   // For keyboard accessibility
    });
}

// --- Trip Planner Drag and Drop with Date and Notes ---
const draggableDestinations = getElementByIdSafe('draggable-destinations');
const itineraryDropzone = getElementByIdSafe('itinerary-dropzone');
const clearPlanBtn = getElementByIdSafe('clear-plan-btn');
const generatePlanBtn = getElementByIdSafe('generate-plan-btn');
const savePlanBtn = getElementByIdSafe('save-plan-btn');
const loadPlanBtn = getElementByIdSafe('load-plan-btn');

// Load itinerary from localStorage on page load
loadCurrentItinerary();

// Event listener for dragging items from the available destinations list
if (draggableDestinations) {
    draggableDestinations.addEventListener('dragstart', (e) => {
        const target = e.target;
        if (target && target.tagName === 'LI' && target.dataset.name) {
            e.dataTransfer.setData('application/json', JSON.stringify({
                name: target.dataset.name,
                image: target.dataset.image || ''
            }));
            target.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'copy';
        }
    });

    draggableDestinations.addEventListener('dragend', (e) => {
        if (e.target && e.target.tagName === 'LI') {
            e.target.classList.remove('dragging');
        }
    });
}


// Event listeners for the itinerary dropzone
if (itineraryDropzone) {
    itineraryDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        const isDraggingNewItem = e.dataTransfer.types.includes('application/json');
        const isDraggingExistingItem = document.querySelector('.itinerary-item.dragging');

        if (isDraggingNewItem) {
            e.dataTransfer.dropEffect = 'copy';
            itineraryDropzone.classList.add('drag-over');
        } else if (isDraggingExistingItem && itineraryDropzone.contains(isDraggingExistingItem)) {
            // Reordering existing item within the same dropzone
            e.dataTransfer.dropEffect = 'move';
            const afterElement = getDragAfterElement(itineraryDropzone, e.clientY);
            const dragging = isDraggingExistingItem;

            if (afterElement == null) {
                if (dragging !== itineraryDropzone.lastElementChild) {
                    itineraryDropzone.appendChild(dragging);
                }
            } else {
                if (dragging !== afterElement && dragging !== afterElement.previousElementSibling) {
                    itineraryDropzone.insertBefore(dragging, afterElement);
                }
            }
        }
    });

    itineraryDropzone.addEventListener('dragleave', () => {
        itineraryDropzone.classList.remove('drag-over');
    });

    itineraryDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        itineraryDropzone.classList.remove('drag-over');

        const isDraggingNewItem = e.dataTransfer.types.includes('application/json');

        if (isDraggingNewItem) {
            try {
                const data = JSON.parse(e.dataTransfer.getData('application/json'));
                if (data && data.name) {
                    addItineraryItem(data.name, data.image);
                    saveCurrentItinerary();
                    showToast(`'${data.name}' added to your plan.`, 'success', 2000);
                }
            } catch (error) {
                console.error("Error parsing dropped data:", error);
                showToast("Failed to add destination. Invalid data.", "error");
            }
        } else {
            // This drop event handles the final placement after reordering
            const dragging = document.querySelector('.itinerary-item.dragging');
            if (dragging) {
                // The dragover event has already handled the visual insertion, just save the new order.
                saveCurrentItinerary();
                showToast('Itinerary reordered.', 'info', 1500);
            }
        }
    });
}

/**
 * Adds an itinerary item to the dropzone.
 * @param {string} destinationName - The name of the destination.
 * @param {string} [destinationImage=''] - URL of the destination image.
 * @param {string} [date=''] - Pre-filled date.
 * @param {string} [notes=''] - Pre-filled notes.
 */
function addItineraryItem(destinationName, destinationImage = '', date = '', notes = '') {
    if (!itineraryDropzone) return;

    const placeholder = itineraryDropzone.querySelector('.placeholder-text');
    if (placeholder) {
        placeholder.remove();
    }

    const itineraryItem = document.createElement('div');
    itineraryItem.classList.add('itinerary-item');
    itineraryItem.setAttribute('draggable', 'true');
    itineraryItem.dataset.name = destinationName;
    itineraryItem.dataset.image = destinationImage;
    itineraryItem.dataset.date = date; // Set initial date
    itineraryItem.dataset.notes = notes; // Set initial notes

    // Ensure current date is available if not provided
    const today = new Date().toISOString().split('T')[0];
    const initialDate = date || today;

    itineraryItem.innerHTML = `
        <div class="item-header">
            ${destinationImage ? `<img src="${destinationImage}" alt="${destinationName}" loading="lazy">` : ''}
            <span class="destination-name">${destinationName}</span>
            <div class="item-controls">
                <input type="date" value="${initialDate}" aria-label="Date for ${destinationName}">
                <button class="move-up" aria-label="Move Up itinerary item"><i class="fas fa-chevron-up"></i></button>
                <button class="move-down" aria-label="Move Down itinerary item"><i class="fas fa-chevron-down"></i></button>
                <button class="remove-item" aria-label="Remove itinerary item"><i class="fas fa-times"></i></button>
            </div>
        </div>
        <textarea placeholder="Add notes for ${destinationName}..." rows="1" aria-label="Notes for ${destinationName}">${notes}</textarea>
    `;
    itineraryDropzone.appendChild(itineraryItem);
    setupItineraryItemListeners(itineraryItem);
    adjustTextareaHeight(itineraryItem.querySelector('textarea')); // Adjust height initially
}

/**
 * Sets up event listeners for a newly created itinerary item.
 * @param {HTMLElement} item - The itinerary item element.
 */
function setupItineraryItemListeners(item) {
    // Remove item
    const removeItemBtn = item.querySelector('.remove-item');
    if (removeItemBtn) {
        removeItemBtn.addEventListener('click', () => {
            item.classList.add('fade-out');
            item.addEventListener('transitionend', () => {
                item.remove();
                if (itineraryDropzone && itineraryDropzone.children.length === 0) {
                    itineraryDropzone.innerHTML = ITINERARY_PLACEHOLDER_HTML;
                }
                saveCurrentItinerary();
                showToast(`'${item.dataset.name}' removed.`, 'info', 1500);
            }, { once: true });
        });
    }

    // Update on input/textarea change
    const dateInput = item.querySelector('input[type="date"]');
    if (dateInput) {
        dateInput.addEventListener('change', () => {
            item.dataset.date = dateInput.value;
            saveCurrentItinerary();
        });
    }
    const notesTextarea = item.querySelector('textarea');
    if (notesTextarea) {
        notesTextarea.addEventListener('input', () => {
            item.dataset.notes = notesTextarea.value;
            adjustTextareaHeight(notesTextarea); // Adjust height on input
            saveCurrentItinerary();
        });
    }

    // Reordering functionality (drag within dropzone)
    item.addEventListener('dragstart', (e) => {
        e.stopPropagation(); // Stop propagation to parent dropzone's dragstart
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', 'itinerary-item-reorder'); // Dummy data for identification
        e.target.classList.add('dragging');
    });

    item.addEventListener('dragend', (e) => {
        e.stopPropagation();
        e.target.classList.remove('dragging');
    });

    // Manual move up/down buttons
    const moveUpBtn = item.querySelector('.move-up');
    if (moveUpBtn) {
        moveUpBtn.addEventListener('click', () => {
            const prev = item.previousElementSibling;
            if (prev && prev.classList.contains('itinerary-item')) {
                itineraryDropzone.insertBefore(item, prev);
                saveCurrentItinerary();
                showToast('Item moved up.', 'info', 1000);
            }
        });
    }

    const moveDownBtn = item.querySelector('.move-down');
    if (moveDownBtn) {
        moveDownBtn.addEventListener('click', () => {
            const next = item.nextElementSibling;
            if (next && next.classList.contains('itinerary-item')) {
                // To move down, insert 'next' before 'item'. (Effectively swaps them)
                itineraryDropzone.insertBefore(next, item);
                saveCurrentItinerary();
                showToast('Item moved down.', 'info', 1000);
            }
        });
    }
}

/**
 * Determines which element to place the dragged item after.
 * @param {HTMLElement} container - The parent container.
 * @param {number} y - The Y-coordinate of the drag event.
 * @returns {HTMLElement|null} The element to place after, or null.
 */
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.itinerary-item:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: -Number.MAX_VALUE }).element;
}

/**
 * Automatically adjusts the height of a textarea based on its content.
 * @param {HTMLTextAreaElement} textarea - The textarea element.
 */
function adjustTextareaHeight(textarea) {
    if (!textarea) return;
    textarea.style.height = 'auto'; // Reset height
    textarea.style.height = (textarea.scrollHeight) + 'px'; // Set to scroll height
}

// Clear Plan button functionality
if (clearPlanBtn && itineraryDropzone) {
    clearPlanBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your entire plan? This action cannot be undone.')) {
            itineraryDropzone.innerHTML = ITINERARY_PLACEHOLDER_HTML;
            saveCurrentItinerary(); // Clear saved plan
            showToast('Trip plan cleared!', 'success');
        }
    });
}

// --- Generate Plan Button (Modal Display) ---
const planModal = getElementByIdSafe('plan-modal');
const modalPlanContent = getElementByIdSafe('modal-plan-content');

if (generatePlanBtn && itineraryDropzone && planModal && modalPlanContent) {
    generatePlanBtn.addEventListener('click', () => {
        const itineraryItems = Array.from(itineraryDropzone.querySelectorAll('.itinerary-item'));
        modalPlanContent.innerHTML = ''; // Clear previous content

        if (itineraryItems.length === 0) {
            modalPlanContent.innerHTML = '<p class="info-message"><i class="fas fa-info-circle"></i> Your itinerary is empty! Please drag some destinations to plan your trip.</p>';
        } else {
            const planList = document.createElement('ul');
            planList.classList.add('generated-plan-list');
            let hasMissingDates = false;

            itineraryItems.forEach(item => {
                const name = item.dataset.name;
                const date = item.dataset.date;
                const notes = item.dataset.notes;

                const listItem = document.createElement('li');
                listItem.innerHTML = `<strong>${name}</strong>`;
                if (date) {
                    try {
                        const formattedDate = new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                        listItem.innerHTML += ` (Date: ${formattedDate})`;
                    } catch (e) {
                        console.error("Invalid date format in itinerary item:", date, e);
                        listItem.innerHTML += ' (Date: <span class="warning-text">Invalid Date</span>)';
                        hasMissingDates = true;
                    }
                } else {
                    listItem.innerHTML += ' (Date: <span class="warning-text">Not set</span>)';
                    hasMissingDates = true;
                }
                if (notes) {
                    listItem.innerHTML += `<br><small>Notes: ${notes}</small>`;
                }
                planList.appendChild(listItem);
            });
            modalPlanContent.appendChild(planList);

            if (hasMissingDates) {
                const dateReminder = document.createElement('p');
                dateReminder.classList.add('warning-message');
                dateReminder.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Some destinations are missing dates or have invalid dates. Consider adding/fixing them for a complete plan!';
                modalPlanContent.prepend(dateReminder);
            }
        }
        openModal(planModal.id);
    });
}


// --- Save/Load Plan Functionality (LocalStorage) ---

/**
 * Saves the current itinerary to localStorage.
 */
function saveCurrentItinerary() {
    if (!itineraryDropzone) {
        console.error("Cannot save itinerary, dropzone element not found.");
        return;
    }
    const itineraryItems = Array.from(itineraryDropzone.querySelectorAll('.itinerary-item')).map(item => ({
        name: item.dataset.name,
        image: item.dataset.image,
        date: item.dataset.date,
        notes: item.dataset.notes
    }));
    try {
        localStorage.setItem(CURRENT_ITINERARY_STORAGE_KEY, JSON.stringify(itineraryItems));
        // console.log('Current itinerary saved to localStorage.'); // Kept for debugging, can be removed
    } catch (e) {
        console.error("Error saving current itinerary to localStorage:", e);
        showToast("Failed to save current plan automatically. localStorage might be full.", "error");
    }
}

/**
 * Loads an itinerary into the dropzone.
 * @param {Array<Object>} [planToLoad=null] - An array of plan items to load, or loads from current storage if null.
 */
function loadCurrentItinerary(planToLoad = null) {
    if (!itineraryDropzone) {
        console.error("Cannot load itinerary, dropzone element not found.");
        return;
    }

    itineraryDropzone.innerHTML = ITINERARY_PLACEHOLDER_HTML; // Clear first
    let savedItems = [];

    if (planToLoad) {
        savedItems = planToLoad;
        // showToast('Plan loaded successfully!', 'success'); // Toast is handled when loading from modal
    } else {
        try {
            const savedItinerary = localStorage.getItem(CURRENT_ITINERARY_STORAGE_KEY);
            if (savedItinerary) {
                savedItems = JSON.parse(savedItinerary);
            }
        } catch (e) {
            console.error("Error loading current itinerary from localStorage:", e);
            showToast("Failed to load your last active plan. Data might be corrupted. Cleared corrupted data.", "error");
            localStorage.removeItem(CURRENT_ITINERARY_STORAGE_KEY); // Clear corrupted data
            savedItems = []; // Reset savedItems to prevent attempting to use corrupted data
        }
    }

    if (savedItems.length > 0) {
        itineraryDropzone.innerHTML = ''; // Clear placeholder if items exist
        savedItems.forEach(item => {
            addItineraryItem(item.name, item.image, item.date, item.notes);
        });
    }
    // console.log('Itinerary loaded from localStorage.'); // Kept for debugging, can be removed
}

if (savePlanBtn && itineraryDropzone) {
    savePlanBtn.addEventListener('click', () => {
        const itineraryItems = Array.from(itineraryDropzone.querySelectorAll('.itinerary-item')).map(item => ({
            name: item.dataset.name,
            image: item.dataset.image,
            date: item.dataset.date,
            notes: item.dataset.notes
        }));

        if (itineraryItems.length === 0) {
            showToast('Your itinerary is empty, nothing to save!', 'info');
            return;
        }

        const planName = prompt('Enter a name for your plan:');
        if (planName && planName.trim() !== '') {
            const trimmedPlanName = planName.trim();
            try {
                let savedPlans = JSON.parse(localStorage.getItem(SAVED_PLANS_STORAGE_KEY) || '{}');
                // Check for duplicate names (case-insensitive)
                const existingPlanNames = Object.keys(savedPlans).map(key => key.toLowerCase());
                if (existingPlanNames.includes(trimmedPlanName.toLowerCase())) {
                    if (!confirm(`A plan named "${trimmedPlanName}" already exists. Do you want to overwrite it?`)) {
                        showToast("Saving cancelled.", "info");
                        return;
                    }
                }
                savedPlans[trimmedPlanName] = itineraryItems;
                localStorage.setItem(SAVED_PLANS_STORAGE_KEY, JSON.stringify(savedPlans));
                showToast(`Plan "${trimmedPlanName}" saved!`, 'success');
            } catch (e) {
                console.error("Error saving plan:", e);
                showToast("Failed to save plan. localStorage might be full.", "error");
            }
        } else if (planName !== null) { // If prompt was shown but user entered empty string
            showToast('Plan name cannot be empty. Saving cancelled.', 'info');
        } else { // If user clicked cancel on prompt
            showToast('Plan not saved.', 'info');
        }
    });
}

const loadModal = getElementByIdSafe('load-modal');
const savedPlansSelect = getElementByIdSafe('saved-plans-select');
const loadSelectedPlanBtn = getElementByIdSafe('load-selected-plan-btn');
const deleteSelectedPlanBtn = getElementByIdSafe('delete-selected-plan-btn');

if (loadPlanBtn && loadModal && savedPlansSelect && loadSelectedPlanBtn && deleteSelectedPlanBtn) {
    loadPlanBtn.addEventListener('click', () => {
        let savedPlans = {};
        try {
            savedPlans = JSON.parse(localStorage.getItem(SAVED_PLANS_STORAGE_KEY) || '{}');
        } catch (e) {
            console.error("Error loading saved plans from localStorage:", e);
            showToast("Failed to retrieve saved plans. Data might be corrupted. Cleared corrupted data.", "error");
            localStorage.removeItem(SAVED_PLANS_STORAGE_KEY); // Clear potentially corrupted data
            savedPlans = {}; // Reset savedPlans
        }

        savedPlansSelect.innerHTML = '<option value="">Select a plan</option>';
        const planNames = Object.keys(savedPlans).sort((a, b) => a.localeCompare(b));

        if (planNames.length === 0) {
            savedPlansSelect.innerHTML = '<option value="">No saved plans</option>';
            loadSelectedPlanBtn.disabled = true;
            deleteSelectedPlanBtn.disabled = true;
        } else {
            planNames.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                savedPlansSelect.appendChild(option);
            });
            loadSelectedPlanBtn.disabled = false;
            deleteSelectedPlanBtn.disabled = false;
        }
        openModal(loadModal.id);
    });

    loadSelectedPlanBtn.addEventListener('click', () => {
        const selectedPlanName = savedPlansSelect.value;
        if (selectedPlanName) {
            try {
                const savedPlans = JSON.parse(localStorage.getItem(SAVED_PLANS_STORAGE_KEY));
                if (savedPlans && savedPlans[selectedPlanName]) {
                    loadCurrentItinerary(savedPlans[selectedPlanName]);
                    closeModal(loadModal.id);
                    showToast(`Plan "${selectedPlanName}" loaded!`, 'success');
                } else {
                    showToast("Selected plan not found.", "error");
                }
            } catch (e) {
                console.error("Error loading selected plan:", e);
                showToast("Failed to load the selected plan.", "error");
            }
        } else {
            showToast('Please select a plan to load.', 'error');
        }
    });

    deleteSelectedPlanBtn.addEventListener('click', () => {
        const selectedPlanName = savedPlansSelect.value;
        if (selectedPlanName && confirm(`Are you sure you want to delete "${selectedPlanName}"? This cannot be undone.`)) {
            try {
                let savedPlans = JSON.parse(localStorage.getItem(SAVED_PLANS_STORAGE_KEY) || '{}');
                delete savedPlans[selectedPlanName];
                localStorage.setItem(SAVED_PLANS_STORAGE_KEY, JSON.stringify(savedPlans));
                showToast(`Plan "${selectedPlanName}" deleted.`, 'success');
                // Re-populate select after deletion
                // Using a direct call to the event listener to re-render the modal content
                // and update the select options with disabled states.
                loadPlanBtn.click();
            } catch (e) {
                console.error("Error deleting plan:", e);
                showToast("Failed to delete plan.", "error");
            }
        } else if (!selectedPlanName) {
            showToast('Please select a plan to delete.', 'error');
        }
    });
}

// --- Modals Functionality ---
const modals = document.querySelectorAll('.modal');
const allCloseButtons = document.querySelectorAll('.modal .close-button, .modal .modal-close-btn');

/**
 * Opens a modal.
 * @param {string} id - The ID of the modal to open.
 */
function openModal(id) {
    const modal = getElementByIdSafe(id);
    if (modal) {
        modal.style.display = 'flex'; // Make it visible for transition
        document.body.classList.add('modal-open');
        setTimeout(() => modal.classList.add('is-open'), 10);
        modal.focus(); // Focus the modal for accessibility
        modal.setAttribute('aria-hidden', 'false'); // Announce to screen readers
    }
}

/**
 * Closes a modal.
 * @param {string} id - The ID of the modal to close.
 */
function closeModal(id) {
    const modal = getElementByIdSafe(id);
    if (modal) {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true'); // Announce to screen readers
        modal.addEventListener('transitionend', () => {
            modal.style.display = 'none'; // Hide after transition
            // Remove body scroll lock only if no other modals are open
            if (!document.querySelector('.modal.is-open')) {
                document.body.classList.remove('modal-open');
            }
        }, { once: true });
    }
}

/**
 * Displays a toast notification.
 * @param {string} message - The message to display.
 * @param {string} [type='info'] - The type of toast (success, error, info).
 * @param {number} [duration=3000] - How long the toast is visible in ms.
 */
function showToast(message, type = 'info', duration = 3000) {
    const toastContainer = getElementByIdSafe('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.classList.add('toast');
    if (type === 'success') {
        toast.classList.add('success');
    } else if (type === 'error') {
        toast.classList.add('error');
    }
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        // Remove the toast from the DOM after the fade-out animation completes
        toast.addEventListener('animationend', () => {
            toast.remove();
        }, { once: true });
    }, duration);
}

allCloseButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        if (modal) {
            closeModal(modal.id);
        }
    });
});

window.addEventListener('click', (e) => {
    modals.forEach(modal => {
        // Check if the click occurred directly on the modal backdrop, not inside the modal content
        if (e.target === modal && modal.classList.contains('is-open')) {
            closeModal(modal.id);
        }
    });
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Find the topmost open modal and close it
        const openModals = Array.from(document.querySelectorAll('.modal.is-open')).reverse();
        if (openModals.length > 0) {
            closeModal(openModals[0].id);
        }
    }
});

// --- Footer Year Update ---
const currentYearSpan = getElementByIdSafe('current-year');
if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
}

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