const jwt = require('jsonwebtoken');

const authJWT = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');

        // 1. Cek jika header ada
        if (!authHeader) {
            return res.status(401).json({
                info: null,
                message: "Akses ditolak. Token tidak disediakan.",
                status: "Unauthorized"
            });
        }

        // 2. Cek format "Bearer [token]"
        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                info: null,
                message: "Format token tidak valid. Harus 'Bearer [token]'.",
                status: "Invalid Format"
            });
        }

        const token = authHeader.split(" ")[1];

        // 3. Cek jika token ada setelah split
        if (!token) {
            return res.status(401).json({
                info: null,
                message: "Token kosong.",
                status: "Unauthorized"
            });
        }

        // 4. Verifikasi token
        jwt.verify(token, process.env.JWT_SECRET, (err, userPayload) => {
            if (err) {
                let message = "Token tidak valid.";
                if (err.name === 'TokenExpiredError') {
                    message = "Token sudah kedaluwarsa. Silakan login kembali.";
                }

                return res.status(401).json({
                    info: null,
                    message: message,
                    status: "Unauthorized"
                });
            }

            // Sukses: Lampirkan payload user (berisi userId dan email) ke request
            req.user = userPayload;
            next();
        });

    } catch (error) {
        // Menangkap error sinkron (misalnya .split gagal)
        console.error("Auth Middleware Error:", error.message);
        return res.status(500).json({
            info: null,
            message: "Terjadi kesalahan internal pada server.",
            status: "Server Error"
        });
    }
};

module.exports = { authJWT };
