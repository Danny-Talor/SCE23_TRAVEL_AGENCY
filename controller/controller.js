require("dotenv").config({path:'../.env'}) //Enables to use the .env file for global vars
const express = require("express")
const cors = require("cors")
const app = express()
const path = require("path")
const port = process.env.PORT || 4000
const mongodbURI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER_NAME}.${process.env.MONGODB_KEY}.mongodb.net/${process.env.MONGODB_DATABASE_NAME}?retryWrites=true&w=majority`
const mongoose = require("mongoose")

mongoose.set('strictQuery', false)
mongoose.connect(mongodbURI)

app.use(express.json())
app.use(cors())
app.listen(port, ()=>{
    mongoose.connection.once('open',()=>{
        console.log("MongoDB connection established successfuly.")
        app.use('/api/', require("./api/FlightsAPI"))
        app.use('/api/', require("./api/LoginAPI"))
    })
})

if (process.env.PROD==="true") {

    //Set static folder up in production
    app.use(express.static('../view/dist'))
    app.get('/', (req,res) => res.sendFile(path.resolve(__dirname,'..', 'view', 'dist','index.html')))
}