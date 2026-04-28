import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");
  const { currentUser } = useAuth();

  if (token && currentUser) {
    const role = currentUser.role?.toLowerCase();

    if (role === "doctor") {
      return <Navigate to="/doctor-dashboard" replace />;
    }

    if (role === "patient") {
      return <Navigate to="/doctor-page" replace />;
    }
  }

  return children;
};

export default PublicRoute;