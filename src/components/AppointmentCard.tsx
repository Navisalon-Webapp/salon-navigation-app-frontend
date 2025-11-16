import React from 'react';
import Modal from "react-modal";
import AppointmentNotes from './AppointmentNotes';
import { usePaymentInputs } from 'react-payment-inputs';

function Appt(props: any){
    const [modalOneOpen, setOneOpen] = React.useState(false);
    const [modalTwoOpen, setTwoOpen] = React.useState(false);
    const [modalThreeOpen, setThreeOpen] = React.useState(false);
    const [date, setDate] = React.useState("");
    const { meta, getCardNumberProps, getExpiryDateProps, getCVCProps } = usePaymentInputs();
    

    const theme = props.theme || "light";

    function openOne() {
        setOneOpen(true);
    }
    function openTwo() {
        setTwoOpen(true);
    }
    function openThree() {
        setThreeOpen(true);
    }

    function closeModal() {
        setOneOpen(false);
        setTwoOpen(false);
        setThreeOpen(false);
    }

    function cancelAppt(){
        let worked;
        try{
            worked = true;
        }catch{
            alert("Sorry, we were unable to cancel your appointment. Please try again.");
            worked = false;
        }
        if(worked){
            alert("Appointment cancelled");
        } 
    }
    function handleCardNumber(){
        console.log("card number");        
    }
    function handleExpiryDate(){
        console.log("expiration date");        
    }
    function handleCVC(){
        console.log("cvc");        
    }
    /*function changeAppt(){
        alert("Reschedule functionality coming soon");
    }
    function pay(){
        alert("INSERT SOMETHIN HERE");
    }*/

    const today = new Date();
    const inputDate = (props.date).split("/").reverse().join("");
    const apptdate = new Date(+inputDate.slice(0, 4),+inputDate.slice(6, 8)-1,+inputDate.slice(4, 6), +(props.time).split(":")[0], ((props.time).split(":")[1]).substring(0,2), 0);
    const isFuture = today <= apptdate;
    const isPaid = false; //get from backend

    return(
    <div>
        <style>{`
        #cards {
        padding: 20px;
        background-color: ${theme === "dark" ? "#563727" : "white"};
        transition: transform .2s; 
        width: 100%;
        height: auto;
        margin: auto auto;
        border-radius: 10px;
        border: 2px solid ${theme === "dark" ? "#7A431D" : "#ccc"};
        display: block;
        color: ${theme === "dark" ? "#FFFFFF" : "#563727"} !important;
        z-index: 1;
        }

        #cards:hover {
        transform: scale(1.07, 1.1);
        color: ${theme === "dark" ? "#FFFFFF" : "#563727"} !important;
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
        <button id='cards' onClick={openOne}>
            <div>
                <span className='left'>{props.time} <br/>
                {props.date}</span>
                <span className='right'>{props.name}
                <br/>
                {props.salon}</span>
            </div>
        </button>
        <br/>
        <Modal isOpen={modalOneOpen} onRequestClose={closeModal} contentLabel="Appointment Modal"
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    zIndex: 1000,
                },
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: '#372C2E',
                    color: '#FFFFFF',
                    border: '2px solid #7A431D',
                    borderRadius: '10px',
                    padding: '2rem',
                    maxWidth: '600px',
                    width: '90%',
                }
            }}
        >
        <h1 style={{color: '#DE9E48', marginBottom: '1rem'}}>Appointment Info</h1>
        <button 
            style={{
                float: 'right',
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#DE9E48',
                color: '#372C2E',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 600,
            }} 
            onClick={closeModal}>Close</button>
        <span style={{fontSize: '2.5em', color: '#DE9E48'}}>{props.salon}</span><br/>
        <span style={{fontSize: '1.5em', padding: '10px'}}>{props.date}</span> 
        <span style={{fontSize: '1.5em', padding: '10px'}}>{props.time}</span> <br/><br></br>
        {isFuture && <button 
            style={{
                float: 'right',
                margin: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#D62828',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 600,
            }} 
            onClick={cancelAppt}>Cancel</button>}
        {isFuture && <button 
            style={{
                float: 'right',
                margin: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#DE9E48',
                color: '#372C2E',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 600,
            }} 
            onClick={openTwo}>Reschedule</button>}
         {!isFuture && !isPaid && <button 
            style={{
                float: 'right',
                margin: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#DE9E48',
                color: '#372C2E',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 600,
            }} 
            onClick={openThree}>Pay</button>}    
        <AppointmentNotes />
        </Modal>
        <Modal isOpen={modalTwoOpen} onRequestClose={closeModal} contentLabel="Reschedule Modal"
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    zIndex: 1000,
                },
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: '#372C2E',
                    color: '#FFFFFF',
                    border: '2px solid #7A431D',
                    borderRadius: '10px',
                    padding: '2rem',
                    maxWidth: '600px',
                    width: '90%',
                }
            }}
        >
        <h1 style={{color: '#DE9E48', marginBottom: '1rem'}}>Reschedule Appointment</h1>
        <button 
            style={{
                float: 'right',
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#DE9E48',
                color: '#372C2E',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 600,
            }} 
            onClick={closeModal}>Cancel</button>
        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          //disabled={!selectedEmployeeId}
        />

        {/*{selectedEmployeeId && date && (
          <>
            <label>Available Time Slots</label>
            <select
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
            >
              <option value="">— Select time slot —</option>
              {availableSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            {availableSlots.length === 0 && (
              <p style={{ fontSize: 12, color: "#7A431D", marginTop: 4 }}>
                No available time slots for this worker on this date
              </p>
            )}
          </>
        )} */}
        <button>Reschedule</button>
        </Modal>
        <Modal isOpen={modalThreeOpen} onRequestClose={closeModal} contentLabel="Payment Modal"
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    zIndex: 1000,
                },
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: '#372C2E',
                    color: '#FFFFFF',
                    border: '2px solid #7A431D',
                    borderRadius: '10px',
                    padding: '2rem',
                    maxWidth: '600px',
                    width: '90%',
                }
            }}
        >
        <h1 style={{color: '#DE9E48', marginBottom: '1rem'}}>Pay</h1>
        <button 
            style={{
                float: 'right',
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#DE9E48',
                color: '#372C2E',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 600,
            }} 
            onClick={closeModal}>Cancel</button>

        <span>Current card: {meta.cardType.displayName}</span>    
        <input {...getCardNumberProps({ onChange: handleCardNumber })}/>
        <input {...getExpiryDateProps({ onChange: handleExpiryDate })}/>
        <input {...getCVCProps({ onChange: handleCVC })}/>
        {meta.isTouched && meta.error && <span>Error: {meta.error}</span>}

        </Modal>

        </div>
    );
}
export default Appt;