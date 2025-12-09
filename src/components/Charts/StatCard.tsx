import {forwardRef} from "react";

interface StatCardProps {
  title: string;
  value: string | number;
}

const StatCard = forwardRef<HTMLDivElement, StatCardProps>( ({ title, value }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        backgroundColor: "#563727",
        color: "#FFFFFF",
        padding: "1rem",
        borderRadius: "0.75rem",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
      }}
    >
      <div style={{ fontSize: "2rem", fontWeight: 700, textAlign:"center", color: "#DE9E48" }}>
        {value}
      </div>
      <div style={{ opacity: 0.8, textAlign:"center", marginTop: "0.25rem" }}>{title}</div>
    </div>
  );
});

export default StatCard;
