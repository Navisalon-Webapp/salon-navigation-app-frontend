import React, { createContext, useContext, useEffect, useState } from "react";

export type Role = "customer" | "owner" | "employee" | "admin";
export type User = { id: string; name: string; role: Role } | null;

type AuthCtx = {
  user: User;
  signIn: (u: NonNullable<User>) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);
const API = "http://127.0.0.1:5000";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/user-session`, { method: "POST", credentials: "include" });

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
      }
    })();
  }, []);

  const signIn = (u: NonNullable<User>) => setUser(u);

  const signOut = async () => {
    try {
      await fetch("/logout", { method: "POST", credentials: "include" });
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
