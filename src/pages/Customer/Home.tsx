import { useState, useEffect } from "react";
import RewardRing from "../../components/Rewards/RewardRing";
import RewardsPopup from "../../components/Rewards/RewardsPopup";

type Salon = {
  id: string;
  bid: number;
  name: string;
  points: number;
  goal: number;
  address?: string;
};

export default function Home() {
  const [open, setOpen] = useState(false);
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoyaltyPoints = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/clients/view-loyalty-points", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setSalons(data);
        } else {
          console.error("Failed to fetch loyalty points");
          setSalons([]);
        }
      } catch (error) {
        console.error("Error fetching loyalty points:", error);
        setSalons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLoyaltyPoints();
  }, []);

  const topSalon = salons.length > 0 
    ? salons.reduce((max, salon) => salon.points > max.points ? salon : max, salons[0])
    : null;

  const currentPoints = topSalon?.points || 0;
  const goalPoints = topSalon?.goal || 100;

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 40,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        border: "2px solid #DE9E48",
      }}
    >
      <h1
        style={{
          color: "#372C2E",
          marginTop: 0,
          borderBottom: "3px solid #DE9E48",
          paddingBottom: 16,
          marginBottom: 24,
        }}
      >
        Home
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 20,
          alignItems: "start",
        }}
      >
        {loading ? (
          <div style={{ color: "#372C2E", padding: 20 }}>Loading rewards...</div>
        ) : salons.length === 0 ? (
          <div style={{ color: "#372C2E", padding: 20 }}>No loyalty rewards yet. Visit a salon to start earning!</div>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={open}
            style={{ all: "unset", cursor: "pointer", borderRadius: 12 }}
          >
            <RewardRing 
              current={currentPoints} 
              goal={goalPoints}
              salonName={topSalon?.name || "Salon"}
            />
          </button>
        )}
      </div>

      <RewardsPopup
        open={open}
        onClose={() => setOpen(false)}
        salons={salons}
      />
    </div>
  );
}
