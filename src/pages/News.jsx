import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

// ✅ Configure PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const API_URL = "https://cms-backend-icem.onrender.com/api/news";

const News = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [pdfFile, setPdfFile] = useState(null);

  // PDF Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState("");

  // PDF Viewer
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.1);

  // ✅ Axios instance with token
  const axiosAuth = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ include JWT token
    },
  });

  // ✅ Fetch all news
  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await axiosAuth.get("");
      setNewsList(res.data);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 403) {
        toast.error("Access denied — please log in again.");
      } else {
        toast.error("Failed to load news");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "view") fetchNews();
  }, [activeTab]);

  // ✅ Upload News
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !description || !author)
      return toast.error("All fields except PDF are required!");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("author", author);
    if (pdfFile) formData.append("pdf", pdfFile);

    try {
      setLoading(true);
      await axiosAuth.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("News uploaded successfully!");
      setTitle("");
      setDescription("");
      setAuthor("");
      setPdfFile(null);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 403) {
        toast.error("Unauthorized! Please log in again.");
      } else {
        toast.error("Upload failed!");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete News
  const handleDelete = async (id) => {
    try {
      await axiosAuth.delete(`/${id}`);
      toast.success("News deleted!");
      setNewsList((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete news!");
    }
  };

  // ✅ Download PDF
  const handleDownloadPdf = async (pdfUrl, title) => {
    try {
      const response = await fetch(pdfUrl, { mode: "cors" });
      if (!response.ok) throw new Error("Failed to fetch PDF");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const fileName = title?.replace(/\s+/g, "_") + ".pdf" || "document.pdf";
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      link.click();

      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 5000);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download PDF");
    }
  };

  // ✅ View PDF in Modal
  const handleViewPdf = (pdfUrl, title) => {
    const formattedUrl = pdfUrl.includes("/upload/")
      ? pdfUrl.replace("/upload/", "/upload/fl_attachment/")
      : pdfUrl;
    setSelectedPdfUrl(formattedUrl);
    setSelectedTitle(title);
    setShowModal(true);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className="min-h-screen text-gray-800">
      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("upload")}
          className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
            activeTab === "upload"
              ? "bg-cyan-200/20 text-cyan-600 border border-cyan-500/30"
              : "bg-black/10 text-gray-600 hover:bg-white/20"
          }`}
        >
          Upload
        </button>

        <button
          onClick={() => setActiveTab("view")}
          className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
            activeTab === "view"
              ? "bg-cyan-200/20 text-cyan-600 border border-cyan-500/30"
              : "bg-black/10 text-gray-600 hover:bg-white/20"
          }`}
        >
          View / Delete
        </button>
      </div>

      <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-lg p-6">
        {/* Upload Form */}
        {activeTab === "upload" && (
          <form className="space-y-4" onSubmit={handleUpload}>
            <div>
              <label className="block text-gray-600 text-sm mb-2">
                News Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter news title"
                className="w-full  border  rounded-xl px-3 py-2  focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter news description"
                rows="3"
                className="w-full  border rounded-xl px-3 py-2  focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-600 text-sm mb-2">Author</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter author name"
                className="w-full  border  rounded-xl px-3 py-2  focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm mb-2">
                Upload PDF (optional)
              </label>
              <div className="relative flex items-center ">
                <input
                  id="news-pdf-upload"
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setPdfFile(e.target.files[0])}
                  className="hidden"
                />
                <label
                  htmlFor="news-pdf-upload"
                  className="px-5 py-2.5 bg-cyan-200/20 hover:bg-cyan-200/30 text-cyan-600 border border-cyan-500/40 rounded-xl cursor-pointer font-medium transition-all duration-200"
                >
                  Choose PDF
                </label>
                <span className="ml-3 text-gray-600 text-sm truncate max-w-[60%]">
                  {pdfFile ? pdfFile.name : "No file selected"}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-2.5 bg-cyan-200/80 hover:bg-cyan-400 text-gray-800 rounded-xl transition-all font-medium ${
                loading && "opacity-50 cursor-not-allowed"
              }`}
            >
              {loading ? "Uploading..." : "Upload News"}
            </button>
          </form>
        )}

        {/* View/Delete Tab */}
        {activeTab === "view" && (
          <div>
            <h2 className="text-2xl font-semibold text-cyan-600 mb-4">
              View & Delete News 🗞
            </h2>

            {loading ? (
              <p className="text-gray-600">Loading news...</p>
            ) : newsList.length === 0 ? (
              <p className="text-gray-600">No news available.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {newsList.map((news) => (
                  <div
                    key={news.id}
                    className="bg-white/10 border border-white/20 rounded-xl p-4 shadow-md hover:shadow-lg transition-all"
                  >
                    <h3 className="text-lg font-semibold text-cyan-600 mb-1">
                      {news.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {news.description}
                    </p>
                    <p className="text-gray-600 text-xs mb-2">
                      Author: {news.author}
                    </p>
                    <p className="text-gray-600 text-xs mb-3">
                      Date: {news.date}
                    </p>

                    {news.pdfUrl ? (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            handleDownloadPdf(news.pdfUrl, news.title)
                          }
                          className="text-cyan-600 text-sm hover:underline"
                        >
                          ⬇ Download PDF
                        </button>

                        <button
                          onClick={() =>
                            handleViewPdf(news.pdfUrl, news.title)
                          }
                          className="text-emerald-400 text-sm hover:underline"
                        >
                          👁 View PDF
                        </button>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-xs italic">
                        No PDF uploaded
                      </p>
                    )}

                    <div className="mt-3 flex justify-between items-center text-sm">
                      <p className="text-gray-600 truncate w-3/4">
                        {news.publicId}
                      </p>
                      <button
                        onClick={() => handleDelete(news.id)}
                        className="text-rose-400 hover:text-rose-300 transition-colors"
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
      </div>

      {/* ✅ PDF Modal */}
      {showModal && selectedPdfUrl && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex justify-center items-center">
          <div className="bg-[#0d1117] border border-cyan-500/40 rounded-2xl w-11/12 lg:w-3/4 xl:w-2/3 h-[90vh] shadow-2xl shadow-cyan-500/10 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center px-5 py-3 border-b border-cyan-500/30 bg-black/40">
              <h2 className="text-cyan-600 font-semibold text-lg tracking-wide">
                {selectedTitle || "View PDF"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-600 hover:text-rose-400 text-2xl font-bold transition-all"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-black/30 custom-scrollbar">
              <Document
                file={selectedPdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={(error) =>
                  toast.error("Failed to load PDF: " + error.message)
                }
                loading={<p className="text-cyan-600">Loading PDF...</p>}
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <div key={`page_${index + 1}`} className="mb-4 flex justify-center">
                    <Page
                      pageNumber={index + 1}
                      scale={scale}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                    />
                  </div>
                ))}
              </Document>
            </div>

            <div className="flex justify-center items-center gap-4 py-3 border-t border-cyan-500/30 bg-black/40">
              <button
                onClick={() => setScale((prev) => Math.max(prev - 0.2, 0.6))}
                className="px-3 py-1 bg-gray-700/50 rounded-lg hover:bg-gray-600/70 transition-all"
              >
                ➖ Zoom Out
              </button>
              <button
                onClick={() => setScale((prev) => Math.min(prev + 0.2, 2))}
                className="px-3 py-1 bg-gray-700/50 rounded-lg hover:bg-gray-600/70 transition-all"
              >
                ➕ Zoom In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
