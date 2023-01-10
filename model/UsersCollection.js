const mongoose = require("mongoose")
const { Schema } = mongoose;

const UsersCollectionSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    type: { type: String, required: true },
    flights: [{
        fid: { type: Schema.Types.ObjectId, ref: "flights" },
        pamount: Number, //amount paid
        seats: []
    }],
    paymentinfo: {
        name: String,
        id: String,
        cardnum: String,
        emonth: String,
        eyear: String,
        cvc: String
    },
})

const UsersCollectionModel = mongoose.model("users", UsersCollectionSchema)

module.exports = UsersCollectionModel