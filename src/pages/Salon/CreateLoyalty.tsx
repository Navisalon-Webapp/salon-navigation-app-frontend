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

const CreateLoyalty: React.FC<Props> = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pointsPerDollar, setPointsPerDollar] = useState("");
  const [pointsToReward, setPointsToReward] = useState("");
  const [expiryDays, setExpiryDays] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);


  const submit = async () => {
    setMessage(null);

    const ppd = parseFloat(pointsPerDollar);
    const ptr = parseInt(pointsToReward, 10);
    const exp = expiryDays ? parseInt(expiryDays, 10) : null;

    if (!name.trim() || isNaN(ppd) || isNaN(ptr)) {
      setMessage("Please provide a name, numeric points per dollar, and points required for reward.");
      return;
    }

    const payload: any = {

      name: name.trim(),
      description: description.trim(),
      points_per_dollar: ppd,
      points_to_reward: ptr,
    };
    if (exp !== null && !isNaN(exp)) payload.expiry_days = exp;

    setBusy(true);
    try {
      const res = await fetch("http://localhost:5000/owner/loyalty", {
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
        setName("");
        setDescription("");
        setPointsPerDollar("");
        setPointsToReward("");
        setExpiryDays("");
      }
    } catch (err) {
      setMessage("Could not contact backend. Frontend form is ready to hook up.");
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

      <div style={{ ...cardStyle, marginBottom: "1rem", maxWidth: 760 }}>
        <h2 style={{ marginTop: 0, marginBottom: "0.75rem", fontSize: "1.1rem" }}>New loyalty program</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <input
            type="text"
            placeholder="Program name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />

          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ ...inputStyle, minHeight: 100 }}
          />

          <input
            type="number"
            placeholder="Points per $ spent"
            value={pointsPerDollar}
            onChange={(e) => setPointsPerDollar(e.target.value)}
            style={inputStyle}
            min={0}
          />

          <input
            type="number"
            placeholder="Points required for reward"
            value={pointsToReward}
            onChange={(e) => setPointsToReward(e.target.value)}
            style={inputStyle}
            min={0}
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
