import '..src/index.css';
//import { useNavigate } from 'react-router-dom';
import React from 'react';
import Modal from "react-modal";
import AppointmentNotes from './AppointmentNotes';

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
        //backend call
    }
    function changeAppt(){
        //backend call
    }
    const isFuture = new Date()<=props.date
    //() => navigate("/home/AppointmentInfo", { state: { id : props.id} })
    return(
    <div>
        <br/>
        <button id="cards" onClick={openModal}>
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