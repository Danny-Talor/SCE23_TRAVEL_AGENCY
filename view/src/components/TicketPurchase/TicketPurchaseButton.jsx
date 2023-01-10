import "../../css/TicketPurchaseButton.css"
import { Modal, Button, InputGroup, Form, Stack, Spinner } from 'react-bootstrap'
import { useState, useEffect } from "react"
import UtilityFunctions from '../../UtilityFunctions'

export default function TicketPurchaseButton(props) {
    const flightObj = props.flightObj
    const paymentInfo = props.paymentInfo
    const [showModal, setShowModal] = useState(false)
    const [availableSeats, setAvailableSeats] = useState(0)
    const [numPassengers, setNumPassengers] = useState(1)
    const [name, setName] = useState(UtilityFunctions.Decrypt(paymentInfo.name) || '')
    const [invalidName, setInvalidName] = useState(true)
    const [ID, setID] = useState(UtilityFunctions.Decrypt(paymentInfo.id) || '')
    const [invalidID, setInvalidID] = useState(true)
    const [cc, setCC] = useState(UtilityFunctions.Decrypt(paymentInfo.cardnum) || '')
    const [invalidCC, setInvalidCC] = useState(true)
    const [cct, setCCT] = useState(<img src="https://cdn-icons-png.flaticon.com/512/4822/4822716.png" alt="none" width="32px" height="32px" />)
    const [em, setEM] = useState(UtilityFunctions.Decrypt(paymentInfo.emonth) || '')
    const [invalidEM, setInvalidEM] = useState(true)
    const [ey, setEY] = useState(UtilityFunctions.Decrypt(paymentInfo.eyear) || '')
    const [invalidEY, setInvalidEY] = useState(true)
    const [cvc, setCVC] = useState(UtilityFunctions.Decrypt(paymentInfo.cvc) || '')
    const [invalidCVC, setInvalidCVC] = useState(true)
    const [saveCheck, setSaveCheck] = useState(false)
    const [purchaseConfirmation, setPurchaseConfirmation] = useState({ validating: false, status: 'unconfirmed', error: '' })

    useEffect(() => {
        setCCT(UtilityFunctions.CreditCardType(cc))
        if (cc.length >= 15) {
            setInvalidCC(false)
        }
        else {
            setInvalidCC(true)
        }
        if (UtilityFunctions.IsValidExpiryDate(em, ey)) {
            setInvalidEY(false)
            if (UtilityFunctions.getMonths().includes(em)) {
                setInvalidEM(false)
            }
            else {
                setInvalidEM(true)
            }
        }
        else {
            setInvalidEY(true)
        }

        if (cvc.length >= 3) {
            setInvalidCVC(false)
        }
        else {
            setInvalidCVC(true)
        }

        if (name.length > 0) {
            setInvalidName(false)
        }
        else {
            setInvalidName(true)
        }

        if (ID.length > 0) {
            setInvalidID(false)
        }
        else {
            setInvalidID(true)
        }
    }, [cc, em, ey, cvc, name, ID])

    const isValidPaymentInfo = () => {
        return !invalidCC && !invalidCVC && !invalidEM && !invalidEY && !invalidName && !invalidID
    }

    const handleShowModal = () => {
        setShowModal(true)

        fetch(`/api/availableseatsonflight/${flightObj._id}`)
            .then((response) => response.json())
            .then((data) => setAvailableSeats(data))
    }

    const handleCloseModal = () => {
        setShowModal(false)
        if (Object.values(paymentInfo)[0] === '') {
            setCC('')
            setEM('')
            setEY('')
            setCVC('')
            setName('')
            setID('')
            setSaveCheck(false)
            setInvalidCC(true)
            setInvalidEM(true)
            setInvalidEY(true)
            setInvalidCVC(true)
            setInvalidName(true)
            setInvalidID(true)
        }
        setNumPassengers(1)
        setPurchaseConfirmation({ validating: false, status: 'unconfirmed', error: '' })
    }

    const handleNumPassengersChange = (e) => {
        switch (e) {
            case 'decrement':
                if (numPassengers !== 1) { setNumPassengers(numPassengers - 1) }
                break;
            case 'increment':
                if (numPassengers < availableSeats) { setNumPassengers(numPassengers + 1) }
                break;
            default:
                throw new Error();
        }
    }

    const handleNameChange = (e) => {
        setName(UtilityFunctions.RemoveNumber(e))
    }

    const handleIDChange = (e) => {
        setID(UtilityFunctions.RemoveNaN(e))
    }

    const handleCCChange = (e) => {
        setCC(UtilityFunctions.RemoveNaN(e))
    }

    const handleEMChange = (e) => {
        setEM(UtilityFunctions.RemoveNaN(e))
    }

    const handleEYChange = (e) => {
        setEY(UtilityFunctions.RemoveNaN(e))
    }

    const handleCVCChange = (e) => {
        setCVC(UtilityFunctions.RemoveNaN(e))
    }

    const handleSaveCheckChange = () => {
        if (saveCheck) {
            setSaveCheck(false)
        }
        else {
            setSaveCheck(true)
        }
    }

    const handleSubmit = () => {
        setPurchaseConfirmation({ status: 'validating' })

        var items = {
            userid: UtilityFunctions.Decrypt(UtilityFunctions.CookieToJson("data")),
            flightid: flightObj._id,
            pamount: flightObj.price * numPassengers,
            passengers: numPassengers,
        }
        if (saveCheck) {
            items.paymentinfo = Object.assign({
                name: UtilityFunctions.Encrypt(name),
                id: UtilityFunctions.Encrypt(ID),
                cardnum: UtilityFunctions.Encrypt(cc),
                emonth: UtilityFunctions.Encrypt(em),
                eyear: UtilityFunctions.Encrypt(ey),
                cvc: UtilityFunctions.Encrypt(cvc),
                replace: false
            }, items.paymentinfo)
        }

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(items)
        }

        fetch("/api/purchase", requestOptions)
            .then(response => response.json())
            .then(data => setPurchaseConfirmation(data))
    }

    const renderForm = () => {
        return availableSeats === -1 ?
            <>Sorry! we encountered an error! (#183-FST0)</>
            :
            <div id="not-selectable">
                <h2>Flight information</h2>
                origin: {flightObj.origin.label}
                <br />
                departure date and time: {UtilityFunctions.DBDateToStringDate(flightObj.departDate)}
                <br />
                destination: {flightObj.destination.label}
                <br />
                arrival date and time: {UtilityFunctions.DBDateToStringDate(flightObj.arriveDate)}
                <br />
                number of passengers: {numPassengers}
                <br />
                <Stack direction='horizontal' gap={1}>
                    <button onClick={() => handleNumPassengersChange('increment')}>Add passenger</button>
                    {numPassengers > 1 ? <button onClick={() => handleNumPassengersChange('decrement')}>Remove passenger</button> : null}
                </Stack>
                <br />
                <br />
                <h4>total price: ${flightObj.price * numPassengers}</h4>
                <br />
                <h5>Payment details</h5>
                <Stack direction="horizontal" gap={1}>
                    <img src="https://cdn-icons-png.flaticon.com/512/349/349221.png" alt="visa" width="64px" height="64px" />
                    <img src="https://icons.iconarchive.com/icons/designbolts/credit-card-payment/128/Master-Card-Blue-icon.png" alt="mastercard" width="64px" height="64px" />
                    <img src="https://cdn-icons-png.flaticon.com/512/349/349228.png" alt="amex" width="64px" height="64px" />
                </Stack >
                <br />
                <InputGroup>
                    <InputGroup.Text>Name</InputGroup.Text>
                    <Form.Control
                        isInvalid={invalidName}
                        onChange={(e) => { handleNameChange(e.target.value) }}
                        type="text"
                        id="name"
                        value={name}
                        maxLength="32"
                        required
                    />
                </InputGroup>
                <br />
                <InputGroup>
                    <InputGroup.Text>ID</InputGroup.Text>
                    <Form.Control
                        isInvalid={invalidID}
                        onChange={(e) => { handleIDChange(e.target.value) }}
                        type="tel"
                        id="id"
                        value={ID}
                        maxLength="16"
                        required
                        placeholder='123456789'
                    />
                </InputGroup>
                <br />
                <InputGroup>
                    <InputGroup.Text>CC Number</InputGroup.Text>
                    <Form.Control
                        isInvalid={invalidCC}
                        onChange={(e) => { handleCCChange(e.target.value) }}
                        type="tel"
                        id="cc"
                        value={cc}
                        maxLength="16"
                        required
                        placeholder='1234567890123456'
                    />
                    <InputGroup.Text>{cct}</InputGroup.Text>
                </InputGroup>
                <InputGroup>
                    <InputGroup.Text>Expiry date:</InputGroup.Text>
                    <Form.Control
                        isInvalid={invalidEM}
                        onChange={(e) => { handleEMChange(e.target.value) }}
                        type="tel"
                        id="em"
                        value={em}
                        maxLength="2"
                        required
                        placeholder='MM'
                    />
                    <InputGroup.Text>/</InputGroup.Text>
                    <Form.Control
                        isInvalid={invalidEY}
                        onChange={(e) => { handleEYChange(e.target.value) }}
                        type="tel"
                        id="ey"
                        value={ey}
                        maxLength="2"
                        required
                        placeholder='YY'
                    />
                </InputGroup>
                <InputGroup>
                    <InputGroup.Text>CVC</InputGroup.Text>
                    <Form.Control
                        isInvalid={invalidCVC}
                        onChange={(e) => { handleCVCChange(e.target.value) }}
                        type="tel"
                        id="cvc"
                        value={cvc}
                        maxLength="4"
                        required
                        placeholder='1234'
                    />
                </InputGroup>


                <br />
                <div>
                    <Stack gap={2}>
                        {isValidPaymentInfo() ?
                            <>
                                <InputGroup>
                                    <InputGroup.Checkbox onChange={handleSaveCheckChange} />
                                    <InputGroup.Text>Save payment information for later</InputGroup.Text>
                                </InputGroup>
                                <Button onClick={handleSubmit}>Purchase</Button>
                            </> : null} <Button onClick={handleCloseModal} variant="danger">cancel</Button>
                    </Stack>
                </div>
            </div>
    }

    const renderPurchaseConfirmation = () => {
        return purchaseConfirmation.status === 'confirmed' ?
            <Stack gap={3}>
                {numPassengers > 1 ?
                    <>
                        You have successfuly purchased {numPassengers} tickets!
                        <br />
                        You can view more information about them under the My tickets section.
                    </>
                    :
                    <>
                        You have successfuly purchased a ticket!
                        <br />
                        You can view more information about it under the My tickets section.
                    </>}
                <Button onClick={()=>{window.location.reload(false);}}>Okay</Button>
            </Stack>
            :
            purchaseConfirmation.status === 'failed' ?
                <>
                    <Stack gap={3}>
                        <b>{purchaseConfirmation.error}</b>
                        <Button variant="danger" onClick={()=>{window.location.reload(false);}}>Close</Button>
                    </Stack>
                </>
                :
                <>
                    <Spinner />
                </>
    }

    return (
        <>
            {props.isAuthorized && !props.isAdmin ? <Button onClick={handleShowModal}>Buy ticket</Button> : null}

            <Modal show={showModal} onHide={handleCloseModal} keyboard={false} animation={false} backdrop="static">
                <Modal.Body>
                    {purchaseConfirmation.validating === true ? renderPurchaseConfirmation() : renderForm()}
                </Modal.Body>
            </Modal>
        </>
    )
}