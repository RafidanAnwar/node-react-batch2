function readBooksPromise(time, book) {
    console.log(`Saya mulai membaca "${book.name}"`);
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            let timeSpent = book.timeSpent;
            if (time >= timeSpent) {
                let sisaWaktu = time - timeSpent;
                console.log(`saya sudah selesai membaca ${book.name}, sisa waktu saya ${sisaWaktu}`);
                resolve(sisaWaktu);
            } else {
                console.log(`saya tidak punya waktu untuk bacaa ${book.name}`);
                reject(time);
            }
        }, book.timeSpent);
    });
}

module.exports = readBooksPromise;