import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 ml-0 md:ml-64 transition-all duration-300">
        <Navbar />
        <div className="p-8 mt-24">
          {/* This is where child routes render */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Home;
