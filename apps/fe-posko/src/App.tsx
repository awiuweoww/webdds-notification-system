/**
 * Created Date       : 31-03-2026
 * Description        : Komponen Aplikasi Utama untuk fe-posko.
 *
 * Changelog:
 * - 0.1.0 (31-03-2026): Implementasi awal.
 * - 0.2.0 (31-03-2026): Refactor — state notifikasi dipindah ke Header via useNotification.
 * - 0.3.0 (31-03-2026): Integrasi usePoskoSync (koneksi WebDDS).
 */
import React from "react";
import Header from "./components/Header.tsx";
import Sidebar from "./components/Sidebar.tsx";
import MainForm from "./components/MainForm.tsx";
import { usePoskoSync } from "./hooks/usePoskoSync";

/**
 * Komponen Aplikasi Utama.
 * Merakit layout Header, Sidebar, dan MainForm.
 * usePoskoSync membuka koneksi WebDDS agar publish() bisa berfungsi.
 * @returns Aplikasi yang telah dirender.
 */
export default function App() {
  const { connectionStatus } = usePoskoSync();
  console.log("[App Posko] Status koneksi:", connectionStatus);
  return (
    <div className="h-screen flex flex-col bg-white font-montserrat text-[#1a2332]">
      <Header />
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
