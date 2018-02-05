/***************************************************************************************************
 * WEB322 – Assignment 02 
 * I declare that this assignment is my own work in accordance with Seneca  Academic Policy. No part 
 * of this assignment has been copied manually or electronically from any other source  
 * (including 3rd party web sites) or distributed to other students. 
 * 
 * Name: _Woohyuk Kim___________ Student ID: __121968276___ Date: __05/02/2018____ 
 * 
 * Online (Heroku) Link: ________________________________________________________ 
 * 
 ***************************************************************************************************/ 

var express = require("express");
var path = require("path");
var data_service = require("./data-service.js");

var HTTP_PORT = process.env.PORT || 8080;

var app = express();

app.use(express.static('public')); 

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname + "/views/home.html"));
})

app.get("/about", function(req, res) {
    res.sendFile(path.join(__dirname + "/views/about.html"));
})

app.get("/employees", function(req, res) {
    data_service.getAllEmployees().then(function(data){
        res.json(data);
    }).catch(function(err) {
        res.jason({message: err});
    });
})

app.get("/managers", function(req, res) {
    data_service.getManagers().then(function(data){
        res.json(data);
    }).catch(function(err) {
        res.json({message: err});
    });
})

app.get("/departments", function(req, res) {
    data_service.getDepartments().then(function(data){
        res.json(data);
    }).catch(function(err){
        res.json({message: err});
    });
})

app.use(function(req, res) {
    res.status(404).send("Page Not Found");
})

app.listen(HTTP_PORT, function(res, req) {
    console.log('Express http server listening on: ' + HTTP_PORT);
    data_service.initialize().then(function(data){
        console.log(data);
    }).catch(function(err){
        console.log(err);
    });
});