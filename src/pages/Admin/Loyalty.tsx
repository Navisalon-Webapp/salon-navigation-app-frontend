//import React from 'react';
//import { useNavigate } from 'react-router-dom';
//import "../../index.css";
import Admin from "../../components/DashboardCard";



export default function AdminHome(){
  //replace info  with call to backend
  //name is name of worker
    const info = [{
  id: 1,
  name: 'Idalina Vater',
  salon: 'Hair&Care',
  time:'2:00 PM',
  date: '10/22/2025',
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

    const listItems = info.map(item => <Admin key={item.id} name={item.name} salon={item.salon} time={item.time} date={item.date} />);
    return (
        <div>
            <h1>
                Home
            </h1>
            <h2>
                // write big three stats here, align left right center and then add graphs below just like home page idk
                //copy to all other pages and then just change backend and whatnot after everything is filled in
                <span></span>
                <span></span>
                <span></span>
            </h2>
            <br/>
            <br/>
            <div>{listItems}</div>
            <br/>
        </div>

    );
}