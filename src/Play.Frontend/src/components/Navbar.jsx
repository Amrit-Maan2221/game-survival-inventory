import { useState } from "react";
import { NavLink, Link } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const activeStyle = ({ isActive }) => 
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? "text-orange-500 bg-gray-800" : "text-gray-300 hover:text-white hover:bg-gray-700"
    }`;

  const mobileActiveStyle = ({ isActive }) => 
    `block px-3 py-2 rounded-md text-base font-medium ${
      isActive ? "text-orange-500 bg-gray-800" : "text-gray-300 hover:text-white hover:bg-gray-800"
    }`;

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src="/logo.png" 
                alt="Survival Logo" 
                className="w-8 h-8 object-contain transition-transform group-hover:scale-110"
              />
              <span className="text-xl font-bold tracking-tighter text-white">
                SURVIVAL
              </span>
            </Link>

            {/* Desktop Links - Hidden on Mobile */}
            <div className="hidden md:flex items-baseline space-x-4">
              <NavLink to="/" className={activeStyle}>Home</NavLink>
              <NavLink to="/catalog" className={activeStyle}>Catalog</NavLink>
              <NavLink to="/inventory" className={activeStyle}>Inventory</NavLink>
            </div>
          </div>

          {/* Hamburger Icon - Hidden on Desktop */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Shown/Hidden based on state */}
      <div className={`${isOpen ? "block" : "hidden"} md:hidden bg-gray-900 border-b border-gray-800 px-2 pt-2 pb-3 space-y-1`}>
        <NavLink to="/" onClick={() => setIsOpen(false)} className={mobileActiveStyle}>Home</NavLink>
        <NavLink to="/catalog" onClick={() => setIsOpen(false)} className={mobileActiveStyle}>Catalog</NavLink>
        <NavLink to="/inventory" onClick={() => setIsOpen(false)} className={mobileActiveStyle}>Inventory</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;