class Person
{
    constructor(name)
    {
        this.name=name;
    }
}
class Student extends Person
{
    
    #studentID;
    #grade;
    constructor(name,studentID,grade)
    {
        super(name);
        this.#studentID=studentID;
        this.#grade=grade;
    }
    get studentID()
    {
        return this.#studentID;
    }
}