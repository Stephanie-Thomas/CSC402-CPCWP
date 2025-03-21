const mongoose = require('mongoose');

//Defines fields and their types for user documents in mongoDB
const userSchema = new mongoose.userSchema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    //password: {type: String, required: true},
}, {timestamps: true});

//Lets you query and manipulate the users within MongoDB whenever require("User") is used in code
module.exports = mongoose.model("User", userSchema);