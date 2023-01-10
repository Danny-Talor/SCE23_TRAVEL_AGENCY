var express = require('express')
var router = express.Router()

var FlightsCollectionModel = require("../../model/FlightsCollection")
var UsersCollectionModel = require("../../model/UsersCollection")

function RemovePastFlights(flights) {
    let updatedflights = []
    for (const flight of flights) {
        let departDate = new Date(flight.departDate)
        let today = new Date()
        if (departDate >= today) {
            updatedflights.push(flight)
        }
    }
    return updatedflights
}

router.get("/getFlights", async (req, res) => {
    try {
        const flights = await FlightsCollectionModel.find({ seats: { $in: 0 } }) // find all flights with available seats
        res.json(RemovePastFlights(flights))
    }
    catch (err) {
        console.log(err.message)
        res.json(err.message)
    }
})

router.get("/flights/:userid", async (req, res) => {
    try {//Instead of `doc.arr[0].populate("path")`, use `doc.populate("arr.0.path")`
        const user = await UsersCollectionModel.findOne({ _id: req.params.userid }, 'flights')
            .populate({
                path: "flights.fid",
                select: "arriveDate departDate destination.label origin.label",
                model: FlightsCollectionModel
            })
        res.json(user.flights)
    }
    catch (err) {
        console.log(err.message)
        res.json(err.message)
    }
})

router.post("/addFlight", async (req, res) => {
    try {
        let flight = req.body
        flight.departDate = new Date(flight.departDate).setSeconds(0)
        flight.arriveDate = new Date(flight.arriveDate).setSeconds(0)
        let seats = []
        for (let i = 0; i < req.body.numSeats; i++) {
            seats[i] = 0 //0 - empty seat
        }
        flight.seats = seats
        await FlightsCollectionModel.create(flight)
        res.json("Flight added.")
    }
    catch (err) {
        console.log(err.message)
        res.json(err.message)
    }
})


router.post("/editFlight", async (req, res) => {
    try {
        let edited_flight = req.body
        const flight = await FlightsCollectionModel.findById(edited_flight.id)

        flight.origin = edited_flight.origin
        flight.destination = edited_flight.destination
        flight.departDate = edited_flight.departDate
        flight.departDate = new Date(flight.departDate).setSeconds(0)
        flight.arriveDate = edited_flight.arriveDate
        flight.arriveDate = new Date(flight.arriveDate).setSeconds(0)
        flight.price = edited_flight.price

        let seats = flight.seats
        for (let i = flight.seats.length; i < edited_flight.numSeats; i++) {
            seats.push(0)
        }
        flight.seats = seats

        flight.save()
            .then(console.log("flight edited"))
    }
    catch (err) {
        console.log(err.message)
        res.json(err.message)
    }
})

router.post("/removeFlight", async (req, res) => {
    try {
        await FlightsCollectionModel.deleteOne({ _id: req.body._id })
        res.json("Flight deleted.")
    }
    catch (err) {
        console.log(err.message)
        res.json(err.message);
    }
})

router.get(
    "/searchFlight/:origin/:destination/:departDate/:startPrice/:endPrice/:ways"
    , async (req, res) => {
        try {
            if (req.params.ways == 1) {
                const flight = await FlightsCollectionModel.find({
                    "origin.value": req.params.origin,
                    "destination.value": req.params.destination,
                    "departDate": { $gte: new Date(req.params.departDate) },
                    "price": { $gte: req.params.startPrice, $lte: req.params.endPrice },
                    "seats": { $in: 0 }
                })
                res.json(flight)
            }
            else if (req.params.ways == 2) {
                const flight = await FlightsCollectionModel.find({
                    "origin.value": req.params.origin,
                    "destination.value": req.params.destination,
                    "departDate": { $gte: new Date(req.params.departDate) },
                    "price": { $gte: req.params.startPrice, $lte: req.params.endPrice },
                    "seats": { $in: 0 }
                })
                const return_flight = await FlightsCollectionModel.find({
                    "origin.value": req.params.destination,
                    "destination.value": req.params.origin,
                    "departDate": { $gte: new Date(req.params.departDate) },
                    "price": { $gte: req.params.startPrice, $lte: req.params.endPrice },
                    "seats": { $in: 0 }
                })
                arr = []
                for (let i = 0; i < flight.length; i++) {
                    arr.push(flight[i])
                }
                for (let i = 0; i < return_flight.length; i++) {
                    arr.push(return_flight[i])
                }
                res.json(arr)

            }
            else {
                res.json({ "Invalid number of ways": req.params.ways })
            }

        }
        catch (err) {
            console.log(err.message)
            res.json(err.message)
        }
    })


//returns amount of available seats on flight
function getAvailableSeats(flight_seats) {
    if (flight_seats.includes(0)) {
        let availableseats = 0
        for (seat of flight_seats) {
            if (seat === 0) {
                availableseats++
            }
        }
        return availableseats
    }
    return -1
}

router.get("/availableseatsonflight/:flightid", async (req, res) => {
    try {
        const flight = await FlightsCollectionModel.findOne({ _id: req.params.flightid })
        res.json(getAvailableSeats(flight.seats))
    }
    catch (err) {
        console.log(err.message)
        res.json(err.message);
    }

})

router.post("/purchase", async (req, res) => {
    try {
        const flight = await FlightsCollectionModel.findOne({ _id: req.body.flightid })
        if (flight) {
            //check seats are available for amount of passengers
            if (req.body.passengers > getAvailableSeats(flight.seats)) {
                res.json({ validating: true, status: 'failed', error: 'Error assigning seats! (###-ST0)' });
            }
            else {
                const user = await UsersCollectionModel.findOne({ _id: req.body.userid })
                if (user) {
                    //assign seats on flight
                    let assigned_seats = []
                    for (let i = 1; i <= req.body.passengers; i++) {
                        for (let j = 0; j < flight.seats.length; j++) {
                            if (flight.seats[j] === 0) {
                                flight.seats[j] = req.body.userid
                                assigned_seats.push(j + 1)
                                break;
                            }
                        }
                    }
                    //check seats assigned
                    if (assigned_seats.length === req.body.passengers) {
                        flight.save()
                        //add flight information to user's flights list
                        user.flights.push(
                            {
                                fid: req.body.flightid,
                                pamount: req.body.pamount,
                                seats: assigned_seats
                            }
                        )
                        //check user asked to save payment info
                        if (req.body.paymentinfo) {
                            //update user payment info
                            user.paymentinfo = req.body.paymentinfo
                        }
                        user.save()
                        res.json({ validating: true, status: 'confirmed' });
                    }
                    else {
                        res.json({ validating: true, status: 'failed', error: 'Error assigning seats! (###-ST1)' });
                    }
                }
                else {
                    res.json({ validating: true, status: 'failed', error: 'We encountered an error! (###-UIDUNDEF)' });
                }
            }
        }
        else {
            res.json({ validating: true, status: 'failed', error: 'We encountered an error! (###-FIDUNDEF)' });
        }
    }
    catch (err) {
        console.log(err.message)
        res.json({ validating: true, status: 'failed', error: err.message });
    }
})

router.get("/paymentinfo/:userid", async (req, res) => {
    try {
        const user = await UsersCollectionModel.findOne({ _id: req.params.userid })
        if (JSON.stringify(user.paymentinfo) === '{}') {
            res.json(
                {
                    cardnum: '',
                    emonth: '',
                    eyear: '',
                    cvc: '',
                    name: '',
                    id: ''
                }
            )
        }
        else {
            res.json(user.paymentinfo)
        }
    }
    catch (err) {
        console.log(err.message)
        res.json(err.message);
    }

})

module.exports = router

// {
//     userid: '63976840739d7b4a15a3213d',
//     flightid: '63bc6475ac7fae254b490390',
//     pamount: 124,
//     passengers: 1,
//     paymentinfo: {
//       cardnum: 'U2FsdGVkX1+LJO4Vg1TZ7i1EbAsTOdiKq6caTX85Woo=',
//       emonth: 'U2FsdGVkX18e3xXad4ujAbpOvxVOSNH9yDhlkid+j5g=',
//       eyear: 'U2FsdGVkX1/hWK2PzwzZpHG56UdQO1MBL7o8PTkNsLA=',
//       cvc: 'U2FsdGVkX1+zbVTtHpGi1VqaTmZoGFV2xlg+EIHgBLg=',
//       name: 'asfasfasf',
//       id: '378282246310005'
//     }
//   }