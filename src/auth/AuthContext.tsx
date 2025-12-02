import React, { createContext, useContext, useEffect, useState } from "react";

export type Role = "customer" | "business" | "employee" | "admin";
export type User = { id: string; name: string; role: Role } | null;

type AuthCtx = {
  user: User;
  loading: boolean;
  signIn: (u: NonNullable<User>) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/user-session`, { method: "GET", credentials: "include" });

        if (res.ok) {
          const data = await res.json();
          setUser({
            id: String(data.User_ID),
            name: `${data["first name"]} ${data["last name"]}`.trim(),
            role: data.role,
          });
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signIn = (u: NonNullable<User>) => setUser(u);

  const signOut = async () => {
    try {
      await fetch(`${API}/logout`, { method: "POST", credentials: "include" });
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
