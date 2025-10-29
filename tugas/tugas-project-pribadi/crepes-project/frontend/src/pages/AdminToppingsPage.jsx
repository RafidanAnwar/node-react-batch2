import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const formatCurrency = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
};

export const AdminToppingsPage = () => {
  const [toppings, setToppings] = useState([]);
  const [formData, setFormData] = useState({ id: null, name: '', price: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchToppings();
  }, []);

  const fetchToppings = async () => {
    try {
      const response = await axios.get(`${API_URL}/toppings`);
      setToppings(response.data);
    } catch (error) {
      console.error('Error fetching toppings:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      try {
        await axios.put(`${API_URL}/toppings/${formData.id}`, formData);
        alert('Topping berhasil diperbarui');
      } catch (error) {
        alert('Gagal memperbarui topping');
      }
    } else {
      try {
        await axios.post(`${API_URL}/toppings`, formData);
        alert('Topping berhasil ditambahkan');
      } catch (error) {
        alert('Gagal menambahkan topping');
      }
    }
    resetForm();
    fetchToppings();
  };

  const handleEditClick = (topping) => {
    setIsEditing(true);
    setFormData({ id: topping.id, name: topping.name, price: topping.price });
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Yakin ingin menghapus topping ini?')) {
      try {
        await axios.delete(`${API_URL}/toppings/${id}`);
        alert('Topping berhasil dihapus');
        fetchToppings();
      } catch (error) {
        alert('Gagal menghapus topping');
      }
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setFormData({ id: null, name: '', price: '' });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manajemen Topping</h1>

      {/* Form Create/Edit */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {isEditing ? 'Edit Topping' : 'Tambah Topping Baru'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Topping</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Harga Tambahan (Rp)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
            >
              {isEditing ? 'Simpan' : 'Tambah'}
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

      {/* Tabel Read */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Daftar Master Topping</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Harga</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {toppings.map((topping) => (
              <tr key={topping.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{topping.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(topping.price)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEditClick(topping)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(topping.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};