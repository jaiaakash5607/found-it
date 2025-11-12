import React, { useEffect } from 'react'

/**
 * ImageLightbox
 * props:
 *  - images: array of image URLs (can be data-URLs)
 *  - startIndex: number (0-based) optional
 *  - onClose: function optional
 */
export default function ImageLightbox({ images = [], startIndex = 0, onClose = () => {} }) {
  const [index, setIndex] = React.useState(startIndex || 0)

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') return handleClose()
      if (e.key === 'ArrowLeft') return prev()
      if (e.key === 'ArrowRight') return next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, images])

  useEffect(() => {
    // prevent page scroll while open
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!images || images.length === 0) return null

  function prev() {
    setIndex(i => (i - 1 + images.length) % images.length)
  }
  function next() {
    setIndex(i => (i + 1) % images.length)
  }
  function handleClose() {
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative max-w-5xl w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
        {/* Close */}
        <button onClick={handleClose} className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-2">
          ✕
        </button>

        {/* Prev */}
        {images.length > 1 && (
          <button onClick={prev} className="absolute left-4 text-white text-3xl p-2 bg-black/30 rounded-full hidden md:block">‹</button>
        )}

        {/* Image */}
        <div className="max-h-[90vh] max-w-full flex items-center justify-center">
          <img src={images[index]} alt={`img-${index}`} className="max-h-[90vh] max-w-full object-contain rounded shadow-lg" />
        </div>

        {/* Next */}
        {images.length > 1 && (
          <button onClick={next} className="absolute right-4 text-white text-3xl p-2 bg-black/30 rounded-full hidden md:block">›</button>
        )}

        {/* Thumbnails (mobile shows small strip) */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex gap-2 justify-center overflow-auto px-4">
            {images.map((src, i) => (
              <button key={i} onClick={() => setIndex(i)} className={`rounded border ${i === index ? 'ring-2 ring-indigo-400' : 'opacity-80'}`}>
                <img src={src} alt={`thumb-${i}`} className="h-12 w-20 object-cover rounded" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
