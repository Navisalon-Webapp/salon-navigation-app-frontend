import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface LineChartProps {
  labels: string[];
  data: number[];
  title: string;
}

const LineChart: React.FC<LineChartProps> = ({ labels, data, title }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        borderColor: "#DE9E48",
        backgroundColor: "#DE9E48",
        tension: 0.3,
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
      <h3 style={{paddingBottom:"1rem", textAlign: "center"}}>{title}</h3>
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          minHeight: "230px"
        }}><Line data={chartData} options={options} /></div>
      
    </div>
    
);
};

export default LineChart;
