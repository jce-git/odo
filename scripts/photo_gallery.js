// Photo Gallery Modal Script
// This script provides functionality for a modal photo gallery, including keyboard navigation, swipe gesture support, accessibility feedback, and event handling for image navigation.

// Initialize the current image index to 0
let currentImageIndex = 0;

// Select the photo gallery element
const gallery = document.querySelector('.photo-gallery');

// Select all images within the photo gallery
const images = gallery.querySelectorAll('img');

/**
 * Sets the display style of the modal element.
 * @param {string} displayStyle - The CSS display value (e.g., 'flex', 'none').
 */
function setModalDisplay(displayStyle) {
  document.getElementById("myModal").style.display = displayStyle;
}

/**
 * Opens the modal and displays the clicked image.
 * Adds swipe listeners for gesture navigation.
 * @param {HTMLImageElement} img - The image element that was clicked.
 */
function openModal(img) {
  originalOpenModal(img);
  addSwipeListeners();
}

/**
 * The original function to open the modal and set the image preview.
 * @param {HTMLImageElement} img - The image element to display in the modal.
 */
const originalOpenModal = function(img) {
  setModalDisplay("flex"); // Set the modal display to flex
  document.getElementById("image_preview").src = img.src; // Set the source of the image preview to the clicked image's source
  currentImageIndex = Array.from(images).indexOf(img); // Get the index of the clicked image
};

/**
 * The original function to close the modal.
 */
const originalCloseModal = function() {
  setModalDisplay("none"); // Set the modal display to none
};

/**
 * Closes the modal and removes swipe listeners.
 */
function closeModal() {
  removeSwipeListeners();
  originalCloseModal();
}

/**
 * Shows the image at the specified index in the modal preview.
 * Updates the current image index.
 * @param {number} index - The index of the image to display.
 */
function showImage(index) {
  if (index >= 0 && index < images.length) { // Check if the index is within bounds
    document.getElementById("image_preview").src = images[index].src; // Set the source of the image preview to the image at the specified index
    currentImageIndex = index; // Update the current image index
  }
}

/**
 * Handles keyboard navigation for the modal.
 * Supports Escape (close), ArrowLeft/ArrowRight (prev/next), Home/End (first/last image).
 */
document.addEventListener("keydown", function(event) {
  if (event.key === "Escape") { // If the Escape key is pressed
    closeModal(); // Close the modal
  } else if (event.key === "ArrowLeft") { // If the Left arrow key is pressed
    showImage(currentImageIndex - 1); // Show the previous image
  } else if (event.key === "ArrowRight") { // If the Right arrow key is pressed
    showImage(currentImageIndex + 1); // Show the next image
  } else if (event.key === "Home") { // If the Home key is pressed
    showImage(0); // Show the first image
  } else if (event.key === "End") { // If the End key is pressed
    showImage(images.length - 1); // Show the last image
  }
});

/**
 * Event listener for the previous image button.
 * Navigates to the previous image and prevents modal closure.
 */
document.getElementById("previous_image_button").addEventListener("click", function(event) {
  event.stopPropagation(); // Prevent the modal from closing
  showImage(currentImageIndex - 1); // Show the previous image
});

/**
 * Event listener for the next image button.
 * Navigates to the next image and prevents modal closure.
 */
document.getElementById("next_image_button").addEventListener("click", function(event) {
  event.stopPropagation(); // Prevent the modal from closing
  showImage(currentImageIndex + 1); // Show the next image
});

// ================= Swipe Gesture Support =================

/**
 * Minimum horizontal distance (in pixels) required to trigger a swipe.
 * @constant {number}
 */
const SWIPE_THRESHOLD = 50; // px

// Variables for swipe gesture tracking
let pointerStartX = 0;
let pointerStartY = 0;
let pointerEndX = 0;
let pointerEndY = 0;
let swipeHandled = false;
let activePointerId = null;
let ariaLiveRegion = null;

/**
 * Checks if the pointer event type is supported for swipe gestures.
 * @param {PointerEvent} event - The pointer event to check.
 * @returns {boolean} True if supported, false otherwise.
 */
function isPointerTypeSupported(event) {
  return event.pointerType === "touch" || event.pointerType === "pen" || event.pointerType === "mouse";
}

/**
 * Checks if the event target is an interactive element (e.g., button, link, input).
 * @param {EventTarget} target - The event target.
 * @returns {boolean} True if interactive, false otherwise.
 */
function isInteractiveElement(target) {
  return target.closest('button, a, input, textarea, select, [tabindex]');
}

/**
 * Adds swipe gesture event listeners to the modal for navigation.
 * Also creates an ARIA live region for accessibility feedback if not present.
 */
function addSwipeListeners() {
  const modal = document.getElementById("myModal");
  if (!modal) return;
  // Remove previous listeners if any
  removeSwipeListeners();
  modal.addEventListener("pointerdown", handlePointerDown);
  modal.addEventListener("pointerup", handlePointerUp);
  modal.addEventListener("pointermove", handlePointerMove, { passive: false });
  modal.addEventListener("pointercancel", handlePointerCancel);
  // Add ARIA live region for feedback if not present
  if (!ariaLiveRegion) {
    ariaLiveRegion = document.createElement('div');
    ariaLiveRegion.setAttribute('aria-live', 'polite');
    ariaLiveRegion.setAttribute('role', 'status');
    ariaLiveRegion.style.position = 'absolute';
    ariaLiveRegion.style.left = '-9999px';
    document.body.appendChild(ariaLiveRegion);
  }
}

/**
 * Removes swipe gesture event listeners from the modal.
 */
function removeSwipeListeners() {
  const modal = document.getElementById("myModal");
  if (!modal) return;
  modal.removeEventListener("pointerdown", handlePointerDown);
  modal.removeEventListener("pointerup", handlePointerUp);
  modal.removeEventListener("pointermove", handlePointerMove);
  modal.removeEventListener("pointercancel", handlePointerCancel);
}

/**
 * Handles the pointerdown event to start swipe tracking.
 * Ignores events on interactive elements.
 * @param {PointerEvent} event - The pointerdown event.
 */
function handlePointerDown(event) {
  if (!isPointerTypeSupported(event)) return;
  if (isInteractiveElement(event.target)) return;
  pointerStartX = event.clientX;
  pointerStartY = event.clientY;
  swipeHandled = false;
  activePointerId = event.pointerId;
}

/**
 * Handles the pointermove event to optionally prevent vertical scrolling during a horizontal swipe.
 * @param {PointerEvent} event - The pointermove event.
 */
function handlePointerMove(event) {
  if (swipeHandled) return;
  if (!isPointerTypeSupported(event)) return;
  if (event.pointerId !== activePointerId) return;
  // Prevent vertical scroll if horizontal swipe is detected
  const diffX = event.clientX - pointerStartX;
  const diffY = event.clientY - pointerStartY;
  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > SWIPE_THRESHOLD / 2) {
    event.preventDefault();
  }
}

/**
 * Handles the pointerup event to detect swipe gestures and navigate images.
 * Provides ARIA feedback for accessibility and edge cases.
 * @param {PointerEvent} event - The pointerup event.
 */
function handlePointerUp(event) {
  if (swipeHandled) return;
  if (!isPointerTypeSupported(event)) return;
  if (event.pointerId !== activePointerId) return;
  pointerEndX = event.clientX;
  pointerEndY = event.clientY;
  const diffX = pointerEndX - pointerStartX;
  const diffY = pointerEndY - pointerStartY;
  if (Math.abs(diffX) > SWIPE_THRESHOLD && Math.abs(diffX) > Math.abs(diffY)) { // Horizontal swipe only
    swipeHandled = true;
    if (diffX < 0) {
      // Swipe left: show next image
      if (currentImageIndex < images.length - 1) {
        showImage(currentImageIndex + 1);
        announceToAriaLive('Next image');
      } else {
        announceToAriaLive('This is the last image.');
      }
    } else {
      // Swipe right: show previous image
      if (currentImageIndex > 0) {
        showImage(currentImageIndex - 1);
        announceToAriaLive('Previous image');
      } else {
        announceToAriaLive('This is the first image.');
      }
    }
  }
  activePointerId = null;
}

/**
 * Handles the pointercancel event to reset swipe tracking.
 * @param {PointerEvent} event - The pointercancel event.
 */
function handlePointerCancel(event) {
  if (!isPointerTypeSupported(event)) return;
  if (event.pointerId !== activePointerId) return;
  activePointerId = null;
  swipeHandled = false;
}

/**
 * Announces a message to the ARIA live region for screen readers.
 * @param {string} message - The message to announce.
 */
function announceToAriaLive(message) {
  if (ariaLiveRegion) {
    ariaLiveRegion.textContent = message;
  }
}

/**
 * Adds swipe listeners on DOMContentLoaded for initial setup.
 */
document.addEventListener("DOMContentLoaded", addSwipeListeners);

// Event delegation for image clicks
// (Assuming there is more code here for handling image clicks)