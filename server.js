/***************************************************************************************************
 * WEB322 – Assignment 02 
 * I declare that this assignment is my own work in accordance with Seneca  Academic Policy. No part 
 * of this assignment has been copied manually or electronically from any other source  
 * (including 3rd party web sites) or distributed to other students. 
 * 
 * Name: _Woohyuk Kim___________ Student ID: __121968276___ Date: __05/02/2018____ 
 * 
 * Online (Heroku) Link: _https://peaceful-waters-49302.herokuapp.com/
 * 
 ***************************************************************************************************/ 

//include modules
var express = require("express");
var path = require("path");
var data_service = require("./data-service.js");
var multer = require("multer");
var fs = require("fs");
var bodyParser = require("body-parser");
var images = [];

var HTTP_PORT = process.env.PORT || 8080;

var app = express();

var dir = "process.argv[2]";

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({storage: storage});

//return the "css/site.css" file
app.use(express.static("./public/"));
app.use(bodyParser.urlencoded({ extended: true}));

//set up the default '/' route to respond to the following get request 
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname + "/views/home.html"));
});

//set up the '/about' route to respond to the following get request
app.get("/about", function(req, res) {
    res.sendFile(path.join(__dirname + "/views/about.html"));
});

//set up the '/employees' route to respond to the following get request
app.get("/employees", function(req, res) {
    data_service.getAllEmployees().then(function(data){
        res.json(data);
    }).catch(function(err) {
        res.jason({message: err});
    });
});

//set up the '/managers' route to respond to the following get request
app.get("/managers", function(req, res) {
    data_service.getManagers().then(function(data){
        res.json(data);
    }).catch(function(err) {
        res.json({message: err});
    });
});

//set up the '/departments' route to respond to the following get request
app.get("/departments", function(req, res) {
    data_service.getDepartments().then(function(data){
        res.json(data);
    }).catch(function(err){
        res.json({message: err});
    });
});

app.get("/employees/add", function(req, res) {
    res.sendFile(path.join(__dirname + "/views/addEmployee.html"));
});

app.get("/images/add", function(req, res) {
    res.sendFile(path.join(__dirname + "/views/addImage.html"));
});

app.post("/images/add", upload.single("imageFile"), function(req, res) {
    images.push(req.file.filename);
    res.redirect("/images");
});

app.get("/images", function(req, res) {
    fs.readdir(dir, function (err, items){
        var someData = {
            images: images
        };

        res.json(someData);
    });
});

app.post("/employees/add", function(req, res) {
    var data = {};
    data.firstName = req.body.firstName;
    data.lastName = req.body.lastName;
    data.email = req.body.email;
    data.SSN = req.body.SSN;
    data.addressStreet = req.body.addressStreet;
    data.addressCity = req.body.addressCity;
    data.addressState = req.body.addressState;
    data.addressPostal = req.body.addressPostal;
    data.isManager = req.body.isManager;
    data.employeeManagerNum = req.body.employeeManagerNum;
    data.status = req.body.status;
    data.department = req.body.department;
    data.hireDate = req.body.hireDate;

    data.addEmployee(req.body);
    res.redirect("/employees");
});

app.use(function(req, res) {
    res.status(404).send("Page Not Found");
});

app.listen(HTTP_PORT, function(res, req) {
    console.log('Express http server listening on: ' + HTTP_PORT);
    data_service.initialize().then(function(data){
        console.log(data);
    }).catch(function(err){
        console.log(err);
    });
});

