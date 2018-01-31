var express = require("express");
var fs = require("fs");
var data_service = require("./data-service");
var url = require('url');
var http = require('http');

var HTTP_PORT = process.env.PORT || 8080;

var app = express();

app.use(express.static('public')); 

var url_parts = url.parse(req.url);

switch(url_parts.pathname) {
    case '/':
        fs.readFile('./views/home.html', 'UTF-8', function(err, data){
            res.writeHead(200, { 'Content-Type': 'text/html'});
            res.end(data);
        });
        break;
    
    case '/about':
        fs.readFile('./views/about.html', 'UTF-8', function(err, data){
            res.writeHead(200, { 'Content-Type': 'text/html'});
            res.end(data);
        });
        break;
    
    case '/employees':
        fs.readFile('./data/employees.json', 'utf8', function(err, data) {
         data = JSON.parse(data);
            res.json(data);
            res.end();
        });
        break;
    
    case '/managers':
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
        break;
    
    case '/departments':
        fs.readFile('./data/departments.json', 'utf8', function(err, data) {
            data = JSON.parse(data);
            res.json(data);
            res.end();
        });
        break;
    
    default:
        res.send("AAAA");
}

function onhttpstart(){
    console.log('Express http server listening on: ' + HTTP_PORT);
};

app.listen(HTTP_PORT, onhttpstart);