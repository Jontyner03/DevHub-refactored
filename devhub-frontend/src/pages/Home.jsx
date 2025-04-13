import { Link, Navigate } from "react-router-dom";

export default function Home() {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center text-center bg-gray-900">
      <h1 className="text-5xl font-extrabold text-blue-400 mb-6">Welcome to DevHub</h1>
      <p className="text-lg text-gray-300 mb-8">Showcase your projects and connect with developers.</p>
      <div className="space-x-4">
        <Link
          to="/signup"
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition"
        >
          Sign Up
        </Link>
        <Link
          to="/login"
          className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg shadow hover:bg-gray-600 transition"
        >
          Log In
        </Link>
      </div>
    </div>
  );
}