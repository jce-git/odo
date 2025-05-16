// Initialize the current image index to 0
let currentImageIndex = 0;

// Select the photo gallery element
const gallery = document.querySelector('.photo-gallery');

// Select all images within the photo gallery
const images = gallery.querySelectorAll('img');

// Function to set the display style of the modal
function setModalDisplay(displayStyle) {
  document.getElementById("myModal").style.display = displayStyle;
}

// Function to open the modal and display the clicked image
function openModal(img) {
  originalOpenModal(img);
  addSwipeListeners();
}

// Save the original openModal function
const originalOpenModal = function(img) {
  setModalDisplay("flex"); // Set the modal display to flex
  document.getElementById("image_preview").src = img.src; // Set the source of the image preview to the clicked image's source
  currentImageIndex = Array.from(images).indexOf(img); // Get the index of the clicked image
};

// Function to close the modal
const originalCloseModal = function() {
  setModalDisplay("none"); // Set the modal display to none
};

function closeModal() {
  removeSwipeListeners();
  originalCloseModal();
}

// Function to show the image at the specified index
function showImage(index) {
  if (index >= 0 && index < images.length) { // Check if the index is within bounds
    document.getElementById("image_preview").src = images[index].src; // Set the source of the image preview to the image at the specified index
    currentImageIndex = index; // Update the current image index
  }
}

// Add event listener for Escape, Left, Right, Home, and End keys
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

// Add event listener for the previous image button
document.getElementById("previous_image_button").addEventListener("click", function(event) {
  event.stopPropagation(); // Prevent the modal from closing
  showImage(currentImageIndex - 1); // Show the previous image
});

// Add event listener for the next image button
document.getElementById("next_image_button").addEventListener("click", function(event) {
  event.stopPropagation(); // Prevent the modal from closing
  showImage(currentImageIndex + 1); // Show the next image
});

// Swipe gesture support for mobile and desktop devices
let pointerStartX = 0;
let pointerStartY = 0;
let pointerEndX = 0;
let pointerEndY = 0;
let swipeHandled = false;

function addSwipeListeners() {
  const modal = document.getElementById("myModal");
  if (!modal) return;
  // Remove previous listeners if any
  modal.removeEventListener("pointerdown", handlePointerDown);
  modal.removeEventListener("pointerup", handlePointerUp);
  modal.addEventListener("pointerdown", handlePointerDown);
  modal.addEventListener("pointerup", handlePointerUp);
}

function removeSwipeListeners() {
  const modal = document.getElementById("myModal");
  if (!modal) return;
  modal.removeEventListener("pointerdown", handlePointerDown);
  modal.removeEventListener("pointerup", handlePointerUp);
}

function handlePointerDown(event) {
  if (event.pointerType === "touch" || event.pointerType === "pen" || event.pointerType === "mouse") {
    pointerStartX = event.clientX;
    pointerStartY = event.clientY;
    swipeHandled = false;
  }
}

function handlePointerUp(event) {
  if (swipeHandled) return;
  if (event.pointerType === "touch" || event.pointerType === "pen" || event.pointerType === "mouse") {
    pointerEndX = event.clientX;
    pointerEndY = event.clientY;
    const diffX = pointerEndX - pointerStartX;
    const diffY = pointerEndY - pointerStartY;
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) { // Horizontal swipe only
      swipeHandled = true;
      if (diffX < 0) {
        // Swipe left: show next image
        showImage(currentImageIndex + 1);
      } else {
        // Swipe right: show previous image
        showImage(currentImageIndex - 1);
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", addSwipeListeners);

// Event delegation for image clicks
// (Assuming there is more code here for handling image clicks)