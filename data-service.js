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
    });
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
    });
}

module.exports.addEmployee = function(employeeData) {
    return new Promise(function(resolve, reject) {
        if (employeeData.isManager == undefined) {
            employeeData.isManager == false;
        } else {
            employeeData.isManager == true;
        }

        employeeData.employeeNum = employees.length + 1;

        employees.push(employeeData);

        resolve(employees);
    });
}

module.exports.getEmployeesByStatus = function(status) {
    var status_arr = [];
    return new Promise(function(resolve, reject) {
        for (var i = 0; i < employees.length; i++) {
            if (employees[i].status == status) {
                status_arr.push(employees[i]);
            }
        }
        
        if (status_arr.length > 0) {
            resolve(status_arr);
        } else {
            reject("no result returned");
        }
    });
}

module.exports.getEmployeesByDepartment = function(department) {
    var department_arr = [];
    return new Promise(function(resolve, reject) {
        for (var i = 0; i < employees.length; i++) {
            if (employees[i].department == department) {
                department_arr.push(employees[i]);
            }
        }
        
        if (department_arr.length > 0) {
            resolve(department_arr);
        } else {
            reject("no result returned");
        }
    });
}

module.exports.getEmployeesByManager = function(manager) {
    var manager_arr = [];
    return new Promise(function(resolve, reject) {
        for (var i = 0; i < employees.length; i++) {
            if (employees[i].employeeManagerNum == manager) {
                manager_arr.push(employees[i]);
            }
        }
        
        if (manager_arr.length > 0) {
            resolve(manager_arr);
        } else {
            reject("no result returned");
        }
    });
}

module.exports.getEmployeeByNum = function(num) {
    return new Promise(function(resolve, reject) {
        for (var i = 0; i < employees.length; i++) {
            if (employees[i].employeeNum == num) {
                resolve(employees[i]);
            }
        }
        reject("no result returned");
    });
}

module.exports.updateEmployee = function(employeeData) {
    return new Promise(function(resolve, reject) {
        for (var i = 0; i < emplyees.length; i++) {
            if (employees[i].employeeNum == employeeData.employeeNum) {
                console.log(employees[i].employeeNum);
                console.log(employeeData.employeeNum);
                employees.splice((employeeData.employeeNum - 1), 1, employeeData);
            }
        }

        resolve();
    });
} 