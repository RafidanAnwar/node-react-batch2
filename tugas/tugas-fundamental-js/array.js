// soal 1
var dataPeserta = ["john", "laki-laki", "programmer", "30"];

var output = `Halo, nama saya ${dataPeserta[0]}. saya ${dataPeserta[1]} berumur ${dataPeserta[3]} bekerja sebagai seorang ${dataPeserta[2]}.`;

console.log(output);

// soal 2

var sayuran = [];

sayuran.push("Kangkung");
sayuran.push("Bayam");
sayuran.push("Buncis");
sayuran.push("Kubis");
sayuran.push("Timun");
sayuran.push("Seledri");
sayuran.push("Tauge");

console.log(sayuran);

// soal 3
sayuran.sort();
for (let i = 0; i < sayuran.length; i++) {
    console.log(`${i + 1}. ${sayuran[i]}`);
}

// soal 4
var word = "car";
var subsets = [];

for (let i = 0; i < word.length; i++) {
    for (let j = i + 1; j <= word.length; j++) {
        subsets.push(word.slice(i, j));
    }
}

console.log(subsets);

// soal 5
var numbers = [4, 5, 1, 4, 6, 8, 9, 21];
var total = 0;

for (let i = 0; i < numbers.length; i++) {
    total += numbers[i];
}

console.log(total);

// soal 6
var kumpulanAngka = [
    [1, 3, 5, 7, 8, 9],
    [4, 5, 6, 2, 3, 1],
    [6, 7, 8, 1, 3, 5]
]

var hasil = [];

for (let i = 0; i < kumpulanAngka.length; i++) {
    let total = 0;
    for (let j = 0; j < kumpulanAngka[i].length; j++) {
        total += kumpulanAngka[i][j];
    }
    hasil.push(total);
} 

console.log(hasil);