import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";

const API = "http://localhost:5000";
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "1rem 1.5rem",
  borderRadius: "0.5rem",
  backgroundColor: "#563727",
  border: "1px solid #7A431D",
  color: "#FFFFFF",
  outline: "none",
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "#563727",
  border: "1px solid #7A431D",
  borderRadius: "0.5rem",
  padding: "1rem",
  color: "#FFFFFF",
};

const buttonPrimary: React.CSSProperties = {
  padding: "0.75rem 4rem",
  fontWeight: 600,
  borderRadius: "0.5rem",
  backgroundColor: "#DE9E48",
  color: "#372C2E",
  border: "none",
  cursor: "pointer",
};

type Salon = {
  uid: number;
  bid: number;
  name: string;
};

const SalonReview: React.FC = () => {
  const { user } = useAuth();
  const [salons, setSalons] = useState<Salon[]>([]);
  const [salon, setSalon] = useState("");
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch salons from backend
  useEffect(() => {
    async function fetchSalons() {
      try {
        const res = await fetch(`${API}/list-business`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setSalons(data);
        }
      } catch (err) {
        console.error("Failed to fetch salons:", err);
      }
    }
    fetchSalons();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitted(false);

    const r = parseInt(rating, 10);
    if (!salon || !r || !comment.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/api/client/leave-business-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          bid: parseInt(salon, 10),
          cid: parseInt(user!.id, 10),
          rating: r,
          comment: comment.trim(),
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setSalon("");
        setRating("");
        setComment("");
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to submit review");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("An error occurred while submitting your review");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ position: "relative" }}>
      {/* Page-only background layer */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          background: "#372C2E",
          zIndex: -1,
        }}
      />

      <h1
        style={{
          color: "#FFFFFF",
          fontSize: "1.75rem",
          fontWeight: 600,
          marginBottom: "1rem",
        }}
      >
        Leave a Review
      </h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: 520 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Select Salon */}
          <select
            value={salon}
            onChange={(e) => setSalon(e.target.value)}
            style={inputStyle}
          >
            <option value="">Select Salon</option>
            {salons.map((s) => (
              <option key={s.bid} value={s.bid}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Rating */}
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            style={inputStyle}
          >
            <option value="">Rating (1-5)</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>

          {/* Comment */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            rows={5}
            style={{ ...inputStyle, resize: "vertical" }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "0.5rem",
            }}
          >
            <button type="submit" style={buttonPrimary} disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>

          {error && (
            <div style={{ ...cardStyle, backgroundColor: "#8B4513" }}>
              {error}
            </div>
          )}

          {submitted && (
            <div style={{ ...cardStyle }}>
              Thank you! Your review has been submitted.
            </div>
          )}
        </div>
      </form>

      <style>{`
        select::placeholder, textarea::placeholder { color: rgba(255, 255, 255, 0.5); }
        select:focus, textarea:focus { border-color: #DE9E48 !important; }
      `}</style>
    </div>
  );
};

export default SalonReview;
