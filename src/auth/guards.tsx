import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { roleHome } from "./roleHome";
import type { Role } from "./AuthContext";

export function RequireAuth() {
  const { user, loading } = useAuth();
  const loc = useLocation();

  if (loading) return <div />;        // or a spinner
  if (!user)   return <Navigate to="/" replace state={{ from: loc }} />;
  return <Outlet />;
}

export function RequireRole({ allow }: { allow: Role[] }) {
  const { user, loading } = useAuth();
  if (loading) return <div />;
  if (!user)   return <Navigate to="/" replace />;
  return allow.includes(user.role) ? <Outlet /> : <Navigate to="/unauthorized" replace />;
}

export function PublicOnly({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div />; // wait for /user-session
  if (user)    return <Navigate to={roleHome(user.role)} replace />;
  return <>{children}</>;
}
