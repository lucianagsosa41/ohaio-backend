// routes/printer.routes.js
const express = require('express');
const router = express.Router();
const { printById, health } = require('../controllers/printer.controller');

// POST /api/pedidos/:id/print
router.post('/pedidos/:id/print', printById);

// GET /api/printer/health
router.get('/printer/health', health);

module.exports = router;
