//import React from 'react';
//import { useNavigate } from 'react-router-dom';
//import "../../index.css";
//import Admin from "../components/DashboardCard";
import { Bar } from "react-chartjs-2";
import 'chart.js/auto'; 



export default function CustomerRetention(){
  //replace info  with call to backend
  //name is name of worker
    
const infob = {
 
  title:"Customer Retention",
  xaxis: "Day",
  yaxis: 'Returning Customers',
  xdata: ["Mon", "Tues", "Wed", "Thurs", "Fri"],
  ydata: [1, 2, 3, 4, 3, 5],
  period:'week',
};
//backend call for x axis, y axis, dataset, time period AND put chart type in there
// can map BUT need to separate line vs bar charts
//const linecharts, const barcharts --> get info separate backend calls
//props --> chart={"line"} x={item.xaxis} y={item.yaxis} data={item.dataset} time={item.period}
//props --> chart={"bar"} ^^^ and same as above
//metrics
// - platform uptime - line graph, continuous average (percentage) LINE
// - customer retention - customer retention (monthly bar graph) BAR
// - salon revenue - average salon revenue over x months LINE
// - loyalty program - number of salons with loyalty program bar graph with months BAR
// - line graph of daily/weekly/monthly appointments booked LINE
// - user engagement - average time spent on page (daily/weekly/monthly) line graph LINE
//create button for daily weekly monthly on admin card --> redoes backend call? --> maybe think about this later --> LATER???? for now do one solid thing and put it in there commented out to discuss with backend
//
    const retentionRate = 0; //add route from backend
    const custReview = 0; //add route from backend
    //const barcharts = infob.map(item => <Admin chart={"bar"} xlabel={item.xaxis} ylabel={item.yaxis} xdata={item.xdata} ydata={item.ydata} time={item.period} />);
const data = {
  labels: infob.xdata,
  datasets: [{
    label: infob.title,
    data: infob.ydata,
    backgroundColor: 'rgba(222, 157, 72, 0.2)',
    borderColor: 'rgb(222, 158, 72)',
    borderWidth: 1
  }]
};
function handleTime(e : any){
  e.preventDefault();
  const form = e.target.value;
  console.log(form)
}
    return (
        <div>
            <h1>
                Customer Retention
            </h1>
            <br/>
            <div>
            <span style={{
              fontSize: "1.875rem", 
            fontWeight: 600,
            marginBottom: "1.5rem", 
            float: "left"}}>{retentionRate}%</span>
            <span style={{fontSize: "1.875rem", 
            fontWeight: 300,
            marginBottom: "1.5rem", marginLeft: "0.5rem", 
            float: "left"}}>  retention rate</span>
            <span style={{fontSize: "1.875rem", 
            fontWeight: 300,
            marginBottom: "1.5rem", marginLeft: "0.5rem", 
            float: "right"}}>  average customer review</span>
            <span style={{fontSize: "1.875rem", 
            fontWeight: 600,
            marginBottom: "1.5rem", 
            float: "right"}}>{custReview}/5</span>
            </div>
          
            <br/>
            <br/>
            <div style={{ width: "100%", float: "right" }}>
            <select style={{ float: "right",
      padding: "5px 5px",
      border: "1px solid #DE9E48",
      borderRadius: 8,
      fontSize: 14,
      background: "#FFF",
      color: "#372C2E", }} defaultValue="week" onChange={handleTime}> 
                  <option value="hour">Last hour</option>
                  <option value="day">Last 24 hours</option>
                  <option value="week">Last week</option>
                  <option value="month">Last month</option>
                  <option value="year">Last year</option>
                  <option value="alltime">All time</option>
            </select>
            </div>
            <br />
            <div><Bar data={data}></Bar></div>
            <br/>
        </div>

    );
}