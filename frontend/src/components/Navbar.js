import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-orange-400 via-pink-500 to-red-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/">
          <h1 className="text-xl font-bold">Pets.AI</h1>
        </Link>

        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="hover:underline">
              Examples
            </Link>
          </li>
          <li>
            <Link to="/verify" className="hover:underline">
              Verify
            </Link>
          </li>
          <li>
            <Link to="/signup" className="hover:underline">
              signup
            </Link>
          </li>
          <li>
            <Link
              to="/pets">
              Pets
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700">
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
