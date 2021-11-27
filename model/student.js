const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    fname :{
        type: String,
    },
    lname :{
        type: String,
    },
    dob :{
        type: String,
    },
    email :{
        type: String,
    },
    phone :{
        type: Number,
    },
    course :{
        type: String
    },
    address :{
        type: String
    },
    photo: {
        type: String
    }
})

module.exports = mongoose.model('student',studentSchema);