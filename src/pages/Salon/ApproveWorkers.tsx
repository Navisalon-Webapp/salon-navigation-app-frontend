import React, { useEffect, useState } from "react";

type Worker = {
  id: string;
  name: string;
  email: string;
  specialty?: string;
};

const ApproveWorkers: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [approvedWorkers, setApprovedWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingApproved, setLoadingApproved] = useState<boolean>(false);

  // Simple loader with mock data for now
  const loadPendingWorkers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/worker/pending/`, {
        credentials: "include"
      });

      const data = await res.json();
      setWorkers(data);
    } catch (e) {
      console.error("Failed to load pending workers", e);
    } finally {
      setLoading(false);
    }
  };

  const loadApprovedWorkers = async () => {
    setLoadingApproved(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/worker/approved`, {
        credentials: "include"
      });

      const data = await res.json();
      setApprovedWorkers(data);
    } catch (e) {
      console.error("Failed to load pending workers", e);
    } finally {
      setLoadingApproved(false);
    }
  };

  useEffect(() => {
    loadPendingWorkers();
  }, []);

  useEffect(() => {
    loadApprovedWorkers();
  }, []);

  const handleApprove = async (id: string) => {
    const w = workers.find((x) => x.id === id);
    console.log("Approve worker", w);
    await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/worker/${id}/approve`, {
      method: "POST",
      credentials: "include"
    });
    setWorkers((list) => list.filter((x) => x.id !== id));
  };

  const handleReject = async (id: string) => {
    const w = workers.find((x) => x.id === id);
    console.log("Reject worker", w);
    await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/worker/${id}/reject`, {
      method: "POST",
      credentials: "include"
    });
    setWorkers((list) => list.filter((x) => x.id !== id));
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
          Approve Workers
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

          {!loading && workers.length === 0 && (
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
            workers.map((w) => (
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
                  <div style={{ opacity: 0.9 }}>{w.email}</div>
                  {w.specialty && (
                    <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>
                      {w.specialty}
                    </div>
                  )}
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

        <h1
          style={{
            fontSize: "1.875rem",
            fontWeight: 600,
            textAlign: "center",
            color: "#FFFFFF",
            marginBottom: "1.5rem",
            marginTop: "1.5rem"
          }}
        >
          Employees
        </h1>
        
        {/* List */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {loadingApproved && (
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
              Loading employees...
            </div>
          )}

          {!loadingApproved && approvedWorkers.length === 0 && (
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
              No approved employees.
            </div>
          )}

          {!loadingApproved &&
            approvedWorkers.map((w) => (
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
                  <div style={{ opacity: 0.9 }}>{w.email}</div>
                  {w.specialty && (
                    <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>
                      {w.specialty}
                    </div>
                  )}
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

export default ApproveWorkers;
