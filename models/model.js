const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose');
var course =new Schema({

    Title: {
        type: String,
        unique:false,
    },
    Image:{
        type: String,
        unique:false,
    },
    Price:{
        type: String,
        unique:false,
    },
    Description:{
        type: String,
        unique:false,
    },
    Duration:{
        type: String,
        unique:false,
    },
    Instructor:
    {
        type: String,
        unique:false,
    }

    
    
    
})

module.exports = mongoose.model('sidharth',course);