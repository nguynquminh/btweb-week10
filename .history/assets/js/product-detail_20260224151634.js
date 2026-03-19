
  const radios = document.querySelectorAll('.gallery-radio');
  const mainPrevBtn = document.querySelector('#main-prev-btn');
  const mainNextBtn = document.querySelector('#main-next-btn');
  const thumbGallery = document.getElementById('thumb-gallery');
  const thumbPrevBtn = document.getElementById('thumb-prev');
  const thumbNextBtn = document.getElementById('thumb-next');
  
  const totalImages = radios.length;
  let currentThumbPosition = 0;
  const thumbsVisible = 4;
  const maxThumbPosition = totalImages - thumbsVisible;

  // ─── Update Main Image Navigation ─────────────────────
  function updateMainNavButtons() {
    const currentIndex = Array.from(radios).findIndex(r => r.checked);
    
    const prevIndex = currentIndex === 0 ? totalImages - 1 : currentIndex - 1;
    mainPrevBtn.setAttribute('for', `img${prevIndex + 1}`);
    
    const nextIndex = currentIndex === totalImages - 1 ? 0 : currentIndex + 1;
    mainNextBtn.setAttribute('for', `img${nextIndex + 1}`);
  }

  // ─── Update Thumbnail Navigation State ────────────────
  function updateThumbNavState() {
    thumbPrevBtn.classList.toggle('disabled', currentThumbPosition === 0);
    thumbNextBtn.classList.toggle('disabled', currentThumbPosition >= maxThumbPosition);
  }

  // ─── Scroll Thumbnails ─────────────────────────────────
  function scrollThumbs(direction) {
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

  // ─── Event Listeners ───────────────────────────────────
  thumbPrevBtn.addEventListener('click', () => scrollThumbs('prev'));
  thumbNextBtn.addEventListener('click', () => scrollThumbs('next'));

  radios.forEach(radio => {
    radio.addEventListener('change', updateMainNavButtons);
  });

  // ─── Initialize ────────────────────────────────────────
  updateMainNavButtons();
  updateThumbNavState();