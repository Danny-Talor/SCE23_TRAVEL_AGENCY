import { useState, useEffect } from "react"
import UtilityFunctions from "../../../UtilityFunctions"
import UserFlightItem from "./UserFlightItem"
export default function UserFlightsList(props) {
    const [userFlightsList, setUserFlightsList] = useState([])

    function updateUserFlightsList() {
        const requestUrl = `/api/flights/${UtilityFunctions.Decrypt(UtilityFunctions.CookieToJson("data"))}`
        fetch(requestUrl)
            .then(response => response.json())
            .then(data => setUserFlightsList(data))
            .catch(error => console.log(error))
    }

    useEffect(() => {
        updateUserFlightsList()
    }, [])

    return (
        <div className="main-f-l">
            {userFlightsList.length > 0 ? (userFlightsList.map(flight => < UserFlightItem key={flight._id} flightObj={flight}/>)) : <h1 style={{ 'color': 'white' }}>no flights found</h1>}
        </div>
    )


}