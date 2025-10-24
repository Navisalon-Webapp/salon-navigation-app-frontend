import React, { useMemo, useState } from "react";

interface PendingWorker {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  specialty?: string;
  requestedAt: string; // ISO date string
}

const cardStyle: React.CSSProperties = {
  backgroundColor: "#563727",
  border: "1px solid #7A431D",
  borderRadius: "0.5rem",
  padding: "1rem",
  color: "#FFFFFF",
};

const pillStyleBase: React.CSSProperties = {
  display: "inline-block",
  padding: "0.15rem 0.5rem",
  borderRadius: "999px",
  fontSize: "0.75rem",
  border: "1px solid #7A431D",
  color: "#FFFFFF",
  backgroundColor: "#563727",
};

const ApproveWorkers: React.FC = () => {
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState<PendingWorker[]>([
    {
      id: "w1",
      firstName: "Alex",
      lastName: "Nguyen",
      email: "alex@example.com",
      phone: "(555) 201-4455",
      specialty: "Hair Stylist",
      requestedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
      id: "w2",
      firstName: "Priya",
      lastName: "Patel",
      email: "priya@example.com",
      phone: "(555) 777-9021",
      specialty: "Nail Technician",
      requestedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
  ]);
  const [actionLog, setActionLog] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return pending;
    return pending.filter(
      (w) =>
        `${w.firstName} ${w.lastName}`.toLowerCase().includes(q) ||
        (w.specialty || "").toLowerCase().includes(q) ||
        w.email.toLowerCase().includes(q)
    );
  }, [pending, query]);

  const approve = (id: string) => {
    const w = pending.find((p) => p.id === id);
    setPending((list) => list.filter((p) => p.id !== id));
    setActionLog((log) => [
      `${new Date().toLocaleTimeString()}: Approved ${w?.firstName} ${
        w?.lastName
      }`,
      ...log,
    ]);
    // TODO: Call backend API to approve worker
  };

  const reject = (id: string) => {
    const w = pending.find((p) => p.id === id);
    setPending((list) => list.filter((p) => p.id !== id));
    setActionLog((log) => [
      `${new Date().toLocaleTimeString()}: Rejected ${w?.firstName} ${
        w?.lastName
      }`,
      ...log,
    ]);
    // TODO: Call backend API to reject worker
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Page-only background layer (do not apply globally) */}
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
        Approve Worker Requests
      </h1>

      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          marginBottom: "1rem",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search by name, specialty, or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            borderRadius: "0.5rem",
            backgroundColor: "#563727",
            border: "1px solid #7A431D",
            color: "#FFFFFF",
            outline: "none",
          }}
        />
      </div>

      {/* List */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.75rem" }}
      >
        {filtered.map((w) => (
          <div key={w.id} style={cardStyle}>
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
                  {w.firstName} {w.lastName}
                </div>
                <div style={{ opacity: 0.9 }}>
                  {w.email}
                  {w.phone ? ` • ${w.phone}` : ""}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                  }}
                >
                  {w.specialty && (
                    <span style={pillStyleBase}>{w.specialty}</span>
                  )}
                  <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                    Requested {new Date(w.requestedAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div
                style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
              >
                <button
                  onClick={() => approve(w.id)}
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
                  Approve
                </button>
                <button
                  onClick={() => reject(w.id)}
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
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ ...cardStyle, opacity: 0.9 }}>
            No pending requests match your search.
          </div>
        )}
      </div>

      {/* Action log */}
      {actionLog.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <h2
            style={{
              color: "#FFFFFF",
              fontSize: "1.25rem",
              fontWeight: 600,
              marginBottom: "0.5rem",
            }}
          >
            Recent actions
          </h2>
          <div style={{ ...cardStyle, maxHeight: 200, overflowY: "auto" }}>
            <ul style={{ margin: 0, paddingLeft: "1rem" }}>
              {actionLog.map((l, i) => (
                <li key={i} style={{ margin: "0.25rem 0" }}>
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <style>{`
        input::placeholder { color: rgba(255, 255, 255, 0.5); }
        input:focus { border-color: #DE9E48 !important; }
      `}</style>
    </div>
  );
};

export default ApproveWorkers;
