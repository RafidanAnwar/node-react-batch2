const dataBuah = [
    {
        nama: "Nanas",
        warna: "Kuning",
        adaBijinya: false,
        harga: 9000,
    },
    {
        nama: "Jeruk",
        warna: "Oranye",
        adaBijinya: true,
        harga: 8000,
    },
    {
        nama: "Semangka",
        warna: "Hijau & Merah",
        adaBijinya: true,
        harga: 1000,
    },
    {
        nama: "Pisang",
        warna: "Kuning",
        adaBijinya: false,
        harga: 5000,
    },
];

const buahTanpaBiji = dataBuah.filter(buah => buah.adaBijinya === false);
console.log(buahTanpaBiji);

// soal 2
var dataFilm = [];

function tambahdataFilm(nama, durasi, genre, tahun) {
    const filmBaru = {
        nama: nama,
        durasi: durasi,
        genre: genre,
        tahun: tahun
    };
    dataFilm.push(filmBaru);
}

tambahdataFilm("LOTR", "2 jam", "action", "1999");
tambahdataFilm("avenger", "2 jam", "action", "1999");
tambahdataFilm("spiderman", "2 jam", "action", "2004");
tambahdataFilm("juon", "2 jam", "horror", "2004");

console.log(dataFilm);

// soal 3
var people = [
    {name: "john", job: "Programmer", gender: "male", age: 30},
    {name: "Sarah", job: "Model", gender: "female", age: 27},
    {name: "jack", job: "Engineer", gender: "male", age: 25},
    {name: "Ellie", job: "Designer", gender: "female", age: 35},
    {name: "Danny", job: "Footballer", gender: "male", age: 30},
];

const filteredPeople = people.filter(person => person.gender === "male" && person.age > 29);
console.log(filteredPeople);

// soal 4
const totalAge = people.reduce((accumulator, currentPerson) => {
    return accumulator + currentPerson.age;
}, 0);

const averageAge = totalAge / people.length;

console.log(`Total usia: ${totalAge}`);
console.log(`Jumlah orang: ${people.length}`);
console.log(`Total usia: ${averageAge}`);

// soal 5
people.sort((a, b) => a.age - b.age);
console.log("Urutan data berdasarkan umur:");
people.forEach((person, index) => {
    console.log(`${index + 1}. ${person.name}`);
});


// soal 6
var phone = {
    name: "Samsung Galaxy Note 20",
    brand: "Samsung",
    colors: ["Black"],
    release: 2020,
};

function addColors(newColor) {
    phone.colors.push(newColor);
}

addColors("Gold");
addColors("Silver");
addColors("Brown");

console.log(phone);