import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "https://cms-backend-icem.onrender.com/api/banners/type/placement";

const PlacementSlider = () => {
  const [desktopImages, setDesktopImages] = useState([]);
  const [mobileImages, setMobileImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get(API_URL);
        if (res.data && res.data.length > 0) {
          setDesktopImages(res.data.map((b) => b.desktopImageUrl).filter(Boolean));
          setMobileImages(res.data.map((b) => b.mobileImageUrl).filter(Boolean));
        } else {
          toast("No placement banners found");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load placement banners");
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    if (!desktopImages.length && !mobileImages.length) return;
    const interval = setInterval(() => handleNext(), 4000);
    return () => clearInterval(interval);
  }, [currentIndex, desktopImages, mobileImages]);

  const handleNext = () => {
    const totalSlides = desktopImages.length || mobileImages.length;
    if (totalSlides === 0) return;

    if (currentIndex === totalSlides - 1) {
      setIsTransitioning(true);
      setCurrentIndex(totalSlides);
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
      }, 700);
    } else {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-lg">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Desktop */}
      <div className="hidden md:block">
        {desktopImages.length > 0 ? (
          <div
            ref={sliderRef}
            className={`flex ${
              isTransitioning ? "transition-transform duration-700 ease-in-out" : ""
            }`}
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {[...desktopImages, desktopImages[0]].map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Desktop Placement ${i + 1}`}
                className="w-full h-[500px] object-cover flex-shrink-0"
                loading="lazy"
              />
            ))}
          </div>
        ) : (
          !loading && <div className="h-[400px] flex items-center justify-center text-gray-500">No desktop banners</div>
        )}
      </div>

      {/* Mobile */}
      <div className="block md:hidden">
        {mobileImages.length > 0 ? (
          <div
            ref={sliderRef}
            className={`flex ${
              isTransitioning ? "transition-transform duration-700 ease-in-out" : ""
            }`}
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {[...mobileImages, mobileImages[0]].map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Mobile Placement ${i + 1}`}
                className="w-full h-[300px] object-cover flex-shrink-0"
                loading="lazy"
              />
            ))}
          </div>
        ) : (
          !loading && <div className="h-[300px] flex items-center justify-center text-gray-500">No mobile banners</div>
        )}
      </div>
    </div>
  );
};

export default PlacementSlider;
