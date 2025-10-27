import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "https://cms-backend-icem.onrender.com/api/banners";

const HeroSlider = ({ version }) => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const sliderRef = useRef(null);

  // ✅ Fetch banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get(API_URL);
        if (res.data && res.data.length > 0) {
          const imgs =
            version === "mobile"
              ? res.data.map((b) => b.mobileImageUrl)
              : res.data.map((b) => b.desktopImageUrl);
          setImages(imgs.filter(Boolean));
        } else {
          toast("No banners found");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load banners");
      }
    };

    fetchBanners();
  }, [version]);

  // ✅ Auto slide
  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => handleNext(), 4000);
    return () => clearInterval(interval);
  }, [currentIndex, images]);

  const handleNext = () => {
    if (images.length === 0) return;

    if (currentIndex === images.length - 1) {
      setIsTransitioning(true);
      setCurrentIndex(images.length);
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
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full overflow-hidden bg-black rounded-xl">
        {images.length > 0 ? (
          <div
            ref={sliderRef}
            className={`flex ${
              isTransitioning
                ? "transition-transform duration-700 ease-in-out"
                : ""
            }`}
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {[...images, images[0]].map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Slide ${i + 1}`}
                className={`w-full ${
                  version === "mobile" ? "h-[300px]" : "h-[500px]"
                } object-cover flex-shrink-0`}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[400px] text-gray-800">
            No {version} banners available
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSlider;
