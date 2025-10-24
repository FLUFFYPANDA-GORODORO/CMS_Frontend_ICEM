import React, { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // redirect to login
  };

  return (
    <nav className="fixed top-2 left-1/2 transform -translate-x-1/2 w-full z-50">
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-lg rounded-2xl px-6 py-3 flex justify-between items-center text-gray-800">
        <h1 className="text-2xl font-bold tracking-wide">
          <span className="text-cyan-600">ICEM</span> Content Management System
        </h1>

        <div className="flex items-center gap-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/40 text-rose-600 px-4 py-2 rounded-xl font-medium transition-all"
          >
            <LogOut size={18} /> Logout
          </button>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
