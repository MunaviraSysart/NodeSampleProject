//passing value to course update modal for edit
console.log('course api......')
let editcourse = document.querySelectorAll(".updatecourse")
editcourse.forEach(element => {
    element.addEventListener('click', async function () {
        const id = this.getAttribute('data-id')
        console.log(id, 'id')
         const res = await fetch(`http://localhost:4000/app/getCourse/${id}`)
         console.log('res', res)
         const data = await res.json();
         console.log('data..',data)
         generateCourseEditModal(data)
         
    })
});

 const generateCourseEditModal = ({ course }) => {
    console.log(course)
    document.querySelector("#course").value = course.course
    document.querySelector("#duration").value = course.duration
    document.querySelector("#description").value = course.description 
    document.querySelector("#courseId").value = course._id 
   
}