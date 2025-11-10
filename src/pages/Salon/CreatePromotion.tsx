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
  padding: "0.75rem 1rem",
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

const CreatePromotion: React.FC<Props> = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discountPct, setDiscountPct] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async () => {
    setMessage(null);
    const d = parseFloat(discountPct);
    if (!title.trim() || isNaN(d) || !startDate || !endDate) {
      setMessage("Please fill required fields and provide a numeric discount.");
      return;
    }

    const payload = {
      lprog_id: 1,
      title: title.trim(),
      description: description.trim(),
      start_date: startDate,
      end_date: endDate,
      is_recurring: false,
      recurr_day: null,
      start_time: "00:00:00",
      end_time: "23:59:59",
    };

    setBusy(true);
    try {
      const res = await fetch("http://localhost:5000/api/owner/create-promotion", {
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
        setDiscountPct("");
        setStartDate("");
        setEndDate("");
      }
    } catch (err) {
      setMessage("Could not contact backend.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <div aria-hidden style={{ position: "fixed", inset: 0, background: "#372C2E", zIndex: -1 }} />

      <h1 style={{ color: "#FFFFFF", fontSize: "1.75rem", fontWeight: 600, marginBottom: "1rem" }}>
        Create Promotion
      </h1>

      <div style={{ ...cardStyle, marginBottom: "1rem", maxWidth: 760 }}>
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

          <input
            type="number"
            placeholder="Discount percent"
            value={discountPct}
            onChange={(e) => setDiscountPct(e.target.value)}
            style={inputStyle}
            min={0}
            max={100}
          />

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: 6, fontSize: 12, color: "#fff" }}>Start date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: 6, fontSize: 12, color: "#fff" }}>End date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={inputStyle} />
            </div>
          </div>

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
