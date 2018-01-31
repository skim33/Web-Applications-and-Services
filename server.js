var express = require("express");

var HTTP_PORT = process.env.PORT || 8080;

var app = express();

app.use(express.static('public')); 

app.get("/", function(req, res) {
    express.readFile('/views/home.html', 'UTF-8', function(err, data){
        res.writeHead(200, { 'Content-Type': 'text/html'});
        res.end();
    });
});

app.get("/about", function(req, res) {
    express.readFile('/views/about.html', 'UTF-8', function(err, data){
        res.writeHead(200, { 'Content-Type': 'text/html'});
        res.end();
    });
});

function onhttpstart(){
    console.log('Express http server listening on: ' + HTTP_PORT);
};

app.listen(HTTP_PORT, onhttpstart);