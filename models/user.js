const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


// in schema there is no need to mention the username and password becoz passportLocalMongoose is bydeefault create  a username and password.
const userSchema = new Schema({
    email:{
        type : String,
        required : true,
    },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);