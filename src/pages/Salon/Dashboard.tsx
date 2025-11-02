import React, { useState, useEffect } from "react";
import { RevenueModal } from "../../components/Revenue/SalonRevenue";

export default function BusinessDashboard() {
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dailyRevenue, setDailyRevenue] = useState(0);

  useEffect(() => {
    fetchDailyRevenue();
  }, []);

  const fetchDailyRevenue = async () => {
    setLoading(true);
    
    // Connect to backend to fetch daily revenue
    setTimeout(() => {
      setDailyRevenue(450.75);
      setLoading(false);
    }, 500);
  };

  return (
    <div style={{ 
      backgroundColor: '#FFFFFF', 
      borderRadius: 12, 
      padding: 40, 
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      border: '2px solid #DE9E48'
    }}>
      <h1 style={{ 
        color: '#372C2E', 
        marginTop: 0,
        borderBottom: '3px solid #DE9E48',
        paddingBottom: 16,
        marginBottom: 24
      }}>
        Dashboard
      </h1>
      
      <div
        onClick={() => setShowRevenueModal(true)}
        style={{
          backgroundColor: "#DE9E48",
          borderRadius: 12,
          padding: 20,
          width: 300,
          color: "#FFFFFF",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          textAlign: "center",
          marginBottom: 20
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 18 }}>
          Today's Revenue
        </div>
        {loading ? (
          <div style={{ fontSize: 32, fontWeight: "bold" }}>Loading...</div>
        ) : (
          <div style={{ fontSize: 36, fontWeight: "bold" }}>
            ${dailyRevenue.toFixed(2)}
          </div>
        )}
        <div style={{ fontSize: 13, marginTop: 10, opacity: 0.85 }}>
          Click for details
        </div>
      </div>

      <RevenueModal 
        isOpen={showRevenueModal} 
        onClose={() => setShowRevenueModal(false)} 
      />
    </div>
  );
}