// routes/stock.routes.js
const express = require('express');
const {
  getStock,
  addStock,
  updateStock,
  deleteStock,
  addStockByName, // 👈 importar desde el controller
} = require('../controllers/stock.controller');

const router = express.Router();

router.get('/', getStock);
router.post('/', addStock);
router.put('/:id', updateStock);
router.delete('/:id', deleteStock);

// NUEVO endpoint para crear/cargar por nombre
router.post('/by-name', addStockByName);

module.exports = router;
