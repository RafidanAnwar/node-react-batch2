// soal 1
const luasLingkaran = (jarijari) => {
    const PI = Math.PI;
    return PI * jarijari * jarijari;
};

const kelilingLingkaran = (jarijari) => {
    const PI = Math.PI;
    return 2 * PI * jarijari;
};

console.log("Luas Lingkaran (r=7):", luasLingkaran(7));
console.log("Keliling Lingkaran (r=7):", kelilingLingkaran(7));
console.log("\n");

// soal 2
const introduce = (...args) => {
    const [nama, umur, gender, profesi] = args;

    const panggilan = gender === "Laki-Laki" ? "Pak" : "Bu";

    return `${panggilan} ${nama} adalah seorang ${profesi} yang berusia ${umur} tahun`;
};

const perkenalanJohn = introduce("John", "30", "Laki-Laki", "penulis");
console.log(perkenalanJohn);

const perkenalanSarah = introduce("Sarah", "28", "Perempuan", "guru");
console.log(perkenalanSarah);
console.log("\n");

// soal 3
const newFunction = (firstName, lastName) => {
    return {
        firstName,
        lastName,
        fullName() {
            console.log(`${firstName} ${lastName}`);
        },
    };
};

console.log(newFunction("John", "Doe").firstName);
console.log(newFunction("Richard", "Roe").lastName);
newFunction("William", "Imoh").fullName();

// soal 4
let phone = {
    name: "Galaxy Note 20",
    brand: "Samsung",
    year: 2020,
    colors: ["Mystic Bronze", "Mystic White", "Mystic Black"],
};

const {
    brand: phoneBrand,
    name: phoneName,
    year, colors: [colorBronze, , colorBlack],
} = phone;

console.log(phoneBrand, phoneName, year, colorBlack, colorBronze);

// soal 5
let warna = ["biru", "merah", "kuning", "hijau"];
let dataBukuTambahan = {
    penulis: "john doe",
    tahunTerbit: 2020,
};

let buku = {
    nama: "pemrograman dasar",
    jumlahHalaman: 172,
    warnaSampul: ["hitam"],
};

const bukuLengkap = {
    ...buku,
    ...dataBukuTambahan,
    warnaSampul: [...buku.warnaSampul, ...warna],
};

console.log(bukuLengkap);

// soal 6
const addProducts = (data, newItems) => {
    return {
        ...data,
        products: [...data.products, ...newItems],
    };
};

let samsung = {
    name: "Samsung",
    products: [
        { name: "Samsung Galaxy Note 10", colors: ["black", "gold", "silver"] },
        { name: "Samsung Galaxy Note 10s", colors: ["blue", "silver"] },
        { name: "Samsung Galaxy Note 20s", colors: ["white", "black"] },
    ],
};

let newProducts = [
    { name: "Samsung Galaxy A52", colors: ["white", "black"] },
    { name: "Samsung Galaxy M52", colors: ["blue", "gray", "white"] },
];

samsung = addProducts(samsung, newProducts);

console.log(samsung);

// soal 7
const convertToObject = ([nama, domisili, umur]) => ({
    nama,
    domisili,
    umur,
});

let data = ["Bondra", "Medan", 25];
const dataObjek = convertToObject(data);

console.log(dataObjek);

// soal 8
const data1 = [
    { name: "Ahmad", class: "adonis" },
    { name: "Regi", class: "laravel" },
    { name: "Bondra", class: "adonis" },
    { name: "Iqbal", class: "vuejs" },
    { name: "Putri", class: "laravel" },
];

const data2 = [
    { name: "Yogi", class: "react" },
    { name: "FIkri", class: "agile" },
    { name: "Arief", class: "agile" },
];

const graduate = (...students) => {
    const result = {};

    for (const student of students) {
        const className = student.class;
        if (!result[className]) {
            result[className] = [];
        }
        result[className].push(student.name);
    }

    return result;
};

console.log(graduate(...data1));
console.log(graduate(...data2));