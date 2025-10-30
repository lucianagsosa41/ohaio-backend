// routes/kitchen.routes.js
const express = require('express');
const { printOrder } = require('../controllers/kitchen.controller');

const router = express.Router();

// POST /api/kitchen/orders/:id/print  -> imprime el ticket en la comandera
router.post('/orders/:id/print', printOrder);

module.exports = router;
