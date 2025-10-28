import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import HeroSlider from "../components/HeroSlider";
import PlacementSlider from "../components/PlacementSlider";
import api from "../utils/axiosInstance";

const Banner = () => {
  const [bannerType, setBannerType] = useState("homepage");
  const [activeTab, setActiveTab] = useState("upload");
  const [desktopFile, setDesktopFile] = useState(null);
  const [mobileFile, setMobileFile] = useState(null);
  const [previewDesktop, setPreviewDesktop] = useState(null);
  const [previewMobile, setPreviewMobile] = useState(null);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all banners
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/banners/type/${bannerType}`);
      setBanners(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "view" || activeTab === "slideshow") fetchBanners();
  }, [activeTab, bannerType]);

  // ✅ Upload Banner (desktop + mobile)
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!desktopFile || !mobileFile)
      return toast.error("Please select both desktop and mobile images!");

    const formData = new FormData();
    formData.append("desktopImage", desktopFile);
    formData.append("mobileImage", mobileFile);
    formData.append("type", bannerType);

    try {
      setLoading(true);
      await api.post("/banners/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Banner uploaded successfully!");
      setDesktopFile(null);
      setMobileFile(null);
      setPreviewDesktop(null);
      setPreviewMobile(null);
      fetchBanners();
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

  // ✅ File Handlers
  const handleDesktopChange = (e) => {
    const file = e.target.files[0];
    setDesktopFile(file);
    setPreviewDesktop(file ? URL.createObjectURL(file) : null);
  };

  const handleMobileChange = (e) => {
    const file = e.target.files[0];
    setMobileFile(file);
    setPreviewMobile(file ? URL.createObjectURL(file) : null);
  };

  return (
    <div className="max-w-7xl mx-auto  bg-white rounded-2xl shadow-md p-8">
      {/* 🔹 Top Tabs — Homepage / Placement */}
      <div className="flex border-b mb-8">
        {["homepage", "placement"].map((type) => (
          <button
            key={type}
            onClick={() => setBannerType(type)}
            className={`px-8 py-3 font-medium text-sm transition-all ${
              bannerType === type
                ? "text-blue-600 border-b-4 border-blue-600 bg-blue-50"
                : "text-gray-500 hover:text-blue-600"
            }`}
          >
            {type === "homepage" ? "Homepage Banners" : "Placement Banners"}
          </button>
        ))}
      </div>

      {/* 🔹 Secondary Tabs — Upload / View / Slideshow */}
      <div className="flex space-x-4 mb-6">
        {["upload", "view", "slideshow"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === tab
                ? "bg-cyan-100 text-cyan-700 shadow-md"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
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

      {/* 🔹 Upload Section */}
      {activeTab === "upload" && (
        <form className="space-y-6" onSubmit={handleUpload}>
          <h3 className="text-lg font-semibold text-blue-600 mb-4">
            Upload {bannerType === "homepage" ? "Homepage" : "Placement"} Banners
          </h3>

          {/* Desktop Upload */}
          <div>
            <label className="block text-gray-700 text-sm mb-2 font-medium">
              Desktop Image
            </label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="desktop-upload"
                className="px-5 py-2 bg-cyan-100 text-gray-800 font-medium rounded-md cursor-pointer hover:bg-cyan-200 transition-all shadow-sm"
              >
                Choose File
              </label>
              <input
                id="desktop-upload"
                type="file"
                accept="image/*"
                onChange={handleDesktopChange}
                className="hidden"
              />
              <span className="text-gray-600 text-sm truncate max-w-[200px]">
                {desktopFile ? desktopFile.name : "No file selected"}
              </span>
            </div>

            {previewDesktop && (
              <div className="mt-3 rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={previewDesktop}
                  alt="Desktop Preview"
                  className="w-full h-48 object-cover"
                />
              </div>
            )}
          </div>

          {/* Mobile Upload */}
          <div>
            <label className="block text-gray-700 text-sm mb-2 font-medium">
              Mobile Image
            </label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="mobile-upload"
                className="px-5 py-2 bg-cyan-100 text-gray-800 font-medium rounded-md cursor-pointer hover:bg-cyan-200 transition-all shadow-sm"
              >
                Choose File
              </label>
              <input
                id="mobile-upload"
                type="file"
                accept="image/*"
                onChange={handleMobileChange}
                className="hidden"
              />
              <span className="text-gray-600 text-sm truncate max-w-[200px]">
                {mobileFile ? mobileFile.name : "No file selected"}
              </span>
            </div>

            {previewMobile && (
              <div className="mt-3 rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={previewMobile}
                  alt="Mobile Preview"
                  className="w-full h-48 object-cover"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 bg-cyan-200 hover:bg-cyan-300 text-gray-900 font-semibold rounded-md shadow-md transition-all ${
              loading && "opacity-60 cursor-not-allowed"
            }`}
          >
            {loading ? "Uploading..." : "Upload Banner"}
          </button>
        </form>
      )}

      {/* 🔹 View Section */}
      {activeTab === "view" && (
        <div>
          <h2 className="text-2xl font-semibold text-cyan-600 mb-4">
            {bannerType === "homepage"
              ? "Homepage Banners"
              : "Placement Banners"}{" "}
            🖼️
          </h2>

          {loading ? (
            <p className="text-gray-600">Loading banners...</p>
          ) : banners.length === 0 ? (
            <p className="text-gray-600">No banners found.</p>
          ) : (
            <>
              <div className="mb-8">
                <h3 className="text-lg text-cyan-500 mb-3">🖥 Desktop</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {banners.map((b) => (
                    <div
                      key={b.id}
                      className="bg-gray-50 border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all"
                    >
                      <img
                        src={b.desktopImageUrl}
                        alt="Desktop Banner"
                        className="rounded-lg mb-3 w-full h-40 object-cover"
                      />
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">{b.type}</span>
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="text-rose-400 hover:text-rose-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg text-cyan-500 mb-3">📱 Mobile</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {banners.map((b) => (
                    <div
                      key={b.id + "-mobile"}
                      className="bg-gray-50 border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all"
                    >
                      <img
                        src={b.mobileImageUrl}
                        alt="Mobile Banner"
                        className="rounded-lg mb-3 w-full h-40 object-cover"
                      />
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">{b.type}</span>
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="text-rose-400 hover:text-rose-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* 🔹 Slideshow Section */}
      {activeTab === "slideshow" && (
        <div className="space-y-10">
          <h3 className="text-2xl font-semibold text-blue-600 mb-3">
            {bannerType === "homepage"
              ? "Homepage Banner Preview"
              : "Placement Banner Preview"}
          </h3>

          {bannerType === "homepage" ? <HeroSlider /> : <PlacementSlider />}
        </div>
      )}
    </div>
  );
};

export default Banner;
