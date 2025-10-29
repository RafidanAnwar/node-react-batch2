import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          CrepesPOS
        </Link>
        <div className="space-x-4">
          <Link
            to="/"
            className="text-gray-600 hover:text-blue-500 font-medium"
          >
            Kasir
          </Link>
          <Link
            to="/admin" // Ini akan kita ubah jadi sub-menu
            className="text-gray-600 hover:text-blue-500 font-medium"
          >
            Admin Produk
          </Link>
          {/* LINK BARU */}
          <Link
            to="/admin/toppings"
            className="text-gray-600 hover:text-blue-500 font-medium"
          >
            Admin Topping
          </Link>
          <Link
            to="/admin/orders"
            className="text-gray-600 hover:text-blue-500 font-medium"
          >
            Riwayat Order
          </Link>
        </div>
      </div>
    </nav>
  );
};