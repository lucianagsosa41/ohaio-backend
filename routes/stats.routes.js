// routes/stats.routes.js
const express = require('express');
const { summary, series, ivaBreakdown, topProductos } = require('../controllers/stats.controller');

const router = express.Router();

router.get('/summary', summary);
router.get('/series', series);
router.get('/iva', ivaBreakdown);
router.get('/top-productos', topProductos);

module.exports = router;
