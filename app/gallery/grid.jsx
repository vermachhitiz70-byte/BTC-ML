'use client';

import { useEffect, useState } from 'react';

export default function GalleryGrid({ images }) {
  const [open, setOpen] = useState(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(null); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <div className="bs-gallery">
        {images.map((src, i) => (
          <button
            key={src + i}
            type="button"
            className="bs-gallery-item"
            onClick={() => setOpen(src)}
            aria-label={`Open image ${i + 1} larger`}
          >
            <img src={src} alt={`BTCMLTAI preview ${i + 1}`} loading="lazy" />
          </button>
        ))}
      </div>

      {open ? (
        <div className="bs-lightbox" onClick={() => setOpen(null)} role="dialog" aria-modal="true" aria-label="Image preview">
          <button type="button" className="bs-lightbox-x" aria-label="Close preview" onClick={() => setOpen(null)}>
            &times;
          </button>
          <img src={open} alt="BTCMLTAI preview enlarged" />
        </div>
      ) : null}
    </>
  );
}