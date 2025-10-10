const readBooks = require('./callback.js');

const books = [
    { name: 'LOTR', timeSpent: 3000 },
    { name: 'Fidas', timeSpent: 2000 },
    { name: 'Kalkulus', timeSpent: 4000 },
    { name: 'Komik', timeSpent: 1000 },
];

const totalTime = 10000;

function readBooksInSequence(time, bookIndex) {
    if (bookIndex >= bookIndex.length || time <= 0) {
        console.log('\nProses membaca selesai.');
        return;
    }

    const currentBook = books[bookIndex];
    readBooks(time, currentBook, (remainingTime) => {
        readBooksInSequence(remainingTime, bookIndex + 1);
});

}



console.log('Memulai proses membaca buku...');
readBooksInSequence(totalTime, 0);