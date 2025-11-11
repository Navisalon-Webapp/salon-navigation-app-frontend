//import '..src/index.css';
import { useNavigate } from 'react-router-dom';
import 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
//<Chart type='line' data={chartData} />

/*
    chart: string,
    xaxis: string,
    yaxis: string,
    xlabel: Array<string>,
    ylabel: Array<string>,



    <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Example Modal">
        <h1>Appointment Info</h1>
        <button style={{float: 'right',}} onClick={closeModal}>Close</button>
        <span style={{fontSize: '5em',}}>{props.salon}</span><br/>
        <span style={{fontSize: '2em', padding: '10px',}}>{props.date}</span> 
        <span style={{fontSize: '2em', padding: '10px',}}>{props.time}</span> <br/><br></br>
        {isFuture && <button style={{float: 'right',}} onClick={cancelAppt}>Cancel</button>}
        {isFuture && <button style={{float: 'right',}} onClick={changeAppt}>Reschedule</button>}
        
        </Modal>
*/


//change click to navigate to different page 



function Admin(props:any){
    const navigate = useNavigate()
    var bar = false
    var line = false
    if(props.chart=="bar"){
        bar = true
    }else if (props.chart=="line"){
        line = true
    }
   const data = {
            labels: props.xdata,
            datasets: [
                {
                    label: props.ylabel,
                    data: props.ydata,
                    borderWidth: 0.5,
                },
            ],
        };
        
    const admredirect = () => {
        navigate(props.page)
    };    
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
             {bar && <Bar data={data}/>}             
             {line && <Line data={data}/>}
            </div>
        </button>
        <br/>
        
        
        </div>
    );
}
export default Admin;