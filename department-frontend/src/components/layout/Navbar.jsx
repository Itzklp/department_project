import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('isFirstLogin');
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `text-base font-medium transition-colors duration-200 px-1 py-5 border-b-2 ${
      isActive
        ? 'text-blue-800 border-blue-800'
        : 'text-gray-600 border-transparent hover:text-blue-800 hover:border-blue-300'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-base font-medium ${
      isActive
        ? 'text-blue-800 bg-blue-50'
        : 'text-gray-600 hover:text-blue-800 hover:bg-gray-50'
    }`;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-3">
              <img 
                src="/1200px-BITS_Pilani-Logo.svg.png" 
                alt="BITS Pilani Logo" 
                className="h-12 w-auto object-contain"
              />
              <div className="flex flex-col justify-center">
                <span className="text-lg font-bold text-gray-900 leading-tight tracking-tight">
                  BITS Pilani
                </span>
                <span className="text-sm font-medium text-blue-800 leading-tight">
                  CISIS Department
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/analytics" className={navLinkClass}>
              Analytics
            </NavLink>
            <NavLink to="/quick-actions" className={navLinkClass}>
              Quick Actions
            </NavLink>

            <button 
              onClick={handleLogout}
              className="ml-4 flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink 
              to="/dashboard" 
              className={mobileNavLinkClass}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/analytics" 
              className={mobileNavLinkClass}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Analytics
            </NavLink>
            <NavLink 
              to="/quick-actions" 
              className={mobileNavLinkClass}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Quick Actions
            </NavLink>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;