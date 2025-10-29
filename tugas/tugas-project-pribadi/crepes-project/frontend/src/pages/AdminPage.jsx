import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ToppingModal } from '../components/ToppingModal';

// URL API Backend
const API_URL = 'http://localhost:5000/api';

const formatCurrency = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
};

export const AdminPage = () => {
  // State untuk data
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // State untuk form
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    basePrice: '',
    description: '',
    imageUrl: '',
    categoryId: '',
  });
  
  // --- PERUBAHAN 1: State baru untuk file ---
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Ref untuk input file (untuk reset)
  const fileInputRef = useRef(null);

  // State untuk mode form (create atau edit)
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fungsi untuk mengambil semua data saat komponen dimuat
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Handler untuk input form (teks)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // --- PERUBAHAN 2: Handler baru untuk input file ---
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // --- PERUBAHAN 3: handleSubmit dirombak total ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Buat FormData
    const data = new FormData();
    
    // 2. Tambahkan semua data teks dari state formData
    data.append('id', formData.id);
    data.append('name', formData.name);
    data.append('basePrice', formData.basePrice);
    data.append('description', formData.description);
    data.append('categoryId', formData.categoryId);
    
    // Kirim 'imageUrl' apa adanya (bisa link lama atau link baru)
    data.append('imageUrl', formData.imageUrl); 
    
    // 3. Jika ada file baru yang dipilih, tambahkan ke FormData
    if (selectedFile) {
      data.append('image', selectedFile); // 'image' harus cocok dgn di backend
    }

    try {
      if (isEditing) {
        // --- Logika UPDATE ---
        // Kirim FormData dengan method PUT
        await axios.put(`${API_URL}/products/${formData.id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('Produk berhasil diperbarui!');
      } else {
        // --- Logika CREATE ---
        // Kirim FormData dengan method POST
        await axios.post(`${API_URL}/products`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('Produk berhasil ditambahkan!');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Gagal menyimpan produk.');
    }
    
    // Reset form dan refresh data
    resetForm();
    fetchProducts();
  };
  
  // Handler untuk tombol Edit
  const handleEditClick = (product) => {
    setIsEditing(true);
    setFormData({
      id: product.id,
      name: product.name,
      basePrice: product.basePrice,
      description: product.description || '',
      imageUrl: product.imageUrl || '',
      categoryId: product.categoryId,
    });
  };

  // Handler untuk tombol Delete
  const handleDeleteClick = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        await axios.delete(`${API_URL}/products/${id}`);
        alert('Produk berhasil dihapus.');
        fetchProducts(); // Refresh data
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Gagal menghapus produk. Cek relasi data.');
      }
    }
  };
  
  // --- PERUBAHAN 4: Update resetForm ---
  const resetForm = () => {
    setIsEditing(false);
    setFormData({
      id: null,
      name: '',
      basePrice: '',
      description: '',
      imageUrl: '',
      categoryId: '',
    });
    // Hapus file yang dipilih
    setSelectedFile(null);
    // Reset nilai input file
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      
      {selectedProduct && (
        <ToppingModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
        
      <h1 className="text-3xl font-bold mb-6">Manajemen Produk</h1>

      {/* Bagian Form (Create/Edit) */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {isEditing ? 'Edit Produk' : 'Tambah Produk Baru'}
        </h2>
        {/*
          PERUBAHAN 5: Ganti <form> untuk handle multipart
          Meskipun kita handle di axios, ini adalah praktik yang baik
        */}
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ... (Input Nama Produk) ... */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Produk</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            {/* ... (Input Harga Dasar) ... */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Harga Dasar (Rp)</label>
              <input
                type="number"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
          </div>
          {/* ... (Input Kategori) ... */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Kategori</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            >
              <option value="">-- Pilih Kategori --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          {/* ... (Input Deskripsi) ... */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Deskripsi (Opsional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            ></textarea>
          </div>

          {/* --- PERUBAHAN 6: Input Gambar --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gunakan Link Gambar (Opsional)
            </label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              placeholder="Contoh: https://.../gambar.jpg"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          
          <div className="text-center my-2">
            <span className="text-gray-500 text-sm font-semibold">ATAU</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Gambar Pribadi (Ini akan menimpa link)
            </label>
            <input
              type="file"
              name="image"
              ref={fileInputRef} // Tambahkan ref
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            />
          </div>
          
          {/* ... (Tombol Submit dan Batal) ... */}
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
            >
              {isEditing ? 'Simpan Perubahan' : 'Tambah Produk'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400"
            >
              Batal
            </button>
          </div>
        </form>
      </div>

      {/* Bagian Tabel (Read) */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Daftar Produk</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* Kolom baru untuk gambar */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gambar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Harga Dasar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  {/* Kolom baru untuk gambar */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.imageUrl && (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(product.basePrice)}</td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEditClick(product)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Atur Topping
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};