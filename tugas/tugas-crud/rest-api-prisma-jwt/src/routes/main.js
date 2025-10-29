const express = require('express');

// --- CONTROLLERS ---
const { 
    createMovie, 
    readMovie, 
    readMovieById, 
    updateMovie, 
    deleteMovie 
} = require('../controllers/movieController');

const { 
    createCategory, 
    readCategory, 
    readCategoryById, 
    updateCategory, 
    deleteCategory 
} = require('../controllers/categoryController');

const { 
    register, 
    login 
} = require('../controllers/userController');

// --- MIDDLEWARE ---
const { authJWT } = require('../middleware/auth');
const { basicAuth } = require('../middleware/basicAuth');
const { validationBodyMovies } = require('../middleware/validation');


const router = express.Router();

// =======================================
// USER AUTH ROUTES (Public)
// =======================================
// Rute-rute ini harus publik agar pengguna bisa mendaftar dan login
router.post('/register', register);
router.post('/login', login);


// =======================================
// MOVIE ROUTES
// =======================================
// READ (Public) - Siapapun boleh melihat daftar film
router.get('/movie', readMovie);
router.get('/movie/:id', readMovieById);

// CREATE (Protected by User JWT + Validation)
// Hanya user yang sudah login (authJWT) yang bisa membuat film,
// dan datanya harus valid (validationBodyMovies).
router.post('/movie', authJWT, validationBodyMovies, createMovie);

// UPDATE (Protected by User JWT + Validation)
// Hanya user yang sudah login (authJWT) yang bisa update,
// dan datanya harus valid (validationBodyMovies).
router.put('/movie/:id', authJWT, validationBodyMovies, updateMovie);

// DELETE (Protected by Admin Basic Auth)
// Hanya admin (basicAuth) yang bisa menghapus film.
router.delete('/movie/:id', authJWT, deleteMovie);


// =======================================
// CATEGORY ROUTES
// =======================================
// READ (Public) - Siapapun boleh melihat daftar kategori
router.get('/category', readCategory);
router.get('/category/:id', readCategoryById);

// WRITE (Protected by Admin Basic Auth)
// Hanya admin (basicAuth) yang bisa membuat, update, atau hapus kategori.
// (Kita asumsikan kategori tidak dibuat oleh pengguna biasa)
router.post('/category', basicAuth, createCategory);
router.put('/category/:id', basicAuth, updateCategory);
router.delete('/category/:id', basicAuth, deleteCategory);


module.exports = router;
