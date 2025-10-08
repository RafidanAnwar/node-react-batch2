// soal 1
function introduce(nama, gender, pekerjaan, umur) {
    if (gender === "laki-laki") {
        return `Pak ${nama} adalah seorang ${pekerjaan} yang berusia ${umur} tahun`;
    } else if (gender === "perempuan") {
        return `Bu ${nama} adalah seorang ${pekerjaan} yang berusia ${umur} tahun`;
    } else {
        return `${nama} adalah seorang ${pekerjaan} yang berusia ${umur} tahun`;
    }
}

var john = introduce("John", "laki-laki", "penulis", "30");
console.log(john);

var sarah = introduce("Sarah", "perempuan", "model", "28");
console.log(sarah);

// soal 2 
function karakterUnik(text) {
    var hasil = "";
    text = text.toLowerCase();

    for (let i = 0; i < text.length; i++) {
        let huruf = text[i];
        if (text.indexOf(huruf) === text.lastIndexOf(huruf) && huruf !== " ") {
            hasil += huruf;
        }
    }
    return hasil;
}

var text = "Super Bootcamp Fullstack Dev 2022";
console.log(karakterUnik(text));

// soal 3
function cariTerbesarTerkecil(angka) {
    var terbesar = Math.max(...angka);
    var terkecil = Math.min(...angka);
    return `angka terbesar adalah ${terbesar} dan angka terkecil adalah ${terkecil}`;
}

var angka = [2, 3, 1, 9, 12, 8, 9, 7];
console.log(cariTerbesarTerkecil(angka));

// soal 4
function arrangeString(str) {
    return str.split('').sort().join('');
}

console.log(arrangeString("bahasa"));
console.log(arrangeString("similikiti"));
console.log(arrangeString("sanbercode"));
console.log(arrangeString(""));

// soal 5
function palindrome(kata) {
    let teks = kata.toLowerCase().replace(/\s/g, '');
    let dibalik = teks.split('').reverse().join('');
    return teks === dibalik;
}

console.log(palindrome('katak'));
console.log(palindrome('blanket'));
console.log(palindrome('nababan'));
console.log(palindrome('haji ijah'));
console.log(palindrome('mister'));

// soal 6
function angkaPalindrome(num) {
    while (true) {
        num++;

        let numStr = String(num);
        let reversedStr = numStr.split('').reverse().join('');

        if (numStr === reversedStr) {
            return num;
        }
    }
}

console.log(angkaPalindrome(8));
console.log(angkaPalindrome(10));
console.log(angkaPalindrome(117));
console.log(angkaPalindrome(175));
console.log(angkaPalindrome(1000));

// soal 7
function cekPermutasi(str1, str2) {
    if (str1.length !== str2.length) {
        return false;
    }

    let sortedStr1 = str1.split('').sort().join('');
    let sortedStr2 = str1.split('').sort().join('');

    return sortedStr1 === sortedStr2;
}

console.log(cekPermutasi("abah", "baha"));
console.log(cekPermutasi("ondel", "delon"));
console.log(cekPermutasi("paul sernine", "arsene lupin"));
console.log(cekPermutasi("taco", "taca"));