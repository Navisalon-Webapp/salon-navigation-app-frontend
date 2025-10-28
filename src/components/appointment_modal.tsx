// src/components/AppointmentModal.tsx
import React, { useEffect, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  businessId: number;
  employeeId?: number | null;
  onSuccess?: () => void;
};

type Service = {
  sid: number;
  name: string;
  price: number;
};

export default function AppointmentModal({
  open,
  onClose,
  businessId,
  employeeId = null,
  onSuccess,
}: Props) {
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState<number | "">("");
  const [date, setDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const backendBase = "http://localhost:5000";

  useEffect(() => {
    if (!open) return;
    setError(null);
    setServices([]);
    setServiceId("");
    fetch(`${backendBase}/api/business/${businessId}/services`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setServices(Array.isArray(data) ? data : []);
        if (Array.isArray(data) && data.length > 0) setServiceId(data[0].sid);
      })
      .catch((err) => {
        console.error("Failed to load services:", err);
        setError("Unable to load services for this business.");
      });
  }, [open, businessId]);

  if (!open) return null;

  const computeEndISO = (startIso: string, minutes: number) => {
    if (!startIso) return "";
    const dt = new Date(startIso);
    dt.setMinutes(dt.getMinutes() + minutes);
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())} ${pad(
      dt.getHours()
    )}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())}`;
  };

  const handleSubmit = async () => {
    const start = `${date}T${startTime}:00`;
    const end = `${date}T${endTime}:00`;
    setError(null);

    if (!serviceId) return setError("Please choose a service.");
    if (!date || !startTime || !endTime)
      return setError("Please select a date and times.");

    setLoading(true);
    try {
      const expected_end_time = computeEndISO(start, 60);
      const payload: any = { sid: serviceId, start_time: start, expected_end_time, notes };
      if (employeeId) payload.eid = employeeId;

      const res = await fetch(`${backendBase}/api/client/create-appointment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }

      if (!res.ok) {
        const msg = data?.message || `Failed (${res.status})`;
        throw new Error(msg);
      }

      onSuccess?.();
      onClose();
      alert("Appointment scheduled successfully.");
    } catch (e: any) {
      console.error("Create appointment error:", e);
      setError(e.message || "Unknown error creating appointment");
    } finally {
      setLoading(false);
    }
  };

  // --- STYLES ---
  const styles = {
    backdrop: {
      position: "fixed" as const,
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    modal: {
      width: 520,
      background: "#FFFFFF",
      borderRadius: 16,
      padding: 24,
      boxShadow: "0 6px 18px rgba(55,44,46,0.3)",
      color: "#372C2E",
    },
    label: {
      display: "block",
      fontWeight: 600,
      marginTop: 12,
      marginBottom: 6,
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      border: "1px solid #DE9E48",
      borderRadius: 8,
      fontSize: 14,
      background: "#FFF",
      color: "#372C2E",
    },
    select: {
      width: "100%",
      padding: "10px 12px",
      border: "1px solid #DE9E48",
      borderRadius: 8,
      fontSize: 14,
      background: "#FFF",
      color: "#372C2E",
    },
    textarea: {
      width: "100%",
      padding: "10px 12px",
      border: "1px solid #DE9E48",
      borderRadius: 8,
      fontSize: 14,
      minHeight: 80,
      background: "#FFF",
      color: "#372C2E",
    },
    buttonPrimary: {
      background: "#DE9E48",
      color: "#FFFFFF",
      padding: "10px 18px",
      borderRadius: 8,
      fontWeight: 600,
      border: "none",
      cursor: "pointer",
      transition: "all 0.2s",
    },
    buttonCancel: {
      background: "#7A431D",
      color: "#FFFFFF",
      padding: "10px 18px",
      borderRadius: 8,
      border: "none",
      cursor: "pointer",
      transition: "all 0.2s",
    },
  };

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal}>
        <h2 style={{ marginTop: 0, color: "#563727" }}>Schedule Appointment</h2>
        {error && <div style={{ color: "crimson", marginBottom: 8 }}>{error}</div>}

        <label style={styles.label}>Service</label>
        <select
          value={serviceId}
          onChange={(e) => setServiceId(Number(e.target.value))}
          style={styles.select}
        >
          <option value="">— Select service —</option>
          {services.map((s) => (
            <option key={s.sid} value={s.sid}>
              {s.name} — ${s.price}
            </option>
          ))}
        </select>

        <label style={styles.label}>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={styles.input}
        />

        {/* Time inputs side by side */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: 12,
            marginBottom: 8,
          }}
        >
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Start</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>End</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              style={styles.input}
            />
          </div>
        </div>

        <label style={styles.label}>Notes (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={styles.textarea}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            marginTop: 20,
          }}
        >
          <button onClick={onClose} style={styles.buttonCancel}>
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={handleSubmit}
            style={{
              ...styles.buttonPrimary,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Scheduling..." : "Schedule"}
          </button>
        </div>
      </div>
    </div>
  );
}
