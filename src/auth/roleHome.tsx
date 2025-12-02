// src/auth/roleHome.ts
import type { Role } from "./AuthContext";

export function roleHome(role: Role): string {
  switch (role) {
    case "customer": return "/customer/home";
    case "business": return "/business/home";
    case "employee": return "/employee/home";
    case "admin":    return "/admin/home";
    default:         return "/";
  }
}
