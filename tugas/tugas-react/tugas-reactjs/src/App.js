import React, { useState, useEffect } from 'react';
import './App.css'; // Kita akan membuat file CSS ini
import logo from './logo.png'; // Import logo

function App() {
  // === STATE UNTUK LIFECYCLE TIMER ===

  // State untuk menyimpan waktu saat ini
  const [time, setTime] = useState(new Date());
  // State untuk hitung mundur, mulai dari 100
  const [countdown, setCountdown] = useState(100);
  // State untuk menentukan apakah timer harus ditampilkan atau tidak
  const [showTimer, setShowTimer] = useState(true);

  // === DATA UNTUK TO-DO LIST ===
  const listToDo = [
    "Belajar GIT & CLI",
    "Belajar HTML & CSS",
    "Belajar Javascript",
    "Belajar ReactJS Dasar",
    "Belajar ReactJS Advance"
  ];

  // === LOGIKA LIFECYCLE MENGGUNAKAN useEffect ===

  // Effect ini berjalan satu kali saat komponen pertama kali di-mount
  useEffect(() => {
    // 1. Interval untuk jam sekarang (update setiap detik)
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // 2. Interval untuk hitung mundur (berkurang setiap detik)
    const countdownId = setInterval(() => {
      // Menggunakan callback function di setState untuk mendapatkan nilai state sebelumnya
      setCountdown(prevCount => {
        if (prevCount <= 1) {
          // Jika hitungan akan mencapai 0, hentikan interval
          clearInterval(countdownId);
          clearInterval(timerId); // Hentikan juga interval jam
          return 0;
        }
        return prevCount - 1; // Kurangi hitungan
      });
    }, 1000);

    // Cleanup function: Dijalankan saat komponen unmount
    return () => {
      clearInterval(timerId);
      clearInterval(countdownId);
    };
  }, []); // Array dependency kosong berarti effect ini hanya berjalan sekali (componentDidMount)

  // Effect ini berjalan setiap kali state 'countdown' berubah
  useEffect(() => {
    // Cek jika hitung mundur sudah mencapai 0
    if (countdown <= 0) {
      // Set showTimer menjadi false untuk menghilangkan komponen timer
      setShowTimer(false);
    }
  }, [countdown]); // Dependency array diisi 'countdown'

  // === RENDER JSX ===
  return (
    <div className="app-container">
      
      {/* Bagian 1: Timer (Conditional Rendering) */}
      {/* Komponen ini hanya akan di-render jika 'showTimer' bernilai true.
        Ini adalah Conditional Rendering sesuai permintaan soal.
      */}
      {showTimer && (
        <div className="timer-container">
          <h1 className="current-time">
            Now At - {time.toLocaleTimeString('en-US')}
          </h1>
          <h2 className="countdown">
            Countdown : {countdown}
          </h2>
        </div>
      )}

      {/* Bagian 2: To-Do List */}
      <div className="todo-container">
        <img src={logo} alt="Sanbercode Logo" className="logo" />
        <h2 className="todo-title">THINGS TO DO</h2>
        <p className="todo-subtitle">During bootcamp in sanbercode</p>
        
        <ul className="todo-list">
          {listToDo.map((item, index) => (
            <li key={index} className="todo-item">
              <input type="checkbox" id={`item-${index}`} />
              <label htmlFor={`item-${index}`}>{item}</label>
            </li>
          ))}
        </ul>

        <button className="send-button">SEND</button>
      </div>

    </div>
  );
}

export default App;