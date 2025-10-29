import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Helper Format
const formatCurrency = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
};
const formatDate = (dateString) => {
  const options = {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};


export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Gagal mengambil riwayat pesanan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Riwayat Transaksi</h1>

      {loading && <p>Memuat riwayat...</p>}

      <div className="space-y-6">
        {orders.map((order) => (
          // Setiap kartu order
          <div key={order.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <div>
                <h2 className="text-xl font-bold">Pesanan #{order.id}</h2>
                <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-600">Total Pesanan</span>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(order.totalPrice)}
                </p>
              </div>
            </div>

            {/* Daftar item di dalam order */}
            <h3 className="text-md font-semibold mb-2">Detail Item:</h3>
            <ul className="space-y-3">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                  <div>
                    <p className="font-semibold">{item.productName}</p>
                    <p className="text-sm text-gray-500">
                      {item.toppingsList ? `Topping: ${item.toppingsList}` : 'Tanpa topping'}
                    </p>
                  </div>
                  <p className="font-semibold">{formatCurrency(item.totalPrice)}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
        
        {!loading && orders.length === 0 && (
          <p className="text-center text-gray-500">Belum ada riwayat transaksi.</p>
        )}
      </div>
    </div>
  );
};