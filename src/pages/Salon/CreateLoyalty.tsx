import React, { useCallback, useEffect, useState } from "react";

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

type Program = {
  lprog_id: number;
  threshold: number;
  program_type?: string | null;
  reward_type?: string | null;
  reward_value?: number | null;
};

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CreateLoyalty: React.FC<Props> = () => {
  const [threshold, setThreshold] = useState("");
  const [programType, setProgramType] = useState("appts_thresh");
  const [rewardType, setRewardType] = useState("is_discount");
  const [rewardValue, setRewardValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [programsLoading, setProgramsLoading] = useState(true);
  const [programsMessage, setProgramsMessage] = useState<string | null>(null);
  const [programBusyId, setProgramBusyId] = useState<number | null>(null);

  const fetchPrograms = useCallback(async () => {
    setProgramsLoading(true);
    setProgramsMessage(null);
    try {
      const res = await fetch(`${API_BASE}/api/owner/loyalty-programs`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        setPrograms([]);
        setProgramsMessage("Unable to load existing loyalty programs.");
        return;
      }
      const payload = await res.json();
      const items = Array.isArray(payload?.programs) ? payload.programs : [];
      const mapped: Program[] = items.map((item: any) => ({
        lprog_id: Number(item?.lprog_id ?? 0),
        threshold: Number(item?.threshold ?? 0),
        program_type: item?.program_type ?? null,
        reward_type: item?.reward_type ?? null,
        reward_value:
          item?.reward_value !== null && item?.reward_value !== undefined
            ? Number(item.reward_value)
            : null,
      }));
      setPrograms(mapped);
    } catch (err) {
      console.error("Failed to load loyalty programs", err);
      setPrograms([]);
      setProgramsMessage("Unable to load existing loyalty programs.");
    } finally {
      setProgramsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPrograms();
  }, [fetchPrograms]);


  const submit = async () => {
    setMessage(null);

    const thresh = parseInt(threshold, 10);
    const rwdVal = parseFloat(rewardValue);

    if (isNaN(thresh) || isNaN(rwdVal)) {
      setMessage("Please provide numeric values for threshold and reward value.");
      return;
    }

    const payload: any = {
      threshold: thresh,
      prog_type: programType,
      reward_type: rewardType,
      rwd_value: rwdVal,
    };

    setBusy(true);
    try {
      const res = await fetch(`${API_BASE}/api/owner/create-loyalty-programs`, {
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
        await fetchPrograms();
      }
    } catch (err) {
      setMessage("Could not contact backend.");
    } finally {
      setBusy(false);
    }
  };

  const updateProgram = async (program: Program) => {
    const newThresholdInput = window.prompt(
      "Update threshold",
      program.threshold ? String(program.threshold) : ""
    );
    if (newThresholdInput === null) {
      return;
    }
    const thresholdValue = Number.parseFloat(newThresholdInput);
    if (Number.isNaN(thresholdValue) || thresholdValue < 0) {
      setProgramsMessage("Threshold must be a non-negative number.");
      return;
    }

    const newRewardInput = window.prompt(
      "Update reward value",
      program.reward_value !== null && program.reward_value !== undefined
        ? String(program.reward_value)
        : ""
    );
    if (newRewardInput === null) {
      return;
    }
    const rewardNumber = Number.parseFloat(newRewardInput);
    if (Number.isNaN(rewardNumber) || rewardNumber < 0) {
      setProgramsMessage("Reward value must be a non-negative number.");
      return;
    }

    setProgramBusyId(program.lprog_id);
    setProgramsMessage(null);
    try {
      const res = await fetch(`${API_BASE}/api/owner/loyalty-programs/${program.lprog_id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threshold: thresholdValue, rwd_value: rewardNumber }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        setProgramsMessage(payload?.message ?? "Failed to update loyalty program.");
        return;
      }
      await fetchPrograms();
      setProgramsMessage("Loyalty program updated.");
    } catch (err) {
      console.error("Failed to update loyalty program", err);
      setProgramsMessage("Failed to update loyalty program.");
    } finally {
      setProgramBusyId(null);
    }
  };

  const deleteProgram = async (program: Program) => {
    if (!window.confirm("Remove this loyalty program? This cannot be undone.")) {
      return;
    }
    setProgramBusyId(program.lprog_id);
    setProgramsMessage(null);
    try {
      const res = await fetch(`${API_BASE}/api/owner/loyalty-programs/${program.lprog_id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        setProgramsMessage(payload?.message ?? "Failed to delete loyalty program.");
        return;
      }
      await fetchPrograms();
      setProgramsMessage("Loyalty program removed.");
    } catch (err) {
      console.error("Failed to delete loyalty program", err);
      setProgramsMessage("Failed to delete loyalty program.");
    } finally {
      setProgramBusyId(null);
    }
  };

  const describeProgramType = (value?: string | null) => {
    switch (value) {
      case "appts_thresh":
        return "Appointments threshold";
      case "pdct_thresh":
        return "Product threshold";
      case "points_thresh":
        return "Points threshold";
      case "price_thresh":
        return "Spend threshold";
      default:
        return "Loyalty program";
    }
  };

  const describeRewardType = (value?: string | null) => {
    switch (value) {
      case "is_appt":
        return "Free appointment";
      case "is_product":
        return "Free product";
      case "is_price":
        return "Price credit";
      case "is_points":
        return "Bonus points";
      case "is_discount":
        return "Discount";
      default:
        return value ?? "Reward";
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

      <div style={{ ...cardStyle, marginBottom: "1rem", maxWidth: 1200 }}>
        <h2 style={{ marginTop: 0, marginBottom: "0.75rem", fontSize: "1.1rem" }}>Existing loyalty programs</h2>
        {programsLoading ? (
          <div>Loading programs…</div>
        ) : programs.length === 0 ? (
          <div>No loyalty programs configured yet.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {programs.map((program) => (
              <div
                key={program.lprog_id}
                style={{
                  background: "rgba(222, 158, 72, 0.15)",
                  border: "1px solid rgba(222, 158, 72, 0.4)",
                  borderRadius: "0.5rem",
                  padding: "0.75rem 1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                }}
              >
                <div style={{ maxWidth: 500 }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>
                    {describeProgramType(program.program_type)} – goal of {program.threshold}
                  </div>
                  <div style={{ fontSize: 14, opacity: 0.85 }}>
                    Reward: {describeRewardType(program.reward_type)}
                    {program.reward_value !== null && program.reward_value !== undefined
                      ? ` (${program.reward_value})`
                      : ""}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    style={{ ...buttonPrimary, padding: "0.6rem 1rem" }}
                    onClick={() => updateProgram(program)}
                    disabled={programBusyId === program.lprog_id}
                  >
                    {programBusyId === program.lprog_id ? "Saving…" : "Edit"}
                  </button>
                  <button
                    style={{
                      ...buttonPrimary,
                      backgroundColor: "transparent",
                      color: "#DE9E48",
                      border: "1px solid #DE9E48",
                    }}
                    onClick={() => deleteProgram(program)}
                    disabled={programBusyId === program.lprog_id}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {programsMessage && (
          <div style={{ marginTop: 12, color: "#FFFFFF", opacity: 0.95 }}>{programsMessage}</div>
        )}
      </div>

      <style>{`
        input::placeholder { color: rgba(255,255,255,0.6); }
        textarea::placeholder { color: rgba(255,255,255,0.6); }
      `}</style>
    </div>
  );
};

export default CreateLoyalty;
