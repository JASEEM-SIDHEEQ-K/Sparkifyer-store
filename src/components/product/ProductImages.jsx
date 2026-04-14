import { useState } from "react";

const ProductImages = ({ images, name }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // ─── Fallback if no images array ──────────────────────
  const imageList = images?.length > 0 ? images : [];

  return (
    <div className="flex flex-col gap-3">

      {/* ── Main Image ────────────────────────────────────── */}
      <div
        className="relative bg-slate-100 rounded-2xl overflow-hidden cursor-zoom-in"
        onClick={() => setIsZoomed(true)}
      >
        <img
          src={imageList[selectedImage]}
          alt={`${name} - image ${selectedImage + 1}`}
          className="w-full h-80 object-cover rounded-2xl hover:scale-105 transition duration-300"
        />

        {/* Image Counter */}
        <span className="absolute top-3 right-3 bg-black/40 text-white text-xs px-2 py-1 rounded-full">
          {selectedImage + 1} / {imageList.length}
        </span>

        {/* Zoom Hint */}
        <span className="absolute bottom-3 right-3 bg-black/40 text-white text-xs px-2 py-1 rounded-full">
          🔍 Click to zoom
        </span>

        {/* Left Arrow */}
        {selectedImage > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage((prev) => prev - 1);
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-8 h-8 rounded-full flex items-center justify-center transition"
          >
            ‹
          </button>
        )}

        {/* Right Arrow */}
        {selectedImage < imageList.length - 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage((prev) => prev + 1);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-8 h-8 rounded-full flex items-center justify-center transition"
          >
            ›
          </button>
        )}
      </div>

      {/* ── Thumbnail Gallery ─────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {imageList.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition
              ${selectedImage === index
                ? "border-blue-600 opacity-100"
                : "border-slate-200 opacity-60 hover:opacity-100"
              }`}
          >
            <img
              src={img}
              alt={`${name} thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* ── Zoom Modal ────────────────────────────────────── */}
      {isZoomed && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center px-4"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Close Button */}
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute -top-10 right-0 text-white text-2xl font-bold hover:text-slate-300"
            >
              ✕
            </button>

            {/* Zoomed Main Image */}
            <img
              src={imageList[selectedImage]}
              alt={name}
              className="w-full max-h-[80vh] object-contain rounded-2xl"
            />

            {/* Modal Left Arrow */}
            {selectedImage > 0 && (
              <button
                onClick={() => setSelectedImage((prev) => prev - 1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl transition"
              >
                ‹
              </button>
            )}

            {/* Modal Right Arrow */}
            {selectedImage < imageList.length - 1 && (
              <button
                onClick={() => setSelectedImage((prev) => prev + 1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl transition"
              >
                ›
              </button>
            )}

            {/* Modal Thumbnails */}
            <div className="flex justify-center gap-2 mt-4">
              {imageList.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition
                    ${selectedImage === index
                      ? "border-blue-500 opacity-100"
                      : "border-white/30 opacity-50 hover:opacity-100"
                    }`}
                >
                  <img
                    src={img}
                    alt={`thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ProductImages;