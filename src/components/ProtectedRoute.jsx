import React from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

/**
 * ✅ ProtectedRoute
 * Blocks access if no valid token exists in localStorage.
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    toast.error("Please login to access this page");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
