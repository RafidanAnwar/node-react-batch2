const { PrismaClient } = require('@prisma/client')

// Inisialisasi Prisma Client
const prisma = new PrismaClient({
  // Opsi untuk logging (opsional, tapi bagus untuk debugging)
  log: ['query', 'info', 'warn', 'error'],
})

module.exports = prisma