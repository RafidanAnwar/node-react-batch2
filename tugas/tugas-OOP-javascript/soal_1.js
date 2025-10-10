// soal 1.a
class Animal {
    constructor(name) {
        this._name = name;
        this._leg = 4;
        this._cold_blooded = false;
    }

    get name() {
        return this._name;
    }

    get legs() {
        return this._leg;
    }

    get cold_blooded() {
        return this._cold_blooded;
    }
 }

var sheep = new Animal("shaun");

console.log(sheep.name);
console.log(sheep.legs);
console.log(sheep.cold_blooded);
sheep.legs = 3;
console.log(sheep.legs);
console.log("-----------------------")

// soal 1.b
class Ape extends Animal {
    constructor(name) {
        super(name);
        this._legs = 2;
    }

    yell() {
        console.log("Auooo");
    }
}

class Frog extends Animal {
    constructor(name) {
        super(name);
    }

    jump() {
        console.log("hop hop");
    }
}

var sungokong = new Ape("Kera sakti");
sungokong.yell();
console.log(sungokong.name);
console.log(sungokong.legs);
console.log(sungokong.cold_blooded);
console.log("--------------------------");

var kodok = new Frog("buduk");
kodok.jump();
console.log(kodok.name);
console.log(kodok.legs);
console.log(kodok.cold_blooded);