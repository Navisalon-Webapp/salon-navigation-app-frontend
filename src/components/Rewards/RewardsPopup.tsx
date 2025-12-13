import React, { useEffect, useRef } from "react";

type Salon = {
  id: string;
  bid: number;
  name: string;
  points: number;
  progress?: number;
  goal: number;
  address?: string;
  programType?: string | null;
  rewardType?: string | null;
  rewardValue?: number | null;
};

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
}: {
  open: boolean;
  onClose: () => void;
  salons?: Salon[];
  onRedeemed?: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const salonList = Array.isArray(salons) ? salons : defaultSalons;
  const hasSalons = salonList.length > 0;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current && !cardRef.current.contains(e.target as Node)) onClose();
  };

  useEffect(() => {
    if (open) {
      // No-op hook preserved to reset future stateful additions when dialog opens.
    }
  }, [open]);

  if (!open) {
    return null;
  }

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
                  gridTemplateColumns: "1.6fr 0.7fr 0.7fr",
                  gap: 12,
                  alignItems: "stretch",
                }}
              >
                <div style={{ fontSize: 12, opacity: 0.7 }}>Salon</div>
                <div style={{ fontSize: 12, opacity: 0.7, textAlign: "right" }}>Progress</div>
                <div style={{ fontSize: 12, opacity: 0.7, textAlign: "right" }}>Goal</div>

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
                  const rawProgress = s.programType === "points_thresh" ? s.points : s.progress ?? 0;
                  const effectiveGoal = s.goal && s.goal > 0
                    ? s.goal
                    : s.programType === "points_thresh"
                      ? Math.max(s.goal || 0, s.points ?? 0, 100)
                      : 1;
                  const isBonusReward = String(s.rewardType ?? "").toLowerCase() === "bonus points";
                  const rewardRequirement = Number(s.rewardValue ?? 0);
                  const available = s.points ?? 0;
                  const bonusReady = isBonusReward && rewardRequirement > 0 && available >= rewardRequirement;
                  const baseProgress = Math.min(Math.max(rawProgress, 0), effectiveGoal);
                  const clampedProgress = bonusReady ? effectiveGoal : baseProgress;
                  const progressText = `${formatValue(clampedProgress)} / ${formatValue(effectiveGoal)} ${descriptor.plural}`;
                  const goalText = formatWithUnits(effectiveGoal, descriptor);
                  const availablePoints = formatValue(Math.max(s.points ?? 0, 0));

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
                        <div style={{ fontSize: 12, color: "#563727", opacity: 0.8 }}>
                          Available points: {availablePoints}
                        </div>
                      </div>
                      <div style={{ textAlign: "right", fontWeight: 700 }}>{progressText}</div>
                      <div style={{ textAlign: "right", opacity: 0.8 }}>{goalText}</div>
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