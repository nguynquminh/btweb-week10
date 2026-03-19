const radios = document.querySelectorAll('.gallery-radio');
const mainPrevBtn = document.querySelector('#prev-btn'); // Khớp với HTML
const mainNextBtn = document.querySelector('#next-btn'); // Khớp với HTML
const thumbGallery = document.getElementById('thumb-gallery');
const thumbPrevBtn = document.getElementById('thumb-prev');
const thumbNextBtn = document.getElementById('thumb-next');

const totalImages = radios.length;
let currentThumbPosition = 0;
const thumbsVisible = 4;
const maxThumbPosition = totalImages - thumbsVisible;

// ─── Update Main Image Navigation Buttons ─────────────────────
function updateMainNavButtons() {
	const currentIndex = Array.from(radios).findIndex(r => r.checked);

	// Calculate previous index (loop to end if at start)
	const prevIndex = currentIndex === 0 ? totalImages - 1 : currentIndex - 1;
	mainPrevBtn.setAttribute('for', `img${prevIndex + 1}`);

	// Calculate next index (loop to start if at end)
	const nextIndex = currentIndex === totalImages - 1 ? 0 : currentIndex + 1;
	mainNextBtn.setAttribute('for', `img${nextIndex + 1}`);
}

// ─── Update Thumbnail Navigation State ────────────────────────
function updateThumbNavState() {
	// Disable prev button if at start
	thumbPrevBtn.classList.toggle('disabled', currentThumbPosition === 0);

	// Disable next button if at end
	thumbNextBtn.classList.toggle('disabled', currentThumbPosition >= maxThumbPosition);
}

// ─── Scroll Thumbnails ─────────────────────────────────────────
function scrollThumbs(direction) {
	if (direction === 'prev' && currentThumbPosition > 0) {
		currentThumbPosition--;
	} else if (direction === 'next' && currentThumbPosition < maxThumbPosition) {
		currentThumbPosition++;
	}

	// Calculate offset based on thumbnail width and gap
	const thumbWidth = thumbGallery.children[0].offsetWidth;
	const gap = 12; // Must match CSS gap value
	const offset = -(currentThumbPosition * (thumbWidth + gap));

	// Apply transform
	thumbGallery.style.transform = `translateX(${offset}px)`;

	// Update button states
	updateThumbNavState();
}

// ─── Event Listeners ───────────────────────────────────────────

// Thumbnail navigation clicks
thumbPrevBtn.addEventListener('click', () => scrollThumbs('prev'));
thumbNextBtn.addEventListener('click', () => scrollThumbs('next'));

// Update main nav buttons when image changes
radios.forEach(radio => {
	radio.addEventListener('change', updateMainNavButtons);
});

// ─── Initialize on Page Load ───────────────────────────────────
updateMainNavButtons();
updateThumbNavState();