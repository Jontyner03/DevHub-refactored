import { Navigate } from "react-router-dom";

//wrapper component to protect routes that require authentication
// if the user is not authenticated, redirect to login page
export default function RequireAuth({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  //If the user is authenticated, render the children components

  return children;
}