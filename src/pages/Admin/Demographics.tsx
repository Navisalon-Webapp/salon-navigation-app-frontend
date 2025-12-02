import React, { use, useEffect, useState } from "react";
import StatCard from "../../components/Charts/StatCard";
import BarChart from "../../components/Charts/BarChart";
import PieChart from "../../components/Charts/PieChart";

const Demographics: React.FC = () => {
    const [avg_income, set_avg_income] = useState('$0');
    const [avg_salon_age, set_avg_salon_age] = useState('0 years');
    const [avg_worker_exp, set_avg_worker_exp] = useState('0 years');

    const [gender_labels, set_gender_labels] = useState<string[]>([]);
    const [gender_data, set_gender_data] = useState<number[]>([]);

    const [age_labels, set_age_labels] = useState<string[]>([]);
    const [age_data, set_age_data] = useState<number[]>([]);

    const [ind_labels, set_ind_labels] = useState<string[]>([]);
    const [ind_data, set_ind_data] = useState<number[]>([]);

    useEffect(() => {
        const fetch_metrics = async () => {
            try {
                const baseUrl = "http://localhost:5000";

                const[
                    income_res,
                    salon_age_res,
                    worker_exp_res,
                    gender_res,
                    age_res,
                    industry_res
                ] = await Promise.all([
                    fetch(`${baseUrl}/admin/income`, { credentials: "include" }),
                    fetch(`${baseUrl}/admin/salon-age`, { credentials: "include" }),
                    fetch(`${baseUrl}/admin/experience`, { credentials: "include" }),
                    fetch(`${baseUrl}/admin/gender`, { credentials: "include" }),
                    fetch(`${baseUrl}/admin/age`, { credentials: "include" }),
                    fetch(`${baseUrl}/admin/industry`, { credentials: "include" }),
                ]);

                const [
                    income_data,
                    salon_age_data,
                    worker_exp_data,
                    gender_data,
                    age_data,
                    industry_data
                ] = await Promise.all([
                    income_res.json(),
                    salon_age_res.json(),
                    worker_exp_res.json(),
                    gender_res.json(),
                    age_res.json(),
                    industry_res.json(),
                ]);

                if(income_data.status === "success") {
                    set_avg_income(income_data.avg_income);
                }

                if(salon_age_data.status === "success") {
                    set_avg_salon_age(salon_age_data.avg_salon_age);
                }

                if(worker_exp_data.status === "success") {
                    set_avg_worker_exp(worker_exp_data.avg_worker_experience);
                }

                if(gender_data.status === "success") {
                    set_gender_labels(gender_data.gender_labels);
                    set_gender_data(gender_data.gender_data);
                }

                if(age_data.status === "success") {
                    set_age_labels(age_data.age_labels);
                    set_age_data(age_data.age_data);
                }

                if(industry_data.status === "success") {
                    set_ind_labels(industry_data.industry_labels);
                    set_ind_data(industry_data.industry_data);
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

        {/* ---------------- Dashboard Section ---------------- */}
        <h2
            style={{
            fontSize: "1.8rem",
            textAlign: "center",
            marginBottom: "1.5rem",
            fontWeight: 600,
            color: "#FFFFFF",
            }}
        >
            User Demographics
        </h2>

        {/* Cards */}
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", marginBottom: "2rem" }}>
            <StatCard title="Average client income" value={avg_income} />
            <StatCard title="Average salon age" value={avg_salon_age} />
            <StatCard title="Average worker experience" value={avg_worker_exp} />
        </div>

        {/* Charts */}
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", marginBottom: "2rem" }}>
            <PieChart labels={gender_labels} data={gender_data} title="Client Gender Distribution" />
            <BarChart labels={age_labels} data={age_data} title="Client Age Distribution" />
            <BarChart labels={ind_labels} data={ind_data} title="Client Industry Distribution (Top 5)" />
        </div>
        </div>

        <style>{`
        button:hover { filter: brightness(1.05); }
        `}</style>
    </div>
    );
};

export default Demographics;
