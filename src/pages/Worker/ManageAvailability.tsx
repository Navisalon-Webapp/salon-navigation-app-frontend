import React, { useState, useEffect } from "react";
const API = "http://localhost:5000";
type DayKey = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

type DayAvailability = {
  enabled: boolean;
  start: string; // HH:MM
  end: string; // HH:MM
};

type WeeklyAvailability = Record<DayKey, DayAvailability>;

const days: DayKey[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const defaultDay: DayAvailability = {
  enabled: false,
  start: "09:00",
  end: "17:00",
};

function getDefaultWeek(): WeeklyAvailability {
  return days.reduce((acc, d) => {
    acc[d] = { ...defaultDay };
    return acc;
  }, {} as WeeklyAvailability);
}

const ManageAvailability: React.FC = () => {
  const [week, setWeek] = useState<WeeklyAvailability>(() => getDefaultWeek());
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
  (async () => {
    try {
      // Get current user session
      const sessionRes = await fetch(`${API}/user-session`, {
        method: "GET",
        credentials: "include",
      });
      if (!sessionRes.ok) throw new Error("Failed to fetch user session");

      const sessionData = await sessionRes.json();
      if (sessionData.role !== "employee") {
        setMessage("You must be a salon worker to manage availability.");
        return;
      }

      // Fetch current availability
      const availRes = await fetch(`${API}/worker/availability`, {
        method: "GET",
        credentials: "include",
      });

      if (!availRes.ok) throw new Error("Failed to load current availability");

      const availData = await availRes.json();

      if (availData.status === "Success" && Array.isArray(availData.query_results)) {
        const updatedWeek = getDefaultWeek();
        availData.query_results.forEach((entry: any) => {
          const day = entry.day as DayKey;
          updatedWeek[day] = {
            enabled: true,
            start: entry.start_time.slice(0, 5),
            end: entry.finish_time.slice(0, 5),
          };
        });
        setWeek(updatedWeek);
      } else {
        setMessage("No existing availability found.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to load availability.");
    }
  })();
}, []);

  const handleDayToggle = (day: DayKey, enabled: boolean) => {
    setWeek((w) => ({ ...w, [day]: { ...w[day], enabled } }));
  };

  const handleTimeChange = (
    day: DayKey,
    field: "start" | "end",
    value: string
  ) => {
    setWeek((w) => ({ ...w, [day]: { ...w[day], [field]: value } }));
  };

  const resetToDefaults = () => {
    setWeek(getDefaultWeek());
    setMessage(null);
  };

  const saveAvailability = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`${API}/worker/availability`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ week }),
      });
      const data = await res.json();
      if (res.ok && data.status === "Success") {
        setMessage("Availability saved successfully.");
      } else {
        throw new Error(data.message || "Save failed");
      }
    } catch (e: any) {
      setMessage(e.message || "Failed to save availability.");
    } finally {
      setSaving(false);
    }
  };

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
      <div style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "2rem",
            marginTop: "2rem",
          }}
        >
          <h1
            style={{
              fontSize: "1.875rem",
              fontWeight: 600,
              textAlign: "center",
              color: "#FFFFFF",
              margin: 0,
            }}
          >
            Manage Availability
          </h1>
        </div>

        {/* Simple weekly list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {days.map((d) => (
            <div
              key={d}
              style={{
                backgroundColor: "#372C2E",
                border: "1px solid #7A431D",
                borderRadius: "0.5rem",
                padding: "1rem",
                color: "#FFFFFF",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "0.75rem",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={week[d].enabled}
                    onChange={(e) => handleDayToggle(d, e.target.checked)}
                  />
                  <span style={{ color: "#DE9E48", fontWeight: 600 }}>{d}</span>
                </label>
                <span style={{ opacity: 0.9 }}>
                  {week[d].enabled ? "Available" : "Unavailable"}
                </span>
              </div>

              {week[d].enabled && (
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <input
                    type="time"
                    value={week[d].start}
                    onChange={(e) =>
                      handleTimeChange(d, "start", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: "1rem 1.5rem",
                      borderRadius: "0.5rem",
                      backgroundColor: "#563727",
                      border: "1px solid #7A431D",
                      color: "#FFFFFF",
                      outline: "none",
                      transition: "all 0.2s",
                    }}
                  />
                  <input
                    type="time"
                    value={week[d].end}
                    onChange={(e) => handleTimeChange(d, "end", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "1rem 1.5rem",
                      borderRadius: "0.5rem",
                      backgroundColor: "#563727",
                      border: "1px solid #7A431D",
                      color: "#FFFFFF",
                      outline: "none",
                      transition: "all 0.2s",
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.75rem",
            marginTop: "1.5rem",
          }}
        >
          <button
            onClick={saveAvailability}
            disabled={saving}
            style={{
              padding: "0.75rem 2rem",
              fontWeight: 600,
              borderRadius: "0.5rem",
              backgroundColor: "#DE9E48",
              color: "#372C2E",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {saving ? "Saving…" : "Save"}
          </button>
          <button
            onClick={resetToDefaults}
            style={{
              padding: "0.75rem 2rem",
              fontWeight: 600,
              borderRadius: "0.5rem",
              backgroundColor: "transparent",
              border: "1px solid #7A431D",
              color: "#FFFFFF",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Reset
          </button>
        </div>

        {/* Message */}
        {message && (
          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              borderRadius: "0.5rem",
              backgroundColor: "#2f2527",
              color: "#FFFFFF",
              border: "1px solid #7A431D",
            }}
          >
            {message}
          </div>
        )}

        <style>{`
          input::placeholder { color: rgba(255, 255, 255, 0.5); }
          input:focus { border-color: #DE9E48 !important; }
        `}</style>
      </div>
    </div>
  );
};

export default ManageAvailability;
