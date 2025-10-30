const Combo = require('../models/combos.model');
const ComboHamburguesa = require('../models/comboHamburguesa.model');

const getCombos = async (req, res) => {
  try {
    const combos = await Combo.getAll();
    res.json(combos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los combos.' });
  }
};

const getComboById = async (req, res) => {
  try {
    const { id } = req.params;
    const combo = await Combo.getById(id);
    const hamburguesas = await ComboHamburguesa.getHamburguesasByComboId(id);

    if (!combo) {
      return res.status(404).json({ error: 'Combo no encontrado.' });
    }

    res.json({ ...combo, hamburguesas });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el combo.' });
  }
};

const createCombo = async (req, res) => {
  try {
    const { nombre, descripcion, precio, hamburguesas } = req.body;

    const nuevoCombo = await Combo.create({ nombre, descripcion, precio });

    for (const h of hamburguesas) {
      await ComboHamburguesa.addHamburguesaToCombo({
        combo_id: nuevoCombo.id,
        hamburguesa_id: h.id,
        cantidad: h.cantidad || 1,
      });
    }

    res.status(201).json({ mensaje: 'Combo creado', combo: nuevoCombo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear el combo.' });
  }
};

const deleteCombo = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Combo.delete(id);
    if (!eliminado) {
      return res.status(404).json({ error: 'Combo no encontrado.' });
    }
    res.json({ mensaje: 'Combo eliminado (lógicamente).' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el combo.' });
  }
};

module.exports = {
  getCombos,
  getComboById,
  createCombo,
  deleteCombo,
};
