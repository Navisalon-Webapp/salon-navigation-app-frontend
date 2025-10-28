//import React from 'react';
//import { useNavigate } from 'react-router-dom';
import "";
import Appt from '../../components/AppointmentCard';



export default function Appointments(){
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
    const listItems = info.map(item => <Appt key={item.id} name={item.name} salon={item.salon} time={item.time} date={item.date} />);
    return (
        <div>
            <h1>
                Past Appointments
            </h1>
            <br/>
            <br/>
            <div>{listItems}</div>
            <br/>
        </div>

    );
}