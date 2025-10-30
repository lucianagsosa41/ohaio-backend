const detallePedidosModel = require('../models/detallePedidos.model');

const createDetallePedido = async (req, res) => {
  try {
    const { pedido_id, hamburguesa_id, cantidad } = req.body;
    if (pedido_id == null || hamburguesa_id == null || cantidad == null) {
      return res.status(400).json({ message: 'pedido_id, hamburguesa_id y cantidad son requeridos' });
    }
    const nuevoDetalle = await detallePedidosModel.createDetallePedido({ pedido_id, hamburguesa_id, cantidad });
    res.status(201).json(nuevoDetalle);
  } catch (error) {
    res.status(400).json({ message: 'Error creando detalle pedido', error: error.message });
  }
};

const getDetalleByPedidoId = async (req, res) => {
  try {
    const pedido_id = parseInt(req.params.pedidoId, 10);
    const detalles = await detallePedidosModel.getDetalleByPedidoId(pedido_id);
    res.json(detalles);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo detalles', error: error.message });
  }
};

module.exports = { createDetallePedido, getDetalleByPedidoId };
