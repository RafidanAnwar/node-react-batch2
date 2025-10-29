import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ProductCard } from '../components/ProductCard';
import { Cart } from '../components/Cart';

export const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Ambil data dari API backend
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
        setError(null);
      } catch (err) {
        setError('Gagal memuat produk. Pastikan backend berjalan.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">
        🥔 Potato & Crispy Crepes 🥞
      </h1>
      
      {loading && <p className="text-center">Loading produk...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Kolom Produk */}
        <div className="w-full md:w-2/3">
          <h2 className="text-2xl font-semibold mb-4">Pilih Menu</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Kolom Keranjang (Cart) */}
        <div className="w-full md:w-1/3">
          <div className="sticky top-4">
            <Cart />
          </div>
        </div>
      </div>
    </div>
  );
};