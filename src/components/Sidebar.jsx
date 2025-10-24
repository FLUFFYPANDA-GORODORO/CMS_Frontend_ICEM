import React, { useState } from "react";
import { Layout, Newspaper, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { name: "Banner", path: "/home/banner", icon: <Layout size={20} /> },
    { name: "News", path: "/home/news", icon: <Newspaper size={20} /> },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-5 left-5 z-50 text-white"
      >
        {isOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      <aside
        className={`fixed top-[10vh] left-0 h-[80vh] w-64 rounded-r-2xl backdrop-blur-lg bg-white/10 border-r border-white/20 shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 z-40`}
      >
        <div className="flex items-center justify-center h-20 border-b border-white/20">
          <h1 className="text-2xl font-bold text-cyan-400">ICEM CMS</h1>
        </div>

        <ul className="flex flex-col mt-6 space-y-2 px-4">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
                  location.pathname === item.path
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                    : "text-gray-100 hover:bg-white/10 hover:text-cyan-300"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
