'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Youtube, History, Menu, X } from 'lucide-react';
import { toast } from 'react-toastify';

interface NaveBarProps {
  onLogout: () => void;
}

const NaveBar: React.FC<NaveBarProps> = ({ onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleLogoutClick = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    toast.success("Logged out successfully!");
    router.push('/');
  };

  return (
    <nav className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-8 py-4">
        {/* Logo and Title */}
        <Link href="/summarizer" className="flex items-center gap-2">
          <Youtube className="w-7 h-7 text-red-500" />
          <h1 className="text-lg sm:text-xl font-semibold text-white tracking-wide">
            YT Video Summarizer
          </h1>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/summarizer"
            className="flex items-center gap-2 text-gray-300 hover:text-white px-3 py-2 rounded-lg transition-all duration-200"
          >
            <Youtube className="w-4 h-4" />
            Summarizer
          </Link>
          <Link
            href="/history"
            className="flex items-center gap-2 text-gray-300 hover:text-white px-3 py-2 rounded-lg transition-all duration-200"
          >
            <History className="w-4 h-4" />
            History
          </Link>
          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-gray-300 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-16 left-0 w-full bg-gray-900/95 backdrop-blur-md border-t border-gray-800 shadow-lg transform transition-all duration-300 ${
          menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center py-4 space-y-3">
          <Link
            href="/summarizer"
            onClick={closeMenu}
            className="flex items-center gap-2 text-gray-300 hover:text-white text-lg transition-all"
          >
            <Youtube className="w-5 h-5" /> Summarizer
          </Link>

          <Link
            href="/history"
            onClick={closeMenu}
            className="flex items-center gap-2 text-gray-300 hover:text-white text-lg transition-all"
          >
            <History className="w-5 h-5" /> History
          </Link>

          <button
            onClick={() => {
              handleLogoutClick();
              closeMenu();
            }}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition-all"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NaveBar;
