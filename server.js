/***************************************************************************************************
 * WEB322 – Assignment 03 
 * I declare that this assignment is my own work in accordance with Seneca  Academic Policy. No part 
 * of this assignment has been copied manually or electronically from any other source  
 * (including 3rd party web sites) or distributed to other students. 
 * 
 * Name: _Woohyuk Kim___________ Student ID: __121968276___ Date: __20/02/2018____ 
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
var exphbs = require("express-handlebars");
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

//define upload variable
const upload = multer({storage: storage});

//return the "css/site.css" file
app.use(express.static("./public/"));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(function(req, res, next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute=(route=="/")?"/":route.replace(/\/$/,"");
    next();
});

app.engine('.hbs', exphbs({ 
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        navLink: function (url, options){     
            return '<li' + ((url == app.locals.activeRoute) ? ' class="active" ' : '') + '><a href="' + url + '">' + options.fn(this) + '</a></li>'; 
        },

        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");     
            if (lvalue != rvalue) {
                return options.inverse(this);     
            } else {         
                return options.fn(this);     
            } 
        }
    }
}));

app.set('view engine', '.hbs');

//set up the default '/' route to respond to the following get request 
app.get("/", function(req, res) {
    res.render("home");
});

//set up the '/about' route to respond to the following get request
app.get("/about", function(req, res) {
    res.render("about");
});

//set up the '/employees' route to respond to the following get request
app.get("/employees", function(req, res) {
    if(req.query.status) {
        data_service.getEmployeesByStatus(req.query.status).then(function(data){
            res.render("employees", {employees: data}) ;
        }).catch(function(err) {
            res.render({message: "no results"});
        });
    } else if(req.query.department) {
        data_service.getEmployeesByDepartment(req.query.department).then(function(data){
            res.render("employees", {employees: data}) 
        }).catch(function(err) {
            res.render({message: "no results"});
        });
    } else if(req.query.manager) {
        data_service.getEmployeesByManager(req.query.manager).then(function(data){
            res.render("employees", {employees: data}) 
        }).catch(function(err) {
            res.render({message: "no results"});
        });
    } else {
        data_service.getAllEmployees().then(function(data){
            res.render("employees", {employees: data}) 
        }).catch(function(err) {
            res.render({message: "no results"});
        });
    }
});

app.get("/employee/:empNum", function(req, res) {
    data_service.getEmployeeByNum(req.params.num).then(function(list){
        res.render("employee", {employee:data});
    }).catch(function(err) {
        res.render("employee", {message: "no results"});
    });
});

//set up the '/departments' route to respond to the following get request
app.get("/departments", function(req, res) {
    data_service.getDepartments().then(function(data){
        res.render("departments", {departments:data});
    }).catch(function(err){
        res.render({message: err});
    });
});

//set up the '/employees/add' route to respond to the following get request
app.get("/employees/add", function(req, res) {
    res.render("addEmployee");
});

//set up the '/images/add' route to respond to the following get request
app.get("/images/add", function(req, res) {
    res.render("addImage");
});

//set up the '/images/add' route to respond to the following get request
app.post("/images/add", upload.single("imageFile"), function(req, res) {
    images.push(req.file.filename);
    res.redirect("/images");
});

//set up the '/images' route to respond to the following get request
app.get("/images", function(req, res) {
    fs.readdir(dir, function (err, items){
        var someData = {
            images: images
        };

        res.render("images", someData);
    });
});

//set up the '/employees/add' route to respond to the following get request
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

    data_service.addEmployee(data).then(function(){
        res.redirect("/employees");
    }).catch(function (err) {
        res.json({message: err});
    });
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

