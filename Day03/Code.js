//Scope
//Global Scope
//Function Scope
//Block Scope
//Lexical Scope



//Global Scope    we can use this variable anywhere in the code
// let Course="Playwright"
// function displaycourse()
// {
//     console.log(Course)

// }
// displaycourse();
// console.log(Course);


//Function Scope    we can't use this variable outside the  function block
// function login()
// {
//     var admin="name"
//     console.log(admin)
// }
// login()
// console.log(admin);


//Block Scope        only use in block of scope
 
// if (true)
// {
//     let msg="Hii";
//     console.log("Inside the block", msg)
// }
// console.log("Outside the block",msg);

//Lexical scope

// let company="Sarathi Ai Labs"
// function outer1()
// {
//     let course ="Playwright"
//     function inner1()
//     {
//     console.log(company)
//     console.log(course)
//     }
//     inner1();
    
// }
// outer1();


//Closures

// function outer()
// {
//     let count=0;
//     function inner()
//     {
//         count++;
//         console.log(count);
//     }

//     return inner; 
// }
// const increment=outer();
// increment();
// increment();
// increment();
// increment();


//Classes

// class Student{
//       constructor(name,id){
//       this.name=name;
//       this.id=id;
//      }
//      study()
//      {
//         console.log(`${this.name} is write code`);
//      }
// }
// const s1=new Student("Ram",1);
// s1.study();
// console.log(s1.name);
// console.log(s1.id);

// const s2=new Student("Raj",2);
// s2.study();
// console.log(s2.name);
// console.log(s2.id)


//Encapsulation
// class BankAccount{
// #balance =1000;
// deposite(amount)
// {
//    this.#balance+= amount;
// }    
//   getBalance(){
//    return this.#balance;
//   }
// }
// const ac=new BankAccount();
// ac.deposite(200);
// console.log(ac.getBalance());   

//Inheritance
// class Animal
// {
//    eat()
//    {
//       console.log("Eating!!!!");
//    }
// } 
// class dog extends Animal{
//    bark()
//    {
//       console.log("Barking!!!!");
//    }
// }
// const d=new dog();
// d.eat();
// d.bark();

//Polymorphism

// class Animal{
//    sound()
//    {
//       console.log("Animal Sound");
//    }
// }
// class dog extends Animal 
// {
//    sound()

// {
//    console.log("Dog is barking");
// }}
// class cat extends Animal{
//    sound ()
//    {
//       console.log("Meow!!!!");
//    }
// }
// new dog().sound();
// new cat().sound();
// new Animal().sound();

//Abstraction

// class CoffeeMachine {

//     makeCoffee() {

//         this.#boilWater();
//         this.#addCoffee();
//         this.#addMilk();
//         this.#serveCoffee();

//     }

//     #boilWater() {
//         console.log("Boiling Water...🍵");
//     }

//     #addCoffee() {
//         console.log("Adding Coffee...🥄");
//     }

//     #addMilk() {
//         console.log("Adding Milk...🥛");
//     }

//     #serveCoffee() {
//         console.log("Coffee Ready ☕");
//     }

// }

// const coffee = new CoffeeMachine();

// coffee.makeCoffee();

// //Static 
// class Company{
//    static client ="Anu";
// }
// console.log(Company.client);

//getter
// class Employee {

//     constructor(name) {
//         this.name = name;
//     }

//     get employeeName() {
//         return this.name;
//     }
// }

// const emp = new Employee("Anu");

// console.log(emp.employeeName);

// //Setter
// class Employee1 {

//     set employeeName(value) {
//         this.name = value;
//     }
// }

// const emp1 = new Employee1();

// emp1.employeeName = "Anu";

// console.log(emp1.name);


// //Super
// class Animal {

//     constructor(name) {
//         this.name = name;
//     }
// }

// class Dog extends Animal {

//     constructor(name) {
//         super(name);
//     }
// }

// const dog = new Dog("Tommy");

// console.log(dog.name);

// //promises
// const promise = new Promise((resolve, reject) => {

//     let success = true;

//     if (success) {
//         resolve("Login Successful");
//     } else {
//         reject("Login Failed");
//     }
// });

// promise
//     .then(result => console.log(result))
//     .catch(error => console.log(error));


    //async/await



    //error handling
    try {

    let result = 10 / a;

    console.log(result);

} catch(error) {

    console.log("Error handled successfully");

}
finally{
    console.log("Finally block");
}

//Modular Programming (Import / Export)