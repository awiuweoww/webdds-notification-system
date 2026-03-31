/**
 * Created Date       : 31-03-2026
 * Description        : Main Application component for fe-posko.
 *
 * Changelog:
 * - 0.1.0 (31-03-2026): Initial implementation.
 */
import React, { useState } from "react";
import Header from "./components/Header.tsx";
import Sidebar from "./components/Sidebar.tsx";
import MainForm from "./components/MainForm.tsx";

/**
 * Main App component.
 * @returns The rendered application.
 */
export default function App() {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-white font-montserrat text-[#1a2332]">
      <Header 
        showNotifications={showNotifications} 
        setShowNotifications={setShowNotifications} 
      />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-white p-10 relative">
          <div className="max-w-4xl mx-auto">
            <MainForm />
          </div>
        </main>
      </div>
    </div>
  );
}
