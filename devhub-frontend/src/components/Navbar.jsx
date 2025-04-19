import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 shadow-lg p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-blue-400 hover:text-blue-500 transition"
        >
          DevHub
        </Link>
        <button
          className="lg:hidden text-gray-400 hover:text-gray-200 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
        <div
          className={`lg:flex ${
            isMenuOpen ? "block" : "hidden"
          } space-x-4 items-center`}
        >
          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className="text-gray-300 hover:text-blue-400 transition"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="text-gray-300 hover:text-blue-400 transition"
              >
                Profile
              </Link>
              <Link
                to="/create-project"
                className="text-gray-300 hover:text-blue-400 transition"
              >
                Create Project
              </Link>
              <Link
                to="/explore"
                className="text-gray-300 hover:text-blue-400 transition"
              >
                Explore
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="text-gray-300 hover:text-blue-400 transition"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="text-gray-300 hover:text-blue-400 transition"
              >
                Log In
              </Link>
              <Link
                to="/explore"
                className="text-gray-300 hover:text-blue-400 transition"
              >
                Explore
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}