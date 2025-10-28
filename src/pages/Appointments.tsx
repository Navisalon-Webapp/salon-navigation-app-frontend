//import React from 'react';
//import { useNavigate } from 'react-router-dom';
import '../index.css';
import Appt from '../components/AppointmentCard';

export default function Appointments(){
    return (
        <div>
            <h1>
                Appointments
            </h1>
            <br/>
            <h2>Upcoming</h2>
            <br/>
            <br/>
            <Appt />
            <br/>
            <br/>
            <h2>Past</h2>
            <br/>
            <Appt />
            <br/>
        </div>

    );
}