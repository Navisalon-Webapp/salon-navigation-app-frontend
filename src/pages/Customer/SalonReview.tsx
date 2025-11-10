import React, { useState } from "react";

// Very simple client review form (like Sign Up page style)
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

const ClientReview: React.FC = () => {
  const [salon, setSalon] = useState("");
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // TODO: replace with salons from backend
  const salons = ["Salon A", "Salon B", "Salon C"];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const r = parseInt(rating, 10);
    if (!salon || !r || !comment.trim()) return;

    // TODO: POST to backend: /salons/:salonId/reviews with { rating, comment }
    console.log("Submitting review:", { salon, rating: r, comment });

    setSubmitted(true);
    setSalon("");
    setRating("");
    setComment("");
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
              <option key={s} value={s}>
                {s}
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
            <button type="submit" style={buttonPrimary}>
              Submit
            </button>
          </div>

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
