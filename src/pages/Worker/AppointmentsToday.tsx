import React, { useEffect, useMemo, useState } from "react";

type Appointment = {
  id: string;
  time: string; // e.g. "09:30 AM"
  client: string;
  service: string;
  durationMins: number;
  notes?: string;
  status: "scheduled" | "checked-in" | "completed" | "cancelled";
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "#563727",
  border: "1px solid #7A431D",
  borderRadius: "0.5rem",
  padding: "1rem",
  color: "#FFFFFF",
};

const badgeStyle = (status: Appointment["status"]): React.CSSProperties => {
  const map: Record<Appointment["status"], string> = {
    scheduled: "#DE9E48",
    "checked-in": "#4EA8DE",
    completed: "#3DDC97",
    cancelled: "#D62828",
  };
  return {
    display: "inline-block",
    padding: "0.2rem 0.5rem",
    borderRadius: "0.375rem",
    fontSize: "0.8rem",
    fontWeight: 600,
    backgroundColor: map[status],
    color: "#372C2E",
  };
};

function formatDateISO(date: Date) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const AppointmentsToday: React.FC = () => {
  const todayISO = useMemo(() => formatDateISO(new Date()), []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [sending, setSending] = useState<string | null>(null);

  const loadAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:5000/worker/appointments?date=${encodeURIComponent(todayISO)}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
      const data: Appointment[] = await res.json();
      setAppointments(data);
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleSendNotification = async (appointmentId: string) => {
    setSending(appointmentId);
    try {
      const response = await fetch(
        `http://localhost:5000/api/employee/send-notification/${appointmentId}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Notification sent successfully!");
      } else {
        alert(`Failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Error sending notification");
    } finally {
      setSending(null);
    }
  };

  return (
    <div
      className="flex items-center justify-center p-4"
      style={{
        background: "#372C2E",
        minHeight: "100vh",
        width: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: "auto",
      }}
    >
      <div style={{ width: "100%", maxWidth: "700px", margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "1.875rem",
            fontWeight: 600,
            textAlign: "center",
            color: "#FFFFFF",
            marginBottom: "1.25rem",
          }}
        >
          Today&apos;s Appointments
        </h1>

        <div
          style={{
            color: "#FFFFFF",
            opacity: 0.85,
            textAlign: "center",
            marginBottom: "0.75rem",
          }}
        >
          {todayISO}
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#D62828",
              color: "#FFFFFF",
              padding: "0.6rem 0.8rem",
              borderRadius: "0.5rem",
              marginBottom: "0.75rem",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {loading && (
          <div style={{ ...cardStyle, textAlign: "center" }}>Loading...</div>
        )}

        {!loading && appointments.length === 0 && (
          <div style={{ ...cardStyle, textAlign: "center" }}>
            No appointments for today.
          </div>
        )}

        {/* Simple list like cards */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {!loading &&
            appointments.map((a) => (
              <div key={a.id} style={cardStyle}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>
                    {a.time}
                  </div>
                  <span style={badgeStyle(a.status)}>{a.status}</span>
                </div>
                <div style={{ marginTop: "0.35rem", fontSize: "0.95rem" }}>
                  {a.client} • {a.service} • {a.durationMins} mins
                </div>
                {a.notes && (
                  <div style={{ marginTop: "0.35rem", opacity: 0.85 }}>
                    {a.notes}
                  </div>
                )}
                <div style={{ marginTop: "0.75rem" }}>
                  <button
                    onClick={() => handleSendNotification(a.id)}
                    disabled={sending === a.id}
                    style={{
                      padding: "0.4rem 0.8rem",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      borderRadius: "0.375rem",
                      backgroundColor: sending === a.id ? "#7A431D" : "#DE9E48",
                      color: "#372C2E",
                      border: "none",
                      cursor: sending === a.id ? "not-allowed" : "pointer",
                      opacity: sending === a.id ? 0.6 : 1,
                    }}
                  >
                    {sending === a.id ? "Sending..." : "Notify Client You Are Running Late"}
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* Refresh button (mirrors Sign Up button styling) */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "1rem",
          }}
        >
          <button
            onClick={loadAppointments}
            style={{
              padding: "0.75rem 3rem",
              fontWeight: 600,
              borderRadius: "0.5rem",
              backgroundColor: "#DE9E48",
              color: "#372C2E",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      <style>{`
        button:hover { filter: brightness(1.05); }
        input::placeholder { color: rgba(255, 255, 255, 0.5); }
        input:focus { border-color: #DE9E48 !important; }
      `}</style>
    </div>
  );
};

export default AppointmentsToday;
