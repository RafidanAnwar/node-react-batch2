// soal 1
const sentence = "Saya Sangat Senang Sekali Belajar Programming dan Saya Juga Senang Belajar Javascript";

function categorizeStringLength(text) {
    if (typeof text !== 'string') {
        return "Input tidak valid";
    }

const length = text.length;

if (length > 30) {
    return "Panjang";
} else if (length >= 10) {
    return "Sedang";
} else { 
    return "Pendek";
}
}

const category = categorizeStringLength(sentence);
const sentenceLength = sentence.length;

console.log(`Kalimat: "${sentence}"`);
console.log(`Panjang Karakter: "${sentenceLength}"`);
console.log(`Kategori: "${category}"`);

// soal 2
const nilaiSiswa = 75;

function tentukanIndeksNilai(skor) {
    if (typeof skor !== 'number' || skor < 0 || skor > 100){
        return "Nilai tidak valid. Harap masukkan angka antara 0 dan 100.";
    }

if (skor >= 80) {
        return 'A';
    } else if (skor >= 70) {
        return 'B';
    } else if (skor >= 60) {
        return 'C';
    } else if (skor >= 50) {
        return 'D';
    } else {
        return 'E';
    }
}

const indeks = tentukanIndeksNilai(nilaiSiswa);

console.log(`Siswa dengan nilai ${nilaiSiswa} mendapatkan indeks: ${indeks}`);

console.log("\n--- Pengujian dengan nilai lain ---");
console.log(`Nilai 95 -> Indeks: ${tentukanIndeksNilai(95)}`);
console.log(`Nilai 62 -> Indeks: ${tentukanIndeksNilai(62)}`);
console.log(`Nilai 49 -> Indeks: ${tentukanIndeksNilai(49)}`);
console.log(`Nilai -10 -> Indeks: ${tentukanIndeksNilai(-10)}`);

// soal 3
const tanggal = 24;
const bulan = 9;
const tahun = 2003;

function getNamaBulan(nomorBulan) {
    let namaBulan;

    switch (nomorBulan) {
        case 1:
            namaBulan = "Januari";
            break;
        case 2:
            namaBulan = "Februari";
            break;
        case 3:
            namaBulan = "Maret";
            break;
        case 4:
            namaBulan = "April";
            break;
        case 5:
            namaBulan = "Mei";
            break;
        case 6:
            namaBulan = "Juni";
            break;
        case 7:
            namaBulan = "Juli";
            break;
        case 8:
            namaBulan = "Agustus";
            break;
        case 9:
            namaBulan = "September";
            break;
        case 10:
            namaBulan = "Oktober";
            break;
        case 11:
            namaBulan = "November";
            break;
        case 12:
            namaBulan = "Desember";
            break;
        default:
            namaBulan = "Bulan tidak valid";
            break;
    }
    return namaBulan;
}

const namaBulanDariAngka = getNamaBulan(bulan);
if (namaBulanDariAngka === "Bulan tidak valid") {
    console.log("Input bulan salah. Harap periksa kembali.");
} else {
    const tanggalLengkap = `${tanggal} ${namaBulanDariAngka} ${tahun}`;
    console.log(`Tanggal Lahir: ${tanggalLengkap}`);
}