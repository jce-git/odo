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
  setModalDisplay("flex"); // Set the modal display to flex
  document.getElementById("image_preview").src = img.src; // Set the source of the image preview to the clicked image's source
  currentImageIndex = Array.from(images).indexOf(img); // Get the index of the clicked image
}

// Function to close the modal
function closeModal() {
  setModalDisplay("none"); // Set the modal display to none
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

// Swipe gesture support for mobile devices
let touchStartX = 0;
let touchEndX = 0;

const modal = document.getElementById("myModal");
if (modal) {
  modal.addEventListener("touchstart", function(event) {
    if (event.touches.length === 1) {
      touchStartX = event.touches[0].clientX;
    }
  });

  modal.addEventListener("touchend", function(event) {
    if (event.changedTouches.length === 1) {
      touchEndX = event.changedTouches[0].clientX;
      const diffX = touchEndX - touchStartX;
      if (Math.abs(diffX) > 50) { // Minimum swipe distance
        if (diffX < 0) {
          // Swipe left: show previous image
          showImage(currentImageIndex - 1);
        } else {
          // Swipe right: show next image
          showImage(currentImageIndex + 1);
        }
      }
    }
  });
}

// Event delegation for image clicks
// (Assuming there is more code here for handling image clicks)