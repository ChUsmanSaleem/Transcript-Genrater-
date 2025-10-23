'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Youtube, History, Globe, Star, Menu, X, LogIn } from 'lucide-react';
import { toast } from 'react-toastify';

interface NaveBarProps {
  onLogout?: () => void;
  isLoggedIn?: boolean;
}

const NaveBar: React.FC<NaveBarProps> = ({ onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem('access_token');
      setIsLoggedIn(!!token);
    };

    checkLogin();

    // Listen for storage changes and window focus to update login state
    const handleStorageChange = () => checkLogin();
    const handleFocus = () => checkLogin();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleLogoutClick = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    toast.success("Logged out successfully!");
    router.push('/');
  };

  const handleLoginClick = () => {
    router.push('/auth/login');
  };

  return (
    <nav className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-8 py-4">
        {/* Logo and Title */}
        <Link href="/" className="flex items-center gap-2">
          <Youtube className="w-7 h-7 text-red-500" />
          <h1 className="text-lg sm:text-xl font-semibold text-white tracking-wide">
            YT Video Summarizer
          </h1>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href={isLoggedIn ? "/public-feed" : "#"}
            onClick={(e) => !isLoggedIn && e.preventDefault()}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
              isLoggedIn
                ? "text-gray-300 hover:text-white"
                : "text-gray-500 cursor-not-allowed"
            }`}
            title={!isLoggedIn ? "Login required" : ""}
          >
            <Globe className="w-4 h-4" />
            Public Summaries
          </Link>
          <Link
            href={isLoggedIn ? "/summarizer" : "#"}
            onClick={(e) => !isLoggedIn && e.preventDefault()}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
              isLoggedIn
                ? "text-gray-300 hover:text-white"
                : "text-gray-500 cursor-not-allowed"
            }`}
            title={!isLoggedIn ? "Login required" : ""}
          >
            <Youtube className="w-4 h-4" />
            Summarizer
          </Link>
          <Link
            href={isLoggedIn ? "/history" : "#"}
            onClick={(e) => !isLoggedIn && e.preventDefault()}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
              isLoggedIn
                ? "text-gray-300 hover:text-white"
                : "text-gray-500 cursor-not-allowed"
            }`}
            title={!isLoggedIn ? "Login required" : ""}
          >
            <History className="w-4 h-4" />
            History
          </Link>
          <Link
            href={isLoggedIn ? "/favorite" : "#"}
            onClick={(e) => !isLoggedIn && e.preventDefault()}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
              isLoggedIn
                ? "text-gray-300 hover:text-white"
                : "text-gray-500 cursor-not-allowed"
            }`}
            title={!isLoggedIn ? "Login required" : ""}
          >
            <Star className="w-4 h-4" />
            Favorites
          </Link>

          {isLoggedIn ? (
            <button
              onClick={handleLogoutClick}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          ) : (
            <button
              onClick={handleLoginClick}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
            >
              <LogIn className="w-4 h-4" />
              Login
            </button>
          )}
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
        className={`md:hidden fixed top-16 left-0 w-full bg-gray-900/95 backdrop-blur-md border-t border-gray-800 shadow-lg transform transition-all duration-300 ${menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'
          }`}
      >
        <div className="flex flex-col items-center py-4 space-y-3">
          <Link
            href={isLoggedIn ? "/" : "#"}
            onClick={(e) => {
              if (!isLoggedIn) e.preventDefault();
              closeMenu();
            }}
            className={`flex items-center gap-2 text-lg transition-all ${
              isLoggedIn
                ? "text-gray-300 hover:text-white"
                : "text-gray-500 cursor-not-allowed"
            }`}
            title={!isLoggedIn ? "Login required" : ""}
          >
            <Globe className="w-5 h-5" /> Public Summaries
          </Link>
          <Link
            href={isLoggedIn ? "/summarizer" : "#"}
            onClick={(e) => {
              if (!isLoggedIn) e.preventDefault();
              closeMenu();
            }}
            className={`flex items-center gap-2 text-lg transition-all ${
              isLoggedIn
                ? "text-gray-300 hover:text-white"
                : "text-gray-500 cursor-not-allowed"
            }`}
            title={!isLoggedIn ? "Login required" : ""}
          >
            <Youtube className="w-5 h-5" /> Summarizer
          </Link>
          <Link
            href={isLoggedIn ? "/history" : "#"}
            onClick={(e) => {
              if (!isLoggedIn) e.preventDefault();
              closeMenu();
            }}
            className={`flex items-center gap-2 text-lg transition-all ${
              isLoggedIn
                ? "text-gray-300 hover:text-white"
                : "text-gray-500 cursor-not-allowed"
            }`}
            title={!isLoggedIn ? "Login required" : ""}
          >
            <History className="w-5 h-5" /> History
          </Link>
          <Link
            href={isLoggedIn ? "/favorite" : "#"}
            onClick={(e) => {
              if (!isLoggedIn) e.preventDefault();
              closeMenu();
            }}
            className={`flex items-center gap-2 text-lg transition-all ${
              isLoggedIn
                ? "text-gray-300 hover:text-white"
                : "text-gray-500 cursor-not-allowed"
            }`}
            title={!isLoggedIn ? "Login required" : ""}
          >
            <Star className="w-5 h-5" /> Favorites
          </Link>

          {isLoggedIn ? (
            <button
              onClick={() => {
                handleLogoutClick();
                closeMenu();
              }}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition-all"
            >
              <LogOut className="w-5 h-5" /> Logout
            </button>
          ) : (
            <button
              onClick={() => {
                handleLoginClick();
                closeMenu();
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-all"
            >
              <LogIn className="w-5 h-5" /> Login
            </button>

            
          )}
        </div>
      </div>
    </nav>
  );
};

export default NaveBar;
