const mongoose = require("mongoose")
const { Schema } = mongoose;

const FlightsCollectionSchema = new mongoose.Schema({
    origin: {},
    destination: {},
    departDate: { type: Date, required: true },
    arriveDate: { type: Date, required: true },
    price: { type: Number, required: true },
    seats: []
})

const FlightsCollectionModel = mongoose.model("flights", FlightsCollectionSchema)

module.exports = FlightsCollectionModel