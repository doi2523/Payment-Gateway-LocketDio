import React from "react";
import { useLocation } from "react-router-dom";
import { Menu, Github } from "lucide-react";

const Header = () => {
  const location = useLocation();

  // Ẩn Header nếu đang ở trang "/"
  if (location.pathname === "/") return null;

  return (
    <header className="bg-white w-full navbar shadow-md flex items-center justify-between px-4 py-3 text-base-content">
      
      <a
        href="https://locket-dio.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2"
      >
        <span className="font-semibold gradient-text disable-select">
          Locket Dio
        </span>
        <img
          src="https://cdn.locket-dio.com/v1/icons/heart-gold-logo.png"
          alt="Locket icon"
          className="w-7 h-7 object-contain -ml-1 disable-select"
          draggable="false"
        />
      </a>

      <div className="flex items-center gap-3">

        <a
          href="https://github.com/doi2523/Payment-Gateway-LocketDio.git"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-gray-600"
        >
          <Github size={22} />
          <span className="text-sm font-medium">Open Source</span>
        </a>

        <img
          src="https://cdn.locket-dio.com/v1/images/apple-touch-icon.png"
          alt="Locket icon"
          className="w-9 h-9 object-contain disable-select"
          draggable="false"
        />

      </div>
    </header>
  );
};

export default Header;