import "../../css/FlightItem.css"
import TicketPurchaseButton from "../TicketPurchase/TicketPurchaseButton"
import EditFlightButton from "./EditFlightButton"
import UtilityFunctions from "../../UtilityFunctions"
import {Button} from 'react-bootstrap'
export default function FlightItem(props) {
    const flightObj = props.flightObj

    const handleDeleteFlight = (event) => {
        event.stopPropagation() //stops form onSubmit from firing when opening/closing modal

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "_id": flightObj._id })
        }

        fetch("/api/removeFlight", requestOptions)
            .then(response => response.json())
            .then(data => console.log(data))
            .then(location.reload())
    }

    const AdminOptions = () => {
        return (
            <>
                <EditFlightButton flightObj={flightObj} />
                <Button variant='danger' onClick={handleDeleteFlight}>delete</Button>
            </>
        )
    }

    return (
        <>
            <div className="main-f-i">
                <h1>flight number {flightObj._id.slice(-6)}</h1>
                origin: {flightObj.origin.label}
                <br />
                departure date and time: {UtilityFunctions.DBDateToStringDate(flightObj.departDate)}
                <br />
                destination: {flightObj.destination.label}
                <br />
                arrival date and time: {UtilityFunctions.DBDateToStringDate(flightObj.arriveDate)}
                <br />
                price: ${flightObj.price}
                <br />
                <TicketPurchaseButton flightObj={flightObj} isAuthorized={props.isAuthorized} isAdmin={props.isAdmin} paymentInfo={props.paymentInfo}/>
                {props.isAdmin ? <AdminOptions /> : null}
            </div>




        </>
    )
}