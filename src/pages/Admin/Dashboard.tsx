import React, { useEffect, useState } from "react";

type Salon = {
  id: string;
  name: string;
  email: string;
};

const Dashboard: React.FC = () => {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Simple loader with mock data for now
  const loadPendingSalons = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/admin/pending`, {
        credentials: "include"
      });

      const data = await res.json();
      setSalons(data);
    } catch (e) {
      console.error("Failed to load pending salons", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingSalons();
  }, []);

  const handleApprove = async (id: string) => {
    const w = salons.find((x) => x.id === id);
    console.log("Approve salon", w);
    await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/admin/${id}/approve`, {
      method: "POST",
      credentials: "include"
    });
    setSalons((list) => list.filter((x) => x.id !== id));
    
  };

  const handleReject = async (id: string) => {
    const w = salons.find((x) => x.id === id);
    console.log("Reject salon", w);
    await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/admin/${id}/reject`, {
      method: "POST",
      credentials: "include"
    });
    setSalons((list) => list.filter((x) => x.id !== id));
  };

  return (
    <div style={{ position: "relative" }}>
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          background: "#372C2E",
          zIndex: -1,
        }}
      />
      <div style={{ width: "100%", maxWidth: "700px", margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "1.875rem",
            fontWeight: 600,
            textAlign: "center",
            color: "#FFFFFF",
            marginBottom: "1.5rem",
          }}
        >
          Approve Salons
        </h1>

        {/* List */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {loading && (
            <div
              style={{
                backgroundColor: "#563727",
                border: "1px solid #7A431D",
                borderRadius: "0.5rem",
                padding: "1rem",
                color: "#FFFFFF",
                textAlign: "center",
              }}
            >
              Loading pending requests...
            </div>
          )}

          {!loading && salons.length === 0 && (
            <div
              style={{
                backgroundColor: "#563727",
                border: "1px solid #7A431D",
                borderRadius: "0.5rem",
                padding: "1rem",
                color: "#FFFFFF",
                textAlign: "center",
              }}
            >
              No pending requests.
            </div>
          )}

          {!loading &&
            salons.map((w) => (
              <div
                key={w.id}
                style={{
                  backgroundColor: "#563727",
                  border: "1px solid #7A431D",
                  borderRadius: "0.5rem",
                  padding: "1rem",
                  color: "#FFFFFF",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: "1.1rem" }}>
                    {w.name}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => handleApprove(w.id)}
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
                    onClick={() => handleReject(w.id)}
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
            ))}
        </div>

        <div
          style={{
            color: "#FFFFFF",
            opacity: 0.8,
            marginTop: "1.25rem",
            fontSize: "0.9rem",
          }}
        >
        </div>
      </div>

      <style>{`
        button:hover { filter: brightness(1.05); }
      `}</style>
    </div>
  );
};

export default Dashboard;
