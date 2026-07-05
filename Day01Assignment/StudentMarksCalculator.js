const studentName="Priya Sharma"
let maths=85
let physics=78
let chemistry=92
let average=(maths+physics+chemistry)/3;
console.log("Student Name:",studentName);
console.log("Maths Marks:",maths);
console.log("Physics Marks:",physics);
console.log("Chemistry Marks:",chemistry);

console.log("Average Score:",average);
let grade;
if(average>=90)
{
    grade="Grade A"
}
else if(average>=80 && average<90)
{
    grade="Grade B"

}
else if(average>=70 && average<80)
{
    grade="Grade c"
}
else{
    grade="Grade F"
}
console.log("Grade Assigned:",grade)