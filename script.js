// ==========================================
// PIXORA - IMAGE SEARCH ENGINE
// WIKIMEDIA COMMONS API
// ==========================================

const API_URL = "https://login-system-xl4w.onrender.com/";

// DOM ELEMENTS
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

const imageGrid = document.getElementById("imageGrid");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const emptyState = document.getElementById("emptyState");
const resultCount = document.getElementById("resultCount");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxPhotographer =
    document.getElementById("lightboxPhotographer");

const closeLightbox = document.getElementById("closeLightbox");
const prevImage = document.getElementById("prevImage");
const nextImage = document.getElementById("nextImage");

// GLOBAL VARIABLES
let currentImages = [];
let currentImageIndex = 0;
let debounceTimer;
let searchController;


// ==========================================
// SEARCH IMAGES
// ==========================================

async function searchImages(query) {

    if (!query.trim()) {
        showError("Please enter a search keyword.");
        return;
    }

    if (searchController) {
        searchController.abort();
    }

    const controller = new AbortController();
    searchController = controller;

    showLoading(true);
    hideError();

    imageGrid.innerHTML = "";
    emptyState.classList.add("hidden");

    searchButton.disabled = true;

    try {

        const params = new URLSearchParams({
            q: query
        });

        const response = await fetch(
            `${API_URL}?${params}`,
            {
                method: "GET",
                signal: controller.signal
            }
        );

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const result = await response.json();

        if (controller !== searchController) return;

        if (!result.success) {
            throw new Error(result.message || "Image search failed");
        }

        currentImages = (result.data || []).filter(
            artwork => artwork.image_id
        );

        if (currentImages.length === 0) {

            emptyState.classList.remove("hidden");

            emptyState.innerHTML = `
                <h3>No Images Found 😕</h3>
                <p>Try another keyword to discover images.</p>
            `;

            resultCount.textContent = "0 results";

            return;
        }

        displayImages(currentImages);

        resultCount.textContent =
            `${currentImages.length} images found`;

    } catch (error) {

        if (error.name !== "AbortError") {

            console.error("Search Error:", error);

            showError(
                "Unable to load images. Please try again."
            );
        }

    } finally {

        if (controller === searchController) {

            showLoading(false);
            searchButton.disabled = false;

        }

    }

}


// ==========================================
// DISPLAY IMAGES
// ==========================================

function displayImages(images) {

    imageGrid.innerHTML = "";

    images.forEach((artwork, index) => {

        const card = document.createElement("div");
        card.className = "image-card";

        const image = document.createElement("img");

        // Wikimedia direct image URL
        image.src = artwork.image_id;

        image.alt = artwork.title || "Image";

        image.loading = "lazy";

        image.onerror = function () {

            console.error("Image failed to load:", artwork.image_id);

            card.style.display = "none";

        };

        const overlay = document.createElement("div");
        overlay.className = "image-overlay";

        const title = document.createElement("h3");

        title.textContent =
            artwork.title || "Untitled Image";

        const artist = document.createElement("p");

        artist.textContent =
            artwork.artist_title || "Unknown Artist";

        overlay.appendChild(title);
        overlay.appendChild(artist);

        card.appendChild(image);
        card.appendChild(overlay);

        card.addEventListener("click", () => {

            openLightbox(index);

        });

        imageGrid.appendChild(card);

    });

}


// ==========================================
// LOADING
// ==========================================

function showLoading(status) {

    loading.classList.toggle("hidden", !status);

}


// ==========================================
// ERROR MESSAGE
// ==========================================

function showError(message) {

    errorMessage.textContent = message;

    errorMessage.classList.remove("hidden");

}


function hideError() {

    errorMessage.classList.add("hidden");

    errorMessage.textContent = "";

}


// ==========================================
// SEARCH FORM
// ==========================================

searchForm.addEventListener("submit", (event) => {

    event.preventDefault();

    clearTimeout(debounceTimer);

    searchImages(searchInput.value.trim());

});


// ==========================================
// POPULAR SEARCH TAGS
// ==========================================

const searchTags = document.querySelectorAll(".search-tag");

searchTags.forEach((tag) => {

    tag.addEventListener("click", () => {

        const query = tag.dataset.query;

        searchInput.value = query;

        clearTimeout(debounceTimer);

        searchImages(query);

    });

});


// ==========================================
// DEBOUNCED SEARCH
// ==========================================

searchInput.addEventListener("input", () => {

    clearTimeout(debounceTimer);

    const query = searchInput.value.trim();

    if (query.length < 3) return;

    debounceTimer = setTimeout(() => {

        searchImages(query);

    }, 600);

});


// ==========================================
// OPEN LIGHTBOX
// ==========================================

function openLightbox(index) {

    currentImageIndex = index;

    const artwork = currentImages[currentImageIndex];

    if (!artwork) return;

    // Use original Wikimedia image URL
    lightboxImage.src =
        artwork.original_url || artwork.image_id;

    lightboxImage.alt =
        artwork.title || "Image Preview";

    lightboxTitle.textContent =
        artwork.title || "Untitled Image";

    lightboxPhotographer.textContent =
        `Artist: ${artwork.artist_title || "Unknown Artist"}`;

    lightbox.classList.remove("hidden");

    document.body.style.overflow = "hidden";

}


// ==========================================
// CLOSE LIGHTBOX
// ==========================================

function closeImagePreview() {

    lightbox.classList.add("hidden");

    lightboxImage.src = "";

    document.body.style.overflow = "";

}


closeLightbox.addEventListener(
    "click",
    closeImagePreview
);


// ==========================================
// NEXT IMAGE
// ==========================================

function showNextImage() {

    if (currentImages.length === 0) return;

    currentImageIndex =
        (currentImageIndex + 1) % currentImages.length;

    openLightbox(currentImageIndex);

}


nextImage.addEventListener("click", showNextImage);


// ==========================================
// PREVIOUS IMAGE
// ==========================================

function showPreviousImage() {

    if (currentImages.length === 0) return;

    currentImageIndex =
        (currentImageIndex - 1 + currentImages.length)
        % currentImages.length;

    openLightbox(currentImageIndex);

}


prevImage.addEventListener("click", showPreviousImage);


// ==========================================
// KEYBOARD CONTROLS
// ==========================================

document.addEventListener("keydown", (event) => {

    if (lightbox.classList.contains("hidden")) return;

    if (event.key === "Escape") {
        closeImagePreview();
    }

    if (event.key === "ArrowRight") {
        showNextImage();
    }

    if (event.key === "ArrowLeft") {
        showPreviousImage();
    }

});


// ==========================================
// CLOSE ON BACKGROUND CLICK
// ==========================================

lightbox.addEventListener("click", (event) => {

    if (event.target === lightbox) {

        closeImagePreview();

    }

});


// ==========================================
// INITIAL STATE
// ==========================================

emptyState.classList.remove("hidden");

console.log("Pixora Image Search Engine Ready! 🚀");