const radios = document.querySelectorAll('.image-radio');
const mainPrevBtn = document.querySelector('#slider-prev');
const mainNextBtn = document.querySelector('#slider-next');
const thumbGallery = document.getElementById('small-images');
const thumbContainer = document.querySelector('.small-image-scroll');
const thumbPrevBtn = document.getElementById('small-prev');
const thumbNextBtn = document.getElementById('small-next');

// Hide the native scrollbar since we control sliding via JS transform
if (thumbContainer) {
	thumbContainer.style.overflowX = 'hidden';
}

const totalImages = radios.length;
let currentThumbPosition = 0;
const thumbsVisible = 4;
const maxThumbPosition = Math.max(0, totalImages - thumbsVisible);

let currentImageIndex = 0;

function updateThumbGallery() {
	const item = thumbGallery.querySelector('.small-image-item');
	if (!item) return;

	const itemWidth = item.offsetWidth;
	const gap = parseFloat(window.getComputedStyle(thumbGallery).gap) || 12;
	const moveX = currentThumbPosition * (itemWidth + gap);

	thumbGallery.style.transform = `translateX(-${moveX}px)`;

	if (currentThumbPosition === 0) {
		thumbPrevBtn.classList.add('disabled');
	} else {
		thumbPrevBtn.classList.remove('disabled');
	}

	if (currentThumbPosition >= maxThumbPosition) {
		thumbNextBtn.classList.add('disabled');
	} else {
		thumbNextBtn.classList.remove('disabled');
	}
}

function updateMainImage(index) {
	if (index < 0) index = totalImages - 1;
	if (index >= totalImages) index = 0;

	currentImageIndex = index;
	radios[currentImageIndex].checked = true;

	if (currentImageIndex < currentThumbPosition || currentImageIndex >= currentThumbPosition + thumbsVisible) {
		currentThumbPosition = Math.floor(currentImageIndex / thumbsVisible) * thumbsVisible;
		if (currentThumbPosition > maxThumbPosition) {
			currentThumbPosition = maxThumbPosition;
		}
		updateThumbGallery();
	}
}

mainPrevBtn.addEventListener('click', (e) => {
	e.preventDefault();
	updateMainImage(currentImageIndex - 1);
});

mainNextBtn.addEventListener('click', (e) => {
	e.preventDefault();
	updateMainImage(currentImageIndex + 1);
});

thumbNextBtn.addEventListener('click', () => {
	if (currentThumbPosition < maxThumbPosition) {
		currentThumbPosition += thumbsVisible;
		if (currentThumbPosition > maxThumbPosition) {
			currentThumbPosition = maxThumbPosition;
		}
		updateThumbGallery();
	}
});

thumbPrevBtn.addEventListener('click', () => {
	if (currentThumbPosition > 0) {
		currentThumbPosition -= thumbsVisible;
		if (currentThumbPosition < 0) {
			currentThumbPosition = 0;
		}
		updateThumbGallery();
	}
});

radios.forEach((radio, index) => {
	radio.addEventListener('change', () => {
		if (radio.checked) {
			currentImageIndex = index;
		}
	});
});

window.addEventListener('resize', updateThumbGallery);

updateThumbGallery();

function initPhotoSwipe(startIndex) {
	const pswpElement = document.querySelectorAll('.pswp')[0];
	const mainImagesList = document.querySelectorAll('.big-images .big-image');

	const items = Array.from(mainImagesList).map(img => {
		const width = img.naturalWidth > 0 ? img.naturalWidth : 1200;
		const height = img.naturalHeight > 0 ? img.naturalHeight : 800;
		return {
			src: img.src,
			w: width,
			h: height,
			msrc: img.src
		};
	});

	const options = {
		index: startIndex,
		bgOpacity: 0.9,
		showHideOpacity: true,
		history: false,
		focus: false,
		shareEl: false
	};

	const gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
	gallery.init();
}

const allMainImages = document.querySelectorAll('.big-images .big-image');
allMainImages.forEach((img, idx) => {
	img.style.cursor = 'zoom-in';
	img.addEventListener('click', () => {
		initPhotoSwipe(idx);
	});
});

// Add click event to the zoom icon
const zoomBtn = document.querySelector('.zoom-btn');
if (zoomBtn) {
	zoomBtn.style.cursor = 'pointer';
	zoomBtn.addEventListener('click', () => {
		initPhotoSwipe(currentImageIndex);
	});
}
