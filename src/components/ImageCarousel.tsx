import { useState } from "react";

interface ImageCarouselProps {
  images: string[];
}

export function ImageCarousel({ images }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [showLarge, setShowLarge] = useState(false);
  if (!images.length) return <div className="w-full h-24 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">No Img</div>;
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <button
          className="px-2 py-1 bg-gray-100 rounded disabled:opacity-50"
          onClick={() => setCurrent((c) => (c > 0 ? c - 1 : images.length - 1))}
          disabled={images.length <= 1}
        >
          &#8592;
        </button>
        <img
          src={images[current]}
          alt={`img-large-${current}`}
          className="w-40 h-40 object-cover rounded cursor-pointer border-2 border-gray-300 hover:border-blue-400"
          onClick={() => setShowLarge(true)}
        />
        <button
          className="px-2 py-1 bg-gray-100 rounded disabled:opacity-50"
          onClick={() => setCurrent((c) => (c < images.length - 1 ? c + 1 : 0))}
          disabled={images.length <= 1}
        >
          &#8594;
        </button>
      </div>
      <div className="flex gap-1 justify-center mb-2">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`thumb-${idx}`}
            className={`w-10 h-10 object-cover rounded cursor-pointer border-2 ${idx === current ? "border-blue-500" : "border-gray-200"}`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
      {showLarge && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-60" onClick={() => setShowLarge(false)} />
          <div className="relative">
            <img src={images[current]} alt="large" className="max-h-[80vh] max-w-[90vw] rounded shadow-lg border-4 border-white" />
          </div>
        </div>
      )}
    </div>
  );
}