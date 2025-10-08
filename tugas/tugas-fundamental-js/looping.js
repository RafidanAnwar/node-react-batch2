// soal 1
console.log("LOOPING PERTAMA");

let a = 2;
while (a <= 20) {
    console.log(a + " - I love coding");
    a += 2;
}

console.log("\nLOOPING KEDUA");

let j = 20;
while (j >= 2) {
    console.log(j + " - I will become a MERN Stack developer");
    j -= 2;
}

// soal 2
console.log("LOOPING ANGKA GANJIL & GENAP");
let i = 1;
while (i <= 20) {
    if (i % 2 === 0) {
        console.log(i + " - Angka Genap");
    } else {
        console.log(i + " - Angka Ganjil");
    }
    i++;
}

// soal 3
console.log("LOOPING SYARAT ANGKA");

for (let i = 1; i <= 20; i++) {
  if (i % 3 === 0 && i % 2 !== 0) {
    console.log(i + " - I Love Coding");
  } else if (i % 3 === 0 && i % 2 === 0) {
    console.log(i + " - ToT");
  } else if (i % 2 === 0) {
    console.log(i + " - Berkualitas");
  } else {
    console.log(i + " - Santai");
  }
}

// soal 4
console.log("SEGITIGA PAGAR (#)");

for (let i = 1; i <= 7; i++) {
    let pagar = "";
    for (let j = 1; j <= i; j++) {
        pagar += "#";
    }
    console.log(pagar);
}

// soal 5
console.log("MENAMPILKAN HURUF KONSONAN");

var sentence = "Fullstack Developer";
var vokal = ["a", "i", "u", "e", "o", "A", "I", "U", "E", "O"];

for (let i = 0; i < sentence.length; i++) {
    let huruf = sentence[i];

    if (!vokal.includes(huruf) && huruf !== " ") {
        console.log(huruf);
    }
}
