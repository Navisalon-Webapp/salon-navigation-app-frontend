import React, { useState, useEffect } from "react";
import { RevenueModal } from "../../components/Revenue/SalonRevenue";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const cardStyle: React.CSSProperties = {
  backgroundColor: "#563727",
  border: "1px solid #7A431D",
  borderRadius: "0.5rem",
  padding: "1.5rem",
  color: "#FFFFFF",
  cursor: "pointer",
  transition: "transform 0.2s",
};

const SalonRevenue: React.FC = () => {
  const [revenueData, setRevenueData] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
    yearly: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    fetchRevenue();
  }, []);

  const fetchRevenue = async () => {
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch(`${API}/api/owner/get-revenue`, {
        credentials: "include",
      });
      
      if (res.ok) {
        const data = await res.json();
        setRevenueData(data);
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to fetch revenue data");
      }
    } catch (err) {
      console.error("Failed to fetch revenue:", err);
      setError("An error occurred while fetching revenue data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Page-only background layer */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          background: "#372C2E",
          zIndex: -1,
        }}
      />

      <h1
        style={{
          color: "#FFFFFF",
          fontSize: "1.75rem",
          fontWeight: 600,
          marginBottom: "1.5rem",
        }}
      >
        Salon Revenue
      </h1>

      {loading && (
        <div style={cardStyle}>
          Loading revenue data...
        </div>
      )}

      {error && (
        <div style={{ ...cardStyle, backgroundColor: "#8B4513", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      {!loading && !error && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "3.5rem", maxWidth: "1200px" }}>
          {/* Daily Revenue */}
          <div style={cardStyle} onClick={() => setIsModalOpen(true)}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.9rem", opacity: 0.8, marginBottom: "0.5rem" }}>
                Today's Revenue
              </div>
              <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#DE9E48" }}>
                ${revenueData.daily.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Weekly Revenue */}
          <div style={cardStyle} onClick={() => setIsModalOpen(true)}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.9rem", opacity: 0.8, marginBottom: "0.5rem" }}>
                This Week's Revenue
              </div>
              <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#DE9E48" }}>
                ${revenueData.weekly.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Monthly Revenue */}
          <div style={cardStyle} onClick={() => setIsModalOpen(true)}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.9rem", opacity: 0.8, marginBottom: "0.5rem" }}>
                This Month's Revenue
              </div>
              <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#DE9E48" }}>
                ${revenueData.monthly.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Yearly Revenue */}
          <div style={cardStyle} onClick={() => setIsModalOpen(true)}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.9rem", opacity: 0.8, marginBottom: "0.5rem" }}>
                This Year's Revenue
              </div>
              <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#DE9E48" }}>
                ${revenueData.yearly.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Modal */}
      <RevenueModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default SalonRevenue;
