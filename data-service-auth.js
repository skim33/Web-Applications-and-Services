var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var userSchema = new Schema({
    userName: {
        type: String,
        unique: true
    },
    password: String,
    email: String,
    loginHistory: [{dateTime: Date, userAgent: String}]
});

let User; //to be defined on new connection

var dbURL = "mongodb://<dbuser>:<dbpassword>@ds243049.mlab.com:43049/web322_a6";

module.exports.initialize = function () {     
    return new Promise(function (resolve, reject) {         
        let db = mongoose.createConnection(dbURL); 
 
        db.on('error', (err)=>{             
            reject(err); // reject the promise with the provided error         
        });         
        db.once('open', ()=>{            
            User = db.model("users", userSchema);            
            resolve();         
        });     
    }); 
}

module.exports.registerUser = (userData) => {
    return new Promise((resolve, reject) => {
        if (userData.password != userData.password2) {
            reject("Passwords do not match");
        }

        let newUser = new User(userData);
        newUser.save(() => {
            resolve();
        }).catch((err) => {
            if (err.code == 11000) {
                reject("User Name already taken");
            } else {
                reject("There was an error creating the user: " + err);
            }
        });
    });
}

module.exports.checkUser = (userData) => {
    return new Promise((resolve, reject) => {
        User.find({user: userData.userName}).exec().then((user) => {
            if (users == null) {
                reject("Unable to find user: " + userData.userName);
            } else if (users[0].password != userData.password) {
                reject("Incorrect Password for user: " + userData.userName);
            } else {
                users[0].loginHistory.push({dateTime: (new Date()).toString(), userAgent: userData.userAgent});
                User.update({ userName: users[0].userName},
                    { $set: { loginHistory: users[0].loginHistory } } 
                ).exec().catch((err) => {
                    reject("There was an error verifying the user: " + err);
                });
                resolve(users[0]);
            }
        }).catch((err) => {
            reject("Unablet to find user: " + userData.user);
        })
    })
}