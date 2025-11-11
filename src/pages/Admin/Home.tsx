//import React from 'react';
//import { useNavigate } from 'react-router-dom';
//import "../../index.css";
import Admin from "../../components/DashboardCard";



export default function AdminHome(){
  //replace info  with call to backend
  //name is name of worker
    const infol = [{
  title:"",
  xaxis: "X axis label",
  yaxis: 'y axis label',
  xdata: [1, 2, 3, 4],
  ydata: [1, 2, 3, 4],
  period:'month',
  page:"",
}, {
  id: 2,
  name: 'Idalina Vater',
  salon: 'Hair&Care',
  time:'4:00 PM',
  date: '9/22/2025',
}, {
  id: 3,
  name: 'Idalina Vater',
  salon: 'Hair&Care',
  time:'1:00 PM',
  date: '8/22/2025',
}, {
  id: 4,
  name: 'Idalina Vater',
  salon: 'Hair&Care',
  time:'5:00 PM',
  date: '7/22/2025',
}, {
  id: 5,
  name: 'Idalina Vater',
  salon: 'Hair&Care',
  time:'3:00 PM',
  date: '5/22/2025',
}];
const infob = [{
  xaxis: "X axis label",
  yaxis: 'y axis label',
  xdata: [1, 2, 3, 4],
  ydata: [1, 2, 3, 4],
  period:'month',
}, {
  id: 2,
  name: 'Idalina Vater',
  salon: 'Hair&Care',
  time:'4:00 PM',
  date: '9/22/2025',
}, {
  id: 3,
  name: 'Idalina Vater',
  salon: 'Hair&Care',
  time:'1:00 PM',
  date: '8/22/2025',
}, {
  id: 4,
  name: 'Idalina Vater',
  salon: 'Hair&Care',
  time:'5:00 PM',
  date: '7/22/2025',
}, {
  id: 5,
  name: 'Idalina Vater',
  salon: 'Hair&Care',
  time:'3:00 PM',
  date: '5/22/2025',
}];
//backend call for x axis, y axis, dataset, time period AND put chart type in there
// can map BUT need to separate line vs bar charts
//const linecharts, const barcharts --> get info separate backend calls
//props --> chart={"line"} x={item.xaxis} y={item.yaxis} data={item.dataset} time={item.period}
//props --> chart={"bar"} ^^^ and same as above
//metrics
// - platform uptime - line graph, continuous average (percentage)
// - customer retention - customer retention (monthly bar graph)
// - salon revenue - average salon revenue over x months
// - loyalty program - number of salons with loyalty program bar graph with months
// - line graph of daily/weekly/monthly appointments booked
// - user engagement - average time spent on page (daily/weekly/monthly) line graph
//create button for daily weekly monthly on admin card --> redoes backend call? --> maybe think about this later --> LATER???? for now do one solid thing and put it in there commented out to discuss with backend
//
    const linecharts = infol.map(item => <Admin chart={"line"} xlabel={item.xaxis} ylabel={item.yaxis} xdata={item.xdata} ydata={item.ydata} time={item.period} />);
    const barcharts = infob.map(item => <Admin chart={"bar"} xlabel={item.xaxis} ylabel={item.yaxis} xdata={item.xdata} ydata={item.ydata} time={item.period} />);
    return (
        <div>
            <h1>
                Home
            </h1>
            <br/>
            <br/>
            <div>{linecharts}</div>
            <div>{barcharts}</div>
            <br/>
        </div>

    );
}