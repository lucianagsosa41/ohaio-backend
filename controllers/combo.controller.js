const ComboModel = require('../models/combo.model');

const ComboController = {
  async obtenerCombos(req, res) {
    try {
      const combos = await ComboModel.getAll();
      res.json(combos);
    } catch (error) {
      console.error('Error al obtener combos:', error);
      res.status(500).json({ error: 'Error al obtener los combos' });
    }
  },

  async obtenerComboPorId(req, res) {
    try {
      const id = parseInt(req.params.id);
      const combo = await ComboModel.getById(id);
      if (!combo) {
        return res.status(404).json({ error: 'Combo no encontrado' });
      }
      res.json(combo);
    } catch (error) {
      console.error('Error al obtener el combo:', error);
      res.status(500).json({ error: 'Error al obtener el combo' });
    }
  },

  async crearCombo(req, res) {
    try {
      const { nombre, descripcion, precio } = req.body;
      const nuevoCombo = await ComboModel.create({ nombre, descripcion, precio });
      res.status(201).json(nuevoCombo);
    } catch (error) {
      console.error('Error al crear combo:', error);
      res.status(500).json({ error: 'Error al crear el combo' });
    }
  },

  async actualizarCombo(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { nombre, descripcion, precio } = req.body;
      const comboActualizado = await ComboModel.update(id, { nombre, descripcion, precio });
      if (!comboActualizado) {
        return res.status(404).json({ error: 'Combo no encontrado' });
      }
      res.json(comboActualizado);
    } catch (error) {
      console.error('Error al actualizar combo:', error);
      res.status(500).json({ error: 'Error al actualizar el combo' });
    }
  },

  async eliminarCombo(req, res) {
    try {
      const id = parseInt(req.params.id);
      const comboEliminado = await ComboModel.delete(id);
      if (!comboEliminado) {
        return res.status(404).json({ error: 'Combo no encontrado' });
      }
      res.json(comboEliminado);
    } catch (error) {
      console.error('Error al eliminar combo:', error);
      res.status(500).json({ error: 'Error al eliminar el combo' });
    }
  }
};

module.exports = ComboController;
