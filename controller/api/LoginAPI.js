var express = require('express')
var router = express.Router()

var LoginModel = require("../../model/UsersCollection")

router.post("/login", async (req, res) => {
    try {
        const users = await LoginModel.find({ username: req.body.username }).exec();
        if (users.length > 0) {
            if (users[0].password === req.body.password) {
                res.json({ message: "login success", type: users[0].type, id: users[0]._id })
            }
            else {
                res.json({ message: "password incorrect" })
            }
        }
        else {
            res.json({ message: "email not found" })
        }
    }
    catch (err) {
        res.json(err.message);
    }
})

router.post("/register", async (req, res) => {
    try {

        const users = await LoginModel.find({ username: req.body.username }).exec();
        if (users.length > 0) {
            res.json({ message: "email already exists" })
        }
        else {
            users.push(await LoginModel.create({ username: req.body.username, password: req.body.password, type: "user", flights: [] }));
            res.json({ message: "register success" })
        }
    }
    catch (err) {
        console.log(err.message)
        res.json(err.message);
    }
})

router.get("/auth/:userid", async (req, res) => {
    try {
        const user = await LoginModel.findOne({ _id: req.params.userid })
        if (user) {
            res.json(true)
        }
        else {
            res.json(false)
        }
    }
    catch (err) {
        console.log(err.message)
        res.json(err.message);
    }
})
module.exports = router