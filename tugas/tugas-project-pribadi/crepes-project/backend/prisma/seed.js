const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // 1. Buat Kategori
  const categoryCrepes = await prisma.category.create({
    data: { name: 'Crepes' },
  });
  const categoryKentang = await prisma.category.create({
    data: { name: 'Kentang' },
  });

  // 2. Buat Produk (Base)
  const crepesManis = await prisma.product.create({
    data: {
      name: 'Crepes Manis',
      basePrice: 10000,
      description: 'Adonan crepes manis yang renyah.',
      imageUrl: 'https://i.imgur.com/gY9J01J.jpeg',
      categoryId: categoryCrepes.id,
    },
  });

  const crepesAsin = await prisma.product.create({
    data: {
      name: 'Crepes Asin',
      basePrice: 12000,
      description: 'Adonan crepes gurih.',
      imageUrl: 'https://i.imgur.com/v9BTOU5.jpeg',
      categoryId: categoryCrepes.id,
    },
  });

  const kentangGoreng = await prisma.product.create({
    data: {
      name: 'Kentang Goreng',
      basePrice: 8000,
      description: 'Kentang goreng renyah original.',
      imageUrl: 'https://i.imgur.com/k9a0YGl.jpeg',
      categoryId: categoryKentang.id,
    },
  });

  // 3. Buat Topping
  const toppingCoklat = await prisma.topping.create({ data: { name: 'Coklat', price: 3000 } });
  const toppingKeju = await prisma.topping.create({ data: { name: 'Keju', price: 4000 } });
  const toppingPisang = await prisma.topping.create({ data: { name: 'Pisang', price: 2000 } });
  const toppingSmokedBeef = await prisma.topping.create({ data: { name: 'Smoked Beef', price: 5000 } });
  const toppingTelur = await prisma.topping.create({ data: { name: 'Telur', price: 3000 } });
  const toppingSausBBQ = await prisma.topping.create({ data: { name: 'Saus BBQ', price: 1500 } });

  // 4. Hubungkan Produk dengan Topping (Mix & Match)
  
  // Topping untuk Crepes Manis
  await prisma.productTopping.createMany({
    data: [
      { productId: crepesManis.id, toppingId: toppingCoklat.id },
      { productId: crepesManis.id, toppingId: toppingKeju.id },
      { productId: crepesManis.id, toppingId: toppingPisang.id },
    ],
  });

  // Topping untuk Crepes Asin
  await prisma.productTopping.createMany({
    data: [
      { productId: crepesAsin.id, toppingId: toppingKeju.id },
      { productId: crepesAsin.id, toppingId: toppingSmokedBeef.id },
      { productId: crepesAsin.id, toppingId: toppingTelur.id },
    ],
  });

  // Topping untuk Kentang Goreng
  await prisma.productTopping.createMany({
    data: [
      { productId: kentangGoreng.id, toppingId: toppingSausBBQ.id },
      { productId: kentangGoreng.id, toppingId: toppingKeju.id },
    ],
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });