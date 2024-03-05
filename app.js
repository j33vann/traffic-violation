const express = require("express")
const ejs = require("ejs")
const body = require("body-parser")
const mongoose = require("mongoose")

// const findOrCreate = require("mongoose-findorcreate")
// var MongoStore = require('connect-mongo')(session);

const app = express() 
const server = require('http').createServer(app)
app.set("view engine", "ejs")
app.use(body.urlencoded({extended: true}))
app.use(body.json())
app.use(express.static("public"))

mongoose.connect("mongodb://127.0.0.1/trafficdb")

const userSchema = new mongoose.Schema({
    name: String,
    dob: String,
    phone: String,
    vehicle: String
})

const violationSchema = new mongoose.Schema({
    vehicle: String,
    date: String,
    time: String,
    violation: String,
    user: {
        name: String,
        dob: String,
        phone: String
    }
})

const User = new mongoose.model("user", userSchema)
const Violation = new mongoose.model("violation", violationSchema)

app.get("/", async (req, res)=> {
    Violation.find().then((violation)=>{
        console.log(violation)
        res.render("index.ejs", viol=violation)
    }).catch((err)=>{
        res.send("Error")
    })
})

app.post("/make-user", (req, res)=> {

    var user = {
        name: req.body.name,
        dob: req.body.dob,
        phone: req.body.phone,
        vehicle: req.body.vehicle
    }

    User.create(user)
    .then((res)=>{
        console.log("DONE")
    }).catch((err)=>{
        console.log("ERROR: " + err)
    })

    res.send("GOT IT")
})

app.post("/make-vil", (req, res)=> {
    User.findOne({vehicle: req.body.vehicle}).then((user)=>{
        if(user != null){
            var violation = {
                vehicle: req.body.vehicle,
                date: req.body.date,
                time: req.body.time,
                violation: req.body.violation,
                user: {
                    name: user.name,
                    dob: user.dob,
                    phone: user.phone
                }
            }
            Violation.create(violation)
            .then((vres)=>{
                res.send("Violation Created")
            }).catch((err)=>{
                res.send("ERROR: " + err)
            })
        } else {
            res.send("No User Found")
        }
    }).catch((err)=>{
        console.log(err)
    })
})

server.listen(3030, ()=> {
    console.log("Server is up and running")
})