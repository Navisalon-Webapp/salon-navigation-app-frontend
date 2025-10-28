import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const NavisalonSignIn: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    console.log("[Signin] submitting", { email });

    try {
      const res = await fetch("http://localhost:5000/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));
      console.log("[Signin] response", res.status, data);

      if (!res.ok || data.status !== "success") {
        setError(data.message || "Invalid credentials");
        return;
      }

      const role: "customer" | "business" | "employee" | "admin" = data.role;
      // Update auth context
      signIn({
        id: String(data.User_ID),
        name: data.name ?? email,
        role,
      });

      // Role-based redirect
      const landing: Record<typeof role, string> = {
        customer: "/customer/home",
        business: "/business/home",
        employee: "/employee/home",
        admin: "/customer/home", // update when we have an admin page
      };

      console.log("[Signin] navigating to", landing[role]);
      navigate(landing[role], { replace: true });
    } catch (err) {
      console.error("[Signin] fetch error", err);
      setError("Something went wrong during sign in.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    navigate("/SignUp");
  };

  return (
    <div
      className="flex items-center justify-center p-4"
      style={{
        background: "#372C2E",
        minHeight: "100vh",
        width: "100%",
        position: "fixed",
        inset: 0,
      }}
    >
      <div style={{ width: "100%", maxWidth: 400, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "center", margin: "4rem 0 3rem" }}>
          <img src="navisalon.png" alt="Navisalon" style={{ height: 150 }} />
        </div>

        <h1
          style={{
            fontSize: "1.875rem",
            fontWeight: 600,
            textAlign: "center",
            color: "#FFFFFF",
            marginBottom: "2rem",
          }}
        >
          Sign In
        </h1>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <input
            type="email"
            placeholder="Email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "1rem 1.5rem",
              borderRadius: "0.5rem",
              backgroundColor: "#563727",
              border: "1px solid #7A431D",
              color: "#FFFFFF",
              outline: "none",
              transition: "all 0.2s",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "1rem 1.5rem",
              borderRadius: "0.5rem",
              backgroundColor: "#563727",
              border: "1px solid #7A431D",
              color: "#FFFFFF",
              outline: "none",
              transition: "all 0.2s",
            }}
          />

          <div style={{ display: "flex", justifyContent: "center", marginTop: "0.5rem" }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "0.75rem 4rem",
                fontWeight: 600,
                borderRadius: "0.5rem",
                backgroundColor: "#DE9E48",
                color: "#372C2E",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </div>
        </form>

        {error && (
          <p style={{ color: "#ff7b7b", textAlign: "center", marginTop: "1rem", fontWeight: 500 }}>
            {error}
          </p>
        )}

        <div style={{ marginTop: "2rem" }}>
          <button
            type="button"
            onClick={handleSignUp}
            style={{
              width: "100%",
              padding: "1rem 1.5rem",
              borderRadius: "0.5rem",
              backgroundColor: "transparent",
              border: "1px solid #7A431D",
              color: "#FFFFFF",
              cursor: "pointer",
            }}
          >
            Don't have an account? Sign Up
          </button>
        </div>
      </div>

      <style>{`
        input::placeholder { color: rgba(255, 255, 255, 0.5); }
        input:focus { border-color: #DE9E48 !important; }
      `}</style>
    </div>
  );
};

export default NavisalonSignIn;
