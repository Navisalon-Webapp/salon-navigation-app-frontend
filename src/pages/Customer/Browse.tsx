import React, { useState, useEffect } from "react";
import AppointmentModal from "../../components/appointment_modal";
import BusinessDetailsModal from "../../components/BusinessDetailsModal";

interface Salon {
  business_id: number;
  name: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
}

interface Worker {
  employee_id: number;
  employee_first_name: string;
  employee_last_name: string;
  expertise: string;
  business_name: string;
  business_id: number;
  street: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
}

type Mode = "salons" | "workers";

export default function Browse() {
  const [mode, setMode] = useState<Mode>("salons");
  const [results, setResults] = useState<Salon[] | Worker[]>([]);
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalBusinessId, setModalBusinessId] = useState<number | null>(null);
  const [modalEmployeeId, setModalEmployeeId] = useState<number | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [detailsBusinessId, setDetailsBusinessId] = useState<number | null>(null);
  const [detailsBusinessName, setDetailsBusinessName] = useState("");

  const backendBase = "http://localhost:5000";

  // --- Fetch all data depending on mode ---
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint =
        mode === "salons"
          ? `${backendBase}/api/client/browse-salons`
          : `${backendBase}/api/client/browse-workers`;

      const res = await fetch(endpoint, {
        credentials: "include"
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const text = await res.text();

      // If backend returned HTML instead of JSON, stop early
      if (text.startsWith("<!DOCTYPE") || text.startsWith("<html")) {
        throw new Error("Received HTML instead of JSON (check backend route)");
      }

      const data = JSON.parse(text) as Salon[] | Worker[];

      // --- Apply client-side filters ---
      let filtered = data;

      if (location.trim()) {
        filtered = filtered.filter((item: any) => {
          const loc = `${item.city || ""} ${item.state || ""} ${item.country || ""}`;
          return loc.toLowerCase().includes(location.toLowerCase());
        });
      }

      if (service.trim() && mode === "workers") {
        filtered = (filtered as Worker[]).filter((w) =>
          w.expertise?.toLowerCase().includes(service.toLowerCase())
        );
      }

      if (search.trim()) {
        filtered = filtered.filter((item: any) => {
          const name =
            mode === "salons"
              ? (item as Salon).name
              : `${(item as Worker).employee_first_name} ${
                  (item as Worker).employee_last_name
                }`;
          return name.toLowerCase().includes(search.toLowerCase());
        });
      }

      setResults(filtered);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message || "Unknown error");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [mode]);

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
        Browse
      </h1>

      {/* --- Filters --- */}
      <div style={{ marginBottom: 24, display: "flex", gap: 16, flexWrap: "wrap" }}>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as Mode)}
          style={{
            padding: 8,
            borderRadius: 6,
            border: "1px solid #DE9E48",
            color: "#372C2E",
          }}
        >
          <option value="salons">Browse Salons</option>
          <option value="workers">Browse Workers</option>
        </select>

        <input
          type="text"
          placeholder="Filter by service (e.g. haircut)"
          value={service}
          onChange={(e) => setService(e.target.value)}
          disabled={mode === "salons"}
          style={{
            padding: 8,
            borderRadius: 6,
            border: "1px solid #DE9E48",
            color: "#372C2E",
          }}
        />

        <input
          type="text"
          placeholder="Filter by location (city/state)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{
            padding: 8,
            borderRadius: 6,
            border: "1px solid #DE9E48",
            color: "#372C2E",
          }}
        />

        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: 8,
            borderRadius: 6,
            border: "1px solid #DE9E48",
            color: "#372C2E",
          }}
        />

        <button
          onClick={fetchData}
          style={{
            backgroundColor: "#DE9E48",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 6,
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      {/* --- Results --- */}
      {loading ? (
        <p style={{ color: "#563727" }}>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : results.length === 0 ? (
        <p style={{ color: "#563727" }}>No results found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: 20,
          }}
        >
          {(results as (Salon | Worker)[]).map((item) => (
            <div
              key={
                mode === "salons"
                  ? (item as Salon).business_id
                  : (item as Worker).employee_id
              }
              style={{
                border: "1px solid #DE9E48",
                borderRadius: 10,
                padding: 16,
                backgroundColor: "#FFF9F4",
                color: "#372C2E",
              }}
            >
              <h3 style={{ marginTop: 0 }}>
                {mode === "salons"
                  ? (item as Salon).name
                  : `${(item as Worker).employee_first_name} ${
                      (item as Worker).employee_last_name
                    }`}
              </h3>
              <p style={{ margin: "4px 0" }}>
                {(item as Salon | Worker).street}, {(item as Salon | Worker).city},{" "}
                {(item as Salon | Worker).state}
              </p>

              {mode === "workers" && (
                <>
                  <p style={{ margin: "4px 0" }}>
                    Expertise: <b>{(item as Worker).expertise}</b>
                  </p>
                  <p style={{ margin: "4px 0" }}>
                    Salon: {(item as Worker).business_name}
                  </p>
                </>
              )}

              <div style={{ display: "flex", gap: 8, marginTop: 12, flexDirection: "column" }}>
                <button
                  style={{
                    backgroundColor: "#DE9E48",
                    border: "none",
                    color: "#FFFFFF",
                    padding: "8px 12px",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setModalBusinessId(mode === "salons" ? (item as Salon).business_id : (item as Worker).business_id);
                    setModalEmployeeId(mode === "workers" ? (item as Worker).employee_id : null);
                    setModalOpen(true);
                  }}
                >
                  Schedule Appointment
                </button>
                
                {mode === "salons" && (
                  <button
                    style={{
                      backgroundColor: "#563727",
                      border: "none",
                      color: "#FFFFFF",
                      padding: "8px 12px",
                      borderRadius: 6,
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setDetailsBusinessId((item as Salon).business_id);
                      setDetailsBusinessName((item as Salon).name);
                      setDetailsModalOpen(true);
                    }}
                  >
                    View Details
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {modalBusinessId !== null && (
        <AppointmentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          businessId={modalBusinessId}
          employeeId={modalEmployeeId}
          onSuccess={fetchData}
        />
      )}

      {detailsBusinessId !== null && (
        <BusinessDetailsModal
          open={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          businessId={detailsBusinessId}
          businessName={detailsBusinessName}
        />
      )}
    </div>
  );
}