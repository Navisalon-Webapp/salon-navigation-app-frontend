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

const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const sectionStyle: React.CSSProperties = {
  backgroundColor: "#372C2E",
  border: "1px solid #7A431D",
  borderRadius: "0.5rem",
  padding: "1rem",
  color: "#FFFFFF",
};

// Removed input/button styles since date selection is no longer available

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
  // Page-scoped background: set dark brown while this page is mounted
  useEffect(() => {
    const docEl = document.documentElement;
    const prevHtmlBg = docEl.style.background;
    const prevHtmlColor = docEl.style.color;
    const prevBodyBg = document.body.style.background;
    const prevBodyColor = document.body.style.color;
    docEl.style.background = "#372C2E";
    docEl.style.color = "#FFFFFF";
    document.body.style.background = "#372C2E";
    document.body.style.color = "#FFFFFF";
    return () => {
      docEl.style.background = prevHtmlBg;
      docEl.style.color = prevHtmlColor;
      document.body.style.background = prevBodyBg;
      document.body.style.color = prevBodyColor;
    };
  }, []);

  const todayISO = useMemo(() => formatDateISO(new Date()), []);
  const date = todayISO;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const loadAppointments = async (forDate: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Loading appointments for", forDate);
      // NOTE: Replace this with a real API call when backend is ready.
      // Example endpoint: `/api/worker/appointments?date=${forDate}`
      // const res = await fetch(`/api/worker/appointments?date=${forDate}`, { credentials: 'include' });
      // if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
      // const data: Appointment[] = await res.json();

      // Mock data fallback for now
      await new Promise((r) => setTimeout(r, 400));
      const mock: Appointment[] = [
        {
          id: "a1",
          time: "09:00 AM",
          client: "Alex Johnson",
          service: "Haircut",
          durationMins: 45,
          notes: "Prefers scissors over clippers",
          status: "scheduled",
        },
        {
          id: "a2",
          time: "10:15 AM",
          client: "Maria Lopez",
          service: "Coloring",
          durationMins: 90,
          status: "checked-in",
        },
        {
          id: "a3",
          time: "01:00 PM",
          client: "Chris Lee",
          service: "Beard Trim",
          durationMins: 30,
          status: "completed",
        },
      ];
      setAppointments(mock);
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments(todayISO);
  }, [todayISO]);

  return (
    <div style={containerStyle}>
      {/* Date selection removed; page always shows today's appointments */}

      {/* List */}
      <div style={sectionStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.75rem",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "1.25rem" }}>
            Today&apos;s Appointments
          </h2>
          <span style={{ opacity: 0.8 }}>{date}</span>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#D62828",
              color: "#FFFFFF",
              padding: "0.5rem 0.75rem",
              borderRadius: "0.375rem",
              marginBottom: "0.75rem",
            }}
          >
            {error}
          </div>
        )}

        {appointments.length === 0 && !loading ? (
          <div style={{ opacity: 0.85 }}>
            No appointments for the selected day.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {[
                    "Time",
                    "Client",
                    "Service",
                    "Duration",
                    "Notes",
                    "Status",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "0.5rem",
                        borderBottom: "1px solid #7A431D",
                        color: "#DE9E48",
                        fontWeight: 700,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a.id}>
                    <td
                      style={{
                        padding: "0.5rem",
                        borderBottom: "1px solid #7A431D",
                      }}
                    >
                      {a.time}
                    </td>
                    <td
                      style={{
                        padding: "0.5rem",
                        borderBottom: "1px solid #7A431D",
                      }}
                    >
                      {a.client}
                    </td>
                    <td
                      style={{
                        padding: "0.5rem",
                        borderBottom: "1px solid #7A431D",
                      }}
                    >
                      {a.service}
                    </td>
                    <td
                      style={{
                        padding: "0.5rem",
                        borderBottom: "1px solid #7A431D",
                      }}
                    >
                      {a.durationMins} mins
                    </td>
                    <td
                      style={{
                        padding: "0.5rem",
                        borderBottom: "1px solid #7A431D",
                        opacity: 0.85,
                      }}
                    >
                      {a.notes || "-"}
                    </td>
                    <td
                      style={{
                        padding: "0.5rem",
                        borderBottom: "1px solid #7A431D",
                      }}
                    >
                      <span style={badgeStyle(a.status)}>{a.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

export default AppointmentsToday;
