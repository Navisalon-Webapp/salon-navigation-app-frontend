import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RoleLanding() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;

  switch (user.role) {
    case "customer":
      return <Navigate to="Page2" replace />;
    case "owner":
      return <Navigate to="Salon/ManageServices" replace />;
    case "employee":
      return <Navigate to="worker/ManageAvailability" replace />;
    case "admin":
      return <Navigate to="Page3" replace />;
    default:
      return <Navigate to="/unauthorized" replace />;
  }
}
