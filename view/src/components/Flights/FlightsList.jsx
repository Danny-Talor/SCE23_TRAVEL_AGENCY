import "../../css/FlightList.css"
import { useState, useEffect } from "react"
import { Offcanvas, Button, Row, Col } from 'react-bootstrap'
import FlightItem from "./FlightItem"
import AddFlightButton from "./AddFlightButton"
import SearchBar from "../searchbar/searchBar"
import SortList from "./sort/sortList"
import UtilityFunctions from "../../UtilityFunctions"
import UserFlightsList from "./UserFlightsList/UserFlightsList"

export default function FlightsList(props) {
    const [flightsList, setflightsList] = useState([])
    const [refresh, setRefresh] = useState(false)
    const [paymentInfo, setPaymentInfo] = useState({
        cardnum: '',
        emonth: '',
        eyear: '',
        cvc: '',
        name: '',
        id: ''
    })

    //update payment info if exists
    useEffect(() => {
        fetch(`/api/paymentinfo/${UtilityFunctions.Decrypt(UtilityFunctions.CookieToJson("data"))}`)
            .then((response) => response.json())
            .then((data) => setPaymentInfo(data))
    }, [])

    function updateFlightsList() {
        const requestUrl = `/api/getFlights`
        fetch(requestUrl)
            .then(response => response.json())
            .then(data => setflightsList(data))
            .catch(error => console.log(error))
    }

    useEffect(() => {
        if (refresh) {
            setRefresh(false)
        }
        updateFlightsList()
    }, [refresh])

    if (props.mode === 'All flights') {
        return (
            <>
                <SearchBar setflightsList={setflightsList} />
                <Row>
                    <Col lg={1} md={1} sm={1} xl={1} xs={1} xxl={1}>
                        Sort By:
                    </Col>
                    <Col>
                        <SortList flightsList={flightsList} setflightsList={setflightsList} />
                    </Col>
                    <Col>
                        <Button onClick={() => setRefresh(true)}>cancel sort/search</Button>
                    </Col>

                </Row>

                <div className="main-f-l">

                    {props.isAdmin ? <AddFlightButton /> : null}

                    <br />
                    {flightsList.length > 0 ? (flightsList.map(flight => < FlightItem key={flight._id} flightObj={flight} isAdmin={props.isAdmin} isAuthorized={props.isAuthorized} paymentInfo={paymentInfo} />)) : <h1 style={{ 'color': 'white' }}>no flights found</h1>}
                </div>
            </>
        )
    }
    if (props.mode === 'My tickets') {
        return (
            <UserFlightsList />
        )
    }
}