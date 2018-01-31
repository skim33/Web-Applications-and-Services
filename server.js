var express = require("express");
var fs = require("fs");
var data_service = require("data-service.js");

var HTTP_PORT = process.env.PORT || 8080;

var app = express();

app.use(express.static('public')); 

app.get("/", function(req, res) {
    fs.readFile('./views/home.html', 'UTF-8', function(err, data){
        res.writeHead(200, { 'Content-Type': 'text/html'});
        res.end(data);
    });
});

app.get("/about", function(req, res) {
    fs.readFile('./views/about.html', 'UTF-8', function(err, data){
        res.writeHead(200, { 'Content-Type': 'text/html'});
        res.end(data);
    });
});

app.get("/managers", function(req, res) {
    res.send("TODO: get all employees who have isManager==true");
})

function onhttpstart(){
    console.log('Express http server listening on: ' + HTTP_PORT);
};

app.listen(HTTP_PORT, onhttpstart);