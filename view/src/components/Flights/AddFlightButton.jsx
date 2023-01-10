import { Modal, Button, Form, InputGroup } from 'react-bootstrap'
import { useState, useMemo } from "react"
import UtilityFunctions from '../../UtilityFunctions'

import Select from 'react-select'
import countryList from 'react-select-country-list'

import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";

export default function AddFlightButton() {
    const [showModal, setShowModal] = useState(false)

    const [departureCountry, setDepartureCountry] = useState({})
    const [departureDate, setDepartureDate] = useState(new Date())

    const [arrivalDate, setArrivalDate] = useState(new Date().getTime() + 3600000)
    const [arrivalCountry, setArrivalCountry] = useState({})

    const [flightSeatsNum, setFlightSeatsNum] = useState(0)
    const [flightPrice, setFlightPrice] = useState(0)

    const [disableSubmit, setDisableSubmit] = useState(false)

    const countries = useMemo(() => countryList().getData(), [])

    const handleSetDepartureCountry = (country) => {
        setDepartureCountry(country)
    }

    const handleSetArrivalCountry = (country) => {
        setArrivalCountry(country)
    }

    const renderCountryPicker = (get, set) => {
        return (
            <Select options={countries} value={get} onChange={set} />
        )
    }

    const handleSetDepartureDate = (date) => {
        setDepartureDate(date)
    }

    const handleSetArrivalDate = (date) => {
        setArrivalDate(date)
    }

    const handleSetSeatNum = (e) => {
        setFlightSeatsNum(UtilityFunctions.RemoveNaN(e))
    }

    const handleSetFlightPrice = (e) => {
        setFlightPrice(UtilityFunctions.RemoveNaN(e))
    }

    const renderDatePicker = (get, set) => {
        return (
            <DatePicker
                selected={get}
                onChange={(date) => set(date)}
                showTimeInput
                minDate={new Date()}
                dateFormat="dd/MM/yyyy HH:mm"
            />
        )
    }

    const isValidFlight = () => {
        return departureCountry.label &&
            arrivalCountry.label &&
            flightPrice >= 0 &&
            flightSeatsNum > 0 &&
            (arrivalDate > departureDate) &&
            (departureDate > new Date())
    }

    const renderAddFlightForm = () => {
        return (
            <>
                Departure Country:
                {renderCountryPicker(departureCountry, handleSetDepartureCountry)}
                Departure Date and Time:
                {renderDatePicker(departureDate, handleSetDepartureDate)}
                <br />
                <br />
                Arrival Country:
                {renderCountryPicker(arrivalCountry, handleSetArrivalCountry)}
                Arrival Date and Time:
                {renderDatePicker(arrivalDate, handleSetArrivalDate)}
                <br />
                <br />
                Number of seats:
                <InputGroup className="mb-3">
                    <Form.Control
                        onChange={(e) => { handleSetSeatNum(e.target.value) }}
                        type="tel"
                        id="flightSeatsNum"
                        maxLength="3"
                        required
                        value={flightSeatsNum}
                    />
                </InputGroup>
                Price:
                <InputGroup className="mb-3">
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control
                        onChange={(e) => { handleSetFlightPrice(e.target.value) }}
                        type="tel"
                        id="flightPrice"
                        maxLength="7"
                        required
                        value={flightPrice}
                    />
                </InputGroup>
                {isValidFlight() ? <Button disabled={disableSubmit} onClick={handleSubmit}>Add flight</Button> : null}
            </>
        )
    }

    const handleSubmit = (event) => {
        event.preventDefault() //stops page from refreshing
        event.stopPropagation() //stops form onSubmit from firing when opening/closing modal
        setDisableSubmit(true)

        const items = {
            origin: departureCountry,
            destination: arrivalCountry,
            departDate: departureDate,
            arriveDate: arrivalDate,
            numSeats: flightSeatsNum,
            price: flightPrice
        }

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(items)
        }

        fetch("/api/addFlight", requestOptions)
            .then(response => response.json())
            .then(data => console.log(data))
            .then(setShowModal(false))
            .then(setDisableSubmit(false))
            .then(location.reload())
    }

    return (
        <>
            <Button onClick={() => setShowModal(true)}>add flight</Button>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add flight</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {renderAddFlightForm()}
                </Modal.Body>
            </Modal>
        </>
    )
}