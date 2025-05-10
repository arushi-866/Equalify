import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const searchInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle scroll events to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Simulated login/logout functions (replace with actual authentication logic)
  const handleLogin = () => {
    // Simulated login - in a real app, this would involve actual authentication
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    // Simulated logout - in a real app, this would involve clearing auth tokens, etc.
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-white shadow-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex-shrink-0 flex items-center space-x-2"
              aria-label="Equalify home"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src="https://api.dicebear.com/7.x/shapes/svg?seed=equalify"
                  alt="Equalify Logo"
                  className="h-8 w-8"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-primary-600 font-bold text-xl tracking-tight"
              >
                Equalify
              </motion.div>
            </Link>
            
            {/* Desktop Navigation - Always visible */}
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              <NavLink to="/" icon={<HomeIcon className="h-5 w-5" />} text="Home" isActive={location.pathname === '/'} />
              <NavLink to="/dashboard" icon={<ChartBarIcon className="h-5 w-5" />} text="Dashboard" isActive={location.pathname === '/dashboard'} />
              <NavLink to="/settings" icon={<Cog6ToothIcon className="h-5 w-5" />} text="Settings" isActive={location.pathname === '/settings'} />
              
            </div>
          </div>

          {/* Right side icons and buttons */}
          <div className="flex items-center space-x-4">
            {/* <div className="relative" ref={searchInputRef}>
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "200px", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="absolute right-0 top-0"
                  >
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search..."
                      className="w-full bg-gray-100 rounded-full pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      onKeyDown={(e) => e.key === 'Escape' && setIsSearchOpen(false)}
                    />
                    <button 
                      className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                      onClick={() => setIsSearchOpen(false)}
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                aria-label="Search"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </motion.button>
            </div> */}

            {/* Conditional Rendering for Authentication State */}
            {isAuthenticated ? (
              <>
                {/* Notification icon with badge */}
                {/* <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                    aria-label={`${notifications} unread notifications`}
                  >
                    <BellIcon className="h-5 w-5" />
                    {notifications > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                        {notifications}
                      </span>
                    )}
                  </motion.button>
                </div> */}

                {/* Profile icon */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/profile"
                    className="text-gray-600 hover:text-primary-600 transition-colors"
                    aria-label="User profile"
                  >
                    <UserCircleIcon className="h-8 w-8" />
                  </Link>
                </motion.div>

                {/* Logout button */}
                {/* <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 transition-colors"
                  aria-label="Logout"
                >
                  <ArrowRightOnRectangleIcon className="h-6 w-6" />
                </motion.button> */}
              </>
            ) : (
              // Login button when not authenticated
              <Link
                to="/login"
                onClick={handleLogin}
                className="btn-primary text-sm font-medium px-4 py-2 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors"
              >
                Login
              </Link>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                aria-expanded={mobileMenuOpen}
                aria-label="Main menu"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-lg"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <MobileNavLink to="/" icon={<HomeIcon className="h-5 w-5" />} text="Home" isActive={location.pathname === '/'} />
              <MobileNavLink to="/dashboard" icon={<ChartBarIcon className="h-5 w-5" />} text="Dashboard" isActive={location.pathname === '/dashboard'} />
              
              {/* Settings only visible when authenticated */}
              {isAuthenticated && (
                <MobileNavLink to="/settings" icon={<Cog6ToothIcon className="h-5 w-5" />} text="Settings" isActive={location.pathname === '/settings'} />
              )}

              {isAuthenticated ? (
                <div className="pt-4 pb-2 border-t border-gray-200 flex space-x-4">
                  <Link
                    to="/profile"
                    className="flex-1 text-center py-2 px-4 rounded-md bg-gray-100 text-gray-800 font-medium hover:bg-gray-200"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex-1 text-center py-2 px-4 rounded-md bg-red-50 text-red-600 font-medium hover:bg-red-100"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-4 pb-2">
                  <Link
                    to="/login"
                    onClick={handleLogin}
                    className="block w-full text-center py-2 px-4 rounded-md bg-primary-600 text-white font-medium hover:bg-primary-700"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// NavLink and MobileNavLink components remain the same
function NavLink({ to, icon, text, isActive }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive 
          ? 'text-primary-600 bg-primary-50'
          : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
      }`}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center space-x-2"
      >
        {icon}
        <span>{text}</span>
      </motion.div>
    </Link>
  );
}

function MobileNavLink({ to, icon, text, isActive }) {
  return (
    <Link
      to={to}
      className={`flex items-center px-3 py-3 rounded-md text-base font-medium transition-colors ${
        isActive 
          ? 'text-primary-600 bg-primary-50'
          : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center space-x-3">
        {icon}
        <span>{text}</span>
      </div>
    </Link>
  );
}