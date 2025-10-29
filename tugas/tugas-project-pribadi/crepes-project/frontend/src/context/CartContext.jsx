import React, { createContext, useState, useContext } from 'react';

// 1. Buat Context
const CartContext = createContext();

// 2. Buat Hook kustom untuk menggunakan context
export const useCart = () => {
  return useContext(CartContext);
};

// 3. Buat Provider
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Fungsi untuk menambah item ke keranjang
  const addToCart = (product, selectedToppings, totalPrice) => {
    const newItem = {
      id: Date.now(), // ID unik untuk item keranjang
      productName: product.name,
      basePrice: product.basePrice,
      toppings: selectedToppings,
      totalPrice: totalPrice,
      quantity: 1, // Kuantitas (kita sederhanakan jadi 1 dulu)
    };
    
    setCartItems((prevItems) => [...prevItems, newItem]);
    console.log('Added to cart:', newItem);
  };

  // Fungsi untuk menghapus item
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };
  
  // Hitung total harga keseluruhan keranjang
  const cartTotal = cartItems.reduce((total, item) => total + item.totalPrice, 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    cartTotal,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};