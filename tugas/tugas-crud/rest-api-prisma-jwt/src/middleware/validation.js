/**
 * Middleware untuk memvalidasi body dari request 'create' dan 'update' movie.
 */
const validationBodyMovies = (req, res, next) => {
    const { title, year, categoryId } = req.body;
    const errors = [];

    // 1. Validasi Title
    if (!title || typeof title !== 'string' || title.trim() === '') {
        errors.push("Title wajib diisi dan harus berupa string yang valid.");
    }

    // 2. Validasi Year
    const numericYear = Number(year);
    if (!year) {
        errors.push("Year wajib diisi.");
    } else if (isNaN(numericYear)) {
        errors.push("Year harus berupa angka.");
    }

    // 3. Validasi CategoryId
    const numericCategoryId = Number(categoryId);
    if (!categoryId) {
        errors.push("categoryId wajib diisi.");
    } else if (isNaN(numericCategoryId)) {
        errors.push("categoryId harus berupa angka.");
    }

    // 4. Jika ada error, kirim respons 400
    if (errors.length > 0) {
        return res.status(400).json({
            info: { errors: errors }, // Kirim semua pesan error
            message: "Data yang dikirim tidak valid.",
            status: "Validation Error"
        });
    }

    // 5. Jika lolos, bersihkan data (opsional tapi bagus)
    // Ini memastikan data yang diteruskan ke controller sudah benar tipenya
    req.body.title = title.trim();
    req.body.year = numericYear;
    req.body.categoryId = numericCategoryId;

    next();
};

// Anda bisa menambahkan validator lain di sini, misal untuk Kategori atau User
// const validationBodyCategory = (req, res, next) => { ... }
// const validationBodyUser = (req, res, next) => { ... }

module.exports = {
    validationBodyMovies
    // , validationBodyCategory
    // , validationBodyUser
};
