import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface BarChartProps {
  labels: string[];
  data: number[];
  title: string;
}

const BarChart: React.FC<BarChartProps> = ({ labels, data, title }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        backgroundColor: "#DE9E48",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { ticks: { color: "#FFFFFF" } },
      y: { ticks: { color: "#FFFFFF" } },
    },
  };

  return(
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
      <h3 style={{paddingBottom:"1rem", textAlign: "center"}}>{title}</h3>
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          minHeight: "230px"
        }}>
      <Bar data={chartData} options={options} /></div>
    </div>
);
};

export default BarChart;
