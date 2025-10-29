require('dotenv').config()
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

const cors = require('cors')
const express = require('express')
const mainRouter = require('./src/routes/main')

const app = express()
const port = process.env.PORT || 3000 

// Konfigurasi CORS
var corsOptions = {
  origin: process.env.CORS_ALLOW_LIST ? process.env.CORS_ALLOW_LIST.split(',') : '*',
  optionsSuccessStatus: 200
}

// Middleware
app.use(cors(corsOptions))
app.use(express.json())
// Routes
app.use('/api', mainRouter) 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); 

// Error handling sederhana 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Menjalankan server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
