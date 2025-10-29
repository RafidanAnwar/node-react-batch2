import React from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const formatCurrency = (number) => {
  // ... (fungsi format Anda)
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
};

export const Cart = () => {
  // --- Ganti ini ---
  const { cartItems, removeFromCart, cartTotal, clearCart } = useCart();

  const handleCheckout = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/checkout', {
        cartItems: cartItems,
        totalPrice: cartTotal,
      });
      
      alert(response.data.message);
      
      // --- Ganti ini ---
      // (Ganti dari loop 'removeFromCart' menjadi satu fungsi 'clearCart')
      clearCart(); 
      
    } catch (error) {
      console.error('Checkout gagal:', error);
      alert('Checkout gagal, coba lagi.');
    }
  };

  return (
    // ... (Seluruh JSX Anda tidak perlu diubah) ...
    <div className="w-full max-w-md p-4 bg-white border rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">Keranjang Saya</h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-600 text-center">Keranjang masih kosong.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="border-b pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{item.productName}</h4>
                    <ul className="text-sm text-gray-500 list-disc list-inside ml-2">
                      {item.toppings.map((t) => (
                        <li key={t.id}>{t.name}</li>
                      ))}
                    </ul>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-bold"
                  >
                    X
                  </button>
                </div>
                <p className="text-right font-semibold mt-2">
                  {formatCurrency(item.totalPrice)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <div className="flex justify-between text-xl font-bold">
              <span>Total:</span>
              <span>{formatCurrency(cartTotal)}</span>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={cartItems.length === 0} // Tambahan bagus: disable jika kosong
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4 hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};