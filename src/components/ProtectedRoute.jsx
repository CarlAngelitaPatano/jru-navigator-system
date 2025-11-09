// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user")); // get user from localStorage

  if (!user) {
    return <Navigate to="/login" />; // not logged in
  }

  if (role && user.role !== role) {
    return <Navigate to="/campus-map" />; // not authorized
  }

  return children;
};

export default ProtectedRoute;
