import React from "react";
import Navbar from "../components/navigation/navbar";

export default function MainLayout({ children }) {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Navbar Component */}
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-grow p-4">{children}</main>
      
      {/* Footer */}
      <footer className="bg-black text-center p-4 text-sm">
        © {new Date().getFullYear()} Betting Platform. NEXUSQUEST. All rights reserved.
      </footer>
    </div>
  );
}
