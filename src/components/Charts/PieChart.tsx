import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  labels: string[];
  data: number[];
  title: string;
}

const PieChart: React.FC<PieChartProps> = ({ labels, data, title }) => {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: ["#DE9E48", "#7A431D", "#372C2E", "#FFFFFF", "#000000ff"],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom", labels: { color: "#FFFFFF" } },
      tooltip: { enabled: true },
    },
  };

  return (
    <div 
      style={{
        backgroundColor: "#563727",
        color: "#FFFFFF",
        padding: "1rem",
        borderRadius: "0.75rem",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
        minWidth:"320px"
      }}>
      <div><h3 style={{paddingBottom:"1rem", textAlign: "center"}}>{title}</h3></div>
      <div 
        style={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          maxHeight: "230px",
          width: "100%"
          }}><Pie data={chartData} options={options} /></div>
    </div>
  );
};

export default PieChart;
