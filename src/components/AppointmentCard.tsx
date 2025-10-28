import '../index.css';
import { useNavigate } from 'react-router-dom';
/*type Appointment = {
  id: string;
  time: string;
  worker: string;
  service: string;
};*/
function Appt(props: any){
    const navigate = useNavigate()
    return(
    <div>
        <br/>
        <button id="cards" onClick={() => navigate("/home/AppointmentInfo", { state: { id:props.id} })}>
            <div>
            <span className='left'>{props.time} <br/>
            {props.date}</span>
            <span className='right'>{props.name} {/*name is used for worker/client depending on which acct type*/}
            <br/>
            {props.salon}</span>
            </div>
        </button>
        <br/>
    </div>
    );
}
export default Appt;