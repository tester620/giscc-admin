import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="navbar fixed top-0 w-full z-50 bg-gray-900 shadow-lg px-6 md:px-12 py-3">
      <div className="flex-1">
        <Link to="/dashboard" className="flex items-center gap-4">
          <img
            src="/Logo.png"
            alt="Garvita Infrastructure Logo"
            className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover"
          />
          <span className="text-xl md:text-2xl font-bold tracking-tight text-white">
            <span className="text-blue-400">Garvita</span>{' '}
            <span className="text-cyan-300">Infrastructure</span>
          </span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
