function filterBooksPromise(colorful, amountofPage) {
    return new Promise(function(resolve, reject) {
        var books = [
            { name: "shincan", totalPage: 50, isColorful: true },
            { name: "Kalkulus", totalPage: 250, isColorful: false },
            { name: "doraemon", totalPage: 50, isColorful: true },
            { name: "algoritma", totalPage: 250, isColorful: false },
        ];

        if (amountofPage >= 40) {
            let filteredBooks = books.filter(
                x => x.totalPage == amountofPage && x.isColorful == colorful
            );
            resolve(filteredBooks);
        } else {
            var reason = new Error("Maaf buku di bawah 40 halaman tidak tersedia");
            reject(reason);
        }
    });
}

module.exports = filterBooksPromise;