import React, { useRef, useEffect, useState } from "react";
import StatCard from "../../components/Charts/StatCard";
import LineChart from "../../components/Charts/LineChart";
import BarChart from "../../components/Charts/BarChart";
import PieChart from "../../components/Charts/PieChart";
import ReportButton from "../../components/ReportButton";

const Revenue: React.FC = () => {
    const totRef = useRef<HTMLDivElement>(null);
    const monthRef = useRef<HTMLDivElement>(null);
    const yearRef = useRef<HTMLDivElement>(null);
    const avgRef = useRef<HTMLDivElement>(null);
    const trendRef = useRef<HTMLDivElement>(null);
    const sourceRef = useRef<HTMLDivElement>(null);
    const catRef = useRef<HTMLDivElement>(null);

    const [tot_revenue, set_tot_revenue] = useState('$0');
    const [last_month, set_last_month] = useState<number>(0);
    const [last_year, set_last_year] = useState<number>(0);
    const [avg_salon_revenue, set_avg_salon_revenue] = useState('$0');

    const [rev_data, set_rev_data] = useState<number[]>([]);
    const [rev_labels, set_rev_labels] = useState<string[]>([]);

    const [src_data, set_src_data] = useState<number[]>([]);
    const [src_labels, set_src_labels] = useState<string[]>([]);

    const [service_data, set_service_data] = useState<number[]>([]);
    const [service_labels, set_service_labels] = useState<string[]>([]);

    const format_percent_change = (value: number) => {
        const sign = value > 0 ? '+' : '';
        return `${sign}${value}%`;
    };

    useEffect(() => {
        const fetch_metrics = async () => {
            try {
                const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
                
                const[
                    tot_revenue_res,
                    last_month_res,
                    last_year_res,
                    avg_salon_revenue_res,
                    rev_res,
                    rev_source_res,
                    rev_service_res
                ] = await Promise.all([
                    fetch(`${baseUrl}/admin/total-revenue`, { credentials: "include" }),
                    fetch(`${baseUrl}/admin/revenue-month`, { credentials: "include" }),
                    fetch(`${baseUrl}/admin/revenue-year`, { credentials: "include" }),
                    fetch(`${baseUrl}/admin/average-revenue`, { credentials: "include" }),
                    fetch(`${baseUrl}/admin/revenue-trend`, { credentials: "include" }),
                    fetch(`${baseUrl}/admin/revenue-source`, { credentials: "include" }),
                    fetch(`${baseUrl}/admin/top-services`, { credentials: "include" }),
                ]);

                const [
                    tot_revenue_data,
                    last_month_data,
                    last_year_data,
                    avg_salon_revenue_data,
                    rev_data_json,
                    rev_source_data_json,
                    rev_service_data_json
                ] = await Promise.all([
                    tot_revenue_res.json(),
                    last_month_res.json(),
                    last_year_res.json(),
                    avg_salon_revenue_res.json(),
                    rev_res.json(),
                    rev_source_res.json(),
                    rev_service_res.json(),
                ]);

                if (tot_revenue_data.status === "success") {
                    set_tot_revenue(tot_revenue_data.total_revenue);
                }
                if (last_month_data.status === "success") {
                    set_last_month(last_month_data.revenue_month_change);
                    console.log("MONTH RAW:", last_month_data.revenue_month_change, typeof last_month_data.revenue_month_change);

                }
                if (last_year_data.status === "success") {
                    set_last_year(last_year_data.revenue_year_change);
                    console.log("YEAR RAW:", last_year_data.revenue_year_change, typeof last_year_data.revenue_year_change);

                }
                if (avg_salon_revenue_data.status === "success") {
                    set_avg_salon_revenue(avg_salon_revenue_data.average_revenue);
                }
                if (rev_data_json.status === "success") {
                    set_rev_data(rev_data_json.revenue_data);
                    set_rev_labels(rev_data_json.revenue_labels);
                }
                if (rev_source_data_json.status === "success") {
                    set_src_data(rev_source_data_json.revenue_data);
                    set_src_labels(rev_source_data_json.revenue_labels);
                }
                if (rev_service_data_json.status === "success") {
                    set_service_data(rev_service_data_json.top_service_data);
                    set_service_labels(rev_service_data_json.top_service_labels);
                }
            } catch (e) {
                console.error("Error fetching metrics:", e);
            }
        };

        fetch_metrics();
    }, []);

    const reportItems = [
        {id: "totRev", label: "Total Platform Revenue", ref: totRef},
        {id: "changeMonth", label: "Revenue Change From Last Month", ref: monthRef},
        {id: "changeYear", label: "Revenue Change From Last Year", ref: yearRef},
        {id: "avgRev", label: "Average Salon Monthly Revenue", ref: avgRef},
        {id: "revTrend", label: "Platform Revenue Trend", ref: trendRef},
        {id: "source", label: "Revenue Source Distribution", ref: sourceRef},
        {id: "topCats", label: "Top Service Categories by Revenue", ref: catRef}
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
                    All Salon Revenue
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
            <StatCard ref={totRef} title="Total revenue" value={tot_revenue} />
            <StatCard ref={monthRef} title="From last month" value={format_percent_change(last_month)} />
            <StatCard ref={yearRef} title="From last year" value={format_percent_change(last_year)} />
            <StatCard ref={avgRef} title="Average salon monthly revenue" value={avg_salon_revenue} />
        </div>

        {/* Charts */}
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", marginBottom: "2rem" }}>
            <LineChart ref={trendRef} labels={rev_labels} data={rev_data} title="Revenue for Last Year" />
            <PieChart ref={sourceRef} labels={src_labels} data={src_data} title="Revenue by Source" />
            <BarChart ref={catRef} labels={service_labels} data={service_data} title="Revenue by Service Category (Top 5)" />
        </div>
        </div>

        <style>{`
        button:hover { filter: brightness(1.05); }
        `}</style>
    </div>
    );
};

export default Revenue;
