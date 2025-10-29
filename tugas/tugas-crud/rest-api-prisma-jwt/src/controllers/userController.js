// 1. Mengimpor instance prisma yang sudah ada dari file config
const prisma = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Helper function untuk menangani error HTTP
 * @param {object} res - Objek respons Express
 * @param {object} error - Objek error yang ditangkap
 * @param {string} defaultMessage - Pesan default jika error tidak spesifik
 * @param {number} statusCode - Kode status HTTP default
 */
// (Catatan: Anda dapat mengekstrak ini ke file helper terpisah jika mau)
const handleHttpError = (res, error, defaultMessage, statusCode = 500) => {
    console.error(error.message); // Selalu log error untuk debugging

    // Jika Prisma error "Unique constraint failed"
    if (error.code === 'P2002') {
        return res.status(409).json({ // 409 Conflict
            info: null,
            message: "Email sudah terdaftar",
            status: "Conflict"
        });
    }

    // Error server umum
    return res.status(statusCode).json({
        info: null,
        message: defaultMessage || 'Terjadi kesalahan pada server',
        status: "Error"
    });
};


const register = async (req, res) => {
    let { email, name, password } = req.body;

    try {
        // Cek dulu apakah email sudah ada
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (user) {
            return res.status(409).json({
                info: null,
                message: 'Email sudah terdaftar',
                status: "Conflict"
            });
        }

        // Jika email belum ada, lanjutkan registrasi
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword
            }
        });

        res.status(201).json({
            // Jangan kirim password kembali
            info: { id: newUser.id, email: newUser.email, name: newUser.name },
            message: "User berhasil dibuat",
            status: "Success"
        });

    } catch (err) {
        handleHttpError(res, err, "User gagal dibuat");
    }
    // 4. Menghapus '}' ekstra yang ada di sini
};

const login = async (req, res) => {
    let { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        // Cek apakah user ada DAN password cocok
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ // 401 Unauthorized
                info: null,
                message: 'Email atau password salah',
                status: "Invalid"
            });
        }

        // Jika berhasil, buat token
        // 6. Menyimpan id dan email di token, dan menambah masa berlaku
        const payload = {
            userId: user.id,
            email: user.email
        };

// Buat token
    const accessToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } 
    );

    // Kirim respons sebagai OBJEK dengan properti "token"
    res.status(200).json({
        info: { id: user.id, email: user.email, name: user.name },
        token: accessToken, // <--- INI YANG DICARI FRONTEND
        message: "Login berhasil",
        status: "Success"
    });

    } catch (err) {
        // 3. Menambahkan error handling di login
        handleHttpError(res, err, "Proses login gagal");
    }
};

module.exports = { register, login };
