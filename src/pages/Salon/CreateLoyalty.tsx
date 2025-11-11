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

const CreateLoyalty: React.FC<Props> = () => {
  const [threshold, setThreshold] = useState("");
  const [programType, setProgramType] = useState("appts_thresh");
  const [rewardType, setRewardType] = useState("is_discount");
  const [rewardValue, setRewardValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);


  const submit = async () => {
    setMessage(null);

    const thresh = parseInt(threshold, 10);
    const rwdVal = parseFloat(rewardValue);

    if (isNaN(thresh) || isNaN(rwdVal)) {
      setMessage("Please provide numeric values for threshold and reward value.");
      return;
    }

    const payload: any = {
      bid: 1,
      threshold: thresh,
      prog_type: programType,
      reward_type: rewardType,
      rwd_value: rwdVal,
    };

    setBusy(true);
    try {
      const res = await fetch("http://localhost:5000/api/owner/create-loyalty-programs", {
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
        setMessage("Loyalty program created successfully.");
        setThreshold("");
        setRewardValue("");
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
        Create Loyalty Program
      </h1>

      <div style={{ ...cardStyle, marginBottom: "1rem", maxWidth: 1200 }}>
        <h2 style={{ marginTop: 0, marginBottom: "0.75rem", fontSize: "1.1rem" }}>New loyalty program</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: 6, fontSize: 12, color: "#fff" }}>Program Type</label>
            <select value={programType} onChange={(e) => setProgramType(e.target.value)} style={inputStyle}>
              <option value="appts_thresh">Appointments Threshold</option>
              <option value="pdct_thresh">Product Threshold</option>
              <option value="points_thresh">Points Threshold</option>
              <option value="price_thresh">Price Threshold</option>
            </select>
          </div>

          <input
            type="number"
            placeholder="Threshold (e.g., 10 appointments or 100 points)"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            style={inputStyle}
            min={0}
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

          <div>
            <button onClick={submit} style={buttonPrimary} disabled={busy}>
              {busy ? "Creating…" : "Create Loyalty Program"}
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

export default CreateLoyalty;
