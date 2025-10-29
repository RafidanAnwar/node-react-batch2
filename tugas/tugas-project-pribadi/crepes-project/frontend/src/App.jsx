import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { AdminPage } from './pages/AdminPage';
import { AdminToppingsPage } from './pages/AdminToppingsPage'; // Import halaman baru
import { Navbar } from './components/Navbar';
import { AdminOrdersPage } from './pages/AdminOrdersPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/toppings" element={<AdminToppingsPage />} /> {/* Route baru */}
        <Route path="/admin/orders" element={<AdminOrdersPage />} />
      </Routes>
    </div>
  );
}

export default App;