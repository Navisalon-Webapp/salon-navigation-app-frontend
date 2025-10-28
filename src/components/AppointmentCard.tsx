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
        <button id="cards" onClick={() => navigate("/home/Appointmentprops", { state: { id:props.id} })}>
            <h2>{props.time} {props.date}</h2>
            <p>{props.salon}</p>
            <p>{props.salon}</p>
        </button>
    </div>
    );
}
export default Appt;