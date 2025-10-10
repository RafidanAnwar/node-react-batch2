const readBooksPromise = require('./promise.js');

const books = [
    { name: 'LOTR', timeSpent: 3000 },
    { name: 'Fidas', timeSpent: 2000 },
    { name: 'Kalkulus', timeSpent: 4000 },
];

async function readAllBooks() {
    let sisaWaktu = 10000;
    console.log('Memulai proses membaca buku...');

    for ( const book of books) {
        try {
            sisaWaktu = await readBooksPromise(sisaWaktu, book);
        } catch (waktuHabis) {
            console.log(`\nProses membaca berhenti karena waktu tidak cukup.`);
            console.log(`Siswa waktu terakhir: ${waktuHabis} ms.`);
            break;
        }
    }
    console.log('\nSemua buku telah berhasil dibaca.');
}
readAllBooks();