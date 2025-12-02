import React, { useState, useEffect } from "react";

type Service = {
  id: string;
  name: string;
  durationMin: number; // minutes
  priceUsd: number; // dollars
};

// Simple styles, same palette as Auth pages
const cardStyle: React.CSSProperties = {
  backgroundColor: "#563727",
  border: "1px solid #7A431D",
  borderRadius: "0.5rem",
  padding: "1rem",
  color: "#FFFFFF",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "1rem 1.5rem",
  borderRadius: "0.5rem",
  backgroundColor: "#563727",
  border: "1px solid #7A431D",
  color: "#FFFFFF",
  outline: "none",
};

const buttonPrimary: React.CSSProperties = {
  padding: "0.75rem 1.25rem",
  fontWeight: 600,
  borderRadius: "0.5rem",
  backgroundColor: "#DE9E48",
  color: "#372C2E",
  border: "none",
  cursor: "pointer",
};

const buttonGhost: React.CSSProperties = {
  padding: "0.75rem 1.25rem",
  fontWeight: 600,
  borderRadius: "0.5rem",
  backgroundColor: "transparent",
  color: "#FFFFFF",
  border: "1px solid #7A431D",
  cursor: "pointer",
};

async function loadInitialServices(bid: number): Promise<Service[]> {
  const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/services/`, {
  credentials: "include",
});
  if (!res.ok) throw new Error("Failed to load services");
  return await res.json();
}


const ManageServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const bid = 1;
    loadInitialServices(bid)
      .then(setServices)
      .catch((err) => console.error(err));
  }, []);


  // Create form (stacked like Sign Up)
  const [name, setName] = useState("");
  const [durationMin, setDurationMin] = useState("");
  const [priceUsd, setPriceUsd] = useState("");

  // Edit form (simple toggle per item)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDurationMin, setEditDurationMin] = useState("");
  const [editPriceUsd, setEditPriceUsd] = useState("");

  const addService = async () => {
    const n = name.trim();
    const d = parseInt(durationMin, 10);
    const p = parseFloat(priceUsd);
    if (!n || isNaN(d) || isNaN(p)) return;

    const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/services/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name: n, durationMin: d, priceUsd: p }),
    });

    if (!res.ok) {
      console.error(await res.text());
      return;
    }
    const newService = await res.json();
    setServices([newService, ...services]);
    setName("");
    setDurationMin("");
    setPriceUsd("");
  }

  function startEdit(s: Service) {
    setEditingId(s.id);
    setEditName(s.name);
    setEditDurationMin(String(s.durationMin));
    setEditPriceUsd(String(s.priceUsd));
  }

  const saveEdit = async (id: string) => {
    const n = editName.trim();
    const d = parseInt(editDurationMin, 10);
    const p = parseFloat(editPriceUsd);
    if (!n || isNaN(d) || isNaN(p)) return;
    const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/services/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name: n, durationMin: d, priceUsd: p }),
  });

  if (res.ok) {
    setServices(
      services.map((s) =>
        s.id === id ? { ...s, name: n, durationMin: d, priceUsd: p } : s
      )
    );
    setEditingId(null);
  }
  }

  const remove = async (id: string) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/services/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (res.ok) setServices(services.filter((s) => s.id !== id));
  }

  return (
    <div style={{ position: "relative" }}>
      {/* Page-only background */}
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
        Manage Services
      </h1>

      {/* Create new service (stacked inputs) */}
      <div style={{ ...cardStyle, marginBottom: "1rem" }}>
        <h2
          style={{ marginTop: 0, marginBottom: "0.75rem", fontSize: "1.1rem" }}
        >
          Add a service
        </h2>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <input
            type="text"
            placeholder="Service name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="Duration (minutes)"
            value={durationMin}
            onChange={(e) => setDurationMin(e.target.value)}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="Price (USD)"
            value={priceUsd}
            onChange={(e) => setPriceUsd(e.target.value)}
            style={inputStyle}
          />
          <div>
            <button onClick={addService} style={buttonPrimary}>
              Add
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.75rem" }}
      >
        {services.map((s) => (
          <div key={s.id} style={cardStyle}>
            {editingId === s.id ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={inputStyle}
                />
                <input
                  type="number"
                  value={editDurationMin}
                  onChange={(e) => setEditDurationMin(e.target.value)}
                  style={inputStyle}
                />
                <input
                  type="number"
                  value={editPriceUsd}
                  onChange={(e) => setEditPriceUsd(e.target.value)}
                  style={inputStyle}
                />
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => saveEdit(s.id)} style={buttonPrimary}>
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    style={buttonGhost}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.35rem",
                }}
              >
                <div style={{ fontWeight: 600 }}>{s.name}</div>
                <div>
                  {s.durationMin} min • ${s.priceUsd.toFixed(2)}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginTop: "0.25rem",
                  }}
                >
                  <button onClick={() => startEdit(s)} style={buttonGhost}>
                    Edit
                  </button>
                  <button onClick={() => remove(s.id)} style={buttonGhost}>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {services.length === 0 && (
          <div style={{ ...cardStyle, opacity: 0.9 }}>
            No services yet. Add your first one above.
          </div>
        )}
      </div>

      <style>{`
        input::placeholder { color: rgba(255, 255, 255, 0.5); }
        input:focus { border-color: #DE9E48 !important; }
      `}</style>
    </div>
  );
};

export default ManageServices;
