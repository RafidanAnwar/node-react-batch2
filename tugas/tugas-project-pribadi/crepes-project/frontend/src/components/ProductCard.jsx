import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

// Fungsi helper untuk format mata uang
const formatCurrency = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
};

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [totalPrice, setTotalPrice] = useState(product.basePrice);

  // Fungsi untuk menangani perubahan checkbox topping
  const handleToppingChange = (e, topping) => {
    const { checked } = e.target;
    if (checked) {
      // Tambah topping
      setSelectedToppings([...selectedToppings, topping]);
    } else {
      // Hapus topping
      setSelectedToppings(
        selectedToppings.filter((t) => t.id !== topping.id)
      );
    }
  };

  // Gunakan useEffect untuk menghitung ulang total harga
  // setiap kali 'selectedToppings' atau 'product.basePrice' berubah
  useEffect(() => {
    const toppingPrice = selectedToppings.reduce(
      (total, topping) => total + topping.price,
      0
    );
    setTotalPrice(product.basePrice + toppingPrice);
  }, [selectedToppings, product.basePrice]);
  
  // Fungsi untuk menangani penambahan ke keranjang
  const handleAddToCart = () => {
    addToCart(product, selectedToppings, totalPrice);
    // Reset state setelah ditambah
    setSelectedToppings([]);
  }

  return (
    <div className="border rounded-lg shadow-lg overflow-hidden">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-bold">{product.name}</h3>
        <p className="text-sm text-gray-600">{product.description}</p>
        <p className="text-lg font-semibold mt-2">
          Harga Dasar: {formatCurrency(product.basePrice)}
        </p>

        {/* Bagian Mix and Match Topping */}
        {product.availableToppings.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold">Pilih Topping (Mix & Match):</h4>
            <div className="space-y-2 mt-2">
              {product.availableToppings.map((topping) => (
                <label key={topping.id} className="flex items-center justify-between">
                  <div>
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedToppings.some((t) => t.id === topping.id)}
                      onChange={(e) => handleToppingChange(e, topping)}
                    />
                    <span>{topping.name}</span>
                  </div>
                  <span className="text-sm text-gray-700">
                    + {formatCurrency(topping.price)}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Total Harga Dinamis */}
        <div className="mt-4">
          <h3 className="text-xl font-bold text-blue-600">
            Total: {formatCurrency(totalPrice)}
          </h3>
        </div>
        
        <button 
          onClick={handleAddToCart}
          className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded mt-4 hover:bg-green-600 transition-colors"
        >
          Tambah ke Keranjang
        </button>
      </div>
    </div>
  );
};