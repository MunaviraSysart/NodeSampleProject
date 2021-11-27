const express = require('express')
const app = express()
const auth = require('./routes/auth')
const path = require('./routes/route')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const expressLayout = require('express-ejs-layouts')
const flash = require('connect-flash')
const session=require('express-session')

//config env
dotenv.config()

//connect to mongodb
mongoose.connect(process.env.DB_CONNECT, () =>{
    console.log('Db connected')
})

//intialise layout
app.use(expressLayout)

//setting ejs as engine
app.set('view engine','ejs')

//json
app.use(express.urlencoded({extended: true})); 
app.use(express.json());

//connect flash for flash messages
app.use(flash());
//session handle for flas msg
app.use(session({ cookie: { maxAge: 60000 }, 
    secret: 'woot',
    resave: false, 
    saveUninitialized: false}));

// Access public folder from root
app.use(express.static('images'));

//initial route
app.use('/',auth)
app.use('/app',path)



//listening port
app.listen(process.env.PORT, () =>{
    console.log('running...')
})