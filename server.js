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

var HTTP_PORT = process.env.PORT || 8080;

var app = express();

//return the "css/site.css" file
app.use(express.static('public')); 

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
    res.redirect("/images");
});

app.get("/images", fs.readdir(path, function(err, items) {
    res.jason(items);
}));

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

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({storage: storage});