const mongoose = require("mongoose");



const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age:{
        type: Number,
    },
    work:{
        type: String,
        enum:["cheif", "owner", "waiter"],
        required: true
    },
    address:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true,
        unique:true
    },
    salary:{
        type: Number,
        required:true
    }

})

const person = mongoose.model('person', personSchema);
module.exports = person;