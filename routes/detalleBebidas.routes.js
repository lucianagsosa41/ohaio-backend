const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/detalleBebidas.controller');

router.get('/', ctrl.list);        // 👈 nuevo (listado)
router.post('/', ctrl.create);     // ya lo venías usando para crear
router.delete('/:id', ctrl.remove); // opcional

module.exports = router;
