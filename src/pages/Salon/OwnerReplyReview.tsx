import React, { useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

type Review = {
  id: string;
  reviewerName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  reply?: {
    text: string;
    createdAt: string;
  };
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "#563727",
  border: "1px solid #7A431D",
  borderRadius: "0.5rem",
  padding: "1rem",
  color: "#FFFFFF",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  borderRadius: "0.5rem",
  backgroundColor: "#563727",
  border: "1px solid #7A431D",
  color: "#FFFFFF",
  outline: "none",
};

// Fetch reviews from backend
async function getReviews(): Promise<Review[]> {
  try {
    const res = await fetch(`${API}/api/owner/get-business-reviews`, {
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
    return [];
  } catch (err) {
    console.error("Failed to fetch reviews:", err);
    return [];
  }
}

// Post reply to backend
async function postReply(reviewId: string, text: string) {
  try {
    const res = await fetch(`${API}/api/user/leave-reply-review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        rvw_id: parseInt(reviewId, 10),
        comment: text,
      }),
    });
    
    if (res.ok) {
      return { ok: true };
    } else {
      const errorData = await res.json();
      console.error("Failed to post reply:", errorData);
      return { ok: false, error: errorData.message };
    }
  } catch (err) {
    console.error("Error posting reply:", err);
    return { ok: false, error: "Network error" };
  }
}

const OwnerReplyReview: React.FC = () => {
  const [search, setSearch] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load reviews from backend
  React.useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await getReviews();
      setReviews(data);
      setLoading(false);
    })();
  }, []);

  function stars(n: number) {
    const filled = "★".repeat(Math.max(0, Math.min(5, n)));
    const empty = "☆".repeat(5 - Math.max(0, Math.min(5, n)));
    return (
      <span aria-label={`Rating ${n} out of 5`}>
        <span style={{ color: "#DE9E48" }}>{filled}</span>
        <span style={{ color: "#7A431D" }}>{empty}</span>
      </span>
    );
  }

  function openReply(id: string, existing?: string) {
    setActiveId(id);
    setReplyText(existing || "");
  }

  async function submitReply(reviewId: string) {
    const text = replyText.trim();
    if (!text) return;
    
    setError("");
    setLoading(true);
    
    // Backend hook
    const result = await postReply(reviewId, text);
    
    setLoading(false);
    
    if (result.ok) {
      // Update UI
      setReviews((list) =>
        list.map((r) =>
          r.id === reviewId
            ? { ...r, reply: { text, createdAt: new Date().toISOString() } }
            : r
        )
      );
      setActiveId(null);
      setReplyText("");
    } else {
      setError(result.error || "Failed to submit reply");
    }
  }

  const filtered = reviews.filter((r) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      r.reviewerName.toLowerCase().includes(q) ||
      r.comment.toLowerCase().includes(q)
    );
  });

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
        Owner Replies to Reviews
      </h1>

      {loading && (
        <div style={{ ...cardStyle, marginBottom: "1rem" }}>
          Loading reviews...
        </div>
      )}

      {error && (
        <div style={{ ...cardStyle, marginBottom: "1rem", backgroundColor: "#8B4513" }}>
          {error}
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search by reviewer or text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Reviews list */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.75rem" }}
      >
        {filtered.map((r) => (
          <div key={r.id} style={cardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.35rem",
                }}
              >
                <div style={{ fontWeight: 600, fontSize: "1.1rem" }}>
                  {r.reviewerName}
                </div>
                <div>{stars(r.rating)}</div>
                <div style={{ opacity: 0.95 }}>{r.comment}</div>
                <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                  Reviewed {new Date(r.createdAt).toLocaleString()}
                </div>

                {r.reply && (
                  <div
                    style={{
                      marginTop: "0.5rem",
                      paddingTop: "0.5rem",
                      borderTop: "1px solid #7A431D",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                        marginBottom: 4,
                        color: "#DE9E48",
                      }}
                    >
                      Owner reply
                    </div>
                    <div style={{ opacity: 0.95 }}>{r.reply.text}</div>
                    <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                      Replied {new Date(r.reply.createdAt).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "flex-start",
                }}
              >
                {activeId === r.id ? (
                  <div style={{ width: 340, maxWidth: "100%" }}>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write your reply..."
                      rows={4}
                      style={{ ...inputStyle, resize: "vertical" }}
                    />
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        marginTop: "0.5rem",
                      }}
                    >
                      <button
                        onClick={() => submitReply(r.id)}
                        disabled={loading}
                        style={{
                          padding: "0.6rem 1rem",
                          fontWeight: 600,
                          borderRadius: "0.5rem",
                          backgroundColor: loading ? "#999" : "#DE9E48",
                          color: "#372C2E",
                          border: "none",
                          cursor: loading ? "not-allowed" : "pointer",
                        }}
                      >
                        {loading ? "Posting..." : "Post reply"}
                      </button>
                      <button
                        onClick={() => {
                          setActiveId(null);
                          setReplyText("");
                        }}
                        style={{
                          padding: "0.6rem 1rem",
                          fontWeight: 600,
                          borderRadius: "0.5rem",
                          backgroundColor: "transparent",
                          color: "#FFFFFF",
                          border: "1px solid #7A431D",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => openReply(r.id, r.reply?.text)}
                    style={{
                      padding: "0.6rem 1rem",
                      fontWeight: 600,
                      borderRadius: "0.5rem",
                      backgroundColor: "transparent",
                      color: "#FFFFFF",
                      border: "1px solid #7A431D",
                      cursor: "pointer",
                    }}
                  >
                    Reply
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ ...cardStyle, opacity: 0.9 }}>No reviews found.</div>
        )}
      </div>

      <style>{`
        input::placeholder, textarea::placeholder { color: rgba(255, 255, 255, 0.5); }
        input:focus, textarea:focus { border-color: #DE9E48 !important; }
      `}</style>
    </div>
  );
};

export default OwnerReplyReview;
