const model = require('../models/detalleBebidas.model');

exports.list = async (_req, res) => {
  const rows = await model.list();
  res.json(rows);
};

exports.create = async (req, res) => {
  try {
    const { pedido_id, bebida_id, cantidad } = req.body;
    if (!pedido_id || !bebida_id) {
      return res.status(400).json({ message: 'pedido_id y bebida_id son obligatorios' });
    }
    const row = await model.create({ pedido_id: Number(pedido_id), bebida_id: Number(bebida_id), cantidad: Number(cantidad || 1) });
    res.status(201).json(row);
  } catch (e) {
    console.error('detalle-bebidas create error:', e);
    res.status(500).json({ message: 'No se pudo crear detalle_bebida', error: e.message });
  }
};

exports.remove = async (req, res) => {
  const ok = await model.remove(Number(req.params.id));
  res.json({ ok });
};
