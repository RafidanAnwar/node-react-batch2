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


const createCategory = async (req, res) => {
    let { name } = req.body;
    try {
        const categoryCreate = await prisma.category.create({
            data: {
                name
            },
        });

        // Menggunakan status 201 "Created" lebih tepat
        res.status(201).json({
            info: categoryCreate,
            message: "Category berhasil dibuat",
            status: "Success"
        });
    } catch (err) {
        handleHttpError(res, err, "Category gagal dibuat");
    }
};

const readCategory = async (req, res) => {
    try {
        const categoryRead = await prisma.category.findMany();
        res.status(200).json({
            info: categoryRead,
            message: "Category berhasil diambil",
            status: "Success"
        });
    } catch (err) {
        handleHttpError(res, err, "Category gagal diambil");
    }
};


const readCategoryById = async (req, res) => {
    let { id } = req.params;
    try {
        const categoryRead = await prisma.category.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (categoryRead) {
            // Langsung kirim respon jika ditemukan
            res.status(200).json({
                info: categoryRead,
                message: "Category berhasil diambil",
                status: "Success"
            });
        } else {
            // Kirim 404 jika tidak ditemukan
            res.status(404).json({
                info: null,
                message: "Category tidak ditemukan",
                status: "Not Found"
            });
        }
    } catch (err) {
        handleHttpError(res, err, "Category gagal diambil");
    }
};


const updateCategory = async (req, res) => {
    // 2. Memperbaiki logika: Kategori seharusnya punya 'name', bukan 'title' atau 'year'
    let { name } = req.body;
    let { id } = req.params;

    try {
        const categoryUpdate = await prisma.category.update({
            where: {
                id: Number(id),
            },
            data: {
                name // Menggunakan 'name'
            },
        });

        res.status(200).json({
            info: categoryUpdate,
            message: "Category berhasil diperbarui",
            status: "Success"
        });
    } catch (err) {
        // 3. Error handling yang lebih baik
        handleHttpError(res, err, "Category gagal diperbarui");
    }
};

const deleteCategory = async (req, res) => {
    let { id } = req.params;
    try {
        await prisma.category.delete({
            where: {
                id: Number(id),
            },
        });

        res.status(200).json({
            info: null,
            message: "Category berhasil dihapus",
            status: "Success"
        });

    } catch (err) {
        // 3. Error handling yang lebih baik
        handleHttpError(res, err, "Category gagal dihapus");
    }
};

module.exports = { createCategory, readCategory, readCategoryById, updateCategory, deleteCategory };
