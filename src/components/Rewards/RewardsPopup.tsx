import React, { useEffect, useRef, useState } from "react";

type Salon = {
  id: string;
  bid: number;
  name: string;
  points: number;
  goal: number;
  address?: string;
  programType?: string | null;
  rewardType?: string | null;
  rewardValue?: number | null;
};

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const defaultSalons: Salon[] = [];

type ProgramDescriptor = {
  plural: string;
  singular: string;
};

const PROGRAM_UNITS: Record<string, ProgramDescriptor> = {
  appts_thresh: { plural: "appointments", singular: "appointment" },
  pdct_thresh: { plural: "products", singular: "product" },
  points_thresh: { plural: "points", singular: "point" },
  price_thresh: { plural: "dollars", singular: "dollar" },
};

const getProgramUnits = (programType?: string | null): ProgramDescriptor => {
  if (!programType) {
    return PROGRAM_UNITS.points_thresh;
  }
  return PROGRAM_UNITS[programType] ?? PROGRAM_UNITS.points_thresh;
};

const formatValue = (value?: number | null): string => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "0";
  }
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
};

const formatWithUnits = (value: number | null | undefined, descriptor: ProgramDescriptor): string => {
  const safeValue = value ?? 0;
  return `${formatValue(safeValue)} ${safeValue === 1 ? descriptor.singular : descriptor.plural}`;
};

export default function RewardsPopup({
  open,
  onClose,
  salons,
  onRedeemed,
}: {
  open: boolean;
  onClose: () => void;
  salons?: Salon[];
  onRedeemed?: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [busySalonId, setBusySalonId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const salonList = Array.isArray(salons) ? salons : defaultSalons;
  const hasSalons = salonList.length > 0;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current && !cardRef.current.contains(e.target as Node)) onClose();
  };

  useEffect(() => {
    if (open) {
      setFeedback(null);
      setError(null);
      setBusySalonId(null);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const handleRedeem = async (salon: Salon) => {
    if (salon.points <= 0) {
      setError("You don't have any points to redeem with this salon yet.");
      return;
    }

    const descriptor = getProgramUnits(salon.programType);
    const suggested = salon.goal > 0 ? Math.min(salon.points, salon.goal) : salon.points;
    const promptValue = window.prompt(
      `Redeem points at ${salon.name}. You currently have ${formatWithUnits(salon.points, descriptor)}.\n\nEnter how many points to redeem:`,
      String(Math.max(1, suggested))
    );

    if (promptValue === null) {
      return;
    }

    const parsed = Number.parseInt(promptValue, 10);
    if (Number.isNaN(parsed) || parsed <= 0) {
      setError("Please enter a valid positive number of points to redeem.");
      return;
    }
    if (parsed > salon.points) {
      setError("You cannot redeem more points than you currently have.");
      return;
    }

    setBusySalonId(salon.id);
    setError(null);
    setFeedback(null);
    try {
      const res = await fetch(`${API_BASE}/api/loyalty/redeem`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bid: salon.bid, points: parsed }),
      });

      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        const message = payload?.message ?? "Unable to redeem points right now.";
        setError(message);
        return;
      }

      const discount = payload?.data?.discount ?? 0;
      setFeedback(`Redeemed ${parsed} points for a $${Number(discount).toFixed(2)} discount.`);
      if (onRedeemed) {
        onRedeemed();
      }
    } catch (err) {
      console.error("Failed to redeem loyalty points", err);
      setError("Unable to redeem points right now. Please try again later.");
    } finally {
      setBusySalonId(null);
    }
  };

  const programLabel = (programType?: string | null) => {
    switch (programType) {
      case "appts_thresh":
        return "Visits milestone";
      case "pdct_thresh":
        return "Product purchases";
      case "points_thresh":
        return "Points goal";
      case "price_thresh":
        return "Spend goal";
      default:
        return "Loyalty goal";
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Rewards from all salons"
      onMouseDown={handleBackdropClick}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        padding: 20,
      }}
    >
      <div
        ref={cardRef}
        style={{
          width: "min(700px, 100%)",
          background: "#FFFFFF",
          borderRadius: 12,
          border: "2px solid #DE9E48",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          color: "#372C2E",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "3px solid #DE9E48",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2 style={{ margin: 0 }}>All Salon Rewards</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "transparent",
              border: "1px solid #DE9E48",
              color: "#372C2E",
              borderRadius: 8,
              padding: "6px 10px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Close
          </button>
        </div>

        <div style={{ padding: 20 }}>
          {feedback && (
            <div
              style={{
                background: "rgba(61, 156, 75, 0.1)",
                border: "1px solid rgba(61, 156, 75, 0.45)",
                color: "#245530",
                borderRadius: 8,
                padding: "10px 12px",
                marginBottom: 16,
              }}
            >
              {feedback}
            </div>
          )}

          {error && (
            <div
              style={{
                background: "rgba(176, 0, 32, 0.12)",
                border: "1px solid rgba(176, 0, 32, 0.55)",
                color: "#8C1C13",
                borderRadius: 8,
                padding: "10px 12px",
                marginBottom: 16,
              }}
            >
              {error}
            </div>
          )}

          {hasSalons ? (
            <>
              <div
                style={{
                  background: "#F9F5F1",
                  border: "1px solid #DE9E48",
                  borderRadius: 10,
                  padding: 12,
                  marginBottom: 16,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontWeight: 600,
                }}
              >
                <span>Active loyalty programs</span>
                <span>{salonList.length}</span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.4fr 0.6fr 0.6fr 0.9fr",
                  gap: 12,
                  alignItems: "stretch",
                }}
              >
                <div style={{ fontSize: 12, opacity: 0.7 }}>Salon</div>
                <div style={{ fontSize: 12, opacity: 0.7, textAlign: "right" }}>Progress</div>
                <div style={{ fontSize: 12, opacity: 0.7, textAlign: "right" }}>Goal</div>
                <div style={{ fontSize: 12, opacity: 0.7, textAlign: "center" }}>Actions</div>

                {salonList.map((s: Salon) => {
                  const displayReward = (() => {
                    if (s.rewardValue === null || s.rewardValue === undefined) {
                      return "";
                    }
                    const numericReward = Number(s.rewardValue);
                    if (Number.isFinite(numericReward)) {
                      return ` (${numericReward.toLocaleString()})`;
                    }
                    return typeof s.rewardValue === "string" ? ` (${s.rewardValue})` : "";
                  })();

                  const descriptor = getProgramUnits(s.programType);
                  const progressText = `${formatValue(s.points)} / ${formatValue(s.goal)} ${descriptor.plural}`;
                  const goalText = formatWithUnits(s.goal, descriptor);

                  return (
                    <React.Fragment key={s.id ?? `${s.bid}`}>
                      <div
                        style={{
                          background: "#FFFFFF",
                          border: "1px solid #E6E6E6",
                          borderRadius: 8,
                          padding: "10px 12px",
                          gridColumn: "1 / 2",
                        }}
                      >
                        <div style={{ fontWeight: 700, color: "#372C2E" }}>{s.name}</div>
                        <div style={{ fontSize: 12, color: "#563727", opacity: 0.8 }}>{s.address ?? ""}</div>
                        <div style={{ fontSize: 12, color: "#563727", opacity: 0.8 }}>
                          {programLabel(s.programType)} · {s.rewardType ?? "Reward"}
                          {displayReward}
                        </div>
                      </div>
                      <div style={{ textAlign: "right", fontWeight: 700 }}>{progressText}</div>
                      <div style={{ textAlign: "right", opacity: 0.8 }}>{goalText}</div>
                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <button
                          type="button"
                          onClick={() => handleRedeem(s)}
                          disabled={busySalonId === s.id || s.points <= 0}
                          style={{
                            background: s.points > 0 ? "#DE9E48" : "#BFBFBF",
                            color: "#372C2E",
                            border: "none",
                            borderRadius: 8,
                            padding: "6px 12px",
                            fontWeight: 600,
                            cursor:
                              busySalonId === s.id ? "wait" : s.points <= 0 ? "not-allowed" : "pointer",
                            minWidth: 90,
                            opacity: busySalonId === s.id || s.points <= 0 ? 0.7 : 1,
                          }}
                          title={s.points <= 0 ? "No points available to redeem" : undefined}
                        >
                          {busySalonId === s.id ? "Processing..." : "Redeem"}
                        </button>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </>
          ) : (
            <div
              style={{
                background: "#F9F5F1",
                border: "1px solid #DE9E48",
                borderRadius: 10,
                padding: 16,
                textAlign: "center",
                fontWeight: 600,
              }}
            >
              No loyalty activity yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}