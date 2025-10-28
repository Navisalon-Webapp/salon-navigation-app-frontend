import '../index.css';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import Modal from "react-modal";

function Appt(props: any){
    const navigate = useNavigate()
    const [modalIsOpen, setIsOpen] = React.useState(false);

    function openModal() {
    setIsOpen(true);
    }

    function closeModal() {
    setIsOpen(false);
    }

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
        <h2>Appointment Info</h2>
        <button style={{float: 'right',}} onClick={closeModal}>Close</button>
        </Modal>
        </div>
    );
}
export default Appt;