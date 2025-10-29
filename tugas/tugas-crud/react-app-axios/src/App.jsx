import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import './CRUDaxios.css';

// --- Konfigurasi Axios ---
const getAuthToken = () => {
    return localStorage.getItem('token');
}

const axiosSecure = axios.create({
    baseURL: 'http://localhost:3000/api',
});

axiosSecure.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const axiosPublic = axios.create({
    baseURL: 'http://localhost:3000/api',
});


// --- Komponen Halaman Login ---
function LoginPage({ onLoginSuccess, onSwitchToRegister }) {
    // ... (Tidak ada perubahan di sini, salin dari kode Anda sebelumnya) ...
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await axiosPublic.post('/login', { email, password });
            const token = response.data.token;
            if (token) {
                onLoginSuccess(token);
            } else {
                setError("Login gagal: Token tidak diterima.");
            }
        } catch (err) {
            console.error(err);
            setError("Login Gagal: Email atau password salah.");
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Login</h2>
                {error && <p className="error-message-auth">{error}</p>}
                <div className="input-group">
                    <label htmlFor="login-email">Email</label>
                    <input
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="auth-input"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="login-password">Password</label>
                    <input
                        id="login-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="auth-input"
                    />
                </div>
                <button type="submit" className="auth-button-primary">Login</button>
                <button type="button" onClick={onSwitchToRegister} className="auth-switch-button">
                    Belum punya akun? Register
                </button>
            </form>
        </div>
    );
}

// --- Komponen Halaman Register ---
function RegisterPage({ onSwitchToLogin }) {
    // ... (Tidak ada perubahan di sini, salin dari kode Anda sebelumnya) ...
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        try {
            await axiosPublic.post('/register', { name, email, password });
            setMessage("Registrasi berhasil! Silakan login.");
            setTimeout(() => {
                onSwitchToLogin();
            }, 2000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Registrasi gagal.");
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Register</h2>
                {error && <p className="error-message-auth">{error}</p>}
                {message && <p className="success-message-auth">{message}</p>}
                <div className="input-group">
                    <label htmlFor="reg-name">Name</label>
                    <input
                        id="reg-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="auth-input"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="reg-email">Email</label>
                    <input
                        id="reg-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="auth-input"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="reg-password">Password</label>
                    <input
                        id="reg-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="auth-input"
                    />
                </div>
                <button type="submit" className="auth-button-primary">Register</button>
                <button type="button" onClick={onSwitchToLogin} className="auth-switch-button">
                    Sudah punya akun? Login
                </button>
            </form>
        </div>
    );
}


// --- Komponen Halaman CRUD (dengan PAGINATION) ---

function CrudPage({ onLogout }) {
    const initialInput = { title: "", year: 2000, categoryId: 0, id: null };
    
    const [dataMovie, setDataMovie] = useState([]);
    const [dataCategory, setDataCategory] = useState([]);
    const [input, setInput] = useState(initialInput);
    const [error, setError] = useState(null);

    // --- State Baru untuk Pagination ---
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationInfo, setPaginationInfo] = useState({
        totalPages: 1,
        totalItems: 0,
        pageSize: 5
    });
    const pageSize = 5; // Samakan dengan 'limit' di backend

    // --- Fungsi Logika Data ---

    // useEffect HANYA untuk mengambil kategori (sekali saja)
    useEffect(() => {
        fetchDataCategory();
    }, []);

    // useEffect HANYA untuk mengambil film (setiap 'currentPage' berubah)
    useEffect(() => {
        fetchDataMovie();
    }, [currentPage]); // <-- Ini kuncinya

    const fetchDataMovie = () => {
        // Kirim 'page' dan 'limit' sebagai query params
        axiosPublic.get('/movie', {
            params: {
                page: currentPage,
                limit: pageSize
            }
        })
            .then((response) => {
                // Ambil data film dari 'info'
                setDataMovie(response.data.info || []);
                // Simpan data pagination
                setPaginationInfo(response.data.pagination || { totalPages: 1 });
            })
            .catch(err => {
                console.error("Error fetching movies:", err);
                if (err.message === 'Network Error') {
                    setError("Network Error: Gagal terhubung ke backend.");
                } else {
                    setError(`Gagal memuat data film: ${err.message}`);
                }
            });
    };

    const fetchDataCategory = () => {
        axiosPublic.get('/category')
            .then((response) => {
                const categories = response.data.info || [];
                setDataCategory(categories);
                
                if (categories.length > 0 && input.id === null) {
                    setInput(prevInput => ({
                        ...prevInput,
                        categoryId: categories[0].id
                    }));
                }
            })
            .catch(err => {
                console.error("Error fetching categories:", err);
                setError(`Gagal memuat data kategori: ${err.message}`);
            });
    };

    const handleChange = (event) => {
        let { name, value } = event.target;
        if (name === "year" || name === "categoryId") {
            value = parseInt(value, 10);
        }
        setInput({ ...input, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null); 

        const movieData = {
            title: input.title,
            year: Number(input.year),
            categoryId: Number(input.categoryId)
        };

        if (!movieData.title || movieData.year <= 1895 || movieData.categoryId === 0) {
            setError("Harap isi semua field dengan benar.");
            return;
        }

        try {
            if (input.id === null) {
                await axiosSecure.post('/movie', movieData);
                // Setelah create, pergi ke halaman terakhir (opsional, tapi bagus)
                // Untuk simple, kita panggil fetchDataMovie() saja
            } else {
                await axiosSecure.put(`/movie/${input.id}`, movieData);
            }
            // Panggil fetchDataMovie() untuk refresh data di halaman saat ini
            fetchDataMovie(); 
            resetForm();
        } catch (err) {
            console.error("Error submitting form:", err.response);
            if (err.response && err.response.status === 401) {
                setError("Otentikasi gagal. Anda harus login untuk melakukan aksi ini.");
            } else if (err.response && err.response.data && err.response.data.message) {
                 setError(`Error: ${err.response.data.message}`);
            } else {
                 setError("Gagal menyimpan data.");
            }
        }
    };

    const handleEdit = (movie) => {
        setInput({
            title: movie.title,
            year: movie.year,
            categoryId: movie.categoryId || (dataCategory.length > 0 ? dataCategory[0].id : 0),
            id: movie.id
        });
        window.scrollTo(0, 0); 
    };

    const handleDelete = async (movieId) => {
        setError(null);
        try {
            await axiosSecure.delete(`/movie/${movieId}`);
            // Cek jika ini item terakhir di halaman, jika ya, pindah ke page sblmnya
            if (dataMovie.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            } else {
                fetchDataMovie(); // Refresh halaman saat ini
            }
        } catch (err) {
             console.error("Error deleting movie:", err.response);
            if (err.response && err.response.status === 401) {
                setError("Otentikasi gagal. Anda harus login atau menjadi admin untuk menghapus.");
            } else {
                setError("Gagal menghapus data.");
            }
        }
    };

    const resetForm = () => {
         setInput(initialInput);
         if (dataCategory.length > 0) {
             setInput(prev => ({...initialInput, categoryId: dataCategory[0].id}));
         }
         setError(null);
    }
    
    // --- Komponen Baru untuk Kontrol Halaman ---
    const PaginationControls = () => {
        return (
            <div className="pagination-controls">
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="button-secondary"
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {paginationInfo.totalPages || 1}
                </span>
                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage >= paginationInfo.totalPages}
                    className="button-secondary"
                >
                    Next
                </button>
            </div>
        );
    }

    return (
        <div className="crud-container">
            <button onClick={onLogout} className="logout-button">
                Logout
            </button>
            <h1>CRUD AXIOS</h1>
            
            {error && (
                <div className="error-message">
                    <strong>Error:</strong> {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="crud-form">
                {/* ... (Form input tidak berubah) ... */}
                <h3>{input.id ? "Edit Movie" : "Add New Movie"}</h3>
                
                <div className="form-group">
                    <label htmlFor="title">Movie Title</label>
                    <input type="text" id="title" onChange={handleChange} name="title" value={input.title} placeholder="Movie Title.." required />
                </div>

                <div className="form-group">
                    <label htmlFor="year">Released Year</label>
                    <input type="number" id="year" onChange={handleChange} name="year" value={input.year} placeholder="Movie Release Date.." min="1900" max="2025" required />
                </div>

                <div className="form-group">
                    <label htmlFor="categoryId">Category</label>
                    <select id="categoryId" name="categoryId" onChange={handleChange} value={input.categoryId} required>
                        <option value={0} disabled>-- Pilih Kategori --</option>
                        {dataCategory.map((item) => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                    </select>
                </div>
                
                <div className="form-actions">
                    <button type="submit" className="button-primary">
                        {input.id ? "Update Data" : "Submit"}
                    </button>
                    {input.id && (
                         <button type="button" onClick={resetForm} className="button-secondary">
                             Cancel Edit
                         </button>
                    )}
                </div>
            </form>

            <div className="table-container">
                <table className="crud-table">
                    <thead>
                        {/* ... (Tabel header tidak berubah) ... */}
                        <tr>
                            <th>Nomor</th>
                            <th>Judul</th>
                            <th>Tahun</th>
                            <th>Kategori</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataMovie.map((item, index) => (
                            <tr key={item.id}>
                                {/* Nomor urut berdasarkan halaman */}
                                <td>{ (currentPage - 1) * pageSize + index + 1 }</td>
                                <td>{item.title}</td>
                                <td>{item.year}</td>
                                <td>
                                    {item.category ? item.category.name : "N/A"}
                                </td> 
                                <td className="actions">
                                    <button onClick={() => handleEdit(item)} className="button-edit">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className="button-delete">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- Tambahkan Kontrol Pagination di Sini --- */}
            <PaginationControls />

        </div>
    );
}

// --- Komponen APP Utama (Router) ---
function App() {
    // ... (Tidak ada perubahan di sini, salin dari kode Anda sebelumnya) ...
    const [token, setToken] = useState(getAuthToken());
    const [page, setPage] = useState('login'); // 'login' atau 'register'
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        const storedToken = getAuthToken();
        if (storedToken) {
            setToken(storedToken);
        }
        setAuthChecked(true);
    }, []);

    const handleLoginSuccess = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setPage('login');
    };

    if (!authChecked) {
        return <div>Loading...</div>; 
    }
    
    if (token) {
        return <CrudPage onLogout={handleLogout} />;
    }

    if (page === 'login') {
        return <LoginPage 
                    onLoginSuccess={handleLoginSuccess} 
                    onSwitchToRegister={() => setPage('register')} 
                />;
    } else {
        return <RegisterPage 
                    onSwitchToLogin={() => setPage('login')} 
                />;
    }
}

export default App;