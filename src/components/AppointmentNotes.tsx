import { useState } from "react";

type Note = {
  id: string;
  author: string;
  text: string;
  createdAt: string;
};

type Props = {
  appointmentId?: string;
};

export default function AppointmentNotes({ appointmentId }: Props) {
  // Local-only notes state for frontend demo. Replace with API calls later.
  const [notes, setNotes] = useState<Note[]>(() => [
    {
      id: "n1",
      author: "System",
      text: `Notes for appointment ${appointmentId ?? "(local demo)"}`,
      createdAt: new Date().toISOString(),
    },
  ]);
  const [text, setText] = useState("");

  function addNote() {
    if (!text.trim()) return;
    const newNote: Note = {
      id: String(Date.now()),
      author: "Current User",
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setText("");
  }

  return (
    <div style={{ marginTop: 24 }}>
      <h2 style={{ marginBottom: 12, color: "#FFFFFF" }}>Appointment Notes</h2>

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
          style={{
            flex: 1,
            minHeight: 80,
            padding: 10,
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.12)",
            backgroundColor: "transparent",
            color: "#FFFFFF",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button
            onClick={addNote}
            disabled={!text.trim()}
            style={{
              padding: "10px 16px",
              background: "#DE9E48",
              color: "#372C2E",
              border: "none",
              borderRadius: 6,
              cursor: text.trim() ? "pointer" : "not-allowed",
            }}
          >
            Add Note
          </button>
          <small style={{ color: "rgba(255,255,255,0.85)" }}>
            All roles can add notes
          </small>
        </div>
      </div>

      <div>
        {notes.length === 0 ? (
          <div style={{ color: "rgba(255,255,255,0.85)" }}>No notes yet.</div>
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
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.06)",
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
                  <strong style={{ color: "#FFFFFF" }}>{n.author}</strong>
                  <span
                    style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}
                  >
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
                <div style={{ color: "#FFFFFF" }}>{n.text}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
