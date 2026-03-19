// ════════════════════════════════════════════════════════════
// PRODUCT GALLERY - COMPLETE FUNCTIONALITY
// Navigation + Thumbnail Scroll + Zoom Lightbox
// ════════════════════════════════════════════════════════════

(function() {
    'use strict';

    // ─── GET ELEMENTS ───────────────────────────────────────
    const radios = document.querySelectorAll('.gallery-radio');
    const mainPrevBtn = document.querySelector('#prev-btn');
    const mainNextBtn = document.querySelector('#next-btn');
    const thumbGallery = document.getElementById('thumb-gallery');
    const thumbPrevBtn = document.getElementById('thumb-prev');
    const thumbNextBtn = document.getElementById('thumb-next');
    const zoomIcon = document.querySelector('.zoom-icon');
    
    const totalImages = radios.length;
    let currentThumbPosition = 0;
    const thumbsVisible = 4;
    const maxThumbPosition = Math.max(0, totalImages - thumbsVisible);

    // ─── UPDATE MAIN NAVIGATION BUTTONS ─────────────────────
    function updateMainNavButtons() {
        const currentIndex = Array.from(radios).findIndex(r => r.checked);
        
        // Previous button
        const prevIndex = currentIndex === 0 ? totalImages - 1 : currentIndex - 1;
        mainPrevBtn.setAttribute('for', `img${prevIndex + 1}`);
        
        // Next button
        const nextIndex = currentIndex === totalImages - 1 ? 0 : currentIndex + 1;
        mainNextBtn.setAttribute('for', `img${nextIndex + 1}`);
    }

    // ─── UPDATE THUMBNAIL NAVIGATION STATE ──────────────────
    function updateThumbNavState() {
        if (thumbPrevBtn && thumbNextBtn) {
            thumbPrevBtn.classList.toggle('disabled', currentThumbPosition === 0);
            thumbNextBtn.classList.toggle('disabled', currentThumbPosition >= maxThumbPosition);
        }
    }

    // ─── SCROLL THUMBNAILS ──────────────────────────────────
    function scrollThumbs(direction) {
        if (!thumbGallery) return;
        
        if (direction === 'prev' && currentThumbPosition > 0) {
            currentThumbPosition--;
        } else if (direction === 'next' && currentThumbPosition < maxThumbPosition) {
            currentThumbPosition++;
        }
        
        const thumbWidth = thumbGallery.children[0].offsetWidth;
        const gap = 12;
        const offset = -(currentThumbPosition * (thumbWidth + gap));
        
        thumbGallery.style.transform = `translateX(${offset}px)`;
        updateThumbNavState();
    }

    // ─── AUTO SCROLL TO ACTIVE THUMBNAIL ────────────────────
    function autoScrollToActiveThumbnail() {
        if (!thumbGallery) return;
        
        const currentIndex = Array.from(radios).findIndex(r => r.checked);
        
        // Calculate needed scroll position
        if (currentIndex < currentThumbPosition) {
            currentThumbPosition = currentIndex;
        } else if (currentIndex >= currentThumbPosition + thumbsVisible) {
            currentThumbPosition = currentIndex - thumbsVisible + 1;
        }
        
        // Limit position
        currentThumbPosition = Math.max(0, Math.min(currentThumbPosition, maxThumbPosition));
        
        const thumbWidth = thumbGallery.children[0].offsetWidth;
        const gap = 12;
        const offset = -(currentThumbPosition * (thumbWidth + gap));
        
        thumbGallery.style.transform = `translateX(${offset}px)`;
        updateThumbNavState();
    }

    // ════════════════════════════════════════════════════════
    // ZOOM LIGHTBOX FUNCTIONALITY
    // ════════════════════════════════════════════════════════

    // ─── CREATE LIGHTBOX ELEMENTS ───────────────────────────
    function createLightbox() {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-overlay"></div>
            <div class="lightbox-content">
                <button class="lightbox-close" aria-label="Close">
                    <i class="bi bi-x-lg"></i>
                </button>
                <button class="lightbox-prev" aria-label="Previous">
                    <i class="bi bi-chevron-left"></i>
                </button>
                <button class="lightbox-next" aria-label="Next">
                    <i class="bi bi-chevron-right"></i>
                </button>
                <div class="lightbox-image-container">
                    <img class="lightbox-image" src="" alt="">
                </div>
                <div class="lightbox-counter">
                    <span class="lightbox-current">1</span> / <span class="lightbox-total">${totalImages}</span>
                </div>
            </div>
        `;
        document.body.appendChild(lightbox);
        return lightbox;
    }

    // ─── OPEN LIGHTBOX ──────────────────────────────────────
    function openLightbox() {
        let lightbox = document.querySelector('.lightbox');
        if (!lightbox) {
            lightbox = createLightbox();
            setupLightboxEvents(lightbox);
        }

        const currentIndex = Array.from(radios).findIndex(r => r.checked);
        const currentImage = document.querySelector(`.main-image-${currentIndex + 1}`);
        
        if (currentImage && currentImage.src) {
            const lightboxImg = lightbox.querySelector('.lightbox-image');
            const lightboxCurrent = lightbox.querySelector('.lightbox-current');
            
            lightboxImg.src = currentImage.src;
            lightboxImg.alt = currentImage.alt;
            lightboxCurrent.textContent = currentIndex + 1;
            
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    // ─── CLOSE LIGHTBOX ─────────────────────────────────────
    function closeLightbox() {
        const lightbox = document.querySelector('.lightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // ─── NAVIGATE IN LIGHTBOX ───────────────────────────────
    function navigateLightbox(direction) {
        const currentIndex = Array.from(radios).findIndex(r => r.checked);
        let newIndex;

        if (direction === 'prev') {
            newIndex = currentIndex === 0 ? totalImages - 1 : currentIndex - 1;
        } else {
            newIndex = currentIndex === totalImages - 1 ? 0 : currentIndex + 1;
        }

        // Update radio
        radios[newIndex].checked = true;
        updateMainNavButtons();
        autoScrollToActiveThumbnail();

        // Update lightbox image
        const newImage = document.querySelector(`.main-image-${newIndex + 1}`);
        const lightbox = document.querySelector('.lightbox');
        const lightboxImg = lightbox.querySelector('.lightbox-image');
        const lightboxCurrent = lightbox.querySelector('.lightbox-current');

        lightboxImg.src = newImage.src;
        lightboxImg.alt = newImage.alt;
        lightboxCurrent.textContent = newIndex + 1;
    }

    // ─── SETUP LIGHTBOX EVENTS ──────────────────────────────
    function setupLightboxEvents(lightbox) {
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const overlay = lightbox.querySelector('.lightbox-overlay');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');

        // Close events
        closeBtn.addEventListener('click', closeLightbox);
        overlay.addEventListener('click', closeLightbox);

        // Navigation events
        prevBtn.addEventListener('click', () => navigateLightbox('prev'));
        nextBtn.addEventListener('click', () => navigateLightbox('next'));

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (!lightbox.classList.contains('active')) return;

            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLightbox('prev');
            if (e.key === 'ArrowRight') navigateLightbox('next');
        });
    }

    // ════════════════════════════════════════════════════════
    // EVENT LISTENERS
    // ════════════════════════════════════════════════════════

    // Radio change events
    radios.forEach(radio => {
        radio.addEventListener('change', function() {
            updateMainNavButtons();
            autoScrollToActiveThumbnail();
        });
    });

    // Thumbnail navigation buttons
    if (thumbPrevBtn) {
        thumbPrevBtn.addEventListener('click', () => scrollThumbs('prev'));
    }
    
    if (thumbNextBtn) {
        thumbNextBtn.addEventListener('click', () => scrollThumbs('next'));
    }

    // Zoom icon click
    if (zoomIcon) {
        zoomIcon.addEventListener('click', openLightbox);
    }

    // Click on main image to zoom
    const mainImages = document.querySelectorAll('.main-image');
    mainImages.forEach(img => {
        img.addEventListener('click', openLightbox);
        img.style.cursor = 'zoom-in';
    });

    // ════════════════════════════════════════════════════════
    // INITIALIZATION
    // ════════════════════════════════════════════════════════

    updateMainNavButtons();
    updateThumbNavState();

})();