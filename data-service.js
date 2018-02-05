//include module
var fs = require("fs");

//global array declaration
var employees = [];
var departments = [];

module.exports.initialize = function() {
    return new Promise(function(resolve, reject) {
        fs.readFile("./data/employees.json", function(err, data){
            if (err) {
                reject("Can not read the employees.json file");
            } else {
                employees = JSON.parse(data);

                fs.readFile("./data/departments.json", function(err, data){
                    if (err) {
                        reject("Can not read the departments.json file");
                    } else {
                        departments = JSON.parse(data);
                        resolve("Successfully read the json files");
                    }
                });
            }
        });
    });
}

module.exports.getAllEmployees = function() {
    return new Promise(function(resolve, reject) {
        if (employees.length == 0) {
            reject("no results returned");
        } else {
            resolve(employees);
        }
    })
}

module.exports.getManagers = function() {
    var isManager_true = [];
    return new Promise(function(resolve, reject) {
        if (employees.length == 0) {
            reject("no result returned");
        } else {
            for (var i = 0; i < employees.length; i++) {
                if (employees[i].isManager == true) {
                    isManager_true.push(employees[i]);
                }
            } 
            resolve(isManager_true);
        }
    });
}

module.exports.getDepartments = function() {
    return new Promise(function(resolve, reject) {
        if (departments.length == 0) {
            reject("no result returned");
        } else {
            resolve(departments);
        }
    })
}