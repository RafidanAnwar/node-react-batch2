// soal 1
const express = require('express');
const app = express();
const port = 3000;

// Membuat route GET sesuai permintaan soal
app.get('/lingkaran-tabung/:jari/:tinggi', (req, res) => {
    const jari = parseFloat(req.params.jari);
    const tinggi = parseFloat(req.params.tinggi);

    const pi = Math.PI;

    const luasAlas = pi * Math.pow(jari, 2);
    const kelilingAlas = 2 * pi * jari;
    const volumeTabung = luasAlas * tinggi;

    const responseText = `
        jariJari : ${jari}, 
        tinggi: ${tinggi}, 
        volume tabung : ${volumeTabung.toFixed(2)}, 
        luas alas tabung : ${luasAlas.toFixed(2)}, 
        keliling alas tabung : ${kelilingAlas.toFixed(2)}
    `;

    res.send(responseText);
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});

// soal 2
// Data dari soal
const dataOrang = [
    {id: 1, name: "John", umur: 30, pekerjaan: "Penulis", jenisKelamin: "L"},
    {id: 4, name: "Benzema", umur: 34, pekerjaan: "Pemain Bola", jenisKelamin: "L"},
    {id: 5, name: "Sarah", umur: 27, pekerjaan: "Model", jenisKelamin: "P"},
    {id: 9, name: "Shohei Ohtani", umur: 28, pekerjaan: "Pemain Baseball", jenisKelamin: "L"},
    {id: 11, name: "Maria Sharapova", umur: 35, pekerjaan: "Petenis", jenisKelamin: "P"}
];


app.get('/data-orang', (req, res) => {
    const { umur, gender } = req.query;

    let filteredData = dataOrang;

    if (umur) {
        filteredData = filteredData.filter(orang => orang.umur >= parseInt(umur));
    }

    if (gender) {
        filteredData = filteredData.filter(orang => orang.jenisKelamin.toLowerCase() === gender.toLowerCase());
    }

    if (filteredData.length === 0) {
        res.send("Data tidak ditemukan.");
    } else {
        const hasilFormatted = filteredData.map((orang, index) => {
            return `${index + 1}. ${orang.name} - Pekerjaan: ${orang.pekerjaan} - Umur: ${orang.umur} Tahun`;
        }).join('\n'); 

        res.type('text/plain').send(hasilFormatted);
    }
});

// soal 3
// Membuat route GET dengan path "/data-orang/:id" untuk soal 3
app.get('/data-orang/:id', (req, res) => {

    const idToFind = parseInt(req.params.id);

    const orangDitemukan = dataOrang.find(orang => orang.id === idToFind);

    if (orangDitemukan) {
        const responseText = `Pak ${orangDitemukan.name} adalah seorang ${orangDitemukan.pekerjaan} yang berusia ${orangDitemukan.umur} tahun`;
        res.send(responseText);
    } else {
                res.status(404).send("Maaf data tidak ditemukan");
    }
});