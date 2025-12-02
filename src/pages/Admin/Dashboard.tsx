import React, { useEffect, useState } from "react";
import StatCard from "../../components/Charts/StatCard";
import LineChart from "../../components/Charts/LineChart";
import BarChart from "../../components/Charts/BarChart";

type Salon = {
  id: string;
  name: string;
  email: string;
};

const Dashboard: React.FC = () => {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [tot_active, set_tot_active] = useState('0');
  const [tot_saved, set_tot_saved] = useState('$0');
  const [tot_rev, set_tot_rev] = useState('$0');

  const [age_data, set_age_data] = useState<number[]>([]);
  const [age_labels, set_age_labels] = useState<string[]>([]);

  const [appt_data, set_appt_data] = useState<number[]>([]);
  const [appt_labels, set_appt_labels] = useState<string[]>([]);

  const [rev_data, set_rev_data] = useState<number[]>([]);
  const [rev_labels, set_rev_labels] = useState<string[]>([]);

  // Load pending salons
  const loadPendingSalons = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/admin/pending`, {
        credentials: "include"
      });
      const data = await res.json();
      setSalons(data);
    } catch (e) {
      console.error("Failed to load pending salons", e);
    } finally {
      setLoading(false);
    }
  };

  const fetch_metrics = async () => {
    try {
      const baseUrl = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}`;

      const [
        tot_active_res,
        tot_saved_res,
        tot_rev_res,
        age_res,
        appt_res,
        rev_res
      ] = await Promise.all([
        fetch(`${baseUrl}/admin/total-active-users`, { credentials: "include" }),
        fetch(`${baseUrl}/admin/total-saved`, { credentials: "include" }),
        fetch(`${baseUrl}/admin/total-revenue`, { credentials: "include" }),
        fetch(`${baseUrl}/admin/age`, { credentials: "include" }),
        fetch(`${baseUrl}/admin/appt-trend`, { credentials: "include" }),
        fetch(`${baseUrl}/admin/revenue-trend`, { credentials: "include" }),
      ]);

      const [
        tot_active_data,
        tot_saved_data,
        tot_rev_data,
        age_data,
        appt_data,
        rev_data
      ] = await Promise.all([
        tot_active_res.json(),
        tot_saved_res.json(),
        tot_rev_res.json(),
        age_res.json(),
        appt_res.json(),
        rev_res.json(),
      ]);

      if (tot_active_data.status === "success") {
        set_tot_active(tot_active_data.tot_active);
      }

      if (tot_saved_data.status === "success") {
        set_tot_saved(tot_saved_data.total_savings);
      }

      if (tot_rev_data.status === "success") {
        set_tot_rev(tot_rev_data.total_revenue);
      }

      if (age_data.status === "success") {
        set_age_labels(age_data.age_labels);
        set_age_data(age_data.age_data);
      }

      if (appt_data.status === "success") {
        set_appt_labels(appt_data.appt_trend_labels);
        set_appt_data(appt_data.appt_trend_data);
      }

      if (rev_data.status === "success") {
        set_rev_labels(rev_data.revenue_data);
        set_rev_data(rev_data.revenue_data);
      }

    } catch (e) {
      console.error("Error fetching dashboard metrics:", e);
    }
  };

  useEffect(() => {
    loadPendingSalons();
    fetch_metrics();
  }, []);

  const handleApprove = async (id: string) => {
    const w = salons.find((x) => x.id === id);
    console.log("Approve salon", w);
    await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/admin/${id}/approve`, {
      method: "POST",
      credentials: "include"
    });
    setSalons((list) => list.filter((x) => x.id !== id));
  };

  const handleReject = async (id: string) => {
    const w = salons.find((x) => x.id === id);
    console.log("Reject salon", w);
    await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/admin/${id}/reject`, {
      method: "POST",
      credentials: "include"
    });
    setSalons((list) => list.filter((x) => x.id !== id));
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Background */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          background: "#372C2E",
          zIndex: -1,
        }}
      />

      {/* Main content */}
      <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Approvals */}
        <h1
          style={{
            fontSize: "1.875rem",
            fontWeight: 600,
            textAlign: "center",
            color: "#FFFFFF",
            marginBottom: "1.5rem",
          }}
        >
          Approve Salons
        </h1>

        {/* List */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {loading && (
            <div
              style={{
                backgroundColor: "#563727",
                border: "1px solid #7A431D",
                borderRadius: "0.5rem",
                padding: "1rem",
                color: "#FFFFFF",
                textAlign: "center",
              }}
            >
              Loading pending requests...
            </div>
          )}

          {!loading && salons.length === 0 && (
            <div
              style={{
                backgroundColor: "#563727",
                border: "1px solid #7A431D",
                borderRadius: "0.5rem",
                padding: "1rem",
                color: "#FFFFFF",
                textAlign: "center",
              }}
            >
              No pending requests.
            </div>
          )}

          {!loading &&
            salons.map((w) => (
              <div
                key={w.id}
                style={{
                  backgroundColor: "#563727",
                  border: "1px solid #7A431D",
                  borderRadius: "0.5rem",
                  padding: "1rem",
                  color: "#FFFFFF",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: "1.1rem" }}>{w.name}</div>
                  <div style={{ opacity: 0.8 }}>{w.email}</div>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => handleApprove(w.id)}
                    style={{
                      padding: "0.6rem 1rem",
                      fontWeight: 600,
                      borderRadius: "0.5rem",
                      backgroundColor: "#DE9E48",
                      color: "#372C2E",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(w.id)}
                    style={{
                      padding: "0.6rem 1rem",
                      fontWeight: 600,
                      borderRadius: "0.5rem",
                      backgroundColor: "transparent",
                      color: "#FFFFFF",
                      border: "1px solid #7A431D",
                      cursor: "pointer",
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* ---------------- Dashboard Section ---------------- */}
        <h2
          style={{
            marginTop: "3rem",
            fontSize: "1.8rem",
            textAlign: "center",
            marginBottom: "1.5rem",
            fontWeight: 600,
            color: "#FFFFFF",
          }}
        >
          Admin Dashboard
        </h2>

        {/* Cards */}
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", marginBottom: "2rem" }}>
          <StatCard title="Total active users" value={tot_active} />
          <StatCard title="Total saved" value={tot_saved} />
          <StatCard title="Total revenue" value={tot_rev} />
        </div>

        {/* Charts */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
            <BarChart labels={age_labels} data={age_data} title="Client age distribution" />
            <LineChart labels={appt_labels} data={appt_data} title="Appointments this year" />
            <LineChart labels={rev_labels} data={rev_data} title="Revenue for last year" />
        </div>
      </div>

      <style>{`
        button:hover { filter: brightness(1.05); }
      `}</style>
    </div>
  );
};

export default Dashboard;
