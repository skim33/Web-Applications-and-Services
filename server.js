var express = require("express");

var HTTP_PORT = process.env.PORT || 8080;

var app = express();

app.use(express.static('public')); 

app.get("/", function(req, res) {
    res.sendFile("/views/home.html", "text/html");
    res.end();
});

app.get("/about", function(req, res) {
    res.sendFile("/views/about.html", "text/html");
    res.end();
});

function onhttpstart(){
    console.log('Express http server listening on: ' + HTTP_PORT);
};

app.listen(HTTP_PORT, onhttpstart);