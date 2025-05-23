import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-purple-700">FinanceTracker</div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <li>
            <Link to="/" className="hover:text-purple-700">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/transactions" className="hover:text-purple-700">
              Transactions
            </Link>
          </li>
          <li>
            <Link to="/budgets" className="hover:text-purple-700">
              Budgets
            </Link>
          </li>
          <li>
            <Link to="/goals" className="hover:text-purple-700">
              Goals
            </Link>
          </li>
          <li>
            <Link to="/profile" className="hover:text-purple-700">
              Profile
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-700 focus:outline-none"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <ul className="md:hidden bg-white shadow-md">
          <li className="border-b">
            <a
              href="/dashboard"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Dashboard
            </a>
          </li>
          <li className="border-b">
            <a
              href="/transactions"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Transactions
            </a>
          </li>
          <li className="border-b">
            <a
              href="/budgets"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Budgets
            </a>
          </li>
          <li className="border-b">
            <a
              href="/goals"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Goals
            </a>
          </li>
          <li className="border-b">
            <a
              href="/profile"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Profile
            </a>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
