import React, { useState, useEffect } from "react";

const API = "http://localhost:5000";

interface RevenueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RevenueModal({ isOpen, onClose }: RevenueModalProps) {
  const [loading, setLoading] = useState(false);
  const [revenueData, setRevenueData] = useState({
    weekly: 0,
    monthly: 0
  });

  useEffect(() => {
    if (isOpen) {
      fetchRevenue();
    }
  }, [isOpen]);

  const fetchRevenue = async () => {
    setLoading(true);
    
    try {
      const res = await fetch(`${API}/api/owner/get-revenue`, {
        credentials: "include",
      });
      
      if (res.ok) {
        const data = await res.json();
        setRevenueData({
          weekly: data.weekly,
          monthly: data.monthly
        });
      }
    } catch (err) {
      console.error("Failed to fetch revenue:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: 30,
          maxWidth: 500,
          width: "90%",
          border: "2px solid #DE9E48",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ color: "#372C2E", marginTop: 0, marginBottom: 20 }}>
          Revenue Details
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <div style={{ marginBottom: 15, padding: 20, backgroundColor: "#f9f9f9", border: "1px solid #ddd", textAlign: "center" }}>
              <div style={{ color: "#666", fontSize: 14, marginBottom: 5 }}>
                This Week
              </div>
              <div style={{ fontSize: 28, fontWeight: "bold", color: "#372C2E" }}>
                ${revenueData.weekly.toFixed(2)}
              </div>
            </div>

            <div style={{ marginBottom: 20, padding: 20, backgroundColor: "#f9f9f9", border: "1px solid #ddd", textAlign: "center" }}>
              <div style={{ color: "#666", fontSize: 14, marginBottom: 5 }}>
                This Month
              </div>
              <div style={{ fontSize: 28, fontWeight: "bold", color: "#372C2E" }}>
                ${revenueData.monthly.toFixed(2)}
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                width: "100%",
                padding: 10,
                backgroundColor: "#372C2E",
                color: "#fff",
                border: "none",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}