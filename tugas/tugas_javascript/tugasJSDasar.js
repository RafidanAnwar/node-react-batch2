// soal 1
var perkenalan = 'Nama saya adalah';
var nama = "Rafidan Anwar";
var kata1 = "saya";
var kata2 = "berharap";
var kata3 = "untuk";
var kata4 = "menjadi";
var kata5 = "seorang";
var kata6 = "software";
var kata7 = "engineer";

var kalimatLengkap = `${perkenalan} ${nama}. ${kata1} ${kata2} ${kata3} ${kata4} ${kata5} ${kata6} ${kata7}`

console.log(kalimatLengkap);

// soal 2
var abjad = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var angka = "0123456789";

var password1 = abjad[19] + abjad[4] + abjad[18] + abjad[19] + angka[1] + angka[2] + angka[3];

var password2 = abjad[1] + angka[3] + abjad[1] + angka[3] + abjad[10];

var password3 = abjad[17] + angka[4] + abjad[7] + angka[4] + angka[5] + angka[1] + angka[4];

console.log("password ke satu : " + password1);
console.log("password ke dua : " + password2);
console.log("password ke tiga : " + password3);

//soal 3
var sentence2 = 'wow javaScript is so cool';
var exampleFirstword2 = sentence2.substring(0,3);
var secondword2 = sentence2.substring(4,14);
var thirdword2 = sentence2.substring(15,17);
var fourthword2 = sentence2.substring(18, 20);
var fifthword2 = sentence2.substring(21,25);

console.log('First Word: ' + exampleFirstword2);
console.log('Second Word: ' + secondword2);
console.log('Third Word: ' + thirdword2);
console.log('Fourth Word: ' + fourthword2);
console.log('Fifth Word: ' + fifthword2);

//soal 4
var sentence3 = 'wow JavaScript is so cool';

var exampleFirstWord3 = sentence3.substring(0, 3);
var secondWord3 = sentence3.substring(4, 14);
var thirdWord3 = sentence3.substring(15, 17);
var fourthWord3 = sentence3.substring(18, 20);
var fifthWord3 = sentence3.substring(21, 25);

var firstWordLength = exampleFirstWord3.length;
var secondWordLength = secondWord3.length;
var thirdWordLength = thirdWord3.length;
var fourthWordLength = fourthWord3.length;
var fifthWordLength = fifthWord3.length;

console.log('First Word: ' + exampleFirstWord3 + ', with length: ' + firstWordLength);
console.log('Second Word: ' + secondWord3 + ', with length: ' + secondWordLength);
console.log('Third Word: ' + thirdWord3 + ', with length: ' + thirdWordLength);
console.log('Fourth Word: ' + fourthWord3 + ', with length: ' + fourthWordLength);
console.log('Fifth Word: ' + fifthWord3 + ', with length: ' + fifthWordLength);

//soal 5

var kode1 = abjad.indexOf("H") + "-" + abjad.indexOf("E") + "-" + abjad.indexOf("L") + "-" + abjad.indexOf("L") + "-" + abjad.indexOf("O");
console.log("kode 1: " + kode1);

var kode2 = abjad.indexOf("W") + "-" + abjad.indexOf("O") + "-" + abjad.indexOf("R") + "-" + abjad.indexOf("L") + "-" + abjad.indexOf("D");
console.log("kode 2: " + kode2);

var kode3 = abjad.indexOf("I") + "-" + abjad.indexOf("M") + "-" + abjad.indexOf("R") + "-" + abjad.indexOf("E") + "-" + abjad.indexOf("A") + "-" + abjad.indexOf("D") + "-" + abjad.indexOf("Y");
console.log("kode 3: " + kode3); 

// soal 6
var pertama = "saya";
var kedua = "senang";
var ketiga = "belajar";
var keempat = "javascript";

var hasilPertama = pertama.charAt(0).toUpperCase() + pertama.substring(1);

var hasilKedua = kedua.charAt(0).toUpperCase() + 
                 kedua.substring(1, kedua.length - 1) + 
                 kedua.charAt(kedua.length - 1).toUpperCase();

var hasilKetiga = ketiga.charAt(0).toUpperCase() + 
                  ketiga.substring(1, ketiga.length - 1) + 
                  ketiga.charAt(ketiga.length - 1).toUpperCase();

var hasilKeempat = keempat.toUpperCase();

var kalimatHasil = `${hasilPertama} ${hasilKedua} ${hasilKetiga} ${hasilKeempat}`;

console.log(kalimatHasil); 

// soal 7
var panjangStr = "12";
var lebarStr = "7";
var alasStr = "6";
var tinggiStr = "13";

var panjang = parseInt(panjangStr);
var lebar = parseInt(lebarStr);
var alas = parseInt(alasStr);
var tinggi = parseInt(tinggiStr);

var luasPersegiPanjang = panjang * lebar;

var luasSegitiga = 0.5 * alas * tinggi;

console.log("Luas Persegi Panjang adalah:", luasPersegiPanjang);
console.log("Luas Segitiga adalah:", luasSegitiga);

// soal 8
var sisiDenganSpasi = "1 2 ";

var sisiString = sisiDenganSpasi.replaceAll(' ', ''); 
var sisi = Number(sisiString); 

var luasPersegi = sisi * sisi;

console.log("Luas Persegi adalah:", luasPersegi);

var jariJariString = "7.5";

var jariJari = parseFloat(jariJariString); 

var luasLingkaran = Math.PI * jariJari * jariJari;

console.log("Luas Lingkaran adalah:", luasLingkaran);
