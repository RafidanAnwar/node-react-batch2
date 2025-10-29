const basicAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // 1. Cek jika header ada dan menggunakan format 'Basic'
        if (!authHeader || !authHeader.startsWith('Basic ')) {
            res.setHeader('WWW-Authenticate', 'Basic realm="Protected Area"');
            return res.status(401).json({
                info: null,
                message: "Akses ditolak. Header Basic Auth tidak ada atau salah format.",
                status: "Unauthorized"
            });
        }

        // 2. Ambil token base64
        const base64Credentials = authHeader.split(' ')[1];
        if (!base64Credentials) {
            res.setHeader('WWW-Authenticate', 'Basic realm="Protected Area"');
            return res.status(401).json({
                info: null,
                message: "Kredensial Basic Auth kosong.",
                status: "Unauthorized"
            });
        }
        
        // 3. Decode base64 dan pisahkan user:pass
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [user, pass] = credentials.split(':');

        // 4. Ambil kredensial aman dari .env
        const basicUser = process.env.BASIC_AUTH_USER;
        const basicPass = process.env.BASIC_AUTH_PASSWORD;

        // 5. Cek jika variabel .env ada
        if (!basicUser || !basicPass) {
            console.error("Error: Kredensial Basic Auth (BASIC_AUTH_USER/PASSWORD) belum diatur di .env");
            return res.status(500).json({
                info: null,
                message: "Error konfigurasi server.",
                status: "Server Error"
            });
        }

        // 6. Validasi kredensial
        if (user === basicUser && pass === basicPass) {
            next(); // Sukses, lanjut ke controller
        } else {
            // Kredensial salah
            res.setHeader('WWW-Authenticate', 'Basic realm="Protected Area"');
            return res.status(401).json({
                info: null,
                message: "Username atau password Basic Auth salah.",
                status: "Unauthorized"
            });
        }
    } catch (error) {
        // Menangkap error jika base64 tidak valid atau split gagal
        console.error("Basic Auth Error:", error.message);
        res.setHeader('WWW-Authenticate', 'Basic realm="Protected Area"');
        return res.status(401).json({
            info: null,
            message: "Kredensial tidak valid atau format salah.",
            status: "Bad Request"
        });
    }
};

module.exports = { basicAuth };
