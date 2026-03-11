import React from "react";
import Mirage from "./MirageLoad";
import "./styles.css";

const LoadingPage = ({ isLoading }) => {
  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center z-[70] bg-base-100 gap-2 text-base-content transition-opacity duration-700 ${
        isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Logo */}
      <div>
        <img
          src="https://cdn.locket-dio.com/v1/images/apple-touch-icon.png"
          alt="Locket Dio"
          loading="lazy"
          className="w-20 h-20 shadow-md rounded-2xl loading-bounce-y"
        />
      </div>
      <h1 className="text-xl font-semibold">The Page is loading.</h1>
      <p className="text-sm opacity-70 animate-pulse">
        Payment Gateway Locket Dio…
      </p>
      <Mirage />
    </div>
  );
};

export default LoadingPage;
