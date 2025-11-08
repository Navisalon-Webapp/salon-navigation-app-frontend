//import '..src/index.css';
//import { useNavigate } from 'react-router-dom';
import React from 'react';
import Modal from "react-modal";
import AppointmentNotes from './AppointmentNotes';
//uncomment below
//import AppointmentModal from './appointment_modal';
//import './index.css';

function Appt(props: any){
    //const navigate = useNavigate()
    const [modalIsOpen, setIsOpen] = React.useState(false);

    function openModal() {
    setIsOpen(true);
    }

    function closeModal() {
    setIsOpen(false);
    }
    function cancelAppt(){
        var worked;
        try{
            //backend call
            worked = true;
        }catch{
            alert("Sorry, we were unable to cancel your appointment. Please try again.");
            worked = false;
        }
        if(worked){
            alert("Appointment cancelled");
        } 

    }
    function changeAppt(){
        //backend call
        //add current appt info to appt modal
        const info = {
            id: 1,
            name: 'Idalina Vater',
            salon: 'Hair&Care',
            time:'2:00 PM',
            date: '10/22/2025',
        };
        //uncomment
        //<AppointmentModal key={info.id} startTime={info.time} date={info.date} />
    }
    const today = new Date()
    const inputDate = (props.date).split("/").reverse().join("")
    const apptdate = new Date(+inputDate.slice(0, 4),+inputDate.slice(6, 8)-1,+inputDate.slice(4, 6), +(props.time).split(":")[0], ((props.time).split(":")[1]).substring(0,2), 0);
    var isFuture = today <= apptdate
    //() => navigate("/home/AppointmentInfo", { state: { id : props.id} })
    return(
    <div>
        <style>{`
        #cards {
        padding: 20px;
        background-color: white;
        transition: transform .2s; 
        width: 100%;
        height: auto;
        margin: auto auto;
        border-radius: 10px;
        border:1px solid #ccc;
        display: block;
        color: #563727 !important;
        z-index: 1;
        }

        #cards:hover {
        transform: scale(1.07, 1.1);
        color: #563727 !important;
        z-index: 1; 
        
        }
        .left{
        float: left;
        padding-left: 20px;
        padding-bottom: 10px;
        padding-top: 10px;
        font-size: x-large;
        font-weight: bolder;
        }
        .right{
        float: right;
        padding-right: 20px;
        padding-bottom: 20px;
        padding-top: 20px;
        }
      `}</style>
        <br/>
        <button id='cards' onClick={openModal}>
            <div>
            <span className='left'>{props.time} <br/>
            {props.date}</span>
            <span className='right'>{props.name} {/*name is used for worker/client depending on which acct type*/}
            <br/>
            {props.salon}</span>
            </div>
        </button>
        <br/>
        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Example Modal">
        <h1>Appointment Info</h1>
        <button style={{float: 'right',}} onClick={closeModal}>Close</button>
        <span style={{fontSize: '5em',}}>{props.salon}</span><br/>
        <span style={{fontSize: '2em', padding: '10px',}}>{props.date}</span> 
        <span style={{fontSize: '2em', padding: '10px',}}>{props.time}</span> <br/><br></br>
        {isFuture && <button style={{float: 'right',}} onClick={cancelAppt}>Cancel</button>}
        {isFuture && <button style={{float: 'right',}} onClick={changeAppt}>Reschedule</button>}
        <AppointmentNotes />
        </Modal>
        
        </div>
    );
}
export default Appt;