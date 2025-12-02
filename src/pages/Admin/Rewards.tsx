import React, { use, useEffect, useState } from "react";
import StatCard from "../../components/Charts/StatCard";
import LineChart from "../../components/Charts/LineChart";
import BarChart from "../../components/Charts/BarChart";
import PieChart from "../../components/Charts/PieChart";

const Rewards: React.FC = () => {
    const [act_progs, set_act_progs] = useState('0');
    const [client_part, set_client_part] = useState('0%');
    const [avg_saved, set_avg_saved] = useState('$0');
    const [tot_savings, set_tot_savings] = useState('$0');

    const [progs_by_salon_data, set_progs_by_salon_data] = useState<number[]>([]);
    const [progs_by_salon_labels, set_progs_by_salon_labels] = useState<string[]>([]);

    const [prog_types_data, set_prog_types_data] = useState<number[]>([]);
    const [prog_types_labels, set_prog_types_labels] = useState<string[]>([]);

    const [saved_data, set_saved_data] = useState<number[]>([]);
    const [saved_labels, set_saved_labels] = useState<string[]>([]);

    useEffect(() => {
        const fetch_metrics = async () => {
            try {
                const baseUrl = "http://localhost:5000";
                
                const[
                    act_progs_res,
                    client_part_res,
                    avg_saved_res,
                    tot_savings_res,
                    progs_by_salon_res,
                    prog_types_res,
                    saved_trend_res
                ] = await Promise.all([
                    fetch(`${baseUrl}/admin/total-programs`, { credentials: "include" }),
                    fetch(`${baseUrl}/admin/client-participation`, { credentials: "include" }),
                    fetch(`${baseUrl}/admin/average-saved`, { credentials: "include" }),
                    fetch(`${baseUrl}/admin/total-saved`, { credentials: "include" }),
                    fetch(`${baseUrl}/admin/prog-salon`, { credentials: "include" }),
                    fetch(`${baseUrl}/admin/prog-types`, { credentials: "include" }),
                    fetch(`${baseUrl}/admin/savings-trend`, { credentials: "include" }),
                ]);
                
                const [
                    act_progs_data,
                    client_part_data,
                    avg_saved_data,
                    tot_savings_data,
                    progs_by_salon_data,
                    prog_types_data,
                    saved_trend_data
                ] = await Promise.all([
                    act_progs_res.json(),
                    client_part_res.json(),
                    avg_saved_res.json(),
                    tot_savings_res.json(),
                    progs_by_salon_res.json(),
                    prog_types_res.json(),
                    saved_trend_res.json(),
                ]);

                if (act_progs_data.status === "success") {
                    set_act_progs(act_progs_data.total_programs);
                }

                if (client_part_data.status === "success") {
                    set_client_part(client_part_data.client_participation);
                }

                if (avg_saved_data.status === "success") {
                    set_avg_saved(avg_saved_data.avg_saved);
                }

                if (tot_savings_data.status === "success") {
                    set_tot_savings(tot_savings_data.total_savings);
                }

                if (progs_by_salon_data.status === "success") {
                    set_progs_by_salon_labels(progs_by_salon_data.prog_salon_labels);
                    set_progs_by_salon_data(progs_by_salon_data.prog_salon_data);
                }

                if (prog_types_data.status === "success") {
                    set_prog_types_labels(prog_types_data.labels);
                    set_prog_types_data(prog_types_data.data);
                }

                if (saved_trend_data.status === "success") {
                    set_saved_labels(saved_trend_data.savings_labels);
                    set_saved_data(saved_trend_data.savings_data);
                }
                
            } catch (e) {
                console.error("Error fetching metrics:", e);
            }
        };
        
        fetch_metrics();
    }, []);

    return (
    <div style={{ position: "relative"}}>
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

        <h2
            style={{
            fontSize: "1.8rem",
            textAlign: "center",
            marginBottom: "1.5rem",
            fontWeight: 600,
            color: "#FFFFFF",
            }}
        >
            Loyalty Programs
        </h2>

        {/* Cards */}
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", marginBottom: "2rem" }}>
            <StatCard title="Active loyalty programs" value={act_progs} />
            <StatCard title="Client participation" value={client_part} />
            <StatCard title="Saved on average" value={avg_saved} />
            <StatCard title="Total savings" value={tot_savings} />
        </div>

        {/* Charts */}
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", marginBottom: "2rem" }}> {/*auto-fit?*/}
            <BarChart labels={progs_by_salon_labels} data={progs_by_salon_data} title="Loyalty Programs by Salon" />
            <PieChart labels={prog_types_labels} data={prog_types_data} title="Loyalty Program Types" />
            <LineChart labels={saved_labels} data={saved_data} title="Amount Saved Trend" />
        </div>
        </div>

        <style>{`
        button:hover { filter: brightness(1.05); }
        `}</style>
    </div>
    );
};

export default Rewards;
