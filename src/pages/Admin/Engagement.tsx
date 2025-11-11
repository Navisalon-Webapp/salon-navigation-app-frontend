//import React from 'react';
//import { useNavigate } from 'react-router-dom';
//import "../../index.css";
import Admin from "../../components/DashboardCard";



export default function Loyalty(){
  //replace info  with call to backend
  //name is name of worker
   
const infob = [{
  title:"User Engagement",
  xaxis: "Day",
  yaxis: 'Average Time Spent on Page (minutes)',
  xdata: ["Mon", "Tues", "Wed", "Thurs", "Fri"],
  ydata: [20, 10, 30, 40, 37, 52],
  period:'month',
  page:"./Engagement",
}];
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
   
    const barcharts = infob.map(item => <Admin chart={"line"} xlabel={item.xaxis} ylabel={item.yaxis} xdata={item.xdata} ydata={item.ydata} time={item.period} />);
    return (
        <div>
            <h1>
                User Engagement
            </h1>
            <br/>
            <br/>
            <div>{barcharts}</div>
            <br/>
        </div>

    );
}