const mongoose = require('mongoose')

const regSchema = new mongoose.Schema({
   name: {
       type: String,
   },
   email: {
       type: String,
   },
   phone: {
       type: Number,
   },
   password: {
       type: String
   }
})

module.exports = mongoose.model('register',regSchema);