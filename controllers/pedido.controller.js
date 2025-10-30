// controllers/pedido.controller.js
const pedidoModel = require('../models/pedido.model');

const getPedidos = async (_req, res) => {
  try {
    const pedidos = await pedidoModel.getAllPedidos();
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener pedidos', error: error.message });
  }
};

const createPedido = async (req, res) => {
  try {
    const pedido = await pedidoModel.createPedido(req.body);
    // 🔕 Importante: NO imprimir acá. El front decide (autoPrint).
    // Si autoPrint está activado, el front llamará a POST /api/pedidos/:id/print
    res.status(201).json(pedido);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear pedido', error: error.message });
  }
};

const putPedido = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'id inválido' });
  try {
    const updated = await pedidoModel.updatePedido(id, req.body || {});
    if (!updated) return res.status(400).json({ message: 'Nada para actualizar o pedido no existe' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar pedido', error: error.message });
  }
};

const deletePedido = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'id inválido' });
  try {
    const ok = await pedidoModel.deletePedido(id);
    if (!ok) return res.status(404).json({ message: 'Pedido no existe' });
    res.json({ ok: true, deleted_id: id });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar pedido', error: error.message });
  }
};

module.exports = { getPedidos, createPedido, putPedido, deletePedido };
