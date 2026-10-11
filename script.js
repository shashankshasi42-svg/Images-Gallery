const galleryCards = [
  ...document.querySelectorAll(".gallery-card")
];

const filterButtons = [
  ...document.querySelectorAll(".filter-button")
];

const galleryCount = document.getElementById("galleryCount");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");

const closeButton = document.getElementById("closeLightbox");
const previousButton = document.getElementById("previousImage");
const nextButton = document.getElementById("nextImage");

let visibleCards = [...galleryCards];
let currentIndex = 0;
let lastFocusedElement = null;

// Filter gallery images by category
function filterGallery(category) {
  filterButtons.forEach((button) => {
    const active = button.dataset.filter === category;

    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  galleryCards.forEach((card) => {
    const show =
      category === "all" ||
      card.dataset.category === category;

    card.hidden = !show;
  });

  visibleCards = galleryCards.filter((card) => !card.hidden);

  galleryCount.textContent =
    `Showing ${visibleCards.length} images`;
}

// Display the selected image in the lightbox
function updateLightbox(index) {
  if (visibleCards.length === 0) return;

  // Move to the beginning or end when necessary
  currentIndex =
    (index + visibleCards.length) % visibleCards.length;

  const card = visibleCards[currentIndex];
  const image = card.querySelector("img");

  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = card.dataset.title;
}

// Open the image viewer
function openLightbox(card) {
  lastFocusedElement = document.activeElement;
  currentIndex = visibleCards.indexOf(card);

  updateLightbox(currentIndex);

  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  closeButton.focus();
}

// Close the image viewer
function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

// Category filter buttons
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterGallery(button.dataset.filter);
  });
});

// Click any image to enlarge it
galleryCards.forEach((card) => {
  card.addEventListener("click", () => {
    openLightbox(card);
  });
});

// Previous and next image buttons
previousButton.addEventListener("click", () => {
  updateLightbox(currentIndex - 1);
});

nextButton.addEventListener("click", () => {
  updateLightbox(currentIndex + 1);
});

// Close button
closeButton.addEventListener("click", closeLightbox);

// Close when the dark background is clicked
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

// Keyboard navigation
document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("open")) return;

  if (event.key === "Escape") {
    closeLightbox();
  } else if (event.key === "ArrowLeft") {
    updateLightbox(currentIndex - 1);
  } else if (event.key === "ArrowRight") {
    updateLightbox(currentIndex + 1);
  }
});

// Show initial image count
galleryCount.textContent =
  `Showing ${visibleCards.length} images`;