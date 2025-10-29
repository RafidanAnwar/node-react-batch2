// 1. Mengimpor instance prisma yang sudah ada dari file config
const prisma = require('../config/db');
/**
 * Helper function untuk menangani error HTTP
 * @param {object} res - Objek respons Express
 * @param {object} error - Objek error yang ditangkap
 * @param {string} defaultMessage - Pesan default jika error tidak spesifik
 * @param {number} statusCode - Kode status HTTP default
 */
const handleHttpError = (res, error, defaultMessage, statusCode = 500) => {
    console.error(error.message); // Selalu log error untuk debugging

    // Jika Prisma error "Record not found"
    if (error.code === 'P2025') {
        return res.status(404).json({
            info: null,
            message: "Data tidak ditemukan",
            status: "Not Found"
        });
    }

    // Error server umum
    return res.status(statusCode).json({
        info: null,
        message: defaultMessage || 'Terjadi kesalahan pada server',
        status: "Error"
    });
};


const createMovie = async (req, res) => {
    try {
        // 1. AMBIL DATA DARI BODY
        const { title } = req.body;
        const year = Number(req.body.year);
        const categoryId = Number(req.body.categoryId);

        // 2. AMBIL ID PENGGUNA DARI TOKEN (SETELAH MELEWATI MIDDLEWARE authJWT)
        // INI ADALAH BAGIAN YANG HILANG/SALAH PADA KODE ANDA
        const userId = req.user.userId;

        // Validasi sederhana (middleware validasi Anda juga melakukan ini)
        if (!title || !year || !categoryId || !userId) {
            return handleHttpError(res, "DATA_TIDAK_LENGKAP", 400, "Judul, Tahun, Kategori, dan User ID wajib diisi.");
        }

        // 3. BUAT MOVIE DENGAN MENYERTAKAN userId
        const movie = await prisma.movie.create({
            data: {
                title,
                year,
                categoryId,
                userId: userId, // <-- PASTIKAN BARIS INI ADA
            },
            include: {
                category: true, // Sertakan data kategori dalam respons
            }
        });

        res.status(201).json({
            info: movie,
            message: "Film berhasil dibuat",
            status: "Success"
        });

    } catch (e) {
        handleHttpError(res, "ERROR_CREATE_MOVIE", 500, e.message);
    }
};

const readMovie = async (req, res) => {
    try {
        // 1. Dapatkan parameter query, dengan nilai default
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5; // Tampilkan 5 item per halaman

        // 2. Hitung offset (data yang akan di-skip)
        const skip = (page - 1) * limit;

        // 3. Gunakan $transaction untuk 2 query sekaligus (efisien)
        const [movies, totalItems] = await prisma.$transaction([
            // Query pertama: ambil data film untuk halaman ini
            prisma.movie.findMany({
                skip: skip,
                take: limit,
                include: {
                    category: true, // Sertakan data kategori
                    user: { // Sertakan data user (hanya email dan nama)
                        select: { email: true, name: true }
                    }
                },
                orderBy: {
                    createdAt: 'desc' // Urutkan berdasarkan terbaru
                }
            }),
            // Query kedua: hitung total semua film
            prisma.movie.count()
        ]);

        // 4. Hitung total halaman
        const totalPages = Math.ceil(totalItems / limit);

        // 5. Kirim respons dengan format baru
        res.status(200).json({
            // Data film untuk halaman ini
            info: movies,
            // Informasi pagination untuk frontend
            pagination: {
                totalItems: totalItems,
                totalPages: totalPages,
                currentPage: page,
                pageSize: limit
            },
            message: "Film berhasil diambil",
            status: "Success"
        });
    } catch (e) {
        // Asumsi Anda memiliki helper 'handleHttpError' dari sebelumnya
        handleHttpError(res, "ERROR_READ_MOVIES", 500, e.message);
    }
};


const readMovieById = async (req, res) => {
    let { id } = req.params;
    try {
        const movieRead = await prisma.movie.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                category: true // 5. Menyertakan data kategori
            }
        });

        if (movieRead) {
            res.status(200).json({
                info: movieRead,
                message: "Movie berhasil diambil",
                status: "Success"
            });
        } else {
            res.status(404).json({
                info: null,
                message: "Movie tidak ditemukan",
                status: "Not Found"
            });
        }
    } catch (err) {
        handleHttpError(res, err, "Movie gagal diambil");
    }
};


const updateMovie = async (req, res) => {
    // Memperbarui data movie dengan semua data dari body
    let { title, year, categoryId } = req.body;
    let { id } = req.params;

    try {
        const movieUpdate = await prisma.movie.update({
            where: {
                id: Number(id),
            },
            data: {
                title,
                year: Number(year),
                categoryId: Number(categoryId)
            },
        });

        res.status(200).json({
            info: movieUpdate,
            message: "Movie berhasil diperbarui",
            status: "Success"
        });
    } catch (err) {
        handleHttpError(res, err, "Movie gagal diperbarui");
    }
};

const deleteMovie = async (req, res) => {
    let { id } = req.params;
    try {
        await prisma.movie.delete({
            where: {
                id: Number(id),
            },
        });

        res.status(200).json({
            info: null,
            message: "Movie berhasil dihapus",
            status: "Success"
        });

    } catch (err) {
        handleHttpError(res, err, "Movie gagal dihapus");
    }
};

module.exports = { createMovie, readMovie, readMovieById, updateMovie, deleteMovie };
