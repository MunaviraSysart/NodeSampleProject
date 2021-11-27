const mongoose = require('mongoose')

const feedbackSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    feedback: {
        type: String
    },
    userId: {
        type: String
    }
})

module.exports = mongoose.model('feedback',feedbackSchema)