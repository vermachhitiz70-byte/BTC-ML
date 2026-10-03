// Product Detail Page - Thumbnail Gallery Handler
(function () {
  'use strict';

  function initProductGallery() {
    // Support both new and old class structures
    const mainImg = document.querySelector('.fb-pd-main-img img, .fb-pd-img-card img, .fb-sp-gallery img');
    const thumbs = document.querySelectorAll('.fb-pd-thumb, .fb-sp-thumb');

    if (!mainImg || thumbs.length === 0) return;

    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        const newSrc = this.dataset.full || this.querySelector('img').src;
        if (newSrc && newSrc !== mainImg.src) {
          mainImg.style.opacity = '0';
          setTimeout(function () {
            mainImg.src = newSrc;
            mainImg.style.opacity = '1';
          }, 150);
        }
        thumbs.forEach(function (t) { t.classList.remove('active'); });
        this.classList.add('active');
      });
    });

    // Set first thumb as active
    thumbs[0].classList.add('active');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductGallery);
  } else {
    initProductGallery();
  }
})();