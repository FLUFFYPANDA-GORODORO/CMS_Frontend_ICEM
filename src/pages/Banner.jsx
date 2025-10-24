import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import HeroSlider from "../components/HeroSlider";
import api from "../utils/axiosInstance";

const Banner = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all banners
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await api.get("/banners");
      setBanners(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "view") fetchBanners();
  }, [activeTab]);

  // ✅ Upload Banner
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select an image!");

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      await api.post("/banners/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Banner uploaded successfully!");
      setFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error(error);
      toast.error("Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Banner
  const handleDelete = async (id) => {
    try {
      await api.delete(`/banners/${id}`);
      toast.success("Banner deleted!");
      setBanners((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete banner!");
    }
  };

  // Handle file selection + preview
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
    } else {
      setPreviewUrl(null);
    }
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        {["upload", "view", "slideshow"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
              activeTab === tab
                ? "bg-cyan-200/20 text-cyan-400 border border-cyan-500/30"
                : "bg-black/10 text-gray-600 hover:bg-white/20"
            }`}
          >
            {tab === "upload"
              ? "Upload"
              : tab === "view"
              ? "View / Delete"
              : "Slideshow"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-lg p-6">
        {activeTab === "upload" && (
          <form className="space-y-4" onSubmit={handleUpload}>
            <div>
              <label className="block text-gray-600 text-sm mb-2">
                Select Image
              </label>
              <div className="relative flex items-center">
                <input
                  id="banner-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="banner-upload"
                  className="px-5 py-2.5 bg-cyan-200/20 hover:bg-cyan-200/30 text-cyan-400 border border-cyan-500/40 rounded-xl cursor-pointer font-medium transition-all"
                >
                  Choose File
                </label>
                <span className="ml-3 text-gray-600 text-sm truncate max-w-[60%]">
                  {file ? file.name : "No file selected"}
                </span>
              </div>
            </div>

            {previewUrl && (
              <div className="mt-4">
                <p className="text-gray-600 text-sm mb-2">Preview:</p>
                <div className="max-w-full overflow-hidden rounded-xl border border-white/20">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-auto object-contain rounded-xl"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-2.5 bg-cyan-200/80 hover:bg-cyan-400 text-gray-800 rounded-xl font-medium transition-all ${
                loading && "opacity-50 cursor-not-allowed"
              }`}
            >
              {loading ? "Uploading..." : "Upload Banner"}
            </button>
          </form>
        )}

        {activeTab === "view" && (
          <div>
            <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
              View & Delete Banners 🗑
            </h2>

            {loading ? (
              <p className="text-gray-600">Loading banners...</p>
            ) : banners.length === 0 ? (
              <p className="text-gray-600">No banners found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {banners.map((banner) => (
                  <div
                    key={banner.id}
                    className="bg-black/10 border border-white/20 rounded-xl p-3 shadow-md hover:shadow-lg transition-all"
                  >
                    <img
                      src={banner.imageUrl}
                      alt="Banner"
                      className="rounded-lg mb-3 w-full h-40 object-cover"
                    />
                    <div className="flex justify-between items-center text-sm">
                      <p className="text-gray-600 truncate w-3/4">
                        {banner.publicId}
                      </p>
                      <button
                        onClick={() => handleDelete(banner.id)}
                        className="text-rose-400 hover:text-rose-500 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "slideshow" && (
          <div className="rounded-xl overflow-hidden border border-white/20">
            <HeroSlider />
          </div>
        )}
      </div>
    </div>
  );
};

export default Banner;
