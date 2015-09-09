function Person(name){
    this.name = name;
}

Person.prototype.getName = function(){
    console.log(this.name);
};

var personOne = new Person();
personOne.getName();