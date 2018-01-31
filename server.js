var express = require("express");
var fs = require("fs");
var http = require('http');
var url = require('url');
var data_service = require("./data-service");

var HTTP_PORT = process.env.PORT || 8080;

var app = express();

app.use(express.static('public')); 

http.createServer(function(req, res) {
   
    if (req.url == '/home' || req.url == '/') {
        fs.readFile('./views/home.html', 'UTF-8', function(err, data){
            res.writeHead(200, { 'Content-Type': 'text/html'});
            res.end(data);
        });
    } else if (req.url == '/about'){
        fs.readFile('./views/about.html', 'UTF-8', function(err, data){
            res.writeHead(200, { 'Content-Type': 'text/html'});
            res.end(data);
        });
    } else if (req.url == '/employees') {
        fs.readFile('./data/employees.json', 'utf8', function(err, data) {
            data = JSON.parse(data);
            res.json(data);
            res.end();
        });
    } else if (req.url == '/managers') {
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
    } else if (req.url == '/departments') {
        fs.readFile('./data/departments.json', 'utf8', function(err, data) {
            data = JSON.parse(data);
            res.json(data);
            res.end();
        });
    } else {
        res.send("AAA");
    }
})

function onhttpstart(){
    console.log('Express http server listening on: ' + HTTP_PORT);
};

app.listen(HTTP_PORT, onhttpstart);