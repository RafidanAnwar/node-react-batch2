require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer'); // Import multer
const path = require('path');     // Import path

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

// --- Konfigurasi Middleware ---
app.use(cors());
app.use(express.json());

// Middleware untuk menyajikan file statis (gambar)
// Ini membuat folder 'public' bisa diakses dari browser
app.use('/public', express.static(path.join(__dirname, 'public')));

// --- Konfigurasi Multer (Penyimpanan File) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Simpan file di folder 'public/uploads'
    cb(null, 'public/uploads'); 
  },
  filename: (req, file, cb) => {
    // Buat nama file unik (tanggal + nama asli)
    cb(null, Date.now() + '-' + file.originalname); 
  },
});

const upload = multer({ storage: storage });

// --- API Endpoints ---

app.get('/', (req, res) => {
  res.send('Selamat datang di Crepes API!');
});

// ... (API /api/products (GET), /api/checkout, /api/categories tidak berubah) ...
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        availableToppings: {
          include: {
            topping: true,
          },
        },
      },
      orderBy: {
        name: 'asc'
      }
    });

    const cleanedProducts = products.map((product) => {
      return {
        ...product,
        availableToppings: product.availableToppings.map(
          (pt) => pt.topping
        ),
      };
    });

    res.json(cleanedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengambil data produk' });
  }
});

app.post('/api/checkout', async (req, res) => {
  const { cartItems, totalPrice } = req.body;

  try {
    // Kita gunakan $transaction agar jika salah satu item gagal,
    // semua proses dibatalkan (rollback)
    const newOrder = await prisma.$transaction(async (tx) => {
      // 1. Buat record Order utama
      const order = await tx.order.create({
        data: {
          totalPrice: totalPrice,
        },
      });

      // 2. Siapkan data OrderItem
      const orderItemsData = cartItems.map((item) => {
        // Ubah array topping [{id, name, price}] menjadi string "Nama1, Nama2"
        const toppingsString = item.toppings.map((t) => t.name).join(', ');
        
        return {
          productName: item.productName,
          basePrice: item.basePrice,
          totalPrice: item.totalPrice,
          toppingsList: toppingsString,
          orderId: order.id, // Link ke Order yang baru dibuat
        };
      });

      // 3. Buat semua record OrderItem sekaligus
      await tx.orderItem.createMany({
        data: orderItemsData,
      });

      return order;
    });

    res.status(201).json({ 
      message: 'Pesanan berhasil dibuat!', 
      orderId: newOrder.id 
    });

  } catch (error) {
    console.error('Checkout gagal:', error);
    res.status(500).json({ error: 'Gagal memproses pesanan' });
  }
});

app.get('/api/categories', async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil kategori' });
    }
});


// ... (API Topping dan Relasi tidak berubah) ...
app.get('/api/toppings', async (req, res) => {
    try {
        const toppings = await prisma.topping.findMany({
            orderBy: { name: 'asc' }
        });
        res.json(toppings);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil topping' });
    }
});
app.post('/api/toppings', async (req, res) => {
    try {
        const { name, price } = req.body;
        const newTopping = await prisma.topping.create({
            data: {
                name,
                price: parseInt(price, 10),
            },
        });
        res.status(201).json(newTopping);
    } catch (error) {
        res.status(500).json({ error: 'Gagal membuat topping' });
    }
});
app.put('/api/toppings/:id', async (req, res) => {
    const { id } = req.params;
    const { name, price } = req.body;
    try {
        const updatedTopping = await prisma.topping.update({
            where: { id: parseInt(id, 10) },
            data: {
                name,
                price: parseInt(price, 10),
            },
        });
        res.json(updatedTopping);
    } catch (error) {
        res.status(500).json({ error: 'Gagal memperbarui topping' });
    }
});
app.delete('/api/toppings/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.productTopping.deleteMany({
            where: { toppingId: parseInt(id, 10) },
        });
        await prisma.topping.delete({
            where: { id: parseInt(id, 10) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Gagal menghapus topping' });
    }
});
app.get('/api/products/:id/toppings', async (req, res) => {
  const { id } = req.params;
  try {
    const allToppings = await prisma.topping.findMany();
    const productToppings = await prisma.productTopping.findMany({
      where: { productId: parseInt(id, 10) },
      select: { toppingId: true },
    });
    const linkedToppingIds = new Set(
      productToppings.map((pt) => pt.toppingId)
    );
    const result = allToppings.map((topping) => ({
      ...topping,
      available: linkedToppingIds.has(topping.id),
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data topping produk' });
  }
});
app.put('/api/products/:id/toppings', async (req, res) => {
  const { id } = req.params;
  const { toppingIds } = req.body; 
  try {
    const productId = parseInt(id, 10);
    await prisma.$transaction(async (tx) => {
      await tx.productTopping.deleteMany({
        where: { productId: productId },
      });
      if (toppingIds && toppingIds.length > 0) {
        const dataToInsert = toppingIds.map((toppingId) => ({
          productId: productId,
          toppingId: parseInt(toppingId, 10),
        }));
        await tx.productTopping.createMany({
          data: dataToInsert,
        });
      }
    });
    res.status(200).json({ message: 'Ketersediaan topping berhasil diperbarui' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal memperbarui topping produk' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      // Ambil juga data 'items' yang terkait
      include: {
        items: true, 
      },
      // Urutkan dari yang terbaru
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(orders);
  } catch (error) {
    console.error('Gagal mengambil orders:', error);
    res.status(500).json({ error: 'Gagal mengambil riwayat pesanan' });
  }
});

// === API PRODUK (CRUD) YANG DIPERBARUI ===

/**
 * POST: Membuat Produk baru (HANDLE UPLOAD)
 * kita gunakan upload.single('image') untuk menangkap 1 file
 * yang bernama 'image' dari FormData
 */
app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    const { name, basePrice, description, categoryId } = req.body;
    
    // Default URL adalah kosong (jika user hanya pakai link)
    let finalImageUrl = req.body.imageUrl || ''; 
    
    // Jika ada file yang di-upload (req.file ada),
    // GANTI finalImageUrl dengan path file yang baru di-upload.
    if (req.file) {
      // Kita buat URL lengkapnya, cth: http://localhost:5000/public/uploads/12345-gambar.jpg
      const url = `${req.protocol}://${req.get('host')}`;
      finalImageUrl = `${url}/public/uploads/${req.file.filename}`;
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        basePrice: parseInt(basePrice, 10),
        description,
        imageUrl: finalImageUrl, // Simpan URL final
        categoryId: parseInt(categoryId, 10),
      },
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal membuat produk' });
  }
});

/**
 * PUT: Memperbarui Produk berdasarkan ID (HANDLE UPLOAD)
 */
app.put('/api/products/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, basePrice, description, categoryId } = req.body;

  try {
    // Ambil URL gambar yang ada di form (link / path lama)
    let finalImageUrl = req.body.imageUrl || '';
    
    // Jika user meng-upload file BARU
    if (req.file) {
      // Ganti URL-nya dengan path file baru
      const url = `${req.protocol}://${req.get('host')}`;
      finalImageUrl = `${url}/public/uploads/${req.file.filename}`;
      
      // (Opsional: Di sini Anda bisa menambahkan logika
      // untuk menghapus file gambar lama dari server)
    }

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id, 10) },
      data: {
        name,
        basePrice: parseInt(basePrice, 10),
        description,
        imageUrl: finalImageUrl, // Simpan URL final
        categoryId: parseInt(categoryId, 10),
      },
    });
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal memperbarui produk' });
  }
});



/**
 * DELETE: Menghapus Produk berdasarkan ID
 * (Tambahan: Kita juga harus hapus file gambarnya)
 */
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // (Opsional tapi bagus: Hapus file gambar dari server)
    // 1. Ambil data produk dulu untuk dapat nama file
    const product = await prisma.product.findUnique({
        where: { id: parseInt(id, 10) }
    });
    // 2. Jika produk ada dan punya imageUrl
    if(product && product.imageUrl) {
        // Ekstrak nama file dari URL
        const filename = product.imageUrl.split('/uploads/')[1];
        if (filename) {
            const fs = require('fs');
            const filePath = path.join(__dirname, 'public/uploads', filename);
            // Hapus file
            fs.unlink(filePath, (err) => {
                if(err) console.error("Gagal hapus file:", err);
            });
        }
    }
    
    // 3. Hapus relasi topping
    await prisma.productTopping.deleteMany({
      where: { productId: parseInt(id, 10) },
    });
    
    // 4. Hapus produk dari database
    await prisma.product.delete({
      where: { id: parseInt(id, 10) },
    });
    
    res.status(204).send(); // 204 No Content
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal menghapus produk' });
  }
});


app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});