//Arrow functions

// let add=(a,b)=>a+b//arrow function
// console.log(add(10,20))

// function add1(a,b){//normal function
//     return a+b 
// }
// console.log(add1(20,40))

//Template literals
// let name ="Anu"
// let id=14
// console.log("My name is :"+name) //concatination
// console.log(`My name is ${name} and My id is:${id}`)//using back ticks 

//Destructuring of oject
// let Student={
//     name:"Anu",
//     age:22,
//     city:"kolhapur"
// }
// let {name, city,age}= Student
// console.log(name)
// console.log(age)
// console.log(city)

// let {name:firstName, city:citynm,age:yourAge}= Student
// console.log(firstName)
// console.log(citynm)
// console.log(yourAge)//rename it

// //Destructuring of array
// let fruits=["Apple","Banana","Mango","Orange"]
// let[fruit,stfruit,ndfruit]=fruits
// console.log(fruit)
// console.log(stfruit)
// console.log(ndfruit)

//spread operator
// let arr1=[1,2,3]
// let arr2=[4,5,6]
//let arr3=[arr1,arr2] //it store array inside array
// arr4=[...arr1,...arr2]//it store elements of array in single array
// console.log(arr4)


// //Rest Operator
// function add(a,b,...test)
// {
//     console.log(a+b)
//     console.log(test)
// }
// add(10,20,30,40,50)



// //Optional chaining
// let Student={
//     name:"Anu",
//     age:22,
//     address:
//     {
//         city:"kolhapur",
//         pincode:416003
//     }
// }
// console.log(Student.address.city)

//Map()
 let num=[1,2,3,4,5,6,7,8,9,10]
let num1=num.map(n=>n*2)
console.log(num1)

// //filter
//  let num2=num.filter(n=>n%2===0)
//  console.log(num2)

//  let num3=num.filter(n=>n%2===1)
//  console.log(num3)

//reduce
let num4=num.reduce((acc,cv)=>acc+cv,0)
console.log(num4)