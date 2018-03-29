const Sequelize = require('sequelize');
const Op = Sequelize.Op;

var sequelize = new Sequelize('d512uud7mtf9cp', 'tcjftcyoxzqram', '727081f190b8d2a8b91a07e406809948c551080bc7a084ddc7638fdaea60e6b6', {
    host:'ec2-107-20-151-189.compute-1.amazonaws.com',
    dialect:'postgres',
    port:5432,
    dialectOptions:{
        ssl:true
    },
    operatorsAliases: {
        $and: Op.and,
        $or: Op.or,
        $eq: Op.eq,
        $gt: Op.gt,
        $lt: Op.lt,
        $lte: Op.lte,
        $like: Op.like
    }
});

sequelize.authenticate().then(function() {
    console.log('Connection has been established successfully.');
}).catch(function(err) {
    console.log('Unable to connect to the database:', err);
});

const Employee = sequelize.define('Employee', {
    employeeNum: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate:Sequelize.STRING },
    {
        createdAt: false,
        updatedAt: false
});

const Department = sequelize.define("Department", {
    departmentId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    departmentName: Sequelize.STRING}, {
        createdAt: false,
        updatedAt: false
});

module.exports.initialize = function() {
    return new Promise(function(resolve, reject) {
        sequelize.sync().then(function(Employee) {
            resolve();
        }).then(function(Department) {
            resolve();
        }).catch((function(err) {
            reject("unable to sync the database");
        }));
        reject();
    });
}

module.exports.getAllEmployees = function() {
    return new Promise(function(resolve, reject) {
        sequelize.sync().then(function() {
            resolve(Employee.findAll());
        }).catch(function(err) {
            reject("no results returned");
        });
    });
}

module.exports.getManagers = function() {
    var isManager_true = [];
    return new Promise(function(resolve, reject) {
        reject();
    });
}

module.exports.getDepartments = function() {
    return new Promise(function(resolve, reject) {
        sequelize.sync().then(function() {
            resolve(Department.findAll());
        }).catch(function(err) {
            reject("no results returned");
        });
    });
}

module.exports.addEmployee = function(employeeData) {
    employeeData.isManager = (employeeData.isManager) ? true : false;

    return new Promise(function(resolve, reject) {
        sequelize.sync().then(function() {
            for(var i in employeeData) {
                if(employeeData[i] == "") {
                    employeeData[i] == null;
                }
            }
            resolve(Employee.create({
                employeeNum: employeeNum.employeeNum,
                firstName: employeeData.firstName,
                lastName: employeeData.lastName,
                email: employeeData.email,
                SSN: employeeData.SSN,
                addressStreet: employeeData.addressStreet,
                addressCity: employeeData.addressCity,
                addressState: employeeData.addressState,
                addressPostal: employeeData.addressPostal,
                maritalStatus: employeeData.maritalStatus,
                isManager: employeeData.isManager,
                employeeManagerNum: employeeData.employeeManagerNum,
                status: employeeData.status,
                department: employeeData.department,
                hireDate:employeeData.hireDate
            })).catch(function() {
                reject("unable to create employee");
            });
        }).catch(function() {
            reject("unable to create employee");
        });
    });
}

module.exports.getEmployeesByStatus = function(status) {
    return new Promise(function(resolve, reject) {
        sequelize.sync().then(function() {
            resolve(Employee.findAll({
                where: {
                    status: status
                }
            }));
        }).catch(function(err) {
            reject("no results returned");
        });
    });
}

module.exports.getEmployeesByDepartment = function(department) {
    return new Promise(function(resolve, reject) {
        sequelize.sync().then(function() {
            resolve(Employee.findAll({
                where: {
                    department: department
                }
            }));
        }).catch(function(err) {
            reject("no results returned");
        });
    });
}

module.exports.getEmployeesByManager = function(manager) {
    return new Promise(function(resolve, reject) {
        sequelize.sync().then(function() {
            resolve(Employee.findAll({
                where: {
                    employeeManagerNum: manager
                }
            }));
        }).catch(function(err) {
            reject("no results returned");
        });
    });
}

module.exports.getEmployeeByNum = function(num) {
    return new Promise(function(resolve, reject) {
        sequelize.sync().then(function() {
            resolve(Employee.findAll({
                where: {
                    employeeNum: num
                }
            }));
        }).catch(function(err) {
            reject("no results returned");
        });
    });
}

module.exports.updateEmployee = function(employeeData) {
    employeeData.isManager = (employeeData.isManager) ? true : false;
    return new Promise(function(resolve, reject) {
        sequelize.sync().then(function() {
            for(var i in employeeData) {
                if(employeeData[i] == "") {
                    employeeData[i] == null;
                }
            }
            resolve(Employee.create({
                firstName: employeeData.firstName,
                lastName: employeeData.lastName,
                email: employeeData.email,
                SSN: employeeData.SSN,
                addressStreet: employeeData.addressStreet,
                addressCity: employeeData.addressCity,
                addressState: employeeData.addressState,
                addressPostal: employeeData.addressPostal,
                maritalStatus: employeeData.maritalStatus,
                isManager: employeeData.isManager,
                employeeManagerNum: employeeData.employeeManagerNum,
                status: employeeData.status,
                department: employeeData.department,
                hireDate:employeeData.hireDate },
                { where: {
                    employeeNum: employeeData.employeeNum
                }
            })).catch(function() {
                reject("unable to create employee");
            });
        }).catch(function() {
            reject("unable to create employee");
        });
    });
} 

module.exports.addDepartment = function(departmentData) {
    return new Promise(function(resolve, reject) {
        sequelize.sync().then(function() {
            for (var i in departmentData) {
                if (departmentData[i] == "") {
                    departmentData[i] = null;
                }
            }
            Department.create({
                departmentId: departmentData.departmentId,
                departmentName: departmentData.departmentName
            }).then(function() {
                resolve(Department);
            }).catch(function(err) {
                reject("unable to create department");
            })
        }).catch(function() {
            reject("unable to create department");
        });
    });
}

module.exports.updateDepartment = function(departmentData) {
    return new Promise(function(resolve, reject) {
        sequelize.sync().then(function() {
            for (var i in departmentData) {
                if (departmentData[i] == "") {
                    departmentData[i] = null;
                }
            }
            Department.update({
                departmentName: departmentData.departmentName},
                { where: {
                    departmentId: departmentData.departmentId
                }
            }).then(function() {
                resolve(Department);
            }).catch(function(err) {
                reject("unable to update department");
            });
        }).catch(function() {
            reject("unable to update department");
        });
    });
}

module.exports.getDepartmentById = function(id) {
    return new Promise(function(resolve, reject) {
        sequelize.sync().then(function() {
            resolve(Department.findAll({
                where: {departmentId: id }
            }));
        }).catch(function(err) {
            reject("no results returned");
        });
    });
}

module.exports.deleteEmployeeByNum = function(empNum) {
    return new Promise(function(resolve, reject) {
        sequelize.sync().then(function() {
            resolve(Employee.destroy({
                where: {
                    employeeNum: empNum
                }}));
        }).catch(function(err) {
            reject();
        });
    });
}