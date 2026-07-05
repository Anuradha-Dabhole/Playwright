// function addition(a: number,b: number)
// {
//     return a+b
// }
// let num1=2;
// let num2=3;
// console.log(typeof(addition(num1,num2)));
// console.log(addition(num1,num2));

// //we have to mention datatypes in typescript
// let user:String[]=["Anu"]
// let nm:Number=11;
// console.log(nm);

// //object
// let a:{
//     nm:string,
//     age:number
// }=
// {
//     nm:"Anu",
//     age:22

// };
// console.log(a.nm)

// //Interfaces
// interface userlogin
// {
//     name:string;
//     age:number;
// }
// let userinfo: userlogin ={
// name:"Anu",
// age:22
// }

//enums
enum UserRole{
    ADMIN="admin",
    MANAGER="manager",
    CUSTOMER="customer"
}
let use=UserRole.ADMIN

//Generics



//Type assertions
let value:unknown="Anuradha";
let name1=value as string;
console.log(name1.length)

let name2=<string>value;
console.log(name2.length)


//utility types
//interface userlogin
// {
//     name?:string;
//     age?:number;
//     nicknm:string;// it is madintory in below interface
// }
 
// let userinfo: userlogin ={
// name:"Anu",
// age:22
// }

