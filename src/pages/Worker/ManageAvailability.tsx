import React, { useEffect, useState } from "react";

type DayKey = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

type DayAvailability = {
  enabled: boolean;
  start: string; // HH:MM
  end: string; // HH:MM
};

type WeeklyAvailability = Record<DayKey, DayAvailability>;

const sectionStyle: React.CSSProperties = {
  backgroundColor: "#372C2E",
  border: "1px solid #7A431D",
  borderRadius: "0.5rem",
  padding: "1rem",
  color: "#FFFFFF",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem 0.8rem",
  borderRadius: "0.5rem",
  backgroundColor: "#563727",
  border: "1px solid #7A431D",
  color: "#FFFFFF",
  outline: "none",
  transition: "all 0.2s",
};

const buttonPrimary: React.CSSProperties = {
  padding: "0.6rem 1rem",
  fontWeight: 600,
  borderRadius: "0.5rem",
  backgroundColor: "#DE9E48",
  color: "#372C2E",
  border: "none",
  cursor: "pointer",
  transition: "all 0.2s",
};

const buttonGhost: React.CSSProperties = {
  padding: "0.6rem 1rem",
  fontWeight: 600,
  borderRadius: "0.5rem",
  backgroundColor: "transparent",
  color: "#FFFFFF",
  border: "1px solid #7A431D",
  cursor: "pointer",
  transition: "all 0.2s",
};

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
  // Page-scoped dark background, similar to other worker pages
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

  const [week, setWeek] = useState<WeeklyAvailability>(() => getDefaultWeek());
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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
      // Replace with real API call, e.g.:
      // await fetch('/api/worker/availability', { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ week })});
      await new Promise((r) => setTimeout(r, 500));
      setMessage("Availability saved successfully.");
      console.log("Saved availability", { week });
    } catch (e: any) {
      setMessage(e?.message || "Failed to save availability.");
    } finally {
      setSaving(false);
    }
  };

  // const anyDayEnabled = useMemo(() => days.some((d) => week[d].enabled), [week]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Header */}
      <div style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Manage Availability</h2>
        <p style={{ opacity: 0.9, marginTop: 8 }}>Set your weekly schedule.</p>
      </div>

      {/* Weekly schedule */}
      <div style={sectionStyle}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "140px 140px 140px 1fr",
            gap: "0.75rem",
            alignItems: "center",
          }}
        >
          <div style={{ color: "#DE9E48", fontWeight: 700 }}>Day</div>
          <div style={{ color: "#DE9E48", fontWeight: 700 }}>Start</div>
          <div style={{ color: "#DE9E48", fontWeight: 700 }}>End</div>
          <div />
          {days.map((d) => (
            <React.Fragment key={d}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input
                  type="checkbox"
                  checked={week[d].enabled}
                  onChange={(e) => handleDayToggle(d, e.target.checked)}
                />
                <span style={{ width: 60 }}>{d}</span>
              </div>
              <div>
                <input
                  type="time"
                  value={week[d].start}
                  onChange={(e) => handleTimeChange(d, "start", e.target.value)}
                  style={{ ...inputStyle, opacity: week[d].enabled ? 1 : 0.5 }}
                  disabled={!week[d].enabled}
                />
              </div>
              <div>
                <input
                  type="time"
                  value={week[d].end}
                  onChange={(e) => handleTimeChange(d, "end", e.target.value)}
                  style={{ ...inputStyle, opacity: week[d].enabled ? 1 : 0.5 }}
                  disabled={!week[d].enabled}
                />
              </div>
              <div style={{ opacity: 0.85 }}>
                {week[d].enabled ? "Available" : "Unavailable"}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <button
          onClick={saveAvailability}
          style={buttonPrimary}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
        <button onClick={resetToDefaults} style={buttonGhost}>
          Reset to Defaults
        </button>
      </div>

      {/* Message */}
      {message && (
        <div
          style={{
            ...sectionStyle,
            backgroundColor: "#2f2527",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default ManageAvailability;
