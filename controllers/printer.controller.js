// controllers/printer.controller.js
const { printOrder, printerHealth } = require('../services/printer');
const pedidoModel = require('../models/pedido.model');

// POST /api/pedidos/:id/print
async function printById(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ ok: false, error: 'id inválido' });
  }

  try {
    const pedido = await pedidoModel.getPedidoForPrint(id);
    if (!pedido) return res.status(404).json({ ok: false, error: 'Pedido no existe' });

    // si te mandan notas en el body, las sobrescribís (opcional)
    if (req.body?.notas) pedido.notas = String(req.body.notas);

    await printOrder(pedido);
    return res.status(201).json({ ok: true, printed: true, id: pedido.id, cliente: pedido.cliente });
  } catch (err) {
    console.error('printById error:', err);
    return res.status(500).json({ ok: false, error: err.message || String(err) });
  }
}

// GET /api/printer/health
async function health(_req, res) {
  const h = await printerHealth();
  return res.json(h);
}

module.exports = { printById, health };
