import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../auth/AuthContext";

type EmailPrefs = {
  marketing: boolean;
  appointments: boolean;
};

const DEFAULT_PREFS: EmailPrefs = {
  marketing: false,
  appointments: true,
};

function useEmailPrefs(userId?: string | null) {
  const storageKey = useMemo(() => (userId ? `emailPrefs:${userId}` : null), [userId]);

  const load = useCallback((): EmailPrefs => {
    if (!storageKey) return DEFAULT_PREFS;
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return DEFAULT_PREFS;
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_PREFS, ...parsed } satisfies EmailPrefs;
    } catch {
      return DEFAULT_PREFS;
    }
  }, [storageKey]);

  const save = useCallback((prefs: EmailPrefs) => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(prefs));
  }, [storageKey]);

  return { load, save };
}

export default function EmailSubscriptions() {
  const { user } = useAuth();
  const { load, save } = useEmailPrefs(user?.id ?? null);

  const [prefs, setPrefs] = useState<EmailPrefs>(DEFAULT_PREFS);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [saving, setSaving] = useState(false);
  const API_BASE = "http://localhost:5000";

  useEffect(() => {
    setPrefs(load());
  }, [load]);

  const allSelected = Object.values(prefs).every(Boolean);
  const noneSelected = Object.values(prefs).every((v) => !v);

  const update = (patch: Partial<EmailPrefs>) => {
    setPrefs((p) => ({ ...p, ...patch }));
    setStatus("idle");
  };

  const selectAll = () => update({ marketing: true, appointments: true });
  const unselectAll = () => update({ marketing: false, appointments: false });

  const handleSave = async () => {
    setSaving(true);
    try {
      const tasks: Promise<Response>[] = [];
      const cid = user?.id;

      if (cid) {
        tasks.push(
          fetch(`${API_BASE}/api/clients/manage-email-subs`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ promotion: prefs.marketing }),
          })
        );

        tasks.push(
          fetch(`${API_BASE}/api/clients/manage-appt-reminder-subs`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ appointment: prefs.appointments }),
          })
        );
      }

      if (tasks.length) {
        const results = await Promise.all(tasks);

        for (const r of results) {
          try {
            const text = await r.text();
            console.log("EmailSubscriptions: server response", r.status, text);
          } catch (err) {
            console.log("EmailSubscriptions: response read error", err);
          }
        }

        const bad = results.find((r) => !r.ok);
        if (bad) {
          setStatus("error");
          throw new Error(`HTTP ${bad.status}`);
        }
      }

      save(prefs);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (e) {
      console.error("Failed to save email prefs:", e);
      save(prefs);
      if (status !== "error") {
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 2000);
      }
    } finally {
      setSaving(false);
    }
  };

  const Section: React.FC<{ title: string; desc: string; checked: boolean; onChange: (v: boolean) => void }> = ({
    title,
    desc,
    checked,
    onChange,
  }) => (
    <label
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "center",
        gap: 12,
        padding: "14px 16px",
        border: "1px solid #E6E6E6",
        borderRadius: 12,
        background: "#fff",
      }}
    >
      <div>
        <div style={{ fontWeight: 700, color: "#372C2E" }}>{title}</div>
        <div style={{ fontSize: 12, color: "#6B6B6B" }}>{desc}</div>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ width: 20, height: 20, cursor: "pointer" }}
        aria-label={title}
      />
    </label>
  );

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div>
        <h1 style={{ margin: 0, color: "#372C2E" }}>Email Preferences</h1>
        <p style={{ marginTop: 6, color: "#6B6B6B" }}>
          Choose which emails you want to receive from us. These settings are saved on this device for now.
        </p>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          onClick={selectAll}
          disabled={allSelected}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #DE9E48",
            color: allSelected ? "#9F9F9F" : "#DE9E48",
            background: "#FFF8EC",
            cursor: allSelected ? "not-allowed" : "pointer",
          }}
        >
          Select all
        </button>
        <button
          onClick={unselectAll}
          disabled={noneSelected}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #E6E6E6",
            color: noneSelected ? "#9F9F9F" : "#372C2E",
            background: "#FFFFFF",
            cursor: noneSelected ? "not-allowed" : "pointer",
          }}
        >
          Unsubscribe all
        </button>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        <Section
          title="Appointment reminders"
          desc="Confirmations and reminders for your upcoming bookings."
          checked={prefs.appointments}
          onChange={(v) => update({ appointments: v })}
        />
        <Section
          title="Marketing and offers"
          desc="Personalized promotions, rewards, and seasonal deals."
          checked={prefs.marketing}
          onChange={(v) => update({ marketing: v })}
        />
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button
          onClick={handleSave}
          style={{
            padding: "12px 18px",
            fontWeight: 700,
            borderRadius: 10,
            background: "#DE9E48",
            color: "#372C2E",
            border: "none",
            cursor: "pointer",
          }}
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
  {status === "saved" && <span style={{ color: "#0C7C59" }}>Saved!</span>}
  {status === "error" && <span style={{ color: "#C23B22" }}>Failed to save preferences (server error)</span>}
      </div>

    
    </div>
  );
}
