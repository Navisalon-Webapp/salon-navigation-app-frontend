import React, { useRef, useEffect, useState } from "react";
import StatCard from "../../components/Charts/StatCard";
import LineChart from "../../components/Charts/LineChart";
import BarChart from "../../components/Charts/BarChart";
import PieChart from "../../components/Charts/PieChart";
import ReportButton from "../../components/ReportButton";

const Engagement: React.FC = () => {
    const totActiveRef = useRef<HTMLDivElement>(null);
    const exploreRef = useRef<HTMLDivElement>(null);
    const salViewRef = useRef<HTMLDivElement>(null);
    const prodViewRef = useRef<HTMLDivElement>(null);
    const newUserRef = useRef<HTMLDivElement>(null);
    const roleRef = useRef<HTMLDivElement>(null);
    const activeRef = useRef<HTMLDivElement>(null);

    const [tot_active_users, set_tot_active_users] = useState('0');
    const [avg_salons_explored, set_avg_salons_explored] = useState('0');
    const [avg_salon_views, set_avg_salon_views] = useState('0');
    const [avg_prod_views, set_avg_prod_views] = useState('0');

    const [reg_trend_data, set_reg_trend_data] = useState<number[]>([]);
    const [reg_trend_labels, set_reg_trend_labels] = useState<string[]>([]);

    const [active_user_roles_data, set_active_user_roles_data] = useState<number[]>([]);
    const [active_user_roles_labels, set_active_user_roles_labels] = useState<string[]>([]);

    const [active_user_data, set_active_user_data] = useState<number[]>([]);
    const [active_user_labels, set_active_user_labels] = useState<string[]>([]);

    useEffect(() => {
        const fetch_metrics = async () => {
            try {
                const baseUrl = "http://localhost:5000";
                
                const[
                    tot_active_res,
                    avg_salons_res,
                    avg_salon_views_res,
                    avg_prod_views_res,
                    reg_trend_res,
                    active_user_roles_res,
                    active_user_trend_res
                ] = await Promise.all([
                    fetch(`${baseUrl}/admin/total-active-users`, { credentials: "include" }),
                    fetch(`${baseUrl}/admin/salons-explored`, { credentials: "include" }),
                    fetch(`${baseUrl}/admin/salon-views`, { credentials: "include" }),
                    fetch(`${baseUrl}/admin/product-views`, { credentials: "include" }),
                    fetch(`${baseUrl}/admin/new-user-trend`, { credentials: "include" }),
                    fetch(`${baseUrl}/admin/active-user-roles`, { credentials: "include" }),
                    fetch(`${baseUrl}/admin/active-user-trend`, { credentials: "include" }),
                ]);
                
                const [
                    tot_active_data,
                    avg_salons_data,
                    avg_salon_views_data,
                    avg_prod_views_data,
                    reg_trend_data,
                    active_user_roles_data,
                    active_user_trend_data
                ] = await Promise.all([
                    tot_active_res.json(),
                    avg_salons_res.json(),
                    avg_salon_views_res.json(),
                    avg_prod_views_res.json(),
                    reg_trend_res.json(),
                    active_user_roles_res.json(),
                    active_user_trend_res.json(),
                ]);

                if (tot_active_data.status === "success") {
                    set_tot_active_users(tot_active_data.tot_active);
                }
                if (avg_salons_data.status === "success") {
                    set_avg_salons_explored(avg_salons_data.avg_salons_explored);
                }
                if (avg_salon_views_data.status === "success") {
                    set_avg_salon_views(avg_salon_views_data.avg_salon_views);
                }
                if (avg_prod_views_data.status === "success") {
                    set_avg_prod_views(avg_prod_views_data.avg_product_views);
                }
                if (reg_trend_data.status === "success") {
                    set_reg_trend_labels(reg_trend_data.new_user_labels);
                    set_reg_trend_data(reg_trend_data.new_user_data);
                }
                if (active_user_roles_data.status === "success") {
                    set_active_user_roles_labels(active_user_roles_data.active_user_labels);
                    set_active_user_roles_data(active_user_roles_data.active_user_data);
                }
                if (active_user_trend_data.status === "success") {
                    set_active_user_labels(active_user_trend_data.active_user_labels);
                    set_active_user_data(active_user_trend_data.active_user_data);
                }

            } catch (e) {
                console.error("Error fetching metrics:", e);
            }
        };

        fetch_metrics();
    }, []);

    const reportItems = [
        {id: "tot_act", label: "Total Active Users", ref: totActiveRef},
        {id: "explore", label: "Average Salons Clients Explore", ref: exploreRef},
        {id: "sal_visit", label: "Average Salon Page Visits by Clients", ref: salViewRef},
        {id: "prod_visit", label: "Average Product Page Visits by Clients", ref: prodViewRef},
        {id: "new_users", label: "New User Registration Trend", ref: newUserRef},
        {id: "role", label: "Active User Role Distribution", ref: roleRef},
        {id: "active", label: "Active User Trend", ref: activeRef}
    ]

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

        {/* ---------------- Dashboard Section ---------------- */}
        {/* Heading */}
        <div style={{ position: "relative", display: "flex", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <div>
                <h2 style={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "1.8rem",
                    textAlign: "center",
                    marginBottom: "1.5rem",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    }}>
                    User Engagement
                </h2>
            </div>
            <div style={{
                flex: 1,
                display: "flex",
                justifyContent: "flex-end"
            }}>
                <ReportButton items={reportItems}></ReportButton></div>
            </div>

        {/* Cards */}
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", marginBottom: "2rem" }}>
            <StatCard ref={totActiveRef} title="Total active users" value={tot_active_users} />
            <StatCard ref={exploreRef} title="Average salons client explore" value={avg_salons_explored} />
            <StatCard ref={salViewRef} title="Average salon views by clients" value={avg_salon_views} />
            <StatCard ref={prodViewRef} title="Average product views by clients" value={avg_prod_views} />
        </div>

        {/* Charts */}
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", marginBottom: "2rem" }}>
            <LineChart ref={newUserRef} labels={reg_trend_labels} data={reg_trend_data} title="User Registration Trend" />
            <PieChart ref={roleRef} labels={active_user_roles_labels} data={active_user_roles_data} title="Active User Roles" />
            <LineChart ref={activeRef} labels={active_user_labels} data={active_user_data} title="Active User Trend" />
        </div>
        </div>

        <style>{`
        button:hover { filter: brightness(1.05); }
        `}</style>
    </div>
    );
};

export default Engagement;
