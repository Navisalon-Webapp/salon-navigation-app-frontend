import React, { useState } from "react";

const cardStyle: React.CSSProperties = {
  backgroundColor: "#563727",
  border: "1px solid #7A431D",
  borderRadius: "0.5rem",
  padding: "1rem",
  color: "#FFFFFF",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "1.3rem 1rem",
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

type Props = {};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

const CreatePromotion: React.FC<Props> = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isRecurr, setIsRecurr]  = useState(false);
  const [recurrDays, setRecurrDays] = useState<string[]>([]);
  const threshold = 0;
  const programType = "appts_thresh";
  const [rewardType, setRewardType] = useState("is_discount");
  const [rewardValue, setRewardValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async () => {
    setMessage(null);
    const rwdVal = parseFloat(rewardValue);

    if (!title.trim() || isNaN(rwdVal) || !startDate || !endDate) {
      setMessage("Please fill required fields and enter a numeric reward value.");
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      start_date: startDate,
      end_date: endDate,
      is_recurring: isRecurr,
      recurr_days: isRecurr ? recurrDays : null,
      start_time: startTime,
      end_time: endTime,
      threshold: threshold,
      prog_type: programType,
      reward_type: rewardType,
      rwd_value: rwdVal,
    };

    setBusy(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/owner/create-promotion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let text = await res.text().catch(() => "");
        try {
          const json = JSON.parse(text || "{}");
          setMessage(json.message || `Server returned ${res.status}`);
        } catch {
          setMessage(text || `Server returned ${res.status}`);
        }
      } else {
        setMessage("Promotion created successfully.");
        setTitle("");
        setDescription("");
        setStartDate("");
        setStartTime("");
        setEndDate("");
        setEndTime("");
        setRewardValue("");
        setIsRecurr(false);
        setRecurrDays([]);
      }
    } catch (err) {
      setMessage("Could not contact backend.");
    } finally {
      setBusy(false);
    }
  };

  const toggleRecurrDay = (day: string) => {
    if (recurrDays.includes(day)) {
      setRecurrDays(recurrDays.filter(d => d !== day));
    } else {
      setRecurrDays([...recurrDays, day]);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <div aria-hidden style={{ position: "fixed", inset: 0, background: "#372C2E", zIndex: -1 }} />

      <h1 style={{ color: "#FFFFFF", fontSize: "1.75rem", fontWeight: 600, marginBottom: "1rem" }}>
        Create Promotion
      </h1>

      <div style={{ ...cardStyle, marginBottom: "1rem", maxWidth: 1200 }}>
        <h2 style={{ marginTop: 0, marginBottom: "0.75rem", fontSize: "1.1rem" }}>New promotion</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <input
            type="text"
            placeholder="Title "
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle}
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ ...inputStyle, minHeight: 100 }}
          />

          <div>
            <label style={{ display: "block", marginBottom: 6, fontSize: 12, color: "#fff" }}>Reward Type</label>
            <select value={rewardType} onChange={(e) => setRewardType(e.target.value)} style={inputStyle}>
              <option value="is_appt">Free Appointment</option>
              <option value="is_product">Free Product</option>
              <option value="is_price">Price Off</option>
              <option value="is_points">Points</option>
              <option value="is_discount">Discount %</option>
            </select>
          </div>

          <input
            type="number"
            placeholder="Reward Value (e.g., 10 for 10% off or 50 for $50)"
            value={rewardValue}
            onChange={(e) => setRewardValue(e.target.value)}
            style={inputStyle}
            min={0}
            step="0.01"
          />

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: 6, fontSize: 12, color: "#fff" }}>Start</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={inputStyle} />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: 6, fontSize: 12, color: "#fff" }}>End</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={inputStyle} />
            </div>
          </div>

          <label style={{ color: "#fff", marginTop: 8, marginBottom: ".5rem" }}>
            <input
              type="checkbox"
              checked={isRecurr}
              onChange={(e) => setIsRecurr(e.target.checked)}
              style={{ marginRight: 6 }}
            />
            Recurring Promotion
          </label>

          {isRecurr && (
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 12, color: "#fff" }}>
                Select Day(s)
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "1rem" }}>
                {days.map(day => (
                  <label key={day} style={{ color: "#fff", display: "flex", alignItems: "center", gap: 4 }}>
                    <input
                      type="checkbox"
                      checked={recurrDays.includes(day)}
                      onChange={() => toggleRecurrDay(day)}
                    />
                    {day}
                  </label>
                ))}
              </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", marginBottom: 6, fontSize: 12, color: "#fff" }}>Start Time</label>
                    <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} style={{ ...inputStyle, marginTop: 4 }} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", marginBottom: 6, fontSize: 12, color: "#fff" }}>End Time</label>
                    <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} style={{ ...inputStyle, marginTop: 4 }} />
                  </div>
              </div>
            </div>
          )}

          <div>
            <button onClick={submit} style={buttonPrimary} disabled={busy}>
              {busy ? "Creating…" : "Create Promotion"}
            </button>
          </div>

          {message && <div style={{ marginTop: 8, color: "#FFFFFF", opacity: 0.95 }}>{message}</div>}
        </div>
      </div>

      <style>{`
        input::placeholder { color: rgba(255,255,255,0.6); }
        textarea::placeholder { color: rgba(255,255,255,0.6); }
      `}</style>
    </div>
  );
};

export default CreatePromotion;
