const express = require('express')
const router = express.Router()
const session = require('express-session')
const Student = require('../model/student')
const Course = require('../model/course')
const FeedBack = require('../model/feedback')
const multer = require('multer')

//middleware for authentication
const middleware = function (req, res, next) {
    if (req.session.userLoggedIn) {
        next()
    }else{
        return res.redirect('/')
    }
    
}

//image upload using multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    //reject a file that
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 3
    },
    fileFilter: fileFilter,

});

//*******STUDENT********* */
//home
router.get('/home',middleware,async (req, res) => {
    // console.log(req.session,'session')
    //find all courses and set in to dropdown
    const courses = await Course.find({}).select({ course: 1 })
    return res.render('student/addStudent', {succMessage: req.flash('succ_msg'), errMessage: req.flash('err_msg'),courses })
})

//submitting studets details to db
router.post('/student',upload.single('photo') ,async (req, res) => {
    console.log(req.file)
    const imagePath = req.file.path.split("\\")[1]
    console.log(imagePath)
    const student = new Student(
        { fname: req.body.fname,
        lname: req.body.lname,
        dob: req.body.dob,
        email: req.body.email,
        phone: req.body.phone,
        course: req.body.course,
        address: req.body.address,
        photo: req.file.path.split("\\")[1]
     }
        // req.body
    );
    try {
        const saveStudent = await student.save();
        req.flash('succ_msg', 'Student Added Successfully...');
        res.redirect('/app/home');
    } catch (error) {
        req.flash('err_msg', 'Error Occured..!!!')
        console.log(error);
    }
})

//list all students
router.get('/student',middleware, async (req, res) => {
    const students = await Student.find({});
    res.render('student/studentList', { students, succMessage: req.flash('succ_message') })
})

//edit student
router.get('/getStudent/:id', async (req, res) => {
    // const id = req.params.id;
    const studentData = await Student.findById({ _id: req.params.id })
    console.log(studentData)
    res.render('student/editStudent', { studentData })
})

router.post('/editStudent/:id', upload.single('photo'), async (req, res) => {
    await Student.findByIdAndUpdate({ _id: req.params.id }, {
        $set: {
            fname: req.body.fname,
            lname: req.body.lname,
            dob: req.body.dob,
            email: req.body.email,
            phone: req.body.phone,
            course: req.body.course,
            address: req.body.address,
            photo: req.file.path.split("\\")[1]
        }

        //passig edited data in sigle line
        // $set:req.body
    })
    req.flash('succ_message', 'Student Updated Successfully')
    res.redirect('/app/student')
})

//delete student by id
router.get('/deleteStudent/:id', (req, res) => {
    const id = req.params.id;
    Student.findByIdAndDelete(id).then(data => {
        if (!data) {
            res.send({ message: 'coudld not delete !!!' })
        }
        else {
            req.flash('succ_message', 'Student Deleted Successfully...')
            res.redirect('/app/student')
        }
    })
})


//****************COURSE********* */

//add course
router.post('/course', async (req, res) => {
    console.log(req.body)
    const course = new Course({
        course: req.body.course,
        duration: req.body.duration,
        description: req.body.description
    });
    try {
        const saveCourse = await course.save();
        req.flash('succ_msg', 'Course Added Successfully...')
        res.redirect('/app/course')
    } catch (error) {
        req.flash('err_msg', 'Error Occured..!!!')
        console.log(error);
    }
})

//view course list
router.get('/course',middleware, async (req, res) => {
    const courses = await Course.find({});
    res.render('course/courseList', { courses, succMessage: req.flash('succ_msg'), errMessage: req.flash('err_msg') })
})

//delete course by id
router.get('/deleteCourse/:id', (req, res) => {
    const id = req.params.id;
    Course.findByIdAndDelete(id).then(data => {
        if (!data) {
            res.send('Could not Delete..!!!')
        }
        else {
            req.flash('succ_msg', 'Course Deleted Successfully...')
            res.redirect('/app/course')
        }
    })
})

//update course
router.get('/getCourse/:id', async (req, res) => {
    try {
        const course = await Course.findById({ _id: req.params.id })
        res.json({ course })
    }
    catch (error) {
        console.log(error)
    }
})

router.post('/editCourse', async (req, res) => {
    const id = req.body.courseId  // this id accessed from the hidden field of modal
    await Course.findByIdAndUpdate({ _id: id }, {
        $set: {
            course: req.body.course,
            duration: req.body.duration,
            description: req.body.description
        }
    })
    req.flash('succ_msg', 'Course Details Updated Successfully')
    res.redirect('/app/course')
})

//*********FeedBack********************/

router.get('/feedback',middleware, (req, res) =>{
    res.render('feedback/feedback', {succMessage: req.flash('succ_msg'), errMessage: req.flash('err_msg')})
})

//add feedback to db
router.post('/feedback',middleware, async (req, res) =>{
     const user = await req.session.user; //this value is getting from loggin route
     const feedback = new FeedBack({
         name: req.body.name,
         email: req.body.email,
         feedback: req.body.feedback,
         userId: user._id

         //it create an object of the logined userdetails inside feedback table(change type=Object of userId in feedback model)
        //  userId: user
     })
     try {
        const saved = await feedback.save();
        req.flash('succ_msg', 'Feedback Added Successfully...')
        res.redirect('/app/feedback')
    } catch (error) {
        req.flash('err_msg', 'Error Occured..!!!')
        console.log(error);
    }   
})


//example of aggregate fn (lookup)
router.get('/feedbacks',async(req,res)=>{
    const feedback = await FeedBack.aggregate([
        {
            $addFields:{ userID: { $toObjectId :"$userId"} }
        },
        {
            $lookup:{
                from: 'registers',
                localField: 'userID',
                foreignField: '_id',
                as: 'userdata'
            }
        }
    ])
    res.send(feedback)
})


module.exports = router;