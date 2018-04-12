var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const bcrypt = require('bcryptjs'); 

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

var dbURL = "mongodb://wkim33:zwc0127W@ds243049.mlab.com:43049/web322_a6";

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

        bcrypt.genSalt(10, function(err, salt) { // Generate a "salt" using 10 rounds     
            bcrypt.hash(userData.password, salt, function(err, hash) { // encrypt the password: userData.password        
                // TODO: Store the resulting "hash" value in the DB
                userData.password = hash;
                let newUser = new User(userData);
                newUser.save((err) => {
                    if(err) {
                        if (err.code == 11000) {
                            reject("User Name already taken");
                        } else {
                            reject("There was an error creating the user: " + err);
                        }
                    }
                    resolve();
                });

                if (err) {
                    reject("There was an error encrypting the password");
                }
            }); 

            if (err) {
                reject("There was an error encrypting the password");
            }
        });
    });
}

module.exports.checkUser = (userData) => {
    return new Promise((resolve, reject) => {
        User.find({ userName: userData.userName }).exec().then((users) => {
            
            bcrypt.compare(userData.password, users[0].password).then((res) => {    
                // res === true if it matches and res === false if it does not match
                if (res === true) {
                    users[0].loginHistory.push({dateTime: (new Date()).toString(), userAgent: userData.userAgent});
                    User.update(
                        { userName: users[0].userName},
                        { $set: { loginHistory: users[0].loginHistory } 
                    }).exec().catch((err) => {
                        reject("There was an error verifying the user: " + err);
                    });
                    
                    resolve(users[0]);
                } else {
                    reject("There was an error verifying the user: " + err);
                }
            });

        }).catch((err) => {
            reject("Unablet to find user: " + userData.userName);
        });
    });
}