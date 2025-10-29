import axios from 'axios';
import { useEffect, useState } from 'react';

// Impor file CSS eksternal
import './CRUDaxios.css'; 

// --- Konfigurasi Axios ---

/**
 * Mengambil token JWT dari localStorage.
 * Kita berasumsi Anda menyimpannya di sini setelah pengguna login.
 */
const getAuthToken = () => {
    return localStorage.getItem('token');
}

/**
 * Instance Axios untuk request yang MEMBUTUHKAN otentikasi (POST, PUT, DELETE).
 * Ini akan secara otomatis menambahkan header "Authorization".
 */
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

/**
 * Instance Axios untuk request PUBLIK (GET).
 * Tidak memerlukan token.
 */
const axiosPublic = axios.create({
    baseURL: 'http://localhost:3000/api',
});


// --- Komponen React ---

function CRUDAxios() {
    const initialInput = { title: "", year: 2000, categoryId: 0, id: null };
    
    const [dataMovie, setDataMovie] = useState([]);
    const [dataCategory, setDataCategory] = useState([]);
    const [input, setInput] = useState(initialInput);
    const [error, setError] = useState(null); // State untuk menampilkan error di UI

    // Efek untuk memuat data saat komponen pertama kali di-mount
    useEffect(() => {
        fetchDataMovie();
        fetchDataCategory();
    }, []);

    // --- Fungsi Logika Data ---

    /**
     * Mengambil daftar film dari backend.
     */
    const fetchDataMovie = () => {
        axiosPublic.get('/movie') // Menggunakan instance publik
            .then((response) => {
                // Backend Anda mengirim data di dalam properti 'info'
                setDataMovie(response.data.info || []);
            })
            .catch(err => {
                console.error("Error fetching movies:", err);
                // PERUBAHAN: Pesan error yang lebih spesifik
                if (err.message === 'Network Error') {
                    setError("Network Error: Gagal terhubung ke backend. Pastikan server di http://localhost:3000 berjalan dan CORS dikonfigurasi dengan benar.");
                } else {
                    setError(`Gagal memuat data film: ${err.message}`);
                }
            });
    };

    /**
     * Mengambil daftar kategori dari backend.
     */
    const fetchDataCategory = () => {
        axiosPublic.get('/category') // Menggunakan instance publik
            .then((response) => {
                const categories = response.data.info || [];
                setDataCategory(categories);
                
                // Set categoryId default di form jika belum ada ID (bukan mode edit)
                if (categories.length > 0 && input.id === null) {
                    setInput(prevInput => ({
                        ...prevInput,
                        categoryId: categories[0].id // Set ke kategori pertama
                    }));
                }
            })
            .catch(err => {
                console.error("Error fetching categories:", err);
                // PERUBAHAN: Pesan error yang lebih spesifik
                if (err.message === 'Network Error') {
                    setError("Network Error: Gagal terhubung ke backend. Pastikan server di http://localhost:3000 berjalan dan CORS dikonfigurasi dengan benar.");
                } else {
                    setError(`Gagal memuat data kategori: ${err.message}`);
                }
            });
    };

    /**
     * Menangani perubahan pada input form.
     */
    const handleChange = (event) => {
        let { name, value } = event.target;

        // Konversi ke Angka jika itu 'year' atau 'categoryId'
        if (name === "year" || name === "categoryId") {
            value = parseInt(value, 10);
        }
        
        setInput({ ...input, [name]: value });
    };

    /**
     * Menangani submit form (Create atau Update).
     */
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null); // Bersihkan pesan error sebelumnya

        const movieData = {
            title: input.title,
            year: Number(input.year),
            categoryId: Number(input.categoryId)
        };

        // Memeriksa validasi sederhana
        if (!movieData.title || movieData.year <= 1895 || movieData.categoryId === 0) {
            setError("Harap isi semua field dengan benar.");
            return;
        }

        try {
            if (input.id === null) {
                // --- CREATE (POST) ---
                await axiosSecure.post('/movie', movieData);
            } else {
                // --- UPDATE (PUT) ---
                await axiosSecure.put(`/movie/${input.id}`, movieData);
            }
            
            fetchDataMovie(); // Muat ulang data film
            resetForm(); // Reset form ke kondisi awal
            
        } catch (err) {
            console.error("Error submitting form:", err.response);
            if (err.response && err.response.status === 401) {
                setError("Otentikasi gagal. Anda harus login untuk melakukan aksi ini.");
            } else if (err.response && err.response.data && err.response.data.message) {
                 setError(`Error: ${err.response.data.message}`); // Tampilkan error validasi dari backend
            } else {
                 setError("Gagal menyimpan data.");
            }
        }
    };

    /**
     * Mengaktifkan mode Edit dengan mengisi form.
     */
    const handleEdit = (movie) => {
        setInput({
            title: movie.title,
            year: movie.year,
            // Pastikan categoryId tidak null
            categoryId: movie.categoryId || (dataCategory.length > 0 ? dataCategory[0].id : 0),
            id: movie.id
        });
        window.scrollTo(0, 0); // Scroll ke atas untuk melihat form
    };

    /**
     * Menghapus film.
     */
    const handleDelete = async (movieId) => {
        // Idealnya, Anda harus membuat komponen modal konfirmasi sendiri.
        
        setError(null);

        try {
            await axiosSecure.delete(`/movie/${movieId}`);
            fetchDataMovie(); // Muat ulang data film
        } catch (err) {
             console.error("Error deleting movie:", err.response);
            if (err.response && err.response.status === 401) {
                setError("Otentikasi gagal. Anda harus login atau menjadi admin untuk menghapus.");
            } else {
                setError("Gagal menghapus data.");
            }
        }
    };

    /**
     * Mengatur ulang form ke kondisi awal.
     */
    const resetForm = () => {
         setInput(initialInput);
         // Set ulang categoryId default jika ada
         if (dataCategory.length > 0) {
             setInput(prev => ({...initialInput, categoryId: dataCategory[0].id}));
         }
         setError(null);
    }

    // --- Render JSX ---
    
    return (
        // Menggunakan className dari file CSS yang diimpor
        <div className="crud-container">
            <h1>CRUD AXIOS</h1>
            
            {/* Menampilkan pesan error di UI */}
            {error && (
                <div className="error-message">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {/* Form untuk Create dan Update */}
            <form onSubmit={handleSubmit} className="crud-form">
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
                    {/* Tombol Batal hanya muncul saat mode Edit */}
                    {input.id && (
                         <button type="button" onClick={resetForm} className="button-secondary">
                             Cancel Edit
                         </button>
                    )}
                </div>
            </form>

            {/* Tabel untuk menampilkan data film */}
            <div className="table-container">
                <table className="crud-table">
                    <thead>
                        <tr>
                            <th>Nomor</th>
                            <th>Judul</th>
                            <th>Tahun</th>
                            <th>Kategori</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {dataMovie.map((item, index) => {
                            return (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{item.title}</td>
                                    <td>{item.year}</td>
                                    {/* Menampilkan nama kategori, bukan ID */}
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
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default CRUDAxios