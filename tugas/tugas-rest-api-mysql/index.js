const express = require('express');
const db = require('./db');

const app = express();
const port = 3000;

app.use(express.json());

const getIndeksNilai = (nilai) => {
    if (nilai >= 80) return 'A';
    if (nilai >= 70) return 'B';
    if (nilai >= 60) return 'C';
    if (nilai >= 50) return 'D';
    return 'E';
};

app.post('/nilai', (req, res) => {
    const { nama, mata_kuliah, nilai } = req.body;

    if (!nama || ! mata_kuliah || nilai === undefined) {
        return res.status(400).json({ message: 'Nama, mata kuliah, dan nilai harus diisi'});
    }

    if (nilai < 0 || nilai > 100) {
        return res.status(400).json({ message: 'data nilai salah' });
    }

    const indeks_nilai = getIndeksNilai(nilai);

    const query = 'INSERT INTO nilai_mahasiswa (nama, mata_kuliah, nilai, indeks_nilai) VALUES (?, ?, ?, ?)';

    db.query(query, [nama, mata_kuliah, nilai, indeks_nilai], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.status(201).json({
            message: 'Data berhasil ditambahkan',
            id: result.insertId,
            ...req.body,
            indeks_nilai
        });
    });
});

app.get('/nilai', (req, res) => {
    const query = 'SELECT * FROM nilai_mahasiswa';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500),json({ message: 'Internal Server error'});
        }
        res.status(200).json(results);
    });
});

app.get('/nilai/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM nilai_mahasiswa WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Data tidak ditemukan' });
        }
        res.status(200).json(results[0]);
    });
});

app.put('/nilai/:id', (req, res) => {
    const { id } = req.params;
    const { nama, mata_kuliah, nilai} = req.body;

    if (!nama || !mata_kuliah || nilai === undefined) {
        return res.status(400).json({ message: 'Nama, mata kuliah, dan nilai harus diisi' });
    }

    if (nilai < 0 || nilai > 100) {
        return res.status(400).json({ message: 'data nilai salah'});
    }

    const indeks_nilai = getIndeksNilai(nilai);

    const query = 'UPDATE nilai_mahasiswa SET nama = ?, mata_kuliah = ?, nilai = ?, indeks_nilai = ? WHERE id = ?';
    
    db.query(query, [nama, mata_kuliah, nilai, indeks_nilai, id], (err, result) => {
        if (err) {
            console.log('Error executing query:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Data tidak ditemukan' });
        }
        res.status(200).json({ message: `Data dengan id ${1} berhasil diperbarui` });
    });
});

app.delete('/nilai/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM nilai_mahasiswa WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Data tidak ditemukan' });
        }
        res.status(200).json({ message: `Data dengan id ${id} berhasil dihapus`});
    });
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});