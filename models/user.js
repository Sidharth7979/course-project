const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose');
var user =new Schema({

    username: {
        type: String,
        unique:false,
    },
    email: {
        type: String,
        unique:false,
    },
     password:{
        type: String,
        unique:false,
    },
    number: {
        type: String,
        unique:false,
    },
    index:{
        type: String,
        unique:false,
    }
   
   
})
user.plugin(passportLocalMongoose)
module.exports = mongoose.model('sid', user);