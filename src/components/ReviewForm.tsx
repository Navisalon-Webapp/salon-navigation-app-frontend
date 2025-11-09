import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  borderRadius: "0.5rem",
  backgroundColor: "#372C2E",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "#FFFFFF",
  outline: "none",
};

const buttonPrimary: React.CSSProperties = {
  padding: "0.5rem 0.75rem",
  fontWeight: 600,
  borderRadius: "0.5rem",
  backgroundColor: "#DE9E48",
  color: "#372C2E",
  border: "none",
  cursor: "pointer",
};

type Props = {
  uid?: number | null; 
  bid?: number | null;
  eid?: number | null;
};

const ReviewForm: React.FC<Props> = ({ uid = null, bid = null, eid = null }) => {
  const [comments, setComments] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
    const { user } = useAuth();

  const submit = async () => {
    setMessage(null);
    if (!comments.trim()) {
      setMessage("Please enter your review.");
      return;
    }

      const payload: any = { comments: comments.trim() };
      if (user && user.id) {
        const parsed = parseInt(String(user.id), 10);
        if (!isNaN(parsed)) payload.uid = parsed;
      } else if (uid !== null && uid !== undefined) {
        payload.uid = uid;
      }

      if (eid !== null && eid !== undefined) {
        payload.eid = eid;
      } else if (bid !== null && bid !== undefined) {
        payload.bid = bid;
      }

    setBusy(true);
    try {
      const res = await fetch("http://localhost:5000/api/user/leave-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        try {
          const json = JSON.parse(text || "{}");
          setMessage(json.message || `Server returned ${res.status}`);
        } catch {
          setMessage(text || `Server returned ${res.status}`);
        }
      } else {
        setMessage("Review submitted successfully.");
        setComments("");
      }
    } catch (err) {
      setMessage("Could not contact backend. The review will be saved when the backend is ready.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ marginTop: 16 }}>
      <h3 style={{ marginTop: 0, color: "#FFFFFF" }}>Leave a review</h3>
      <textarea
        placeholder="Tell others about your experience..."
        value={comments}
        onChange={(e) => setComments(e.target.value)}
        style={{ ...inputStyle, minHeight: 100 }}
      />
      <div style={{ marginTop: 8 }}>
        <button onClick={submit} style={buttonPrimary} disabled={busy}>
          {busy ? "Submitting…" : "Submit Review"}
        </button>
      </div>
      {message && <div style={{ marginTop: 8, color: "#FFFFFF" }}>{message}</div>}
    </div>
  );
};

export default ReviewForm;
