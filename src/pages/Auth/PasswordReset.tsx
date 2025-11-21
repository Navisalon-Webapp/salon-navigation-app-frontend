import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const PasswordReset: React.FC = () => {
  const { uid } = useParams<{ uid: string }>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setError(null);

    if (!uid) {
      setError("Reset link is missing. Please open the link from your email.");
      return;
    }
    if (!password || !confirmPassword) {
      setError("Please enter and confirm your new password.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords must match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, password, confirmPassword }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.status !== "success") {
        setError(data.message || "Failed to reset password.");
        return;
      }

      setStatus("Password reset! You can sign in with your new password.");
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
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
      <div style={{ width: "100%", maxWidth: 440, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "center", margin: "3rem 0 2.5rem" }}>
          <img src="/navisalon.png" alt="Navisalon" style={{ height: 120 }} />
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
          Reset Password
        </h1>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {uid && (
            <p style={{ color: "#FFFFFF", opacity: 0.8, margin: 0 }}>
              Resetting account linked to this email. If you didn't request this, please ignore the email.
            </p>
          )}

          <input
            type="password"
            placeholder="New password"
            autoComplete="new-password"
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

          <input
            type="password"
            placeholder="Confirm new password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.75rem 3rem",
              fontWeight: 600,
              borderRadius: "0.5rem",
              backgroundColor: "#DE9E48",
              color: "#372C2E",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              marginTop: "0.5rem",
            }}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {error && (
          <p style={{ color: "#ff7b7b", textAlign: "center", marginTop: "1rem", fontWeight: 500 }}>
            {error}
          </p>
        )}
        {status && (
          <p style={{ color: "#4BB543", textAlign: "center", marginTop: "1rem", fontWeight: 500 }}>
            {status}
          </p>
        )}

        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <button
            type="button"
            onClick={() => navigate("/", { replace: true })}
            style={{
              padding: "0.75rem 2rem",
              borderRadius: "0.5rem",
              backgroundColor: "transparent",
              border: "1px solid #DE9E48",
              color: "#DE9E48",
              cursor: "pointer",
            }}
          >
            Back to Sign In
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

export default PasswordReset;
