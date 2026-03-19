// ════════════════════════════════════════════════════════════
// PRODUCT GALLERY NAVIGATION
// ════════════════════════════════════════════════════════════

(function() {
    // ─── Lấy các elements ───────────────────────────────────
    const radios = document.querySelectorAll('.gallery-radio');
    const mainPrevBtn = document.querySelector('#prev-btn');
    const mainNextBtn = document.querySelector('#next-btn');
    
    const totalImages = radios.length;

    // ─── Hàm cập nhật nút Previous/Next ──────────────────────
    function updateMainNavButtons() {
        // Tìm ảnh đang được chọn (radio nào đang checked)
        const currentIndex = Array.from(radios).findIndex(r => r.checked);
        
        // Tính index của ảnh trước đó (vòng lại từ đầu nếu đang ở ảnh đầu)
        const prevIndex = currentIndex === 0 ? totalImages - 1 : currentIndex - 1;
        mainPrevBtn.setAttribute('for', `img${prevIndex + 1}`);
        
        // Tính index của ảnh kế tiếp (vòng lại từ đầu nếu đang ở ảnh cuối)
        const nextIndex = currentIndex === totalImages - 1 ? 0 : currentIndex + 1;
        mainNextBtn.setAttribute('for', `img${nextIndex + 1}`);
    }

    // ─── Lắng nghe sự thay đổi của radio buttons ────────────
    radios.forEach(radio => {
        radio.addEventListener('change', updateMainNavButtons);
    });

    // ─── Khởi tạo khi trang load ────────────────────────────
    updateMainNavButtons();
})();