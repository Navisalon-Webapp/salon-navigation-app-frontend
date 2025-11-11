import { useState, useEffect } from "react";

const API_BASE = "http://localhost:5000";

type Note = {
  id: string;
  author: string;
  text: string;
  createdAt: string;
};

type Props = {
  appointmentId?: string;
  theme?: "light" | "dark";
};

export default function AppointmentNotes({ appointmentId, theme = "light" }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (appointmentId) {
      loadNotes();
    }
  }, [appointmentId]);

  const loadNotes = async () => {
    if (!appointmentId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_BASE}/api/appointments/${appointmentId}/notes`, {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setNotes(data.notes || []);
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to load notes");
      }
    } catch (err) {
      console.error("Failed to load notes:", err);
      setError("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  const addNote = async () => {
    if (!text.trim() || !appointmentId) return;
    
    setAdding(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_BASE}/api/appointments/${appointmentId}/notes`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ note: text.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        setNotes((prev) => [data.note, ...prev]);
        setText("");
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to add note");
      }
    } catch (err) {
      console.error("Failed to add note:", err);
      setError("Failed to add note");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div style={{ 
      marginTop: 24, 
      backgroundColor: theme === "dark" ? "#563727" : "#FFF9F4", 
      padding: 16, 
      borderRadius: 8, 
      border: theme === "dark" ? "2px solid #7A431D" : "2px solid #DE9E48" 
    }}>
      <h2 style={{ marginBottom: 12, marginTop: 0, color: theme === "dark" ? "#FFFFFF" : "#372C2E", fontSize: "1.25rem", fontWeight: 600 }}>
        Appointment Notes
      </h2>

      {error && (
        <div style={{ 
          color: theme === "dark" ? "#FFFFFF" : "#C62828", 
          marginBottom: 12, 
          padding: "0.75rem", 
          backgroundColor: theme === "dark" ? "#D62828" : "#FFEBEE", 
          borderRadius: 4,
          border: theme === "dark" ? "2px solid #8B0000" : "1px solid #EF5350"
        }}>
          {error}
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
          marginBottom: 12,
        }}
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a note for this appointment..."
          disabled={adding}
          style={{
            flex: 1,
            minHeight: 80,
            padding: 10,
            borderRadius: 8,
            border: theme === "dark" ? "2px solid #7A431D" : "2px solid #DE9E48",
            backgroundColor: theme === "dark" ? "#372C2E" : "#FFFFFF",
            color: theme === "dark" ? "#FFFFFF" : "#372C2E",
            outline: "none",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button
            onClick={addNote}
            disabled={!text.trim() || adding}
            style={{
              padding: "10px 16px",
              background: (adding || !text.trim()) ? "#C4925A" : "#DE9E48",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 6,
              cursor: (text.trim() && !adding) ? "pointer" : "not-allowed",
              fontWeight: 600,
            }}
          >
            {adding ? "Adding..." : "Add Note"}
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ color: theme === "dark" ? "#FFFFFF" : "#372C2E", padding: "1rem" }}>Loading notes...</div>
      ) : (
        <div>
          {notes.length === 0 ? (
            <div style={{ color: theme === "dark" ? "rgba(255, 255, 255, 0.6)" : "rgba(55, 44, 46, 0.6)", padding: "1rem", textAlign: "center" }}>
              No notes yet.
            </div>
          ) : (
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "grid",
                gap: 12,
              }}
            >
              {notes.map((n) => (
                <li
                  key={n.id}
                  style={{
                    background: theme === "dark" ? "#372C2E" : "#FFFFFF",
                    border: theme === "dark" ? "2px solid #7A431D" : "2px solid #DE9E48",
                    padding: 12,
                    borderRadius: 8,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 6,
                    }}
                  >
                    <strong style={{ color: "#DE9E48" }}>{n.author}</strong>
                    <span
                      style={{ color: theme === "dark" ? "rgba(255, 255, 255, 0.6)" : "rgba(55, 44, 46, 0.6)", fontSize: 12 }}
                    >
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div style={{ color: theme === "dark" ? "#FFFFFF" : "#372C2E" }}>{n.text}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
