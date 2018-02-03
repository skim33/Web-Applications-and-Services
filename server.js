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
    fs.readFile('./data/employees.json', 'utf8', function(err, data) {
        data = JSON.parse(data);
        res.json(data);
        res.end();
    });
})

app.get("/managers", function(req, res) {
    fs.readFile('./data/employees.json', 'utf8', function(err, data) {
        data = JSON.parse(data);
        var obj = [];
        for (var i in data) {
            if (data[i].isManager == true) {
                obj.push(data[i]);
            }
        }

        res.json(obj);
        res.end();
    });
})

app.get("/departments", function(req, res) {
    fs.readFile('./data/departments.json', 'utf8', function(err, data) {
        data = JSON.parse(data);
        res.json(data);
        res.end();
    });
})

function onhttpstart(){
    console.log('Express http server listening on: ' + HTTP_PORT);
}

app.use(function(req, res) {
    res.status(404).send("Page Not Found");
})

app.listen(HTTP_PORT, onhttpstart);