// soal 1
function hitungPersegi(sisi) {
    const luas = () => {
        return sisi * sisi;
    };

    const keliling = () => {
        return 4 * sisi;
    };

    return {
        luas: luas,
        keliling: keliling
    };
}

function hitungPersegiPanjang(panjang, lebar) {
    const luas = () => {
        return panjang * lebar;
    };

    const keliling = () => {
        return 2 * (panjang + lebar);
    };

    return {
        luas: luas,
        keliling: keliling
    };
}

const kalkulatorPersegi = hitungPersegi(8);
console.log("--- Persegi dengan sisi 8 ---");
console.log("luas:", kalkulatorPersegi.luas());
console.log("Keliling:", kalkulatorPersegi.keliling());
console.log("\n");

const kalkulatorPersegiPanjang = hitungPersegiPanjang(12, 7);
console.log("--- Persegi Panjang dengan panjang 12 dan lebar 7 ---");
console.log("Luas:", kalkulatorPersegiPanjang.luas());
console.log("keliling:", kalkulatorPersegiPanjang.keliling());

// soal 2
function hitungKubus(sisi) {
    const volume = () => {
        return sisi * sisi * sisi;
    };

    const luasPermukaan = () => {
        return 6 * (sisi * sisi);
    };

    return {
        volume,
        luasPermukaan
    };
}

function hitungBalok(panjang, lebar, tinggi) {
    const volume = () => {
        return panjang * lebar * tinggi;
    };

    const luasPermukaan = () => {
        return 2 * ((panjang * lebar) + (panjang & tinggi) + (lebar * tinggi));
    };

    return {
        volume,
        luasPermukaan
    };
}

const kalkulatorKubus = hitungKubus(8);
console.log("--- Kubus dengan sisi 8 ---");
console.log("Volume:", kalkulatorKubus.volume());
console.log("Luas Permukaan:", kalkulatorKubus.luasPermukaan());
console.log("\n");

const kalkulatorBalok = hitungBalok(12, 7, 5);
console.log("--- balok dengan p=12, l=7, t=5 ---");
console.log("Volume:", kalkulatorBalok.volume());
console.log("Luas Permukaan:", kalkulatorBalok.luasPermukaan());

var people = [
    {name: "John", job: "Programmer", gender: "male", age:30},
    {name: "Sarah", job: "Model", gender: "female", age:27},
    {name: "Jack", job: "Engineer", gender: "male", age:25},
    {name: "Ellie", job: "Designer", gender: "female", age:35},
    {name: "Danny", job: "Footballer", gender: "male", age:30},
];

const peopleUrut = people.sort((a, b) => a.age - b.age);

function tampilkanNamaUrut(data, index = 0) {
    if (index >= data.length) {
        return;
    }

    console.log(`${index + 1}. ${data[index].name}`);
    tampilkanNamaUrut(data, index + 1);
}

console.log("--- Urutan Nama Berdasarkan Umur ---");
tampilkanNamaUrut(peopleUrut);

// soal 4
var phones = [
    {
        name: "Samsung Galaxy A52",
        brand: "samsung",
        year: 2021,
        colors: ["black", "white"],
    },
    {
        name: "Redmi Note 10 Pro",
        brand: "Xiaomi",
        year: 2021,
        colors: ["white", "blue"],
    },
    {
        name: "Redmi Note 9 Pro",
        brand: "Xiaomi",
        year: 2020,
        colors: ["white", "blue", "black"],
    },
    {
        name: "Iphone 12",
        brand: "Apple",
        year: 2020,
        colors: ["silver", "gold"],
    },
    {
        name: "Iphone 11",
        brand: "Apple",
        year: 2019,
        colors: ["gold", "black", "silver"],
    },
];

const blackPhones = phones.filter((phone) => phone.colors.includes("black"));
const sortedBlackPhones = blackPhones.sort((a, b) => a.year - b.year);

function tampilkanPhone(data, index = 0) {
    if (index >= data.length) {
        return;
    }

    const phone = data[index];

    console.log(`${index + 1}. ${phone.name}, colors available : ${phone.colors.join(", ")}`);
    tampilkanPhone(data, index + 1);
}

console.log("--- filter black phone ---");
tampilkanPhone(sortedBlackPhones);