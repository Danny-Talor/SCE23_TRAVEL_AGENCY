import UtilityFunctions from "../../../UtilityFunctions"
import { Stack } from "react-bootstrap"
export default function UserFlightItem(props) {
    const flightObj = props.flightObj

    function getSeatNumbers(seatsArray) {
        let seats = ""
        for (let i = 0; i < seatsArray.length; i++) {
            if (i === seatsArray.length - 1) {
                seats += seatsArray[i]
            }
            else {
                seats += seatsArray[i] + ", "
            }
        }
        return seats
    }

    return (
        <>
            <div className="main-f-i">
                <Stack direction="horizontal" gap={3}>
                    <Stack gap={3}>
                        {flightObj.fid.origin.label}
                        <br />
                        {UtilityFunctions.DBDateToStringDate(flightObj.fid.departDate)}
                    </Stack>
                    <Stack>
                        ⇢
                    </Stack>
                    <Stack gap={3}>
                        {flightObj.fid.destination.label}
                        <br />
                        {UtilityFunctions.DBDateToStringDate(flightObj.fid.departDate)}
                    </Stack>
                </Stack>
                <br></br>
                <Stack direction="horizontal" gap={3}>
                    <Stack gap={3}>
                        Seats numbers: {getSeatNumbers(flightObj.seats)}
                        <br />
                        Paid amount: ${flightObj.pamount}
                    </Stack>
                    <Stack>
                        <img src="https://makeqrcodenow.com/wp-content/uploads/2021/04/rick-roll-qr-code-300x300.png" height={"100px"} width={"100px"}></img>
                    </Stack>
                </Stack>

            </div>
        </>
    )
}