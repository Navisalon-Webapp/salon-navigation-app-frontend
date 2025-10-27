import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { Role } from "./AuthContext";

export function RequireAuth() {
  const { user } = useAuth();
  const loc = useLocation();

  console.log("[RequireAuth] Checking auth:", user);

  if (!user) {
    console.warn("[RequireAuth] No user found, redirecting to SignIn.", {
      from: loc.pathname,
    });
    return <Navigate to="/" replace state={{ from: loc }} />;
  }

  console.log("[RequireAuth] Authenticated user:", user);
  return <Outlet />;
}

export function RequireRole({ allow }: { allow: Role[] }) {
  const { user } = useAuth();

  console.log("[RequireRole] Checking role guard...");
  console.log("[RequireRole] Allowed roles:", allow);
  console.log("[RequireRole] Current user:", user);

  if (!user) {
    console.warn("[RequireRole] No user in context → redirect to SignIn");
    return <Navigate to="/" replace />;
  }

  const hasAccess = allow.includes(user.role);
  console.log(
    `[RequireRole] Role check: user.role='${user.role}' allowed=${hasAccess}`
  );

  if (!hasAccess) {
    console.warn(
      "[RequireRole] Unauthorized access. Redirecting to /unauthorized.",
      { role: user.role, allowed: allow }
    );
    return <Navigate to="/unauthorized" replace />;
  }

  console.log("[RequireRole] Access granted for role:", user.role);
  return <Outlet />;
}
