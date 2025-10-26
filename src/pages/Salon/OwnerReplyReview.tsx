import React, { useState } from "react";

type Review = {
  id: string;
  reviewerName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string; // ISO
  reply?: {
    text: string;
    createdAt: string;
  };
};

// Simple styles that match the Sign In / Sign Up theme
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

// TODO: Replace these with real API calls later
async function getReviews(/* salonId: string */): Promise<Review[]> {
  return [
    {
      id: "r1",
      reviewerName: "Taylor Swift",
      rating: 5,
      comment:
        "Amazing service! My hair looks fantastic and the staff was so friendly.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
      reply: {
        text: "Thank you so much, Taylor! We loved having you.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
      },
    },
    {
      id: "r2",
      reviewerName: "Chris Evans",
      rating: 4,
      comment: "Great cut and style. Booking process was smooth.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
    {
      id: "r3",
      reviewerName: "Jordan Peele",
      rating: 3,
      comment:
        "Good overall, but I waited ~15 minutes past my appointment time.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    },
  ];
}

async function postReply(
  /* salonId: string, */ _reviewId: string,
  _text: string
) {
  // TODO: Implement with fetch when backend is ready
  // await fetch(`${API}/salons/${salonId}/reviews/${reviewId}/reply`, { method: 'POST', body: JSON.stringify({ text }) })
  return { ok: true };
}

const OwnerReplyReview: React.FC = () => {
  const [search, setSearch] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  // Very simple "load" using the mock function above
  React.useEffect(() => {
    (async () => {
      const data = await getReviews();
      setReviews(data);
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
    // Backend hook
    await postReply(reviewId, text);
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
                        style={{
                          padding: "0.6rem 1rem",
                          fontWeight: 600,
                          borderRadius: "0.5rem",
                          backgroundColor: "#DE9E48",
                          color: "#372C2E",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Post reply
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
