import React, { useRef, useEffect, useState } from "react";
import StatCard from "../../components/Charts/StatCard";
import LineChart from "../../components/Charts/LineChart";
import BarChart from "../../components/Charts/BarChart";
import PieChart from "../../components/Charts/PieChart";
import ReportButton from "../../components/ReportButton";

const Appointments: React.FC = () => {
    const reschedRef = useRef<HTMLDivElement>(null);
    const cancelRef = useRef<HTMLDivElement>(null);
    const noshowRef = useRef<HTMLDivElement>(null);
    const apptCatRef = useRef<HTMLDivElement>(null);
    const apptDayRef = useRef<HTMLDivElement>(null);
    const apptTimeRef = useRef<HTMLDivElement>(null);
    const apptTrendRef = useRef<HTMLDivElement>(null);

    const [resched_rate, set_resched_rate] = useState('0%');
    const [cancel_rate, set_cancel_rate] = useState('0%');
    const [no_show_rate, set_no_show_rate] = useState('0%');

    const [appt_cat_data, set_appt_cat_data] = useState<number[]>([]);
    const [appt_cat_labels, set_appt_cat_labels] = useState<string[]>([]);

    const [appt_day_data, set_appt_day_data] = useState<number[]>([]);
    const [appt_day_labels, set_appt_day_labels] = useState<string[]>([]);

    const [appt_time_data, set_appt_time_data] = useState<number[]>([]);
    const [appt_time_labels, set_appt_time_labels] = useState<string[]>([]);

    const [appt_year_data, set_appt_year_data] = useState<number[]>([]);
    const [appt_year_labels, set_appt_year_labels] = useState<string[]>([]);

    useEffect(() => {
        const fetch_metrics = async () => {
            try {
                const baseUrl = "http://localhost:5000";
                
                const[resched_res,
                    cancel_res,
                    no_show_res,
                    appt_service_res,
                    appt_day_res,
                    appt_time_res,
                    appt_trend_res
                ] = await Promise.all([
                    fetch(`${baseUrl}/admin/reschedule`, { credentials: "include" }),
                    fetch(`${baseUrl}/admin/cancel`, { credentials: "include" }),
                    fetch(`${baseUrl}/admin/no-show`, { credentials: "include" }),
                    fetch(`${baseUrl}/admin/appt-service`, { credentials: "include" }),
                    fetch(`${baseUrl}/admin/appt-day`, { credentials: "include" }),
                    fetch(`${baseUrl}/admin/appt-time`, { credentials: "include" }),
                    fetch(`${baseUrl}/admin/appt-trend`, { credentials: "include" }),
                ]);
                
                const [
                    resched_data,
                    cancel_data,
                    no_show_data,
                    appt_service_data,
                    appt_day_data,
                    appt_time_data,
                    appt_trend_data
                ] = await Promise.all([
                    resched_res.json(),
                    cancel_res.json(),
                    no_show_res.json(),
                    appt_service_res.json(),
                    appt_day_res.json(),
                    appt_time_res.json(),
                    appt_trend_res.json(),
                ]);
                
                if(resched_data.status === "success"){
                    set_resched_rate(resched_data.resched_rate);
                }

                if(cancel_data.status === "success"){
                    set_cancel_rate(cancel_data.cancel_rate);
                }

                if(no_show_data.status === "success"){
                    set_no_show_rate(no_show_data.no_show_rate);
                }

                if(appt_service_data.status === "success"){
                    set_appt_cat_data(appt_service_data.appt_cat_data);
                    set_appt_cat_labels(appt_service_data.appt_cat_labels);
                }

                if(appt_day_data.status === "success"){
                    set_appt_day_data(appt_day_data.appt_day_data);
                    set_appt_day_labels(appt_day_data.appt_day_labels);
                }

                if(appt_time_data.status === "success"){
                    set_appt_time_data(appt_time_data.appt_time_data);
                    set_appt_time_labels(appt_time_data.appt_time_labels);
                }

                if(appt_trend_data.status === "success"){
                    set_appt_year_data(appt_trend_data.appt_trend_data);
                    set_appt_year_labels(appt_trend_data.appt_trend_labels);
                }

                
            } catch (e) {
                console.error("Error fetching metrics:", e);
            }
        };

        fetch_metrics();
    }, []);
            
    const reportItems = [
        {id: "resched", label: "Appointment Reschedule Rate", ref: reschedRef},
        {id: "cancel", label: "Appointment Cancellation Rate", ref: cancelRef},
        {id: "no_show", label: "Appointment No Show Rate", ref: noshowRef},
        {id: "appt_cat", label: "Appointments by Service Category", ref: apptCatRef},
        {id: "appt_day", label: "Appointments by Day of Week", ref: apptDayRef},
        {id: "appt_time", label: "Appointments by Time of Day", ref: apptTimeRef},
        {id: "appt_trend", label: "Appointment Scheduling Frequency ", ref: apptTrendRef}
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
                <h2
                    style={{
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)",
                        fontSize: "1.8rem",
                        textAlign: "center",
                        marginBottom: "1.5rem",
                        fontWeight: 600,
                        color: "#FFFFFF",
                    }}
                >
                    Appointment Trends
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
            <StatCard ref={reschedRef} title="Reschedule rate" value={resched_rate} />
            <StatCard ref={cancelRef} title="Cancellation rate" value={cancel_rate} />
            <StatCard ref={noshowRef} title="No show rate" value={no_show_rate} />
        </div>

        {/* Charts */}
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", marginBottom: "2rem" }}>
            <PieChart ref={apptCatRef} labels={appt_cat_labels} data={appt_cat_data} title="Appointments by Service Category" />
            <BarChart ref={apptDayRef} labels={appt_day_labels} data={appt_day_data} title="Appointments by Day of Week" />
            <BarChart ref={apptTimeRef} labels={appt_time_labels} data={appt_time_data} title="Appointments by Time of Day" />
            <LineChart ref={apptTrendRef} labels={appt_year_labels} data={appt_year_data} title="Appointments Scheduled Trend" />
        </div>
        </div>

        <style>{`
        button:hover { filter: brightness(1.05); }
        `}</style>
    </div>
    );
};

export default Appointments;
