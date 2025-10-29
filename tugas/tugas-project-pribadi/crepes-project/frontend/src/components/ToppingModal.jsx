import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const ToppingModal = ({ product, onClose }) => {
  const [toppings, setToppings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil data ketersediaan topping
  useEffect(() => {
    const fetchToppingAvailability = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/products/${product.id}/toppings`);
        // data: [{ id, name, price, available: true/false }]
        setToppings(response.data);
      } catch (error) {
        console.error('Error fetching topping availability:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchToppingAvailability();
  }, [product.id]);

  // Handle saat checkbox di-klik
  const handleCheckboxChange = (id) => {
    setToppings(
      toppings.map((t) =>
        t.id === id ? { ...t, available: !t.available } : t
      )
    );
  };

  // Handle simpan perubahan
  const handleSave = async () => {
    // Ambil hanya ID dari topping yang 'available'
    const toppingIds = toppings
      .filter((t) => t.available)
      .map((t) => t.id);

    try {
      await axios.put(`${API_URL}/products/${product.id}/toppings`, {
        toppingIds: toppingIds,
      });
      alert('Ketersediaan topping berhasil disimpan!');
      onClose();
    } catch (error) {
      alert('Gagal menyimpan. Coba lagi.');
    }
  };

  return (
    // Latar belakang modal (overlay)
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      {/* Konten Modal */}
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          Atur Topping untuk: {product.name}
        </h2>

        {loading ? (
          <p>Memuat topping...</p>
        ) : (
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {toppings.map((topping) => (
              <label key={topping.id} className="flex items-center justify-between">
                <div>
                  <input
                    type="checkbox"
                    className="mr-3"
                    checked={topping.available}
                    onChange={() => handleCheckboxChange(topping.id)}
                  />
                  <span>{topping.name}</span>
                </div>
                <span className="text-sm text-gray-600">(+Rp {topping.price})</span>
              </label>
            ))}
          </div>
        )}

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};