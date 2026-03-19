// ════════════════════════════════════════════════════════════
// PRODUCT GALLERY - FULL VERSION (Có thumbnail navigation)
// ════════════════════════════════════════════════════════════

(function() {
    // ─── Lấy các elements ───────────────────────────────────
    const radios = document.querySelectorAll('.gallery-radio');
    const mainPrevBtn = document.querySelector('#prev-btn');
    const mainNextBtn = document.querySelector('#next-btn');
    const thumbGallery = document.getElementById('thumb-gallery');
    const thumbPrevBtn = document.getElementById('thumb-prev');
    const thumbNextBtn = document.getElementById('thumb-next');
    
    const totalImages = radios.length;
    let currentThumbPosition = 0;
    const thumbsVisible = 4;
    const maxThumbPosition = totalImages - thumbsVisible;

    // ─── Hàm cập nhật nút Previous/Next của main image ──────
    function updateMainNavButtons() {
        const currentIndex = Array.from(radios).findIndex(r => r.checked);
        
        const prevIndex = currentIndex === 0 ? totalImages - 1 : currentIndex - 1;
        mainPrevBtn.setAttribute('for', `img${prevIndex + 1}`);
        
        const nextIndex = currentIndex === totalImages - 1 ? 0 : currentIndex + 1;
        mainNextBtn.setAttribute('for', `img${nextIndex + 1}`);
    }

    // ─── Hàm cập nhật trạng thái nút thumbnail ──────────────
    function updateThumbNavState() {
        if (thumbPrevBtn && thumbNextBtn) {
            thumbPrevBtn.classList.toggle('disabled', currentThumbPosition === 0);
            thumbNextBtn.classList.toggle('disabled', currentThumbPosition >= maxThumbPosition);
        }
    }

    // ─── Hàm scroll thumbnails ──────────────────────────────
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

    // ─── Auto scroll thumbnail khi đổi ảnh ──────────────────
    function autoScrollToActiveThumbnail() {
        const currentIndex = Array.from(radios).findIndex(r => r.checked);
        
        // Tính vị trí cần scroll để thumbnail active hiển thị
        if (currentIndex < currentThumbPosition) {
            // Ảnh active ở bên trái → scroll lại
            currentThumbPosition = currentIndex;
        } else if (currentIndex >= currentThumbPosition + thumbsVisible) {
            // Ảnh active ở bên phải → scroll qua
            currentThumbPosition = currentIndex - thumbsVisible + 1;
        }
        
        // Giới hạn position
        currentThumbPosition = Math.max(0, Math.min(currentThumbPosition, maxThumbPosition));
        
        const thumbWidth = thumbGallery.children[0].offsetWidth;
        const gap = 12;
        const offset = -(currentThumbPosition * (thumbWidth + gap));
        
        if (thumbGallery) {
            thumbGallery.style.transform = `translateX(${offset}px)`;
        }
        updateThumbNavState();
    }

    // ─── Event Listeners ────────────────────────────────────
    
    // Khi đổi ảnh
    radios.forEach(radio => {
        radio.addEventListener('change', function() {
            updateMainNavButtons();
            autoScrollToActiveThumbnail();
        });
    });

    // Nút thumbnail navigation
    if (thumbPrevBtn) {
        thumbPrevBtn.addEventListener('click', () => scrollThumbs('prev'));
    }
    
    if (thumbNextBtn) {
        thumbNextBtn.addEventListener('click', () => scrollThumbs('next'));
    }

    // ─── Khởi tạo khi trang load ────────────────────────────
    updateMainNavButtons();
    updateThumbNavState();
})();