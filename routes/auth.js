const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const session = require('express-session')
const Register = require('../model/register')


//base route
router.get('/', (req, res) =>{
    res.render('auth/login',{layout: 'auth/login', errMessage: req.flash('err_message')})
})

//login
router.post('/login', async(req, res) =>{
    console.log(req.body)
    let user = await Register.findOne({email: req.body.email})
    console.log(user)
    if(user){
        bcrypt.compare(req.body.password, user.password).then(val =>{
            console.log('val',val)
            if(val){
                req.session.user = user; //loggined user stored into req.session.user
                req.session.userLoggedIn = true;
                res.redirect('/app/home')
            }
            else{
                req.flash('err_message','Incorrect Password..!!')
                res.redirect('/')
            }
        })
    }
    else{
        req.flash('err_message', 'User Not Exist !! Please Register...')
        res.redirect('/')
    }
})

//register
router.get('/register', (req, res) =>{
    res.render('auth/register',{layout: 'auth/register', errMessage: req.flash('err_message')})
})

router.post('/register', async(req, res) =>{
    console.log(req.body)
    //password changed to hash
    const salt = await bcrypt.genSalt(10)
    const hashedPw = await bcrypt.hash(req.body.password, salt)

    const user = new Register({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: hashedPw
    })
    console.log('hashed Password:',hashedPw)
    
    try{
        const savedUser = await user.save();
        res.redirect('/')
    }
    catch(error){
        req.flash('err_message','Unable to Register !! Try Again...')
        console.log(error)
    }

})

module.exports = router;
