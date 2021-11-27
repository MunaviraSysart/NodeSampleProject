const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    course : {
        type: String
    },
    duration: {
        type: String
    },
    description: {
        type: String
    },
})

module.exports = mongoose.model('course', courseSchema);