/***************************************************************************************************
 * WEB322 – Assignment 04
 * I declare that this assignment is my own work in accordance with Seneca  Academic Policy. No part 
 * of this assignment has been copied manually or electronically from any other source  
 * (including 3rd party web sites) or distributed to other students. 
 * 
 * Name: _Woohyuk Kim___________ Student ID: __121968276___ Date: __13/03/2018____ 
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
            if (data.length > 0) {
                res.render("employees", {employees: data});
            }
        }).catch(function(err) {
            res.render("employees", { message: "no results" });
        });
    } else if(req.query.department) {
        data_service.getEmployeesByDepartment(req.query.department).then(function(data){
            if (data.length > 0) {
                res.render("employees", {employees: data});
            }
        }).catch(function(err) {
            res.render("employees", { message: "no results" });
        });
    } else if(req.query.manager) {
        data_service.getEmployeesByManager(req.query.manager).then(function(data){
            if (data.length > 0) {
                res.render("employees", {employees: data});
            }
        }).catch(function(err) {
            res.render("employees", { message: "no results" });
        });
    } else {
        data_service.getAllEmployees().then(function(data){
            if (data.length > 0) {
                res.render("employees", {employees: data});
            } else {
                res.render("employees", { message: "no results" });
            }
        }).catch(function(err) {
            res.render("employees", { message: "no results" });
        });
    }
});

//set up the '/employees/add' route to respond to the following get request
app.get("/employees/add", function(req, res) {
    data_service.getDepartments().then(function(data) {
        res.render("addEmployee", {departments:data});
    }).catch(function(err) {
        res.render("addEmployee", {departments: []});
    });
});

app.get("/employee/:empNum", function(req, res) {
    // initialize an empty object to store the values     
    let viewData = {};
 
    data_service.getEmployeeByNum(req.params.empNum).then((data) => {
        if (data) {           
             viewData.data = data; //store employee data in the "viewData" object as "employee"         
        } else {             
            viewData.data = null; // set employee to null if none were returned         
        }     
    }).catch(() => {         
        viewData.data = null; // set employee to null if there was an error      
    }).then(data_service.getDepartments)     
    .then((data) => {         
        viewData.departments = data; // store department data in the "viewData" object as "departments" 
 
     // loop through viewData.departments and once we have found the departmentId that matches         
     // the employee's "department" value, add a "selected" property to the matching          
     // viewData.departments object 

        for (let i = 0; i < viewData.departments.length; i++) {             
            if (viewData.departments[i].departmentId == viewData.data[0].department) {                 
            viewData.departments[i].selected = true;             
            }         
        } 

    }).catch(() => {       
        viewData.departments = []; // set departments to empty if there was an error     
    }).then(() => {         
        if (viewData.data == null) { // if no employee - return an error             
            res.status(404).send("Employee Not Found");         
        } else { 
            res.render("employee", { viewData: viewData }); // render the "employee" view         
        }     
    });
});

app.get("/employee/delete/:empNum", function(req, res) {
    data_service.deleteEmployeeByNum(req.params.empNum).then(function(data) {
        res.redirect("/employees");
    }).catch(function(err) {
        res.status(500).send("Unable to Remove Employee / Employee not found");
    });
});

//set up the '/departments' route to respond to the following get request
app.get("/departments", function(req, res) {
    data_service.getDepartments().then(function(data){
        if (data.length > 0) {
            res.render("departments", {departments: data});
        } else {
            res.render("departments", {message: err});
        }
    }).catch(function(err){
        res.render("departments", {message: "no results"});
    });
});

app.get("/departments/add", function(req, res) {
    res.render("addDepartment");
});

app.get("/department/:departmentId", function(req, res) {
    data_service.getDepartmentById(req.params.departmentId).then(function(data){
        res.render("department", {data: data});
    }).catch(function(err) {
        res.status(404).send("Department Not Found");
    });
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

//set up the '/images/add' route to respond to the following get request
app.get("/images/add", function(req, res) {
    res.render("addImage");
});

//set up the '/employees/add' route to respond to the following post request
app.post("/employees/add", function(req, res) {
    data_service.addEmployee(req.body).then(function(data){
        res.redirect("/employees");
    }).catch(function (err) {
        res.json({message: err});
    });
});

//set up the '/employee/update' route to respond to the following post request
app.post("/employee/update", function(req, res) {         
    data_service.updateEmployee(req.body).then(function() {
        res.redirect("/employees");
    }).catch(function(err) {
        res.json({message: err});
    });
});

app.post("/departments/add", function(req, res) {
    data_service.addDepartment(req.body).then(function(data) {
        res.redirect("/departments");
    }).catch(function(err) {
        res.json({message: err});
    });
});

app.post("/department/update", function(req, res) {
    console.log(req.body);         
    data_service.updateDepartment(req.body).then(function() {
        res.redirect("/departments");
    }).catch(function(err) {
        res.json({message: err});
    });
});

//set up the '/images/add' route to respond to the following post request
app.post("/images/add", upload.single("imageFile"), function(req, res) {
    images.push(req.file.filename);
    res.redirect("/images");
});

app.use(function(req, res) {
    res.status(404).send("Page Not Found");
});

app.listen(HTTP_PORT, function(res, req) {
    console.log('Express http server listening on: ' + HTTP_PORT);
    data_service.initialize().then(function(){
        console.log("server is initialized");
    }).catch(function(err){
        console.log(err);
    });
});

