import React from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

/**
 * ProtectedRoute component — guards routes that require login.
 * If token exists in localStorage, it renders the child component.
 * Otherwise, redirects to /login and shows a toast.
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    toast.error("Please login to access this page");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
