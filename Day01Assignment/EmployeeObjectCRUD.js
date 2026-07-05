
//Create
let student={
    rollNumber:42,
    name:"Amit Kumar",
    branch:"Computer Science",
    semester:5
};
//Read

console.log(`Student name: ${student.name}, Branch: ${student.branch}`);
//Update
console.log("Updating semester and adding hostel...");
student.semester=6
student.hostel="Boys Hostel A"

// //Delete
console.log("Deleting branch...");
delete student.branch
console.log("Final Student Object",student)
