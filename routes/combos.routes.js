const express = require('express');
const router = express.Router();
const combosController = require('../controllers/combos.controller');

// Obtener todos los combos
router.get('/', combosController.getCombos);

// Obtener un combo por ID (con hamburguesas incluidas)
router.get('/:id', combosController.getComboById);

// Crear un combo nuevo
router.post('/', combosController.createCombo);

// "Eliminar" un combo (borrado lógico)
router.delete('/:id', combosController.deleteCombo);

module.exports = router;
